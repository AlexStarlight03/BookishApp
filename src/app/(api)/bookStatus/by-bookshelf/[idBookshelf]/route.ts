import { getBooksFromBookshelf } from "@/app/actions/bookStatus";

export async function GET(request: Request, context: { params: { idBookshelf: string } }) {
  const params = await context.params;
  const idBookshelf = Number(params.idBookshelf);
  if (isNaN(idBookshelf)) {
    return new Response(JSON.stringify({ success: false, message: "Paramètre idBookshelf manquant ou invalide" }), { status: 400 });
  }
  return getBooksFromBookshelf({ idBookshelf });
}