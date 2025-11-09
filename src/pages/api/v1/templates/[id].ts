/**
 * Template Details Endpoint
 * GET /api/v1/templates/{id}
 *
 * Returns detailed information about a single template including all its stages.
 * Requires authentication.
 */

import type { APIRoute } from "astro";
import { getTemplateById } from "../../../../lib/template.service";
import { uuidSchema } from "../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../lib/auth.helper";

export const prerender = false;

/**
 * GET handler for template details
 * Path params:
 * - id (required): Template UUID
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
    if (!authResult.success && authResult.error && authResult.status) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    // Validate template ID parameter
    const templateId = params.id;

    if (!templateId) {
      return createErrorResponse(
        {
          error: "Template ID is required",
          code: "MISSING_TEMPLATE_ID",
        },
        400
      );
    }

    const validation = uuidSchema.safeParse(templateId);

    if (!validation.success) {
      return createErrorResponse(
        {
          error: "Invalid template ID format",
          code: "INVALID_UUID",
          details: { id: validation.error.errors[0]?.message || "Invalid UUID format" },
        },
        400
      );
    }

    // Fetch template from service
    const template = await getTemplateById(supabase, validation.data);

    // Check if template exists
    if (!template) {
      return createErrorResponse(
        {
          error: "Template not found",
          code: "TEMPLATE_NOT_FOUND",
        },
        404
      );
    }

    // Return template with stages
    return createSuccessResponse(template);
  } catch (error) {
    console.error("Error in GET /api/v1/templates/[id]:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
