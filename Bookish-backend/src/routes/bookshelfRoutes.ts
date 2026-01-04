import { Router } from "express";
import { createBookshelf, deleteBookshelf, modifyBookshelf, getBookshelvesByUserId, getBookshelfById, getBookshelves} from '../controllers/bookshelfController'
import { validateId } from "../middleware/handleError";

const router = Router();


router.post('/', createBookshelf);
router.get('/', getBookshelves)
router.patch('/:id', validateId('id'), modifyBookshelf);
router.get('/:id', validateId('id'), getBookshelfById);
router.get('/by-user/:idUser', validateId('idUser'), getBookshelvesByUserId);
router.delete('/:id', validateId('id'), deleteBookshelf);

export default router;