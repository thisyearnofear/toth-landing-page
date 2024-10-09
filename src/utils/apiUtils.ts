// src/utils/apiUtils.ts

import { NextResponse } from "next/server";

export async function fetchFromExternalAPI(url: string) {
  const pinataJwt = process.env.PINATA_JWT;

  if (!pinataJwt) {
    console.error("PINATA_JWT is not set");
    throw new Error("Internal server error");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${pinataJwt}`,
      "Cache-Control": "no-cache",
    },
    cache: "no-store",
  });

  const jsonData = await response.json();
  console.log("Fetched data from:", url, jsonData); // Log the raw data

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from external API: ${response.statusText}`
    );
  }

  return jsonData;
}

export function handleAPIError(error: unknown) {
  console.error(error);
  return NextResponse.json(
    {
      message: "Error fetching data",
      error: error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}
