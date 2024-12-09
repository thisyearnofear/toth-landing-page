// src/app/page.tsx

"use client";

import React from "react";
import Header from "@/components/Header";
import UserProfileSection from "@/components/UserProfileSection";
import DataFetching from "@/components/DataFetching";
import Directory from "@/components/Directory";
import Footer from "@/components/Footer";
import TopHatEmbed from "@/components/TopHatEmbed";
import BaseGlobeEmbed from "@/components/BaseGlobeEmbed";
import MemeChainReaction from "@/components/MemeChainReaction";
import { motion } from "framer-motion";

const Tagline = () => (
  <motion.div
    className="w-full text-center py-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
      Pool Funds, Fund Awesomeness
    </h2>
  </motion.div>
);

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-4 bg-background">
      <Header />
      <TopHatEmbed />
      <Tagline />
      <DataFetching />
      <UserProfileSection />
      <MemeChainReaction />
      <Directory />
      <Footer />
      <BaseGlobeEmbed />
    </main>
  );
}
