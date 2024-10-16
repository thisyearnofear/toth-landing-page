// src/components/NominationNotification.tsx

import React from "react";
import { Nomination } from "../types";
import { generateUserUrl } from "../utils/userUtils";

const NominationNotification: React.FC<Nomination> = ({
  nominator,
  nominee,
  round,
  date,
  nominatorPfp,
  nominatorFid,
}) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white bg-opacity-20 mb-2 w-full">
      <img
        src={nominatorPfp}
        alt={`${nominator}'s profile picture`}
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-bold">
          <a
            href={generateUserUrl(nominator)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {nominator}
          </a>
          <span
            className="text-sm text-black ml-1"
            style={{ fontWeight: "normal" }}
          >
            ({nominatorFid})
          </span>
        </span>
        <span className="text-sm">
          nominated{" "}
          <a
            href={generateUserUrl(nominee)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            @{nominee}
          </a>{" "}
          in Round {round} on {date}
        </span>
      </div>
    </div>
  );
};

export default NominationNotification;
