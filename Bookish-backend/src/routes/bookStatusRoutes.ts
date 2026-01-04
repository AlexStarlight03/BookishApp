import { Router } from "express";
import { createBookStatus, deleteBookStatus, modifyBookStatus, getBookStatusById} from '../controllers/bookStatusController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.post('/', createBookStatus);
router.patch('/:idBookshelf-:idBook', validateId('idBookshelf'), modifyBookStatus);
router.get('/:idBookshelf-:idBook', validateId('idBookshelf'), getBookStatusById);
router.delete('/:idBookshelf-:idBook', validateId('idBookshelf'), deleteBookStatus);

export default router;