import type {Request, Response , NextFunction } from "express"


export const validateId = (paramName : string = 'id') => {
    return(req: Request, res: Response, next: NextFunction)=>{
        const id = req.params[paramName]
        console.log('Validating Id:', id);
        const idNumber = Number(id);

        if(!id || id === undefined || idNumber <= 0 || isNaN(idNumber) || !Number.isInteger(idNumber)){
            console.log('Invalide Id:', id);
            return res.status(400).json({
                success: false,
                message : `L'identifiant ${paramName} fourni est invalide. Il doit être un entier positif.`
            })
        }
        console.log('Valid Id:', id);
        return next();
     }
}
