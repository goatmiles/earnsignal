"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ChipGroup } from "@/components/ui/chip-group";
import {
  getPersonalisationAnswers,
  savePersonalisationAnswers,
  type PersonalisationAnswers,
} from "@/lib/storage/local-storage";

const LOCATION_OPTIONS = ["United Kingdom", "Europe", "Worldwide"];
const TIME_OPTIONS = ["Under 5 hours", "5–10 hours", "10–20 hours", "Full-time"];
const BUDGET_OPTIONS = ["£0", "Under £100", "£100–£500", "£500+"];
const SKILL_OPTIONS = [
  "Web development",
  "Video editing",
  "Design",
  "Sales",
  "Writing",
  "Social media",
  "No specialist skill yet",
];
const TYPE_OPTIONS = ["Online", "Local", "Either"];

interface PersonalisationFormProps {
  onComplete: (answers: PersonalisationAnswers) => void;
}

interface FieldErrors {
  location?: boolean;
  availableTime?: boolean;
  startingBudget?: boolean;
  skills?: boolean;
  opportunityType?: boolean;
}

export function PersonalisationForm({ onComplete }: PersonalisationFormProps) {
  const [location, setLocation] = useState<string>();
  const [availableTime, setAvailableTime] = useState<string>();
  const [startingBudget, setStartingBudget] = useState<string>();
  const [skills, setSkills] = useState<string[]>([]);
  const [opportunityType, setOpportunityType] = useState<string>();
  const [errors, setErrors] = useState<FieldErrors>({});

  // Hydration-safe restore: the first render (server + first client paint)
  // always shows everything unselected, matching what the server rendered.
  // Only after mounting do we read localStorage and fill anything in —
  // this covers both a returning visit and a mid-form refresh (the latter
  // works because every change is auto-saved below, not just on submit).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const saved = getPersonalisationAnswers();
    // Reading localStorage genuinely can't happen during render (it
    // doesn't exist on the server), so restoring it here is a legitimate
    // "sync with an external system" effect, not the avoidable pattern
    // this rule targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved.location) setLocation(saved.location);
    if (saved.availableTime) setAvailableTime(saved.availableTime);
    if (saved.startingBudget) setStartingBudget(saved.startingBudget);
    if (saved.skills && saved.skills.length > 0) setSkills(saved.skills);
    if (saved.opportunityType) setOpportunityType(saved.opportunityType);
    setHydrated(true);
  }, []);

  // Auto-save on every change, but only once the restore above has run —
  // otherwise this would fire first (with everything blank) and overwrite
  // whatever was already saved before it had a chance to load.
  useEffect(() => {
    if (!hydrated) return;
    savePersonalisationAnswers({
      location,
      availableTime,
      startingBudget,
      skills,
      opportunityType,
    });
  }, [hydrated, location, availableTime, startingBudget, skills, opportunityType]);

  const locationRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  function toggleSkill(skill: string) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  function handleSubmit() {
    const newErrors: FieldErrors = {
      location: !location,
      availableTime: !availableTime,
      startingBudget: !startingBudget,
      skills: skills.length === 0,
      opportunityType: !opportunityType,
    };
    setErrors(newErrors);

    const firstInvalid = newErrors.location
      ? locationRef
      : newErrors.availableTime
        ? timeRef
        : newErrors.startingBudget
          ? budgetRef
          : newErrors.skills
            ? skillsRef
            : newErrors.opportunityType
              ? typeRef
              : null;

    if (firstInvalid) {
      firstInvalid.current?.focus();
      firstInvalid.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    onComplete({ location, availableTime, startingBudget, skills, opportunityType });
  }

  const errorMessages: string[] = [];
  if (errors.location) errorMessages.push("Choose a location");
  if (errors.availableTime) errorMessages.push("Choose your available time");
  if (errors.startingBudget) errorMessages.push("Choose a starting budget");
  if (errors.skills) errorMessages.push("Select at least one skill");
  if (errors.opportunityType) errorMessages.push("Choose an opportunity type");

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-12 px-6 py-12 sm:px-12">
      <div className="flex w-full max-w-3xl flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
            <Zap className="size-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            EarnSignal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-foreground" />
          <div className="h-1.5 w-16 rounded-full bg-foreground" />
        </div>
        <span className="font-mono text-sm text-muted-foreground">
          Step 2 of 2
        </span>

        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          What could realistically work for you?
        </h1>
        <p className="max-w-xl text-center text-muted-foreground">
          Answer a few quick questions so we can tailor sample opportunities to
          your situation.
        </p>
      </div>

      {errorMessages.length > 0 && (
        <div
          role="alert"
          className="flex w-full max-w-3xl items-start gap-3 rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              Please complete the following before continuing:
            </span>
            <ul className="list-disc pl-5">
              {errorMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex w-full max-w-3xl flex-col gap-10">
        <ChipGroup
          ref={locationRef}
          label="Location"
          error={errors.location ? "Choose a location to continue." : undefined}
        >
          {LOCATION_OPTIONS.map((option) => (
            <Chip
              key={option}
              selected={location === option}
              onClick={() =>
                setLocation((prev) => (prev === option ? undefined : option))
              }
            >
              {option}
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          ref={timeRef}
          label="Available time"
          error={
            errors.availableTime ? "Choose your available time to continue." : undefined
          }
        >
          {TIME_OPTIONS.map((option) => (
            <Chip
              key={option}
              selected={availableTime === option}
              onClick={() =>
                setAvailableTime((prev) =>
                  prev === option ? undefined : option,
                )
              }
            >
              {option}
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          ref={budgetRef}
          label="Starting budget"
          error={
            errors.startingBudget ? "Choose a starting budget to continue." : undefined
          }
        >
          {BUDGET_OPTIONS.map((option) => (
            <Chip
              key={option}
              selected={startingBudget === option}
              onClick={() =>
                setStartingBudget((prev) =>
                  prev === option ? undefined : option,
                )
              }
            >
              {option}
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          ref={skillsRef}
          label="Skills"
          error={errors.skills ? "Select at least one skill to continue." : undefined}
        >
          {SKILL_OPTIONS.map((option) => (
            <Chip
              key={option}
              selected={skills.includes(option)}
              onClick={() => toggleSkill(option)}
            >
              {option}
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          ref={typeRef}
          label="Opportunity type"
          error={
            errors.opportunityType ? "Choose an opportunity type to continue." : undefined
          }
        >
          {TYPE_OPTIONS.map((option) => (
            <Chip
              key={option}
              selected={opportunityType === option}
              onClick={() =>
                setOpportunityType((prev) =>
                  prev === option ? undefined : option,
                )
              }
            >
              {option}
            </Chip>
          ))}
        </ChipGroup>
      </div>

      <div className="flex w-full max-w-3xl flex-col items-center gap-4 pb-4">
        <Button size="lg" className="w-full" onClick={handleSubmit}>
          Build my opportunity feed
          <ArrowRight className="ml-2 size-5" />
        </Button>
        <span className="font-mono text-xs text-muted-foreground">
          You can update these preferences anytime by returning here.
        </span>
      </div>
    </div>
  );
}
