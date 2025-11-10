/**
 * ResetPasswordForm Component
 * Allows user to set a new password using a reset token
 */

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/auth-validation";
import type { ZodError } from "zod";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    // Validate form data
    const result = resetPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};
      (result.error as ZodError).errors.forEach((err) => {
        const field = err.path[0] as keyof ResetPasswordFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement Supabase password update
      // const { error } = await supabase.auth.updateUser({
      //   password: result.data.password,
      // });

      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Password reset with token:", token);

      setIsSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setGlobalError("Wystąpił błąd podczas resetowania hasła. Link może być nieprawidłowy lub wygasł.");
      console.error("Reset password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <CardTitle className="text-2xl font-bold">Hasło zostało zmienione</CardTitle>
          </div>
          <CardDescription>
            Twoje hasło zostało pomyślnie zmienione
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-accent p-4 text-sm">
            <p className="text-muted-foreground">
              Za chwilę zostaniesz przekierowany do strony logowania...
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <a href="/login">Przejdź do logowania</a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Ustaw nowe hasło</CardTitle>
        <CardDescription>
          Wprowadź nowe hasło dla swojego konta
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
            <Label htmlFor="reset-password">Nowe hasło</Label>
            <Input
              id="reset-password"
              type="password"
              placeholder="••••••••"
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
            <p className="text-xs text-muted-foreground">
              Hasło musi zawierać min. 8 znaków, wielką i małą literę, cyfrę oraz znak specjalny
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reset-confirm-password">Potwierdź hasło</Label>
            <Input
              id="reset-confirm-password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
              required
            />
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-sm text-destructive" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetowanie...
              </>
            ) : (
              "Ustaw nowe hasło"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

