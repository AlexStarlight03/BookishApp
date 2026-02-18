import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function addBookCategory({ idCategory, idBook }: { idCategory: number, idBook: number }) {
  try {
    if (!idBook || !idCategory) {
      return NextResponse.json(
        { success: false, message: "idBook et idCategory sont requis" },
        { status: 400 }
      );
    }

    const bookCategory = await prisma.bookCategory.create({
      data: {
        idBook,
        idCategory,
      },
    });

    return NextResponse.json({ success: true, bookCategory }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Cette relation existe déjà" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'ajout de la relation BookCategory", error: error.message },
      { status: 500 }
    );
  }
}

export async function deleteBookCategory({ idCategory, idBook }: { idCategory: number, idBook: number }) {
  try {
    if (!idCategory || !idBook) {
      return NextResponse.json(
        { success: false, message: "Format d'identifiant invalide (attendu: idCategory-idBook)" },
        { status: 400 }
      );
    }
    await prisma.bookCategory.delete({
      where: {
        idCategory_idBook: {
          idCategory,
          idBook,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Relation BookCategory supprimée (Category: ${idCategory}, Book: ${idBook})`,
    }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Relation BookCategory non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression de la relation BookCategory", error: error.message },
      { status: 500 }
    );
  }
}

export async function getCategoriesFromBook({ idBook }: { idBook: number }) {
  try {
    if (!idBook) {
      return NextResponse.json(
        { success: false, message: "Paramètre idBook manquant ou invalide" },
        { status: 400 }
      );
    }
    const categories = await prisma.bookCategory.findMany({
      where: { idBook },
    });
    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des categories du livre", error: error.message },
      { status: 500 }
    );
  }
}

export async function getBooksFromCategory({ idCategory }: { idCategory: number } ) {
  try {
    if (!idCategory) {
      return NextResponse.json(
        { success: false, message: "Paramètre idCategory manquant ou invalide" },
        { status: 400 }
      );
    }
    const books = await prisma.bookCategory.findMany({
      where: { idCategory },
    });
    return NextResponse.json({ success: true, data: books }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des livres de la categorie", error: error.message },
      { status: 500 }
    );
  }
}