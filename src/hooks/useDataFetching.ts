import { useState, useEffect, useCallback, useMemo } from "react";
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

  const fetchData = useCallback(
    async (options: FetchOptions = {}) => {
      console.log("Fetching data with options:", options);
      setIsLoading(true);
      setError(null);

      const fetchAndCacheData = async <T>(
        key: string,
        fetchFunc: (setProgress: (progress: number) => void) => Promise<T>,
        getCachedData: () => T | null,
        setCachedData: (data: T) => void,
        setProgress: (progress: number) => void,
        forceRefresh: boolean
      ) => {
        const shouldFetch =
          options.forceRefreshAll || forceRefresh || isInitialLoad;
        const cachedData = getCachedData();

        if (cachedData && !shouldFetch) {
          console.log(`Using cached data for ${key}`);
          return cachedData;
        }

        setProgress(10);
        console.log(`Fetching fresh data for ${key}`);
        const data = await fetchFunc(setProgress);
        setProgress(100);
        setCachedData(data);
        console.log(`Fetched and cached data for ${key}:`, data);
        return data;
      };

      try {
        const [nominationsData, votesData, autosubscribersData, winnersData] =
          await Promise.all([
            fetchAndCacheData<Nomination[]>(
              "nominations",
              async (setProgress) => {
                const response = await fetch("/api/fetchNominations");
                const data = await response.json();
                setProgress(50);
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

                const recentNominations = allNominations.slice(0, 20);
                const fids = recentNominations.map((nom: any) => nom.fid);
                const userInfoMap = await fetchBulkUserInfo(fids);
                setProgress(90);

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
            ),
            fetchAndCacheData<Vote[]>(
              "votes",
              async (setProgress) => {
                const response = await fetch("/api/fetchVotes");
                const data = await response.json();
                setProgress(50);
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

                const fids = allVotes.map((vote: any) => vote.fid);
                const userInfoMap = await fetchBulkUserInfo(fids);
                setProgress(90);

                return allVotes
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
                  .filter(
                    (vote): vote is Vote => vote.voter !== "Unknown User"
                  );
              },
              getCachedVotes,
              setCachedVotes,
              setVotesProgress,
              options.forceRefreshVotes || false
            ),
            fetchAndCacheData<Autosubscriber[]>(
              "autosubscribers",
              async (setProgress) => {
                const response = await fetch("/api/fetchAutosubscribers");
                const data = await response.json();
                setProgress(50);
                const validSubscribers = data.filter(
                  (sub: any) =>
                    sub.tips?.allowance && parseInt(sub.tips.allowance) > 0
                );
                const fids = validSubscribers.map((sub: any) => sub.fid);
                const userInfoMap = await fetchBulkUserInfo(fids);
                setProgress(90);

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
            ),
            fetchAndCacheData<Winner[]>(
              "winners",
              async (setProgress) => {
                const response = await fetch("/api/fetchWinners");
                const data = await response.json();
                setProgress(50);
                const validWinners = data.filter(
                  (winner: any) =>
                    winner.winner && winner.winner.fid && winner.winner.date
                );
                const fids = validWinners
                  .map((winner: any) => winner.winner.fid)
                  .filter(Boolean);
                const userInfoMap = await fetchBulkUserInfo(fids);
                setProgress(90);

                return validWinners
                  .map((winner: any) => {
                    const userData = userInfoMap[winner.winner.fid];
                    return {
                      roundNumber: winner.roundNumber,
                      date: new Date(winner.winner.date).toLocaleDateString(),
                      username:
                        userData?.username || `User ${winner.winner.fid}`,
                      fid: winner.winner.fid,
                      text: winner.winner.text || "No text available",
                    };
                  })
                  .filter(
                    (winner: Winner) =>
                      winner.username !== "undefined" &&
                      winner.date !== "Invalid Date"
                  )
                  .reverse();
              },
              getCachedWinners,
              setCachedWinners,
              setWinnersProgress,
              options.forceRefreshWinners || false
            ),
          ]);

        setNominations(nominationsData);
        setVotes(votesData);
        setAutosubscribers(autosubscribersData);
        setWinners(winnersData);

        const combined = combineVotesWithNominations(
          votesData,
          nominationsData
        );
        setCombinedVotes(combined);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "An error occurred while fetching data. Please try again later."
        );
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    },
    [combineVotesWithNominations, isInitialLoad]
  );

  const debouncedRefreshData = useCallback(
    debounce((options) => {
      // Your refresh logic here
    }, 300),
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchMoreData = useCallback(() => {
    if (hasMore) {
      // Fetch next page of data
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  return {
    nominations,
    combinedVotes,
    autosubscribers,
    winners,
    nominationsProgress,
    votesProgress,
    autosubscribersProgress,
    winnersProgress,
    error,
    isLoading,
    refreshData: (options: FetchOptions = { forceRefreshAll: true }) =>
      fetchData(options),
    invalidateCache,
    invalidateAllCache,
    debouncedRefreshData,
    fetchMoreData,
    page,
    hasMore,
  };
};
