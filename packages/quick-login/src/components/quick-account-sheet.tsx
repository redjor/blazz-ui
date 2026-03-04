import { Fragment, useEffect, useRef, useState } from 'react';
import type { TestAccount } from '../types';
import { Sheet } from './primitives/sheet';
import { QuickAccountListItem } from './quick-account-list-item';

interface QuickAccountSheetProps {
  open: boolean;
  onClose: () => void;
  accounts: TestAccount[];
  onAccountSelect: (username: string, password: string) => void;
  side?: 'left' | 'right';
}

const GROUP_STYLES: Record<string, { header: string; avatar: string }> = {
  Admin: {
    header: 'bg-red-50 text-red-700 border-red-200',
    avatar: 'bg-red-500',
  },
  Global: {
    header: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    avatar: 'bg-indigo-500',
  },
  Magasins: {
    header: 'bg-green-50 text-green-700 border-green-200',
    avatar: 'bg-emerald-500',
  },
};

const DEFAULT_GROUP_STYLE = {
  header: 'bg-gray-50 text-gray-700 border-gray-200',
  avatar: 'bg-gray-500',
};

interface GroupData {
  name: string;
  subgroups: { name: string; accounts: TestAccount[] }[];
  totalCount: number;
}

function buildGroups(accounts: TestAccount[]): GroupData[] {
  const groupMap = new Map<string, Map<string, TestAccount[]>>();

  for (const account of accounts) {
    if (!account.username) continue;
    const group = account.group || 'Autres';
    const subgroup = account.subgroup || '';

    if (!groupMap.has(group)) {
      groupMap.set(group, new Map());
    }
    const subs = groupMap.get(group) as Map<string, TestAccount[]>;
    if (!subs.has(subgroup)) {
      subs.set(subgroup, []);
    }
    (subs.get(subgroup) as TestAccount[]).push(account);
  }

  return Array.from(groupMap.entries()).map(([name, subsMap]) => {
    const subgroups = Array.from(subsMap.entries()).map(([subName, accs]) => ({
      name: subName,
      accounts: accs,
    }));
    const totalCount = subgroups.reduce((sum, sg) => sum + sg.accounts.length, 0);
    return { name, subgroups, totalCount };
  });
}

function filterAccounts(accounts: TestAccount[], query: string): TestAccount[] {
  if (!query) return accounts;
  const q = query.toLowerCase();
  return accounts.filter(
    (a) =>
      a.label.toLowerCase().includes(q) ||
      a.username.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.subgroup?.toLowerCase().includes(q)
  );
}

export function QuickAccountSheet({
  open,
  onClose,
  accounts,
  onAccountSelect,
  side = 'right',
}: QuickAccountSheetProps) {
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus search input when sheet opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => searchRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
    setSearch('');
  }, [open]);

  const filtered = filterAccounts(accounts, search);
  const groups = buildGroups(filtered);
  const totalCount = accounts.filter((a) => a.username !== '').length;

  const handleSelect = (account: TestAccount) => {
    onAccountSelect(account.username, account.password);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} side={side}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <h2 id="sheet-title" className="text-lg font-semibold text-gray-900">
            Comptes de test
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            aria-label="Fermer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
            >
              <title>Fermer</title>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un compte..."
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Liste scrollable groupee */}
      <div className="overflow-y-auto flex-1">
        {groups.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            Aucun compte ne correspond a &quot;{search}&quot;
          </div>
        )}

        {groups.map((group) => {
          const style = GROUP_STYLES[group.name] || DEFAULT_GROUP_STYLE;

          return (
            <div key={group.name}>
              {/* Group header */}
              <div
                className={`sticky top-0 z-[5] px-4 py-2 border-b text-xs font-semibold uppercase tracking-wider ${style.header}`}
              >
                {group.name}
                <span className="ml-1.5 font-normal opacity-70">({group.totalCount})</span>
              </div>

              {group.subgroups.map((subgroup) => (
                <Fragment key={subgroup.name || '__default'}>
                  {/* Subgroup header */}
                  {subgroup.name && (
                    <div className="px-4 py-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-white">
                      {subgroup.name}
                    </div>
                  )}

                  {subgroup.accounts.map((account) => (
                    <QuickAccountListItem
                      key={account.username}
                      account={account}
                      onSelect={() => handleSelect(account)}
                      avatarColor={style.avatar}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex-shrink-0">
        <p className="text-xs text-gray-500 text-center">
          {search ? `${filtered.length} / ${totalCount} comptes` : `${totalCount} comptes`}
          {' · '}
          <span className="text-gray-400">Clic = connexion directe</span>
        </p>
      </div>
    </Sheet>
  );
}
