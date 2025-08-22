/**
 * Node modules
 */
import path from 'path';
import winston from 'winston';

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

const consoleFormat = printf(
  ({ level = 'info', message, timestamp, stack }) => {
    return `[${level}] ${timestamp}: ${stack || message}`;
  },
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    errors({ stack: true }),
    json(),
  ),
  defaultMeta: {
    service: 'tiny-todoist-server',
  },
  transports: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({
          format: 'HH:mm:ss',
        }),
        consoleFormat,
      ),
    }),
  );
}

export default logger;
