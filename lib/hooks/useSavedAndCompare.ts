"use client";

import { useEffect, useState } from "react";

import {
  getSavedOpportunitySlugs,
  toggleSavedOpportunity,
  getCompareSlugs,
  addToCompare,
  removeFromCompare,
  clearCompare,
} from "@/lib/storage/local-storage";

const LIMIT_MESSAGE =
  "You can compare up to 3 opportunities at a time. Remove one to add another.";

/**
 * Shared saved/compare state, used by Discover, Opportunity Detail, and
 * Compare. Handles the hydration-safe localStorage restore once, so each
 * page doesn't need to repeat it.
 */
export function useSavedAndCompare() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [compareLimitMessage, setCompareLimitMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Restoring localStorage, which doesn't exist on the server, so this
    // can only happen after mount — a legitimate "sync with an external
    // system" effect, not the avoidable pattern this rule targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedSlugs(getSavedOpportunitySlugs());
    setCompareSlugs(getCompareSlugs());
  }, []);

  useEffect(() => {
    if (!compareLimitMessage) return;
    const timer = setTimeout(() => setCompareLimitMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [compareLimitMessage]);

  function toggleSave(slug: string) {
    setSavedSlugs(toggleSavedOpportunity(slug));
  }

  function toggleCompare(slug: string) {
    if (compareSlugs.includes(slug)) {
      removeFromCompare(slug);
      setCompareSlugs((prev) => prev.filter((s) => s !== slug));
      return;
    }
    const result = addToCompare(slug);
    if (!result.success) {
      setCompareLimitMessage(LIMIT_MESSAGE);
      return;
    }
    setCompareSlugs((prev) => [...prev, slug]);
  }

  function clearAllCompare() {
    clearCompare();
    setCompareSlugs([]);
  }

  return {
    savedSlugs,
    compareSlugs,
    compareLimitMessage,
    toggleSave,
    toggleCompare,
    clearAllCompare,
  };
}
