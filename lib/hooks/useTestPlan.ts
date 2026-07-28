"use client";

import { useEffect, useState } from "react";

import {
  startTestPlan,
  toggleTestPlanDay,
  setTestPlanDayNotes,
  setTestPlanDayReflection,
  resetTestPlan,
  type TestPlanState,
} from "@/lib/storage/local-storage";

/**
 * Owns one opportunity's test plan: hydration-safe restore (or creation,
 * if this is the first visit) plus every mutation. Scoped to a single
 * `slug`, so two different opportunities' plans never interfere with
 * each other — each call to this hook only ever touches its own slug's
 * entry in storage.
 */
export function useTestPlan(slug: string) {
  // A plain, deterministic empty shell — identical on server and client,
  // so there's no hydration mismatch. The effect below replaces it with
  // the real (or newly created) plan immediately after mount.
  const [plan, setPlan] = useState<TestPlanState>({
    slug,
    startedDate: "",
    lastUpdatedDate: "",
    days: {},
  });

  useEffect(() => {
    // Reading/creating localStorage state genuinely can't happen during
    // render (it doesn't exist on the server), so this is a legitimate
    // "sync with an external system" effect, not the avoidable pattern
    // this rule targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(startTestPlan(slug));
  }, [slug]);

  function toggleDay(day: number) {
    setPlan(toggleTestPlanDay(slug, day));
  }

  function setNotes(day: number, notes: string) {
    setPlan(setTestPlanDayNotes(slug, day, notes));
  }

  function setReflection(day: number, reflection: string) {
    setPlan(setTestPlanDayReflection(slug, day, reflection));
  }

  function reset() {
    resetTestPlan(slug);
    setPlan(startTestPlan(slug));
  }

  return { plan, toggleDay, setNotes, setReflection, reset };
}
