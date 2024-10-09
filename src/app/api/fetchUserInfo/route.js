// src/app/api/fetchUserInfo/route.js

import { NextResponse } from "next/server";
import { fetchFromExternalAPI, handleAPIError } from "@/utils/apiUtils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  try {
    const data = await fetchFromExternalAPI(
      `https://api.pinata.cloud/v3/farcaster/users/${fid}`
    );
    if (!data.user) {
      throw new Error("User data is missing 'user' property");
    }
    return NextResponse.json({
      username: data.user.username,
      pfp_url: data.user.pfp_url,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
