/**
 * StarRating component
 * Interactive 1-5 star rating control for archived batches
 */

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  initialRating?: number | null;
  batchId: string;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}

export function StarRating({ 
  initialRating, 
  batchId, 
  onChange,
  disabled = false 
}: StarRatingProps) {
  const [rating, setRating] = useState<number>(initialRating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleClick = (value: number) => {
    if (disabled) return;
    
    setRating(value);
    onChange?.(value);
  };

  const handleMouseEnter = (value: number) => {
    if (!disabled) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Ocena:</span>
      
      <div 
        className="flex gap-1"
        onMouseLeave={handleMouseLeave}
        role="radiogroup"
        aria-label="Ocena nastawu"
      >
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const isActive = starValue <= (hoverRating || rating);
          
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              disabled={disabled}
              className={cn(
                "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
              )}
              aria-label={`Oceń ${starValue} ${starValue === 1 ? "gwiazdką" : "gwiazdkami"}`}
              aria-checked={starValue === rating}
              role="radio"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  isActive 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "fill-none text-gray-300"
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {rating > 0 && (
        <span className="text-sm text-gray-600">
          {rating}/5
        </span>
      )}
    </div>
  );
}

