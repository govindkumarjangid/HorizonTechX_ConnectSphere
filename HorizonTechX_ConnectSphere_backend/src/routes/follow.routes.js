import { Router } from 'express';
import * as followController from '../controllers/follow.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { mongoIdParam, paginationRules } from '../validators/common.validator.js';
import { usernameParam } from '../validators/user.validator.js';

const router = Router();

router.use(protect);

router.route('/:userId').post(mongoIdParam('userId'), validate, followController.follow);
router.route('/:userId').delete(mongoIdParam('userId'), validate, followController.unfollow);
router.route('/:username/followers').get(usernameParam, paginationRules, validate, followController.getFollowers);
router.route('/:username/following').get(usernameParam, paginationRules, validate, followController.getFollowing);

export default router;