/**
 * Active Batch List Component
 * Displays list of active batches on dashboard
 */

import { BatchCard } from "./BatchCard";
import { EmptyState } from "../dashboard/EmptyState";
import type { BatchCardVM } from "@/lib/hooks/useDashboardData";

interface BatchListActiveProps {
  batches: BatchCardVM[];
}

/**
 * Active Batch List Component
 * Renders list of batch cards or empty state
 */
export function BatchListActive({ batches }: BatchListActiveProps) {
  // Show empty state when no batches
  if (batches.length === 0) {
    return <EmptyState />;
  }

  return (
    <section aria-labelledby="active-batches-heading" className="mb-8">
      <h2 id="active-batches-heading" className="mb-4 text-lg font-semibold">
        Aktywne nastawy
      </h2>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {batches.map((batch) => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
      </ul>
    </section>
  );
}
