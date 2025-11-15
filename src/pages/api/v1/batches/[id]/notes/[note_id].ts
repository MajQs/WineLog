/**
 * Note Delete Endpoint
 * DELETE /api/v1/batches/{id}/notes/{note_id}
 *
 * Deletes a specific note (hard delete).
 * Requires authentication and note ownership.
 */

import type { APIRoute } from "astro";
import { deleteNote } from "../../../../../../lib/note.service";
import { uuidSchema } from "../../../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../../../lib/auth.helper";
import { mapServiceErrorToHttp } from "../../../../../../lib/utils";
import type { MessageResponseDto } from "../../../../../../types";

export const prerender = false;

/**
 * DELETE handler for removing a note
 * Path params:
 * - id (required): Batch UUID
 * - note_id (required): Note UUID
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

    const batchIdValidation = uuidSchema.safeParse(batchId);

    if (!batchIdValidation.success) {
      return createErrorResponse(
        {
          error: "Invalid batch ID format",
          code: "INVALID_UUID",
          details: { id: batchIdValidation.error.errors[0]?.message || "Invalid UUID format" },
        },
        400
      );
    }

    // Validate note ID parameter
    const noteId = params.note_id;

    if (!noteId) {
      return createErrorResponse(
        {
          error: "Note ID is required",
          code: "MISSING_NOTE_ID",
        },
        400
      );
    }

    const noteIdValidation = uuidSchema.safeParse(noteId);

    if (!noteIdValidation.success) {
      return createErrorResponse(
        {
          error: "Invalid note ID format",
          code: "INVALID_UUID",
          details: { note_id: noteIdValidation.error.errors[0]?.message || "Invalid UUID format" },
        },
        400
      );
    }

    // Delete note using service
    try {
      const response: MessageResponseDto | null = await deleteNote(
        supabase,
        userId,
        batchIdValidation.data,
        noteIdValidation.data
      );

      if (!response) {
        return createErrorResponse(
          {
            error: "Note not found",
            code: "NOTE_NOT_FOUND",
          },
          404
        );
      }

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
    console.error("Error in DELETE /api/v1/batches/[id]/notes/[note_id]:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
