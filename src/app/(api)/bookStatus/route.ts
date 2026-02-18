import { createBookStatus, getAllBookStatus } from "@/app/actions/bookStatus";

export async function POST(request: Request) {
  return createBookStatus(request);
}

export async function GET() {
  return getAllBookStatus();
}