import { Router } from "express";
import { createAuthor,deleteAuthor, getAuthors, modifyAuthor, getAuthorById} from '../controllers/authorController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.get('/', getAuthors);
router.post('/',createAuthor);
router.patch('/:id',validateId('id'),modifyAuthor);
router.get('/:id', validateId('id'),getAuthorById)
router.delete('/:id',validateId('id'),deleteAuthor);

export default router;