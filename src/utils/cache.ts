// src/utils/cache.ts

import { Nomination, Vote, Autosubscriber, Winner } from "../types";
import { ProfileResponse } from "../types/profile";

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const CACHE_DURATIONS = {
  nominations: 100 * 60 * 1000, // 100 minutes
  votes: 50 * 60 * 1000, // 50 minutes
  autosubscribers: 1500 * 60 * 1000, // 1500 minutes
  winners: 5 * 60 * 1000, // 5 minutes
};

interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

class Cache {
  private storage: Storage;

  constructor() {
    this.storage =
      typeof window !== "undefined" ? window.localStorage : (null as any);
  }

  private getItem<T>(key: string): CacheItem<T> | null {
    if (!this.storage) return null;
    const item = this.storage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private setItem<T>(key: string, data: T): void {
    if (!this.storage) return;
    const cacheDuration =
      CACHE_DURATIONS[key as keyof typeof CACHE_DURATIONS] ||
      DEFAULT_CACHE_DURATION;
    const item: CacheItem<T> = {
      data,
      expiresAt: Date.now() + cacheDuration,
    };
    this.storage.setItem(key, JSON.stringify(item));
  }

  get<T>(key: string): T | null {
    const item = this.getItem<T>(key);
    if (item && item.expiresAt > Date.now()) {
      return item.data;
    }
    return null;
  }

  set<T>(key: string, data: T): void {
    this.setItem(key, data);
  }

  invalidate(key: string): void {
    if (this.storage) {
      this.storage.removeItem(key);
    }
  }

  invalidateAll(): void {
    if (this.storage) {
      this.storage.clear();
    }
  }
}

const cache = new Cache();

export const getCachedNominations = () =>
  cache.get<Nomination[]>("nominations");
export const setCachedNominations = (data: Nomination[]) =>
  cache.set("nominations", data);

export const getCachedVotes = () => cache.get<Vote[]>("votes");
export const setCachedVotes = (data: Vote[]) => cache.set("votes", data);

export const getCachedAutosubscribers = () =>
  cache.get<Autosubscriber[]>("autosubscribers");
export const setCachedAutosubscribers = (data: Autosubscriber[]) =>
  cache.set("autosubscribers", data);

export const getCachedWinners = () => cache.get<Winner[]>("winners");
export const setCachedWinners = (data: Winner[]) => cache.set("winners", data);

export const getCachedProfile = (identifier: string) =>
  cache.get<ProfileResponse>(`profile_${identifier}`);
export const setCachedProfile = (identifier: string, data: ProfileResponse) =>
  cache.set(`profile_${identifier}`, data);

export const invalidateCache = (key: string) => cache.invalidate(key);
export const invalidateAllCache = () => cache.invalidateAll();
