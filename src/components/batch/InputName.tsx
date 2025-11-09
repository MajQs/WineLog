/**
 * Input Name Component
 * Text input for batch name with character limit and validation
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputNameProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxLength?: number;
}

/**
 * Input Name Component
 * Optional input for batch name with character counter
 */
export function InputName({ 
  value, 
  onChange, 
  error, 
  maxLength = 100 
}: InputNameProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8; // 80% of max
  const hasError = !!error;

  return (
    <div className="space-y-2">
      <Label htmlFor="batch-name">
        Nazwa nastawu
        <span className="text-muted-foreground ml-1 text-xs font-normal">(opcjonalna)</span>
      </Label>
      
      <Input
        id="batch-name"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="np. Chardonnay 2024"
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={hasError ? "name-error" : "name-hint"}
      />
      
      <div className="flex items-center justify-between gap-2">
        {/* Hint or Error message */}
        <div className="min-w-0 flex-1">
          {hasError ? (
            <p id="name-error" className="text-destructive text-xs">
              {error}
            </p>
          ) : (
            <p id="name-hint" className="text-muted-foreground text-xs">
              Zostaw puste, aby użyć nazwy szablonu
            </p>
          )}
        </div>
        
        {/* Character counter */}
        <p 
          className={cn(
            "text-muted-foreground shrink-0 text-xs tabular-nums",
            isNearLimit && "text-warning",
            hasError && "text-destructive"
          )}
          aria-live="polite"
          aria-label={`Liczba znaków: ${characterCount} z ${maxLength}`}
        >
          {characterCount}/{maxLength}
        </p>
      </div>
    </div>
  );
}

