import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function addBookAuthor({ idAuthor, idBook }: { idAuthor: number, idBook: number }) {
  try {
    if (!idBook || !idAuthor) {
      return NextResponse.json(
        { success: false, message: "idBook et idAuthor sont requis" },
        { status: 400 }
      );
    }

    const bookAuthor = await prisma.bookAuthor.create({
      data: {
        idBook,
        idAuthor,
      },
    });

    return NextResponse.json({ success: true, bookAuthor }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Cette relation existe déjà" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'ajout de la relation BookAuthor", error: error.message },
      { status: 500 }
    );
  }
}

export async function deleteBookAuthor({ idAuthor, idBook }: { idAuthor: number, idBook: number }) {
  try {
    if (!idAuthor || !idBook) {
      return NextResponse.json(
        { success: false, message: "Format d'identifiant invalide (attendu: idAuthor-idBook)" },
        { status: 400 }
      );
    }
    await prisma.bookAuthor.delete({
      where: {
        idAuthor_idBook: {
          idAuthor,
          idBook,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Relation BookAuthor supprimée (Author: ${idAuthor}, Book: ${idBook})`,
    }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Relation BookAuthor non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression de la relation BookAuthor", error: error.message },
      { status: 500 }
    );
  }
}

export async function getAuthorsFromBook({ idBook }: { idBook: number }) {
  try {
    if (!idBook) {
      return NextResponse.json(
        { success: false, message: "Paramètre idBook manquant ou invalide" },
        { status: 400 }
      );
    }
    const authors = await prisma.bookAuthor.findMany({
      where: { idBook },
    });
    return NextResponse.json({ success: true, data: authors }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des auteurs du livre", error: error.message },
      { status: 500 }
    );
  }
}

export async function getBooksFromAuthor({ idAuthor }: { idAuthor: number }) {
  try {
    if (!idAuthor) {
      return NextResponse.json(
        { success: false, message: "Paramètre idAuthor manquant ou invalide" },
        { status: 400 }
      );
    }
    const books = await prisma.bookAuthor.findMany({
      where: { idAuthor },
    });
    return NextResponse.json({ success: true, data: books }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des livres de l'auteur", error: error.message },
      { status: 500 }
    );
  }
}