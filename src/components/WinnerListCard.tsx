import React from "react";
import { generateUserUrl } from "../utils/userUtils";
import { Winner } from "../types/index";

const WinnerListCard: React.FC<Winner> = ({
  name,
  description,
  icon,
  color,
}) => {
  return (
    <div className="w-48 p-2 mx-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm pointer-events-auto">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <a
          href={generateUserUrl(name)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-sm hover:underline"
          style={{ color }}
          onClick={(e) => e.stopPropagation()}
        >
          {name}
        </a>
      </div>
      <p className="text-xs">{description}</p>
    </div>
  );
};

export default WinnerListCard;
