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

export default function Home() {
  return (
    <main className="min-h-screen bg-purple-100 flex flex-col items-center justify-center p-4">
      <Header />
      <TopHatEmbed />
      <UserProfileSection />
      <DataFetching />
      <Directory />
      <Footer />
      <BaseGlobeEmbed />
    </main>
  );
}
