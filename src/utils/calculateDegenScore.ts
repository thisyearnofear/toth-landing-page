// src/utils/calculateDegenScore.ts

import { Nomination } from "../types";
import { mockScoreData } from "@/data/mockData";

export const calculateDegenScore = (stats: {
  nominations: Nomination[];
}): {
  total: number;
  kindness: number;
  recognition: number;
  governance: number;
  value: number;
} => {
  const last25Days = 25 * 24 * 60 * 60 * 1000; // 25 days in milliseconds
  const now = Date.now();

  const recentNominations = stats.nominations.filter(
    (nom) => now - new Date(nom.date).getTime() < last25Days
  ).length;

  const kindness = Math.min(recentNominations, 25);

  // Use mock data for other scores
  const recognition = mockScoreData.recognition[0].value;
  const governance = mockScoreData.governance[0].value;
  const value = mockScoreData.value[0].value;

  const total = kindness + recognition + governance + value;

  return { total, kindness, recognition, governance, value };
};
