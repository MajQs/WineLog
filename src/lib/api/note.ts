/**
 * Note API client
 * Manages notes for batches
 */

import type { 
  CreateNoteCommand, 
  NoteDto, 
  NoteListResponseDto,
  MessageResponseDto 
} from "@/types";
import { fetchWithAuth } from "./fetch";

/**
 * Fetches all notes for a batch
 * 
 * @param batchId - Batch ID
 * @returns List of notes with total count
 */
export async function fetchNotes(batchId: string): Promise<NoteListResponseDto> {
  return fetchWithAuth<NoteListResponseDto>(`/api/v1/batches/${batchId}/notes`);
}

/**
 * Creates a new note for a batch
 * 
 * @param batchId - Batch ID
 * @param command - Create note command
 * @returns Created note
 */
export async function createNote(
  batchId: string,
  command: CreateNoteCommand
): Promise<NoteDto> {
  return fetchWithAuth<NoteDto>(`/api/v1/batches/${batchId}/notes`, {
    method: "POST",
    body: JSON.stringify(command),
  });
}

/**
 * Deletes a note
 * 
 * @param batchId - Batch ID
 * @param noteId - Note ID
 * @returns Message response
 */
export async function deleteNote(
  batchId: string,
  noteId: string
): Promise<MessageResponseDto> {
  return fetchWithAuth<MessageResponseDto>(
    `/api/v1/batches/${batchId}/notes/${noteId}`,
    {
      method: "DELETE",
    }
  );
}

