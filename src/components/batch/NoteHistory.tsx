/**
 * NoteHistory component
 * Displays all notes grouped by stages
 */

import { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "./NoteCard";
import type { NoteDto, BatchStageDto } from "@/types";

interface NoteHistoryProps {
  notes: NoteDto[];
  stages: BatchStageDto[];
  batchId: string;
}

/**
 * Group notes by stage_id
 */
function groupNotesByStage(notes: NoteDto[], stages: BatchStageDto[]) {
  // Create a map of stage_id to stage info
  const stageMap = new Map(
    stages.map((stage) => [
      stage.id,
      {
        position: stage.position,
        description: stage.description,
        name: stage.name,
      },
    ])
  );

  // Group notes by stage_id
  const grouped = new Map<string, NoteDto[]>();
  
  for (const note of notes) {
    if (note.stage_id) {
      const existing = grouped.get(note.stage_id) || [];
      grouped.set(note.stage_id, [...existing, note]);
    }
  }

  // Sort notes within each group by created_at (newest first)
  for (const [stageId, stageNotes] of grouped) {
    grouped.set(
      stageId,
      stageNotes.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    );
  }

  // Convert to array and sort by stage position
  const result = Array.from(grouped.entries())
    .map(([stageId, stageNotes]) => ({
      stageId,
      stageInfo: stageMap.get(stageId),
      notes: stageNotes,
    }))
    .filter((item) => item.stageInfo) // Only include stages that exist
    .sort((a, b) => (b.stageInfo?.position || 0) - (a.stageInfo?.position || 0)); // Newest stage first

  return result;
}

export function NoteHistory({ notes, stages, batchId }: NoteHistoryProps) {
  // State to track if history is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  // Group notes by stage
  const groupedNotes = groupNotesByStage(notes, stages);

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" aria-hidden="true" />
        <p className="text-sm">Brak notatek</p>
        <p className="text-xs mt-1">Dodaj pierwszą notatkę powyżej</p>
      </div>
    );
  }

  // Find the most recent note across all stages
  const mostRecentGroup = groupedNotes[0]; // Groups are sorted by stage position (newest first)
  const mostRecentNote = mostRecentGroup?.notes[0]; // First note in the newest stage

  // Get all other notes (older notes)
  const olderGroups = groupedNotes.slice(); // Copy all groups
  
  // Remove the first note from the first group
  if (olderGroups.length > 0 && olderGroups[0].notes.length > 1) {
    // If first group has multiple notes, keep the group but remove first note
    olderGroups[0] = {
      ...olderGroups[0],
      notes: olderGroups[0].notes.slice(1),
    };
  } else if (olderGroups.length > 0) {
    // If first group has only one note, remove the entire group
    olderGroups.shift();
  }

  const hasOlderNotes = olderGroups.some(group => group.notes.length > 0);
  const totalOlderNotes = olderGroups.reduce((sum, group) => sum + group.notes.length, 0);

  return (
    <div className="space-y-6" role="list" aria-label="Historia notatek pogrupowana po etapach">
      {/* Most recent note - always visible */}
      {mostRecentNote && mostRecentGroup && (
        <div className="space-y-3">
          {/* Stage header for most recent note */}
          <div className="flex items-center gap-2 border-b pb-2">
            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
              Etap {mostRecentGroup.stageInfo?.position}
            </span>
            <h4 className="text-sm font-medium text-gray-700">
              {mostRecentGroup.stageInfo?.description}
            </h4>
          </div>

          {/* Most recent note card */}
          <div className="pl-2">
            <NoteCard note={mostRecentNote} batchId={batchId} />
          </div>
        </div>
      )}

      {/* Expand/Collapse button */}
      {hasOlderNotes && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground w-full"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Ukryj starsze notatki
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Pokaż {totalOlderNotes} {totalOlderNotes === 1 ? "starszą notatkę" : totalOlderNotes < 5 ? "starsze notatki" : "starszych notatek"}
            </>
          )}
        </Button>
      )}

      {/* Older notes - shown when expanded */}
      {isExpanded && hasOlderNotes && (
        <div className="space-y-6">
          {olderGroups.map(({ stageId, stageInfo, notes: stageNotes }) => {
            if (stageNotes.length === 0) return null;

            return (
              <div key={stageId} className="space-y-3">
                {/* Stage header */}
                <div className="flex items-center gap-2 border-b pb-2">
                  <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
                    Etap {stageInfo?.position}
                  </span>
                  <h4 className="text-sm font-medium text-gray-700">
                    {stageInfo?.description}
                  </h4>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {stageNotes.length} {stageNotes.length === 1 ? "notatka" : stageNotes.length < 5 ? "notatki" : "notatek"}
                  </span>
                </div>

                {/* Notes for this stage */}
                <div className="space-y-3 pl-2">
                  {stageNotes.map((note) => (
                    <div key={note.id}>
                      <NoteCard note={note} batchId={batchId} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

