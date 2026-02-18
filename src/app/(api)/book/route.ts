import { getBooks, createBook } from "@/app/actions/book";

export async function GET() {
  return getBooks();
}

export async function POST(request: Request) {
  return createBook(request);
}