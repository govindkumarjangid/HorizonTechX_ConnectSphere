import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

// put this after the express-validator rules of a route
const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result
    .array({ onlyFirstError: true })
    .map((error) => ({ field: error.path, message: error.msg }));

  next(ApiError.badRequest('Validation failed', errors));
};

export default validate;