import { Router } from 'express';
import * as followController from '../controllers/follow.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { mongoIdParam, paginationRules } from '../validators/common.validator.js';
import { usernameParam } from '../validators/user.validator.js';

// mounted on /users. protect is added per route (not router.use) so requests
// that belong to user.routes.js are not checked twice
const router = Router();

router.post('/:userId/follow', protect, mongoIdParam('userId'), validate, followController.follow);
router.delete(
  '/:userId/follow',
  protect,
  mongoIdParam('userId'),
  validate,
  followController.unfollow
);

router.get(
  '/:username/followers',
  protect,
  usernameParam,
  paginationRules,
  validate,
  followController.getFollowers
);
router.get(
  '/:username/following',
  protect,
  usernameParam,
  paginationRules,
  validate,
  followController.getFollowing
);

export default router;