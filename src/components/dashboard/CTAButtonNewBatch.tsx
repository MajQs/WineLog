/**
 * CTA Button for creating new batch
 * Primary action button on dashboard
 */

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTAButtonNewBatchProps {
  className?: string;
}

/**
 * CTA Button Component
 * Navigates to batch creation page
 */
export function CTAButtonNewBatch({ className }: CTAButtonNewBatchProps) {
  return (
    <Button
      asChild
      variant="default"
      size="lg"
      className={className}
      aria-label="Utwórz nowy nastaw wina"
      data-testid="button-new-batch"
    >
      <a href="/batches/new">
        <Plus aria-hidden="true" />
        Nowy nastaw
      </a>
    </Button>
  );
}
