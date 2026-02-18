import { getBooks, createBook } from "@/app/actions/book";
import { NextRequest } from "next/server";

export async function GET() {
  return getBooks();
}

export async function POST(request: NextRequest) {
  return createBook(request);
}