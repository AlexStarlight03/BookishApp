import { getAuthors, createAuthor } from "@/app/actions/author";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return getAuthors();
}

export async function POST(request: NextRequest) {
  return createAuthor(request);
}