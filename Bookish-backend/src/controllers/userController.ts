import type { Request, Response } from "express";

import prisma from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Le nom et l\'email sont requis'
            })
        }
        const existingUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ message: 'User already exists with this username!' });
        }
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'User already exists with this email!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });
        const defaultShelves = [
            { name: "Want to read", description: "Books you want to read" },
            { name: "Reading", description: "Books you are currently reading" },
            { name: "Done", description: "Books you have finished reading" }
        ];
        await Promise.all(
            defaultShelves.map(shelf =>
                prisma.bookshelf.create({
                    data: {
                        idUser: user.idUser,
                        name: shelf.name,
                        description: shelf.description
                    }
                })
            )
        );
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: 'Cet email existe déjà'
            });
        }
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de l'utilisateur",
            error: error.message
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found!' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password!' });
    
    const token = jwt.sign(
        {sub: user.idUser, email: user.email},
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );

    return res.status(200).json({
        success: true,
        message: 'Login successful!',
        token
    });
}


export const getUsers = async(req: Request, res: Response)=>{
    try{
        const users = await prisma.user.findMany({
        })

        res.status(200).json({
            success: true,
            data: users,
        })

    } catch (error: any){
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des utilisateurs',
            error: error.message
        })
    }
}

export const modifyUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { username, email, password } = req.body;
        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            return res.status(400).json({
                success: false,
                message: "Paramètre id invalide"
            });
        }
        const updateData: { username?: string; email?: string; password?: string } = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Aucune donnée à mettre à jour"
            });
        }
        const user = await prisma.user.update({
            where: { idUser: idNumber },
            data: updateData
        });
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: 'Email ou Nom utilisateur déjà utilisé'
            });
        }

        res.status(500).json({
            message: "Erreur lors de la modification de l'utilisateur",
            success: false,
            error: error.message
        });
    }
};


export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            return res.status(400).json({
                success: false,
                message: "Paramètre id invalide"
            });
        }
        const user = await prisma.user.findUnique({
            where: { idUser: idNumber }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'utilisateur",
            error: error.message
        });
    }
};


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            return res.status(400).json({
                success: false,
                message: "Paramètre id invalide"
            });
        }
        await prisma.user.delete({
            where: { idUser: idNumber }
        });
        res.status(200).json({
            success: true,
            message: `Utilisateur avec l'id ${idNumber} supprimé avec succès`
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'utilisateur",
            error: error.message
        });
    }
};
