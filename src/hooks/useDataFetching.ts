import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Nomination,
  CombinedVote,
  Vote,
  Autosubscriber,
  Winner,
} from "../types";
import {
  getCachedNominations,
  setCachedNominations,
  getCachedVotes,
  setCachedVotes,
  getCachedAutosubscribers,
  setCachedAutosubscribers,
  getCachedWinners,
  setCachedWinners,
  invalidateCache,
  invalidateAllCache,
} from "../utils/cache";
import { debounce } from "../utils/debounce";

// Add this type definition at the top of the file, after the imports
type FetchFunction<T> = () => Promise<T>;

interface FetchOptions {
  forceRefreshAll?: boolean;
  forceRefreshNominations?: boolean;
  forceRefreshVotes?: boolean;
  forceRefreshAutosubscribers?: boolean;
  forceRefreshWinners?: boolean;
}

export const useDataFetching = () => {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [combinedVotes, setCombinedVotes] = useState<CombinedVote[]>([]);
  const [autosubscribers, setAutosubscribers] = useState<Autosubscriber[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [nominationsProgress, setNominationsProgress] = useState(0);
  const [votesProgress, setVotesProgress] = useState(0);
  const [autosubscribersProgress, setAutosubscribersProgress] = useState(0);
  const [winnersProgress, setWinnersProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBulkUserInfo = async (fids: string[]) => {
    if (fids.length === 0) return {};
    try {
      const response = await fetch(
        `/api/fetchBulkUserInfo?fids=${fids.join(",")}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching bulk user info:", error);
      return {};
    }
  };

  const combineVotesWithNominations = useCallback(
    (votes: Vote[], nominations: Nomination[]): CombinedVote[] => {
      return votes
        .map((vote) => {
          const nomination = nominations.find(
            (nom) => nom.id === vote.nominationId
          );
          return nomination ? { vote, nomination } : null;
        })
        .filter((combined): combined is CombinedVote => combined !== null);
    },
    []
  );

  const filterLast30Days = useCallback((data: any[], dateField: string) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return data.filter((item) => new Date(item[dateField]) >= thirtyDaysAgo);
  }, []);

  const fetchAndCacheData = async <T>(
    key: string,
    fetchFunc: FetchFunction<T>,
    getCachedData: () => T | null,
    setCachedData: (data: T) => void,
    setProgress: (progress: number) => void,
    forceRefresh: boolean
  ): Promise<T> => {
    const shouldFetch = forceRefresh || isInitialLoad;
    const cachedData = getCachedData();

    if (cachedData && !shouldFetch) {
      console.log(`Using cached data for ${key}`);
      return cachedData;
    }

    setProgress(10);
    console.log(`Fetching fresh data for ${key}`);
    try {
      const data = await fetchFunc();
      setProgress(100);
      setCachedData(data);
      console.log(`Fetched and cached data for ${key}:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
      setProgress(0);
      // If there's an error, return the cached data if available, otherwise return an empty array
      return cachedData || ([] as unknown as T);
    }
  };

  const fetchData = useCallback(
    async (options: FetchOptions = {}) => {
      console.log("Fetching data with options:", options);
      setIsLoading(true);
      setError(null);

      try {
        // Fetch each data type independently
        if (options.forceRefreshAll || options.forceRefreshNominations) {
          const nominationsData = await fetchAndCacheData<Nomination[]>(
            "nominations",
            async () => {
              const response = await fetch("/api/fetchNominations");
              const data = await response.json();
              const allNominations = data
                .flatMap((round: any) =>
                  round.nominations.map((nom: any) => ({
                    ...nom,
                    roundNumber: round.roundNumber,
                  }))
                )
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );

              const filteredNominations = filterLast30Days(
                allNominations,
                "createdAt"
              );
              const recentNominations = filteredNominations.slice(0, 20);

              const fids = recentNominations.map((nom: any) => nom.fid);
              const userInfoMap = await fetchBulkUserInfo(fids);

              return recentNominations
                .map((nom: any) => {
                  const userData = userInfoMap[nom.fid];
                  return {
                    id: nom.id,
                    nominator: userData?.username || "Unknown User",
                    nominee: nom.username,
                    round: nom.roundNumber,
                    date: new Date(nom.createdAt).toLocaleDateString(),
                    nominatorPfp: userData?.pfp_url,
                    nominatorFid: nom.fid,
                  };
                })
                .filter(
                  (nom): nom is Nomination => nom.nominator !== "Unknown User"
                );
            },
            getCachedNominations,
            setCachedNominations,
            setNominationsProgress,
            options.forceRefreshNominations || false
          );
          setNominations(nominationsData);
        }

        if (options.forceRefreshAll || options.forceRefreshVotes) {
          const votesData = await fetchAndCacheData<Vote[]>(
            "votes",
            async () => {
              const response = await fetch("/api/fetchVotes");
              const data = await response.json();
              const allVotes = data
                .flatMap((round: any) =>
                  round.votes.map((vote: any) => ({
                    ...vote,
                    roundNumber: round.roundNumber,
                  }))
                )
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );

              const filteredVotes = filterLast30Days(allVotes, "createdAt");

              const fids = filteredVotes.map((vote: any) => vote.fid);
              const userInfoMap = await fetchBulkUserInfo(fids);

              return filteredVotes
                .map((vote: any) => {
                  const userData = userInfoMap[vote.fid];
                  return {
                    voter: userData?.username || "Unknown User",
                    nominationId: vote.nominationId,
                    round: vote.roundNumber,
                    date: new Date(vote.createdAt).toLocaleDateString(),
                    voterPfp: userData?.pfp_url,
                  };
                })
                .filter((vote): vote is Vote => vote.voter !== "Unknown User");
            },
            getCachedVotes,
            setCachedVotes,
            setVotesProgress,
            options.forceRefreshVotes || false
          );
          setVotes(votesData);
          const combined = combineVotesWithNominations(votesData, nominations);
          setCombinedVotes(combined);
        }

        if (options.forceRefreshAll || options.forceRefreshAutosubscribers) {
          const autosubscribersData = await fetchAndCacheData<Autosubscriber[]>(
            "autosubscribers",
            async () => {
              const response = await fetch("/api/fetchAutosubscribers");
              const data = await response.json();
              const validSubscribers = data.filter(
                (sub: any) =>
                  sub.tips?.allowance && parseInt(sub.tips.allowance) > 0
              );
              const fids = validSubscribers.map((sub: any) => sub.fid);
              const userInfoMap = await fetchBulkUserInfo(fids);

              return validSubscribers
                .map((sub: any) => {
                  const userData = userInfoMap[sub.fid];
                  return {
                    name: userData?.username || "Unknown User",
                    allowance: sub.tips.allowance,
                    icon: "💎",
                    color: "#FFD700",
                  };
                })
                .filter(
                  (sub): sub is Autosubscriber => sub.name !== "Unknown User"
                );
            },
            getCachedAutosubscribers,
            setCachedAutosubscribers,
            setAutosubscribersProgress,
            options.forceRefreshAutosubscribers || false
          );
          setAutosubscribers(autosubscribersData);
        }

        if (options.forceRefreshAll || options.forceRefreshWinners) {
          const winnersData = await fetchAndCacheData<Winner[]>(
            "winners",
            async () => {
              const response = await fetch("/api/fetchWinners");
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              if (!Array.isArray(data)) {
                console.error("Unexpected data format for winners:", data);
                return [];
              }

              return data
                .filter((item) => item && item.winner)
                .map((item) => ({
                  roundNumber: item.roundNumber,
                  date: new Date(item.winner.date).toLocaleDateString(),
                  username: item.winner.username || `User ${item.winner.fid}`,
                  fid: item.winner.fid,
                  text: item.winner.text || "No text available",
                }))
                .filter(
                  (winner) => winner.username && winner.date !== "Invalid Date"
                )
                .reverse();
            },
            getCachedWinners,
            setCachedWinners,
            setWinnersProgress,
            options.forceRefreshWinners || false
          );
          setWinners(winnersData);
        }

        setLastFetchTime(new Date());
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "An error occurred while fetching some data. Some information may be outdated or missing."
        );
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    },
    [combineVotesWithNominations, isInitialLoad, nominations]
  );

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 300),
    [fetchData]
  );

  const refreshData = useCallback(
    (options: FetchOptions = {}) => {
      debouncedFetchData(options);
    },
    [debouncedFetchData]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchData();
    };

    fetchInitialData();

    // Set up periodic checks for new data
    const checkForNewData = async () => {
      const now = new Date();
      const hoursSinceLastFetch =
        (now.getTime() - lastFetchTime.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastFetch >= 4) {
        await refreshData({
          forceRefreshNominations: true,
          forceRefreshVotes: true,
        });
      }

      if (now.getHours() === 0 && now.getMinutes() < 15) {
        // It's between midnight and 00:15, refresh winners and autosubscribers
        await refreshData({
          forceRefreshWinners: true,
          forceRefreshAutosubscribers: true,
        });
      }
    };

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    intervalIdRef.current = setInterval(checkForNewData, 15 * 60 * 1000); // Check every 15 minutes

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [fetchData, refreshData]);

  const fetchMoreData = useCallback(() => {
    if (hasMore) {
      // Fetch next page of data
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  const memoizedData = useMemo(
    () => ({
      nominations,
      combinedVotes,
      autosubscribers,
      winners,
    }),
    [nominations, combinedVotes, autosubscribers, winners]
  );

  const memoizedProgress = useMemo(
    () => ({
      nominationsProgress,
      votesProgress,
      autosubscribersProgress,
      winnersProgress,
    }),
    [
      nominationsProgress,
      votesProgress,
      autosubscribersProgress,
      winnersProgress,
    ]
  );

  return {
    ...memoizedData,
    ...memoizedProgress,
    error,
    isLoading,
    refreshData,
    invalidateCache,
    invalidateAllCache,
    lastFetchTime,
  };
};
