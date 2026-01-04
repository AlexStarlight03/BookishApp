import { Router } from "express";
import { addBookAuthor, deleteBookAuthor} from '../controllers/bookAuthorController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.post('/', addBookAuthor);
router.delete('/:idAuthor-:idBook', validateId('idAuthor'), deleteBookAuthor);

export default router;