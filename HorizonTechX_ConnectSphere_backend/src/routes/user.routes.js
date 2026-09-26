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

router.route('/suggestions').get(userController.getSuggestions);
router.route('/profile').patch(uploadAvatar, updateProfileRules, validate, userController.updateProfile);
router.route('/profile').put(uploadAvatar, updateProfileRules, validate, userController.updateProfile);
router.route('/profile').post(uploadAvatar, updateProfileRules, validate, userController.updateProfile);

router.route('/:username').get(usernameParam, validate, userController.getProfile);
router.route('/:username/posts').get(usernameParam, paginationRules, validate, postController.getUserPosts);

export default router;