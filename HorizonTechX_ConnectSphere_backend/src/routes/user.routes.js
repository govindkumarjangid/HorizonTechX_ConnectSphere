import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import * as postController from '../controllers/post.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { paginationRules } from '../validators/common.validator.js';
import { usernameParam, updateProfileRules } from '../validators/user.validator.js';

const router = Router();

router.use(protect);

router.get('/suggestions', userController.getSuggestions);
router.patch('/profile', uploadAvatar, updateProfileRules, validate, userController.updateProfile);
router.put('/profile', uploadAvatar, updateProfileRules, validate, userController.updateProfile);
router.post('/profile', uploadAvatar, updateProfileRules, validate, userController.updateProfile);

router.get('/:username', usernameParam, validate, userController.getProfile);
router.get('/:username/posts', usernameParam, paginationRules, validate, postController.getUserPosts);

export default router;