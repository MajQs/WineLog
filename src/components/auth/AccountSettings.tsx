/**
 * AccountSettings Component
 * Displays user account information and settings
 * Allows password reset and account deletion
 */

import { useState } from "react";
import { User, Mail, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DeleteAccountForm } from "./DeleteAccountForm";

// TODO: Get actual user data from Supabase context
interface AccountSettingsProps {
  user?: {
    email: string;
    created_at: string;
    email_confirmed_at?: string | null;
  };
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Mock data for development
  const userData = user || {
    email: "user@example.com",
    created_at: new Date().toISOString(),
    email_confirmed_at: null,
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Email verification banner */}
      {!userData.email_confirmed_at && (
        <div
          className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4"
          role="alert"
        >
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Adres e-mail nie został zweryfikowany
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Sprawdź swoją skrzynkę pocztową i kliknij link potwierdzający, aby aktywować wszystkie funkcje konta.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informacje o koncie
          </CardTitle>
          <CardDescription>Podstawowe informacje dotyczące Twojego konta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Adres e-mail</p>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Data rejestracji</p>
                <p className="text-sm text-muted-foreground">{formatDate(userData.created_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle>Hasło</CardTitle>
          <CardDescription>Zmień hasło do swojego konta</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <a href="/forgot-password">Zmień hasło</a>
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Strefa niebezpieczna</CardTitle>
          <CardDescription>Nieodwracalne operacje na koncie</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Usuń konto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0">
              <DeleteAccountForm
                onCancel={() => setIsDeleteDialogOpen(false)}
                onSuccess={() => {
                  // TODO: Implement actual account deletion with Supabase
                  console.log("Account deleted successfully");
                  // window.location.href = "/?deleted=true";
                }}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
