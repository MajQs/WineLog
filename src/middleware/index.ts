import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../db/database.types";

export const onRequest = defineMiddleware(async (context, next) => {
  // Get environment variables from runtime context (Cloudflare Pages)
  // @ts-expect-error - runtime.env is available in Cloudflare adapter
  const supabaseUrl = context.runtime?.env?.SUPABASE_URL || import.meta.env.SUPABASE_URL;
  // @ts-expect-error - runtime.env is available in Cloudflare adapter
  const supabaseAnonKey = context.runtime?.env?.SUPABASE_KEY || import.meta.env.SUPABASE_KEY;

  // Validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    });
    throw new Error("Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_KEY environment variables.");
  }

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
