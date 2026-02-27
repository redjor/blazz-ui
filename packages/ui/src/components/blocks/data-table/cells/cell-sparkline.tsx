'use client';

export interface CellSparklineProps {
  /** Array of numeric data points */
  values: number[];
  /** Chart type */
  type?: 'line' | 'bar';
  /** Stroke/fill color (CSS color string) */
  color?: string;
  /** SVG height in pixels (default 24) */
  height?: number;
  /** SVG width in pixels (default 80) */
  width?: number;
}

/**
 * Renders a tiny inline sparkline chart as pure SVG (no external lib).
 */
export function CellSparkline({
  values,
  type = 'line',
  color = 'oklch(0.585 0.22 275)',
  height = 24,
  width = 80,
}: CellSparklineProps) {
  if (!values || values.length === 0) {
    return <span className="text-fg-muted">&mdash;</span>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 2;

  if (type === 'bar') {
    const barWidth = (width - padding * 2) / values.length;
    const barGap = Math.max(1, barWidth * 0.15);
    const effectiveBarWidth = barWidth - barGap;
    const chartHeight = height - padding * 2;

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        className="shrink-0"
      >
        {values.map((v, i) => {
          const barHeight = ((v - min) / range) * chartHeight || 1;
          const x = padding + i * barWidth + barGap / 2;
          const y = height - padding - barHeight;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={effectiveBarWidth}
              height={barHeight}
              fill={color}
              rx={1}
            />
          );
        })}
      </svg>
    );
  }

  // Line variant
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = values
    .map((v, i) => {
      const x = padding + (i / (values.length - 1 || 1)) * chartWidth;
      const y = height - padding - ((v - min) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="shrink-0"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
