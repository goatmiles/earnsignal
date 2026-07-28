import { BarChart3, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CompareButtonProps {
  selected: boolean;
  onToggle: () => void;
}

/**
 * Capacity (max 3) is enforced by the caller — this button doesn't know
 * whether the list is full, it just reports clicks. When a click can't be
 * honoured because the list is already full, the parent shows the
 * limit-reached feedback instead of anything changing here.
 */
export function CompareButton({ selected, onToggle }: CompareButtonProps) {
  return (
    <Button
      type="button"
      variant={selected ? "secondary" : "outline"}
      size="sm"
      onClick={onToggle}
      aria-pressed={selected}
      className={selected ? "border border-accent/40 text-accent" : undefined}
    >
      {selected ? <Check /> : <BarChart3 />}
      {selected ? "Added to compare" : "Compare"}
    </Button>
  );
}
