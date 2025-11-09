// src/types.ts
/**
 * DTO and Command Model types for WineLog API
 *
 * This file contains all Data Transfer Objects and Command Models
 * used by the API endpoints, derived from database entity types.
 */

import type { Tables, TablesInsert, TablesUpdate, Enums } from "./db/database.types";

// ============================================================================
// BASE ENTITY TYPES (Re-exported for convenience)
// ============================================================================

export type BatchEntity = Tables<"batches">;
export type BatchInsert = TablesInsert<"batches">;
export type BatchUpdate = TablesUpdate<"batches">;

export type BatchStageEntity = Tables<"batch_stages">;
export type BatchStageInsert = TablesInsert<"batch_stages">;
export type BatchStageUpdate = TablesUpdate<"batch_stages">;

export type NoteEntity = Tables<"notes">;
export type NoteInsert = TablesInsert<"notes">;
export type NoteUpdate = TablesUpdate<"notes">;

export type RatingEntity = Tables<"ratings">;
export type RatingInsert = TablesInsert<"ratings">;
export type RatingUpdate = TablesUpdate<"ratings">;

export type TemplateEntity = Tables<"templates">;
export type TemplateStageEntity = Tables<"template_stages">;

// ============================================================================
// ENUMS (Re-exported for convenience)
// ============================================================================

export type BatchStatus = Enums<"batch_status_enum">;
export type BatchType = Enums<"batch_type_enum">;
export type StageName = Enums<"stage_name_enum">;

// ============================================================================
// AUTHENTICATION - COMMAND MODELS
// ============================================================================

/**
 * Command for user registration
 * POST /api/v1/auth/register
 */
export interface RegisterCommand {
  email: string;
  password: string;
}

/**
 * Command for user login
 * POST /api/v1/auth/login
 */
export interface LoginCommand {
  email: string;
  password: string;
}

/**
 * Command for session refresh
 * POST /api/v1/auth/refresh
 */
export interface RefreshSessionCommand {
  refresh_token: string;
}

/**
 * Command for password reset request
 * POST /api/v1/auth/password-reset
 */
export interface RequestPasswordResetCommand {
  email: string;
}

/**
 * Command for account deletion
 * DELETE /api/v1/auth/account
 */
export interface DeleteAccountCommand {
  password: string;
}

// ============================================================================
// AUTHENTICATION - RESPONSE DTOS
// ============================================================================

/**
 * User data returned by authentication endpoints
 */
export interface UserDto {
  id: string;
  email: string;
  email_confirmed: boolean;
  created_at: string;
}

/**
 * Session data with tokens
 */
