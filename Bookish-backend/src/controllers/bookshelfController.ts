import type { Request, Response } from "express";
import prisma from "../prisma/prisma.js";

export const createBookshelf = async (req: Request, res: Response) => {
    try {
        const { idUser, name, description } = req.body;
        if (!idUser || !name) {
            return res.status(400).json({
                success: false,
                message: 'Un nom de bibliotheque est requis'
            });
        }

        const bookshelf = await prisma.bookshelf.create({
            data: {
                idUser: Number(idUser),
                name,
                description: description ?? null
            }
        });

        res.status(201).json({
            success: true,
            bookshelf
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: 'Erreur, ce bookshelf existe deja'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du bookshelf',
            error: error.message
        });
    }
};


export const getBookshelves = async (req: Request, res: Response) => {
    try {
        const bookshelves = await prisma.bookshelf.findMany();
        res.status(200).json({
            success: true,
            data: bookshelves
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des bookshelves',
            error: error.message
        });
    }
};

export const getBookshelvesByUserId = async (req: Request, res: Response) => {
    try {
        const idUser = Number(req.params.idUser);
        if (!idUser) {
            return res.status(400).json({ success: false, message: "Paramètre idUser manquant ou invalide" });
        }
        const bookshelves = await prisma.bookshelf.findMany({
            where: { idUser }
        });
        res.status(200).json({
            success: true,
            data: bookshelves
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des bookshelves par utilisateur',
            error: error.message
        });
    }
};


export const modifyBookshelf = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;
        const idNumber = Number(id);
        const updateData: { name?: string; description?: string | null } = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        const bookshelf = await prisma.bookshelf.update({
            where: { idBookshelf: idNumber },
            data: updateData
        });

        res.status(200).json({
            success: true,
            data: bookshelf
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Bookshelf non trouvé'
            });
        }
        res.status(500).json({
            message: 'Erreur lors de la modification du bookshelf',
            success: false,
            error: error.message
        });
    }
};


export const getBookshelfById = async (req: Request, res: Response) => {
    const idBookshelf = Number(req.params.id);
    const bookshelf = await prisma.bookshelf.findUnique({
        where: { idBookshelf }
    });
    if (!bookshelf) {
        return res.status(404).json({ success: false, message: 'Bookshelf non trouvé' });
    }
    res.json(bookshelf);
};


export const deleteBookshelf = async (req: Request, res: Response) => {
    const idBookshelf = Number(req.params.id);
    await prisma.bookshelf.delete({
        where: { idBookshelf }
    });
    res.status(200).json({
        success: true,
        message: `Bookshelf avec l'id ${idBookshelf} supprimé avec succès`
    });
};
