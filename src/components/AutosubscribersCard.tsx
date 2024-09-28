import React from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { BellIcon } from "@radix-ui/react-icons";
import Marquee from "@/components/magicui/marquee";
import SparklesText from "@/components/magicui/sparkles-text";

const AutosubscribersCard = ({ subscribers }) => {
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
    >
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
    </BentoCard>
  );
};

export default AutosubscribersCard;
