/**
 * Node modules
 */
import path from 'path';
import winston from 'winston';

/**
 * Libs
 */
import config from '@/config/env.config';

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

const consoleFormat = printf(
  ({ level = 'info', message, timestamp, stack }) => {
    return `[${level}] ${timestamp}: ${stack || message}`;
  },
);

const transports: winston.transport[] = [];

transports.push(
  new winston.transports.Console({
    format:
      config.NODE_ENV === 'production'
        ? combine(json())
        : combine(colorize(), timestamp({ format: 'HH:mm:ss' }), consoleFormat),
  }),
);

if (config.NODE_ENV === 'development' || config.LOG_TO_FILE === 'true') {
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'dev.log'),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
    }),
  );
}

export const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
  ),
  defaultMeta: {
    service: 'tiny-todoist-server',
  },
  transports,
});

export default logger;
