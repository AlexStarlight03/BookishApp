import { getReviewsFromBook } from "@/app/actions/review";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ idBook: string }> }) {
  const params = await context.params;
  const idBook = Number(params.idBook);
  if (isNaN(idBook)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid idBook" }), { status: 400 });
  }
  return getReviewsFromBook({ idBook });
}