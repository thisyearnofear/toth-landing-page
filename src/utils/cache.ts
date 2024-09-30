import { Nomination, Vote, Autosubscriber } from "../types";
import { ProfileResponse } from "../types/profile";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache: { [key: string]: CacheItem<any> } = {};

const isCacheValid = (item: CacheItem<any>) => {
  return Date.now() - item.timestamp < CACHE_DURATION;
};

function getCachedData<T>(key: string): T | null {
  const item = cache[key];
  if (item && isCacheValid(item)) {
    return item.data;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache[key] = { data, timestamp: Date.now() };
}

export const getCachedNominations = (): Nomination[] | null =>
  getCachedData<Nomination[]>("nominations");
export const setCachedNominations = (data: Nomination[]): void =>
  setCachedData("nominations", data);

export const getCachedVotes = (): Vote[] | null =>
  getCachedData<Vote[]>("votes");
export const setCachedVotes = (data: Vote[]): void =>
  setCachedData("votes", data);

export const getCachedAutosubscribers = (): Autosubscriber[] | null =>
  getCachedData<Autosubscriber[]>("autosubscribers");
export const setCachedAutosubscribers = (data: Autosubscriber[]): void =>
  setCachedData("autosubscribers", data);

export const getCachedProfile = (identifier: string): ProfileResponse | null =>
  getCachedData<ProfileResponse>(`profile_${identifier}`);
export const setCachedProfile = (
  identifier: string,
  data: ProfileResponse
): void => setCachedData(`profile_${identifier}`, data);
