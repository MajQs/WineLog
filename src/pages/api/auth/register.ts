/**
 * Register API Endpoint
 * Handles new user registration with email and password
 * 
 * POST /api/auth/register
 * Body: { email: string, password: string, confirmPassword: string }
 * Returns: { session: Session, user: User } or error
 */

import type { APIRoute } from "astro";
import { registerSchema } from "@/lib/auth-validation";
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
    const validationResult = registerSchema.safeParse(body);

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

    // Register with Supabase
    const { data, error: authError } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        // Email confirmation link valid for 7 days
        emailRedirectTo: `${new URL(request.url).origin}/dashboard`,
      },
    });

    if (authError) {
      // Handle specific Supabase errors
      if (authError.message.includes("already registered")) {
        return createErrorResponse(
          {
            error: "Ten adres e-mail jest już zarejestrowany.",
            code: "EMAIL_ALREADY_EXISTS",
          },
          400
        );
      }

      return createErrorResponse(
        {
          error: "Wystąpił błąd podczas rejestracji. Spróbuj ponownie.",
          code: "REGISTRATION_ERROR",
        },
        400
      );
    }

    if (!data.session) {
      // User created but needs email confirmation
      return createSuccessResponse(
        {
          user: data.user,
          message: "Konto zostało utworzone. Sprawdź swoją skrzynkę e-mail.",
          requiresConfirmation: true,
        },
        201
      );
    }

    // User created and automatically logged in (soft verification)
    return createSuccessResponse(
      {
        session: data.session,
        user: data.user,
        message: "Konto zostało utworzone pomyślnie.",
      },
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    return createErrorResponse(
      {
        error: "Wystąpił błąd. Spróbuj ponownie.",
        code: "INTERNAL_SERVER_ERROR",
      },
      500
    );
  }
};

