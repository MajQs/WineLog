/**
 * EditableHeading component
 * Inline editable heading for batch name with validation
 */

import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Check, X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBatchName } from "@/lib/api/batch";
import type { UpdateBatchCommand, UpdateBatchResponseDto } from "@/types";
import { toast } from "sonner";

// Validation schema
const batchNameSchema = z.object({
  name: z.string().min(1, "Nazwa nie może być pusta").max(100, "Nazwa nie może przekraczać 100 znaków").trim(),
});

interface EditableHeadingProps {
  name: string;
  batchId: string;
  onUpdated?: (name: string) => void;
}

export function EditableHeading({ name, batchId, onUpdated }: EditableHeadingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Mutation for updating batch name
  const mutation = useMutation<UpdateBatchResponseDto, Error, UpdateBatchCommand>({
    mutationFn: (command) => updateBatchName(batchId, command),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["batch", batchId] });

      // Snapshot previous value
      const previousBatch = queryClient.getQueryData(["batch", batchId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["batch", batchId], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        return { ...old, name: variables.name };
      });

      return { previousBatch };
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousBatch) {
        queryClient.setQueryData(["batch", batchId], context.previousBatch);
      }

      toast.error("Nie udało się zaktualizować nazwy", {
        description: error.message,
      });
    },
    onSuccess: (data) => {
      toast.success("Nazwa zaktualizowana");
      setIsEditing(false);
      setError(null);
      onUpdated?.(data.name);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["batch", batchId] });
    },
  });

  const handleEdit = () => {
    setValue(name);
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setValue(name);
    setError(null);
    setIsEditing(false);
  };

  const handleSubmit = () => {
    // Validate
    const result = batchNameSchema.safeParse({ name: value });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    // Don't submit if name hasn't changed
    if (result.data.name === name) {
      setIsEditing(false);
      return;
    }

    // Submit mutation
    mutation.mutate({ name: result.data.name });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-3 group">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{name}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          className="opacity-0 group-hover:opacity-100 sm:opacity-100 lg:opacity-0 transition-opacity flex-shrink-0"
          aria-label="Edytuj nazwę"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSubmit}
          disabled={mutation.isPending}
          className="text-2xl sm:text-3xl font-bold h-12 sm:h-14 px-3 sm:px-4"
          maxLength={100}
          aria-label="Nazwa nastawu"
          aria-invalid={!!error}
          aria-describedby={error ? "name-error" : undefined}
        />
        <Button
          variant="default"
          size="icon"
          onClick={handleSubmit}
          disabled={mutation.isPending}
          aria-label="Zapisz"
          className="flex-shrink-0"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          disabled={mutation.isPending}
          aria-label="Anuluj"
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {error && (
        <p id="name-error" className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
