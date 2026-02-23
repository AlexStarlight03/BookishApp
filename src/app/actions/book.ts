"use server";
import prisma from "@/lib/prisma";

export async function createBook(body: any) {
  try {
    const { title, editor, nb_pages, description, isbn, cover_img_url, googleBooksId, authors } = body;
    if (!title || !googleBooksId) {
      return { success: false, message: "Le titre et googleBooksId sont requis" };
    }

    const book = await prisma.book.create({
      data: {
        title,
        editor: editor ?? null,
        nb_pages: nb_pages !== undefined ? Number(nb_pages) : null,
        description: description ?? null,
        isbn: isbn ?? null,
        cover_img_url: cover_img_url ?? null,
        googleBooksId: googleBooksId,
      },
    });

    if (Array.isArray(authors)) {
      for (const authorName of authors) {
        let author = await prisma.author.findFirst({
          where: { name: authorName },
        });
        if (!author) {
          author = await prisma.author.create({
            data: { name: authorName },
          });
        }
        await prisma.bookAuthor.create({
          data: {
            idBook: book.idBook,
            idAuthor: author.idAuthor,
          },
        });
      }
    }

    return { success: true, book };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Cet ISBN existe déjà" };
    }
    return { success: false, message: "Erreur lors de la création du livre", error: error.message };
  }
}

export async function getBooks() {
  try {
    const books = await prisma.book.findMany({
      include: {
        authors: {
          include: { author: true }
        }
      }
    });
    return { success: true, data: books };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des livres", error: error.message };
  }
}

export async function getBookById({ googleBooksId }: { googleBooksId: string }) {
  if (!googleBooksId) {
    return { success: false, message: "googleBooksId manquant ou invalide" };
  }
  const book = await prisma.book.findUnique({
    where: { googleBooksId },
    include: {
      authors: {
        include: {
          author: true
        }
      }
    }
  });
  if (!book) {
    return { success: false, message: "Livre non trouvé" };
  }
  return { book };
}

export async function updateBook(googleBooksId: string, body: any) {
  try {
    const { title, editor, nb_pages, description, isbn, cover_img_url } = body || {};
    const updateData: {
      title?: string;
      editor?: string | null;
      nb_pages?: number | null;
      description?: string | null;
      isbn?: string | null;
      cover_img_url?: string | null;
    } = {};
    if (title !== undefined) updateData.title = title;
    if (editor !== undefined) updateData.editor = editor;
    if (nb_pages !== undefined) updateData.nb_pages = Number(nb_pages);
    if (description !== undefined) updateData.description = description;
    if (isbn !== undefined) updateData.isbn = isbn;
    if (cover_img_url !== undefined) updateData.cover_img_url = cover_img_url;
    const book = await prisma.book.update({
      where: { googleBooksId: googleBooksId },
      data: updateData,
    });
    return { success: true, data: book };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Livre non trouvé" };
    }
    if (error.code === "P2002") {
      return { success: false, message: "ISBN déjà utilisé" };
    }
    return { message: "Erreur lors de la modification du livre", success: false, error: error.message };
  }
}

export async function deleteBook({ googleBooksId }: { googleBooksId: string }) {
  await prisma.book.delete({
    where: { googleBooksId: googleBooksId },
  });
  return { success: true, message: `Livre avec l'id ${googleBooksId} supprimé avec succès` };
}