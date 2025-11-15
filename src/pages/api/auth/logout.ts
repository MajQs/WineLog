/**
 * Logout API Endpoint
 * Handles user sign out and session invalidation
 *
 * POST /api/auth/logout
 * Headers: Authorization: Bearer <token>
 * Returns: success message
 */

import type { APIRoute } from "astro";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "@/lib/auth.helper";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Verify authentication
    const authResult = await verifyAuthToken(request, locals.supabase);

    if (!authResult.success || !authResult.error || !authResult.status) {
      return createErrorResponse(
        authResult.error || { error: "Unauthorized", code: "UNAUTHORIZED" },
        authResult.status || 401
      );
    }

    // Sign out from Supabase (invalidates the token)
    const { error: signOutError } = await locals.supabase.auth.signOut();

    if (signOutError) {
      console.error("Sign out error:", signOutError);
      return createErrorResponse(
        {
          error: "Wystąpił błąd podczas wylogowania.",
          code: "SIGNOUT_ERROR",
        },
        500
      );
    }

    return createSuccessResponse(
      {
        message: "Wylogowano pomyślnie.",
      },
      200
    );
  } catch (error) {
    console.error("Logout error:", error);
    return createErrorResponse(
      {
        error: "Wystąpił błąd. Spróbuj ponownie.",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
