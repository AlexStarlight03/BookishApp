"use server";

import prisma from "@/lib/prisma";

export async function createBookshelf(body: any) {
  const { idUser, name, description } = body;
  if (!idUser || !name) {
    return { success: false, message: "Un nom de bibliotheque est requis" };
  }
  const user = await prisma.user.findUnique({ where: { idUser } });
  if (!user) {
    return { success: false, message: "Utilisateur non trouvé" };
  }
  try {
    const bookshelf = await prisma.bookshelf.create({
      data: { idUser, name, description: description ?? null },
    });
    return { success: true, bookshelf };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Erreur, ce bookshelf existe deja" };
    }
    return { success: false, message: "Erreur lors de la création du bookshelf", error: error.message };
  }
}

export async function getBookshelves() {
  try {
    const bookshelves = await prisma.bookshelf.findMany();
    return { success: true, data: bookshelves };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des bookshelves", error: error.message };
  }
}

export async function getBookshelvesByUserId({ idUser, page = 1, pageSize = 10 }: { idUser: string; page?: number; pageSize?: number }) {
  try {
    if (!idUser) {
      return { success: false, message: "Paramètre idUser manquant ou invalide" };
    }
    const skip = (page - 1) * pageSize;
    const [bookshelves, total] = await Promise.all([
      prisma.bookshelf.findMany({
        where: { idUser },
        include: {
          booksBookshelf: {
            include: {
              book: {
                include: {
                  bookStatus: true,
                  authors: { include: { author: true } },
                },
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { idBookshelf: "asc" },
      }),
      prisma.bookshelf.count({ where: { idUser } }),
    ]);
    const bookshelvesWithCount = bookshelves.map((shelf) => ({
      ...shelf,
      bookCount: shelf.booksBookshelf.length,
    }));
    return { success: true, data: bookshelvesWithCount, total };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des bookshelves par utilisateur", error: error.message };
  }
}

export async function modifyBookshelf({ id }: { id: number }, body: any) {
  if (!id) {
    return { success: false, message: "ID de bookshelf manquant ou invalide" };
  }
  try {
    const { name, description } = body || {};
    const updateData: { name?: string; description?: string | null } = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    const bookshelf = await prisma.bookshelf.update({
      where: { idBookshelf: id },
      data: updateData,
    });
    return { success: true, data: bookshelf };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Bookshelf non trouvé" };
    }
    return { message: "Erreur lors de la modification du bookshelf", success: false, error: error.message };
  }
}

export async function getBookshelfById({ id }: { id: number }) {
  const bookshelf = await prisma.bookshelf.findUnique({
    where: { idBookshelf: id },
    include: {
      booksBookshelf: {
        include: {
          book: {
            include: {
              bookStatus: true,
              authors: { include: { author: true } },
            },
          },
        },
      },
    },
  });
  if (!bookshelf) {
    return { success: false, message: "Bookshelf non trouvé" };
  }
  return { success: true, data: bookshelf };
}

export async function deleteBookshelf({ id }: { id: number }) {
  // Delete related BookStatus records first
  await prisma.bookStatus.deleteMany({ where: { idBookshelf: id } });
  // Now delete the bookshelf
  await prisma.bookshelf.delete({ where: { idBookshelf: id } });
  return { success: true, message: `Bookshelf avec l'id ${id} supprimé avec succès` };
}

// Alias used in some components
export async function getBookshelvesByUser(userId: string) {
  return getBookshelvesByUserId({ idUser: userId });
}

export async function addBookToShelf({ googleBooksId, idBookshelf, idUser }: { googleBooksId: string; idBookshelf: number; idUser: string }) {
  const { createBookStatus } = await import("./bookStatus");
  return createBookStatus({ googleBooksId, idBookshelf, idUser });
}

export async function moveBookToShelf(
  { idBookshelf, idBook }: { idBookshelf: number; idBook: number },
  body: { idBookshelf: number }
) {
  const { modifyBookStatus } = await import("./bookStatus");
  return modifyBookStatus({ idBookshelf, idBook }, body);
}