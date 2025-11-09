/**
 * Validators for API endpoints using Zod
 */

import { z } from "zod";

/**
 * Validator for UUID format
 */
export const uuidSchema = z.string().uuid({
  message: "Invalid UUID format",
});

/**
 * Validator for BatchType enum
 */
export const batchTypeSchema = z.enum(["red_wine", "white_wine", "rose_wine", "fruit_wine", "mead"], {
  errorMap: () => ({
    message: "Invalid batch type. Must be one of: red_wine, white_wine, rose_wine, fruit_wine, mead",
  }),
});

/**
 * Validator for templates query parameters
 */
export const templatesQuerySchema = z.object({
  type: batchTypeSchema.optional(),
});

/**
 * Validator for template ID parameter
 */
export const templateIdSchema = z.object({
  id: uuidSchema,
});

/**
 * Validator for batch status enum
 */
export const batchStatusSchema = z.enum(["active", "archived"], {
  errorMap: () => ({ message: "Invalid batch status. Must be one of: active, archived" }),
});

/**
 * Validator for batches query parameters
 */
export const batchesQuerySchema = z.object({
  status: batchStatusSchema.optional(),
  type: batchTypeSchema.optional(),
  sort: z.enum(["created_at", "started_at", "name"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

/**
 * Validator for notes query parameters
 */
export const notesQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  stage_id: uuidSchema.optional(),
});

/**
 * Validator for creating a new batch
 */
export const createBatchSchema = z.object({
  template_id: uuidSchema,
  name: z.string().max(100, "Batch name must not exceed 100 characters").optional(),
});

/**
 * Validator for updating batch name
 */
export const updateBatchSchema = z.object({
  name: z.string().min(1, "Batch name cannot be empty").max(100, "Batch name must not exceed 100 characters"),
});

