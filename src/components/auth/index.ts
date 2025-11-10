/**
 * Auth components barrel export
 */

export { LoginForm } from "./LoginForm";
export { RegisterForm } from "./RegisterForm";
export { ForgotPasswordForm } from "./ForgotPasswordForm";
export { ResetPasswordForm } from "./ResetPasswordForm";
export { DeleteAccountForm } from "./DeleteAccountForm";
export { AccountSettings } from "./AccountSettings";
export { AuthProvider, AuthProviderWithoutGuard, useAuth, getAuthToken } from "./AuthProvider";

// Forms with AuthProvider wrapper (for Astro pages)
export { LoginFormWithProvider } from "./LoginFormWithProvider";
export { RegisterFormWithProvider } from "./RegisterFormWithProvider";
export { ForgotPasswordFormWithProvider } from "./ForgotPasswordFormWithProvider";
export { ResetPasswordFormWithProvider } from "./ResetPasswordFormWithProvider";

