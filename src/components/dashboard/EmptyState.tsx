/**
 * Empty State Component
 * Displayed when there are no active batches
 */

import { Wine } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Empty State Component
 * Shows message and CTA when no active batches exist
 */
export function EmptyState() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 text-center">
        <div className="text-muted-foreground flex items-center justify-center rounded-full bg-accent p-4">
          <Wine className="size-12" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Brak aktywnych nastawów</h2>
          <p className="text-muted-foreground">Rozpocznij swoją przygodę z winem, tworząc pierwszy nastaw.</p>
        </div>

        <Button asChild variant="default" size="lg" aria-label="Utwórz nowy nastaw">
          <a href="/batches/new">Nowy nastaw</a>
        </Button>
      </div>
    </div>
  );
}
