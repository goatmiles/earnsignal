"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDate } from "@/lib/utils";
import { getOpportunityBySlug } from "@/lib/data/opportunities";
import type { TestPlanState } from "@/lib/storage/local-storage";

interface AllPlansSectionProps {
  /** Already sorted, most recently updated first. */
  plans: TestPlanState[];
  onReset: (slug: string) => void;
}

export function AllPlansSection({ plans, onReset }: AllPlansSectionProps) {
  const [confirmingSlug, setConfirmingSlug] = useState<string | null>(null);

  if (plans.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold tracking-tight">Your test plans</h2>
      <div className="flex flex-col gap-3">
        {plans.map((plan) => {
          const opportunity = getOpportunityBySlug(plan.slug);
          if (!opportunity) return null;

          const days = opportunity.testPlan.days;
          const completedCount = days.filter(
            (d) => plan.days[d.day]?.completed,
          ).length;
          const percent = Math.round((completedCount / days.length) * 100);
          const isConfirming = confirmingSlug === plan.slug;

          return (
            <Card key={plan.slug} className="gap-3 p-6">
              <CardHeader className="flex-row items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <CardTitle className="text-base">{opportunity.title}</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    Last updated {formatDate(plan.lastUpdatedDate)}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-sm text-accent">
                  {percent}%
                </span>
              </CardHeader>

              <CardContent className="gap-2">
                <ProgressBar
                  percent={percent}
                  label={`${opportunity.title} progress`}
                />
                <span className="text-xs text-muted-foreground">
                  {completedCount} of {days.length} completed
                </span>
              </CardContent>

              <CardFooter className="flex-wrap justify-end gap-2">
                {isConfirming ? (
                  <>
                    <span className="mr-auto text-sm text-danger">
                      Reset all progress and notes for this plan?
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        onReset(plan.slug);
                        setConfirmingSlug(null);
                      }}
                    >
                      Yes, reset
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmingSlug(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/test-plan?slug=${plan.slug}`}>
                        Continue plan
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/progress?slug=${plan.slug}`}>
                        View progress
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmingSlug(plan.slug)}
                    >
                      <RotateCcw />
                      Reset
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
