// src/components/UserProfileSection.tsx
"use client";

import React, { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import ProfileComponent from "./ProfileComponent";

const UserProfileSection: React.FC = () => {
  const [identifier, setIdentifier] = useState("leovido.eth");
  const { profiles, loading, error, suggestion } = useProfile(identifier);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "identifier"
    ) as HTMLInputElement;
    setIdentifier(input.value);
  };

  return (
    <section className="w-full max-w-2xl mx-auto my-6 px-4 relative">
      {/* Search Bar  */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex relative z-10 bg-white rounded-lg shadow-md p-4"
      >
        <input
          type="text"
          name="identifier"
          placeholder="Enter ENS, address, or username"
          className="flex-grow p-2 border rounded-l bg-purple-50"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-r hover:bg-purple-700"
        >
          Search
        </button>
      </form>

      {loading && <div className="text-center text-purple-600">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error}</div>}
      {suggestion && (
        <div className="text-center text-yellow-600 mt-2">{suggestion}</div>
      )}
      {profiles && profiles.length > 0 ? (
        <div className="mt-6">
          <ProfileComponent profiles={profiles} />
        </div>
      ) : (
        <div className="text-center text-purple-600 mt-4">
          No profiles found
        </div>
      )}
    </section>
  );
};

export default UserProfileSection;
