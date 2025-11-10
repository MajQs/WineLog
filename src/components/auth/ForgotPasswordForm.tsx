/**
 * ForgotPasswordForm Component
 * Sends password reset email to user
 */

import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/auth-validation";
import type { ZodError } from "zod";

export function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    // Validate form data
    const result = forgotPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ForgotPasswordFormData, string>> = {};
      (result.error as ZodError).errors.forEach((err) => {
        const field = err.path[0] as keyof ForgotPasswordFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Call forgot password API endpoint
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        setGlobalError(data.error || "Wystąpił błąd podczas wysyłania e-maila. Spróbuj ponownie.");
        return;
      }

      // Always show success for security (don't reveal if email exists)
      setIsSuccess(true);
    } catch (error) {
      setGlobalError("Wystąpił błąd podczas wysyłania e-maila. Spróbuj ponownie.");
      console.error("Forgot password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sprawdź swoją skrzynkę</CardTitle>
          <CardDescription>
            Link do resetowania hasła został wysłany na adres <strong>{formData.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-accent p-4 text-sm">
            <p className="mb-2">Link jest ważny przez <strong>1 godzinę</strong>.</p>
            <p className="text-muted-foreground">
              Jeśli nie widzisz wiadomości, sprawdź folder spam.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <a href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do logowania
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Zapomniałeś hasła?</CardTitle>
        <CardDescription>
          Wprowadź swój adres e-mail, a wyślemy Ci link do resetowania hasła
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

          <div className="space-y-2">
            <Label htmlFor="forgot-email">E-mail</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="twoj@email.pl"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wysyłanie...
              </>
            ) : (
              "Wyślij link resetujący"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full">
          <a href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do logowania
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

