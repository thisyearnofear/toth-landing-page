import axios from "axios";
import { Profile, ProfileResponse } from "@/types/profile";

const BASE_URL = "https://api.web3.bio";

const isEthereumAddress = (identifier: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(identifier);
};

const isFarcasterFid = (identifier: string): boolean => {
  return identifier.startsWith("fid:");
};

interface FetchResult {
  profiles: Profile[];
  suggestion?: string;
}

export const fetchAllProfiles = async (
  identifier: string
): Promise<FetchResult> => {
  const fetchWithSuffix = async (suffix: string): Promise<Profile[]> => {
    let url: string;
    if (suffix === "farcaster") {
      url = `${BASE_URL}/profile/farcaster/${identifier}`;
    } else if (suffix === "") {
      url = `${BASE_URL}/profile/${identifier}`;
    } else {
      url = `${BASE_URL}/profile/${identifier}.${suffix}`;
    }
    const response = await axios.get<ProfileResponse>(url);
    return response.data;
  };

  try {
    let profiles: Profile[] = [];

    if (identifier.endsWith(".eth") || identifier.endsWith(".lens")) {
      profiles = await fetchWithSuffix("");
    } else if (isEthereumAddress(identifier)) {
      profiles = await fetchWithSuffix("");
    } else if (isFarcasterFid(identifier)) {
      profiles = await fetchWithSuffix("farcaster");
    } else {
      // Try Farcaster first
      try {
        profiles = await fetchWithSuffix("farcaster");
      } catch (error) {
        // If Farcaster fails, try with .eth and .lens
        try {
          profiles = await fetchWithSuffix("eth");
        } catch (error) {
          try {
            profiles = await fetchWithSuffix("lens");
          } catch (error) {
            // If all attempts fail, throw an error with suggestions
            throw new Error(
              `No profiles found. Try ${identifier}.eth or ${identifier}.lens`
            );
          }
        }
      }
    }

    return { profiles };
  } catch (error) {
    console.error("Error fetching profiles:", error);
    if (error instanceof Error) {
      return { profiles: [], suggestion: error.message };
    }
    throw error;
  }
};

export const fetchUserProfile = async (
  identifier: string
): Promise<FetchResult> => {
  return fetchAllProfiles(identifier);
};
