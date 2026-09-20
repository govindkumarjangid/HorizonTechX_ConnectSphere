import { body } from 'express-validator';

const passwordRule = (field) =>
  body(field)
    .isString()
    .withMessage(`${field} is required`)
    .isLength({ min: 8, max: 72 })
    .withMessage('Password must be 8 to 72 characters')
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number');

export const registerRules = [
  body('username')
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3 to 30 characters')
    .matches(/^[a-z0-9_.]+$/)
    .withMessage('Username can only contain letters, numbers, underscore and dot'),
  body('email').trim().toLowerCase().isEmail().withMessage('Enter a valid email'),
  passwordRule('password'),
  body('fullName')
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('Full name is required (max 60 characters)'),
];

export const loginRules = [
  body('email').trim().toLowerCase().isEmail().withMessage('Enter a valid email'),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

export const changePasswordRules = [
  body('currentPassword').isString().notEmpty().withMessage('Current password is required'),
  passwordRule('newPassword'),
];