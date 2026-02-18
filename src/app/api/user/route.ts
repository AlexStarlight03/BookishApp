import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/app/actions/user";

export async function GET() {
  const result = await getUsers();
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  return createUser(request);
}