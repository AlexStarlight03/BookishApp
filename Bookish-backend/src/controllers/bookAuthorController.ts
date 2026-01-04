import type { Request, Response } from "express";
import prisma from "../prisma/prisma.js";


export const addBookAuthor = async (req: Request, res: Response) => {
	try {
		const { idBook, idAuthor } = req.body;
		if (!idBook || !idAuthor) {
			return res.status(400).json({
				success: false,
				message: "idBook et idAuthor sont requis"
			});
		}

		const bookAuthor = await prisma.bookAuthor.create({
			data: {
				idBook: Number(idBook),
				idAuthor: Number(idAuthor)
			}
		});

		res.status(201).json({
			success: true,
			bookAuthor
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
			message: "Erreur lors de l'ajout de la relation BookAuthor",
			error: error.message
		});
	}
};


export const deleteBookAuthor = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({
				success: false,
				message: "id est requis"
			});
		}
		
		const [idAuthor, idBook] = id.split('-').map(Number);
		if (!idAuthor || !idBook) {
			return res.status(400).json({
				success: false,
				message: "Format d'identifiant invalide (attendu: idAuthor-idBook)"
			});
		}

		await prisma.bookAuthor.delete({
			where: {
				idAuthor_idBook: {
					idAuthor,
					idBook
				}
			}
		});

		res.status(200).json({
			success: true,
			message: `Relation BookAuthor supprimée (Author: ${idAuthor}, Book: ${idBook})`
		});
	} catch (error: any) {
		if (error.code === 'P2025') {
			return res.status(404).json({
				success: false,
				message: 'Relation BookAuthor non trouvée'
			});
		}
		res.status(500).json({
			success: false,
			message: "Erreur lors de la suppression de la relation BookAuthor",
			error: error.message
		});
	}
};
