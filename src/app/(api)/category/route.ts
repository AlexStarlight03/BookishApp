import { getCategories, createCategory } from "@/app/actions/category";

export async function GET() {
  return getCategories();
}

export async function POST(request: Request) {
  return createCategory(request);
}