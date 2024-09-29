import React from "react";
import { BentoCard } from "@/components/magicui/bento-grid";
import { StarIcon } from "@radix-ui/react-icons";
import Marquee from "@/components/magicui/marquee";
import WinnerListCard from "@/components/WinnerListCard";

const AllWinnersCard = ({ winners }) => {
  const halfLength = Math.ceil(winners.length / 2);

  return (
    <BentoCard
      name="Winners"
      className="col-span-2"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
      }
      Icon={StarIcon}
      description="Recent $degen TOTH recipients"
      href="#"
      cta="View All Winners"
    >
      <div className="relative h-80 overflow-hidden">
        <Marquee pauseOnHover className="[--duration:40s]">
          {winners.slice(0, halfLength).map((winner, index) => (
            <WinnerListCard key={index} {...winner} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:40s]" reverse>
          {winners.slice(halfLength).map((winner, index) => (
            <WinnerListCard key={index} {...winner} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-green-400"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-green-600"></div>
      </div>
    </BentoCard>
  );
};

export default AllWinnersCard;
