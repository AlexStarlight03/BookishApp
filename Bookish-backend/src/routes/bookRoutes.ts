import { Router } from "express";
import { createBook,deleteBook, getBooks, modifyBook, getBookById} from '../controllers/bookController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.get('/', getBooks);
router.post('/',createBook);
router.patch('/:id',validateId('id'),modifyBook);
router.get('/:id', validateId('id'),getBookById)
router.delete('/:id',validateId('id'),deleteBook);

export default router;