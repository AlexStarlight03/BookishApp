import { getReviews, createReview } from "@/app/actions/review";
import { NextRequest } from "next/server";

export async function GET() {
  return getReviews();
}

export async function POST(request: NextRequest) {
  return createReview(request);
}