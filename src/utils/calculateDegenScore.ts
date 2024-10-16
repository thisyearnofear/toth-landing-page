import { UserStats } from "../types";

export const calculateDegenScore = (
  stats: UserStats
): {
  total: number;
  kindness: number;
  recognition: number;
  governance: number;
  value: number;
} => {
  const last25Days = 25 * 24 * 60 * 60 * 1000; // 25 days in milliseconds
  const now = Date.now();

  const recentVotes = stats.votes.filter(
    (vote) => now - new Date(vote.date).getTime() < last25Days
  ).length;
  const recentNominations = stats.nominations.filter(
    (nom) => now - new Date(nom.date).getTime() < last25Days
  ).length;

  const kindness = Math.min(recentNominations, 25);
  const governance = Math.min(recentVotes, 25);
  const recognition = stats.nominations.length > 0 ? 25 : 0;
  const value = stats.isAutosubscriber ? 25 : 0;

  const total = kindness + governance + recognition + value;

  return { total, kindness, governance, recognition, value };
};
