/**
 * Node modules
 */
import dotenv from 'dotenv';

/**
 * Types
 */
import type ms from 'ms';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.API_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  LOG_QUERIES: process.env.LOG_QUERIES || 'false',
  WHITELIST_ORIGINS: ['http://localhost:5173'],
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!,
  SUPABASE_BUCKET_NAME: process.env.SUPABASE_BUCKET_NAME!,
};

export default config;
