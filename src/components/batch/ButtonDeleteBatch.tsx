/**
 * ButtonDeleteBatch component
 * Button with confirmation dialog for deleting a batch
 */

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteBatchMutation } from "@/lib/hooks/useDeleteBatchMutation";

interface ButtonDeleteBatchProps {
  batchId: string;
  batchName: string;
}

export function ButtonDeleteBatch({ batchId, batchName }: ButtonDeleteBatchProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteMutation = useDeleteBatchMutation({
    batchId,
    onSuccess: () => {
      setIsDialogOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        disabled={deleteMutation.isPending}
        data-testid="button-delete-batch"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Usuń nastaw
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-delete-batch">
          <DialogHeader>
            <DialogTitle>Czy na pewno chcesz usunąć ten nastaw?</DialogTitle>
            <DialogDescription>
              Nastaw "<strong>{batchName}</strong>" zostanie trwale usunięty.
              Ta akcja jest nieodwracalna i spowoduje utratę wszystkich danych,
              notatek i historii związanych z tym nastawem.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={deleteMutation.isPending}
              data-testid="button-cancel-delete"
            >
              Anuluj
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Usuwanie..." : "Usuń nastaw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}



