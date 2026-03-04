import { Fragment, useEffect, useRef, useState } from 'react';
import { Input } from '@blazz/ui/components/ui/input';
import { SheetHeader, SheetTitle } from '@blazz/ui/components/ui/sheet';
import type { TestAccount } from '../types';
import { QuickAccountListItem } from './quick-account-list-item';

interface QuickAccountSheetProps {
  accounts: TestAccount[];
  onAccountSelect: (username: string, password: string) => void;
}

/** Color scheme per group — header only, avatars use @blazz/ui defaults */
const GROUP_STYLES: Record<string, string> = {
  Admin: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  Global: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  Magasins: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

const DEFAULT_GROUP_HEADER = 'bg-surface text-fg-muted border-separator';

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

    if (!groupMap.has(group)) groupMap.set(group, new Map());
    const subs = groupMap.get(group) as Map<string, TestAccount[]>;
    if (!subs.has(subgroup)) subs.set(subgroup, []);
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

export function QuickAccountSheet({ accounts, onAccountSelect }: QuickAccountSheetProps) {
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus search on open (sheet remounts on each open)
  useEffect(() => {
    const timer = setTimeout(() => searchRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const filtered = filterAccounts(accounts, search);
  const groups = buildGroups(filtered);
  const totalCount = accounts.filter((a) => a.username !== '').length;

  return (
    <>
      {/* Header — SheetHeader includes built-in close button */}
      <SheetHeader className="gap-2.5">
        <SheetTitle>Comptes de test</SheetTitle>
        <Input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="h-7 text-xs"
        />
      </SheetHeader>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {groups.length === 0 && (
          <p className="px-4 py-8 text-center text-xs text-fg-muted">
            Aucun résultat pour «&nbsp;{search}&nbsp;»
          </p>
        )}

        {groups.map((group) => {
          const headerClass = GROUP_STYLES[group.name] ?? DEFAULT_GROUP_HEADER;

          return (
            <div key={group.name}>
              {/* Group header */}
              <div
                className={`sticky top-0 z-[5] px-3 py-1.5 border-b text-[11px] font-semibold uppercase tracking-wider ${headerClass}`}
              >
                {group.name}
                <span className="ml-1 font-normal opacity-60">({group.totalCount})</span>
              </div>

              {group.subgroups.map((subgroup) => (
                <Fragment key={subgroup.name || '__default'}>
                  {subgroup.name && (
                    <div className="bg-surface border-b border-separator/50 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-fg-muted">
                      {subgroup.name}
                    </div>
                  )}
                  {subgroup.accounts.map((account) => (
                    <QuickAccountListItem
                      key={account.username}
                      account={account}
                      onSelect={() => onAccountSelect(account.username, account.password)}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-separator bg-raised px-4 py-2">
        <p className="text-center text-[11px] text-fg-muted tabular-nums">
          {search ? `${filtered.length} / ${totalCount} comptes` : `${totalCount} comptes`}
          {' · '}
          <span className="text-fg-muted/70">clic = connexion</span>
        </p>
      </div>
    </>
  );
}
