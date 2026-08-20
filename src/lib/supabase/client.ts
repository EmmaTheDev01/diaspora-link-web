import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://oplhyhrilbjuinejiiil.supabase.co';

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbGh5aHJpbGJqdWluZWppaWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NzQ3NjQsImV4cCI6MjEwMjU1MDc2NH0.c8J_rAk05qT8AShmiiWt3s_ae8lIjnFifxlaHyL-aH0';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
