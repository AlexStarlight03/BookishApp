import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function createBookStatus(request: Request) {
  try {
    const body = await request.json();
    const { idBook, idBookshelf, idUser, dateStart, dateEnd, currPage } = body;
    if (!idBook || !idBookshelf || !idUser) {
      return NextResponse.json(
        { success: false, message: "Un utilisateur, livre et shelf sont necessaires." },
        { status: 400 }
      );
    }

    const bookStatus = await prisma.bookStatus.create({
      data: {
        idBook: Number(idBook),
        idBookshelf: Number(idBookshelf),
        idUser: Number(idUser),
        dateStart: dateStart ? new Date(dateStart) : null,
        dateEnd: dateEnd ? new Date(dateEnd) : null,
        currPage: currPage !== undefined ? Number(currPage) : null,
      },
    });

    return NextResponse.json({ success: true, bookStatus }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Ce statut de livre existe déjà." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de la création du statut de livre", error: error.message },
      { status: 500 }
    );
  }
}

export async function getAllBookStatus() {
  try {
    const bookStatus = await prisma.bookStatus.findMany();
    return NextResponse.json({ success: true, data: bookStatus }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des statuts", error: error.message },
      { status: 500 }
    );
  }
}

export async function getBookStatusById({ idBookshelf, idBook }: { idBookshelf: number, idBook: number }) {
  try {
    if (!idBookshelf || !idBook) {
      return NextResponse.json(
        { success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" },
        { status: 400 }
      );
    }
    const bookStatus = await prisma.bookStatus.findUnique({
      where: {
        idBookshelf_idBook: {
          idBook,
          idBookshelf,
        },
      },
    });
    if (!bookStatus) {
      return NextResponse.json({ success: false, message: "Statut non trouvé" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: bookStatus }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération du statut", error: error.message },
      { status: 500 }
    );
  }
}

export async function modifyBookStatus(request: Request, { idBookshelf, idBook }: { idBookshelf: number, idBook: number }) {
  try {
    if (!idBookshelf || !idBook) {
      return NextResponse.json(
        { success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const { dateStart, dateEnd, currPage } = body;
    const updateData: { dateStart?: Date; dateEnd?: Date; currPage?: number } = {};
    if (dateStart !== undefined) updateData.dateStart = new Date(dateStart);
    if (dateEnd !== undefined) updateData.dateEnd = new Date(dateEnd);
    if (currPage !== undefined) updateData.currPage = Number(currPage);

    const bookStatus = await prisma.bookStatus.update({
      where: {
        idBookshelf_idBook: {
          idBook,
          idBookshelf,
        },
      },
      data: updateData,
    });
    return NextResponse.json({ success: true, data: bookStatus }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Statut non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Erreur lors de la modification du statut", success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function deleteBookStatus({ idBookshelf, idBook }: { idBookshelf: number, idBook: number }) {
  try {
    if (!idBookshelf || !idBook) {
      return NextResponse.json(
        { success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" },
        { status: 400 }
      );
    }
    await prisma.bookStatus.delete({
      where: {
        idBookshelf_idBook: {
          idBook,
          idBookshelf,
        },
      },
    });
    return NextResponse.json(
      { success: true, message: "Statut de livre supprimé avec succès." },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Statut non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Erreur lors de la suppression du statut", success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function getBooksFromBookshelf({ idBookshelf }: { idBookshelf: number }) {
  try {
    if (!idBookshelf) {
      return NextResponse.json(
        { success: false, message: "Paramètre idBookshelf manquant ou invalide" },
        { status: 400 }
      );
    }
    const books = await prisma.bookStatus.findMany({
      where: { idBookshelf },
    });
    return NextResponse.json({ success: true, data: books }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des livres de la bibliotheque", error: error.message },
      { status: 500 }
    );
  }
}

export async function getBooksFromUser({ idUser }: { idUser: number }) {
  try {
    if (!idUser) {
      return NextResponse.json(
        { success: false, message: "Paramètre idUser manquant ou invalide" },
        { status: 400 }
      );
    }
    const books = await prisma.bookStatus.findMany({
      where: { idUser },
    });
    return NextResponse.json({ success: true, data: books }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des livres de l'utilisateur", error: error.message },
      { status: 500 }
    );
  }
}