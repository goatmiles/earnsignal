interface SparklineProps {
  data: number[];
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Renders `data` as a simple trend line. Colour comes from the surrounding
 * text colour (`stroke="currentColor"`), so pass a text-colour className
 * like `text-accent` or `text-danger` — no separate colour prop needed.
 */
export function Sparkline({
  data,
  className,
  width = 100,
  height = 30,
}: SparklineProps) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data
    .map((value, i) => {
      const x = i * stepX;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      width={width}
      height={height}
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
