"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Check, ShieldAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PrototypeDisclaimer } from "@/components/PrototypeDisclaimer";
import type { Opportunity } from "@/lib/data/opportunities";

const TABS = ["Overview", "Why now", "Evidence", "How to start", "Risks"] as const;
type TabId = (typeof TABS)[number];

interface DetailTabsProps {
  opportunity: Opportunity;
}

export function DetailTabs({ opportunity }: DetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("Overview");
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  const baseId = useId();

  function focusTab(tab: TabId) {
    setActiveTab(tab);
    tabRefs.current[tab]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      focusTab(TABS[nextIndex]);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Opportunity details"
        className="flex gap-6 overflow-x-auto border-b border-border"
      >
        {TABS.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[tab] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab}`}
            aria-selected={activeTab === tab}
            aria-controls={`${baseId}-panel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "shrink-0 border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent",
              activeTab === tab
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${activeTab}`}
        aria-labelledby={`${baseId}-tab-${activeTab}`}
        tabIndex={0}
        className="outline-none"
      >
        {activeTab === "Overview" && <OverviewPanel opportunity={opportunity} />}
        {activeTab === "Why now" && <WhyNowPanel opportunity={opportunity} />}
        {activeTab === "Evidence" && <EvidencePanel opportunity={opportunity} />}
        {activeTab === "How to start" && (
          <HowToStartPanel opportunity={opportunity} />
        )}
        {activeTab === "Risks" && <RisksPanel opportunity={opportunity} />}
      </div>
    </div>
  );
}

function OverviewPanel({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-3 p-6">
        <CardHeader>
          <CardTitle className="text-lg">What people are doing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {opportunity.overview.whatPeopleAreDoing}
          </p>
        </CardContent>
      </Card>

      <Card className="gap-3 p-6">
        <CardHeader>
          <CardTitle className="text-lg">Why clients pay</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          <ul className="flex flex-col gap-2">
            {opportunity.overview.whyClientsPay.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-sm">
                <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-muted-foreground">{reason}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="gap-3 p-6">
        <CardHeader>
          <CardTitle className="text-lg">Example pricing</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <Row label="Setup fee" value={opportunity.overview.pricing.setupFee} />
          <Row
            label="Monthly support"
            value={opportunity.overview.pricing.monthlySupport}
          />
          <p className="text-xs text-muted-foreground">
            {opportunity.overview.pricing.note}
          </p>
          <PrototypeDisclaimer variant="callout" tone="warning">
            Illustrative pricing, not guaranteed earnings.
          </PrototypeDisclaimer>
        </CardContent>
      </Card>

      <PrototypeDisclaimer variant="callout" tone="danger" title="Reality Check">
        {opportunity.overview.realityCheck}
      </PrototypeDisclaimer>
    </div>
  );
}

function WhyNowPanel({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card className="gap-3 p-6">
      <CardHeader>
        <CardTitle className="text-lg">Why now</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{opportunity.whyNow}</p>
      </CardContent>
    </Card>
  );
}

function EvidencePanel({ opportunity }: { opportunity: Opportunity }) {
  const total = opportunity.evidence.scoreBreakdown.reduce(
    (sum, row) => sum + row.points,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-4 p-6">
        <CardHeader>
          <CardTitle className="text-lg">Score breakdown</CardTitle>
        </CardHeader>
        <CardContent className="gap-0 divide-y divide-border">
          {opportunity.evidence.scoreBreakdown.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-mono">{row.points} points</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-3 text-sm font-semibold">
            <span>Total</span>
            <span className="font-mono">{total} points</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold">Sources behind this score</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {opportunity.evidence.sources.map((source) => (
            <Card key={source.title} className="gap-3 p-6">
              <CardHeader className="gap-2">
                <PrototypeDisclaimer variant="badge" className="w-fit" />
                <CardTitle className="text-base">{source.title}</CardTitle>
              </CardHeader>
              <CardContent className="gap-2 text-sm">
                <Row label="Source type" value={source.sourceType} />
                <Row label="Published" value={source.published} mono />
                <p className="text-muted-foreground">{source.description}</p>
                <Badge
                  variant={
                    source.confidence === "high"
                      ? "accent"
                      : source.confidence === "medium"
                        ? "warning"
                        : "danger"
                  }
                  className="w-fit"
                >
                  {source.confidence === "high"
                    ? "High confidence"
                    : source.confidence === "medium"
                      ? "Medium confidence"
                      : "Low confidence"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="gap-3 p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Check className="size-5 text-accent" />
              Supported
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            {opportunity.evidence.supported.map((point) => (
              <div key={point} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                <span className="text-muted-foreground">{point}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-3 p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <X className="size-5 text-danger" />
              Not proven
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            {opportunity.evidence.notProven.map((point) => (
              <div key={point} className="flex items-start gap-2 text-sm">
                <X className="mt-0.5 size-4 shrink-0 text-danger" />
                <span className="text-muted-foreground">{point}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HowToStartPanel({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card className="gap-3 p-6">
      <CardHeader>
        <CardTitle className="text-lg">How to start</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{opportunity.howToStart}</p>
      </CardContent>
    </Card>
  );
}

function RisksPanel({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card className="gap-3 p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlert className="size-5 text-danger" />
          Risks and limitations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{opportunity.risksDetail}</p>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono" : "font-medium"}>{value}</span>
    </div>
  );
}
