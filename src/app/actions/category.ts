"use server";
import prisma from "@/lib/prisma";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des categories", error: error.message };
  }
}

export async function updateCategory(id: number, body: any) {
  try {
    const { name } = body || {};
    const updateData: { name?: string } = {};
    if (name) updateData.name = name;
    const category = await prisma.category.update({
      where: { idCategory: id },
      data: updateData,
    });
    return { success: true, data: category };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Categorie non trouvé" };
    }
    return { message: "Erreur lors de la modification de la categorie", success: false, error: error.message };
  }
}

export async function getCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: { idCategory: id },
  });
  if (!category) {
    return { success: false, message: "Categorie non trouvée" };
  }
  return { success: true, data: category };
}

export async function deleteCategory(id: number) {
  await prisma.bookCategory.deleteMany({
    where: { idCategory: id },
  });
  await prisma.category.delete({
    where: { idCategory: id },
  });
  return { success: true, message: "Catégorie supprimée" };
}