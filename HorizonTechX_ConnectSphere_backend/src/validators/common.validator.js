import { param, query } from 'express-validator';
import mongoose from 'mongoose';

export const mongoIdParam = (field) =>
  param(field)
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage(`Invalid ${field} ID format`);

export const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be an integer >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
