import type { Request, Response } from "express";
import prisma from "../prisma/prisma.js";

export const createReview = async (req: Request, res: Response) => {
    try {
        const { idUser, idBook, rating, full_review } = req.body;
        if (!rating) {
            return res.status(400).json({
                success: false,
                message: 'Une note est requise'
            });
        }

        const review = await prisma.review.create({
            data: {
                idUser: Number(idUser),
                idBook: Number(idBook),
                rating: Number(rating),
                full_review
            }
        });

        res.status(201).json({
            success: true,
            review
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: 'Erreur, un review pour ce livre existe deja'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du review',
            error: error.message
        });
    }
};


export const getReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.review.findMany();
        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des reviews',
            error: error.message
        });
    }
};


export const modifyReview = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { rating, full_review } = req.body;
        const idNumber = Number(id);
        const updateData: { rating?: number; full_review?: string } = {};
        if (rating !== undefined) updateData.rating = Number(rating);
        if (full_review !== undefined) updateData.full_review = full_review;

        const review = await prisma.review.update({
            where: { idReview: idNumber },
            data: updateData
        });

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Review non trouvé'
            });
        }
        res.status(500).json({
            message: 'Erreur lors de la modification du review',
            success: false,
            error: error.message
        });
    }
};


export const getReviewById = async (req: Request, res: Response) => {
    const idReview = Number(req.params.id);
    const review = await prisma.review.findUnique({
        where: { idReview }
    });
    if (!review) {
        return res.status(404).json({ success: false, message: 'Review non trouvé' });
    }
    res.json(review);
};


export const deleteReview = async(req: Request, res: Response) =>{
    const idReview = Number(req.params.id);

    await prisma.review.delete({
        where: {idReview}
    })
    res.status(200).json({
        success: true, 
        message : `Review avec l'id ${idReview} supprimé avec succès`})
}

export const getReviewsFromUser = async (req: Request, res: Response) => {
    try {
        const idUser = Number(req.params.idUser);
        if (!idUser) {
            return res.status(400).json({ success: false, message: "Paramètre idUser manquant ou invalide" });
        }
        const reviews = await prisma.review.findMany({
            where: { idUser }
        });
        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des reviews de l\'utilisateur',
            error: error.message
        });
    }
}

export const getReviewsFromBook = async (req: Request, res: Response) => {
    try {
        const idBook= Number(req.params.idBook);
        if (!idBook) {
            return res.status(400).json({ success: false, message: "Paramètre idBook manquant ou invalide" });
        }
        const reviews = await prisma.review.findMany({
            where: { idBook }
        });
        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des reviews du livre',
            error: error.message
        });
    }
}