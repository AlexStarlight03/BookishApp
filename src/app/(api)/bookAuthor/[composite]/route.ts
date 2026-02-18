import { addBookAuthor, deleteBookAuthor } from "@/app/actions/bookAuthor";

export async function POST(request: Request, context: { params: { composite: string } }) {
  const params = await context.params;
  const [idAuthorStr, idBookStr] = params.composite.split("-");
  const idAuthor = Number(idAuthorStr);
  const idBook = Number(idBookStr);
  if (isNaN(idAuthor) || isNaN(idBook)) {
    return new Response(JSON.stringify({ success: false, message: "Format d'identifiant invalide (attendu: idAuthor-idBook)" }), { status: 400 });
  }
  return addBookAuthor({ idAuthor, idBook });
}

export async function DELETE(request: Request, context: { params: { composite: string } }) {
  const params = await context.params;
  const [idAuthorStr, idBookStr] = params.composite.split("-");
  const idAuthor = Number(idAuthorStr);
  const idBook = Number(idBookStr);
  if (isNaN(idAuthor) || isNaN(idBook)) {
    return new Response(JSON.stringify({ success: false, message: "Format d'identifiant invalide (attendu: idAuthor-idBook)" }), { status: 400 });
  }
  return deleteBookAuthor({ idAuthor, idBook });
}