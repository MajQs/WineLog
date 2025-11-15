import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ErrorResponseDto } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Maps service layer errors to HTTP status codes and error responses
 *
 * @param error - Error thrown by service layer
 * @returns Tuple of [statusCode, errorResponse]
 */
export function mapServiceErrorToHttp(error: Error): [number, ErrorResponseDto] {
  const message = error.message;

  // Map known error codes to HTTP status codes
  const errorMap: Record<string, { status: number; code: string; message: string }> = {
    BATCH_NOT_FOUND: {
      status: 404,
      code: "BATCH_NOT_FOUND",
      message: "Batch not found",
    },
    BATCH_ARCHIVED: {
      status: 400,
      code: "BATCH_ARCHIVED",
      message: "Cannot modify archived batch",
    },
    BATCH_ALREADY_COMPLETED: {
      status: 400,
      code: "BATCH_ALREADY_COMPLETED",
      message: "Batch is already completed",
    },
    BATCH_NOT_COMPLETED: {
      status: 400,
      code: "BATCH_NOT_COMPLETED",
      message: "Batch must be completed before rating",
    },
    TEMPLATE_NOT_FOUND: {
      status: 404,
      code: "TEMPLATE_NOT_FOUND",
      message: "Template not found",
    },
    NO_STAGES_FOUND: {
      status: 400,
      code: "NO_STAGES_FOUND",
      message: "No stages found for this batch",
    },
    FINAL_STAGE: {
      status: 400,
      code: "FINAL_STAGE",
      message: "Cannot advance from final stage",
    },
    NOTE_NOT_FOUND: {
      status: 404,
      code: "NOTE_NOT_FOUND",
      message: "Note not found",
    },
  };

  // Check if error message matches a known error code
  const mappedError = errorMap[message];
  if (mappedError) {
    return [
      mappedError.status,
      {
        error: mappedError.message,
        code: mappedError.code,
      },
    ];
  }

  // Default to 500 Internal Server Error for unknown errors
  return [
    500,
    {
      error: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    },
  ];
}
