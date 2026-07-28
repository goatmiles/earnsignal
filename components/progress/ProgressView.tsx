"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Compass,
  PartyPopper,
  RotateCcw,
  Target,
} from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Topbar } from "@/components/layout/Topbar";
import { EmptyState } from "@/components/EmptyState";
import { PrototypeDisclaimer } from "@/components/PrototypeDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn, formatDate } from "@/lib/utils";
import {
  getOpportunityBySlug,
  type Opportunity,
} from "@/lib/data/opportunities";
import {
  getAllTestPlans,
  getSavedOpportunitySlugs,
  resetTestPlan,
  type TestPlansBySlug,
} from "@/lib/storage/local-storage";
import { useResolvedPlanOpportunity } from "@/lib/hooks/useResolvedPlanOpportunity";
import { AllPlansSection } from "./AllPlansSection";
import { SavedWithoutPlanSection } from "./SavedWithoutPlanSection";

interface ProgressViewProps {
  slugParam?: string;
}

function truncate(text: string, max = 90): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max).trimEnd() + "…";
}

export function ProgressView({ slugParam }: ProgressViewProps) {
  const resolution = useResolvedPlanOpportunity(slugParam);

  // One shared source of truth for every plan, so a reset from anywhere on
  // this page (the main dashboard, or a card in "Your test plans") is
  // reflected everywhere else on the page immediately.
  const [allPlans, setAllPlans] = useState<TestPlansBySlug>({});
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  useEffect(() => {
    // Reading localStorage, which doesn't exist on the server, so this can
    // only happen after mount — a legitimate "sync with an external
    // system" effect, not the avoidable pattern this rule targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllPlans(getAllTestPlans());
    setSavedSlugs(getSavedOpportunitySlugs());
  }, []);

  function handleReset(slug: string) {
    resetTestPlan(slug);
    setAllPlans(getAllTestPlans());
  }

  const sortedPlans = Object.values(allPlans).sort(
    (a, b) =>
      new Date(b.lastUpdatedDate).getTime() -
      new Date(a.lastUpdatedDate).getTime(),
  );

  const savedWithoutPlan = savedSlugs
    .filter((slug) => !allPlans[slug])
    .map((slug) => getOpportunityBySlug(slug))
    .filter((o): o is Opportunity => Boolean(o));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <Topbar />
        <main className="flex flex-1 flex-col gap-8 p-4 sm:p-8">
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
              description="Open any opportunity and tap “Build my test plan” to start tracking progress here."
              action={{ label: "Go to Discover", href: "/discover" }}
            />
          )}

          {resolution.status === "ready" && (
            <MainDashboard
              opportunity={resolution.opportunity}
              plan={allPlans[resolution.opportunity.slug] ?? null}
              onReset={handleReset}
            />
          )}

          {(resolution.status === "ready" ||
            resolution.status === "no-plans") && (
            <>
              <AllPlansSection plans={sortedPlans} onReset={handleReset} />
              <SavedWithoutPlanSection opportunities={savedWithoutPlan} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function MainDashboard({
  opportunity,
  plan,
  onReset,
}: {
  opportunity: Opportunity;
  plan: TestPlansBySlug[string] | null;
  onReset: (slug: string) => void;
}) {
  const [confirmingReset, setConfirmingReset] = useState(false);
  const days = opportunity.testPlan.days;

  const completedCount = days.filter(
    (d) => plan?.days[d.day]?.completed,
  ).length;
  const percent = Math.round((completedCount / days.length) * 100);
  const notesCount = days.filter(
    (d) => (plan?.days[d.day]?.notes ?? "").trim() !== "",
  ).length;
  const reflectionsCount = days.filter(
    (d) => (plan?.days[d.day]?.reflection ?? "").trim() !== "",
  ).length;

  const hasAnyActivity =
    completedCount > 0 || notesCount > 0 || reflectionsCount > 0;
  const status =
    completedCount === days.length
      ? "Completed"
      : hasAnyActivity
        ? "In progress"
        : "Not started";

  const reflectionEntries = days
    .map((d) => ({ day: d.day, text: (plan?.days[d.day]?.reflection ?? "").trim() }))
    .filter((entry) => entry.text !== "");

  function handleConfirmReset() {
    onReset(opportunity.slug);
    setConfirmingReset(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/opportunity/${opportunity.slug}`}
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to opportunity
      </Link>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {opportunity.title}
          </h1>
          <Badge variant={opportunity.evidenceStrength.tone}>
            {opportunity.evidenceStrength.label}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold",
              status === "Completed"
                ? "border-accent/40 bg-accent/10 text-accent"
                : status === "In progress"
                  ? "border-info/40 bg-info/10 text-info"
                  : "border-border bg-card text-muted-foreground",
            )}
          >
            {status}
          </span>
          <PrototypeDisclaimer variant="badge" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricBlock label="Started" value={formatDate(plan?.startedDate ?? "")} />
        <MetricBlock
          label="Last activity"
          value={formatDate(plan?.lastUpdatedDate ?? "")}
        />
        <MetricBlock
          label="Completed"
          value={`${completedCount} of ${days.length} completed`}
        />
        <MetricBlock label="Progress" value={`${percent}%`} />
        <MetricBlock
          label="Estimated test hours"
          value={`${opportunity.estimatedTestHours} hours`}
        />
        <MetricBlock
          label="Startup-cost estimate"
          value={opportunity.testPlan.estimatedSpend}
        />
      </div>

      <ProgressBar percent={percent} label="Test plan progress" />

      <span className="text-sm text-muted-foreground">
        Notes logged on {notesCount} of {days.length} days · Reflections
        logged on {reflectionsCount} of {days.length} days
      </span>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold tracking-tight">Seven-day timeline</h2>
        {days.map((day) => {
          const progress = plan?.days[day.day];
          const completed = Boolean(progress?.completed);
          return (
            <div
              key={day.day}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-4",
                completed
                  ? "border-accent/40 bg-accent/5"
                  : "border-border bg-card",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  {completed ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  ) : (
                    <span className="mt-0.5 size-4 shrink-0 rounded-full border border-border" />
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Day {day.day} · {completed ? "Completed" : "Not yet completed"}
                    </span>
                    <span className="text-sm font-medium">{day.task}</span>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="shrink-0">
                  <Link href={`/test-plan?slug=${opportunity.slug}&day=${day.day}`}>
                    Open in Test Plan
                  </Link>
                </Button>
              </div>
              {progress?.notes && (
                <p className="pl-6 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Notes: </span>
                  {truncate(progress.notes)}
                </p>
              )}
              {progress?.reflection && (
                <p className="pl-6 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Reflection:{" "}
                  </span>
                  {truncate(progress.reflection)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {status === "Completed" && (
        <Card className="gap-4 border-accent/40 bg-accent/5 p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PartyPopper className="size-5 text-accent" />
              You completed this 7-day test plan
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <p className="text-sm text-muted-foreground">
              You completed {days.length} of {days.length} tasks, logged
              notes on {notesCount} day{notesCount === 1 ? "" : "s"}, and a
              reflection on {reflectionsCount} day
              {reflectionsCount === 1 ? "" : "s"}.
            </p>
            {reflectionEntries.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Your reflections
                </span>
                {reflectionEntries.map((entry) => (
                  <p key={entry.day} className="text-sm">
                    <span className="font-mono text-muted-foreground">
                      Day {entry.day}:
                    </span>{" "}
                    {entry.text}
                  </p>
                ))}
              </div>
            )}
            <PrototypeDisclaimer variant="callout" tone="muted">
              This summary only reflects what you entered — it isn&rsquo;t an
              assessment of whether this opportunity will work, and there is
              no guaranteed income here or anywhere else in EarnSignal.
            </PrototypeDisclaimer>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href={`/test-plan?slug=${opportunity.slug}`}>
                  Continue testing
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/opportunity/${opportunity.slug}`}>
                  Review the opportunity
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmingReset(true)}
              >
                <RotateCcw />
                Reset and retry
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/discover">Explore another signal</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        {confirmingReset ? (
          <>
            <span className="text-sm text-danger">
              Reset all progress and notes for this plan?
            </span>
            <Button variant="destructive" size="sm" onClick={handleConfirmReset}>
              Yes, reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmingReset(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          status !== "Completed" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmingReset(true)}
            >
              <RotateCcw />
              Reset this plan
            </Button>
          )
        )}
      </div>
    </div>
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
