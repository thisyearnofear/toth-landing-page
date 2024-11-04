// src/components/AutosubscribersCard.tsx

import React, { useState } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { BellIcon } from "@radix-ui/react-icons";
import Marquee from "@/components/magicui/marquee";
import SparklesText from "@/components/magicui/sparkles-text";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import AllAutoSubscribersModal from "./AllAutoSubscribersModal";
import { Button } from "@/components/ui/button";

const AutosubscribersCard = ({ subscribers, progress, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);
    await refreshData({ forceRefreshAutosubscribers: true });
    setIsDataLoaded(true);
    setIsLoading(false);
  };

  const handleDownload = () => {
    const subscribersList = subscribers.map((sub) => sub.name).join("\n");
    const blob = new Blob([subscribersList], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autosubscribers_list.txt";
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
            On Farcaster, those with a $degen allowance delegate unused tips (at
            EOD) to community-selected builders advancing the onchain movement.
          </p>
          <Button
            onClick={handleLoadData}
            disabled={isLoading}
            variant="secondary"
            className="mt-2"
          >
            {isLoading ? "Loading..." : "View Autosubscribers"}
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
            gaugePrimaryColor="#EAB308"
            gaugeSecondaryColor="#FDE68A"
            className="scale-75"
          />
        </div>
      );
    }

    return subscribers.length > 0 ? (
      <Marquee className="h-40" vertical pauseOnHover>
        {subscribers.map((subscriber, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg bg-white bg-opacity-20 mb-2"
          >
            <span className="text-lg">{subscriber.icon}</span>
            <div className="flex flex-col">
              <SparklesText
                text={subscriber.name}
                colors={{ first: subscriber.color, second: "#FFFFFF" }}
                className="text-base font-bold"
              />
              <span className="text-xs">
                Daily allowance: {subscriber.allowance} $degen
              </span>
            </div>
          </div>
        ))}
      </Marquee>
    ) : (
      <div className="flex justify-center items-center h-40 text-white">
        No autosubscribers found.
      </div>
    );
  };

  return (
    <BentoCard
      name="Autosubscribers"
      className=""
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600" />
      }
      Icon={BellIcon}
      description=""
      href="#"
      cta="View All Autosubscribers"
      onClick={() => isDataLoaded && setIsModalOpen(true)}
    >
      {renderContent()}
      {isDataLoaded && (
        <AllAutoSubscribersModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          autosubscribers={subscribers}
          onDownload={handleDownload}
        />
      )}
    </BentoCard>
  );
};

export default AutosubscribersCard;
