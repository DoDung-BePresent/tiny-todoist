/**
 * Node modules
 */
import { PrismaClient } from '@prisma/client';

/**
 * Custom modules
 */
import config from '@/config';
import logger from '@/lib/logger';

declare global {
  var __prisma: PrismaClient | undefined;
}

const clientOptions = {
  log: [
    {
      emit: 'event' as const,
      level: 'query' as const,
    },
    {
      emit: 'event' as const,
      level: 'error' as const,
    },
    {
      emit: 'event' as const,
      level: 'info' as const,
    },
    {
      emit: 'event' as const,
      level: 'warn' as const,
    },
  ],
};

const prisma: PrismaClient<typeof clientOptions> =
  globalThis.__prisma ||
  new PrismaClient({
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });

if (config.NODE_ENV === 'development' && config.LOG_QUERIES === 'true') {
  prisma.$on('query', (e: any) => {
    if (e.duration > 1000) {
      logger.warn(`🐌 Slow Query detected:`, {
        query: e.query,
        duration: `${e.duration}ms`,
      });
    }
  });
}

prisma.$on('error', (e: any) => {
  logger.error('❌ Prisma Error:', {
    message: e.message,
  });
});

prisma.$on('warn', (e: any) => {
  logger.warn(`⚠️ Prisma Warning: ${e.message}`);
});

if (config.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    logger.info('📤 Database disconnected successfully');
  } catch (error) {
    logger.error('❌ Database disconnect failed:', error);
  }
};

export default prisma;
