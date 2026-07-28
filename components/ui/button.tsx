import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // The one primary action colour in the app — lime, used sparingly.
        default: "bg-accent text-accent-foreground hover:bg-accent/90",
        // Secondary actions that still need visual weight (e.g. "View signal").
        secondary:
          "bg-card text-foreground border border-border hover:bg-card/70",
        // Bordered, transparent actions (e.g. "Compare", "Bookmark").
        outline:
          "border border-border bg-transparent text-foreground hover:bg-card",
        // Sidebar nav items and other low-emphasis actions.
        ghost: "bg-transparent text-muted-foreground hover:bg-card hover:text-foreground",
        // Destructive-leaning actions ("Remove from comparison", "Stop experiment") —
        // every instance in the source design is an outline treatment, not a solid fill.
        destructive:
          "border border-danger/40 bg-transparent text-danger hover:bg-danger/10",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-5 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
