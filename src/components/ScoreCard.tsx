import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { mockScoreData } from "@/data/mockData";

const ScoreCard = ({ icon, label, score, description }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);

    return () => clearTimeout(timer);
  }, [score]);

  const renderModalContent = () => {
    const data = mockScoreData[label.toLowerCase()];

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-purple-800">{label}</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div className="h-64 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f3e8ff",
                  border: "none",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#6b21a8" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {data.map((item, index) => (
            <div key={index} className="bg-purple-50 p-3 rounded">
              <p className="text-sm font-semibold text-purple-800">
                {item.date}
              </p>
              {label === "Kindness" && (
                <p className="text-xs text-purple-600">
                  Nominated: {item.nominated.join(", ")}
                </p>
              )}
              {label === "Recognition" && (
                <p className="text-xs text-purple-600">
                  Nominated by: {item.nominatedBy.join(", ")}
                </p>
              )}
              {label === "Governance" && (
                <p className="text-xs text-purple-600">
                  Votes cast: {item.votesCount}
                </p>
              )}
              {label === "Value" && (
                <p className="text-xs text-purple-600">
                  Votes received: {item.votesReceived}
                </p>
              )}
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
