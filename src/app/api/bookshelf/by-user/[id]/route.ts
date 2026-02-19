import { getBookshelvesByUserId } from "@/app/actions/bookshelf";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const idUser = Number(params.id);
  if (isNaN(idUser)) {
    return new Response(JSON.stringify({ success: false, message: "Paramètre idUser manquant ou invalide" }), { status: 400 });
  }
  return getBookshelvesByUserId({ idUser });
}