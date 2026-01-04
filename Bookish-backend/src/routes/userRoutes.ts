import { Router } from "express";
import { createUser,deleteUser, getUsers, modifyUser, getUserById, login} from '../controllers/userController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.post('/login', login);
router.get('/', getUsers);
router.post('/',createUser);
router.patch('/:id',validateId('id'),modifyUser);
router.get('/:id', validateId('id'),getUserById)
router.delete('/:id',validateId('id'),deleteUser);

export default router;