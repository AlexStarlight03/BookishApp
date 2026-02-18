import { getReviews, createReview } from "@/app/actions/review";

export async function GET() {
  return getReviews();
}

export async function POST(request: Request) {
  return createReview(request);
}