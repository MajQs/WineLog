/**
 * Batch Card Component
 * Displays individual batch summary on dashboard
 */

import { Calendar, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { BatchCardVM } from "@/lib/hooks/useDashboardData";

interface BatchCardProps {
  batch: BatchCardVM;
}

/**
 * Truncate text to specified length with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

/**
 * Format batch type for display
 */
function formatBatchType(type: string): string {
  const typeMap: Record<string, string> = {
    red: "Czerwone",
    white: "Białe",
    rose: "Różowe",
    sparkling: "Musujące",
    dessert: "Deserowe",
  };
  return typeMap[type] || type;
}

/**
 * Format stage name for display
 */
function formatStageName(stageName: string): string {
  const stageMap: Record<string, string> = {
    preparation: "Przygotowanie",
    fermentation: "Fermentacja",
    pressing: "Tłoczenie",
    racking: "Dekantacja",
    aging: "Dojrzewanie",
    clarification: "Klarowanie",
    bottling: "Butelkowanie",
  };
  return stageMap[stageName] || stageName;
}

/**
 * Batch Card Component
 * Interactive card displaying batch information
 */
export function BatchCard({ batch }: BatchCardProps) {
  const handleClick = () => {
    window.location.href = `/batches/${batch.id}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = `/batches/${batch.id}`;
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
        aria-label={`Otwórz szczegóły nastawu ${batch.name}`}
      >
        <CardHeader>
          <CardTitle className="truncate">
            {truncateText(batch.name, 100)}
          </CardTitle>
          <CardDescription>
            {formatBatchType(batch.type)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Stage Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
              Etap {batch.currentStagePosition}
            </span>
            <span className="text-muted-foreground text-sm">
              {formatStageName(batch.currentStageName)}
            </span>
          </div>

          {/* Days Elapsed */}
          {batch.currentStageDaysElapsed !== undefined && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Clock className="size-4" aria-hidden="true" />
              <span>{batch.currentStageDaysElapsed} {batch.currentStageDaysElapsed === 1 ? "dzień" : "dni"} w etapie</span>
            </div>
          )}

          {/* Started Date */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="size-4" aria-hidden="true" />
            <span>Rozpoczęto {batch.startedAtHuman}</span>
          </div>

          {/* Latest Note */}
          {batch.latestNoteAction && (
            <div className="border-t pt-4">
              <div className="text-muted-foreground flex items-start gap-2 text-sm">
                <FileText className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{truncateText(batch.latestNoteAction, 60)}</p>
                  {batch.latestNoteDateHuman && (
                    <p className="text-muted-foreground/80 text-xs">{batch.latestNoteDateHuman}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </li>
  );
}

