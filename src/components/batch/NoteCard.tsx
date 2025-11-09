/**
 * NoteCard component
 * Displays a single note with action, observations and date
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteNote } from "@/lib/api/note";
import type { NoteDto } from "@/types";
import { toast } from "sonner";

interface NoteCardProps {
  note: NoteDto;
  batchId: string;
  onDelete?: (noteId: string) => void;
}

export function NoteCard({ note, batchId, onDelete }: NoteCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Format date
  const formattedDate = format(new Date(note.created_at), "d MMMM yyyy, HH:mm", {
    locale: pl,
  });

  // Mutation for deleting note
  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(batchId, note.id),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["batch", batchId, "current-stage"] });

      // Snapshot previous value
      const previousStage = queryClient.getQueryData(["batch", batchId, "current-stage"]);

      // Optimistically remove the note
      queryClient.setQueryData(["batch", batchId, "current-stage"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notes: old.notes?.filter((n: NoteDto) => n.id !== note.id) || [],
        };
      });

      return { previousStage };
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousStage) {
        queryClient.setQueryData(["batch", batchId, "current-stage"], context.previousStage);
      }
      
      toast.error("Nie udało się usunąć notatki", {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.success("Notatka usunięta");
      setIsDeleteDialogOpen(false);
      onDelete?.(note.id);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["batch", batchId, "current-stage"] });
      queryClient.invalidateQueries({ queryKey: ["batch", batchId, "notes"] });
    },
  });

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="space-y-3">
            {/* Header with delete button */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {note.action}
                </h4>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteClick}
                className="text-gray-400 hover:text-red-600"
                aria-label="Usuń notatkę"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Observations */}
            {note.observations && (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {note.observations}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń notatkę</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć tę notatkę? Tej operacji nie można cofnąć.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Usuwanie..." : "Usuń"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

