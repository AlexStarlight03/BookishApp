import type { Request, Response } from "express";
import prisma from "../prisma/prisma.js";


export const createBook = async (req: Request, res: Response) => {
    try {
        const { title, editor, nb_pages, description, isbn, cover_img_url } = req.body;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Le titre est requis"
            });
        }

        const book = await prisma.book.create({
            data: {
                title,
                editor: editor ?? null,
                nb_pages: nb_pages !== undefined ? Number(nb_pages) : null,
                description: description ?? null,
                isbn: isbn ?? null,
                cover_img_url: cover_img_url ?? null
            }
        });

        res.status(201).json({
            success: true,
            book
        });
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(400).json({
                success: false,
                message: "Cet ISBN existe déjà"
            });
        }
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création du livre",
            error: error.message
        });
    }
};


export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await prisma.book.findMany();
        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des livres",
            error: error.message
        });
    }
};

export const modifyBook = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { title, editor, nb_pages, description, isbn, cover_img_url } = req.body;
        const idNumber = Number(id);
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
            where: { idBook: idNumber },
            data: updateData
        });

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Livre non trouvé'
            });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: 'ISBN déjà utilisé'
            });
        }
        res.status(500).json({
            message: "Erreur lors de la modification du livre",
            success: false,
            error: error.message
        });
    }
};


export const getBookById = async (req: Request, res: Response) => {
    const idBook = Number(req.params.id);
    const book = await prisma.book.findUnique({
        where: { idBook }
    });
    if (!book) {
        return res.status(404).json({ success: false, message: 'Livre non trouvé' });
    }
    res.json(book);
};


export const deleteBook = async (req: Request, res: Response) => {
    const idBook = Number(req.params.id);
    await prisma.book.delete({
        where: { idBook }
    });
    res.status(200).json({
        success: true,
        message: `Livre avec l'id ${idBook} supprimé avec succès`
    });
};
