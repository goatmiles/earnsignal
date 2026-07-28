import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Opportunity } from "@/lib/data/opportunities";

interface SavedWithoutPlanSectionProps {
  opportunities: Opportunity[];
}

export function SavedWithoutPlanSection({
  opportunities,
}: SavedWithoutPlanSectionProps) {
  if (opportunities.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold tracking-tight">
        Saved opportunities without a plan
      </h2>
      <div className="flex flex-col gap-3">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.slug}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <Link
                href={`/opportunity/${opportunity.slug}`}
                className="font-medium hover:text-accent"
              >
                {opportunity.title}
              </Link>
              <Badge variant={opportunity.evidenceStrength.tone} className="w-fit">
                {opportunity.evidenceStrength.label}
              </Badge>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href={`/test-plan?slug=${opportunity.slug}`}>
                Build test plan
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
