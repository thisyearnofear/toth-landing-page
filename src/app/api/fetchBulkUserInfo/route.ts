import { NextRequest, NextResponse } from "next/server";
import { fetchFromExternalAPI, handleAPIError } from "@/utils/apiUtils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fids = searchParams.get("fids");

  if (!fids || typeof fids !== "string") {
    return NextResponse.json(
      { error: "FIDs must be provided as a comma-separated string" },
      { status: 400 }
    );
  }

  const fidArray = fids.split(",");

  try {
    const userInfos = await Promise.all(
      fidArray.map((fid) => fetchUserInfoFromPinata(fid))
    );

    const userInfoMap = Object.fromEntries(
      userInfos.map((info) => [info.fid, info])
    );

    return NextResponse.json(userInfoMap);
  } catch (error) {
    console.error("Error fetching bulk user info:", error);
    return handleAPIError(error);
  }
}

async function fetchUserInfoFromPinata(fid: string) {
  const data = await fetchFromExternalAPI(
    `https://api.pinata.cloud/v3/farcaster/users/${fid}`
  );

  if (!data.user) {
    throw new Error(`User data is missing for FID: ${fid}`);
  }

  return {
    fid,
    username: data.user.username,
    pfp_url: data.user.pfp_url,
  };
}
