import { getBooksFromAuthor } from "@/app/actions/bookAuthor";

export async function GET(request: Request, context: { params: { idAuthor: string } }) {
  const params = await context.params;
  const idAuthor = Number(params.idAuthor);
  if (isNaN(idAuthor)) {
    return new Response(JSON.stringify({ success: false, message: "Paramètre idAuthor manquant ou invalide" }), { status: 400 });
  }
  return getBooksFromAuthor({ idAuthor });
}