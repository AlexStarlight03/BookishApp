import { createBookshelf, getBookshelves } from "@/app/actions/bookshelf";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return createBookshelf(request);
}

export async function GET() {
  return getBookshelves();
}