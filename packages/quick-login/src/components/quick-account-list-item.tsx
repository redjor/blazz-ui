import type { TestAccount } from '../types';
import { getInitials } from '../utils/initials';
import { Avatar } from './primitives/avatar';

interface QuickAccountListItemProps {
  account: TestAccount;
  onSelect: () => void;
  avatarColor?: string;
}

export function QuickAccountListItem({
  account,
  onSelect,
  avatarColor = 'bg-gray-500',
}: QuickAccountListItemProps) {
  if (!account.username) return null;

  const initials = getInitials(account.label);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset border-b border-gray-100 transition-colors"
      aria-label={`Se connecter en tant que ${account.label}`}
    >
      <Avatar
        src={account.avatarUrl}
        alt={account.label}
        fallback={initials}
        size="md"
        colorClass={avatarColor}
      />

      <div className="flex-1 text-left min-w-0">
        <div className="font-medium text-sm text-gray-900 truncate">{account.label}</div>
        {account.description && (
          <div className="text-xs text-gray-400 truncate">{account.description}</div>
        )}
      </div>

      <div className="text-[11px] text-gray-400 font-mono flex-shrink-0">{account.username}</div>
    </button>
  );
}
