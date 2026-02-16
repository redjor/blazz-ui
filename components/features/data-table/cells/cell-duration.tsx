'use client';

export interface CellDurationProps {
  /** Duration value in the specified unit */
  value: number;
  /** Input unit (default 'minutes') */
  unit?: 'seconds' | 'minutes' | 'hours';
}

function toSeconds(value: number, unit: 'seconds' | 'minutes' | 'hours'): number {
  switch (unit) {
    case 'hours':
      return value * 3600;
    case 'minutes':
      return value * 60;
    case 'seconds':
    default:
      return value;
  }
}

function formatDuration(totalSeconds: number): string {
  const abs = Math.abs(totalSeconds);

  const days = Math.floor(abs / 86400);
  const hours = Math.floor((abs % 86400) / 3600);
  const minutes = Math.floor((abs % 3600) / 60);
  const seconds = Math.floor(abs % 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Renders a human-readable duration (e.g. "2h 30m", "45s").
 */
export function CellDuration({ value, unit = 'minutes' }: CellDurationProps) {
  if (value == null) {
    return <span className="text-fg-muted">&mdash;</span>;
  }

  const totalSeconds = toSeconds(value, unit);
  const formatted = formatDuration(totalSeconds);

  return <span className="text-body-md tabular-nums">{formatted}</span>;
}
