import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/app/actions/user";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id) || id < 1) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return await getUserById({ id });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = Number(params.id);
  const data = await request.json();
  return await updateUser({ id, ...data });
}

export async function DELETE() {
  return await deleteUser();
}