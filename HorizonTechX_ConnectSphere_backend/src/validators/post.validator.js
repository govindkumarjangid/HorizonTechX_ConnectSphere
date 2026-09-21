import { body } from 'express-validator';

export const createPostRules = [
  body('content')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Post cannot exceed 2000 characters'),
];

export const updatePostRules = [
  body('content')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Post cannot exceed 2000 characters'),
];