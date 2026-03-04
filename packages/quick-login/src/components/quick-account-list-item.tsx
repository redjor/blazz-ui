import { Avatar, AvatarFallback, AvatarImage } from '@blazz/ui/components/ui/avatar';
import type { TestAccount } from '../types';
import { getInitials } from '../utils/initials';

interface QuickAccountListItemProps {
  account: TestAccount;
  onSelect: () => void;
}

export function QuickAccountListItem({ account, onSelect }: QuickAccountListItemProps) {
  if (!account.username) return null;

  const initials = getInitials(account.label);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-2.5 px-3 py-2 border-b border-separator/50 transition-colors hover:bg-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
      aria-label={`Se connecter en tant que ${account.label}`}
    >
      <Avatar size="sm">
        <AvatarImage src={account.avatarUrl} alt={account.label} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 text-left">
        <div className="truncate text-xs font-medium text-fg">{account.label}</div>
        {account.description && (
          <div className="truncate text-[11px] text-fg-muted">{account.description}</div>
        )}
      </div>

      <span className="flex-shrink-0 font-mono text-[10px] text-fg-muted tabular-nums">
        {account.username}
      </span>
    </button>
  );
}
