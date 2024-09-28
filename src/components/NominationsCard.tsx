import React from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { PersonIcon } from "@radix-ui/react-icons";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import Marquee from "@/components/magicui/marquee";
import NominationNotification from "@/components/NominationNotification";

const NominationsCard = ({ nominations, progress }) => {
  return (
    <BentoCard
      name="Nominations"
      className="col-span-2"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600" />
      }
      Icon={PersonIcon}
      description="Pool Tips, Fund Awesomeness"
      href="#"
      cta="View All Nominations"
    >
      {progress < 100 ? (
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
      ) : (
        <Marquee className="h-40" vertical pauseOnHover speed={10}>
          {nominations.map((nomination, index) => (
            <NominationNotification key={index} {...nomination} />
          ))}
        </Marquee>
      )}
    </BentoCard>
  );
};

export default NominationsCard;
