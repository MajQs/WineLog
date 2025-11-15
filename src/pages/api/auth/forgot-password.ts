/**
 * Forgot Password API Endpoint
 * Sends password reset link to user's email
 *
 * POST /api/auth/forgot-password
 * Body: { email: string }
 * Returns: success message
 */

import type { APIRoute } from "astro";
import { forgotPasswordSchema } from "@/lib/auth-validation";
import { createErrorResponse, createSuccessResponse } from "@/lib/auth.helper";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parse request body
    const body = await request.json().catch(() => null);

    if (!body) {
      return createErrorResponse(
        {
          error: "Nieprawidłowe dane wejściowe.",
          code: "INVALID_REQUEST_BODY",
        },
        422
      );
    }

    // Validate input with Zod
    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        {
          error: "Nieprawidłowe dane wejściowe.",
          code: "VALIDATION_ERROR",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        422
      );
    }

    const { email } = validationResult.data;

    // Send password reset email
    const { error: resetError } = await locals.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/reset-password`,
    });

    if (resetError) {
      console.error("Password reset error:", resetError);
      // Don't reveal if email exists or not (security best practice)
      // Return success anyway
    }

    // Always return success to prevent email enumeration
    return createSuccessResponse(
      {
        message: "Jeśli podany adres e-mail istnieje w naszej bazie, wyślemy link do resetowania hasła.",
      },
      200
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return createErrorResponse(
      {
        error: "Wystąpił błąd. Spróbuj ponownie.",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
