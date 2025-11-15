/**
 * Rating Endpoint
 * PUT /api/v1/batches/{id}/rating - Add or update rating for an archived batch
 * GET /api/v1/batches/{id}/rating - Get rating for a batch
 *
 * Requires authentication and batch ownership.
 * Only archived batches can be rated.
 */

import type { APIRoute } from "astro";
import { getRating, upsertRating } from "../../../../../lib/rating.service";
import { uuidSchema, upsertRatingSchema } from "../../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../../lib/auth.helper";
import { mapServiceErrorToHttp } from "../../../../../lib/utils";
import type { UpsertRatingCommand, RatingDto } from "../../../../../types";

export const prerender = false;

/**
 * GET handler for retrieving a rating
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

    // Get rating using service
    try {
      const rating: RatingDto | null = await getRating(supabase, userId, idValidation.data);

      if (!rating) {
        return createErrorResponse(
          {
            error: "Rating not found for this batch",
            code: "RATING_NOT_FOUND",
          },
          404
        );
      }

      return createSuccessResponse(rating);
    } catch (error) {
      // Map service errors to HTTP responses
      if (error instanceof Error) {
        const [statusCode, errorResponse] = mapServiceErrorToHttp(error);
        return createErrorResponse(errorResponse, statusCode);
      }

      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error("Error in GET /api/v1/batches/[id]/rating:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};

/**
 * PUT handler for creating or updating a rating
 * Path params:
 * - id (required): Batch UUID
 * Body:
 * - rating (required): Rating value (1-5)
 */
export const PUT: APIRoute = async ({ params, request, locals }) => {
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

    const bodyValidation = upsertRatingSchema.safeParse(body);

    if (!bodyValidation.success) {
      const errors = bodyValidation.error.flatten().fieldErrors;

      // Map specific error codes
      if (errors.rating) {
        const errorMsg = errors.rating[0];
        return createErrorResponse(
          {
            error: errorMsg,
            code: "INVALID_RATING",
            details: { rating: errorMsg },
          },
          400
        );
      }

      return createErrorResponse(
        {
          error: "Invalid request body",
          code: "VALIDATION_ERROR",
          details: errors as Record<string, string>,
        },
        400
      );
    }

    const command: UpsertRatingCommand = bodyValidation.data;

    // Upsert rating using service
    try {
      const { rating, isNew } = await upsertRating(supabase, userId, idValidation.data, command);

      // Return 201 for creation, 200 for update
      const statusCode = isNew ? 201 : 200;

      return createSuccessResponse(rating, statusCode);
    } catch (error) {
      // Map service errors to HTTP responses
      if (error instanceof Error) {
        const [statusCode, errorResponse] = mapServiceErrorToHttp(error);
        return createErrorResponse(errorResponse, statusCode);
      }

      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error("Error in PUT /api/v1/batches/[id]/rating:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
