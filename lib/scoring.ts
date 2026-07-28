import type { Opportunity } from "./data/opportunities";
import type { PersonalisationAnswers } from "./storage/local-storage";

// Weights sum to 100. Evidence carries the most weight since it's the one
// factor that's always known; the rest reflect how well the opportunity
// fits what was saved in Personalisation.
const WEIGHTS = {
  evidence: 25,
  budget: 15,
  skills: 20,
  delivery: 15, // online/local preference
  geography: 10, // saved location
  time: 15,
} as const;

const BUDGET_CEILINGS: Record<string, number> = {
  "£0": 0,
  "Under £100": 100,
  "£100–£500": 500,
  "£500+": Infinity,
};

function hasAnyPersonalisation(answers: PersonalisationAnswers): boolean {
  return Boolean(
    answers.location ||
      answers.availableTime ||
      answers.startingBudget ||
      (answers.skills && answers.skills.length > 0) ||
      answers.opportunityType,
  );
}

/** 1 = full fit, 0.5 = no info to judge by, 0 = mismatch. */
function budgetFactor(
  answers: PersonalisationAnswers,
  opportunity: Opportunity,
): number {
  if (!answers.startingBudget) return 0.5;
  const ceiling = BUDGET_CEILINGS[answers.startingBudget] ?? Infinity;
  return opportunity.startupCostMin <= ceiling ? 1 : 0;
}

function skillsFactor(
  answers: PersonalisationAnswers,
  opportunity: Opportunity,
): number {
  if (!answers.skills || answers.skills.length === 0) return 0.5;
  const skillFit = opportunity.skillFit.toLowerCase();
  const directMatch = answers.skills.some(
    (skill) =>
      skill !== "No specialist skill yet" &&
      skillFit.includes(skill.toLowerCase()),
  );
  if (directMatch) return 1;
  // Someone with no specialist skill yet is reasonably well matched to
  // opportunities explicitly rated beginner-friendly.
  if (
    answers.skills.includes("No specialist skill yet") &&
    opportunity.difficulty === "Beginner friendly"
  ) {
    return 0.5;
  }
  return 0;
}

function deliveryFactor(
  answers: PersonalisationAnswers,
  opportunity: Opportunity,
): number {
  if (!answers.opportunityType) return 0.5;
  if (answers.opportunityType === "Either") return 1;
  const mode = opportunity.deliveryMode.toLowerCase();
  if (answers.opportunityType === "Online" && mode.includes("online")) return 1;
  if (answers.opportunityType === "Local" && mode.includes("local")) return 1;
  return 0;
}

function geographyFactor(
  answers: PersonalisationAnswers,
  opportunity: Opportunity,
): number {
  if (!answers.location) return 0.5;
  if (opportunity.location === "Worldwide") return 1; // accessible to anyone
  if (opportunity.location === answers.location) return 1;
  if (answers.location === "Europe" && opportunity.location === "United Kingdom") {
    return 0.5; // UK is part of Europe, so a reasonable partial fit
  }
  return 0;
}

// Rough weekly hour budget for each available-time bucket. "Full-time" has
// no realistic ceiling for a 7-day test, so it always covers any
// opportunity's estimated hours.
const AVAILABLE_HOURS: Record<string, number> = {
  "Under 5 hours": 5,
  "5–10 hours": 10,
  "10–20 hours": 20,
  "Full-time": Infinity,
};

function timeFactor(
  answers: PersonalisationAnswers,
  opportunity: Opportunity,
): number {
  if (!answers.availableTime) return 0.5;
  const availableHours = AVAILABLE_HOURS[answers.availableTime] ?? 0;
  const requiredHours = opportunity.estimatedTestHours;
  if (availableHours >= requiredHours) return 1;
  // Still workable, just tighter than ideal.
  if (availableHours >= requiredHours / 2) return 0.5;
  return 0;
}

/**
 * Computes how well an opportunity matches the saved personalisation
 * answers. Deterministic and transparent: a fixed set of weighted factors,
 * no randomness, no external calls. Falls back to the opportunity's own
 * signal score when nothing has been personalised at all.
 */
export function computeMatchScore(
  opportunity: Opportunity,
  answers: PersonalisationAnswers,
): number {
  if (!hasAnyPersonalisation(answers)) {
    return opportunity.signalScore;
  }

  const total =
    (opportunity.signalScore / 100) * WEIGHTS.evidence +
    budgetFactor(answers, opportunity) * WEIGHTS.budget +
    skillsFactor(answers, opportunity) * WEIGHTS.skills +
    deliveryFactor(answers, opportunity) * WEIGHTS.delivery +
    geographyFactor(answers, opportunity) * WEIGHTS.geography +
    timeFactor(answers, opportunity) * WEIGHTS.time;

  return Math.round(Math.min(100, Math.max(0, total)));
}
