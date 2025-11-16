import { createClient } from "@supabase/supabase-js";

import type { Database } from "../db/database.types.ts";

// Note: This client is only used for local development and types
// In production, the client is created dynamically in middleware
// using environment variables (CloudFlare runtime, import.meta.env, or process.env)

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.SUPABASE_KEY || process.env.SUPABASE_KEY || "";

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_KEY in your environment."
  );
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export type for use in services
export type SupabaseClient = typeof supabaseClient;
