import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { registerRules, loginRules } from '../validators/auth.validator.js';

const router = Router();

router.route('/register').post(registerRules, validate, authController.register);
router.route('/login').post(loginRules, validate, authController.login);
router.route('/logout').post(authController.logout);
router.route('/me').get(protect, authController.getMe);

export default router;