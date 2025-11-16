/**
 * Rating Service
 * Handles business logic for batch rating operations
 */

import type { SupabaseClient } from "../db/supabase.client";
import type { RatingDto, UpsertRatingCommand } from "../types";

/**
 * Gets the rating for a specific batch
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @returns Rating DTO or null if not found
 * @throws Error if batch doesn't exist or doesn't belong to user
 */
export async function getRating(supabase: SupabaseClient, userId: string, batchId: string): Promise<RatingDto | null> {
  // 1. Verify batch exists and belongs to user
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("id")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (batchError) {
    throw new Error(`Failed to fetch batch: ${batchError.message}`);
  }

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  // 2. Get rating
  const { data: rating, error: ratingError } = await supabase
    .from("ratings")
    .select("batch_id, user_id, rating, created_at")
    .eq("batch_id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (ratingError) {
    throw new Error(`Failed to fetch rating: ${ratingError.message}`);
  }

  if (!rating) {
    return null;
  }

  return {
    batch_id: rating.batch_id,
    user_id: rating.user_id,
    rating: rating.rating,
    created_at: rating.created_at,
  };
}

/**
 * Creates or updates a rating for a batch
 * Only archived batches can be rated
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @param command - Upsert rating command with rating value (1-5)
 * @returns Created/updated rating DTO and operation type
 * @throws Error if batch doesn't exist, doesn't belong to user, or is not archived
 */
export async function upsertRating(
  supabase: SupabaseClient,
  userId: string,
  batchId: string,
  command: UpsertRatingCommand
): Promise<{ rating: RatingDto; isNew: boolean }> {
  // 1. Verify batch exists, belongs to user, and is archived
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("id, status")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (batchError) {
    throw new Error(`Failed to fetch batch: ${batchError.message}`);
  }

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  if (batch.status !== "archived") {
    throw new Error("BATCH_NOT_COMPLETED");
  }

  // 2. Check if rating already exists
  const { data: existingRating } = await supabase
    .from("ratings")
    .select("batch_id")
    .eq("batch_id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  const isNew = !existingRating;

  // 3. Upsert rating
  const { data: rating, error: upsertError } = await supabase
    .from("ratings")
    .upsert(
      {
        batch_id: batchId,
        user_id: userId,
        rating: command.rating,
      },
      {
        onConflict: "batch_id,user_id",
      }
    )
    .select("batch_id, user_id, rating, created_at")
    .single();

  if (upsertError || !rating) {
    throw new Error(`Failed to upsert rating: ${upsertError?.message}`);
  }

  return {
    rating: {
      batch_id: rating.batch_id,
      user_id: rating.user_id,
      rating: rating.rating,
      created_at: rating.created_at,
    },
    isNew,
  };
}
