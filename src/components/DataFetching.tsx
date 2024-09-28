"use client";

import React from "react";
import { useDataFetching } from "../hooks/useDataFetching";
import { BentoGrid } from "@/components/magicui/bento-grid";
import NominationsCard from "@/components/NominationsCard";
import VotesCard from "@/components/VotesCard";
import AutosubscribersCard from "@/components/AutosubscribersCard";
import AllWinnersCard from "@/components/AllWinnersCard";
import { autosubscribers, winners } from "@/data/staticData";

const DataFetching = () => {
  const {
    nominations,
    combinedVotes,
    nominationsProgress,
    votesProgress,
    error,
  } = useDataFetching();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <BentoGrid className="max-w-6xl mx-auto mb-12">
      <NominationsCard
        nominations={nominations}
        progress={nominationsProgress}
      />
      <VotesCard votes={combinedVotes} progress={votesProgress} />
      <AutosubscribersCard subscribers={autosubscribers} />
      <AllWinnersCard winners={winners} />
    </BentoGrid>
  );
};

export default DataFetching;
