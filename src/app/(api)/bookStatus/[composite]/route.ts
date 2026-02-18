import { getBookStatusById, modifyBookStatus, deleteBookStatus } from "@/app/actions/bookStatus";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: { composite: string } }) {
  const params = await context.params;
  const [idBookshelfStr, idBookStr] = params.composite.split("-");
  const idBookshelf = Number(idBookshelfStr);
  const idBook = Number(idBookStr);
  if (isNaN(idBookshelf) || isNaN(idBook)) {
    return new Response(JSON.stringify({ success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" }), { status: 400 });
  }
  return getBookStatusById({ idBookshelf, idBook });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ composite: string }> }) {
  const params = await context.params;
  const [idBookshelfStr, idBookStr] = params.composite.split("-");
  const idBookshelf = Number(idBookshelfStr);
  const idBook = Number(idBookStr);
  if (isNaN(idBookshelf) || isNaN(idBook)) {
    return new Response(JSON.stringify({ success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" }), { status: 400 });
  }
  return modifyBookStatus(request, { idBookshelf, idBook });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ composite: string }> }) {
  const params = await context.params;
  const [idBookshelfStr, idBookStr] = params.composite.split("-");
  const idBookshelf = Number(idBookshelfStr);
  const idBook = Number(idBookStr);
  if (isNaN(idBookshelf) || isNaN(idBook)) {
    return new Response(JSON.stringify({ success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" }), { status: 400 });
  }
  return deleteBookStatus({ idBookshelf, idBook });
}