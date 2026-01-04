import type { Request, Response } from "express";
import prisma from "../prisma/prisma.js";


export const createBookStatus = async (req: Request, res: Response) => {
    try {
        const { idBook, idBookshelf, idUser, dateStart, dateEnd, currPage } = req.body;
        if (!idBook || !idBookshelf || !idUser) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur, livre et shelf sont necessaires.'
            });
        }

        const bookStatus = await prisma.bookStatus.create({
            data: {
                idBook: Number(idBook),
                idBookshelf: Number(idBookshelf),
                idUser: Number(idUser),
                dateStart: dateStart ? new Date(dateStart) : null,
                dateEnd: dateEnd ? new Date(dateEnd) : null,
                currPage: currPage !== undefined ? Number(currPage) : null
            }
        });

        res.status(201).json({
            success: true,
            bookStatus
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: 'Ce statut de livre existe déjà.'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du statut de livre',
            error: error.message
        });
    }
};

export const getAllBookStatus = async (req: Request, res: Response) => {
    try {
        const bookStatus = await prisma.bookStatus.findMany();
        res.status(200).json({
            success: true,
            data: bookStatus
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statuts',
            error: error.message
        });
    }
};


export const getBookStatusById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: "Paramètre 'id' manquant" });
        }
        const [idBookshelf, idBook] = req.params.id.split('-').map(Number);
        if (!idBookshelf || !idBook) {
            return res.status(400).json({ success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" });
        }
        const bookStatus = await prisma.bookStatus.findUnique({
            where: {
                idBookshelf_idBook: {
                    idBook,
                    idBookshelf
                }
            }
        });
        if (!bookStatus) {
            return res.status(404).json({ success: false, message: 'Statut non trouvé' });
        }
        res.status(200).json({ success: true, data: bookStatus });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du statut',
            error: error.message
        });
    }
};

export const modifyBookStatus = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: "Paramètre 'id' manquant" });
        }
        const [idBookshelf, idBook] = req.params.id.split('-').map(Number);
        if (!idBookshelf || !idBook) {
            return res.status(400).json({ success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" });
        }
        const { dateStart, dateEnd, currPage } = req.body;
        const updateData: { dateStart?: Date; dateEnd?: Date; currPage?: number } = {};
        if (dateStart !== undefined) updateData.dateStart = new Date(dateStart);
        if (dateEnd !== undefined) updateData.dateEnd = new Date(dateEnd);
        if (currPage !== undefined) updateData.currPage = Number(currPage);

        const bookStatus = await prisma.bookStatus.update({
            where: {
                idBookshelf_idBook: {
                    idBook,
                    idBookshelf
                }
            },
            data: updateData
        });
        res.status(200).json({ success: true, data: bookStatus });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Statut non trouvé'
            });
        }
        res.status(500).json({
            message: 'Erreur lors de la modification du statut',
            success: false,
            error: error.message
        });
    }
};



export const deleteBookStatus = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: "Paramètre 'id' manquant" });
        }
        const [idBookshelf, idBook] = req.params.id.split('-').map(Number);
        if (!idBookshelf || !idBook) {
            return res.status(400).json({ success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" });
        }
        await prisma.bookStatus.delete({
            where: {
                idBookshelf_idBook: {
                    idBook,
                    idBookshelf
                }
            }
        });
        res.status(200).json({
            success: true,
            message: `Statut de livre supprimé avec succès.`
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Statut non trouvé'
            });
        }
        res.status(500).json({
            message: 'Erreur lors de la suppression du statut',
            success: false,
            error: error.message
        });
    }
};
