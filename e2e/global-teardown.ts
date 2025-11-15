/**
 * Global Teardown for Playwright Tests
 * Cleans up test data from Supabase database after all tests complete
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/db/database.types";

async function globalTeardown() {
  console.log("\n🧹 [Global Teardown] Starting database cleanup...");

  // Get Supabase credentials from environment
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const testUserId = process.env.E2E_USERNAME_ID;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("⚠️  [Global Teardown] Supabase credentials not found. Skipping cleanup.");
    console.warn("    Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.test");
    return;
  }

  if (!testUserId) {
    console.warn("⚠️  [Global Teardown] E2E_USERNAME_ID not set. Skipping cleanup for safety.");
    console.warn("    Set E2E_USERNAME_ID in .env.test to enable cleanup");
    return;
  }

  // Create Supabase client with service role key (bypasses RLS)
  const supabase = createClient<Database>(
    supabaseUrl,
    supabaseServiceKey
    // , {
    //   auth: {
    //     autoRefreshToken: false,
    //     persistSession: false,
    //   },
    // }
  );

  // const { error: signInError } = await supabase.auth.signInWithPassword({
  //   email: process.env.E2E_USERNAME!,
  //   password: process.env.E2E_PASSWORD!,
  //   });

  // if (signInError) {
  //   console.error('Error signing in:', signInError);
  //   throw signInError;
  // }

  try {
    console.log(`🗑️  [Global Teardown] Deleting test data for user: ${testUserId}...`);

    // Delete in correct order (respecting foreign key constraints)
    // 1. Delete ratings (references batches)
    const { error } = await supabase.from("ratings").delete().eq("user_id", testUserId);

    if (error) {
      console.error("❌ [Global Teardown] Failed to delete ratings:", error);
    } else {
      console.log(`   ✓ Deleted ratings`);
    }

    // 2. Delete notes (references batches and batch_stages)
    const { error: notesError } = await supabase.from("notes").delete().eq("user_id", testUserId);

    if (notesError) {
      console.error("❌ [Global Teardown] Failed to delete notes:", notesError);
    } else {
      console.log(`   ✓ Deleted notes`);
    }

    // 3. Delete batch_stages (references batches)
    // We need to get batch IDs first to filter stages by user's batches
    const { data: batches } = await supabase.from("batches").select("id").eq("user_id", testUserId);

    const batchIds = batches?.map((b) => b.id) || [];

    if (batchIds.length > 0) {
      const { error: stagesError } = await supabase.from("batch_stages").delete().in("batch_id", batchIds);

      if (stagesError) {
        console.error("❌ [Global Teardown] Failed to delete batch_stages:", stagesError);
      } else {
        console.log(`   ✓ Deleted batch stages`);
      }
    } else {
      console.log("   ✓ No batch stages to delete");
    }

    // 4. Delete batches (only for this user)
    const { error: batchesError } = await supabase.from("batches").delete().eq("user_id", testUserId);

    if (batchesError) {
      console.error("❌ [Global Teardown] Failed to delete batches:", batchesError);
    } else {
      console.log(`   ✓ Deleted batches`);
    }

    console.log("✅ [Global Teardown] Database cleanup complete!\n");
  } catch (error) {
    console.error("❌ [Global Teardown] Cleanup failed:", error);
    // Don't throw - we don't want to fail the test run if cleanup fails
  }
}

export default globalTeardown;
