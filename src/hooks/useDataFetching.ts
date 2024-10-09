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
        setProgress: (progress: number) => void
      ) => {
        const shouldFetch =
          options.forceRefreshAll ||
          options[
            `forceRefresh${
              key.charAt(0).toUpperCase() + key.slice(1)
            }` as keyof FetchOptions
          ];
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
        const nominations = await fetchAndCacheData<Nomination[]>(
          "nominations",
          async () => {
            const response = await fetch("/api/fetchNominations");
            const data = await response.json();
            console.log("Nominations data fetched:", data);
            // Process nominations data as before
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

            const processedNominations = await Promise.all(
              recentNominations.map(async (nom: any) => {
                const userResponse = await fetch(
                  `/api/fetchUserInfo?fid=${nom.fid}`
                );
                const userData = await userResponse.json();

                if (!userData.username) {
                  console.warn("User data missing username for fid:", nom.fid);
                  return null;
                }

                return {
                  id: nom.id,
                  nominator: userData.username,
                  nominee: nom.username,
                  round: nom.roundNumber,
                  date: new Date(nom.createdAt).toLocaleDateString(),
                  nominatorPfp: userData.pfp_url,
                };
              })
            );

            return processedNominations.filter(
              (nom): nom is Nomination => nom !== null
            );
          },
          getCachedNominations,
          setCachedNominations,
          setNominationsProgress
        );
        setNominations(nominations);

        const votes = await fetchAndCacheData<Vote[]>(
          "votes",
          async () => {
            const response = await fetch("/api/fetchVotes");
            const data = await response.json();
            console.log("Votes data fetched:", data);
            // Process votes data as before
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

            const processedVotes = await Promise.all(
              allVotes.map(async (vote: any) => {
                const userResponse = await fetch(
                  `/api/fetchUserInfo?fid=${vote.fid}`
                );
                const userData = await userResponse.json();

                if (!userData.username) {
                  console.warn("User data missing username for fid:", vote.fid);
                  return null;
                }

                return {
                  voter: userData.username,
                  nominationId: vote.nominationId,
                  round: vote.roundNumber,
                  date: new Date(vote.createdAt).toLocaleDateString(),
                  voterPfp: userData.pfp_url,
                };
              })
            );

            return processedVotes.filter((vote): vote is Vote => vote !== null);
          },
          getCachedVotes,
          setCachedVotes,
          setVotesProgress
        );
        setVotes(votes);

        const autosubscribers = await fetchAndCacheData<Autosubscriber[]>(
          "autosubscribers",
          async () => {
            const response = await fetch("/api/fetchAutosubscribers");
            const data = await response.json();
            console.log("Autosubscribers data fetched:", data);
            // Process autosubscribers data as before
            const processedAutosubscribers = await Promise.all(
              data
                .filter(
                  (sub: any) =>
                    sub.tips?.allowance && parseInt(sub.tips.allowance) > 0
                )
                .map(async (sub: any) => {
                  const userResponse = await fetch(
                    `/api/fetchUserInfo?fid=${sub.fid}`
                  );
                  const userData = await userResponse.json();

                  return {
                    name: userData.username,
                    allowance: sub.tips.allowance,
                    icon: "💎",
                    color: "#FFD700",
                  };
                })
            );

            return processedAutosubscribers.filter(
              (sub): sub is Autosubscriber => sub !== null
            );
          },
          getCachedAutosubscribers,
          setCachedAutosubscribers,
          setAutosubscribersProgress
        );
        setAutosubscribers(autosubscribers);

        const winners = await fetchAndCacheData<Winner[]>(
          "winners",
          async () => {
            const response = await fetch("/api/fetchWinners");
            const data = await response.json();
            console.log("Winners data fetched:", data);
            // Process winners data
            return data.map((winner: any) => ({
              roundNumber: winner.roundNumber,
              username: winner.winner?.cast?.author?.username || "Unknown User",
              date: winner.winner?.cast?.timestamp
                ? new Date(winner.winner.cast.timestamp).toLocaleDateString()
                : `Round ${winner.roundNumber}`,
              fid: winner.winner?.cast?.author?.fid,
              rootParentUrl: winner.winner?.cast?.root_parent_url || null,
              text:
                winner.winner?.cast?.text ||
                winner.winner?.cast?.author?.profile?.bio?.text ||
                "No text available",
            }));
          },
          getCachedWinners,
          setCachedWinners,
          setWinnersProgress
        );
        setWinners(winners);

        const combined = combineVotesWithNominations(votes, nominations);
        setCombinedVotes(combined);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "An error occurred while fetching data. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [combineVotesWithNominations]
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
