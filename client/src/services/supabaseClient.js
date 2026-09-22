import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to see what Vite is receiving
console.log('Vite Env Check:', { supabaseUrl, supabaseAnonKey });

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables in client/.env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);