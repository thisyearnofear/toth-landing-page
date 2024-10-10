// src/hooks/useDataFetching.ts

import { useState, useEffect, useCallback } from "react";
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

  const fetchBulkUserInfo = async (fids: string[]) => {
    const response = await fetch(
      `/api/fetchBulkUserInfo?fids=${fids.join(",")}`
    );
    return await response.json();
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
        fetchFunc: () => Promise<T>,
        getCachedData: () => T | null,
        setCachedData: (data: T) => void,
        setProgress: (progress: number) => void,
        forceRefresh: boolean
      ) => {
        const shouldFetch =
          options.forceRefreshAll || forceRefresh || isInitialLoad;
        const cachedData = getCachedData();

        console.log(`Cached data for ${key}:`, cachedData);
        if (cachedData && !shouldFetch) {
          console.log(`Using cached data for ${key}`);
          return cachedData;
        }

        setProgress(10);
        console.log(`Fetching fresh data for ${key}`);
        const data = await fetchFunc();
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
              async () => {
                const response = await fetch("/api/fetchNominations");
                const data = await response.json();
                console.log("Nominations data fetched:", data);

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
              async () => {
                const response = await fetch("/api/fetchVotes");
                const data = await response.json();
                console.log("Votes data fetched:", data);

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
              async () => {
                const response = await fetch("/api/fetchAutosubscribers");
                const data = await response.json();
                console.log("Autosubscribers data fetched:", data);

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
            ),
            fetchAndCacheData<Winner[]>(
              "winners",
              async () => {
                const response = await fetch("/api/fetchWinners");
                const data = await response.json();
                console.log("Winners data fetched:", data);

                const fids = data
                  .map((winner: any) => winner.winner?.cast?.author?.fid)
                  .filter(Boolean);
                const userInfoMap = await fetchBulkUserInfo(fids);

                return data.map((winner: any) => {
                  const fid = winner.winner?.cast?.author?.fid;
                  const userData = fid ? userInfoMap[fid] : null;
                  return {
                    roundNumber: winner.roundNumber,
                    username: userData?.username || "Unknown User",
                    date: winner.winner?.cast?.timestamp
                      ? new Date(
                          winner.winner.cast.timestamp
                        ).toLocaleDateString()
                      : `Round ${winner.roundNumber}`,
                    fid: fid,
                    rootParentUrl: winner.winner?.cast?.root_parent_url || null,
                    text:
                      winner.winner?.cast?.text ||
                      userData?.profile?.bio?.text ||
                      "No text available",
                  };
                });
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  };
};
