/**
 * Reset Password API Endpoint
 * Updates user password using reset token
 *
 * POST /api/auth/reset-password
 * Body: { password: string, confirmPassword: string }
 * Headers: Authorization: Bearer <reset_token>
 * Returns: success message
 */

import type { APIRoute } from "astro";
import { resetPasswordSchema } from "@/lib/auth-validation";
import { verifyAuthToken, createErrorResponse, createSuccessResponse } from "@/lib/auth.helper";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Verify reset token (uses same verification as regular auth)
    const authResult = await verifyAuthToken(request, locals.supabase);

    if (!authResult.success) {
      return createErrorResponse(
        {
          error: "Link wygasł lub został już użyty.",
          code: "INVALID_RESET_TOKEN",
        },
        400
      );
    }

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
    const validationResult = resetPasswordSchema.safeParse(body);

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

    const { password } = validationResult.data;

    // Update password
    const { error: updateError } = await locals.supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      console.error("Password update error:", updateError);
      return createErrorResponse(
        {
          error: "Nie udało się zaktualizować hasła. Spróbuj ponownie.",
          code: "PASSWORD_UPDATE_ERROR",
        },
        400
      );
    }

    // Sign out all sessions (security best practice after password change)
    await locals.supabase.auth.signOut({ scope: "global" });

    return createSuccessResponse(
      {
        message: "Hasło zostało zmienione. Zaloguj się ponownie.",
      },
      200
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return createErrorResponse(
      {
        error: "Wystąpił błąd. Spróbuj ponownie.",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};
