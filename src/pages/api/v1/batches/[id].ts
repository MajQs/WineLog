/**
 * Single Batch Endpoints
 * GET /api/v1/batches/{id} - Get batch details
 * PATCH /api/v1/batches/{id} - Update batch name
 * DELETE /api/v1/batches/{id} - Delete batch
 *
 * Requires authentication and batch ownership.
 */

import type { APIRoute } from "astro";
import { getBatchById, updateBatchName, removeBatch } from "../../../../lib/batch.service";
import { uuidSchema, updateBatchSchema } from "../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../lib/auth.helper";
import type { BatchDto, UpdateBatchCommand, UpdateBatchResponseDto, DeleteBatchResponseDto } from "../../../../types";

export const prerender = false;

/**
 * GET handler for batch details
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

    // Fetch batch from service
    const batch: BatchDto | null = await getBatchById(supabase, userId, validation.data);

    // Check if batch exists
    if (!batch) {
      return createErrorResponse(
        {
          error: "Batch not found",
          code: "BATCH_NOT_FOUND",
        },
        404
      );
    }

    return createSuccessResponse(batch);
  } catch (error) {
    console.error("Error in GET /api/v1/batches/[id]:", error);

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
 * PATCH handler for updating batch name
 * Path params:
 * - id (required): Batch UUID
 * Body:
 * - name (required): New batch name
 */
export const PATCH: APIRoute = async ({ params, request, locals }) => {
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

    const validation = updateBatchSchema.safeParse(body);

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

    const command: UpdateBatchCommand = validation.data;

    // Update batch name using service
    const updatedBatch: UpdateBatchResponseDto | null = await updateBatchName(
      supabase,
      userId,
      idValidation.data,
      command.name
    );

    if (!updatedBatch) {
      return createErrorResponse(
        {
          error: "Batch not found",
          code: "BATCH_NOT_FOUND",
        },
        404
      );
    }

    return createSuccessResponse(updatedBatch);
  } catch (error) {
    console.error("Error in PATCH /api/v1/batches/[id]:", error);

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
 * DELETE handler for deleting a batch
 * Path params:
 * - id (required): Batch UUID
 */
export const DELETE: APIRoute = async ({ params, request, locals }) => {
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

    // Delete batch using service
    const result: DeleteBatchResponseDto | null = await removeBatch(supabase, userId, validation.data);

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
    console.error("Error in DELETE /api/v1/batches/[id]:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
