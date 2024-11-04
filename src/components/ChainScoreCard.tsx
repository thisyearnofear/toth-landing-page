import React from "react";
import ScoreCard from "./ScoreCard";
import { formatLargeNumber } from "../utils/formatNumbers";
import { chainIcons, chainColors } from "./ChainIcons";

interface ChainScoreProps {
  chain: keyof typeof chainIcons;
  tokens: Array<{ symbol: string; value: string }>;
  score: number;
}

const chainLabels = {
  eth: "Ethereum",
  base: "Base",
  zksync: "zkSync",
  scroll: "Scroll",
  linea: "Linea",
} as const;

const ChainScoreCard: React.FC<ChainScoreProps> = ({
  chain,
  tokens,
  score,
}) => {
  const Icon = chainIcons[chain];
  const description = `${tokens.length} tokens found on ${chainLabels[chain]}`;

  const tokenDetails = tokens.map((token) => ({
    symbol: token.symbol,
    value: formatLargeNumber(token.value),
  }));

  return (
    <ScoreCard
      icon={<Icon className={`w-6 h-6 ${chainColors[chain]}`} />}
      label={chainLabels[chain]}
      score={score}
      description={description}
      tokenList={tokenDetails}
    />
  );
};

export default ChainScoreCard;
