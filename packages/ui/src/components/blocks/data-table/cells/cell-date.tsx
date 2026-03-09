'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '../../../ui/tooltip';
import { cn } from '../../../../lib/utils';

export interface CellDateProps {
  /** Date value as string or Date object */
  value: string | Date;
  /** Locale for formatting (default 'fr-FR') */
  locale?: string;
  /** Intl.DateTimeFormat options for the displayed date */
  format?: Intl.DateTimeFormatOptions;
  /** Additional class names */
  className?: string;
}

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

const TOOLTIP_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: 'full',
  timeStyle: 'short',
};

/**
 * Renders a formatted date with an exact-date tooltip.
 * Handles null/undefined/invalid dates gracefully with an em dash.
 */
export function CellDate({ value, locale = 'fr-FR', format, className }: CellDateProps) {
  if (!value) {
    return <span className="text-fg-muted">&mdash;</span>;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return <span className="text-fg-muted">&mdash;</span>;
  }

  const formatted = new Intl.DateTimeFormat(locale, format ?? DEFAULT_FORMAT).format(date);
  const exact = new Intl.DateTimeFormat(locale, TOOLTIP_FORMAT).format(date);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn('text-body-md text-fg-muted cursor-default', className)}>
          {formatted}
        </span>
      </TooltipTrigger>
      <TooltipContent>{exact}</TooltipContent>
    </Tooltip>
  );
}
