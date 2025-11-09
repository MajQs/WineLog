/**
 * Templates List Endpoint
 * GET /api/v1/templates
 *
 * Returns a list of all production templates with optional type filter.
 * Requires authentication.
 */

import type { APIRoute } from "astro";
import { getTemplates } from "../../../../lib/template.service";
import { templatesQuerySchema } from "../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../lib/auth.helper";
import type { TemplateListResponseDto } from "../../../../types";

export const prerender = false;

/**
 * GET handler for templates list
 * Query params:
 * - type (optional): BatchType enum value
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
    if (!authResult.success && authResult.error && authResult.status) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams: Record<string, string | undefined> = {
      type: url.searchParams.get("type") || undefined,
    };

    const validation = templatesQuerySchema.safeParse(queryParams);

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

    // Fetch templates from service
    const templates = await getTemplates(supabase, validation.data.type);

    // Build response
    const response: TemplateListResponseDto = {
      templates,
      total: templates.length,
    };

    return createSuccessResponse(response);
  } catch (error) {
    console.error("Error in GET /api/v1/templates:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
