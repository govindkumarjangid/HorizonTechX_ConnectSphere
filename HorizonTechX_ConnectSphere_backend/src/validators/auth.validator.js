import { body } from 'express-validator';

export const registerRules = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Full name cannot exceed 60 characters'),
  body('username')
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3 to 30 characters')
    .matches(/^[a-z0-9_.]+$/)
    .withMessage('Username can only contain letters, numbers, underscore and dot'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Please provide a valid email address'),
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
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required'),
  body('identifier')
    .custom((value, { req }) => {
      const id = value || req.body.username || req.body.email;
      if (!id || typeof id !== 'string' || !id.trim()) {
        throw new Error('Username or email is required');
      }
      return true;
    }),
];