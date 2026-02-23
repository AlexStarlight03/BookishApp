"use server";

export async function createBookAuthor({ idBook, idAuthor }: { idBook: number, idAuthor: number }) {
  try {
    if (!idBook || !idAuthor) {
      return { success: false, message: "idBook et idAuthor sont requis" };
    }
    const bookAuthor = await prisma.bookAuthor.create({
      data: {
        idBook,
        idAuthor,
      },
    });
    return { success: true, bookAuthor };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Cette relation existe déjà" };
    }
    return { success: false, message: "Erreur lors de l'ajout de la relation BookAuthor", error: error.message };
  }
}

export async function deleteBookAuthor({ idBook, idAuthor }: { idBook: number, idAuthor: number }) {
  try {
    if (!idBook || !idAuthor) {
      return { success: false, message: "Format d'identifiant invalide (attendu: idAuthor-idBook)" };
    }
    await prisma.bookAuthor.delete({
      where: {
        idAuthor_idBook: {
          idAuthor,
          idBook,
        },
      },
    });
    return { success: true, message: `Relation BookAuthor supprimée (Author: ${idAuthor}, Book: ${idBook})` };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Relation BookAuthor non trouvée" };
    }
    return { success: false, message: "Erreur lors de la suppression de la relation BookAuthor", error: error.message };
  }
}

export async function getAuthorsForBook(idBook: number) {
  try {
    if (!idBook) {
      return { success: false, message: "Paramètre idBook manquant ou invalide" };
    }
    const authors = await prisma.bookAuthor.findMany({
      where: { idBook },
    });
    return { success: true, data: authors };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des auteurs du livre", error: error.message };
  }
}

export async function getBooksForAuthor(idAuthor: number) {
  try {
    if (!idAuthor) {
      return { success: false, message: "Paramètre idAuthor manquant ou invalide" };
    }
    const books = await prisma.bookAuthor.findMany({
      where: { idAuthor },
    });
    return { success: true, data: books };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des livres de l'auteur", error: error.message };
  }
}