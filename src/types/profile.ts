export interface ProfileLink {
  link: string;
  handle: string;
}

export interface SocialStats {
  uid?: number;
  follower?: number;
  following?: number;
}

export interface ProfileLinks {
  website?: ProfileLink;
  farcaster?: ProfileLink;
  lens?: ProfileLink;
  [key: string]: ProfileLink | undefined;
}

export type Platform = "ens" | "farcaster" | "lens";

export interface Profile {
  address: string; // Wallet address or ENS
  identity: string; // ENS name or other identifier
  platform: Platform; // Platform type (ENS, Farcaster, Lens)
  displayName: string; // User's display name
  avatar: string | null; // User's avatar URL
  description: string | null; // User's description
  email: string | null; // User's email
  location: string | null; // User's location
  header: string | null; // User's header image URL
  contenthash: string | null; // Content hash for decentralized storage
  links: ProfileLinks; // Links to social profiles or websites
  social: SocialStats; // Social statistics
}

export type ProfileResponse = Profile[];
