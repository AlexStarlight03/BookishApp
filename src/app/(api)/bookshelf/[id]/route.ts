import { getBookshelfById, modifyBookshelf, deleteBookshelf } from "@/app/actions/bookshelf";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return getBookshelfById({ id });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return modifyBookshelf(request, { id });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return deleteBookshelf({ id });
}