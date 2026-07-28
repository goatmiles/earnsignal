import { Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PrototypeDisclaimer } from "@/components/PrototypeDisclaimer";
import { SignalPreviewCards } from "./SignalPreviewCards";

interface WelcomeHeroProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

/**
 * The source design's two buttons here were "Continue with Google" /
 * "Continue with email" — fake OAuth with no backend behind it. Same
 * two-button layout and styling is kept, but both buttons now do something
 * real: personalise first, or skip straight to browsing. The "Already have
 * an account? Sign in" line is dropped rather than reworded — there's no
 * honest way to relabel it, since this build has no accounts at all.
 */
export function WelcomeHero({ onGetStarted, onSkip }: WelcomeHeroProps) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:max-w-[760px] lg:px-24">
        <div className="mb-12 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
            <Zap className="size-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            EarnSignal
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Stop chasing hype. Start testing real opportunities.
        </h1>
        <p className="mb-10 max-w-[560px] text-lg text-muted-foreground">
          EarnSignal turns emerging income trends into evidence, honest
          expectations and practical action plans.
        </p>

        <div className="flex max-w-[420px] flex-col gap-4">
          <Button size="lg" onClick={onGetStarted}>
            Get started
          </Button>
          <Button size="lg" variant="outline" onClick={onSkip}>
            Skip to Discover
          </Button>
        </div>

        <div className="mt-10 max-w-[520px] border-t border-border pt-6">
          <PrototypeDisclaimer />
        </div>
      </div>

      <div className="hidden flex-1 border-l border-border lg:flex">
        <SignalPreviewCards />
      </div>
    </div>
  );
}
