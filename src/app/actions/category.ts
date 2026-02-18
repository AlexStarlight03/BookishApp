import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function createCategory(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Un nom de categorie est requis" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Erreur, cette categorie existe deja" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de la création de la categorie", error: error.message },
      { status: 500 }
    );
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des categories", error: error.message },
      { status: 500 }
    );
  }
}

export async function modifyCategory(request: Request, { id }: { id: number }) {
  try {
    const body = await request.json();
    const { name } = body;
    const updateData: { name?: string } = {};
    if (name) updateData.name = name;

    const category = await prisma.category.update({
      where: { idCategory: id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Categorie non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Erreur lors de la modification de la categorie", success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function getCategoryById({ id }: { id: number }) {
  const category = await prisma.category.findUnique({
    where: { idCategory: id },
  });
  if (!category) {
    return NextResponse.json({ success: false, message: "Categorie non trouvée" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: category }, { status: 200 });
}

export async function deleteCategory({ id }: { id: number }) {
  await prisma.bookCategory.deleteMany({
    where: { idCategory: id },
  });
  await prisma.category.delete({
    where: { idCategory: id },
  });

  return NextResponse.json({ success: true, message: "Catégorie supprimée" });
}