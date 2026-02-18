import { createBookshelf, getBookshelves } from "@/app/actions/bookshelf";

export async function POST(request: Request) {
  return createBookshelf(request);
}

export async function GET() {
  return getBookshelves();
}