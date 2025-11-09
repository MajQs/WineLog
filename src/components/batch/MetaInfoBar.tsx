/**
 * MetaInfoBar component
 * Displays batch metadata: start date, status, completion date, template
 */

import { Clock, CheckCircle, Archive, Activity } from "lucide-react";
import type { BatchVM } from "@/lib/hooks/useBatch";
import type { ArchivedBatchViewModel } from "@/types/viewModels";

interface MetaInfoBarProps {
  batch: BatchVM | ArchivedBatchViewModel;
}

/**
 * Get status icon and color
 */
function getStatusDisplay(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return {
        icon: <Activity className="h-4 w-4" aria-hidden="true" />,
        label: "Aktywny",
        className: "text-green-600 bg-green-50",
      };
    case "completed":
      return {
        icon: <CheckCircle className="h-4 w-4" aria-hidden="true" />,
        label: "Ukończony",
        className: "text-blue-600 bg-blue-50",
      };
    case "archived":
      return {
        icon: <Archive className="h-4 w-4" aria-hidden="true" />,
        label: "Zarchiwizowany",
        className: "text-gray-600 bg-gray-50",
      };
    default:
      return {
        icon: <Activity className="h-4 w-4" aria-hidden="true" />,
        label: status,
        className: "text-gray-600 bg-gray-50",
      };
  }
}

export function MetaInfoBar({ batch }: MetaInfoBarProps) {
  const statusDisplay = getStatusDisplay(batch.status);

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-4 border-b border-gray-200">
      {/* Start Date */}
      <div className="flex items-center gap-2 text-gray-700">
        <Clock className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm">
          <span className="hidden sm:inline">Rozpoczęto: </span>
          <span className="font-medium">{batch.startedAtHuman}</span>
        </span>
      </div>

      {/* Status Badge */}
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusDisplay.className}`}
      >
        {statusDisplay.icon}
        <span className="text-sm font-medium">{statusDisplay.label}</span>
      </div>

      {/* Completed Date (if applicable) */}
      {batch.completed_at && batch.completedAtHuman && (
        <div className="flex items-center gap-2 text-gray-700">
          <CheckCircle className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">
            <span className="hidden sm:inline">Ukończono: </span>
            <span className="font-medium">{batch.completedAtHuman}</span>
          </span>
        </div>
      )}

      {/* Template Name (if available) */}
      {batch.template && (
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm">
            <span className="hidden sm:inline">Szablon: </span>
            <span className="font-medium">{batch.template.name}</span>
          </span>
        </div>
      )}
    </div>
  );
}

