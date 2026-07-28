import * as React from "react";

import { cn } from "@/lib/utils";

// The source design never actually loads a profile photo — every instance
// is initials-only — so this skips @radix-ui/react-avatar's image-loading
// state machine entirely and stays a couple of plain, styled elements.

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-sm font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback };
