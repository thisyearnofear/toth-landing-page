//

import React from "react";
import { generateUserUrl } from "../utils/userUtils";
import { Winner } from "../types/index";

const WinnerListCard: React.FC<Winner> = ({
  username,
  date,
  text,
  rootParentUrl,
}) => {
  return (
    <div className="w-48 h-48 p-2 mx-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm pointer-events-auto flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        {username && (
          <a
            href={generateUserUrl(username)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sm hover:underline truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {username}
          </a>
        )}
      </div>
      <p className="text-xs mb-1">{date || "No date available"}</p>
      <p className="text-xs mb-1 flex-grow overflow-y-auto">
        {text || "No text available"}
      </p>
      {rootParentUrl && (
        <a
          href={rootParentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs hover:underline mt-auto"
        >
          View Context
        </a>
      )}
    </div>
  );
};

export default WinnerListCard;
