import { NextRequest, NextResponse } from "next/server";
import { searchGoogleBooks } from "@/app/actions/googleBooks";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });
  try {
    const data = await searchGoogleBooks(query);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch from Google Books" }, { status: 500 });
  }
}