/**
 * Archive Section Component
 * Displays archived batches count with link
 */

import { Archive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SectionArchiveProps {
  count: number;
}

/**
 * Archive Section Component
 * Shows number of archived batches and navigation link
 */
export function SectionArchive({ count }: SectionArchiveProps) {
  return (
    <section aria-labelledby="archive-heading">
      <Card className="transition-colors hover:bg-accent/50">
        <a href="/archive" className="block" aria-label={`Zobacz archiwum (${count} ${count === 1 ? "nastaw" : "nastawy"})`}>
          <CardContent className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground flex items-center justify-center rounded-full bg-accent p-3">
                <Archive className="size-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="archive-heading" className="font-semibold">
                  Archiwum
                </h2>
                <p className="text-muted-foreground text-sm">
                  {count} {count === 1 ? "zakończony nastaw" : count < 5 && count > 1 ? "zakończone nastawy" : "zakończonych nastawów"}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground">
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </CardContent>
        </a>
      </Card>
    </section>
  );
}

