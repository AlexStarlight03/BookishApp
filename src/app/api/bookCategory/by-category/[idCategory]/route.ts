import { getBooksFromCategory } from "@/app/actions/bookCategory";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ idCategory: string }> }) {
  const params = await context.params;
  const idCategory = Number(params.idCategory);
  if (isNaN(idCategory)) {
    return new Response(JSON.stringify({ success: false, message: "Paramètre idCategory manquant ou invalide" }), { status: 400 });
  }
  return getBooksFromCategory({ idCategory });
}