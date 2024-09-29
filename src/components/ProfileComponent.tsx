import React, { useState, useEffect } from "react";
import ScoreCard from "./ScoreCard";
import { Profile } from "@/types/profile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Heart,
  Award,
  Vote,
  User,
  ChevronDown,
  ChevronUp,
  X,
  HardHat,
  ChefHat,
} from "lucide-react";
import { mockScoreData } from "@/data/mockData";

interface ProfileProps {
  profiles: Profile[];
}

const ProfileComponent: React.FC<ProfileProps> = ({ profiles }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(() => {
    const ensIndex = profiles.findIndex(
      (profile) => profile.platform === "ens"
    );
    return ensIndex !== -1 ? ensIndex : null;
  });
  const [totalScore, setTotalScore] = useState(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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

  const getProfileLink = (profile: Profile): string => {
    switch (profile.platform) {
      case "ens":
        return `https://app.ens.domains/${profile.identity}`;
      case "farcaster":
        return `https://warpcast.com/${profile.identity}`;
      case "lens":
        return `https://lenster.xyz/u/${profile.identity}`;
      default:
        return "#";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTotalScore(85);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg shadow-md p-4 mb-4 mt-4">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className={`flex-grow flex-shrink-0 basis-[calc(33.333%-1rem)] min-w-[120px] max-w-[200px] bg-white rounded-lg shadow transition-all duration-300 ease-in-out ${
              expandedIndex === index ? "h-auto p-4" : "h-12 p-2"
            }`}
          >
            <div className="flex items-center justify-between">
              {expandedIndex === index ? (
                <a
                  href={getProfileLink(profile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.displayName}
                      className="w-8 h-8 rounded-full border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-purple-500 flex items-center justify-center bg-purple-100">
                      🎩
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h2 className="text-sm font-semibold text-purple-900 truncate">
                      {profile.displayName}
                    </h2>
                    <p className="text-xs text-purple-700 truncate">
                      {profile.identity}
                    </p>
                  </div>
                </a>
              ) : (
                <span className="text-sm font-semibold text-purple-800">
                  {getPlatformLabel(profile.platform)}
                </span>
              )}
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

            {expandedIndex === index && (
              <div className="mt-4 text-sm text-purple-800">
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

      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-purple-800">Degen Score</h3>
        <div className="flex items-center justify-center mt-2">
          <ChefHat className="w-8 h-8 text-purple-600 mr-2" />
          <div className="text-4xl font-bold text-purple-600 transition-all duration-1000 ease-out">
            {totalScore}
          </div>
          <HardHat className="w-8 h-8 text-purple-600 ml-2" />
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <ScoreCard
          icon={<Heart className="w-6 h-6 text-purple-600" />}
          label="Kindness"
          score={20}
          description="Recognizes how often you nominate others"
        />
        <ScoreCard
          icon={<Award className="w-6 h-6 text-purple-600" />}
          label="Recognition"
          score={23}
          description="Reflects how often you are nominated by others"
        />
        <ScoreCard
          icon={<Vote className="w-6 h-6 text-purple-600" />}
          label="Governance"
          score={19}
          description="Indicates your participation in voting"
        />
        <ScoreCard
          icon={<User className="w-6 h-6 text-purple-600" />}
          label="Value"
          score={23}
          description="Represents how often you receive votes"
        />
      </div>
    </div>
  );
};

export default ProfileComponent;
