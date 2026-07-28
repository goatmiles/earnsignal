import * as React from "react";

import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/**
 * A toggleable pill button. The source design left these as completely
 * unstyled native `<button>` elements (personalisation options, Discover's
 * filter pills) — this gives them real, consistent styling and a visible
 * selected state instead.
 */
function Chip({ selected = false, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-accent bg-accent/15 text-accent"
          : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Chip };
