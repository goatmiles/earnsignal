import { AlertTriangle, FileSearch, Info, TrendingUp } from "lucide-react";

import { Sparkline } from "@/components/Sparkline";

/**
 * Purely decorative — illustrates what a signal "feels like" before anyone
 * has personalised anything. Deliberately uses different example names
 * (print-on-demand, dropshipping) than the app's real 6 opportunities,
 * matching the source design's own choice to keep the hero's flavour
 * content separate from the live opportunity data.
 */
export function SignalPreviewCards() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-12">
      <div className="absolute top-16 right-0 flex w-72 flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Print-on-demand niche</span>
          <span className="font-mono text-sm text-accent">91/100</span>
        </div>
        <Sparkline data={[5, 8, 6, 10, 9, 13, 12, 16, 15, 18, 20]} className="h-12 w-full text-accent" />
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-accent" />
          <span className="text-xs text-muted-foreground">
            Rising demand, low saturation
          </span>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 flex w-64 flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Dropshipping supplements</span>
          <span className="font-mono text-sm text-danger">34/100</span>
        </div>
        <Sparkline data={[18, 16, 17, 12, 13, 6, 8, 3, 4, 1]} className="h-12 w-full text-danger" />
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-danger" />
          <span className="text-xs text-muted-foreground">
            Oversaturated, high refund risk
          </span>
        </div>
      </div>

      {/* Anchor card — sits centered in normal flow; the two above float
          absolutely around it, matching the source design's structure. */}
      <div className="relative flex w-80 flex-col gap-6 rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">Evidence score</span>
          <FileSearch className="size-5 text-muted-foreground" />
        </div>

        <ScoreRow label="Market data" status="Strong evidence" tone="accent" percent={88} />
        <ScoreRow label="Community buzz" status="Mixed signals" tone="warning" percent={55} />
        <ScoreRow label="Social hype" status="Mostly hype" tone="danger" percent={30} />

        <div className="flex items-center gap-2 border-t border-border pt-2">
          <Info className="size-4 shrink-0 text-info" />
          <span className="text-xs text-muted-foreground">
            Illustrative prototype score based on sample evidence
          </span>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  status,
  tone,
  percent,
}: {
  label: string;
  status: string;
  tone: "accent" | "warning" | "danger";
  percent: number;
}) {
  const toneText =
    tone === "accent"
      ? "text-accent"
      : tone === "warning"
        ? "text-warning"
        : "text-danger";
  const toneBg =
    tone === "accent" ? "bg-accent" : tone === "warning" ? "bg-warning" : "bg-danger";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{label}</span>
        <span className={`font-mono text-sm ${toneText}`}>{status}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div
          className={`h-full rounded-full ${toneBg}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
