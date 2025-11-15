/**
 * View Model Types
 * Frontend-specific types for component display
 */

import type { BatchType, NoteDto, BatchStageDto } from "../types";

/**
 * View model for archived batch card
 * Used in BatchCardArchived component
 */
export interface ArchivedBatchCardVM {
  id: string;
  name: string;
  type: BatchType;
  startedAt: string; // ISO date string
  completedAt: string; // ISO date string
  startedAtHuman: string; // Formatted date for display
  completedAtHuman: string; // Formatted date for display
  rating: number | null; // 1-5 or null
}

/**
 * View model for archived batch detail view
 * Used in ArchivedBatchView component
 */
export interface ArchivedBatchViewModel {
  id: string;
  name: string;
  type: BatchType;
  status: string;
  started_at: string;
  completed_at: string | null;
  startedAtHuman: string;
  completedAtHuman?: string;
  template?: {
    id: string;
    name: string;
    type: BatchType;
  };
  stages: BatchStageDto[];
  notes: NoteDto[];
  rating?: number | null;
  notesCount: number;
}
