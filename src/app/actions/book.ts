import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function createBook(request: Request) {
  try {
    const body = await request.json();
    const { title, editor, nb_pages, description, isbn, cover_img_url, googleBooksId, authors } = body;
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Le titre est requis" },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        editor: editor ?? null,
        nb_pages: nb_pages !== undefined ? Number(nb_pages) : null,
        description: description ?? null,
        isbn: isbn ?? null,
        cover_img_url: cover_img_url ?? null,
        googleBooksId: googleBooksId ?? null,
      },
    });

    if (Array.isArray(authors)) {
      for (const authorName of authors) {
        let author = await prisma.author.findFirst({
          where: {name: authorName},
        });
        if (!author) {
          author = await prisma.author.create({
            data: { name: authorName },
          });
        }
        await prisma.bookAuthor.create({
          data: {
            idBook: book.idBook,
            idAuthor: author.idAuthor,
          },
        });
      }}

    return NextResponse.json({ success: true, book }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Cet ISBN existe déjà" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de la création du livre", error: error.message },
      { status: 500 }
    );
  }
}

export async function getBooks() {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json({ success: true, data: books }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des livres", error: error.message },
      { status: 500 }
    );
  }
}

export async function modifyBook(request: Request, { id }: { id: number }) {
  try {
    const body = await request.json();
    const { title, editor, nb_pages, description, isbn, cover_img_url } = body;
    const updateData: {
      title?: string;
      editor?: string | null;
      nb_pages?: number | null;
      description?: string | null;
      isbn?: string | null;
      cover_img_url?: string | null;
    } = {};
    if (title !== undefined) updateData.title = title;
    if (editor !== undefined) updateData.editor = editor;
    if (nb_pages !== undefined) updateData.nb_pages = Number(nb_pages);
    if (description !== undefined) updateData.description = description;
    if (isbn !== undefined) updateData.isbn = isbn;
    if (cover_img_url !== undefined) updateData.cover_img_url = cover_img_url;

    const book = await prisma.book.update({
      where: { idBook: id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: book }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Livre non trouvé" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "ISBN déjà utilisé" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Erreur lors de la modification du livre", success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function getBookById({ id }: { id: number }) {
  const book = await prisma.book.findUnique({
    where: { idBook: id },
  });
  if (!book) {
    return NextResponse.json({ success: false, message: "Livre non trouvé" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: book }, { status: 200 });
}

export async function deleteBook({ id }: { id: number }) {
  await prisma.book.delete({
    where: { idBook: id },
  });
  return NextResponse.json({
    success: true,
    message: `Livre avec l'id ${id} supprimé avec succès`,
  }, { status: 200 });
}