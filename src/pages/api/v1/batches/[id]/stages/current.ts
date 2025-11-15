/**
 * Current Stage Endpoint
 * GET /api/v1/batches/{id}/stages/current
 *
 * Returns detailed information about the current stage including notes.
 * Requires authentication and batch ownership.
 */

import type { APIRoute } from "astro";
import { getCurrentStageDetails } from "../../../../../../lib/batchStage.service";
import { uuidSchema } from "../../../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../../../lib/auth.helper";
import { mapServiceErrorToHttp } from "../../../../../../lib/utils";
import type { CurrentStageDetailsDto } from "../../../../../../types";

export const prerender = false;

/**
 * GET handler for current stage details
 * Path params:
 * - id (required): Batch UUID
 */
export const GET: APIRoute = async ({ params, request, locals }) => {
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

    // Get current stage details using service
    try {
      const response: CurrentStageDetailsDto = await getCurrentStageDetails(supabase, userId, validation.data);

      return createSuccessResponse(response);
    } catch (error) {
      // Map service errors to HTTP responses
      if (error instanceof Error) {
        const [statusCode, errorResponse] = mapServiceErrorToHttp(error);
        return createErrorResponse(errorResponse, statusCode);
      }

      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error("Error in GET /api/v1/batches/[id]/stages/current:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
