import { body } from 'express-validator';

// text is optional on create because a post can be image only (checked in the service)
export const createPostRules = [
  body('content')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Post cannot exceed 2000 characters'),
];

export const updatePostRules = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be 1 to 2000 characters'),
];