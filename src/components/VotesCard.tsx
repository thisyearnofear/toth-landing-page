import React from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { GroupIcon } from "@radix-ui/react-icons";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import Marquee from "@/components/magicui/marquee";
import VoteNotification from "@/components/VoteNotification";

const VotesCard = ({ votes, progress }) => {
  return (
    <BentoCard
      name="Votes"
      className="col-span-1"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600" />
      }
      Icon={GroupIcon}
      description="The ballot is stronger than the bullet"
      href="https://toth-bec749001fd2.herokuapp.com/allVotesForRounds"
      cta="View All Votes"
    >
      {progress < 100 ? (
        <div className="flex justify-center items-center h-40">
          <AnimatedCircularProgressBar
            max={100}
            value={progress}
            min={0}
            gaugePrimaryColor="#3B82F6"
            gaugeSecondaryColor="#93C5FD"
            className="scale-75"
          />
        </div>
      ) : (
        <Marquee className="h-40" vertical pauseOnHover speed={10} reverse>
          {votes.map((vote, index) => (
            <VoteNotification key={index} {...vote} />
          ))}
        </Marquee>
      )}
    </BentoCard>
  );
};

export default VotesCard;
