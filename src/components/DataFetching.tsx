import React, { lazy, Suspense, useCallback, useMemo } from "react";
import { useDataFetching } from "../hooks/useDataFetching";
import { BentoGrid } from "@/components/magicui/bento-grid";
import NominationsCard from "@/components/NominationsCard";
import VotesCard from "@/components/VotesCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import AutosubscribersCard from "@/components/AutosubscribersCard";
import { Button } from "@/components/ui/button";

const AllWinnersCard = lazy(() => import("@/components/AllWinnersCard"));

const DataFetching: React.FC = React.memo(() => {
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

  const handleRefreshClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      refreshData({ forceRefreshAll: true });
    },
    [refreshData]
  );

  const memoizedNominationsCard = useMemo(
    () => (
      <NominationsCard
        nominations={nominations}
        progress={nominationsProgress}
        refreshData={refreshData}
      />
    ),
    [nominations, nominationsProgress, refreshData]
  );

  const memoizedVotesCard = useMemo(
    () => (
      <VotesCard
        votes={combinedVotes}
        progress={votesProgress}
        refreshData={refreshData}
      />
    ),
    [combinedVotes, votesProgress, refreshData]
  );

  const memoizedAutosubscribersCard = useMemo(
    () => (
      <AutosubscribersCard
        subscribers={autosubscribers}
        progress={autosubscribersProgress}
        refreshData={refreshData}
      />
    ),
    [autosubscribers, autosubscribersProgress, refreshData]
  );

  const memoizedAllWinnersCard = useMemo(
    () => (
      <Suspense fallback={<div>Loading...</div>}>
        <AllWinnersCard
          winners={winners}
          progress={winnersProgress}
          refreshData={refreshData}
        />
      </Suspense>
    ),
    [winners, winnersProgress, refreshData]
  );

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again later.</div>}
    >
      <BentoGrid className="max-w-6xl mx-auto mb-12">
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          {memoizedNominationsCard}
        </div>
        <div className="col-span-1">{memoizedVotesCard}</div>
        <div className="col-span-1">{memoizedAutosubscribersCard}</div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          {memoizedAllWinnersCard}
        </div>
      </BentoGrid>
      <Button
        onClick={handleRefreshClick}
        disabled={isLoading}
        className="mx-auto block mb-12"
      >
        {isLoading ? "Refreshing..." : "Refresh All Data"}
      </Button>
    </ErrorBoundary>
  );
});

DataFetching.displayName = "DataFetching";

export default DataFetching;
