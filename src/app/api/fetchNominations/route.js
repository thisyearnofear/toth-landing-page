import { NextResponse } from "next/server";

// API route handler for fetching nominations
export async function GET() {
  const pinataJwt = process.env.PINATA_JWT; // Access the JWT securely from the environment variables

  if (!pinataJwt) {
    console.error("PINATA_JWT is not set");
    return NextResponse.json(
      { message: "PINATA_JWT is not set" },
      { status: 500 }
    );
  }

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
      const errorText = await response.text();
      console.error("Failed to fetch data from external API:", errorText);
      return NextResponse.json(
        { message: "Failed to fetch data from external API", error: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Fetched data:", data); // Log the fetched data

    return NextResponse.json(data); // Return the data as JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}
