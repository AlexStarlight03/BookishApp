import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: { idUser: true, username: true, email: true, avatar: true, createdAt: true },
  });
  return NextResponse.json({ success: true, data: users }, { status: 200 });
}

export async function getCurrentUser() {
  const user = await requireAuth();
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  return NextResponse.json({ success: true, data: dbUser });
}

export async function updateUser({ username, avatar }: { username?: string; avatar?: string }) {
  const user = await requireAuth();
  const updated = await prisma.user.update({
    where: { email: user.email },
    data: { ...(username && { username }), ...(avatar && { avatar }) },
  });
  return NextResponse.json({ success: true, data: updated });
}

export async function deleteUser() {
  const user = await requireAuth();
  await prisma.user.delete({ where: { email: user.email } });
  return NextResponse.json({ success: true, message: "Utilisateur supprimé avec succès" }, { status: 200 });
}

export async function getUserById({ id }: { id: number }) {
  const user = await prisma.user.findUnique({
    where: { idUser: id },
    select: { idUser: true, username: true, email: true, avatar: true, createdAt: true },
  });
  if (!user) {
    return NextResponse.json({ success: false, message: "Utilisateur non trouvé" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: user }, { status: 200 });
}

export async function createUser(request: Request) {
  try {
    const body = await request.json();
    const { username, email, stackAuthId } = body; // stackAuthId de Stack Auth

    if (!username || !email || !stackAuthId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: { username, email, stackAuthId },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
}