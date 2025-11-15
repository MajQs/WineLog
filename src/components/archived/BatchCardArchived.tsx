/**
 * Batch Card Archived Component
 * Displays individual archived batch summary
 */

import { Calendar, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArchivedBatchCardVM } from "@/types/viewModels";

interface BatchCardArchivedProps {
  batch: ArchivedBatchCardVM;
}

/**
 * Truncate text to specified length with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

/**
 * Star Rating Component (Read-only)
 * Displays rating as filled/empty stars
 */
function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) {
    return <span className="text-muted-foreground text-xs italic">Brak oceny</span>;
  }

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Ocena: ${rating} z 5 gwiazdek`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/**
 * Batch Type Badge Component
 * Displays batch type with appropriate styling
 */
function TypeBadge({ type }: { type: string }) {
  return (
    <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
      {type === "wine" ? "Wino" : "Miód pitny"}
    </span>
  );
}

/**
 * Batch Card Archived Component
 * Interactive card displaying archived batch information
 */
export function BatchCardArchived({ batch }: BatchCardArchivedProps) {
  const handleClick = () => {
    window.location.href = `/archived/${batch.id}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = `/archived/${batch.id}`;
    }
  };

  return (
    <li>
      <Card
        className="cursor-pointer transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-ring"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Otwórz szczegóły zakończonego nastawu ${batch.name}`}
        data-testid={`archived-batch-card-${batch.id}`}
      >
        <CardHeader>
          <CardTitle className="truncate">{truncateText(batch.name, 100)}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Type Badge */}
          <TypeBadge type={batch.type} />

          {/* Rating */}
          <div className="flex items-center gap-2" data-testid={`archived-batch-rating-${batch.id}`}>
            <StarRating rating={batch.rating} />
          </div>

          {/* Dates */}
          <div className="space-y-2 border-t pt-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="size-4 shrink-0" aria-hidden="true" />
              <span>Rozpoczęto: {batch.startedAtHuman}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="size-4 shrink-0" aria-hidden="true" />
              <span>Zakończono: {batch.completedAtHuman}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
