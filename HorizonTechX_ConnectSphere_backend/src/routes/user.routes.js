import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import * as postController from '../controllers/post.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';
import { paginationRules } from '../validators/common.validator.js';
import {
  usernameParam,
  updateProfileRules,
  searchRules,
} from '../validators/user.validator.js';

const router = Router();

router.use(protect);

// fixed paths first, otherwise "/:username" would swallow them
router.get('/search', searchRules, validate, userController.searchUsers);
router.get('/suggestions', userController.getSuggestions);
router.patch('/me', updateProfileRules, validate, userController.updateProfile);
router.patch('/me/avatar', uploadAvatar, userController.updateAvatar);

router.get('/:username', usernameParam, validate, userController.getProfile);
router.get(
  '/:username/posts',
  usernameParam,
  paginationRules,
  validate,
  postController.getUserPosts
);

export default router;