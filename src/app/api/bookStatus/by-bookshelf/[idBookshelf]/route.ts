import { getBooksFromBookshelf } from "@/app/actions/bookStatus";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ idBookshelf: string }> }) {
  const params = await context.params;
  const idBookshelf = Number(params.idBookshelf);
  if (isNaN(idBookshelf)) {
    return new Response(JSON.stringify({ success: false, message: "Paramètre idBookshelf manquant ou invalide" }), { status: 400 });
  }
  return getBooksFromBookshelf({ idBookshelf });
}