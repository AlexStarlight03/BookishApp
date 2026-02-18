import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function createReview(request: Request) {
  try {
    const body = await request.json();
    const { idUser, idBook, rating, full_review } = body;
    if (!rating) {
      return NextResponse.json(
        { success: false, message: "Une note est requise" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        idUser: Number(idUser),
        idBook: Number(idBook),
        rating: Number(rating),
        full_review,
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Erreur, un review pour ce livre existe deja" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Erreur lors de la création du review", error: error.message },
      { status: 500 }
    );
  }
}

export async function getReviews() {
  try {
    const reviews = await prisma.review.findMany();
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des reviews", error: error.message },
      { status: 500 }
    );
  }
}

export async function modifyReview(request: Request, { id }: { id: number }) {
  try {
    const body = await request.json();
    const { rating, full_review } = body;
    const updateData: { rating?: number; full_review?: string } = {};
    if (rating !== undefined) updateData.rating = Number(rating);
    if (full_review !== undefined) updateData.full_review = full_review;

    const review = await prisma.review.update({
      where: { idReview: id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Review non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Erreur lors de la modification du review", success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function getReviewById({ id }: { id: number }) {
  const review = await prisma.review.findUnique({
    where: { idReview: id },
  });
  if (!review) {
    return NextResponse.json({ success: false, message: "Review non trouvé" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: review }, { status: 200 });
}

export async function deleteReview({ id }: { id: number }) {
  await prisma.review.delete({
    where: { idReview: id },
  });
  return NextResponse.json({
    success: true,
    message: `Review avec l'id ${id} supprimé avec succès`,
  }, { status: 200 });
}

export async function getReviewsFromUser({ idUser }: { idUser: number }) {
  try {
    if (!idUser) {
      return NextResponse.json({ success: false, message: "Paramètre idUser manquant ou invalide" }, { status: 400 });
    }
    const reviews = await prisma.review.findMany({
      where: { idUser },
    });
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des reviews de l'utilisateur", error: error.message },
      { status: 500 }
    );
  }
}

export async function getReviewsFromBook({ idBook }: { idBook: number }) {
  try {
    if (!idBook) {
      return NextResponse.json({ success: false, message: "Paramètre idBook manquant ou invalide" }, { status: 400 });
    }
    const reviews = await prisma.review.findMany({
      where: { idBook },
    });
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des reviews du livre", error: error.message },
      { status: 500 }
    );
  }
}