import React, { lazy, Suspense, useCallback, useMemo } from "react";
import { useDataFetching } from "../hooks/useDataFetching";
import { BentoGrid } from "@/components/magicui/bento-grid";
import NominationsCard from "@/components/NominationsCard";
import VotesCard from "@/components/VotesCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import AutosubscribersCard from "@/components/AutosubscribersCard";
import { Button } from "@/components/ui/button";
import "@/components/AllWinnersCard";

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

  const handleWinnersRefresh = useCallback(
    () => refreshData({ forceRefreshWinners: true }),
    [refreshData]
  );

  const memoizedNominationsCard = useMemo(
    () => (
      <NominationsCard
        nominations={nominations}
        progress={nominationsProgress}
      />
    ),
    [nominations, nominationsProgress]
  );

  const memoizedVotesCard = useMemo(
    () => <VotesCard votes={combinedVotes} progress={votesProgress} />,
    [combinedVotes, votesProgress]
  );

  const memoizedAutosubscribersCard = useMemo(
    () => (
      <AutosubscribersCard
        subscribers={autosubscribers}
        progress={autosubscribersProgress}
      />
    ),
    [autosubscribers, autosubscribersProgress]
  );

  const memoizedAllWinnersCard = useMemo(
    () => (
      <Suspense fallback={<div>Loading...</div>}>
        <AllWinnersCard
          winners={winners}
          progress={winnersProgress}
          onRefresh={handleWinnersRefresh}
        />
      </Suspense>
    ),
    [winners, winnersProgress, handleWinnersRefresh]
  );

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again later.</div>}
    >
      <div className="max-w-6xl mx-auto mb-4"></div>

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
      <Button onClick={handleRefreshClick} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh Data"}
      </Button>
    </ErrorBoundary>
  );
});

export default DataFetching;
