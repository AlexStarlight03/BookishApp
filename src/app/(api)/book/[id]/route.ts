import { getBookById, modifyBook, deleteBook } from "@/app/actions/book";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id) || id < 1) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return await getBookById({ id });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return modifyBook(request, { id });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return deleteBook({ id });
}