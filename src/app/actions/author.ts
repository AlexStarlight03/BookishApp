import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function createAuthor(request: Request) {
  try {
    const body = await request.json();
    const { name, lastName } = body;
    if (!name && !lastName) {
      return NextResponse.json(
        { success: false, message: "Le nom ou le prénom de l'auteur est requis" },
        { status: 400 }
      );
    }
    const author = await prisma.author.create({
      data: {
        name: name ?? null,
        lastName: lastName ?? null,
      },
    });
    return NextResponse.json({ success: true, data: author }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la création de l'auteur", error: error.message },
      { status: 500 }
    );
  }
}

export async function getAuthors() {
  try {
    const authors = await prisma.author.findMany();
    return NextResponse.json({ success: true, data: authors }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des auteurs", error: error.message },
      { status: 500 }
    );
  }
}

export async function modifyAuthor(request: Request, { params }: { params: { id: string } }) {
  try {
    const idNumber = Number(params.id);
    if (isNaN(idNumber)) {
      return NextResponse.json(
        { success: false, message: "Paramètre id invalide" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const { name, lastName } = body;
    const updateData: { name?: string | null; lastName?: string | null } = {};
    if (name !== undefined) updateData.name = name;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "Aucune donnée à mettre à jour" },
        { status: 400 }
      );
    }
    const author = await prisma.author.update({
      where: { idAuthor: idNumber },
      data: updateData,
    });
    return NextResponse.json({ success: true, data: author }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Auteur non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Erreur lors de la modification de l'auteur", success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function getAuthorById({ params }: { params: { id: string } }) {
  try {
    const idNumber = Number(params.id);
    if (isNaN(idNumber)) {
      return NextResponse.json(
        { success: false, message: "Paramètre id invalide" },
        { status: 400 }
      );
    }
    const author = await prisma.author.findUnique({
      where: { idAuthor: idNumber },
    });
    if (!author) {
      return NextResponse.json(
        { success: false, message: "Auteur non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: author }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération de l'auteur", error: error.message },
      { status: 500 }
    );
  }
}

export async function deleteAuthor({ params }: { params: { id: string } }) {
  try {
    const idNumber = Number(params.id);
    if (isNaN(idNumber)) {
      return NextResponse.json(
        { success: false, message: "Paramètre id invalide" },
        { status: 400 }
      );
    }
    await prisma.author.delete({
      where: { idAuthor: idNumber },
    });
    return NextResponse.json({
      success: true,
      message: `Auteur avec l'id ${idNumber} supprimé avec succès`,
    }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Auteur non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression de l'auteur", error: error.message },
      { status: 500 }
    );
  }
}