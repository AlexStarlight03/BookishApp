import { Router } from "express";
import { addBookCategory, deleteBookCategory, getBooksFromCategory, getCategoriesFromBook} from '../controllers/bookCategoryController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.post('/', addBookCategory);
router.delete('/:idCategory-:idBook', validateId('idCategory'), deleteBookCategory);

router.get('/by-book/:idBook', getCategoriesFromBook);
router.get('/by-category/:idCategory', getBooksFromCategory);

export default router;