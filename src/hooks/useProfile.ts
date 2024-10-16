// src/hooks/useProfile.ts

import { useState, useEffect } from "react";
import { fetchAllProfiles } from "@/utils/apiClient";
import { Profile } from "@/types/profile";

export const useProfile = (identifier: string) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const { profiles, suggestion } = await fetchAllProfiles(identifier);
        setProfiles(profiles);
        setSuggestion(suggestion || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setProfiles([]);
        setSuggestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [identifier]);

  return { profiles, loading, error, suggestion };
};
