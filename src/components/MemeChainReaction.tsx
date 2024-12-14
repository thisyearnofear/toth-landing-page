import React from "react";
import { motion } from "framer-motion";

const MemeChainReaction: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto my-12 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-center">Chain Reaction</h2>

      {/* Stacked layout */}
      <div className="relative flex flex-col items-center gap-8 mt-12">
        {/* Top row with WIFHAT and BABYDEGEN */}
        <div className="flex justify-center gap-24 w-full">
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground max-w-xs text-sm">
              <a
                href="https://warpcast.com/carter/0x9b20a92a"
                className="text-purple-500 hover:underline"
              >
                The first composable clanker experiment.
              </a>
              <br />
              95% of $WIFHAT fees buy & burn $DEGEN.
              <br />
              Contract ownership renounced, built on base.
            </p>
            {/* WIFHAT Token */}
            <motion.div
              className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold border border-purple-400 shadow-lg"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              WIFHAT
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground max-w-xs text-sm">
              Earn $degen simply for{" "}
              <a
                href="https://babydegen.tips"
                className="text-purple-500 hover:underline"
              >
                HODLing
              </a>
              .
              <br />
              5% buy/sell Tax funds ongoing rewards.
              <br />
              Sent directly to your wallet, built on base.
            </p>
            {/* BABYDEGEN Token */}
            <motion.div
              className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold border border-purple-400 shadow-lg"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              BABY
              <br />
              DEGEN
            </motion.div>
          </div>
        </div>

        {/* Energy flow paths */}
        <div className="relative w-full h-24">
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            {/* Left energy path - adjusted coordinates */}
            <motion.path
              d="M260,20 L340,80"
              className="energy-path"
              stroke="url(#purpleGradient)"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Right energy path - adjusted coordinates */}
            <motion.path
              d="M420,20 L340,80"
              className="energy-path"
              stroke="url(#purpleGradient)"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient
                id="purpleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(147, 51, 234, 0.2)" />
                <stop offset="50%" stopColor="rgba(147, 51, 234, 0.8)" />
                <stop offset="100%" stopColor="rgba(147, 51, 234, 0.2)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* DEGEN Token (Bottom) - fixed hat positioning */}
        <div className="w-24 h-24 relative token-pulse">
          {/* Top part of hat - moved down to connect with brim */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-14 bg-purple-800 flex items-center justify-center">
            <span className="text-sm text-white font-semibold">DEGEN</span>
          </div>
          {/* Brim of hat - positioned directly below the top part */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-20 h-3 bg-purple-800" />
        </div>
      </div>
    </div>
  );
};

export default MemeChainReaction;
