// src/app/api/fetchNominations/route.js
import { NextResponse } from "next/server";

// API route handler for fetching nominations
export async function GET() {
  const pinataJwt = process.env.PINATA_JWT; // Access the JWT securely from the environment variables
  const pinataGateway = process.env.PINATA_GATEWAY; // Optional, if you're using the gateway

  try {
    const response = await fetch(
      "https://toth-bec749001fd2.herokuapp.com/allNominationsForRounds",
      {
        headers: {
          Authorization: `Bearer ${pinataJwt}`, // Use the JWT token securely
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from external API");
    }

    const data = await response.json();
    return NextResponse.json(data); // Return the data as JSON
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}
