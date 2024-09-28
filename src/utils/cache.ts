import { ProfileResponse } from "@/types/profile";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem {
  data: ProfileResponse;
  timestamp: number;
}

const cache: { [key: string]: CacheItem } = {};

export const getCachedProfile = (
  identifier: string
): ProfileResponse | null => {
  const item = cache[identifier];
  if (item && Date.now() - item.timestamp < CACHE_DURATION) {
    return item.data;
  }
  return null;
};

export const setCachedProfile = (
  identifier: string,
  data: ProfileResponse
): void => {
  cache[identifier] = { data, timestamp: Date.now() };
};
