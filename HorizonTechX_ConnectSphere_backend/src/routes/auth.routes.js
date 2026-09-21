import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { registerRules, loginRules } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

export default router;