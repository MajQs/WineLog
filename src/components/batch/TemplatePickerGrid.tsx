/**
 * Template Picker Grid Component
 * Grid of selectable template cards
 */

import { TemplateCard } from "./TemplateCard";
import type { TemplateListItemDto } from "@/types";

interface TemplatePickerGridProps {
  templates: TemplateListItemDto[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

/**
 * Template Picker Grid Component
 * Displays templates in a responsive grid with single selection
 */
export function TemplatePickerGrid({ templates, selectedId, onSelect }: TemplatePickerGridProps) {
  return (
    <div>
      <div className="mb-3 block text-sm font-medium" id="template-picker-label">
        Wybierz szablon produkcji
        <span className="text-destructive ml-1" aria-label="wymagane">
          *
        </span>
      </div>

      <div
        className="grid gap-4 sm:grid-cols-2"
        role="radiogroup"
        aria-labelledby="template-picker-label"
        data-testid="template-picker-grid"
      >
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={template.id === selectedId}
            onClick={() => onSelect(template.id)}
          />
        ))}
      </div>
    </div>
  );
}
