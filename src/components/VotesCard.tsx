// src/components/VotesCard.tsx

import React, { useState } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { GroupIcon } from "@radix-ui/react-icons";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import Marquee from "@/components/magicui/marquee";
import VoteNotification from "@/components/VoteNotification";
import AllVotesModal from "@/components/AllVotesModal";
import { CombinedVote } from "../types";

const VotesCard = ({
  votes,
  progress,
}: {
  votes: CombinedVote[];
  progress: number;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <BentoCard
      name="Votes"
      className=""
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600" />
      }
      Icon={GroupIcon}
      description="The ballot is stronger than the bullet"
      href="#"
      cta="View All Votes"
      onClick={() => setIsModalOpen(true)}
    >
      {progress < 100 ? (
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
      ) : votes.length > 0 ? (
        <Marquee className="h-40" vertical pauseOnHover speed={10} reverse>
          {votes.map((combinedVote, index) => (
            <VoteNotification key={index} {...combinedVote} />
          ))}
        </Marquee>
      ) : (
        <div className="flex justify-center items-center h-40 text-white">
          No votes available.
        </div>
      )}
      <AllVotesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        votes={votes}
        onDownload={handleDownload}
      />
    </BentoCard>
  );
};

export default VotesCard;
