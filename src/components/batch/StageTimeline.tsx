/**
 * StageTimeline component
 * Vertical timeline of all batch stages with visual progress indicators
 */

import { CheckCircle, Circle, Clock } from "lucide-react";
import type { BatchStageDto } from "@/types";
import { cn } from "@/lib/utils";

interface StageTimelineProps {
  stages: BatchStageDto[];
  currentStageId?: string;
  isArchived?: boolean;
}

/**
 * Single stage item in the timeline
 */
function StageItem({ 
  stage, 
  isCurrent, 
  isLast,
  isArchived
}: { 
  stage: BatchStageDto; 
  isCurrent: boolean; 
  isLast: boolean;
  isArchived?: boolean;
}) {
  // For archived batches, all stages should be marked as completed
  const isCompleted = isArchived || stage.status === "completed" || !!stage.completed_at;
  const isPending = !isArchived && (stage.status === "pending" || (!stage.started_at && !isCompleted));

  // Determine icon and color
  const Icon = isCompleted ? CheckCircle : isCurrent ? Clock : Circle;
  const iconColor = isCompleted 
    ? "text-green-600 bg-green-100" 
    : isCurrent 
    ? "text-blue-600 bg-blue-100" 
    : "text-gray-400 bg-gray-100";

  const lineColor = isCompleted 
    ? "bg-green-600" 
    : isCurrent 
    ? "bg-blue-600" 
    : "bg-gray-300";

  return (
    <div className="relative flex gap-4 pb-8 group">
      {/* Vertical line */}
      {!isLast && (
        <div 
          className={cn(
            "absolute left-[15px] top-8 w-0.5 h-full -ml-px transition-colors",
            lineColor
          )}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      <div 
        className={cn(
          "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
          iconColor,
          isCurrent && "ring-4 ring-blue-100",
          "border-white"
        )}
        aria-current={isCurrent ? "step" : undefined}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-500">
            Etap {stage.position}
          </span>
          {isCurrent && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              Aktualny
            </span>
          )}
        </div>
        
        {stage.description && (
          <p 
            className={cn(
              "font-semibold text-sm mb-2 transition-colors",
              isCurrent ? "text-blue-900" : isCompleted ? "text-gray-900" : "text-gray-500"
            )}
          >
            {stage.description}
          </p>
        )}

        {/* Stage dates */}
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          {stage.started_at && (
            <span>
              Rozpoczęto: {new Date(stage.started_at).toLocaleDateString("pl-PL")}
            </span>
          )}
          {stage.completed_at && (
            <span>
              Ukończono: {new Date(stage.completed_at).toLocaleDateString("pl-PL")}
            </span>
          )}
          {isCurrent && stage.days_elapsed !== undefined && (
            <span className="font-medium text-blue-600">
              Trwa od {stage.days_elapsed} {stage.days_elapsed === 1 ? "dnia" : "dni"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function StageTimeline({ stages, currentStageId, isArchived }: StageTimelineProps) {
  if (!stages || stages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Brak etapów do wyświetlenia</p>
      </div>
    );
  }

  // Sort stages by position
  const sortedStages = [...stages].sort((a, b) => a.position - b.position);

  return (
    <div 
      className="space-y-0"
      role="list"
      aria-label="Oś czasu etapów produkcji"
    >
      {sortedStages.map((stage, index) => (
        <div key={stage.id} role="listitem">
          <StageItem
            stage={stage}
            isCurrent={currentStageId ? stage.id === currentStageId : false}
            isLast={index === sortedStages.length - 1}
            isArchived={isArchived}
          />
        </div>
      ))}
    </div>
  );
}

