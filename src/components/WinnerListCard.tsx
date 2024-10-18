import React, { memo } from "react";
import { generateUserUrl } from "../utils/userUtils";
import { Winner } from "../types/index";

const WinnerListCard: React.FC<Winner> = memo(
  ({ username, date, text, roundNumber, fid }) => {
    const displayName = username || `User ${fid}`;
    const displayDate = date || `Round ${roundNumber}`;

    return (
      <div className="w-48 h-48 p-2 mx-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm pointer-events-auto flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <a
            href={generateUserUrl(displayName)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sm hover:underline truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {displayName}
          </a>
          {fid && <span className="text-xs text-gray-500">(FID: {fid})</span>}
        </div>
        <p className="text-xs mb-1">{displayDate}</p>
        <p className="text-xs mb-1 flex-grow overflow-y-auto">
          {text || "No text available"}
        </p>
      </div>
    );
  }
);

WinnerListCard.displayName = "WinnerListCard";

export default WinnerListCard;
