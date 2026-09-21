import { body } from 'express-validator';

export const registerRules = [
  body('username')
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3 to 30 characters')
    .matches(/^[a-z0-9_.]+$/)
    .withMessage('Username can only contain letters, numbers, underscore and dot'),
  body('password')
    .isString()
    .isLength({ min: 6, max: 72 })
    .withMessage('Password must be 6 to 72 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Bio cannot exceed 160 characters'),
  body('avatar')
    .optional()
    .trim(),
];

export const loginRules = [
  body('username')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required'),
];