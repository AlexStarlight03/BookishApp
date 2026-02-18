import { getAuthorById, modifyAuthor, deleteAuthor } from "@/app/actions/author";

export async function GET(request: Request, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const params = "then" in context.params ? await context.params : context.params;
  return getAuthorById({ params });
}

export async function PATCH(request: Request, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const params = "then" in context.params ? await context.params : context.params;
  return modifyAuthor(request, { params });
}

export async function DELETE(request: Request, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const params = "then" in context.params ? await context.params : context.params;
  return deleteAuthor({ params });
}