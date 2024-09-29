"use client";

import { useState, useEffect } from "react";
import { Nomination, CombinedVote, Vote } from "../types";

export const useDataFetching = () => {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [combinedVotes, setCombinedVotes] = useState<CombinedVote[]>([]);
  const [nominationsProgress, setNominationsProgress] = useState(0);
  const [votesProgress, setVotesProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch nominations
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
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
        setNominationsProgress(100);

        // Fetch votes
        setVotesProgress(10);
        const votesResponse = await fetch("/api/fetchVotes");
        setVotesProgress(30);
        const votesData = await votesResponse.json();
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
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

        // Combine votes with nominations
        setVotesProgress(80);
        const combined = validVotes
          .map((vote) => {
            const nomination = validNominations.find(
              (nom) => nom.id === vote.nominationId
            );
            return { vote, nomination: nomination! };
          })
          .filter((combined) => combined.nomination !== undefined);

        setCombinedVotes(combined);
        setVotesProgress(100);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "An error occurred while fetching data. Please try again later."
        );
        setNominationsProgress(100);
        setVotesProgress(100);
      }
    }

    fetchData();
  }, []);

  return {
    nominations,
    combinedVotes,
    nominationsProgress,
    votesProgress,
    error,
  };
};
