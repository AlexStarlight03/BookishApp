"use server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function updateYearlyGoal({ yearlyGoal }: { yearlyGoal: number }) {
  const user = await requireAuth();
  if (!user || !user.email) {
    return { success: false, message: "Utilisateur non authentifié" };
  }
  if (typeof yearlyGoal !== "number" || yearlyGoal < 1) {
    return { success: false, message: "Objectif invalide" };
  }
  const updated = await prisma.user.update({
    where: { email: user.email },
    data: { yearlyGoal },
  });
  return { success: true, data: updated };
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: { idUser: true, username: true, email: true, avatar: true, createdAt: true },
  });
  return { success: true, data: users };
}

export async function getCurrentUser() {
  const user = await requireAuth();
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  return { success: true, data: dbUser };
}

export async function updateUser({ username, avatar }: { username?: string; avatar?: string }) {
  const user = await requireAuth();
  const updated = await prisma.user.update({
    where: { email: user.email },
    data: { ...(username && { username }), ...(avatar && { avatar }) },
  });
  return { success: true, data: updated };
}

export async function deleteUser({ idUser }: { idUser: string }) {
  const user = await requireAuth();
  await prisma.user.delete({ where: { idUser} });
  return { success: true, message: "Utilisateur supprimé avec succès" };
}

export async function getUserById({ id }: { id: string }) {
  const user = await prisma.user.findUnique({
    where: { idUser: id },
    select: { idUser: true, username: true, email: true, avatar: true, createdAt: true, yearlyGoal: true },
  });
  if (!user) {
    return { success: false, message: "Utilisateur non trouvé" };
  }
  return { success: true, data: user };
}

export async function createUser(body: any) {
  try {
    const { username, email, stackAuthId } = body;

    if (!username || !email || !stackAuthId) {
      return { success: false, message: "All fields are required" };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { idUser: stackAuthId }],
      },
    });

    if (existingUser) {
      return { success: true, message: "User already exists" };
    }

    const user = await prisma.user.create({
      data: { username, email, idUser: stackAuthId },
    });

    const defaultShelves = [
      { name: "À lire", description: "Livres à lire" },
      { name: "En cours", description: "Livres en cours de lecture" },
      { name: "Terminés", description: "Livres terminés" },
    ];

    await Promise.all(
      defaultShelves.map((shelf) =>
        prisma.bookshelf.create({
          data: {
            idUser: user.idUser,
            name: shelf.name,
            description: shelf.description,
          },
        })
      )
    );

    return { success: true, user };
  } catch (error: any) {
    return { success: false, message: "Error creating user", error: error.message };
  }
}