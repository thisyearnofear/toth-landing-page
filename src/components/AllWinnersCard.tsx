// src/components/AllWinnersCard.tsx

import React, { useState } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { StarIcon } from "@radix-ui/react-icons";
import Marquee from "@/components/magicui/marquee";
import WinnerListCard from "@/components/WinnerListCard";
import AllWinnersModal from "./AllWinnersModal";
import { winners } from "@/data/staticData";

const AllWinnersCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const halfLength = Math.ceil(winners.length / 2);

  const handleDownload = () => {
    const winnersList = winners.map((winner) => winner.name).join("\n");
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

  return (
    <BentoCard
      name="Winners"
      className="col-span-2 relative" // Ensure relative positioning for absolute children
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
      }
      Icon={StarIcon}
      description="Recent $degen TOTH recipients"
      href="#"
      cta="View All Winners"
      onClick={() => setIsModalOpen(true)} // Opens modal
    >
      <div className="relative h-80 overflow-hidden">
        <Marquee pauseOnHover className="[--duration:40s]">
          {winners.slice(0, halfLength).map((winner, index) => (
            <WinnerListCard key={index} {...winner} />
          ))}
        </Marquee>
      </div>
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
