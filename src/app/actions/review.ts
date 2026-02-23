"use server";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function createReview({ idUser, googleBooksId, rating, full_review }: { idUser: string, googleBooksId: string, rating: number, full_review: string }) {
  try {
    if (!rating) {
      return { success: false, message: "Une note est requise" };
    }

    const book = await prisma.book.findUnique({
      where: { googleBooksId },
    });
    if (!book) {
      return { success: false, message: "Livre non trouvé" };
    }

    const review = await prisma.review.create({
      data: {
        idUser,
        idBook: book.idBook,
        rating: Number(rating),
        full_review,
      },
    });

    return { success: true, review };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Erreur, un review pour ce livre existe deja" };
    }
    return { success: false, message: "Erreur lors de la création du review", error: error.message };
  }
}

export async function getReviews() {
  try {
    const reviews = await prisma.review.findMany();
    return { success: true, data: reviews };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des reviews", error: error.message };
  }
}

export async function modifyReview({ id, rating, full_review }: { id: number, rating?: number, full_review?: string }) {
  try {
    const updateData: { rating?: number; full_review?: string } = {};
    if (rating !== undefined) updateData.rating = Number(rating);
    if (full_review !== undefined) updateData.full_review = full_review;

    const review = await prisma.review.update({
      where: { idReview: id },
      data: updateData,
    });

    return { success: true, data: review };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Review non trouvé" };
    }
    return { message: "Erreur lors de la modification du review", success: false, error: error.message };
  }
}

export async function getReviewById({ id }: { id: number }) {
  const review = await prisma.review.findUnique({
    where: { idReview: id },
  });
  if (!review) {
    return { success: false, message: "Review non trouvé" };
  }
  return { success: true, data: review };
}

export async function deleteReview({ id }: { id: number }) {
  await prisma.review.delete({
    where: { idReview: id },
  });
  return { success: true, message: `Review avec l'id ${id} supprimé avec succès` };
}

export async function getReviewsFromUser({ idUser }: { idUser: string }) {
  try {
    if (!idUser) {
      return { success: false, message: "Paramètre idUser manquant ou invalide" };
    }
    const reviews = await prisma.review.findMany({
      where: { idUser },
      include: { 
        book: true,
        user: { select: { username: true, avatar: true } },
      },
    });

    const reviewsWithStatus = await Promise.all(
      reviews.map(async (review) => {
        const bookStatus = await prisma.bookStatus.findFirst({
          where: {
            idBook: review.idBook,
            idUser: review.idUser,
          },
          include: {
            bookshelf: true,
          },
        });
        return {
          ...review,
          bookStatus,
        };
      })
    );

    return { success: true, data: reviewsWithStatus };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des reviews de l'utilisateur", error: error.message };
  }
}

export async function getReviewsFromBook({ googleBooksId }: { googleBooksId: string }) {
  try {
    if (!googleBooksId) {
      return { success: false, message: "Paramètre googleBooksId manquant ou invalide" };
    }
    const book = await prisma.book.findUnique({
      where: { googleBooksId },
    });
    if (!book) {
      return { success: false, message: "Livre non trouvé" };
    }
    const reviews = await prisma.review.findMany({
      where: { idBook: book.idBook },
      include: { user: { select: { username: true, avatar: true } } },
    });
    return { reviews };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des reviews du livre", error: error.message };
  }
}