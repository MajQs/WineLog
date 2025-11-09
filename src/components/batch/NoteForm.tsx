/**
 * NoteForm component
 * Form for creating new notes attached to current stage
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createNote } from "@/lib/api/note";
import type { CreateNoteCommand, NoteDto } from "@/types";
import { toast } from "sonner";

// Validation schema
const noteSchema = z.object({
  action: z.string()
    .min(1, "Akcja jest wymagana")
    .max(200, "Akcja nie może przekraczać 200 znaków")
    .trim(),
  observations: z.string()
    .max(200, "Obserwacje nie mogą przekraczać 200 znaków")
    .trim()
    .optional(),
});

interface NoteFormProps {
  batchId: string;
  onCreated?: (note: NoteDto) => void;
}

export function NoteForm({ batchId, onCreated }: NoteFormProps) {
  const [action, setAction] = useState("");
  const [observations, setObservations] = useState("");
  const [errors, setErrors] = useState<{ action?: string; observations?: string }>({});
  const queryClient = useQueryClient();

  // Mutation for creating note
  const mutation = useMutation<NoteDto, Error, CreateNoteCommand>({
    mutationFn: (command) => createNote(batchId, command),
    onMutate: async (newNote) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["batch", batchId, "current-stage"] });

      // Snapshot previous value
      const previousStage = queryClient.getQueryData(["batch", batchId, "current-stage"]);

      // Optimistically add the new note
      queryClient.setQueryData(["batch", batchId, "current-stage"], (old: any) => {
        if (!old) return old;
        
        const optimisticNote: NoteDto = {
          id: `temp-${Date.now()}`,
          batch_id: batchId,
          stage_id: old.id,
          user_id: "temp-user",
          action: newNote.action,
          observations: newNote.observations || null,
          created_at: new Date().toISOString(),
        };

        return {
          ...old,
          notes: [...(old.notes || []), optimisticNote],
        };
      });

      return { previousStage };
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousStage) {
        queryClient.setQueryData(["batch", batchId, "current-stage"], context.previousStage);
      }
      
      toast.error("Nie udało się dodać notatki", {
        description: error.message,
      });
    },
    onSuccess: (data) => {
      toast.success("Notatka dodana");
      
      // Reset form
      setAction("");
      setObservations("");
      setErrors({});

      onCreated?.(data);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["batch", batchId, "current-stage"] });
      queryClient.invalidateQueries({ queryKey: ["batch", batchId, "notes"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const result = noteSchema.safeParse({
      action,
      observations: observations || undefined,
    });

    if (!result.success) {
      const fieldErrors: { action?: string; observations?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as "action" | "observations";
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Submit mutation
    mutation.mutate({
      action: result.data.action,
      observations: result.data.observations,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dodaj notatkę</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="note-action" 
              className="text-sm font-medium text-gray-700"
            >
              Akcja <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="note-action"
              placeholder="Co zostało zrobione? (np. 'Dodano drożdże', 'Przelewka')"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              disabled={mutation.isPending}
              maxLength={200}
              rows={3}
              aria-invalid={!!errors.action}
              aria-describedby={errors.action ? "action-error" : undefined}
              required
            />
            {errors.action && (
              <p id="action-error" className="text-sm text-red-600" role="alert">
                {errors.action}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {action.length}/200 znaków
            </p>
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="note-observations" 
              className="text-sm font-medium text-gray-700"
            >
              Obserwacje (opcjonalne)
            </label>
            <Textarea
              id="note-observations"
              placeholder="Dodatkowe obserwacje, zapach, wygląd, temperatura..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              disabled={mutation.isPending}
              maxLength={200}
              rows={3}
              aria-invalid={!!errors.observations}
              aria-describedby={errors.observations ? "observations-error" : undefined}
            />
            {errors.observations && (
              <p id="observations-error" className="text-sm text-red-600" role="alert">
                {errors.observations}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {observations.length}/200 znaków
            </p>
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending || !action.trim()}
            className="w-full"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Dodawanie...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Dodaj notatkę
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

