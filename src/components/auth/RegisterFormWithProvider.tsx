/**
 * RegisterFormWithProvider
 * Wraps RegisterForm with AuthProvider context
 */

import { AuthProvider } from "./AuthProvider";
import { RegisterForm } from "./RegisterForm";

interface RegisterFormWithProviderProps {
  onSuccess?: () => void;
}

export function RegisterFormWithProvider(props: RegisterFormWithProviderProps) {
  return (
    <AuthProvider>
      <RegisterForm {...props} />
    </AuthProvider>
  );
}
