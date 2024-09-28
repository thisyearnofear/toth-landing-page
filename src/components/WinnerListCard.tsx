import React from "react";
import { generateUserUrl } from "../utils/userUtils";

interface WinnerListCardProps {
  name: string;
  description: string;
  icon: string;
  color: string;
}

const WinnerListCard: React.FC<WinnerListCardProps> = ({
  name,
  description,
  icon,
  color,
}) => {
  const shortDescription =
    description.length > 50
      ? description.substring(0, 47) + "..."
      : description;

  return (
    <div className="w-48 p-2 mx-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <a
          href={generateUserUrl(name)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-sm hover:underline"
          style={{ color }}
        >
          {name}
        </a>
      </div>
      <p className="text-xs">{shortDescription}</p>
    </div>
  );
};

export default WinnerListCard;
