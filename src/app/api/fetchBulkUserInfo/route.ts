import { NextRequest, NextResponse } from "next/server";
import { fetchFromExternalAPI, handleAPIError } from "@/utils/apiUtils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fids = searchParams.get("fids");

  if (!fids || typeof fids !== "string" || fids.trim() === "") {
    return NextResponse.json({}, { status: 200 });
  }

  const fidArray = fids.split(",").filter((fid) => fid.trim() !== "");

  if (fidArray.length === 0) {
    return NextResponse.json({}, { status: 200 });
  }

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
  try {
    const data = await fetchFromExternalAPI(
      `https://api.pinata.cloud/v3/farcaster/users/${fid}`
    );

    if (!data.user) {
      console.warn(`User data is missing for FID: ${fid}`);
      return { fid, username: `User ${fid}`, pfp_url: null };
    }

    return {
      fid,
      username: data.user.username || `User ${fid}`,
      pfp_url: data.user.pfp_url || null,
    };
  } catch (error) {
    console.error(`Error fetching user info for FID: ${fid}`, error);
    return { fid, username: `User ${fid}`, pfp_url: null };
  }
}
