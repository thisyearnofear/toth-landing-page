// utils/userUtils.ts
export const generateUserUrl = (username: string | undefined): string => {
  if (!username) return "#";
  return username.startsWith("@")
    ? `https://warpcast.com/${username.slice(1)}`
    : `https://warpcast.com/${username}`;
};
