"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  RotateCcw,
  Target,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Topbar } from "@/components/layout/Topbar";
import { EmptyState } from "@/components/EmptyState";
import { PrototypeDisclaimer } from "@/components/PrototypeDisclaimer";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Opportunity } from "@/lib/data/opportunities";
import { useTestPlan } from "@/lib/hooks/useTestPlan";
import { useResolvedPlanOpportunity } from "@/lib/hooks/useResolvedPlanOpportunity";
import { TestPlanDayCard } from "./TestPlanDayCard";

interface TestPlanViewProps {
  slugParam?: string;
  dayParam?: number;
}

export function TestPlanView({ slugParam, dayParam }: TestPlanViewProps) {
  const resolution = useResolvedPlanOpportunity(slugParam);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <Topbar />
        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-8">
          {resolution.status === "loading" && null}

          {resolution.status === "invalid-slug" && (
            <EmptyState
              icon={Compass}
              title="We couldn't find that opportunity"
              description="This link may be out of date. Head back to Discover to find a real opportunity to test."
              action={{ label: "Go to Discover", href: "/discover" }}
            />
          )}

          {resolution.status === "no-plans" && (
            <EmptyState
              icon={Target}
              title="You haven't started a test plan yet"
              description="Open any opportunity and tap “Build my test plan” to start your first 7-day plan."
              action={{ label: "Go to Discover", href: "/discover" }}
            />
          )}

          {resolution.status === "ready" && (
            <ReadyTestPlan opportunity={resolution.opportunity} dayParam={dayParam} />
          )}
        </main>
      </div>
    </div>
  );
}

function ReadyTestPlan({
  opportunity,
  dayParam,
}: {
  opportunity: Opportunity;
  dayParam?: number;
}) {
  const { plan, toggleDay, setNotes, setReflection, reset } = useTestPlan(
    opportunity.slug,
  );
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [highlightedDay, setHighlightedDay] = useState<number | null>(null);
  const dayRefs = useRef<Partial<Record<number, HTMLDivElement | null>>>({});

  // Deep-linked from Progress's timeline ("Open in Test Plan" on a specific
  // day) — scroll straight to that day and briefly highlight it so it's
  // obvious which one was meant, rather than just landing at the top of a
  // 7-card list.
  useEffect(() => {
    if (!dayParam) return;
    const el = dayRefs.current[dayParam];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedDay(dayParam);
    const timer = setTimeout(() => setHighlightedDay(null), 2500);
    return () => clearTimeout(timer);
  }, [dayParam]);

  const days = opportunity.testPlan.days;
  const completedCount = days.filter(
    (d) => plan.days[d.day]?.completed,
  ).length;
  const percent = Math.round((completedCount / days.length) * 100);

  function handleReset() {
    reset();
    setConfirmingReset(false);
  }

  return (
    <>
      <Link
        href={`/opportunity/${opportunity.slug}`}
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to opportunity
      </Link>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {opportunity.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
            7-day test plan
          </span>
          <PrototypeDisclaimer variant="badge" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricBlock
          label="Estimated total test hours"
          value={`${opportunity.estimatedTestHours} hours`}
        />
        <MetricBlock
          label="Startup-cost estimate"
          value={opportunity.testPlan.estimatedSpend}
        />
        <MetricBlock label="Progress" value={`${percent}%`} />
        <MetricBlock
          label="Completed"
          value={`${completedCount} of ${days.length} completed`}
        />
      </div>

      <ProgressBar percent={percent} label="Test plan progress" />

      <PrototypeDisclaimer variant="callout" tone="muted" title="Success threshold">
        {opportunity.testPlan.successThreshold}
      </PrototypeDisclaimer>

      <div className="flex flex-col gap-4">
        {days.map((day) => (
          <div
            key={day.day}
            ref={(el) => {
              dayRefs.current[day.day] = el;
            }}
            className={cn(
              "rounded-2xl transition-shadow",
              highlightedDay === day.day && "ring-2 ring-accent",
            )}
          >
            <TestPlanDayCard
              day={day}
              progress={
                plan.days[day.day] ?? {
                  completed: false,
                  notes: "",
                  reflection: "",
                }
              }
              onToggle={() => toggleDay(day.day)}
              onNotesChange={(notes) => setNotes(day.day, notes)}
              onReflectionChange={(reflection) =>
                setReflection(day.day, reflection)
              }
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        {confirmingReset ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-danger">
              Reset all progress and notes for this plan?
            </span>
            <Button variant="destructive" size="sm" onClick={handleReset}>
              Yes, reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmingReset(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmingReset(true)}
          >
            <RotateCcw />
            Reset this plan
          </Button>
        )}

        <Button asChild variant="secondary" size="sm">
          <Link href={`/progress?slug=${opportunity.slug}`}>
            <TrendingUp />
            View Progress
          </Link>
        </Button>
      </div>
    </>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-medium">{value}</span>
    </div>
  );
}
