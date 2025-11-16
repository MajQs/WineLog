/**
 * Template Card Component
 * Selectable card displaying template information
 */

import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TemplateListItemDto } from "@/types";

interface TemplateCardProps {
  template: TemplateListItemDto;
  selected: boolean;
  onClick: () => void;
}

/**
 * Template Card Component
 * Interactive card with selection state
 */
export function TemplateCard({ template, selected, onClick }: TemplateCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-ring",
        selected && "border-primary ring-2 ring-primary"
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={`${selected ? "Odznacz" : "Wybierz"} szablon ${template.name}`}
      data-testid={`template-card-${template.id}`}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="bg-primary absolute right-3 top-3 flex size-6 items-center justify-center rounded-full">
          <Check className="size-4 text-white" aria-hidden="true" />
        </div>
      )}

      <CardHeader>
        <CardTitle className="pr-8 text-base">{template.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
