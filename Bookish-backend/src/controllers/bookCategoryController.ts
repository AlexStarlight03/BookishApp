import type { Request, Response } from "express";
import prisma from "../prisma/prisma.js";

export const addBookCategory = async (req: Request, res: Response) => {
	try {
		const { idBook, idCategory } = req.body;
		if (!idBook || !idCategory) {
			return res.status(400).json({
				success: false,
				message: "idBook et idCategory sont requis"
			});
		}

		const bookCategory = await prisma.bookCategory.create({
			data: {
				idBook: Number(idBook),
				idCategory: Number(idCategory)
			}
		});

		res.status(201).json({
			success: true,
			bookCategory
		});
	} catch (error: any) {
		if (error.code === "P2002") {
			return res.status(400).json({
				success: false,
				message: "Cette relation existe déjà"
			});
		}
		res.status(500).json({
			success: false,
			message: "Erreur lors de l'ajout de la relation BookCategory",
			error: error.message
		});
	}
};

export const deleteBookCategory = async (req: Request, res: Response) => {
	try {
        const idCategory = Number(req.params.idCategory);
        const idBook = Number(req.params.idBook);
        if (!idCategory || !idBook) {
            return res.status(400).json({ success: false, message: "Format d'identifiant invalide (attendu: idCategory-idBook)" });
        }
		await prisma.bookCategory.delete({
			where: {
				idCategory_idBook: {
					idCategory,
					idBook
				}
			}
		});

		res.status(200).json({
			success: true,
			message: `Relation BookCategory supprimée (Category: ${idCategory}, Book: ${idBook})`
		});
	} catch (error: any) {
		if (error.code === 'P2025') {
			return res.status(404).json({
				success: false,
				message: 'Relation BookCategory non trouvée'
			});
		}
		res.status(500).json({
			success: false,
			message: "Erreur lors de la suppression de la relation BookCategory",
			error: error.message
		});
	}
};

export const getCategoriesFromBook = async (req: Request, res: Response) => {
    try {
        const idBook = Number(req.params.idBook);
        if (!idBook) {
            return res.status(400).json({ success: false, message: "Paramètre idBook manquant ou invalide" });
        }
        const categories = await prisma.bookCategory.findMany({
            where: { idBook }
        });
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des categories du livre',
            error: error.message
        });
    }
}

export const getBooksFromCategory = async (req: Request, res: Response) => {
    try {
        const idCategory = Number(req.params.idCategory);
        if (!idCategory) {
            return res.status(400).json({ success: false, message: "Paramètre idCategory manquant ou invalide" });
        }
        const books = await prisma.bookCategory.findMany({
            where: { idCategory }
        });
        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des livres de la categorie",
            error: error.message
        });
    }
}

