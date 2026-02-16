'use client';

import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface CellValidationProps {
  /** Validation severity level */
  level: 'success' | 'warning' | 'error' | 'info';
  /** Message displayed in the tooltip */
  message: string;
}

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
} as const;

const colorMap = {
  success: 'text-green-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  info: 'text-blue-500',
} as const;

/**
 * Renders a coloured validation icon with a tooltip message.
 */
export function CellValidation({ level, message }: CellValidationProps) {
  const Icon = iconMap[level];
  const color = colorMap[level];

  return (
    <Tooltip>
      <TooltipTrigger>
        <span className={cn('inline-flex items-center', color)}>
          <Icon className="size-4" />
        </span>
      </TooltipTrigger>
      <TooltipContent>{message}</TooltipContent>
    </Tooltip>
  );
}
