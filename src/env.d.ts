/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db/database.types.ts";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      runtime: {
        env: {
          SUPABASE_URL: string;
          SUPABASE_KEY: string;
        };
        cf: CfProperties;
        ctx: ExecutionContext;
      };
    }
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
