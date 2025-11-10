/**
 * LoginForm Component
 * Handles user login with email and password
 */

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/lib/auth-validation";
import { useAuth } from "./AuthProvider";
import type { ZodError } from "zod";
import type { Session } from "@supabase/supabase-js";

interface LoginFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
}

export function LoginForm({ redirectTo = "/dashboard", onSuccess }: LoginFormProps) {
  const { setSession } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    // Validate form data
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      (result.error as ZodError).errors.forEach((err) => {
        const field = err.path[0] as keyof LoginFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Call login API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        setGlobalError(data.error || "Wystąpił błąd podczas logowania. Spróbuj ponownie.");
        return;
      }

      // Store session in AuthProvider (which saves to localStorage)
      setSession(data.session as Session);
      
      // Call success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        // Server-side redirect (full page reload)
        window.location.href = redirectTo;
      }
    } catch (error) {
      setGlobalError("Wystąpił błąd podczas logowania. Spróbuj ponownie.");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Zaloguj się</CardTitle>
        <CardDescription>
          Wprowadź swoje dane, aby uzyskać dostęp do konta
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
            <Label htmlFor="login-email">E-mail</Label>
            <Input
              id="login-email"
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Hasło</Label>
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                Zapomniałeś hasła?
              </a>
            </div>
            <Input
              id="login-password"
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
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logowanie...
              </>
            ) : (
              "Zaloguj się"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground text-center">
          Nie masz konta?{" "}
          <a
            href="/register"
            className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Zarejestruj się
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}

