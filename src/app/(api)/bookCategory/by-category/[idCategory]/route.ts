import { getBooksFromCategory } from "@/app/actions/bookCategory";

export async function GET(request: Request, context: { params: { idCategory: string } }) {
  const params = await context.params;
  const idCategory = Number(params.idCategory);
  if (isNaN(idCategory)) {
    return new Response(JSON.stringify({ success: false, message: "Paramètre idCategory manquant ou invalide" }), { status: 400 });
  }
  return getBooksFromCategory({ idCategory });
}