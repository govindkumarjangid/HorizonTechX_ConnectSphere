import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import commentRoutes from './comment.routes.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadMedia } from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createPostRules, updatePostRules } from '../validators/post.validator.js';
import { mongoIdParam, paginationRules } from '../validators/common.validator.js';

const router = Router();

router.use(protect);

router.post('/', uploadMedia, createPostRules, validate, postController.createPost);
router.get('/', paginationRules, validate, postController.getFeed);
router.get('/feed', paginationRules, validate, postController.getFeed);
router.patch('/:postId', mongoIdParam('postId'), uploadMedia, updatePostRules, validate, postController.updatePost);
router.put('/:postId', mongoIdParam('postId'), uploadMedia, updatePostRules, validate, postController.updatePost);
router.delete('/:postId', mongoIdParam('postId'), validate, postController.deletePost);
router.post('/:postId/like', mongoIdParam('postId'), validate, postController.toggleLike);

// Nested comments router
router.use('/:postId/comments', commentRoutes);

export default router;