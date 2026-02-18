import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function createBookshelf(request: Request) {
  try {
    const body = await request.json();
    const { idUser, name, description } = body;
    if (!idUser || !name) {
      return NextResponse.json(
        { success: false, message: "Un nom de bibliotheque est requis" },
        { status: 400 }
      );
    }

    const bookshelf = await prisma.bookshelf.create({
      data: {
        idUser: Number(idUser),
        name,
        description: description ?? null,
      },
    });

    return NextResponse.json({ success: true, bookshelf }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Erreur, ce bookshelf existe deja" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de la création du bookshelf", error: error.message },
      { status: 500 }
    );
  }
}

export async function getBookshelves() {
  try {
    const bookshelves = await prisma.bookshelf.findMany();
    return NextResponse.json({ success: true, data: bookshelves }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des bookshelves", error: error.message },
      { status: 500 }
    );
  }
}

export async function getBookshelvesByUserId({ idUser }: { idUser: number }) {
  try {
    if (!idUser) {
      return NextResponse.json({ success: false, message: "Paramètre idUser manquant ou invalide" }, { status: 400 });
    }
    const bookshelves = await prisma.bookshelf.findMany({
      where: { idUser },
    });
    return NextResponse.json({ success: true, data: bookshelves }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des bookshelves par utilisateur", error: error.message },
      { status: 500 }
    );
  }
}

export async function modifyBookshelf(request: Request, { id }: { id: number }) {
  try {
    const body = await request.json();
    const { name, description } = body;
    const updateData: { name?: string; description?: string | null } = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const bookshelf = await prisma.bookshelf.update({
      where: { idBookshelf: id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: bookshelf }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Bookshelf non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Erreur lors de la modification du bookshelf", success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function getBookshelfById({ id }: { id: number }) {
  const bookshelf = await prisma.bookshelf.findUnique({
    where: { idBookshelf: id },
  });
  if (!bookshelf) {
    return NextResponse.json({ success: false, message: "Bookshelf non trouvé" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: bookshelf }, { status: 200 });
}

export async function deleteBookshelf({ id }: { id: number }) {
  await prisma.bookshelf.delete({
    where: { idBookshelf: id },
  });
  return NextResponse.json({
    success: true,
    message: `Bookshelf avec l'id ${id} supprimé avec succès`,
  }, { status: 200 });
}