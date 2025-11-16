/**
 * New Batch Modal Component
 * Modal for creating a new batch from a template
 */

import { useState } from "react";
import { toast } from "sonner";
import { useTemplates } from "@/lib/hooks/useTemplates";
import { useCreateBatch } from "@/lib/hooks/useCreateBatch";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TemplatePickerGrid } from "./TemplatePickerGrid";
import { InputName } from "./InputName";
import { Toaster } from "@/components/ui/sonner";

/**
 * View model for the create batch form
 */
interface CreateBatchViewModel {
  templateId: string | null;
  name: string;
  error?: string;
  fieldErrors?: {
    name?: string;
  };
  isSubmitting: boolean;
}

/**
 * Initial form state
 */
const initialFormState: CreateBatchViewModel = {
  templateId: null,
  name: "",
  error: undefined,
  fieldErrors: {},
  isSubmitting: false,
};

/**
 * New Batch Modal Content
 * Contains the form logic and UI
 */
function NewBatchModalContent() {
  const [formState, setFormState] = useState<CreateBatchViewModel>(initialFormState);
  const [isOpen, setIsOpen] = useState(true);

  // Fetch templates
  const { data: templates, isLoading: isLoadingTemplates, isError: isTemplatesError } = useTemplates();

  // Create batch mutation
  const createBatchMutation = useCreateBatch();

  /**
   * Handle modal close - navigate back to dashboard
   */
  const handleClose = () => {
    if (!formState.isSubmitting) {
      setIsOpen(false);
      // Navigate back using window.location since we don't have router in Astro SSR
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 200); // Small delay for animation
    }
  };

  /**
   * Handle template selection
   */
  const handleTemplateSelect = (templateId: string) => {
    setFormState((prev) => ({
      ...prev,
      templateId,
      error: undefined,
    }));
  };

  /**
   * Handle name input change
   */
  const handleNameChange = (value: string) => {
    // Validate max length
    const fieldError = value.length > 100 ? "Nazwa może mieć maksymalnie 100 znaków" : undefined;

    setFormState((prev) => ({
      ...prev,
      name: value,
      fieldErrors: {
        ...prev.fieldErrors,
        name: fieldError,
      },
    }));
  };

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    if (!formState.templateId) {
      setFormState((prev) => ({
        ...prev,
        error: "Wybierz szablon produkcji",
      }));
      return false;
    }

    if (formState.name.length > 100) {
      setFormState((prev) => ({
        ...prev,
        fieldErrors: {
          ...prev.fieldErrors,
          name: "Nazwa może mieć maksymalnie 100 znaków",
        },
      }));
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set submitting state
    setFormState((prev) => ({ ...prev, isSubmitting: true, error: undefined }));

    try {
      // Template ID is validated by validateForm
      if (!formState.templateId) return;

      // Create batch
      const batch = await createBatchMutation.mutateAsync({
        template_id: formState.templateId,
        name: formState.name || undefined,
      });

      // Show success toast
      toast.success("Nastaw utworzony pomyślnie");

      // Navigate to batch detail page
      window.location.href = `/batches/${batch.id}`;
    } catch (error) {
      // Handle error
      let errorMessage = "Wystąpił błąd podczas tworzenia nastawu";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Handle specific error codes (if ApiError is used)
        if ("code" in error && typeof error === "object") {
          const code = (error as { code: string }).code;

          if (code === "NAME_TOO_LONG") {
            setFormState((prev) => ({
              ...prev,
              fieldErrors: {
                ...prev.fieldErrors,
                name: "Nazwa może mieć maksymalnie 100 znaków",
              },
              isSubmitting: false,
            }));
            return;
          }

          if (code === "RESOURCE_NOT_FOUND") {
            toast.error("Wybrany szablon nie jest już dostępny");
            // Reset template selection
            setFormState((prev) => ({
              ...prev,
              templateId: null,
              error: "Szablon nie został znaleziony. Wybierz inny szablon.",
              isSubmitting: false,
            }));
            return;
          }

          if (code === "NETWORK_ERROR" || code === "TIMEOUT") {
            errorMessage = "Brak połączenia z serwerem. Sprawdź swoje połączenie internetowe.";
          }
        }
      }

      setFormState((prev) => ({
        ...prev,
        error: errorMessage,
        isSubmitting: false,
      }));
    }
  };

  /**
   * Determine if submit button should be disabled
   */
  const isSubmitDisabled = formState.isSubmitting || !formState.templateId || !!formState.fieldErrors?.name;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl" data-testid="dialog-new-batch">
        <DialogHeader>
          <DialogTitle>Nowy nastaw</DialogTitle>
          <DialogDescription>Wybierz szablon produkcji i opcjonalnie nadaj nazwę nastawowi</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Picker */}
          {isLoadingTemplates && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isTemplatesError && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-sm text-destructive">
              Nie udało się załadować szablonów. Spróbuj ponownie później.
            </div>
          )}

          {templates && templates.length === 0 && (
            <div className="rounded-lg border border-muted bg-muted/10 p-4 text-center text-sm text-muted-foreground">
              Brak dostępnych szablonów
            </div>
          )}

          {templates && templates.length > 0 && (
            <TemplatePickerGrid
              templates={templates}
              selectedId={formState.templateId ?? undefined}
              onSelect={handleTemplateSelect}
            />
          )}

          {/* Name Input */}
          {templates && templates.length > 0 && (
            <InputName
              value={formState.name}
              onChange={handleNameChange}
              error={formState.fieldErrors?.name}
              maxLength={100}
            />
          )}

          {/* Global error message */}
          {formState.error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {formState.error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={formState.isSubmitting}
            data-testid="button-cancel-batch"
          >
            Anuluj
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitDisabled} data-testid="button-submit-batch">
            {formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tworzenie...
              </>
            ) : (
              "Utwórz"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * New Batch Modal Component
 * Root component with QueryProvider wrapper
 */
export default function NewBatchModal() {
  return (
    <QueryProvider>
      <NewBatchModalContent />
      <Toaster />
    </QueryProvider>
  );
}
