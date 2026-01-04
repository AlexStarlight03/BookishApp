import type { Request, Response } from "express";
import prisma from "../prisma/prisma.js";


export const createAuthor = async (req: Request, res: Response) => {
    try {
        const { name, lastName } = req.body;
        if (!name && !lastName) {
            return res.status(400).json({
                success: false,
                message: "Le nom ou le prénom de l'auteur est requis"
            });
        }
        const author = await prisma.author.create({
            data: {
                name: name ?? null,
                lastName: lastName ?? null
            }
        });
        res.status(201).json({
            success: true,
            data: author
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de l'auteur",
            error: error.message
        });
    }
};


export const getAuthors = async (req: Request, res: Response) => {
    try {
        const authors = await prisma.author.findMany();
        res.status(200).json({
            success: true,
            data: authors
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des auteurs",
            error: error.message
        });
    }
};


export const modifyAuthor = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { name, lastName } = req.body;
        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            return res.status(400).json({
                success: false,
                message: "Paramètre id invalide"
            });
        }
        const updateData: { name?: string | null; lastName?: string | null } = {};
        if (name !== undefined) updateData.name = name;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Aucune donnée à mettre à jour"
            });
        }
        const author = await prisma.author.update({
            where: { idAuthor: idNumber },
            data: updateData
        });
        res.status(200).json({
            success: true,
            data: author
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Auteur non trouvé'
            });
        }
        res.status(500).json({
            message: "Erreur lors de la modification de l'auteur",
            success: false,
            error: error.message
        });
    }
};


export const getAuthorById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            return res.status(400).json({
                success: false,
                message: "Paramètre id invalide"
            });
        }
        const author = await prisma.author.findUnique({
            where: { idAuthor: idNumber }
        });
        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Auteur non trouvé"
            });
        }
        res.status(200).json({
            success: true,
            data: author
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'auteur",
            error: error.message
        });
    }
};


export const deleteAuthor = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            return res.status(400).json({
                success: false,
                message: "Paramètre id invalide"
            });
        }
        await prisma.author.delete({
            where: { idAuthor: idNumber }
        });
        res.status(200).json({
            success: true,
            message: `Auteur avec l'id ${idNumber} supprimé avec succès`
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Auteur non trouvé'
            });
        }
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'auteur",
            error: error.message
        });
    }
};
