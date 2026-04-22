import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are loaded, fallback to mock values to prevent runtime crashes during UI development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-xyz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
