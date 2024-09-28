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
  social?: SocialStats;
  [key: string]: ProfileLink | SocialStats | undefined;
}

export interface Profile {
  address: string;
  identity: string;
  platform: string;
  displayName: string;
  avatar: string | null;
  description: string | null;
  email: string | null;
  location: string | null;
  header: string | null;
  contenthash: string | null;
  links: ProfileLinks;
}

export type ProfileResponse = Profile[];
