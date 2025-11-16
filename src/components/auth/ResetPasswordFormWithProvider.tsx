/**
 * ResetPasswordFormWithProvider
 * Wraps ResetPasswordForm with AuthProvider context
 * Note: This form doesn't actually use auth context, but wrapped for consistency
 */

import { ResetPasswordForm } from "./ResetPasswordForm";

interface ResetPasswordFormWithProviderProps {
  token: string;
}

export function ResetPasswordFormWithProvider({ token }: ResetPasswordFormWithProviderProps) {
  // This form doesn't use useAuth, so no provider needed
  // But we keep the wrapper for API consistency
  return <ResetPasswordForm token={token} />;
}
