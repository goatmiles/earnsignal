import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/Sparkline";
import type { Opportunity, SignalTone } from "@/lib/data/opportunities";
import { SaveButton } from "./SaveButton";
import { CompareButton } from "./CompareButton";

interface OpportunityCardProps {
  opportunity: Opportunity;
  saved: boolean;
  onToggleSave: () => void;
  compareSelected: boolean;
  onToggleCompare: () => void;
  /** Highlights this card as the current top match (lime border), matching
   * the source design's treatment of its single best-scoring card. */
  featured?: boolean;
}

const SPARKLINE_TONE_CLASS: Record<SignalTone, string> = {
  accent: "text-accent",
  info: "text-info",
  warning: "text-warning",
  danger: "text-danger",
};

export function OpportunityCard({
  opportunity,
  saved,
  onToggleSave,
  compareSelected,
  onToggleCompare,
  featured = false,
}: OpportunityCardProps) {
  // The one deliberately low-scoring, cautionary example gets the same
  // muted/faded treatment the source design gave it, regardless of sort
  // order — it's meant to always read as "proceed carefully".
  const isCautionary = opportunity.evidenceStrength.tone === "danger";

  return (
    <Card
      className={cn(
        "gap-4 p-6",
        featured && "border-2 border-accent",
        isCautionary && "border-danger/40 bg-card/60 opacity-80",
      )}
    >
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "font-mono text-2xl font-bold",
                isCautionary ? "text-danger" : "text-foreground",
              )}
            >
              {opportunity.signalScore}
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              /100
            </span>
            <Badge variant={opportunity.evidenceStrength.tone}>
              {opportunity.evidenceStrength.label}
            </Badge>
          </div>
          <CardTitle
            className={cn(
              "text-xl",
              isCautionary && "text-muted-foreground",
            )}
          >
            {opportunity.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {opportunity.shortDescription}
          </p>
        </div>
        <SaveButton saved={saved} onToggle={onToggleSave} />
      </CardHeader>

      <CardContent className="flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-6">
          <Metric label="Category" value={opportunity.category} />
          <Metric label="Cost to start" value={opportunity.costToStart} mono />
          <Metric label="Difficulty" value={opportunity.difficulty} />
          <Metric
            label="Estimated time to first income"
            value={opportunity.firstIncomeWindow}
            mono
          />
        </div>
        {opportunity.sparkline.length > 1 && (
          <Sparkline
            data={opportunity.sparkline}
            className={cn(
              "h-8 w-24 shrink-0",
              SPARKLINE_TONE_CLASS[opportunity.evidenceStrength.tone],
            )}
          />
        )}
      </CardContent>

      <CardFooter className="justify-end gap-2">
        <CompareButton selected={compareSelected} onToggle={onToggleCompare} />
        <Button asChild size="sm">
          <Link href={`/opportunity/${opportunity.slug}`}>
            View signal
            <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function Metric({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-sm", mono && "font-mono")}>{value}</span>
    </div>
  );
}
