// src/components/AllWinnersCard.tsx

import React, { useState } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { StarIcon } from "@radix-ui/react-icons";
import Marquee from "@/components/magicui/marquee";
import WinnerListCard from "@/components/WinnerListCard";
import AllWinnersModal from "./AllWinnersModal";
import { useDataFetching } from "../hooks/useDataFetching";
import { Button } from "@/components/ui/button";

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
      className="col-span-2 relative"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
      }
      Icon={StarIcon}
      description="Recent $degen TOTH recipients"
      href="#"
      cta="View All Winners"
      onClick={() => setIsModalOpen(true)}
    >
      {isLoading || winnersProgress < 100 ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : winners.length === 0 ? (
        <div>No winners available</div>
      ) : (
        <div className="relative h-80 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:450s]">
            {winners.map((winner, index) => (
              <WinnerListCard key={index} {...winner} />
            ))}
          </Marquee>
        </div>
      )}
      <Button onClick={handleRefresh} disabled={isLoading} className="mt-4">
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
