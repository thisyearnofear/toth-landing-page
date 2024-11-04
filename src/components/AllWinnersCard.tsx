import React, { useState, useCallback, memo } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { StarIcon } from "@radix-ui/react-icons";
import Marquee from "@/components/magicui/marquee";
import AllWinnersModal from "./AllWinnersModal";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import WinnerListCard from "@/components/WinnerListCard";
import { Winner } from "../types";
import { Button } from "@/components/ui/button";

interface AllWinnersCardProps {
  winners: Winner[];
  progress: number;
  refreshData: (options: { forceRefreshWinners?: boolean }) => void;
}

const AllWinnersCard: React.FC<AllWinnersCardProps> = memo(
  ({ winners, progress, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadData = async () => {
      setIsLoading(true);
      await refreshData({ forceRefreshWinners: true });
      setIsDataLoaded(true);
      setIsLoading(false);
    };

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

    const renderContent = () => {
      if (!isDataLoaded) {
        return (
          <div className="flex flex-col h-40 justify-center items-center gap-4 text-white">
            <p className="text-center px-4">
              The community nominated you. The community voted for you. Thanks
              for building/creating something awesome. You have entered the
              pantheon of season two TOTH winners and are now a custodian of
              $degen entrusted upon you to go forth and prosper. The hat stays
              on 🎩
            </p>
            <Button
              onClick={handleLoadData}
              disabled={isLoading}
              variant="secondary"
              className="mt-2"
            >
              {isLoading ? "Loading..." : "View Winners"}
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
              gaugePrimaryColor="#10B981"
              gaugeSecondaryColor="#6EE7B7"
              className="scale-75"
            />
          </div>
        );
      }

      return winners.length > 0 ? (
        <Marquee className="h-40" pauseOnHover speed={20}>
          {winners.map((winner, index) => (
            <WinnerListCard key={index} {...winner} />
          ))}
        </Marquee>
      ) : (
        <div className="flex justify-center items-center h-40 text-white">
          No winners available.
        </div>
      );
    };

    return (
      <BentoCard
        name="Winners"
        className=""
        background={
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
        }
        Icon={StarIcon}
        description=""
        href="#"
        cta="View All Winners"
        onClick={() => isDataLoaded && setIsModalOpen(true)}
      >
        {renderContent()}
        {isDataLoaded && (
          <AllWinnersModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            winners={winners}
            onDownload={handleDownload}
          />
        )}
      </BentoCard>
    );
  }
);

AllWinnersCard.displayName = "AllWinnersCard";

export default AllWinnersCard;
