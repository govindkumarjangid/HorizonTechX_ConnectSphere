import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import commentRoutes from './comment.routes.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createPostRules } from '../validators/post.validator.js';
import { mongoIdParam, paginationRules } from '../validators/common.validator.js';

const router = Router();

router.use(protect);

router.post('/', createPostRules, validate, postController.createPost);
router.get('/feed', paginationRules, validate, postController.getFeed);
router.delete('/:postId', mongoIdParam('postId'), validate, postController.deletePost);
router.post('/:postId/like', mongoIdParam('postId'), validate, postController.toggleLike);

// Nested comments router
router.use('/:postId/comments', commentRoutes);

export default router;