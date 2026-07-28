// Shared localStorage layer for EarnSignal.
//
// The generic read/write helpers below (readJSON/writeJSON) are reused by
// every section below rather than each rolling its own localStorage
// access — that's the main reason this file exists as one shared module.

export const STORAGE_KEYS = {
  savedOpportunities: "earnsignal:saved-opportunities",
  compareList: "earnsignal:compare-list",
  personalisation: "earnsignal:personalisation",
  testPlans: "earnsignal:test-plans",
} as const;

/** Reads and JSON-parses a key. Returns `fallback` on the server, on a
 * missing key, or if the stored value can't be parsed. */
export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** JSON-serializes and writes a key. No-ops on the server. */
export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail (quota, private browsing, etc.) — fail silently
    // rather than break the page, since none of this data is critical.
  }
}

// ---------------------------------------------------------------------
// Saved opportunities (Stage 3)
// ---------------------------------------------------------------------

export function getSavedOpportunitySlugs(): string[] {
  return readJSON<string[]>(STORAGE_KEYS.savedOpportunities, []);
}

/** Toggles a slug in/out of the saved list and returns the new list. */
export function toggleSavedOpportunity(slug: string): string[] {
  const current = getSavedOpportunitySlugs();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  writeJSON(STORAGE_KEYS.savedOpportunities, next);
  return next;
}

// ---------------------------------------------------------------------
// Compare list — max 3 opportunities. Toggling is wired up from Discover
// (Stage 3); the dedicated /compare page that reads this list is Stage 5.
// ---------------------------------------------------------------------

export const MAX_COMPARE_ITEMS = 3;

export function getCompareSlugs(): string[] {
  return readJSON<string[]>(STORAGE_KEYS.compareList, []);
}

/** Adds a slug to the compare list. Returns `{ success: false }` without
 * changing anything if the list is already at MAX_COMPARE_ITEMS. */
export function addToCompare(slug: string): { success: boolean } {
  const current = getCompareSlugs();
  if (current.includes(slug)) return { success: true };
  if (current.length >= MAX_COMPARE_ITEMS) return { success: false };
  writeJSON(STORAGE_KEYS.compareList, [...current, slug]);
  return { success: true };
}

export function removeFromCompare(slug: string): void {
  const current = getCompareSlugs();
  writeJSON(
    STORAGE_KEYS.compareList,
    current.filter((s) => s !== slug),
  );
}

export function clearCompare(): void {
  writeJSON(STORAGE_KEYS.compareList, []);
}

// ---------------------------------------------------------------------
// Personalisation answers (Stage 2)
// ---------------------------------------------------------------------

export interface PersonalisationAnswers {
  location?: string;
  availableTime?: string;
  startingBudget?: string;
  skills?: string[];
  opportunityType?: string;
}

export function getPersonalisationAnswers(): PersonalisationAnswers {
  return readJSON<PersonalisationAnswers>(STORAGE_KEYS.personalisation, {});
}

export function savePersonalisationAnswers(
  answers: PersonalisationAnswers,
): void {
  writeJSON(STORAGE_KEYS.personalisation, answers);
}

// ---------------------------------------------------------------------
// Test plans — one per opportunity, keyed by slug, so starting a second
// opportunity's plan never overwrites the first (Stage 6).
// ---------------------------------------------------------------------

export interface TestPlanDayProgress {
  completed: boolean;
  notes: string;
  reflection: string;
}

export interface TestPlanState {
  slug: string;
  startedDate: string; // ISO date
  lastUpdatedDate: string; // ISO date
  days: Record<number, TestPlanDayProgress>; // keyed by day number, 1-7
}

export type TestPlansBySlug = Record<string, TestPlanState>;

const EMPTY_DAY: TestPlanDayProgress = {
  completed: false,
  notes: "",
  reflection: "",
};

export function getAllTestPlans(): TestPlansBySlug {
  return readJSON<TestPlansBySlug>(STORAGE_KEYS.testPlans, {});
}

export function getTestPlan(slug: string): TestPlanState | null {
  return getAllTestPlans()[slug] ?? null;
}

/** The plan most recently touched, across every opportunity — used by
 * "My Plans" when no specific slug is given. */
export function getMostRecentTestPlan(): TestPlanState | null {
  const plans = Object.values(getAllTestPlans());
  if (plans.length === 0) return null;
  return plans.reduce((latest, plan) =>
    new Date(plan.lastUpdatedDate) > new Date(latest.lastUpdatedDate)
      ? plan
      : latest,
  );
}

function saveTestPlan(plan: TestPlanState): TestPlanState {
  const all = getAllTestPlans();
  all[plan.slug] = plan;
  writeJSON(STORAGE_KEYS.testPlans, all);
  return plan;
}

/** Creates a plan for this opportunity if one doesn't already exist yet;
 * otherwise returns the existing one untouched. */
export function startTestPlan(slug: string): TestPlanState {
  const existing = getTestPlan(slug);
  if (existing) return existing;
  const now = new Date().toISOString();
  return saveTestPlan({ slug, startedDate: now, lastUpdatedDate: now, days: {} });
}

export function toggleTestPlanDay(slug: string, day: number): TestPlanState {
  const plan = getTestPlan(slug) ?? startTestPlan(slug);
  const existingDay = plan.days[day] ?? EMPTY_DAY;
  return saveTestPlan({
    ...plan,
    lastUpdatedDate: new Date().toISOString(),
    days: {
      ...plan.days,
      [day]: { ...existingDay, completed: !existingDay.completed },
    },
  });
}

export function setTestPlanDayNotes(
  slug: string,
  day: number,
  notes: string,
): TestPlanState {
  const plan = getTestPlan(slug) ?? startTestPlan(slug);
  const existingDay = plan.days[day] ?? EMPTY_DAY;
  return saveTestPlan({
    ...plan,
    lastUpdatedDate: new Date().toISOString(),
    days: { ...plan.days, [day]: { ...existingDay, notes } },
  });
}

export function setTestPlanDayReflection(
  slug: string,
  day: number,
  reflection: string,
): TestPlanState {
  const plan = getTestPlan(slug) ?? startTestPlan(slug);
  const existingDay = plan.days[day] ?? EMPTY_DAY;
  return saveTestPlan({
    ...plan,
    lastUpdatedDate: new Date().toISOString(),
    days: { ...plan.days, [day]: { ...existingDay, reflection } },
  });
}

/** Clears all completed/notes/reflection state for this opportunity's
 * plan — but keeps the plan itself (still shows in "Your test plans" at
 * 0%, not silently removed) and never touches any other opportunity's
 * plan. The original start date is preserved; last-updated moves to now,
 * since resetting is itself an activity. */
export function resetTestPlan(slug: string): void {
  const existing = getTestPlan(slug);
  const startedDate = existing?.startedDate || new Date().toISOString();
  saveTestPlan({
    slug,
    startedDate,
    lastUpdatedDate: new Date().toISOString(),
    days: {},
  });
}
