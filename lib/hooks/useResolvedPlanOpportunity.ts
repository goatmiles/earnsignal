"use client";

import { useEffect, useState } from "react";

import { getOpportunityBySlug, type Opportunity } from "@/lib/data/opportunities";
import { getMostRecentTestPlan } from "@/lib/storage/local-storage";

export type PlanResolution =
  | { status: "loading" }
  | { status: "invalid-slug" }
  | { status: "no-plans" }
  | { status: "ready"; opportunity: Opportunity };

/**
 * Resolves which opportunity's plan a page (Test Plan, Progress) should
 * show: the one named by `slugParam` if given — never silently falling
 * back to a different opportunity if that slug doesn't exist — or
 * otherwise whichever plan was most recently updated in storage.
 */
export function useResolvedPlanOpportunity(slugParam?: string): PlanResolution {
  // If a slug came from the URL, resolving it only needs the static
  // opportunity data — identical on server and client, so this can
  // happen synchronously with no hydration risk.
  const [resolution, setResolution] = useState<PlanResolution>(() => {
    if (slugParam) {
      const opportunity = getOpportunityBySlug(slugParam);
      return opportunity
        ? { status: "ready", opportunity }
        : { status: "invalid-slug" };
    }
    // No slug means falling back to "whatever was last worked on", which
    // needs localStorage — not available during the first render, so
    // this starts neutral and resolves right after mount.
    return { status: "loading" };
  });

  useEffect(() => {
    if (slugParam) return; // already resolved synchronously above
    const recent = getMostRecentTestPlan();
    if (!recent) {
      // Reading localStorage, which doesn't exist on the server, so this
      // can only happen after mount — a legitimate "sync with an external
      // system" effect, not the avoidable pattern this rule targets.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResolution({ status: "no-plans" });
      return;
    }
    const opportunity = getOpportunityBySlug(recent.slug);
    setResolution(
      opportunity ? { status: "ready", opportunity } : { status: "no-plans" },
    );
  }, [slugParam]);

  return resolution;
}
