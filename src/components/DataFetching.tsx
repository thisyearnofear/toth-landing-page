import React from "react";
import { useDataFetching } from "../hooks/useDataFetching";
import { BentoGrid } from "@/components/magicui/bento-grid";
import NominationsCard from "@/components/NominationsCard";
import VotesCard from "@/components/VotesCard";
import AllWinnersCard from "@/components/AllWinnersCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import AutosubscribersCard from "@/components/AutosubscribersCard";
import { Button } from "@/components/ui/button";

const DataFetching: React.FC = () => {
  const {
    nominations,
    combinedVotes,
    autosubscribers,
    nominationsProgress,
    votesProgress,
    autosubscribersProgress,
    error,
    isLoading,
    refreshData,
  } = useDataFetching();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleRefreshClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    refreshData();
  };

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again later.</div>}
    >
      <div className="max-w-6xl mx-auto mb-4"></div>
      <BentoGrid className="max-w-6xl mx-auto mb-12">
        <NominationsCard
          nominations={nominations}
          progress={nominationsProgress}
        />
        <VotesCard votes={combinedVotes} progress={votesProgress} />
        <AutosubscribersCard
          subscribers={autosubscribers}
          progress={autosubscribersProgress}
        />
        <AllWinnersCard />
      </BentoGrid>
      <Button onClick={handleRefreshClick} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh Data"}
      </Button>
    </ErrorBoundary>
  );
};

export default DataFetching;
