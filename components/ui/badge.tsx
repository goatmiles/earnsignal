import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        // Neutral chip, e.g. location / delivery-mode tags.
        default: "border-border bg-card text-muted-foreground",
        // "Strong evidence", high scores, positive states.
        accent: "border-accent/30 bg-accent/15 text-accent",
        // "Growing signal", informational states.
        info: "border-info/30 bg-info/15 text-info",
        // "Medium competition", caution states.
        warning: "border-warning/30 bg-warning/15 text-warning",
        // "Mostly hype", high-risk states.
        danger: "border-danger/30 bg-danger/15 text-danger",
        // Bare outline, no fill — matches tags like location pills.
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