export interface SessionDto {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

/**
 * Complete authentication response (register/login)
 */
export interface AuthResponseDto {
  user: UserDto;
  session: SessionDto;
  message?: string;
}

/**
 * Generic message response
 */
export interface MessageResponseDto {
  message: string;
}

/**
 * Session refresh response
 */
export interface RefreshSessionResponseDto {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

// ============================================================================
// TEMPLATES - RESPONSE DTOS
// ============================================================================

/**
 * Template list item (summary view)
 * Derived from TemplateEntity
 */
export type TemplateListItemDto = Pick<TemplateEntity, "id" | "name" | "type" | "version" | "created_at">;

/**
 * Template stage details
 * Derived from TemplateStageEntity
 */
export type TemplateStageDto = Pick<
  TemplateStageEntity,
  "id" | "position" | "name" | "description" | "instructions" | "materials" | "days_min" | "days_max" | "created_at"
>;

/**
 * Complete template with stages
 * GET /api/v1/templates/{id}
 */
export interface TemplateDto extends TemplateListItemDto {
  stages: TemplateStageDto[];
}

/**
 * Templates list response
 * GET /api/v1/templates
 */
export interface TemplateListResponseDto {
  templates: TemplateListItemDto[];
  total: number;
}

// ============================================================================
// BATCHES - COMMAND MODELS
// ============================================================================

/**
 * Command for creating a new batch
 * POST /api/v1/batches
 */
export interface CreateBatchCommand {
  template_id: string;
  name?: string;
}

/**
 * Command for updating batch name
 * PATCH /api/v1/batches/{id}
 */
export interface UpdateBatchCommand {
  name: string;
}

// ============================================================================
// BATCHES - RESPONSE DTOS
// ============================================================================

/**
 * Current stage summary (used in batch list)
 */
export interface CurrentStageInfoDto {
  position: number;
  name: StageName;
  description: string;
  days_elapsed?: number;
}

/**
 * Latest note summary (used in batch list)
 */
export interface LatestNoteDto {
  id: string;
  action: string;
  created_at: string;
}

/**
 * Template summary (used in batch details)
 */
export interface TemplateSummaryDto {
  id: string;
  name: string;
  type: BatchType;
}

/**
 * Batch stage with full details including template stage data
 */
export interface BatchStageDto {
  id: string;
  batch_id: string;
  template_stage_id: string;
  position: number;
  name: StageName;
  description: string;
  instructions: string;
  materials: string[] | null;
  days_min: number | null;
  days_max: number | null;
  started_at: string | null;
  completed_at: string | null;
  status?: "completed" | "in_progress" | "pending";
  days_elapsed?: number;
}

/**
 * Batch list item (summary view)
 * GET /api/v1/batches
 */
export interface BatchListItemDto {
  id: string;
  template_id: string | null;
  name: string;
  type: BatchType;
  status: BatchStatus;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  current_stage: CurrentStageInfoDto;
  latest_note: LatestNoteDto | null;
  rating: number | null;
}

/**
 * Complete batch details
 * GET /api/v1/batches/{id}
 * POST /api/v1/batches
 */
export interface BatchDto {
  id: string;
  user_id: string;
  template_id: string | null;
  name: string;
  type: BatchType;
  status: BatchStatus;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  template?: TemplateSummaryDto;
  current_stage?: CurrentStageInfoDto;
  stages: BatchStageDto[];
  notes?: NoteDto[];
  rating?: number | null;
  current_stage_position?: number;
}

/**
 * Batch list response
 * GET /api/v1/batches
 */
export interface BatchListResponseDto {
  batches: BatchListItemDto[];
  total: number;
}

/**
 * Updated batch response (partial update)
 * PATCH /api/v1/batches/{id}
 */
export interface UpdateBatchResponseDto {
  id: string;
  name: string;
  updated_at: string;
}

/**
 * Complete batch response
 * POST /api/v1/batches/{id}/complete
 */
export interface CompleteBatchResponseDto {
  id: string;
  name: string;
  status: BatchStatus;
  completed_at: string;
  message: string;
}

/**
 * Delete batch response
 * DELETE /api/v1/batches/{id}
 */
export interface DeleteBatchResponseDto {
  message: string;
}

// ============================================================================
// BATCH STAGES - COMMAND MODELS
// ============================================================================

/**
 * Note data for stage advancement
 */
export interface StageAdvancementNoteDto {
  action: string;
  observations?: string;
}

/**
 * Command for advancing to next stage
 * POST /api/v1/batches/{id}/stages/advance
 */
export interface AdvanceStageCommand {
  note?: StageAdvancementNoteDto;
}

// ============================================================================
// BATCH STAGES - RESPONSE DTOS
// ============================================================================

/**
 * Stage summary (used in advance response)
 */
export interface StageSummaryDto {
  id: string;
  position: number;
  name: StageName;
  description?: string;
  completed_at?: string | null;
  started_at?: string | null;
}

/**
 * Response for stage advancement
 * POST /api/v1/batches/{id}/stages/advance
 */
export interface AdvanceStageResponseDto {
  previous_stage: StageSummaryDto;
  current_stage: BatchStageDto;
  note?: NoteDto;
}

/**
 * Current stage with notes
 * GET /api/v1/batches/{id}/stages/current
 */
export interface CurrentStageDetailsDto extends BatchStageDto {
  notes: NoteDto[];
}

// ============================================================================
// NOTES - COMMAND MODELS
// ============================================================================

/**
 * Command for creating a note
 * POST /api/v1/batches/{id}/notes
 */
export interface CreateNoteCommand {
  action: string;
  observations?: string;
}

/**
 * Command for updating a note (partial update)
 * PATCH /api/v1/batches/{id}/notes/{note_id}
 */
export interface UpdateNoteCommand {
  action?: string;
  observations?: string;
}

// ============================================================================
// NOTES - RESPONSE DTOS
// ============================================================================

/**
 * Stage context for note
 */
export interface NoteStageContextDto {
  position: number;
  name: StageName;
  description: string;
}

/**
 * Note with stage context
 * Used in all note responses
 */
export interface NoteDto {
  id: string;
  batch_id: string;
  stage_id: string | null;
  user_id: string;
  action: string;
  observations: string | null;
  created_at: string;
  stage?: NoteStageContextDto;
  stage_name?: StageName;
}

/**
 * Notes list response
 * GET /api/v1/batches/{id}/notes
 */
export interface NoteListResponseDto {
  notes: NoteDto[];
  total: number;
}

// ============================================================================
// RATINGS - COMMAND MODELS
// ============================================================================

/**
 * Command for adding/updating rating
 * PUT /api/v1/batches/{id}/rating
 */
export interface UpsertRatingCommand {
  rating: number;
}

// ============================================================================
// RATINGS - RESPONSE DTOS
// ============================================================================

/**
 * Rating data
 * Derived from RatingEntity
 */
export type RatingDto = Pick<RatingEntity, "batch_id" | "user_id" | "rating" | "created_at">;

// ============================================================================
// DASHBOARD - RESPONSE DTOS
// ============================================================================

/**
 * Active batch summary for dashboard
 */
export interface DashboardBatchDto {
  id: string;
  name: string;
  type: BatchType;
  started_at: string;
  current_stage: CurrentStageInfoDto;
  latest_note: LatestNoteDto | null;
}

/**
 * Dashboard data response
 * GET /api/v1/dashboard
 */
export interface DashboardDto {
  active_batches: DashboardBatchDto[];
  archived_batches_count: number;
  total_notes: number;
}

// ============================================================================
// ERROR RESPONSE DTO
// ============================================================================

/**
 * Standard error response format
 */
export interface ErrorResponseDto {
  error: string;
  code: string;
  details?: Record<string, string>;
}

// ============================================================================
// QUERY PARAMETERS
// ============================================================================

/**
 * Query parameters for templates list
 * GET /api/v1/templates
 */
export interface TemplatesQueryParams {
  type?: BatchType;
}

/**
 * Query parameters for batches list
 * GET /api/v1/batches
 */
export interface BatchesQueryParams {
  status?: BatchStatus;
  type?: BatchType;
  sort?: "created_at" | "started_at" | "name";
  order?: "asc" | "desc";
}

/**
 * Query parameters for notes list
 * GET /api/v1/batches/{id}/notes
 */
export interface NotesQueryParams {
  sort?: "asc" | "desc";
  stage_id?: string;
}
