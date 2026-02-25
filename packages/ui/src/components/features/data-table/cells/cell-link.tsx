'use client';

import { ExternalLink, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CellLinkProps {
  /** The link value (URL, email, or phone number) */
  value: string;
  /** Type of link determines prefix and icon */
  type?: 'url' | 'email' | 'tel';
  /** Show an icon next to the link (default true) */
  showIcon?: boolean;
  /** Maximum width in pixels — triggers truncation */
  maxWidth?: number;
}

const iconMap = {
  url: ExternalLink,
  email: Mail,
  tel: Phone,
} as const;

function getHref(value: string, type: 'url' | 'email' | 'tel'): string {
  switch (type) {
    case 'email':
      return `mailto:${value}`;
    case 'tel':
      return `tel:${value}`;
    default:
      return value;
  }
}

/**
 * Renders a clickable link with an appropriate icon.
 * URLs open in a new tab, emails open the mail client, phone numbers invoke the dialer.
 */
export function CellLink({ value, type = 'url', showIcon = true, maxWidth }: CellLinkProps) {
  if (!value) {
    return <span className="text-fg-muted">&mdash;</span>;
  }

  const Icon = iconMap[type];
  const href = getHref(value, type);
  const isExternal = type === 'url';

  return (
    <a
      href={href}
      title={value}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm text-brand hover:underline',
        maxWidth && 'max-w-full',
      )}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {showIcon && <Icon className="size-3.5 shrink-0" />}
      <span className="truncate">{value}</span>
    </a>
  );
}
