/**
 * Note Service
 * Handles business logic for note operations
 */

import type { SupabaseClient } from "../db/supabase.client";
import type {
  CreateNoteCommand,
  NoteDto,
  NoteListResponseDto,
  MessageResponseDto,
  NotesQueryParams,
  NoteStageContextDto,
  StageName,
} from "../types";

/**
 * Creates a new note for the current stage of a batch
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @param command - Create note command with action and optional observations
 * @returns Created note with stage context
 */
export async function createNote(
  supabase: SupabaseClient,
  userId: string,
  batchId: string,
  command: CreateNoteCommand
): Promise<NoteDto> {
  // 1. Verify batch exists and belongs to user
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("id, status")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (batchError) {
    throw new Error(`Failed to fetch batch: ${batchError.message}`);
  }

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  // 2. Get current stage (first non-completed stage)
  const { data: currentStageData, error: stageError } = await supabase
    .from("batch_stages")
    .select(
      `
      id,
      template_stages!inner(position, name, description)
    `
    )
    .eq("batch_id", batchId)
    .is("completed_at", null)
    .order("template_stages(position)", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (stageError) {
    throw new Error(`Failed to fetch current stage: ${stageError.message}`);
  }

  // Note: stage_id can be null if all stages are completed or batch is custom
  const stageId = currentStageData?.id || null;

  // 3. Create note
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .insert({
      batch_id: batchId,
      stage_id: stageId,
      user_id: userId,
      action: command.action,
      observations: command.observations || null,
    })
    .select()
    .single();

  if (noteError || !note) {
    throw new Error(`Failed to create note: ${noteError?.message}`);
  }

  // 4. Build response with stage context
  let stageContext: NoteStageContextDto | undefined;
  if (currentStageData) {
    const templateStage = (
      currentStageData as { template_stages: { position: number; name: string; description: string } }
    ).template_stages;
    stageContext = {
      position: templateStage.position,
      name: templateStage.name as StageName,
      description: templateStage.description,
    };
  }

  return {
    id: note.id,
    batch_id: note.batch_id,
    stage_id: note.stage_id,
    user_id: note.user_id,
    action: note.action,
    observations: note.observations,
    created_at: note.created_at,
    stage: stageContext,
    stage_name: stageContext?.name,
  };
}

/**
 * Lists notes for a batch with optional filtering and sorting
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @param params - Query parameters for filtering and sorting
 * @returns List of notes with total count
 */
export async function listNotes(
  supabase: SupabaseClient,
  userId: string,
  batchId: string,
  params?: NotesQueryParams
): Promise<NoteListResponseDto> {
  // 1. Verify batch exists and belongs to user
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("id")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (batchError) {
    throw new Error(`Failed to fetch batch: ${batchError.message}`);
  }

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  // 2. Build query for notes
  let query = supabase
    .from("notes")
    .select(
      `
      id,
      batch_id,
      stage_id,
      user_id,
      action,
      observations,
      created_at,
      batch_stages(
        id,
        template_stages(position, name, description)
      )
    `
    )
    .eq("batch_id", batchId);

  // Apply stage_id filter if provided
  if (params?.stage_id) {
    query = query.eq("stage_id", params.stage_id);
  }

  // Apply sorting (default: desc)
  const sortOrder = params?.sort === "asc";
  query = query.order("created_at", { ascending: sortOrder });

  const { data: notesData, error: notesError } = await query;

  if (notesError) {
    throw new Error(`Failed to fetch notes: ${notesError.message}`);
  }

  interface NoteWithStage {
    id: string;
    batch_id: string;
    stage_id: string;
    user_id: string;
    action: string;
    observations: string | null;
    created_at: string;
    batch_stages?: {
      template_stages?: {
        position: number;
        name: string;
        description: string;
      };
    };
  }

  // 3. Transform data to DTOs
  const notes: NoteDto[] = (notesData || []).map((note: NoteWithStage) => {
    let stageContext: NoteStageContextDto | undefined;
    let stageName: StageName | undefined;

    if (note.batch_stages && note.batch_stages.template_stages) {
      const templateStage = note.batch_stages.template_stages;
      stageContext = {
        position: templateStage.position,
        name: templateStage.name,
        description: templateStage.description,
      };
      stageName = templateStage.name;
    }

    return {
      id: note.id,
      batch_id: note.batch_id,
      stage_id: note.stage_id,
      user_id: note.user_id,
      action: note.action,
      observations: note.observations,
      created_at: note.created_at,
      stage: stageContext,
      stage_name: stageName,
    };
  });

  return {
    notes,
    total: notes.length,
  };
}

/**
 * Deletes a note (hard delete)
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @param noteId - Note UUID
 * @returns Success message or null if not found
 */
export async function deleteNote(
  supabase: SupabaseClient,
  userId: string,
  batchId: string,
  noteId: string
): Promise<MessageResponseDto | null> {
  // 1. Verify batch exists and belongs to user
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("id")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (batchError) {
    throw new Error(`Failed to fetch batch: ${batchError.message}`);
  }

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  // 2. Verify note exists and belongs to the batch and user
  const { data: existingNote, error: noteCheckError } = await supabase
    .from("notes")
    .select("id")
    .eq("id", noteId)
    .eq("batch_id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (noteCheckError) {
    throw new Error(`Failed to fetch note: ${noteCheckError.message}`);
  }

  if (!existingNote) {
    return null;
  }

  // 3. Delete note
  const { error: deleteError } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("batch_id", batchId)
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(`Failed to delete note: ${deleteError.message}`);
  }

  return {
    message: "Note deleted successfully",
  };
}
