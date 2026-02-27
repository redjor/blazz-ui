'use client';

import { cn } from '../../../../lib/utils';

interface ExpandedRowGridProps {
  items: Array<{ label: string; value: React.ReactNode }>;
  columns?: 2 | 3;
  className?: string;
}

export function ExpandedRowGrid({ items, columns = 2, className }: ExpandedRowGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 2 ? 'grid-cols-2' : 'grid-cols-3',
        className
      )}
    >
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-body-sm text-fg-muted">{item.label}</dt>
          <dd className="text-body-md text-fg mt-0.5">{item.value}</dd>
        </div>
      ))}
    </div>
  );
}
