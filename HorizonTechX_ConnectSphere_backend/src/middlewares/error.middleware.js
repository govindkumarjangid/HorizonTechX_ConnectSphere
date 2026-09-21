import env from '../configs/env.config.js';
import ApiError from '../utils/ApiError.js';

const normalizeError = (err) => {
  if (err instanceof ApiError)
    return { statusCode: err.statusCode, message: err.message, errors: err.errors };

  // Mongoose schema validation
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    return { statusCode: 400, message: 'Validation failed', errors };
  }

  // invalid ObjectId, e.g. /posts/123
  if (err.name === 'CastError')
    return { statusCode: 400, message: `Invalid ${err.path}`, errors: [] };

  // unique index violation (email, username, follow pair)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    const text = fields.length ? `${fields.join(', ')} already exists` : 'Duplicate value';
    return {
      statusCode: 409,
      message: text.charAt(0).toUpperCase() + text.slice(1),
      errors: [],
    };
  }

  if (err.name === 'TokenExpiredError')
    return { statusCode: 401, message: 'Token expired', errors: [] };

  if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError')
    return { statusCode: 401, message: 'Invalid token', errors: [] };

  // express.json() errors
  if (err.type === 'entity.parse.failed')
    return { statusCode: 400, message: 'Invalid JSON body', errors: [] };

  if (err.type === 'entity.too.large')
    return { statusCode: 413, message: 'Request body is too large', errors: [] };

  // multer (file upload) errors
  if (err.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : `Upload error: ${err.message}`;
    return { statusCode: 400, message, errors: [] };
  }

  // anything else is a bug, do not leak details in production
  return {
    statusCode: 500,
    message: env.isProd ? 'Internal server error' : err.message || 'Internal server error',
    errors: [],
  };
};

// 404 for any route that did not match. Register it after all routes.
export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

// Express knows this is an error handler because it has 4 arguments, do not remove `next`
export const errorHandler = (err, req, res, next) => {
  // response already started, let Express close the connection
  if (res.headersSent) return next(err);

  const { statusCode, message, errors } = normalizeError(err);

  if (statusCode >= 500)
    console.error(`${req.method} ${req.originalUrl} -> ${statusCode}\n`, err);

  const body = { success: false, message, data: null };
  if (errors.length > 0) body.errors = errors;
  if (env.isDev && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
};