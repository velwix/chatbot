import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export const getDb = (env) => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );
  }
  return supabaseInstance;
};
