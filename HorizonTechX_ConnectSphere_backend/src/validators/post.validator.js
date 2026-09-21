import { body } from 'express-validator';

export const createPostRules = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Post cannot exceed 2000 characters'),
];