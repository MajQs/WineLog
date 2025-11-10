/**
 * DeleteAccountForm Component
 * Allows user to permanently delete their account with confirmation
 */

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteAccountSchema } from "@/lib/auth-validation";
import { useAuth, getAuthToken } from "./AuthProvider";
import type { ZodError } from "zod";

interface DeleteAccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface DeleteAccountFormState {
  password: string;
  confirmation: string;
}

export function DeleteAccountForm({ onSuccess, onCancel }: DeleteAccountFormProps) {
  const { signOut } = useAuth();
  const [formData, setFormData] = useState<DeleteAccountFormState>({
    password: "",
    confirmation: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DeleteAccountFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    // Validate form data
    const result = deleteAccountSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof DeleteAccountFormState, string>> = {};
      (result.error as ZodError).errors.forEach((err) => {
        const field = err.path[0] as keyof DeleteAccountFormState;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuthToken();

      if (!token) {
        setGlobalError("Nie jesteś zalogowany.");
        return;
      }

      // Call delete account API endpoint
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          password: result.data.password,
          confirmation: result.data.confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (response.status === 401) {
          setGlobalError("Nieprawidłowe hasło.");
        } else {
          setGlobalError(data.error || "Wystąpił błąd podczas usuwania konta. Spróbuj ponownie.");
        }
        return;
      }

      // Sign out and redirect
      if (onSuccess) {
        onSuccess();
      } else {
        await signOut();
        window.location.href = "/?deleted=true";
      }
    } catch (error) {
      setGlobalError("Wystąpił błąd podczas usuwania konta. Spróbuj ponownie.");
      console.error("Delete account error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-xl font-bold text-destructive">Usuń konto</CardTitle>
        </div>
        <CardDescription>
          Ta operacja jest nieodwracalna. Wszystkie Twoje dane zostaną trwale usunięte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {globalError && (
            <div
              className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
              aria-live="polite"
            >
              {globalError}
            </div>
          )}

          <div className="rounded-md bg-destructive/10 p-4 space-y-2">
            <p className="text-sm font-medium text-destructive">Ostrzeżenie:</p>
            <ul className="list-disc list-inside text-sm text-destructive/90 space-y-1">
              <li>Wszystkie Twoje nastawy zostaną usunięte</li>
              <li>Wszystkie notatki i oceny zostaną usunięte</li>
              <li>Nie będziesz mógł odzyskać tych danych</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-password">Potwierdź hasło</Label>
            <Input
              id="delete-password"
              type="password"
              placeholder="Wprowadź swoje hasło"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              required
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-confirmation">
              Wpisz <strong>USUŃ KONTO</strong> aby potwierdzić
            </Label>
            <Input
              id="delete-confirmation"
              type="text"
              placeholder="USUŃ KONTO"
              value={formData.confirmation}
              onChange={(e) => setFormData({ ...formData, confirmation: e.target.value })}
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmation}
              aria-describedby={errors.confirmation ? "confirmation-error" : undefined}
              required
            />
            {errors.confirmation && (
              <p id="confirmation-error" className="text-sm text-destructive" role="alert">
                {errors.confirmation}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Usuwanie...
                </>
              ) : (
                "Usuń konto"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

