import { NextResponse } from "next/server";

export async function GET() {
  const pinataJwt = process.env.PINATA_JWT;

  try {
    const response = await fetch(
      "https://toth-bec749001fd2.herokuapp.com/approvedSignersAllowance",
      {
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch winners data from external API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching winners data", error: error.message },
      { status: 500 }
    );
  }
}
