/**
 * ErrorState component for Batch View
 * Displays different error messages based on error code
 */

import { AlertCircle, Lock, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/fetch";

interface ErrorStateProps {
  error: Error | ApiError | unknown;
  onRetry?: () => void;
}

/**
 * Get error display information based on error type and code
 */
function getErrorDisplay(error: Error | ApiError | unknown) {
  // Handle ApiError with specific codes
  if (error instanceof ApiError) {
    switch (error.status) {
      case 404:
        return {
          icon: AlertCircle,
          title: "Nastaw nie znaleziony",
          message: "Ten nastaw nie istnieje lub został usunięty.",
          showRetry: false,
          showDashboard: true,
        };

      case 403:
        return {
          icon: Lock,
          title: "Brak dostępu",
          message: "Nie masz uprawnień do przeglądania tego nastawu.",
          showRetry: false,
          showDashboard: true,
        };

      case 409:
        return {
          icon: AlertCircle,
          title: "Konflikt operacji",
          message: error.message || "Nie można wykonać tej operacji.",
          showRetry: true,
          showDashboard: false,
        };

      case 408:
        return {
          icon: ServerCrash,
          title: "Przekroczono czas oczekiwania",
          message: "Serwer nie odpowiedział w wymaganym czasie. Sprawdź połączenie internetowe.",
          showRetry: true,
          showDashboard: false,
        };

      case 500:
      case 502:
      case 503:
        return {
          icon: ServerCrash,
          title: "Błąd serwera",
          message: "Wystąpił problem po stronie serwera. Spróbuj ponownie za chwilę.",
          showRetry: true,
          showDashboard: false,
        };

      default:
        return {
          icon: AlertCircle,
          title: "Wystąpił błąd",
          message: error.message || "Nie udało się załadować nastawu.",
          showRetry: true,
          showDashboard: false,
        };
    }
  }

  // Handle generic Error
  if (error instanceof Error) {
    return {
      icon: AlertCircle,
      title: "Wystąpił błąd",
      message: error.message || "Nie udało się załadować nastawu.",
      showRetry: true,
      showDashboard: false,
    };
  }

  // Handle unknown error
  return {
    icon: AlertCircle,
    title: "Nieznany błąd",
    message: "Wystąpił nieoczekiwany problem. Spróbuj ponownie.",
    showRetry: true,
    showDashboard: false,
  };
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const display = getErrorDisplay(error);
  const Icon = display.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 text-center">
          {/* Error Icon */}
          <div className="flex items-center justify-center rounded-full bg-red-100 p-4">
            <Icon className="h-12 w-12 text-red-600" aria-hidden="true" />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">{display.title}</h2>
            <p className="text-gray-600">{display.message}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {display.showRetry && onRetry && (
              <Button
                onClick={onRetry}
                variant="default"
                size="lg"
                className="w-full sm:w-auto"
                aria-label="Spróbuj ponownie załadować nastaw"
              >
                Spróbuj ponownie
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
