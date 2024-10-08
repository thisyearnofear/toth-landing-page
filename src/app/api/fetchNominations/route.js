import { NextResponse } from "next/server";
import { fetchFromExternalAPI, handleAPIError } from "@/utils/apiUtils";

// API route handler for fetching nominations
export async function GET() {
  try {
    const data = await fetchFromExternalAPI(
      "https://toth-bec749001fd2.herokuapp.com/allNominationsForRounds"
    );
    return NextResponse.json(data);
  } catch (error) {
    return handleAPIError(error);
  }
}
