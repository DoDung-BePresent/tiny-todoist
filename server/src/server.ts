// NOTE: Chua that su shutdown

/**
 * Node modules
 */
import http from 'http';

/**
 * Libs
 */
import logger from '@/lib/logger';
import { connectDB, disconnectDB } from '@/lib/prisma';

/**
 * Config
 */
import config from '@/config/env.config';

/**
 * App
 */
import app from './app';

let server: http.Server;

(async () => {
  try {
    await connectDB();

    server = app.listen(config.PORT, () => {
      logger.info(`Server running http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Fail to start the server', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = () => {
  logger.info('SIGINT/SIGTERM received. Shutting down gracefully...');

  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await disconnectDB();
      logger.warn('Server SHUTDOWN');
      process.exit(0);
    } catch (error) {
      logger.error('Error during database disconnection', error);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', handleServerShutdown); // kill command or container shutdown
process.on('SIGINT', handleServerShutdown); // pressing 'Ctrl + C'
