import { createBookStatus, getAllBookStatus } from "@/app/actions/bookStatus";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return createBookStatus(request);
}

export async function GET() {
  return getAllBookStatus();
}