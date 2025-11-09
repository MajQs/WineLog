import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ErrorResponseDto } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Maps service error messages to HTTP status codes and error response DTOs
 * @param error - Error object from service layer
 * @returns Tuple of [statusCode, errorResponseDto]
 */
export function mapServiceErrorToHttp(error: Error): [number, ErrorResponseDto] {
  const message = error.message;

  // Handle known error codes
  switch (message) {
    case "BATCH_NOT_FOUND":
      return [
        404,
        {
          error: "Batch not found or you don't have access to it",
          code: "NOT_FOUND",
        },
      ];

    case "BATCH_ARCHIVED":
      return [
        400,
        {
          error: "Cannot modify an archived batch",
          code: "INVALID_INPUT",
        },
      ];

    case "FINAL_STAGE":
      return [
        400,
        {
          error: "Batch is already at the final stage",
          code: "FINAL_STAGE",
        },
      ];

    case "NO_STAGES_FOUND":
      return [
        500,
        {
          error: "No stages found for this batch",
          code: "SERVER_ERROR",
        },
      ];

    case "TEMPLATE_NOT_FOUND":
      return [
        404,
        {
          error: "Template not found",
          code: "NOT_FOUND",
        },
      ];

    case "BATCH_ALREADY_COMPLETED":
      return [
        400,
        {
          error: "Batch is already completed",
          code: "INVALID_INPUT",
        },
      ];

    case "UNAUTHORIZED":
      return [
        401,
        {
          error: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      ];

    case "NOTE_NOT_FOUND":
      return [
        404,
        {
          error: "Note not found or you don't have access to it",
          code: "NOT_FOUND",
        },
      ];

    case "BATCH_NOT_COMPLETED":
      return [
        403,
        {
          error: "Batch must be archived to add a rating",
          code: "BATCH_NOT_COMPLETED",
        },
      ];

    default:
      // For unexpected errors, return generic server error
      console.error("Unexpected service error:", error);
      return [
        500,
        {
          error: "An unexpected error occurred",
          code: "SERVER_ERROR",
        },
      ];
  }
}
