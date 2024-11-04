import { MemeToken } from "../types";

export interface DegenScoreResult {
  total: number;
  breakdown: { [chain: string]: number };
  details: {
    totalTokens: number;
    chainBreakdown: {
      [chain: string]: {
        tokens: number;
        score: number;
        tokenList: Array<{ symbol: string; value: string }>;
      };
    };
  };
}

export const calculateDegenScore = (tokens: MemeToken[]): DegenScoreResult => {
  const chainScores: { [chain: string]: number } = {};
  const chainDetails: {
    [chain: string]: {
      tokens: number;
      score: number;
      tokenList: Array<{ symbol: string; value: string }>;
    };
  } = {};

  const chains = ["eth", "base", "zksync", "scroll", "linea"];

  // Each chain can contribute max 20 points to the total score
  const MAX_CHAIN_SCORE = 20;

  chains.forEach((chain) => {
    const chainTokens = tokens.filter((token) => token.chain === chain);
    // Calculate score based on number of tokens, max 20 per chain
    const score = Math.min(chainTokens.length * 5, MAX_CHAIN_SCORE);

    chainScores[chain] = score;
    chainDetails[chain] = {
      tokens: chainTokens.length,
      score,
      tokenList: chainTokens.map((token) => ({
        symbol: token.symbol,
        value: token.balance || "0",
      })),
    };
  });

  // Total score is sum of all chain scores (max 100)
  const total = Object.values(chainScores).reduce(
    (sum, score) => sum + score,
    0
  );

  return {
    total,
    breakdown: chainScores,
    details: {
      totalTokens: tokens.length,
      chainBreakdown: chainDetails,
    },
  };
};
