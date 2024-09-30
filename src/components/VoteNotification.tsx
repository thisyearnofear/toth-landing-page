// src/components/VoteNotification.tsx

import React from "react";
import { CombinedVote } from "../types";
import { generateUserUrl } from "../utils/userUtils";

const VoteNotification: React.FC<CombinedVote> = ({ vote, nomination }) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white bg-opacity-20 mb-2 w-full">
      <img
        src={vote.voterPfp}
        alt={`${vote.voter}'s profile picture`}
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-bold">
          <a
            href={generateUserUrl(vote.voter)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {vote.voter}
          </a>
        </span>
        <span className="text-sm">
          voted for{" "}
          <a
            href={generateUserUrl(nomination.nominee)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            @{nomination.nominee}
          </a>{" "}
          in Round {vote.round} on {vote.date}
        </span>
      </div>
    </div>
  );
};

export default VoteNotification;
