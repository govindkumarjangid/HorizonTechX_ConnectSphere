import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import env, { isOriginAllowed } from './configs/env.config.js';
import { isDBConnected } from './configs/db.config.js';
import ApiResponse from './utils/ApiResponse.js';
import sanitizeBody from './middlewares/sanitize.middleware.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';
import routes from './routes/index.js';
import { API_PREFIX } from "./constents.js";


const app = express();

if (env.isProd) app.set('trust proxy', 1);

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Rejected origin: "${origin}". Allowed origins configured:`, env.clientUrls);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

// 1. Mount CORS first so preflight and headers apply to all routes
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// 2. Security headers (allowing cross-origin requests from frontend)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(compression());

if (env.nodeEnv !== 'test')
  app.use(morgan(env.isProd ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(sanitizeBody);

// health check is above the rate limiters so uptime monitors and keep-alive cron never get blocked
app.get(['/health', '/api/health', `${API_PREFIX}/health`, '/'], (_req, res) => {
  const dbUp = isDBConnected();
  new ApiResponse(dbUp ? 200 : 503, dbUp ? 'OK' : 'Database unavailable', {
    uptime: Math.round(process.uptime()),
    database: dbUp ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  }).send(res);
});

const tooManyRequests = (message) => ({ success: false, message, data: null });

// general limit for the whole API
app.use('/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: tooManyRequests('Too many requests, please try again later'),
  })
);

// stricter limit against password guessing, only failed attempts are counted
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooManyRequests('Too many failed attempts, please try again after 15 minutes'),
});

app.use(`${API_PREFIX}/auth/login`, authLimiter);
app.use(`${API_PREFIX}/auth/register`, authLimiter);

app.use('/api', routes);
if (API_PREFIX !== '/api') {
  app.use(API_PREFIX, routes);
}

// these two must stay last
app.use(notFound);
app.use(errorHandler);

export default app;