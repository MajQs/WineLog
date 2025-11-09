/**
 * Global fetch helper with authentication
 * Adds Authorization header and handles common error responses
 */

import type { ErrorResponseDto } from "../../types";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Gets access token from localStorage
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Removes authentication tokens and redirects to login
 */
export function logout(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}

/**
 * Fetch with authentication and error handling
 * 
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Response data
 * @throws ApiError on non-2xx responses
 */
export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  
  // Add Authorization header if token exists
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  headers.set("Content-Type", "application/json");

  // Create request with timeout (10 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 - Unauthorized (logout and redirect)
    if (response.status === 401) {
      logout();
      throw new ApiError("Unauthorized", "UNAUTHORIZED", 401);
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData: ErrorResponseDto = await response.json().catch(() => ({
        error: "Unknown error",
        code: "UNKNOWN_ERROR",
      }));

      throw new ApiError(
        errorData.error,
        errorData.code,
        response.status,
        errorData.details
      );
    }

    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    // Re-throw ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle fetch abort (timeout)
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        "Request timeout - please try again",
        "TIMEOUT",
        408
      );
    }

    // Handle network errors
    if (error instanceof Error) {
      throw new ApiError(
        "Network error - check your connection",
        "NETWORK_ERROR",
        0
      );
    }

    // Unknown error
    throw new ApiError(
      "An unexpected error occurred",
      "UNKNOWN_ERROR",
      500
    );
  }
}

