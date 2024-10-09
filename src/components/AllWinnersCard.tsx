// src/components/AllWinnersCard.tsx

import React, { useState } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { StarIcon } from "@radix-ui/react-icons";
import Marquee from "@/components/magicui/marquee";
import WinnerListCard from "@/components/WinnerListCard";
import AllWinnersModal from "./AllWinnersModal";
import { useDataFetching } from "../hooks/useDataFetching";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const AllWinnersCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { winners, winnersProgress, error, isLoading, refreshData } =
    useDataFetching();

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

  const handleRefresh = () => {
    refreshData({ forceRefreshWinners: true });
  };

  return (
    <BentoCard
      name="Winners"
      className="col-span-2 relative flex flex-col"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
      }
      Icon={StarIcon}
      description="Recent $degen TOTH recipients"
      href="#"
      cta="View All Winners"
      onClick={() => setIsModalOpen(true)}
    >
      <div className="flex-grow overflow-hidden">
        {isLoading || winnersProgress < 100 ? (
          <div className="h-full flex items-center justify-center">
            Loading...
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            Error: {error}
          </div>
        ) : winners.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            No winners available
          </div>
        ) : (
          <ScrollArea className="h-[calc(100%-2rem)] w-full">
            <div className="relative overflow-hidden">
              <Marquee pauseOnHover className="[--duration:450s]">
                {winners.map((winner, index) => (
                  <WinnerListCard key={index} {...winner} />
                ))}
              </Marquee>
            </div>
          </ScrollArea>
        )}
      </div>
      <Button
        onClick={handleRefresh}
        disabled={isLoading}
        className="mt-4 w-full"
      >
        {isLoading ? "Refreshing..." : "Refresh Winners"}
      </Button>
      <AllWinnersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        winners={winners}
        onDownload={handleDownload}
      />
    </BentoCard>
  );
};

export default AllWinnersCard;
