// src/components/NominationsCard.tsx

"use client";

import React, { useState } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { PersonIcon } from "@radix-ui/react-icons";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import Marquee from "@/components/magicui/marquee";
import NominationNotification from "@/components/NominationNotification";
import AllNominationsModal from "@/components/AllNominationsModal";
import { Nomination } from "../types";
import { Button } from "@/components/ui/button";

const NominationsCard = ({
  nominations,
  progress,
  refreshData,
}: {
  nominations: Nomination[];
  progress: number;
  refreshData: (options: { forceRefreshNominations?: boolean }) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);
    await refreshData({ forceRefreshNominations: true });
    setIsDataLoaded(true);
    setIsLoading(false);
  };

  const handleDownload = () => {
    const nomineesList = Array.from(
      new Set(nominations.map((n) => n.nominee))
    ).join("\n");
    const blob = new Blob([nomineesList], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nominees_list.txt";
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
            TOTH is a tool for the farcaster community to aggregate tips which,
            when combined, deliver HIGHER impact. Via a handy{" "}
            <a
              href="https://warpcast.com/tipothehat/0xe3d321cd"
              className="text-white underline"
            >
              farcaster frame
            </a>{" "}
            we nominate dope casts daily. The top nominated go through to the
            voting phase! In season one{" "}
            <a
              href="https://paragraph.xyz/@papajams.eth/funding-the-future-on-farcaster-and-beyond-with-dollardegen"
              className="text-white underline"
            >
              over $1m in $degen
            </a>{" "}
            was distributed at ATH, so far in season two there has been circa
            $50 distributed daily for 125+ rounds and counting.
          </p>
          <Button
            onClick={handleLoadData}
            disabled={isLoading}
            variant="secondary"
            className="mt-2"
          >
            {isLoading ? "Loading..." : "View Nominations"}
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
            gaugePrimaryColor="#8B5CF6"
            gaugeSecondaryColor="#C4B5FD"
            className="scale-75"
          />
        </div>
      );
    }

    return nominations.length > 0 ? (
      <Marquee className="h-40" vertical pauseOnHover speed={10}>
        {nominations.map((nomination, index) => (
          <NominationNotification key={index} {...nomination} />
        ))}
      </Marquee>
    ) : (
      <div className="flex justify-center items-center h-40 text-white">
        No nominations available.
      </div>
    );
  };

  return (
    <BentoCard
      name="Nominations"
      className=""
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600" />
      }
      Icon={PersonIcon}
      description=""
      href="#"
      cta="View All Nominations"
      onClick={() => isDataLoaded && setIsModalOpen(true)}
    >
      {renderContent()}
      {isDataLoaded && (
        <AllNominationsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          nominations={nominations}
          onDownload={handleDownload}
        />
      )}
    </BentoCard>
  );
};

export default NominationsCard;
