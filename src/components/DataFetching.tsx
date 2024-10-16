// src/components/DataFetching.tsx

import React, { lazy, Suspense, useCallback } from "react";
import { useDataFetching } from "../hooks/useDataFetching";
import { BentoGrid } from "@/components/magicui/bento-grid";
import NominationsCard from "@/components/NominationsCard";
import VotesCard from "@/components/VotesCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import AutosubscribersCard from "@/components/AutosubscribersCard";
import { Button } from "@/components/ui/button";
import "@/components/AllWinnersCard";

const AllWinnersCard = lazy(() => import("@/components/AllWinnersCard"));

const DataFetching: React.FC = () => {
  const {
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
    refreshData,
  } = useDataFetching();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleRefreshClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    refreshData({ forceRefreshAll: true });
  };

  const handleWinnersRefresh = useCallback(
    () => refreshData({ forceRefreshWinners: true }),
    [refreshData]
  );

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
        <Suspense fallback={<div>Loading...</div>}>
          <AllWinnersCard
            winners={winners}
            progress={winnersProgress}
            onRefresh={handleWinnersRefresh}
          />
        </Suspense>
      </BentoGrid>
      <Button onClick={handleRefreshClick} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh Data"}
      </Button>
    </ErrorBoundary>
  );
};

export default DataFetching;
