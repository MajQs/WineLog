/**
 * Login API Endpoint
 * Handles user authentication with email and password
 * 
 * POST /api/auth/login
 * Body: { email: string, password: string }
 * Returns: { session: Session, user: User } or error
 */

import type { APIRoute } from "astro";
import { loginSchema } from "@/lib/auth-validation";
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
    const validationResult = loginSchema.safeParse(body);

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

    const { email, password } = validationResult.data;

    // Authenticate with Supabase
    const { data, error: authError } = await locals.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.session) {
      return createErrorResponse(
        {
          error: "Nieprawidłowy e-mail lub hasło.",
          code: "INVALID_CREDENTIALS",
        },
        400
      );
    }

    // Return session data (client will store token in localStorage)
    return createSuccessResponse(
      {
        session: data.session,
        user: data.user,
      },
      200
    );
  } catch (error) {
    console.error("Login error:", error);
    return createErrorResponse(
      {
        error: "Wystąpił błąd. Spróbuj ponownie.",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};

