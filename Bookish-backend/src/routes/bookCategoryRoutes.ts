import { Router } from "express";
import { addBookCategory, deleteBookCategory} from '../controllers/bookCategoryController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.post('/', addBookCategory);
router.delete('/:idCategory-:idBook', validateId('idCategory'), deleteBookCategory);

export default router;