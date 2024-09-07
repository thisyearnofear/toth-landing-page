// src/app/api/fetchUserInfo/route.js

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  const pinataJwt = process.env.PINATA_JWT;

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.pinata.cloud/v3/farcaster/users/${fid}`,
      {
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching user data: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.user) {
      throw new Error("User data is missing 'user' property");
    }

    return NextResponse.json({
      username: data.user.username,
      pfp_url: data.user.pfp_url,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
