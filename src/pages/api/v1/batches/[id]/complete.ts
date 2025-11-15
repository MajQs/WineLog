/**
 * Complete Batch Endpoint
 * POST /api/v1/batches/{id}/complete
 *
 * Marks a batch as completed (archived status).
 * Requires authentication and batch ownership.
 * Batch must be in active status.
 */

import type { APIRoute } from "astro";
import { completeBatch } from "../../../../../lib/batch.service";
import { uuidSchema } from "../../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../../lib/auth.helper";
import type { CompleteBatchResponseDto } from "../../../../../types";

export const prerender = false;

/**
 * POST handler for completing a batch
 * Path params:
 * - id (required): Batch UUID
 * Body:
 * - {} (empty object accepted)
 */
export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    // Get supabase client from context
    const supabase = locals.supabase;

    if (!supabase) {
      return createErrorResponse(
        {
          error: "Internal server error",
          code: "SUPABASE_CLIENT_MISSING",
        },
        500
      );
    }

    // Verify authentication
    const authResult = await verifyAuthToken(request, supabase);
    if (!authResult.success || !authResult.userId) {
      return createErrorResponse(
        authResult.error || { error: "Unauthorized", code: "UNAUTHORIZED" },
        authResult.status || 401
      );
    }

    const userId = authResult.userId;

    // Validate batch ID parameter
    const batchId = params.id;

    if (!batchId) {
      return createErrorResponse(
        {
          error: "Batch ID is required",
          code: "MISSING_BATCH_ID",
        },
        400
      );
    }

    const validation = uuidSchema.safeParse(batchId);

    if (!validation.success) {
      return createErrorResponse(
        {
          error: "Invalid batch ID format",
          code: "INVALID_UUID",
          details: { id: validation.error.errors[0]?.message || "Invalid UUID format" },
        },
        400
      );
    }

    // Complete batch using service
    try {
      const result: CompleteBatchResponseDto | null = await completeBatch(supabase, userId, validation.data);

      if (!result) {
        return createErrorResponse(
          {
            error: "Batch not found",
            code: "BATCH_NOT_FOUND",
          },
          404
        );
      }

      return createSuccessResponse(result);
    } catch (error) {
      // Handle specific business logic errors
      if (error instanceof Error && error.message === "BATCH_ALREADY_COMPLETED") {
        return createErrorResponse(
          {
            error: "Batch is already completed",
            code: "BATCH_ALREADY_COMPLETED",
          },
          409
        );
      }

      throw error; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("Error in POST /api/v1/batches/[id]/complete:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
