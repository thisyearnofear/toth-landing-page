import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { formatLargeNumber } from "../utils/formatNumbers";

interface TokenDetail {
  symbol: string;
  value: string;
}

interface ScoreCardProps {
  icon: React.ReactNode;
  label: string;
  score: number;
  description: string;
  tokenList: TokenDetail[];
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  icon,
  label,
  score,
  description,
  tokenList,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);

    return () => clearTimeout(timer);
  }, [score]);

  const renderModalContent = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-2xl font-bold text-purple-800">{label}</h3>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tokenList.map((token, index) => (
            <div
              key={index}
              className="bg-purple-50 p-3 rounded flex justify-between items-center"
            >
              <span className="font-medium text-purple-800">
                {token.symbol}
              </span>
              <span className="text-purple-600">
                {formatLargeNumber(token.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="bg-purple-100 rounded-full p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-purple-200"
        onClick={() => setShowModal(true)}
      >
        {icon}
        <span className="text-lg font-bold text-purple-800 mt-2">
          {animatedScore}
        </span>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>{renderModalContent()}</div>
        </div>
      )}
    </>
  );
};

export default ScoreCard;
