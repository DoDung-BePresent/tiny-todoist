/**
 * Node modules
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

/**
 * Custom modules
 */
import config from '@/config';
import logger from '@/lib/logger';
import limiter from '@/lib/express-rate-limit';
import { errorHandler, notFoundHandler } from '@/middlewares/error.middleware';

/**
 * Router
 */
import v1Routes from '@/routes';

/**
 * Types
 */
import type { CorsOptions } from 'cors';

/**
 * Express app initial
 */
const app = express();

/**
 * Configure CORS options
 */
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.warn(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};

// Apply middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024, // Only compress response larger than 1KB
  }),
);
app.use(helmet());
app.use(limiter);

app.use('/api/v1', v1Routes);

// Error handler
app.use(notFoundHandler);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.json({
    msg: 'Hello everyone',
  });
});

export default app;
