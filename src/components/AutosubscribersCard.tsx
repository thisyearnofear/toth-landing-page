import React, { useState } from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { BellIcon } from "@radix-ui/react-icons";
import Marquee from "@/components/magicui/marquee";
import SparklesText from "@/components/magicui/sparkles-text";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import AllAutoSubscribersModal from "./AllAutoSubscribersModal";

const AutosubscribersCard = ({ subscribers, progress }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <BentoCard
      name="Autosubscribers"
      className="col-span-1"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600" />
      }
      Icon={BellIcon}
      description="Donating $degen to TOTH"
      href="#"
      cta="View All Autosubscribers"
      onClick={() => setIsModalOpen(true)}
    >
      {progress < 100 ? (
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
      ) : subscribers.length > 0 ? (
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
      )}
      <AllAutoSubscribersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        autosubscribers={subscribers}
        onDownload={handleDownload}
      />
    </BentoCard>
  );
};

export default AutosubscribersCard;
