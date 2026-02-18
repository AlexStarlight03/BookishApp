import { getCategories, createCategory } from "@/app/actions/category";
import { NextRequest } from "next/server";

export async function GET() {
  return getCategories();
}

export async function POST(request: NextRequest) {
  return createCategory(request);
}