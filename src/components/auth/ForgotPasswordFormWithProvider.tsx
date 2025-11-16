/**
 * ForgotPasswordFormWithProvider
 * Wraps ForgotPasswordForm with AuthProvider context
 * Note: This form doesn't actually use auth context, but wrapped for consistency
 */

import { ForgotPasswordForm } from "./ForgotPasswordForm";

export function ForgotPasswordFormWithProvider() {
  // This form doesn't use useAuth, so no provider needed
  // But we keep the wrapper for API consistency
  return <ForgotPasswordForm />;
}
