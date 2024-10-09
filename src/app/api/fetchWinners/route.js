// src/app/api/fetchWinners/route.js

import { NextResponse } from "next/server";
import { fetchFromExternalAPI, handleAPIError } from "@/utils/apiUtils";

export async function GET() {
  try {
    const data = await fetchFromExternalAPI(
      "https://toth-bec749001fd2.herokuapp.com/winners"
    );
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
