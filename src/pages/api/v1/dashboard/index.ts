/**
 * Dashboard Endpoint
 * GET /api/v1/dashboard - Get aggregated dashboard data for logged-in user
 *
 * Returns:
 * - List of active batches with current stage and latest note
 * - Count of archived batches
 *
 * Requires authentication.
 */

import type { APIRoute } from "astro";
import { getDashboardData } from "../../../../lib/dashboard.service";
import { dashboardQuerySchema } from "../../../../lib/validators";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "../../../../lib/auth.helper";
import type { DashboardDto } from "../../../../types";

export const prerender = false;

/**
 * GET handler for fetching dashboard data
 * Query params: none (prepared for future extensions)
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

    // Parse and validate query parameters (currently empty, but prepared for future)
    const queryParams: Record<string, string | undefined> = {
      // Future query params can be added here (e.g., limit, filters)
    };

    const validation = dashboardQuerySchema.safeParse(queryParams);

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

    // Fetch dashboard data from service
    const dashboardData: DashboardDto = await getDashboardData(supabase, userId);

    return createSuccessResponse(dashboardData);
  } catch (error) {
    console.error("Error in GET /api/v1/dashboard:", error);

    return createErrorResponse(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
