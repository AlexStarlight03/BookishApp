import { getAuthorsFromBook } from "@/app/actions/bookAuthor";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ idBook: string }> }) {
  const params = await context.params;
  const idBook = Number(params.idBook);
  if (isNaN(idBook)) {
    return new Response(JSON.stringify({ success: false, message: "Paramètre idBook manquant ou invalide" }), { status: 400 });
  }
  return getAuthorsFromBook({ idBook });
}