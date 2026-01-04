import type { Request, Response } from "express";
import prisma from "../prisma/prisma.js";

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Un nom de categorie est requis'
            })
        }

        const category = await prisma.category.create({
            data: { name }
        })

        res.status(201).json({
            success: true,
            category
        })

    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: 'Erreur, cette categorie existe deja'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la categorie',
            error: error.message
        });
    }
};


export const getCategories = async(req: Request, res: Response)=>{
    try{
        const categories = await prisma.category.findMany({
        })

        res.status(200).json({
            success: true,
            data: categories,
        })

    } catch (error: any){
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des categories',
            error: error.message
        })
    }
}


export const modifyCategory = async(req:Request, res:Response) =>{
    try{
    const id = req.params.idCategory;
    const { name } = req.body;
    
    const idNumber = Number(id);
    const updateData: { name?: string}={}
    if(name) updateData.name = name;

    const category = await prisma.category.update({
        where: { idCategory: idNumber},
        data: updateData
    })

    res.status(200).json({
        success: true,
        data:category
    })
    } catch (error: any){
        if(error.code === 'P2025'){
            return res.status(404).json({
                success: false,
                message: 'Categorie non trouvé'
            })
        }

        res.status(500).json({
            message: 'Erreur lors de la modification de la categorie',
            success: false,
            error: error.message
        })

        console.log(error);
    }
}


export const getCategoryById = async (req: Request, res: Response) => {
    const idCategory = Number(req.params.idCategory);
    const category = await prisma.category.findUnique({
        where: { idCategory }
    });
    if (!category) {
        return res.status(404).json({ success: false, message: 'Categorie non trouvée' });
    }
    res.json(category);
};


export const deleteCategory = async(req: Request, res: Response) =>{
    const idCategory = Number(req.params.idCategory);

    await prisma.category.delete({
        where: {idCategory}
    })
    res.status(200).json({
        success: true, 
        message : `Categorie avec l'id ${idCategory} supprimé avec succès`})
}
