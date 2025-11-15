/**
 * Batches Endpoints
 * POST /api/v1/batches - Create new batch
 * GET /api/v1/batches - List user's batches
 *
 * Requires authentication.
 */

import type { APIRoute } from "astro";
import { createBatch, listBatches } from "../../../../lib/batch.service";
import { createBatchSchema, batchesQuerySchema } from "../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../lib/auth.helper";
import type { CreateBatchCommand, BatchDto, BatchListResponseDto } from "../../../../types";

export const prerender = false;

/**
 * POST handler for creating a new batch
 * Body:
 * - template_id (required): UUID of the template to use
 * - name (optional): Custom name for the batch
 */
export const POST: APIRoute = async ({ request, locals }) => {
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

    const validation = createBatchSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        {
          error: "Invalid request body",
          code: "VALIDATION_ERROR",
          details: validation.error.flatten().fieldErrors as Record<string, string>,
        },
        400
      );
    }

    const command: CreateBatchCommand = validation.data;

    // Create batch using service
    try {
      const batch: BatchDto = await createBatch(supabase, userId, command);

      return createSuccessResponse(batch, 201);
    } catch (error) {
      // Handle specific business logic errors
      if (error instanceof Error) {
        if (error.message === "TEMPLATE_NOT_FOUND") {
          return createErrorResponse(
            {
              error: "Template not found",
              code: "TEMPLATE_NOT_FOUND",
            },
            404
          );
        }

        if (error.message.includes("Template has no stages")) {
          return createErrorResponse(
            {
              error: "Template has no stages",
              code: "INVALID_TEMPLATE",
            },
            400
          );
        }
      }

      throw error; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("Error in POST /api/v1/batches:", error);

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
 * GET handler for listing batches
 * Query params:
 * - status (optional): Filter by status (active|archived)
 * - type (optional): Filter by batch type
 * - sort (optional): Sort field (created_at|started_at|name)
 * - order (optional): Sort order (asc|desc)
 */
export const GET: APIRoute = async ({ request, locals }) => {
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

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams: Record<string, string | undefined> = {
      status: url.searchParams.get("status") || undefined,
      type: url.searchParams.get("type") || undefined,
      sort: url.searchParams.get("sort") || undefined,
      order: url.searchParams.get("order") || undefined,
    };

    const validation = batchesQuerySchema.safeParse(queryParams);

    if (!validation.success) {
      return createErrorResponse(
        {
          error: "Invalid query parameters",
          code: "VALIDATION_ERROR",
          details: validation.error.flatten().fieldErrors as Record<string, string>,
        },
        400
      );
    }

    // Fetch batches from service
    const response: BatchListResponseDto = await listBatches(supabase, userId, validation.data);

    return createSuccessResponse(response);
  } catch (error) {
    console.error("Error in GET /api/v1/batches:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
