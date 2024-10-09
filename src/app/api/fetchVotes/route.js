// src/app/api/fetchVotes/route.js

import { NextResponse } from "next/server";
import { fetchFromExternalAPI, handleAPIError } from "@/utils/apiUtils";

export async function GET() {
  try {
    const data = await fetchFromExternalAPI(
      "https://toth-bec749001fd2.herokuapp.com/allVotesForRounds"
    );
    return NextResponse.json(data);
  } catch (error) {
    return handleAPIError(error);
  }
}
