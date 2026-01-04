import { Router } from "express";
import { createReview,deleteReview, getReviews, modifyReview, getReviewById} from '../controllers/reviewController'
import { validateId } from "../middleware/handleError";

const router = Router();

router.get('/', getReviews);
router.post('/',createReview);
router.patch('/:id',validateId('id'),modifyReview);
router.get('/:id', validateId('id'),getReviewById)
router.delete('/:id',validateId('id'),deleteReview);

export default router;