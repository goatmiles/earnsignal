"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Compass } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Topbar } from "@/components/layout/Topbar";
import { EmptyState } from "@/components/EmptyState";
import { PrototypeDisclaimer } from "@/components/PrototypeDisclaimer";
import {
  opportunities,
  getCategories,
  getCostBucket,
  type Difficulty,
  type CostBucket,
  type Opportunity,
  type SignalTone,
} from "@/lib/data/opportunities";
import {
  getSavedOpportunitySlugs,
  toggleSavedOpportunity,
  getCompareSlugs,
  addToCompare,
  removeFromCompare,
  getPersonalisationAnswers,
  type PersonalisationAnswers,
} from "@/lib/storage/local-storage";
import { computeMatchScore } from "@/lib/scoring";
import { OpportunityCard } from "./OpportunityCard";
import { SearchAndFilters, type SortOption } from "./SearchAndFilters";

const EVIDENCE_TONE_RANK: Record<SignalTone, number> = {
  accent: 3,
  info: 2,
  warning: 1,
  danger: 0,
};

interface DiscoverViewProps {
  initialShowSavedOnly: boolean;
  initialSearchQuery: string;
}

export function DiscoverView({
  initialShowSavedOnly,
  initialSearchQuery,
}: DiscoverViewProps) {
  const router = useRouter();
  const categories = useMemo(() => getCategories(), []);

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedCostBucket, setSelectedCostBucket] = useState<CostBucket | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("bestMatch");
  const [showSavedOnly, setShowSavedOnlyState] = useState(initialShowSavedOnly);

  // Keeps the URL's ?saved=true in sync with this state — the Sidebar reads
  // the real URL (via useSearchParams) to decide whether "Discover" or
  // "Saved" is active, so if this only updated local state, toggling
  // "Show all" here would leave Saved highlighted even though Discover's
  // full list is what's actually showing.
  function setShowSavedOnly(value: boolean) {
    setShowSavedOnlyState(value);
    router.replace(value ? "/discover?saved=true" : "/discover", {
      scroll: false,
    });
  }

  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [personalisation, setPersonalisation] = useState<PersonalisationAnswers>(
    {},
  );
  const [compareLimitMessage, setCompareLimitMessage] = useState<string | null>(
    null,
  );

  // Hydration-safe restore: saved/compare/personalisation state can't be
  // read until we're in the browser (localStorage doesn't exist on the
  // server), so this starts empty on first render (matching the server)
  // and fills in right after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see note above
    setSavedSlugs(getSavedOpportunitySlugs());
    setCompareSlugs(getCompareSlugs());
    setPersonalisation(getPersonalisationAnswers());
  }, []);

  // Auto-dismiss the "comparison full" message after a few seconds.
  useEffect(() => {
    if (!compareLimitMessage) return;
    const timer = setTimeout(() => setCompareLimitMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [compareLimitMessage]);

  function handleToggleSave(slug: string) {
    setSavedSlugs(toggleSavedOpportunity(slug));
  }

  function handleToggleCompare(slug: string) {
    if (compareSlugs.includes(slug)) {
      removeFromCompare(slug);
      setCompareSlugs((prev) => prev.filter((s) => s !== slug));
      return;
    }
    const result = addToCompare(slug);
    if (!result.success) {
      setCompareLimitMessage(
        "You can compare up to 3 opportunities at a time. Remove one to add another.",
      );
      return;
    }
    setCompareSlugs((prev) => [...prev, slug]);
  }

  function clearAllFilters() {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSelectedCostBucket(null);
    setSortBy("bestMatch");
    setShowSavedOnly(false);
  }

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== null ||
    selectedDifficulty !== null ||
    selectedCostBucket !== null ||
    sortBy !== "bestMatch" ||
    showSavedOnly;

  const results = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = opportunities.filter((o) => {
      if (showSavedOnly && !savedSlugs.includes(o.slug)) return false;
      if (selectedCategory && o.category !== selectedCategory) return false;
      if (selectedDifficulty && o.difficulty !== selectedDifficulty) return false;
      if (
        selectedCostBucket &&
        getCostBucket(o.startupCostMin) !== selectedCostBucket
      )
        return false;
      if (query) {
        const haystack = [o.title, o.shortDescription, o.category, o.skillFit]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return a.updatedMinutesAgo - b.updatedMinutesAgo;
        case "lowestCost":
          return a.startupCostMin - b.startupCostMin;
        case "strongestEvidence":
          return (
            EVIDENCE_TONE_RANK[b.evidenceStrength.tone] -
              EVIDENCE_TONE_RANK[a.evidenceStrength.tone] ||
            b.signalScore - a.signalScore
          );
        case "bestMatch":
        default:
          return (
            computeMatchScore(b, personalisation) -
            computeMatchScore(a, personalisation)
          );
      }
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedCostBucket,
    sortBy,
    showSavedOnly,
    savedSlugs,
    personalisation,
  ]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <Topbar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Signals worth investigating
            </h1>
            <p className="text-sm text-muted-foreground">
              Opportunities matched to your time, budget, location and
              skills.
            </p>
          </div>

          <PrototypeDisclaimer variant="badge" />

          {showSavedOnly && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
              <span>Showing your saved opportunities only.</span>
              <button
                type="button"
                onClick={() => setShowSavedOnly(false)}
                className="shrink-0 font-medium underline underline-offset-2"
              >
                Show all
              </button>
            </div>
          )}

          <SearchAndFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            selectedCostBucket={selectedCostBucket}
            onSelectCostBucket={setSelectedCostBucket}
            sortBy={sortBy}
            onSortChange={setSortBy}
            hasActiveFilters={hasActiveFilters}
            onClearAll={clearAllFilters}
          />

          <h2 className="sr-only">Opportunity results</h2>

          {results.length === 0 ? (
            <EmptyState
              icon={Compass}
              title={
                showSavedOnly
                  ? "You haven't saved any opportunities yet"
                  : "No opportunities match your filters"
              }
              description={
                showSavedOnly
                  ? "Tap the bookmark icon on any opportunity to save it for later."
                  : "Try widening your search, or clear your filters to see everything."
              }
              action={{ label: "Clear all filters", onClick: clearAllFilters }}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((opportunity: Opportunity, index) => (
                <OpportunityCard
                  key={opportunity.slug}
                  opportunity={opportunity}
                  saved={savedSlugs.includes(opportunity.slug)}
                  onToggleSave={() => handleToggleSave(opportunity.slug)}
                  compareSelected={compareSlugs.includes(opportunity.slug)}
                  onToggleCompare={() => handleToggleCompare(opportunity.slug)}
                  featured={sortBy === "bestMatch" && index === 0}
                />
              ))}
            </div>
          )}
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
