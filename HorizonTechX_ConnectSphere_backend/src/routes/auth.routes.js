import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  registerRules,
  loginRules,
  changePasswordRules,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);

// these two read the refresh token cookie, so no access token is needed
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.get('/me', protect, authController.getMe);
router.patch(
  '/change-password',
  protect,
  changePasswordRules,
  validate,
  authController.changePassword
);

export default router;