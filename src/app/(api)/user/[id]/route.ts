import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/app/actions/user";

export async function GET(request: Request, context: { params: { id: string } }) {
  const  params  = await context.params;
  const id = Number(params.id);
  if (isNaN(id) || id < 1) {
    return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });
  }
  return await getUserById({ id });
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const result = await updateUser(data);
  return NextResponse.json(result);
}

export async function DELETE() {
  const result = await deleteUser();
  return NextResponse.json(result);
}