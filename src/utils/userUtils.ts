// utils/userUtils.ts
export const generateUserUrl = (username: string) => {
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
  return `https://warpcast.com/${cleanUsername}`;
};
