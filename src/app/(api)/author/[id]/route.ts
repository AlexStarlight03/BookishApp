import { getAuthorById, modifyAuthor, deleteAuthor } from "@/app/actions/author";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return getAuthorById({ params });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return modifyAuthor(request, { params });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return deleteAuthor({ params });
}