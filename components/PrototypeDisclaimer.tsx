import type { ReactNode } from "react";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Tone = "muted" | "warning" | "danger";

const calloutToneClasses: Record<Tone, string> = {
  muted: "border-border bg-card text-muted-foreground",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-l-danger border-danger/40 bg-danger/5 text-danger",
};

const calloutIcon: Record<Tone, typeof ShieldCheck> = {
  muted: ShieldCheck,
  warning: AlertTriangle,
  danger: ShieldAlert,
};

interface PrototypeDisclaimerProps {
  variant?: "inline" | "badge" | "callout";
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Every "this is sample data, not a real guarantee" moment in the source
 * design (the Welcome footer note, the "Illustrative prototype data"
 * source badges, the amber pricing warning, the red Reality Check box)
 * shares one job: make sure nobody mistakes this prototype's numbers for
 * real advice. This component covers all three visual treatments so the
 * wording and behaviour stay consistent everywhere it's used.
 */
export function PrototypeDisclaimer({
  variant = "inline",
  tone = "muted",
  title,
  children,
  className,
}: PrototypeDisclaimerProps) {
  if (variant === "badge") {
    return (
      <Badge variant="outline" className={className}>
        {children ?? "Illustrative prototype data"}
      </Badge>
    );
  }

  if (variant === "callout") {
    const Icon = calloutIcon[tone];
    return (
      <div
        className={cn(
          "flex gap-3 rounded-lg border border-l-4 p-4",
          calloutToneClasses[tone],
          className,
        )}
      >
        <Icon className="mt-0.5 size-5 shrink-0" />
        <div className="flex flex-col gap-1 text-sm">
          {title && <span className="font-bold">{title}</span>}
          <span className={tone === "muted" ? "text-foreground" : undefined}>
            {children ??
              "This is sample prototype data, not a real income guarantee."}
          </span>
        </div>
      </div>
    );
  }

  // inline
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <ShieldCheck className="size-4 shrink-0" />
      <span>
        {children ??
          "No income guarantees. Every signal includes evidence and risk."}
      </span>
    </div>
  );
}
