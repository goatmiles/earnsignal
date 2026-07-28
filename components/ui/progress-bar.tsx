interface ProgressBarProps {
  percent: number; // 0-100
  label?: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className="h-2 w-full overflow-hidden rounded-full bg-card"
    >
      <div
        className="h-full rounded-full bg-accent transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
