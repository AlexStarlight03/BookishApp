"use server";
import prisma from "@/lib/prisma";

export async function createBookCategory({ idBook, idCategory }: { idBook: number, idCategory: number }) {
  try {
    if (!idBook || !idCategory) {
      return { success: false, message: "idBook et idCategory sont requis" };
    }
    const bookCategory = await prisma.bookCategory.create({
      data: {
        idBook,
        idCategory,
      },
    });
    return { success: true, bookCategory };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Cette relation existe déjà" };
    }
    return { success: false, message: "Erreur lors de l'ajout de la relation BookCategory", error: error.message };
  }
}

export async function deleteBookCategory({ idBook, idCategory }: { idBook: number, idCategory: number }) {
  try {
    if (!idBook || !idCategory) {
      return { success: false, message: "Format d'identifiant invalide (attendu: idCategory-idBook)" };
    }
    await prisma.bookCategory.delete({
      where: {
        idCategory_idBook: {
          idCategory,
          idBook,
        },
      },
    });
    return { success: true, message: `Relation BookCategory supprimée (Category: ${idCategory}, Book: ${idBook})` };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Relation BookCategory non trouvée" };
    }
    return { success: false, message: "Erreur lors de la suppression de la relation BookCategory", error: error.message };
  }
}

export async function getCategoriesForBook(idBook: number) {
  try {
    if (!idBook) {
      return { success: false, message: "Paramètre idBook manquant ou invalide" };
    }
    const categories = await prisma.bookCategory.findMany({
      where: { idBook },
    });
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des categories du livre", error: error.message };
  }
}

export async function getBooksForCategory(idCategory: number) {
  try {
    if (!idCategory) {
      return { success: false, message: "Paramètre idCategory manquant ou invalide" };
    }
    const books = await prisma.bookCategory.findMany({
      where: { idCategory },
    });
    return { success: true, data: books };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des livres de la categorie", error: error.message };
  }
}