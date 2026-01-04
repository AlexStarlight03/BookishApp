import { Router } from "express";
import { createBookStatus, deleteBookStatus, modifyBookStatus, getBookStatusById, getAllBookStatus, getBooksFromBookshelf, getBooksFromUser} from '../controllers/bookStatusController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.post('/', createBookStatus);
router.get('/', getAllBookStatus);
router.patch('/:idBookshelf-:idBook', validateId('idBookshelf'), validateId('idBook'), modifyBookStatus);
router.get('/:idBookshelf-:idBook', validateId('idBookshelf'), validateId('idBook'), getBookStatusById);
router.delete('/:idBookshelf-:idBook', validateId('idBookshelf'), validateId('idBook'), deleteBookStatus);

router.get('/by-user/:idUser', getBooksFromUser);
router.get('/by-bookshelf/:idBookshelf', getBooksFromBookshelf);

export default router;