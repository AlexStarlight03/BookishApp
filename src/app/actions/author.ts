"use server";
import prisma from "@/lib/prisma";

export async function createAuthor(body: { name: string }) {
  try {
    const { name } = body;
    if (!name) {
      return { success: false, message: "Le nom ou le prénom de l'auteur est requis" };
    }
    const author = await prisma.author.create({
      data: { name },
    });
    return { success: true, data: author };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la création de l'auteur", error: error.message };
  }
}

export async function getAuthors() {
  try {
    const authors = await prisma.author.findMany();
    return { success: true, data: authors };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des auteurs", error: error.message };
  }
}

export async function getAuthorById(id: number) {
  try {
    if (isNaN(id)) {
      return { success: false, message: "Paramètre id invalide" };
    }
    const author = await prisma.author.findUnique({
      where: { idAuthor: id },
    });
    if (!author) {
      return { success: false, message: "Auteur non trouvé" };
    }
    return { success: true, data: author };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération de l'auteur", error: error.message };
  }
}

export async function updateAuthor(id: number, body: { name?: string }) {
  try {
    if (isNaN(id)) {
      return { success: false, message: "Paramètre id invalide" };
    }
    const updateData: { name?: string | null } = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (Object.keys(updateData).length === 0) {
      return { success: false, message: "Aucune donnée à mettre à jour" };
    }
    const author = await prisma.author.update({
      where: { idAuthor: id },
      data: updateData,
    });
    return { success: true, data: author };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Auteur non trouvé" };
    }
    return { success: false, message: "Erreur lors de la modification de l'auteur", error: error.message };
  }
}

export async function deleteAuthor(id: number) {
  try {
    if (isNaN(id)) {
      return { success: false, message: "Paramètre id invalide" };
    }
    await prisma.author.delete({
      where: { idAuthor: id },
    });
    return { success: true, message: `Auteur avec l'id ${id} supprimé avec succès` };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Auteur non trouvé" };
    }
    return { success: false, message: "Erreur lors de la suppression de l'auteur", error: error.message };
  }
}