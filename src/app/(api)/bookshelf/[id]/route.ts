import { getBookshelfById, modifyBookshelf, deleteBookshelf } from "@/app/actions/bookshelf";

export async function GET(request: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return getBookshelfById({ id });
}

export async function PATCH(request: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return modifyBookshelf(request, { id });
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return deleteBookshelf({ id });
}