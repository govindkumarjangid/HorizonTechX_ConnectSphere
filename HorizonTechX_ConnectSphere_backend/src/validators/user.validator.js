import { body, param } from 'express-validator';

export const usernameParam = param('username')
  .trim()
  .toLowerCase()
  .notEmpty()
  .withMessage('Username is required');

export const updateProfileRules = [
  body('username')
    .optional()
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3 to 30 characters')
    .matches(/^[a-z0-9_.]+$/)
    .withMessage('Username can only contain letters, numbers, underscore and dot'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Bio cannot exceed 160 characters'),
  body('avatar')
    .optional()
    .trim(),
];