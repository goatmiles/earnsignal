"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { savePersonalisationAnswers } from "@/lib/storage/local-storage";
import type { PersonalisationAnswers } from "@/lib/storage/local-storage";
import { WelcomeHero } from "./WelcomeHero";
import { PersonalisationForm } from "./PersonalisationForm";

type Step = "hero" | "personalise";

// sessionStorage (not localStorage) is deliberate: this only needs to
// survive a refresh within the current tab, not a return visit days later
// — a fresh visit should still start at the Welcome hero.
const STEP_SESSION_KEY = "earnsignal:welcome-step";

/**
 * Owns the two-step Welcome → Personalisation flow that lives at "/".
 * There's no dedicated Personalisation route (see Stage 0 notes) — it's an
 * in-page second step, matching what the Flowstep screens actually
 * designed (one full page of questions, not a real multi-screen wizard).
 */
export function WelcomeFlow() {
  const [step, setStep] = useState<Step>("hero");
  const router = useRouter();

  // Hydration-safe: the very first render (server and client) always shows
  // "hero", matching what was server-rendered. Only after mounting do we
  // check sessionStorage and switch to "personalise" if that's where the
  // user was — this avoids a hydration mismatch while still resuming a
  // refresh mid-form.
  useEffect(() => {
    // sessionStorage genuinely can't be read during render (it doesn't
    // exist on the server), so restoring it here is a legitimate "sync
    // with an external system" effect, not the avoidable pattern this
    // rule targets.
    if (window.sessionStorage.getItem(STEP_SESSION_KEY) === "personalise") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep("personalise");
    }
  }, []);

  function goToPersonalise() {
    setStep("personalise");
    window.sessionStorage.setItem(STEP_SESSION_KEY, "personalise");
  }

  function handleComplete(answers: PersonalisationAnswers) {
    savePersonalisationAnswers(answers);
    window.sessionStorage.removeItem(STEP_SESSION_KEY);
    // /discover is a temporary Stage 2 placeholder until Stage 3 builds it.
    router.push("/discover");
  }

  function handleSkip() {
    // Deliberately does not read, save, or clear personalisation answers —
    // "Skip" only changes navigation, it never touches storage either way.
    router.push("/discover");
  }

  if (step === "personalise") {
    return <PersonalisationForm onComplete={handleComplete} />;
  }

  return <WelcomeHero onGetStarted={goToPersonalise} onSkip={handleSkip} />;
}
