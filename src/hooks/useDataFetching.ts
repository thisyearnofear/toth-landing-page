// src/hooks/useDataFetching.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { Nomination, CombinedVote, Vote, Autosubscriber } from "../types";
import {
  getCachedNominations,
  setCachedNominations,
  getCachedVotes,
  setCachedVotes,
  getCachedAutosubscribers,
  setCachedAutosubscribers,
} from "../utils/cache";

export const useDataFetching = () => {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [combinedVotes, setCombinedVotes] = useState<CombinedVote[]>([]);
  const [autosubscribers, setAutosubscribers] = useState<Autosubscriber[]>([]);
  const [nominationsProgress, setNominationsProgress] = useState(0);
  const [votesProgress, setVotesProgress] = useState(0);
  const [autosubscribersProgress, setAutosubscribersProgress] = useState(0);
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
    async (forceRefresh = false) => {
      setIsLoading(true);
      try {
        // Fetch nominations
        const cachedNominations = getCachedNominations();
        if (!cachedNominations || forceRefresh) {
          setNominationsProgress(10);
          const nominationsResponse = await fetch("/api/fetchNominations");
          setNominationsProgress(30);
          const nominationsData = await nominationsResponse.json();
          setNominationsProgress(50);

          if (!Array.isArray(nominationsData)) {
            throw new Error("nominationsData is not an array");
          }

          const allNominations = nominationsData
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

          const formattedNominations = await Promise.all(
            recentNominations.map(async (nom: any) => {
              const userResponse = await fetch(
                `/api/fetchUserInfo?fid=${nom.fid}`
              );
              if (!userResponse.ok) {
                throw new Error(
                  `Error fetching user data: ${userResponse.statusText}`
                );
              }
              const userData = await userResponse.json();
              if (!userData.username) {
                console.error(
                  "User data is missing 'username' property:",
                  userData
                );
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

          setNominationsProgress(80);
          const validNominations = formattedNominations.filter(
            (nom): nom is Nomination => nom !== null
          );
          setNominations(validNominations);
          setCachedNominations(validNominations);
        } else {
          setNominations(cachedNominations);
        }
        setNominationsProgress(100);

        // Fetch votes
        const cachedVotes = getCachedVotes();
        console.log("Cached votes:", cachedVotes);
        if (!cachedVotes || forceRefresh) {
          setVotesProgress(10);
          const votesResponse = await fetch("/api/fetchVotes");
          setVotesProgress(30);
          const votesData = await votesResponse.json();
          console.log("Fetched votes data:", votesData);
          setVotesProgress(50);

          if (!Array.isArray(votesData)) {
            throw new Error("votesData is not an array");
          }

          const allVotes = votesData
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

          const formattedVotes = await Promise.all(
            allVotes.map(async (vote: any) => {
              const userResponse = await fetch(
                `/api/fetchUserInfo?fid=${vote.fid}`
              );
              if (!userResponse.ok) {
                throw new Error(
                  `Error fetching user data: ${userResponse.statusText}`
                );
              }
              const userData = await userResponse.json();
              if (!userData.username) {
                console.error(
                  "User data is missing 'username' property:",
                  userData
                );
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

          const validVotes = formattedVotes.filter(
            (vote): vote is Vote => vote !== null
          );
          console.log("Formatted votes:", validVotes);
          setVotes(validVotes);
          setCachedVotes(validVotes);
        } else {
          setVotes(cachedVotes);
        }
        setVotesProgress(100);

        // Combine votes with nominations
        console.log("Votes before combining:", votes);
        console.log("Nominations before combining:", nominations);
        const combined = combineVotesWithNominations(votes, nominations);
        console.log("Combined votes:", combined);
        setCombinedVotes(combined);

        // Fetch autosubscribers
        const cachedAutosubscribers = getCachedAutosubscribers();
        if (!cachedAutosubscribers || forceRefresh) {
          setAutosubscribersProgress(10);
          const autosubscribersResponse = await fetch("/api/fetchWinners");
          setAutosubscribersProgress(30);
          const autosubscribersData = await autosubscribersResponse.json();
          setAutosubscribersProgress(50);

          if (!Array.isArray(autosubscribersData)) {
            throw new Error("autosubscribersData is not an array");
          }

          const formattedAutosubscribers = await Promise.all(
            autosubscribersData
              .filter((sub: any) => parseInt(sub.tips.allowance) > 0)
              .map(async (sub: any) => {
                const userResponse = await fetch(
                  `/api/fetchUserInfo?fid=${sub.fid}`
                );
                if (!userResponse.ok) {
                  throw new Error(
                    `Error fetching user data: ${userResponse.statusText}`
                  );
                }
                const userData = await userResponse.json();
                if (!userData.username) {
                  console.error(
                    "User data is missing 'username' property:",
                    userData
                  );
                  return null;
                }
                return {
                  name: userData.username,
                  allowance: sub.tips.allowance,
                  icon: "💎",
                  color: "#FFD700",
                };
              })
          );

          setAutosubscribersProgress(80);
          const validAutosubscribers = formattedAutosubscribers.filter(
            (sub): sub is Autosubscriber => sub !== null
          );
          setAutosubscribers(validAutosubscribers);
          setCachedAutosubscribers(validAutosubscribers);
        } else {
          setAutosubscribers(cachedAutosubscribers);
        }
        setAutosubscribersProgress(100);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "An error occurred while fetching data. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [combineVotesWithNominations, votes, nominations]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    nominations,
    combinedVotes,
    autosubscribers,
    nominationsProgress,
    votesProgress,
    autosubscribersProgress,
    error,
    isLoading,
    refreshData: () => fetchData(true),
  };
};
