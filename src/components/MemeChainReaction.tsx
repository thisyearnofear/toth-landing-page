import React from "react";
import { motion } from "framer-motion";

const MemeChainReaction: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto my-12 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-center">Chain Reaction</h2>

      <p className="text-center text-muted-foreground max-w-xl">
        <a
          href="https://warpcast.com/carter/0x9b20a92a"
          className="text-purple-500 hover:underline"
        >
          The first composable clanker experiment.
        </a>
        <br />
        95% of $WIFHAT fees buy & burn $DEGEN.
        <br />
        95% of ? fees buy and burn $WIFHAT.
      </p>

      {/* Stacked layout */}
      <div className="relative flex flex-col items-center gap-8 mt-12">
        {/* Question Mark Token */}
        <motion.div
          className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl font-bold border border-purple-300 shadow-lg"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ?
        </motion.div>

        {/* Flow animation */}
        <motion.div
          className="w-2 h-16 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* WIFHAT Token */}
        <motion.div
          className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold border border-purple-400 shadow-lg"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          WIFHAT
        </motion.div>

        {/* Flow animation */}
        <motion.div
          className="w-2 h-16 bg-gradient-to-b from-purple-600 to-purple-800 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />

        {/* DEGEN Token (Top Hat Design) */}
        <div className="w-24 h-24 relative">
          {/* Top part of hat */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-purple-800 rounded-t-lg flex items-center justify-center text-white text-sm font-bold"></div>
          {/* Brim of hat */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-purple-800 rounded-b-sm" />
        </div>
      </div>
    </div>
  );
};

export default MemeChainReaction;
