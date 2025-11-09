/**
 * Batch API client
 * Fetches batch data from the backend
 */

import type { 
  BatchDto, 
  CurrentStageDetailsDto, 
  UpdateBatchCommand,
  UpdateBatchResponseDto,
  AdvanceStageCommand,
  AdvanceStageResponseDto,
  CompleteBatchResponseDto,
  RatingDto,
  CreateBatchCommand,
  BatchListResponseDto
} from "@/types";
import { fetchWithAuth } from "./fetch";

/**
 * Creates a new batch from a template
 * 
 * @param command - Create batch command with template_id and optional name
 * @returns Complete batch data with stages
 */
export async function createBatch(command: CreateBatchCommand): Promise<BatchDto> {
  return fetchWithAuth<BatchDto>("/api/v1/batches", {
    method: "POST",
    body: JSON.stringify(command),
  });
}

/**
 * Fetches archived batches list
 * 
 * @returns List of archived batches
 */
export async function fetchArchivedBatches(): Promise<BatchListResponseDto> {
  return fetchWithAuth<BatchListResponseDto>("/api/v1/batches?status=archived");
}

/**
 * Fetches complete batch data by ID
 * 
 * @param batchId - Batch ID
 * @returns Complete batch data with stages
 */
export async function fetchBatch(batchId: string): Promise<BatchDto> {
  return fetchWithAuth<BatchDto>(`/api/v1/batches/${batchId}`);
}

/**
 * Fetches current stage details with notes
 * 
 * @param batchId - Batch ID
 * @returns Current stage with full details and notes
 */
export async function fetchCurrentStage(batchId: string): Promise<CurrentStageDetailsDto> {
  return fetchWithAuth<CurrentStageDetailsDto>(`/api/v1/batches/${batchId}/stages/current`);
}

/**
 * Updates batch name
 * 
 * @param batchId - Batch ID
 * @param command - Update command with new name
 * @returns Updated batch data
 */
export async function updateBatchName(
  batchId: string, 
  command: UpdateBatchCommand
): Promise<UpdateBatchResponseDto> {
  return fetchWithAuth<UpdateBatchResponseDto>(`/api/v1/batches/${batchId}`, {
    method: "PATCH",
    body: JSON.stringify(command),
  });
}

/**
 * Advances batch to next stage
 * 
 * @param batchId - Batch ID
 * @param command - Advance command with optional note
 * @returns Advance response with previous/current stage and optional note
 */
export async function advanceStage(
  batchId: string,
  command: AdvanceStageCommand = {}
): Promise<AdvanceStageResponseDto> {
  return fetchWithAuth<AdvanceStageResponseDto>(
    `/api/v1/batches/${batchId}/stages/advance`,
    {
      method: "POST",
      body: JSON.stringify(command),
    }
  );
}

/**
 * Completes (archives) a batch
 * 
 * @param batchId - Batch ID
 * @returns Complete batch response
 */
export async function completeBatch(batchId: string): Promise<CompleteBatchResponseDto> {
  return fetchWithAuth<CompleteBatchResponseDto>(
    `/api/v1/batches/${batchId}/complete`,
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
}

/**
 * Adds or updates rating for a batch
 * 
 * @param batchId - Batch ID
 * @param rating - Rating value (1-5)
 * @returns Rating data
 */
export async function upsertBatchRating(
  batchId: string,
  rating: number
): Promise<RatingDto> {
  return fetchWithAuth<RatingDto>(
    `/api/v1/batches/${batchId}/rating`,
    {
      method: "PUT",
      body: JSON.stringify({ rating }),
    }
  );
}

/**
 * Deletes a batch
 * 
 * @param batchId - Batch ID
 * @returns Delete response with message
 */
export async function deleteBatch(batchId: string): Promise<{ message: string }> {
  return fetchWithAuth<{ message: string }>(
    `/api/v1/batches/${batchId}`,
    {
      method: "DELETE",
    }
  );
}

