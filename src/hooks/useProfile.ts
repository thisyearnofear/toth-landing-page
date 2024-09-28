// src/hooks/useProfile.ts

import { useState, useEffect } from "react";
import { Profile, ProfileResponse } from "@/types/profile";
import { fetchUserProfile } from "@/utils/apiClient";
import { getCachedProfile, setCachedProfile } from "@/utils/cache";

export const useProfile = (identifier: string) => {
  const [profiles, setProfiles] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Check cache first
        const cachedData = getCachedProfile(identifier);
        if (cachedData) {
          setProfiles(cachedData);
          setLoading(false);
          return;
        }

        const data = await fetchUserProfile(identifier);
        setProfiles(data);

        // Cache the fetched data
        setCachedProfile(identifier, data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [identifier]);

  return { profiles, loading, error };
};
