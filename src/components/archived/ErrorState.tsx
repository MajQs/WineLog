/**
 * Error State Component
 * Displays error message with retry option for archived view
 */

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

/**
 * Error State Component
 * Shows error icon, message and retry button
 */
export function ErrorState({ onRetry, message = "Wystąpił błąd podczas ładowania archiwum." }: ErrorStateProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 text-center">
        <div className="text-destructive flex items-center justify-center rounded-full bg-destructive/10 p-4">
          <AlertCircle className="size-12" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Coś poszło nie tak</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>

        <Button onClick={onRetry} variant="default" size="lg" aria-label="Spróbuj ponownie załadować archiwum">
          Spróbuj ponownie
        </Button>
      </div>
    </div>
  );
}
