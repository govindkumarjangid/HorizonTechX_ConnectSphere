import { Router } from 'express';
import * as followController from '../controllers/follow.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { mongoIdParam, paginationRules } from '../validators/common.validator.js';
import { usernameParam } from '../validators/user.validator.js';

const router = Router();

router.use(protect);

router.post('/:userId', mongoIdParam('userId'), validate, followController.follow);
router.delete('/:userId', mongoIdParam('userId'), validate, followController.unfollow);
router.get('/:username/followers', usernameParam, paginationRules, validate, followController.getFollowers);
router.get('/:username/following', usernameParam, paginationRules, validate, followController.getFollowing);

export default router;