import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../db/database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export const onRequest = defineMiddleware(async (context, next) => {
  // Get JWT token from Authorization header (used by API endpoints)
  const authHeader = context.request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  // Create Supabase client with user's JWT token if available
  // This ensures RLS policies work correctly for authenticated API requests
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });

  context.locals.supabase = supabase;

  // Note: We don't protect routes here because:
  // 1. Middleware doesn't have access to localStorage (where tokens are stored)
  // 2. All route protection is handled client-side by AuthProvider
  // 3. This middleware only sets up Supabase client for API endpoints

  return next();
});
