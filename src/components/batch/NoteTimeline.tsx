/**
 * NoteTimeline component
 * Displays chronological list of notes
 */

import { FileText } from "lucide-react";
import { NoteCard } from "./NoteCard";
import type { NoteDto } from "@/types";

interface NoteTimelineProps {
  notes: NoteDto[];
  batchId: string;
  onDelete?: (noteId: string) => void;
}

export function NoteTimeline({ notes, batchId, onDelete }: NoteTimelineProps) {
  // Sort notes by created_at (newest first)
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (sortedNotes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" aria-hidden="true" />
        <p className="text-sm">Brak notatek</p>
        <p className="text-xs mt-1">Dodaj pierwszą notatkę powyżej</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="list" aria-label="Lista notatek">
      {sortedNotes.map((note) => (
        <div key={note.id} role="listitem">
          <NoteCard 
            note={note} 
            batchId={batchId}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

