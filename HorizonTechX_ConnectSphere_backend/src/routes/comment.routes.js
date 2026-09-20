import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { mongoIdParam, paginationRules } from '../validators/common.validator.js';
import { addCommentRules } from '../validators/comment.validator.js';

// mounted on /posts/:postId/comments, mergeParams gives access to :postId
const router = Router({ mergeParams: true });

router.post('/', addCommentRules, validate, commentController.addComment);
router.get('/', paginationRules, validate, commentController.getComments);
router.delete('/:commentId', mongoIdParam('commentId'), validate, commentController.deleteComment);

export default router;