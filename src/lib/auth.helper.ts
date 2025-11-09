/**
 * Authentication helper functions
 * Provides utilities for verifying JWT tokens and user authentication
 */

import type { SupabaseClient } from "../db/supabase.client";
import type { ErrorResponseDto } from "../types";

/**
 * Result of authentication verification
 */
export interface AuthVerificationResult {
  success: boolean;
  userId?: string;
  error?: ErrorResponseDto;
  status?: number;
}

/**
 * Verifies JWT token from Authorization header
 * @param request - Request object containing headers
 * @param supabase - Supabase client instance
 * @returns Verification result with user ID or error
 */
export async function verifyAuthToken(request: Request, supabase: SupabaseClient): Promise<AuthVerificationResult> {
  // Check for Authorization header
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      error: {
        error: "Unauthorized",
        code: "MISSING_AUTH_TOKEN",
      },
      status: 401,
    };
  }

  // Extract token
  const token = authHeader.replace("Bearer ", "");

  // Verify token with Supabase
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return {
      success: false,
      error: {
        error: "Unauthorized",
        code: "INVALID_AUTH_TOKEN",
      },
      status: 401,
    };
  }

  return {
    success: true,
    userId: user.id,
  };
}

/**
 * Creates a standardized error response
 * @param error - Error response DTO
 * @param status - HTTP status code
 * @returns Response object
 */
export function createErrorResponse(error: ErrorResponseDto, status: number): Response {
  return new Response(JSON.stringify(error), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Creates a standardized success response
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @returns Response object
 */
export function createSuccessResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

