/**
 * ButtonNextStage component
 * CTA button to advance batch to next stage with confirmation dialog
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { advanceStage } from "@/lib/api/batch";
import type { AdvanceStageCommand, AdvanceStageResponseDto } from "@/types";
import { toast } from "sonner";

// Validation schema for optional note
const advanceStageSchema = z.object({
  note: z.object({
    action: z.string()
      .min(1, "Akcja jest wymagana")
      .max(200, "Akcja nie może przekraczać 200 znaków")
      .trim()
      .optional(),
    observations: z.string()
      .max(200, "Obserwacje nie mogą przekraczać 200 znaków")
      .trim()
      .optional(),
  }).optional(),
});

interface ButtonNextStageProps {
  batchId: string;
  disabled?: boolean;
  currentStagePosition?: number;
  nextStagePosition?: number;
  onAdvanced?: () => void;
}

export function ButtonNextStage({ 
  batchId, 
  disabled = false,
  currentStagePosition,
  nextStagePosition,
  onAdvanced,
}: ButtonNextStageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState("");
  const [observations, setObservations] = useState("");
  const [errors, setErrors] = useState<{ action?: string; observations?: string }>({});
  const queryClient = useQueryClient();

  // Mutation for advancing stage
  const mutation = useMutation<AdvanceStageResponseDto, Error, AdvanceStageCommand>({
    mutationFn: (command) => advanceStage(batchId, command),
    onSuccess: (data) => {
      toast.success("Przejście do kolejnego etapu zakończone sukcesem", {
        description: `Obecnie: ${data.current_stage.name}`,
      });
      
      // Reset form
      setAction("");
      setObservations("");
      setErrors({});
      setIsDialogOpen(false);

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["batch", batchId] });
      queryClient.invalidateQueries({ queryKey: ["batch", batchId, "current-stage"] });
      queryClient.invalidateQueries({ queryKey: ["batch", batchId, "notes"] });

      onAdvanced?.();
    },
    onError: (error) => {
      toast.error("Nie udało się przejść do kolejnego etapu", {
        description: error.message,
      });
    },
  });

  const handleOpenDialog = () => {
    setAction("");
    setObservations("");
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setAction("");
    setObservations("");
    setErrors({});
    setIsDialogOpen(false);
  };

  const handleAdvance = () => {
    // Build command
    const command: AdvanceStageCommand = {};
    
    // Add note if action is provided
    if (action.trim()) {
      command.note = {
        action: action.trim(),
        observations: observations.trim() || undefined,
      };
    }

    // Validate
    const result = advanceStageSchema.safeParse(command);
    
    if (!result.success) {
      const fieldErrors: { action?: string; observations?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[1] as "action" | "observations";
        if (field) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Execute mutation
    mutation.mutate(command);
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        disabled={disabled || mutation.isPending}
        size="lg"
        className="w-full sm:w-auto"
        data-testid="button-next-stage"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Przechodzenie...
          </>
        ) : (
          <>
            Przejdź do następnego etapu
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" data-testid="dialog-next-stage">
          <DialogHeader>
            <DialogTitle>Przejdź do następnego etapu</DialogTitle>
            <DialogDescription>
              {currentStagePosition !== undefined && nextStagePosition !== undefined ? (
                <>
                  Przechodzisz z etapu <strong>{currentStagePosition}</strong> do etapu{" "}
                  <strong>{nextStagePosition}</strong>.
                </>
              ) : (
                "Czy na pewno chcesz przejść do następnego etapu?"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label 
                htmlFor="action" 
                className="text-sm font-medium text-gray-700"
              >
                Akcja (opcjonalna)
              </label>
              <Textarea
                id="action"
                placeholder="Co zostało zrobione w tym etapie?"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                disabled={mutation.isPending}
                maxLength={200}
                rows={3}
                aria-invalid={!!errors.action}
                aria-describedby={errors.action ? "action-error" : undefined}
                data-testid="textarea-advance-action"
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
                htmlFor="observations" 
                className="text-sm font-medium text-gray-700"
              >
                Obserwacje (opcjonalne)
              </label>
              <Textarea
                id="observations"
                placeholder="Dodatkowe obserwacje lub uwagi"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                disabled={mutation.isPending}
                maxLength={200}
                rows={3}
                aria-invalid={!!errors.observations}
                aria-describedby={errors.observations ? "observations-error" : undefined}
                data-testid="textarea-advance-observations"
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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={mutation.isPending}
              data-testid="button-cancel-next-stage"
            >
              Anuluj
            </Button>
            <Button
              type="button"
              onClick={handleAdvance}
              disabled={mutation.isPending}
              data-testid="button-confirm-next-stage"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Przechodzenie...
                </>
              ) : (
                "Potwierdź"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

