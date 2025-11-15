/**
 * AuthProvider Component
 * Provides authentication context and utilities for the entire app
 * Manages user session, token storage, and authentication state
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generic keys that don't reveal the auth provider
const TOKEN_KEY = "auth.token";
const SESSION_KEY = "auth.session";

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/account", "/archived", "/batches"];

interface AuthProviderProps {
  children: ReactNode;
  initialSession?: Session | null;
}

interface AuthProviderInternalProps extends AuthProviderProps {
  enableRouteGuard?: boolean;
}

function AuthProviderInternal({ children, initialSession = null, enableRouteGuard = true }: AuthProviderInternalProps) {
  const [session, setSessionState] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [isLoading, setIsLoading] = useState(!initialSession);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      console.log("[AuthProvider] Loading session from localStorage...");
      try {
        const storedSession = localStorage.getItem(SESSION_KEY);
        console.log("[AuthProvider] Stored session:", !!storedSession);

        if (storedSession) {
          const parsedSession = JSON.parse(storedSession) as Session;

          // Check if token is expired
          const expiresAt = parsedSession.expires_at ?? 0;
          const now = Math.floor(Date.now() / 1000);

          console.log("[AuthProvider] Token expiry check:", {
            expiresAt,
            now,
            isExpired: expiresAt <= now,
          });

          if (expiresAt > now) {
            console.log("[AuthProvider] Session loaded successfully");
            setSessionState(parsedSession);
            setUser(parsedSession.user);
          } else {
            // Token expired, clear storage
            console.log("[AuthProvider] Token expired, clearing storage");
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(TOKEN_KEY);
          }
        } else {
          console.log("[AuthProvider] No session found in localStorage");
        }
      } catch (error) {
        console.error("[AuthProvider] Error loading session:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    if (!initialSession) {
      loadSession();
    } else {
      console.log("[AuthProvider] Using initial session");
      setIsInitialized(true);
    }
  }, [initialSession]);

  // Check protected routes and redirect if not authenticated
  useEffect(() => {
    // Skip route guard if disabled
    if (!enableRouteGuard) {
      return;
    }

    // Wait until we've checked localStorage
    if (typeof window === "undefined" || isLoading || !isInitialized) {
      return;
    }

    const currentPath = window.location.pathname;
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => currentPath.startsWith(route));

    // Debug logging
    console.log("[AuthProvider] Route check:", {
      currentPath,
      isProtectedRoute,
      hasSession: !!session,
      hasUser: !!user,
      isLoading,
      isInitialized,
      enableRouteGuard,
    });

    if (isProtectedRoute && !session && !user) {
      // User is not authenticated on a protected route
      console.log("[AuthProvider] Redirecting to login - no session found");
      window.location.href = "/login";
    }
  }, [session, user, isLoading, isInitialized, enableRouteGuard]);

  // Set session and store in localStorage
  const setSession = (newSession: Session | null) => {
    console.log("[AuthProvider] setSession called:", !!newSession);
    setSessionState(newSession);
    setUser(newSession?.user ?? null);

    if (newSession) {
      console.log("[AuthProvider] Saving session to localStorage with keys:", SESSION_KEY, TOKEN_KEY);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      localStorage.setItem(TOKEN_KEY, newSession.access_token);
    } else {
      console.log("[AuthProvider] Clearing session from localStorage");
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        // Call logout endpoint
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      // Clear local state regardless of API call result
      setSession(null);
      // Redirect to home page
      window.location.href = "/";
    }
  };

  // Refresh session (for token refresh)
  const refreshSession = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setSession(null);
        return;
      }

      // In a real implementation, you'd call a refresh endpoint
      // For now, we just verify the current token is still valid
      const storedSession = localStorage.getItem(SESSION_KEY);
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession) as Session;
        const expiresAt = parsedSession.expires_at ?? 0;
        const now = Math.floor(Date.now() / 1000);

        if (expiresAt <= now) {
          // Token expired
          setSession(null);
        }
      }
    } catch (error) {
      console.error("Refresh session error:", error);
      setSession(null);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    signOut,
    refreshSession,
    setSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

/**
 * Get auth token from localStorage
 * Useful for API calls outside of React components
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * AuthProvider with route protection (for auth forms)
 */
export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  return (
    <AuthProviderInternal initialSession={initialSession} enableRouteGuard={true}>
      {children}
    </AuthProviderInternal>
  );
}

/**
 * AuthProvider without route protection (for app content)
 * Use this in AppContent to avoid redirect loops
 */
export function AuthProviderWithoutGuard({ children, initialSession }: AuthProviderProps) {
  return (
    <AuthProviderInternal initialSession={initialSession} enableRouteGuard={false}>
      {children}
    </AuthProviderInternal>
  );
}
