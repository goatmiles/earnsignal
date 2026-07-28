"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Rocket } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Topbar } from "@/components/layout/Topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrototypeDisclaimer } from "@/components/PrototypeDisclaimer";
import { SaveButton } from "@/components/discover/SaveButton";
import { CompareButton } from "@/components/discover/CompareButton";
import { useSavedAndCompare } from "@/lib/hooks/useSavedAndCompare";
import type { Opportunity } from "@/lib/data/opportunities";
import { MetricCard } from "./MetricCard";
import { DetailTabs } from "./DetailTabs";

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
}

export function OpportunityDetailView({
  opportunity,
}: OpportunityDetailViewProps) {
  const {
    savedSlugs,
    compareSlugs,
    compareLimitMessage,
    toggleSave,
    toggleCompare,
  } = useSavedAndCompare();

  const saved = savedSlugs.includes(opportunity.slug);
  const compareSelected = compareSlugs.includes(opportunity.slug);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <Topbar />
        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-8">
          <Link
            href="/discover"
            className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Discover
          </Link>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {opportunity.title}
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              {opportunity.shortDescription}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">
                Signal score {opportunity.signalScore}/100
              </span>
              <Badge variant={opportunity.evidenceStrength.tone}>
                {opportunity.evidenceStrength.label}
              </Badge>
              <Badge variant="outline">{opportunity.category}</Badge>
              <Badge variant="outline">{opportunity.updatedLabel}</Badge>
              <Badge variant="outline">{opportunity.location}</Badge>
              <Badge variant="outline">{opportunity.deliveryMode}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="lg">
              <Link href={`/test-plan?slug=${opportunity.slug}`}>
                <Rocket />
                Build my test plan
              </Link>
            </Button>
            <SaveButton
              saved={saved}
              onToggle={() => toggleSave(opportunity.slug)}
            />
            <CompareButton
              selected={compareSelected}
              onToggle={() => toggleCompare(opportunity.slug)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Startup cost" value={opportunity.costToStart} />
            <MetricCard label="Difficulty" value={opportunity.difficulty} />
            <MetricCard
              label="Estimated time to first income"
              value={opportunity.firstIncomeWindow}
            />
            <MetricCard label="Skills required" value={opportunity.skillFit} />
          </div>

          <PrototypeDisclaimer variant="badge" />

          <h2 className="sr-only">Signal details</h2>
          <DetailTabs opportunity={opportunity} />
        </main>
      </div>

      {compareLimitMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning shadow-lg sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
        >
          <AlertTriangle className="size-4 shrink-0" />
          {compareLimitMessage}
        </div>
      )}
    </div>
  );
}
