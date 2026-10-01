import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surface a clear error instead of a cryptic network failure in the browser.
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in your .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
