import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import env from '../src/configs/env.config.js';
import { isDBConnected } from '../src/configs/db.config.js';
import ApiResponse from './utils/ApiResponse.js';
import sanitizeBody from './middlewares/sanitize.middleware.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';
// import routes from './routes/index.js';
import { API_PREFIX } from "./constents.js"


const app = express();

if (env.isProd) app.set('trust proxy', 1);

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);

app.use(compression());

if (env.nodeEnv !== 'test')
  app.use(morgan(env.isProd ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(sanitizeBody);

// health check is above the rate limiters so uptime monitors never get blocked
app.get(`${API_PREFIX}/health`, (_req, res) => {
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

// app.use(API_PREFIX, routes);

// these two must stay last
app.use(notFound);
app.use(errorHandler);

export default app;