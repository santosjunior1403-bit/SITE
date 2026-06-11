import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

let client = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("seu-projeto") && !supabaseAnonKey.includes("sua-chave")) {
  client = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error("Supabase environment variables are missing or incorrectly configured.");
}

export const supabase = client;
