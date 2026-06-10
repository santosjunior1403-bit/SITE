import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

console.log("SUPABASE_URL:", supabaseUrl);

if (!supabaseUrl || supabaseUrl.includes("seu-projeto")) {
  throw new Error("VITE_SUPABASE_URL não configurada com a URL real do Supabase");
}

if (!supabaseAnonKey || supabaseAnonKey.includes("sua-chave")) {
  throw new Error("VITE_SUPABASE_ANON_KEY não configurada com a chave real do Supabase");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
