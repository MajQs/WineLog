/**
 * Advance Stage Endpoint
 * POST /api/v1/batches/{id}/stages/advance
 *
 * Advances batch to the next stage, completing current stage.
 * Optionally creates a note for the completed stage.
 * Requires authentication and batch ownership.
 */

import type { APIRoute } from "astro";
import { advanceToNextStage } from "../../../../../../lib/batchStage.service";
import { uuidSchema, advanceStageSchema } from "../../../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../../../lib/auth.helper";
import { mapServiceErrorToHttp } from "../../../../../../lib/utils";
import type { AdvanceStageCommand, AdvanceStageResponseDto } from "../../../../../../types";

export const prerender = false;

/**
 * POST handler for advancing to next stage
 * Path params:
 * - id (required): Batch UUID
 * Body:
 * - note (optional): Note object with action and observations
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

    const idValidation = uuidSchema.safeParse(batchId);

    if (!idValidation.success) {
      return createErrorResponse(
        {
          error: "Invalid batch ID format",
          code: "INVALID_UUID",
          details: { id: idValidation.error.errors[0]?.message || "Invalid UUID format" },
        },
        400
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse(
        {
          error: "Invalid JSON in request body",
          code: "INVALID_JSON",
        },
        400
      );
    }

    const bodyValidation = advanceStageSchema.safeParse(body);

    if (!bodyValidation.success) {
      return createErrorResponse(
        {
          error: "Invalid request body",
          code: "VALIDATION_ERROR",
          details: bodyValidation.error.flatten().fieldErrors as Record<string, string>,
        },
        400
      );
    }

    const command: AdvanceStageCommand = bodyValidation.data;

    // Advance stage using service
    try {
      const response: AdvanceStageResponseDto = await advanceToNextStage(
        supabase,
        userId,
        idValidation.data,
        command
      );

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
    console.error("Error in POST /api/v1/batches/[id]/stages/advance:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};

