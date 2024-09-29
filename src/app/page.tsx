// src/app/page.tsx

"use client";

import React from "react";
import Header from "@/components/Header";
import UserProfileSection from "@/components/UserProfileSection";
import DataFetching from "@/components/DataFetching";
import Directory from "@/components/Directory";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-purple-100 flex flex-col items-center justify-center p-4">
      <Header />
      <UserProfileSection />
      <DataFetching />
      <Directory />
      <Footer />
    </main>
  );
}
