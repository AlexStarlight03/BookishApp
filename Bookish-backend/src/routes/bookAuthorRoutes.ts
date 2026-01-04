import { Router } from "express";
import { addBookAuthor, deleteBookAuthor, getAuthorsFromBook, getBooksFromAuthor} from '../controllers/bookAuthorController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.post('/', addBookAuthor);
router.delete('/:idAuthor-:idBook', validateId('idAuthor'), deleteBookAuthor);

router.get('/by-book/:idBook', getAuthorsFromBook);
router.get('/by-author/:idAuthor', getBooksFromAuthor);

export default router;