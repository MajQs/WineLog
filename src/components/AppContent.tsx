/**
 * AppContent Component
 * Wraps app content with AuthProvider and provides logout functionality
 */

import { AuthProviderWithoutGuard, useAuth } from "./auth";
import { Loader2 } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";

function AppHeader() {
  const { signOut, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut();
  };

  if (!user) {
    return null;
  }

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              WineLog
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/dashboard"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/archived"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Archiwum
            </a>
          </nav>

          {/* User Dropdown with Logout */}
          <div className="flex items-center gap-2">
            <div 
              className="hidden sm:block text-sm text-muted-foreground"
              data-testid="user-email"
            >
              {user.email}
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/account"
                className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Konto
              </a>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent transition-colors text-destructive disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Wylogowywanie...
                  </span>
                ) : (
                  "Wyloguj"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-4 mt-3 pt-3 border-t">
          <a
            href="/dashboard"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Dashboard
          </a>
          <a
            href="/archived"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Archiwum
          </a>
        </nav>
      </div>
    </header>
  );
}

interface AppContentProps {
  children: ReactNode;
}

function AppContentInner({ children }: AppContentProps) {
  const { user, session, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user && !session) {
      console.log("[AppContent] No session found, redirecting to login");
      window.location.href = "/login";
    }
  }, [user, session, isLoading]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!user || !session) {
    return null;
  }

  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
}

export function AppContent({ children }: AppContentProps) {
  return (
    <AuthProviderWithoutGuard>
      <AppContentInner>{children}</AppContentInner>
    </AuthProviderWithoutGuard>
  );
}

