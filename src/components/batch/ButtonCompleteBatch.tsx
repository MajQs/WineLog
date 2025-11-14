/**
 * ButtonCompleteBatch component
 * Button to complete (archive) a batch with optional rating
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { completeBatch, upsertBatchRating } from "@/lib/api/batch";
import { toast } from "sonner";

interface ButtonCompleteBatchProps {
  batchId: string;
  batchName: string;
  disabled?: boolean;
}

export function ButtonCompleteBatch({ 
  batchId,
  batchName,
  disabled = false,
}: ButtonCompleteBatchProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  // Mutation for completing batch
  const completeMutation = useMutation({
    mutationFn: async () => {
      // First, complete the batch
      const completeResult = await completeBatch(batchId);
      
      // If rating is selected, add rating
      if (selectedRating !== null) {
        await upsertBatchRating(batchId, selectedRating);
      }
      
      return completeResult;
    },
    onSuccess: (data) => {
      const ratingText = selectedRating 
        ? ` Ocena: ${selectedRating}/5 gwiazdek.` 
        : "";
      
      toast.success("Nastaw zakończony!", {
        description: `${data.message}${ratingText}`,
      });
      
      setIsDialogOpen(false);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    },
    onError: (error) => {
      toast.error("Nie udało się zakończyć nastawu", {
        description: error instanceof Error ? error.message : "Spróbuj ponownie później",
      });
    },
  });

  const handleOpenDialog = () => {
    setSelectedRating(null);
    setHoveredRating(null);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setSelectedRating(null);
    setHoveredRating(null);
    setIsDialogOpen(false);
  };

  const handleComplete = () => {
    completeMutation.mutate();
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating === selectedRating ? null : rating);
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        disabled={disabled || completeMutation.isPending}
        size="lg"
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        data-testid="button-complete-batch"
      >
        {completeMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Kończenie...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Zakończ nastaw
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" data-testid="dialog-complete-batch">
          <DialogHeader>
            <DialogTitle>Zakończ nastaw</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz zakończyć nastaw <strong>{batchName}</strong>?
              <br />
              Nastaw zostanie zarchiwizowany i przeniesiony do archiwum.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Rating Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Oceń swój nastaw (opcjonalne)
              </Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(null)}
                    disabled={completeMutation.isPending}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label={`Oceń ${rating} ${rating === 1 ? "gwiazdkę" : "gwiazdek"}`}
                    data-testid={`button-rating-${rating}`}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        (hoveredRating !== null && rating <= hoveredRating) ||
                        (hoveredRating === null && selectedRating !== null && rating <= selectedRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedRating !== null && (
                <p className="text-sm text-gray-600">
                  Wybrana ocena: {selectedRating}/5
                </p>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Po zakończeniu zostaniesz przekierowany do dashboardu.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={completeMutation.isPending}
              data-testid="button-cancel-complete"
            >
              Anuluj
            </Button>
            <Button
              type="button"
              onClick={handleComplete}
              disabled={completeMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-confirm-complete"
            >
              {completeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kończenie...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Potwierdź zakończenie
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

