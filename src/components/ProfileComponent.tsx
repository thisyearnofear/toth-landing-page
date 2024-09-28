// src/components/ProfileComponent.tsx
"use client";

import React, { useState } from "react";
import { Profile } from "@/types/profile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Heart, Award, Vote, User, ChevronDown, ChevronUp } from "lucide-react";

interface ProfileProps {
  profiles: Profile[];
}

const ScoreCard = ({ icon, label, score, description }) => {
  const [isOpen, setIsOpen] = useState(false); // State to control tooltip visibility

  const toggleTooltip = () => {
    setIsOpen(!isOpen); // Toggle tooltip visibility
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        {" "}
        {/* Control tooltip visibility */}
        <TooltipTrigger asChild>
          <div
            className="bg-purple-100 rounded-full p-1 flex items-center space-x-1 cursor-help"
            onClick={toggleTooltip} // Show tooltip on click
          >
            {icon}
            <span className="text-xs font-semibold text-purple-800">
              {score}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {label}: {description}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ProfileComponent: React.FC<ProfileProps> = ({ profiles }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getProfileLink = (profile: Profile): string => {
    switch (profile.platform) {
      case "ens":
        return `https://web3.bio/${profile.identity}`;
      case "farcaster":
        return `https://warpcast.com/${profile.links.farcaster?.handle}`;
      case "lens":
        return `https://lenster.xyz/u/${profile.links.lens?.handle}`;
      default:
        return "#";
    }
  };

  const getPlatformLabel = (platform: string): string => {
    switch (platform) {
      case "ens":
        return "ENS";
      case "farcaster":
        return "Farcaster";
      case "lens":
        return "Lens";
      default:
        return platform;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg shadow-md p-4 mb-4 mt-4">
      <div className="flex flex-wrap justify-center gap-4">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className="w-full sm:w-auto flex-grow max-w-xs bg-white rounded-lg p-3 shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <a
                href={getProfileLink(profile)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <img
                  src={profile.avatar || "/default-avatar.png"}
                  alt={profile.displayName}
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
                <div>
                  <h2 className="text-sm font-semibold text-purple-900">
                    {profile.displayName}
                  </h2>
                  <p className="text-xs text-purple-700">{profile.identity}</p>
                </div>
              </a>
              <div className="flex items-center">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full mr-2">
                  {getPlatformLabel(profile.platform)}
                </span>
                <button
                  onClick={() => toggleExpand(index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  {expandedIndex === index ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>
            </div>

            {expandedIndex === index && (
              <div className="mt-2 text-sm text-purple-800">
                <p className="mb-2">{profile.description}</p>
                {profile.links.website && (
                  <a
                    href={profile.links.website.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    {profile.links.website.handle}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        <ScoreCard
          icon={<Heart className="w-4 h-4 text-purple-600" />}
          label="Kindness"
          score="85"
          description="Recognizes how often you nominate others"
        />
        <ScoreCard
          icon={<Award className="w-4 h-4 text-purple-600" />}
          label="Recognition"
          score="92"
          description="Reflects how often you are nominated by others"
        />
        <ScoreCard
          icon={<Vote className="w-4 h-4 text-purple-600" />}
          label="Governance"
          score="78"
          description="Indicates your participation in voting"
        />
        <ScoreCard
          icon={<User className="w-4 h-4 text-purple-600" />}
          label="Value"
          score="88"
          description="Represents how often you receive votes"
        />
      </div>
    </div>
  );
};

export default ProfileComponent;
