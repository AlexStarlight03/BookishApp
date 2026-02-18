import { getBooksFromUser } from "@/app/actions/bookStatus";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ idUser: string }> }) {
  const params = await context.params;
  const idUser = Number(params.idUser);
  if (isNaN(idUser)) {
    return new Response(JSON.stringify({ success: false, message: "Paramètre idUser manquant ou invalide" }), { status: 400 });
  }
  return getBooksFromUser({ idUser });
}