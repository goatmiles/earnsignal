import { forwardRef } from "react";
import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export interface ChipGroupProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(
  function ChipGroup({ label, error, children }, ref) {
    return (
      <div
        ref={ref}
        tabIndex={-1}
        aria-invalid={error ? true : undefined}
        className="flex flex-col gap-4 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </span>
          {error && (
            <span className="flex items-center gap-1 text-xs font-medium text-danger">
              <AlertCircle className="size-3.5" />
              {error}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    );
  },
);
