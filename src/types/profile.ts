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
  address: string;
  identity: string;
  platform: Platform;
  displayName: string;
  avatar: string | null;
  description: string | null;
  email: string | null;
  location: string | null;
  header: string | null;
  contenthash: string | null;
  links: ProfileLinks;
  social: SocialStats;
}

export type ProfileResponse = Profile[];
