/**
 * StageCardCurrent component
 * Displays detailed information about the current batch stage
 */

import { Clock, FileText, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { CurrentStageDetailsDto } from "@/types";

interface StageCardCurrentProps {
  stage: CurrentStageDetailsDto;
}

/**
 * Calculate progress percentage based on elapsed days
 */
function calculateProgress(
  daysElapsed?: number,
  daysMin?: number | null,
  daysMax?: number | null
): number {
  if (!daysElapsed || !daysMax) return 0;
  
  const progress = (daysElapsed / daysMax) * 100;
  return Math.min(progress, 100);
}

/**
 * Get progress color based on elapsed time
 */
function getProgressColor(
  daysElapsed?: number,
  daysMin?: number | null,
  daysMax?: number | null
): string {
  if (!daysElapsed || !daysMin || !daysMax) return "bg-blue-500";
  
  if (daysElapsed < daysMin) return "bg-blue-500"; // Under minimum - normal
  if (daysElapsed <= daysMax) return "bg-green-500"; // In range - good
  return "bg-orange-500"; // Over maximum - warning
}

export function StageCardCurrent({ stage }: StageCardCurrentProps) {
  const progress = calculateProgress(stage.days_elapsed, stage.days_min, stage.days_max);
  const progressColor = getProgressColor(stage.days_elapsed, stage.days_min, stage.days_max);

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-blue-600">
          {stage.description || `Etap ${stage.position}`}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Time Progress */}
        {(stage.days_min || stage.days_max) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">Czas trwania</span>
              </div>
              <span className="text-gray-600">
                {stage.days_elapsed || 0} / {stage.days_max || stage.days_min} dni
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              aria-label={`Postęp etapu: ${progress.toFixed(0)}%`}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Min: {stage.days_min || 0} dni</span>
              {stage.days_max && <span>Max: {stage.days_max} dni</span>}
            </div>
          </div>
        )}

        {/* Materials List */}
        {stage.materials && stage.materials.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Package className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium text-sm">Materiały</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-6">
              {stage.materials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions Accordion */}
        {stage.instructions && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="instructions" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span className="font-medium text-sm">Instrukcje</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-gray-600 whitespace-pre-wrap pl-6 pt-2">
                  {stage.instructions}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

