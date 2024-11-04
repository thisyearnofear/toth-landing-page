// src/components/VotesCard.tsx

import React, { useState } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { GroupIcon } from "@radix-ui/react-icons";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import Marquee from "@/components/magicui/marquee";
import VoteNotification from "@/components/VoteNotification";
import AllVotesModal from "@/components/AllVotesModal";
import { CombinedVote } from "../types";
import { Button } from "@/components/ui/button";

const VotesCard = ({
  votes,
  progress,
  refreshData,
}: {
  votes: CombinedVote[];
  progress: number;
  refreshData: (options: { forceRefreshVotes?: boolean }) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);
    await refreshData({ forceRefreshVotes: true });
    setIsDataLoaded(true);
    setIsLoading(false);
  };

  const handleDownload = () => {
    const votersList = Array.from(new Set(votes.map((v) => v.vote.voter))).join(
      "\n"
    );
    const blob = new Blob([votersList], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voters_list.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (!isDataLoaded) {
      return (
        <div className="flex flex-col h-40 justify-center items-center gap-4 text-white">
          <p className="text-center px-4">
            Voting is open to all! In the{" "}
            <a
              href="https://warpcast.com/tipothehat/0xe3d321cd"
              className="text-white underline"
            >
              TOTH farcaster frame
            </a>
            , from 6pm daily to just before midnight, the top nominated casts
            from that day are eligible to accrue votes.
          </p>
          <Button
            onClick={handleLoadData}
            disabled={isLoading}
            variant="secondary"
            className="mt-2"
          >
            {isLoading ? "Loading..." : "View Votes"}
          </Button>
        </div>
      );
    }

    if (progress < 100) {
      return (
        <div className="flex justify-center items-center h-40">
          <AnimatedCircularProgressBar
            max={100}
            value={progress}
            min={0}
            gaugePrimaryColor="#3B82F6"
            gaugeSecondaryColor="#93C5FD"
            className="scale-75"
          />
        </div>
      );
    }

    return votes.length > 0 ? (
      <Marquee className="h-40" vertical pauseOnHover speed={10} reverse>
        {votes.map((combinedVote, index) => (
          <VoteNotification key={index} {...combinedVote} />
        ))}
      </Marquee>
    ) : (
      <div className="flex justify-center items-center h-40 text-white">
        No votes available.
      </div>
    );
  };

  return (
    <BentoCard
      name="Votes"
      className=""
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600" />
      }
      Icon={GroupIcon}
      description=""
      href="#"
      cta="View All Votes"
      onClick={() => isDataLoaded && setIsModalOpen(true)}
    >
      {renderContent()}
      {isDataLoaded && (
        <AllVotesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          votes={votes}
          onDownload={handleDownload}
        />
      )}
    </BentoCard>
  );
};

export default VotesCard;
