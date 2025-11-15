/**
 * Batch List Archived Component
 * Container for archived batches list
 */

import { BatchCardArchived } from "./BatchCardArchived";
import type { ArchivedBatchCardVM } from "@/types/viewModels";

interface BatchListArchivedProps {
  batches: ArchivedBatchCardVM[];
}

/**
 * Batch List Archived Component
 * Renders list of archived batch cards
 */
export function BatchListArchived({ batches }: BatchListArchivedProps) {
  return (
    <section aria-label="Lista zakończonych nastawów">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {batches.map((batch) => (
          <BatchCardArchived key={batch.id} batch={batch} />
        ))}
      </ul>
    </section>
  );
}
