/**
 * LoginFormWithProvider
 * Wraps LoginForm with AuthProvider context
 */

import { AuthProvider } from "./AuthProvider";
import { LoginForm } from "./LoginForm";

interface LoginFormWithProviderProps {
  redirectTo?: string;
  onSuccess?: () => void;
}

export function LoginFormWithProvider(props: LoginFormWithProviderProps) {
  return (
    <AuthProvider>
      <LoginForm {...props} />
    </AuthProvider>
  );
}

