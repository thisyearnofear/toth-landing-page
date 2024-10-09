// src/utils/apiClient.ts

import axios from "axios";
import { Profile, ProfileResponse } from "@/types/profile";

const BASE_URL = "https://api.web3.bio";

export const fetchUserProfile = async (
  identifier: string
): Promise<ProfileResponse> => {
  try {
    const response = await axios.get<ProfileResponse>(
      `${BASE_URL}/profile/${identifier}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
