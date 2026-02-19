import { addBookCategory, deleteBookCategory } from "@/app/actions/bookCategory";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest, context: { params: Promise<{ composite: string }> }) {
  const params = await context.params;
  const [idCategoryStr, idBookStr] = params.composite.split("-");
  const idCategory = Number(idCategoryStr);
  const idBook = Number(idBookStr);
  if (isNaN(idCategory) || isNaN(idBook)) {
    return new Response(JSON.stringify({ success: false, message: "Format d'identifiant invalide (attendu: idCategory-idBook)" }), { status: 400 });
  }
  return addBookCategory({idCategory, idBook});
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ composite: string }> }) {
  const params = await context.params;
  const [idCategoryStr, idBookStr] = params.composite.split("-");
  const idCategory = Number(idCategoryStr);
  const idBook = Number(idBookStr);
  if (isNaN(idCategory) || isNaN(idBook)) {
    return new Response(JSON.stringify({ success: false, message: "Format d'identifiant invalide (attendu: idCategory-idBook)" }), { status: 400 });
  }
  return deleteBookCategory({idCategory, idBook});
}