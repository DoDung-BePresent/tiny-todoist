/**
 * Node modules
 */
import { createClient } from '@supabase/supabase-js';

/**
 * Configs
 */
import config from '@/config/env.config';

export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_KEY,
);
