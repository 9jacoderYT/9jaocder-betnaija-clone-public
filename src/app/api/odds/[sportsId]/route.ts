import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { sportsId: string } }
) {
  const { sportsId } = params;
  const apiKey = process.env.ODDS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  if (!sportsId) {
    return NextResponse.json(
      { error: "Sports ID is required" },
      { status: 400 }
    );
  }

  try {
    const url = `https://api.the-odds-api.com/v4/sports/${sportsId}/odds/?apiKey=${apiKey}&markets=h2h,spreads,totals&regions=uk`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return NextResponse.json(
      { error: "Failed to fetch odds data" },
      { status: 500 }
    );
  }
}
