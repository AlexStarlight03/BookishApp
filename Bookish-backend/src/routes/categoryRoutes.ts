import { Router } from "express";
import { createCategory,deleteCategory, getCategories, modifyCategory, getCategoryById} from '../controllers/categoryController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.get('/', getCategories);
router.post('/',createCategory);
router.patch('/:id',validateId('id'),modifyCategory);
router.get('/:id', validateId('id'),getCategoryById)
router.delete('/:id',validateId('id'),deleteCategory);

export default router;