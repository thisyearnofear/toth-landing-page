import React, { useState, useEffect, useCallback, memo } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { StarIcon, ReloadIcon } from "@radix-ui/react-icons";
import Marquee from "@/components/magicui/marquee";
import AllWinnersModal from "./AllWinnersModal";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import WinnerListCard from "@/components/WinnerListCard";
import { Winner } from "../types";
import { Button } from "@/components/ui/button";

interface AllWinnersCardProps {
  winners: Winner[];
  progress: number;
  onRefresh: () => void;
}

const AllWinnersCard: React.FC<AllWinnersCardProps> = memo(
  ({ winners, progress, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
      console.log("Winners updated:", winners);
    }, [winners]);

    const handleDownload = () => {
      const winnersList = winners.map((winner) => winner.username).join("\n");
      const blob = new Blob([winnersList], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "winners_list.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const handleRefresh = useCallback(() => {
      onRefresh();
    }, [onRefresh]);

    return (
      <BentoCard
        name="Winners"
        className=""
        background={
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
        }
        Icon={StarIcon}
        description="Recent $degen TOTH recipients"
        href="#"
        cta="View All Winners"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-end mb-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
          >
            {isRefreshing ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ReloadIcon className="mr-2 h-4 w-4" />
            )}
            Refresh Winners
          </Button>
        </div>
        {progress < 100 || isRefreshing ? (
          <div className="flex justify-center items-center h-40">
            <AnimatedCircularProgressBar
              max={100}
              value={progress}
              min={0}
              gaugePrimaryColor="#10B981"
              gaugeSecondaryColor="#6EE7B7"
              className="scale-75"
            />
          </div>
        ) : winners.length > 0 ? (
          <Marquee className="h-40" pauseOnHover speed={20}>
            {winners.map((winner, index) => (
              <WinnerListCard key={index} {...winner} />
            ))}
          </Marquee>
        ) : (
          <div className="flex justify-center items-center h-40 text-white">
            No winners available. Try refreshing the data.
          </div>
        )}
        <AllWinnersModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          winners={winners}
          onDownload={handleDownload}
        />
      </BentoCard>
    );
  }
);

export default AllWinnersCard;
