import { getAuthors, createAuthor } from "@/app/actions/author";

export async function GET(request: Request) {
  return getAuthors();
}

export async function POST(request: Request) {
  return createAuthor(request);
}