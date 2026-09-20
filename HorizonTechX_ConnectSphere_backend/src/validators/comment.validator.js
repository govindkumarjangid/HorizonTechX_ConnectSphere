import { body } from 'express-validator';

export const addCommentRules = [
  body('text').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be 1 to 1000 characters'),
];