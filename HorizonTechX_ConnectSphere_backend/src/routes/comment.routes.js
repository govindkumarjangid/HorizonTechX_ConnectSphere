import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { mongoIdParam, paginationRules } from '../validators/common.validator.js';
import { addCommentRules } from '../validators/comment.validator.js';

const router = Router({ mergeParams: true });

router.use(protect);

router.post('/', mongoIdParam('postId'), addCommentRules, validate, commentController.addComment);
router.get('/', mongoIdParam('postId'), paginationRules, validate, commentController.getComments);
router.delete('/:commentId', mongoIdParam('postId'), mongoIdParam('commentId'), validate, commentController.deleteComment);

export default router;