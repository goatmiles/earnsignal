"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, X } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Topbar } from "@/components/layout/Topbar";
import { EmptyState } from "@/components/EmptyState";
import { PrototypeDisclaimer } from "@/components/PrototypeDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSavedAndCompare } from "@/lib/hooks/useSavedAndCompare";
import { computeMatchScore } from "@/lib/scoring";
import {
  getOpportunityBySlug,
  type Opportunity,
} from "@/lib/data/opportunities";
import {
  getPersonalisationAnswers,
  type PersonalisationAnswers,
} from "@/lib/storage/local-storage";

interface CompareRow {
  label: string;
  render: (o: Opportunity) => ReactNode;
}

const ROWS: CompareRow[] = [
  {
    label: "Score",
    render: (o) => <span className="font-mono">{o.signalScore}/100</span>,
  },
  {
    label: "Evidence strength",
    render: (o) => (
      <Badge variant={o.evidenceStrength.tone}>{o.evidenceStrength.label}</Badge>
    ),
  },
  { label: "Startup cost", render: (o) => o.costToStart },
  { label: "Difficulty", render: (o) => o.difficulty },
  {
    label: "Estimated time to first income",
    render: (o) => o.firstIncomeWindow,
  },
  { label: "Skills required", render: (o) => o.skillFit },
  { label: "Test period", render: (o) => o.timeToTest },
  {
    label: "Risk level",
    render: (o) => (
      <span
        className={
          o.risk.tone === "danger"
            ? "text-danger"
            : o.risk.tone === "warning"
              ? "text-warning"
              : "text-info"
        }
      >
        {o.risk.label}
      </span>
    ),
  },
  { label: "First-customer approach", render: (o) => o.howToStart },
];

export function CompareView() {
  const { compareSlugs, toggleCompare, clearAllCompare } = useSavedAndCompare();
  const [personalisation, setPersonalisation] = useState<PersonalisationAnswers>(
    {},
  );

  useEffect(() => {
    // Restoring localStorage, which doesn't exist on the server, so this
    // can only happen after mount — a legitimate "sync with an external
    // system" effect, not the avoidable pattern this rule targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPersonalisation(getPersonalisationAnswers());
  }, []);

  const compared = compareSlugs
    .map((slug) => getOpportunityBySlug(slug))
    .filter((o): o is Opportunity => Boolean(o));

  const strongestFit = useMemo(() => {
    if (compared.length < 2) return null;
    return compared.reduce((best, o) =>
      computeMatchScore(o, personalisation) >
      computeMatchScore(best, personalisation)
        ? o
        : best,
    );
  }, [compared, personalisation]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <Topbar />
        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Compare opportunities
            </h1>
            <p className="text-sm text-muted-foreground">
              See which opportunity best matches your skills, budget and
              available time.
            </p>
          </div>

          <PrototypeDisclaimer variant="badge" />

          <h2 className="sr-only">Comparison</h2>

          {compared.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="Nothing to compare yet"
              description="Add up to 3 opportunities from Discover using their Compare button."
              action={{ label: "Go to Discover", href: "/discover" }}
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {compared.length} of 3 selected
                </span>
                <Button variant="ghost" size="sm" onClick={clearAllCompare}>
                  <X />
                  Clear comparison
                </Button>
              </div>

              {/* Desktop / tablet: grid layout, horizontally scrollable if
                  it doesn't fit so it never overflows the page itself. */}
              <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
                <div
                  className="grid min-w-[640px] gap-px bg-border"
                  style={{
                    gridTemplateColumns: `200px repeat(${compared.length}, minmax(200px, 1fr))`,
                  }}
                >
                  <div className="bg-card p-4" />
                  {compared.map((o) => (
                    <div key={o.slug} className="flex flex-col gap-2 bg-card p-4">
                      <span className="font-semibold">{o.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCompare(o.slug)}
                        className="w-fit text-danger hover:text-danger"
                      >
                        <X className="size-4" />
                        Remove
                      </Button>
                    </div>
                  ))}

                  {ROWS.map((row) => (
                    <Fragment key={row.label}>
                      <div className="bg-card p-4 text-sm text-muted-foreground">
                        {row.label}
                      </div>
                      {compared.map((o) => (
                        <div key={`${o.slug}-${row.label}`} className="min-w-0 bg-card p-4 text-sm break-words">
                          {row.render(o)}
                        </div>
                      ))}
                    </Fragment>
                  ))}

                  <div className="bg-card p-4" />
                  {compared.map((o) => (
                    <div key={`${o.slug}-link`} className="bg-card p-4">
                      <Button asChild size="sm">
                        <Link href={`/opportunity/${o.slug}`}>
                          Open signal
                          <ArrowRight />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: one stacked card per opportunity. */}
              <div className="flex flex-col gap-4 md:hidden">
                {compared.map((o) => (
                  <Card key={o.slug} className="gap-3 p-6">
                    <CardHeader className="flex-row items-start justify-between gap-3">
                      <CardTitle className="text-lg">{o.title}</CardTitle>
                      <button
                        type="button"
                        onClick={() => toggleCompare(o.slug)}
                        aria-label={`Remove ${o.title} from comparison`}
                        className="shrink-0 text-danger"
                      >
                        <X className="size-5" />
                      </button>
                    </CardHeader>
                    <CardContent className="gap-0 divide-y divide-border">
                      {ROWS.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-start justify-between gap-4 py-2 text-sm"
                        >
                          <span className="w-28 shrink-0 text-muted-foreground">
                            {row.label}
                          </span>
                          <span className="min-w-0 flex-1 text-right break-words">
                            {row.render(o)}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button asChild size="sm" className="w-full">
                        <Link href={`/opportunity/${o.slug}`}>
                          Open signal
                          <ArrowRight />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {strongestFit && (
                <PrototypeDisclaimer
                  variant="callout"
                  tone="muted"
                  title={`Best fit right now: ${strongestFit.title}`}
                >
                  Based on your saved preferences and this opportunity&rsquo;s
                  evidence, cost and time trade-offs, this looks like the
                  strongest starting point among what you&rsquo;re comparing —
                  not a guaranteed outcome, so check its Evidence tab before
                  committing.
                </PrototypeDisclaimer>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
