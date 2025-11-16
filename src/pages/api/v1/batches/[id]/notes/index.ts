/**
 * Notes Endpoint
 * POST /api/v1/batches/{id}/notes - Create a new note for current stage
 * GET /api/v1/batches/{id}/notes - List notes for a batch
 *
 * Requires authentication and batch ownership.
 */

import type { APIRoute } from "astro";
import { createNote, listNotes } from "../../../../../../lib/note.service";
import { uuidSchema, createNoteSchema, notesQuerySchema } from "../../../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../../../lib/auth.helper";
import { mapServiceErrorToHttp } from "../../../../../../lib/utils";
import type { CreateNoteCommand, NoteDto, NoteListResponseDto, NotesQueryParams } from "../../../../../../types";

export const prerender = false;

/**
 * POST handler for creating a note
 * Path params:
 * - id (required): Batch UUID
 * Body:
 * - action (required): Description of action taken (max 200 chars)
 * - observations (optional): Additional observations (max 200 chars)
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

    const bodyValidation = createNoteSchema.safeParse(body);

    if (!bodyValidation.success) {
      const errors = bodyValidation.error.flatten().fieldErrors;

      // Map specific error codes
      if (errors.action) {
        const errorMsg = errors.action[0];
        if (errorMsg.includes("exceed 200")) {
          return createErrorResponse(
            {
              error: errorMsg,
              code: "ACTION_TOO_LONG",
            },
            400
          );
        }
      }

      if (errors.observations) {
        const errorMsg = errors.observations[0];
        if (errorMsg.includes("exceed 200")) {
          return createErrorResponse(
            {
              error: errorMsg,
              code: "OBSERVATIONS_TOO_LONG",
            },
            400
          );
        }
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

    const command: CreateNoteCommand = bodyValidation.data;

    // Create note using service
    try {
      const response: NoteDto = await createNote(supabase, userId, idValidation.data, command);

      return createSuccessResponse(response, 201);
    } catch (error) {
      // Map service errors to HTTP responses
      if (error instanceof Error) {
        const [statusCode, errorResponse] = mapServiceErrorToHttp(error);
        return createErrorResponse(errorResponse, statusCode);
      }

      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error("Error in POST /api/v1/batches/[id]/notes:", error);

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
 * GET handler for listing notes
 * Path params:
 * - id (required): Batch UUID
 * Query params:
 * - sort (optional): 'asc' | 'desc' (default: 'desc')
 * - stage_id (optional): Filter by stage UUID
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

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = {
      sort: url.searchParams.get("sort") || undefined,
      stage_id: url.searchParams.get("stage_id") || undefined,
    };

    const queryValidation = notesQuerySchema.safeParse(queryParams);

    if (!queryValidation.success) {
      return createErrorResponse(
        {
          error: "Invalid query parameters",
          code: "VALIDATION_ERROR",
          details: queryValidation.error.flatten().fieldErrors as Record<string, string>,
        },
        400
      );
    }

    const params_validated: NotesQueryParams = queryValidation.data;

    // List notes using service
    try {
      const response: NoteListResponseDto = await listNotes(supabase, userId, idValidation.data, params_validated);

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
    console.error("Error in GET /api/v1/batches/[id]/notes:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
