"use client";

import { BlazzLogo } from "@/components/blazz-logo";
import { api } from "@/convex/_generated/api";
import { useFeatureFlags } from "@/lib/feature-flags-context";
import type { FeatureFlag } from "@/lib/features";
import {
	AppFrame,
	type NavGroup,
	type NavItem,
} from "@blazz/pro/components/blocks/app-frame";
import { useMutation, useQuery } from "convex/react";
import {
	Banknote,
	Bell,
	Bookmark,
	Bot,
	CheckSquare,
	Clock,
	Activity,
	FileText,
	FolderOpen,
	Key,
	LayoutDashboard,
	MessageSquare,
	Package,
	PiggyBank,
	Receipt,
	Rocket,
	Rss,
	Settings,
	Star,
	Sun,
	Target,
	Users,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { OpsUserMenu } from "./ops-user-menu";

function AgentNavIcon({ name, status }: { name: string; status: string }) {
  const url = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}`;
  return (
    <span className="relative">
      <img src={url} alt={name} width={16} height={16} className="size-4 rounded-full shrink-0" />
      {status === "busy" && (
        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 animate-pulse ring-1 ring-surface" />
      )}
      {status === "paused" && (
        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-amber-400 ring-1 ring-surface" />
      )}
      {status === "error" && (
        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-red-500 ring-1 ring-surface" />
      )}
      {status === "disabled" && (
        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-fg-muted/40 ring-1 ring-surface" />
      )}
    </span>
  );
}

function createAgentIconWithStatus(name: string, status: string): ComponentType<{ className?: string }> {
  function Icon() {
    return <AgentNavIcon name={name} status={status} />;
  }
  Icon.displayName = `AgentIcon(${name})`;
  return Icon;
}

const entityTypeIcons: Record<string, ComponentType<{ className?: string }>> = {
	client: Users,
	project: FolderOpen,
	todo: CheckSquare,
	note: FileText,
	bookmark: Bookmark,
	feedItem: Rss,
}

const urlMap: Record<string, (id: string) => string> = {
	client: (id) => `/clients/${id}`,
	project: (id) => `/projects/${id}`,
	todo: () => "/todos",
	note: (id) => `/notes/${id}`,
	bookmark: () => "/bookmarks",
	feedItem: () => "/veille",
}

interface NavItemWithFlag extends NavItem {
  flag?: FeatureFlag;
  children?: NavItemWithFlag[];
}

interface NavGroupWithFlag {
  label?: string;
  items: NavItemWithFlag[];
  display?: "list" | "shortcuts";
}

const allNavGroups: NavGroupWithFlag[] = [
  {
    display: "shortcuts",
    items: [
      { title: "Todos", url: "/todos", icon: CheckSquare, flag: "todos" },
      { title: "Notes", url: "/notes", icon: FileText },
      {
        title: "Bookmarks",
        url: "/bookmarks",
        icon: Bookmark,
        flag: "bookmarks",
      },
      { title: "Veille", url: "/veille", icon: Rss, flag: "veille" },
      { title: "Chat", url: "/chat", icon: MessageSquare, flag: "chat" },
    ],
  },
  {
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
        flag: "dashboard",
      },
      { title: "Aujourd'hui", url: "/today", icon: Sun, flag: "today" },
      {
        title: "Inbox",
        url: "/notifications",
        icon: Bell,
        flag: "notifications",
      },
      {
        title: "Activité",
        url: "/activity",
        icon: Activity,
        flag: "agents",
      },
      {
        title: "Mission Control",
        url: "/missions",
        icon: Bot,
        flag: "missions",
      },
    ],
  },
  {
    label: "Clients",
    items: [
      { title: "Clients", url: "/clients", icon: Users, flag: "clients" },
      {
        title: "Projets",
        url: "/projects",
        icon: FolderOpen,
        flag: "projects",
      },
    ],
  },
  {
    label: "Finances",
    items: [
      { title: "Objectifs", url: "/goals", icon: Target, flag: "goals" },
      {
        title: "Suivi de temps",
        url: "/time",
        icon: Clock,
        flag: "time",
        children: [{ title: "Récapitulatif", url: "/recap", flag: "recap" }],
      },
      { title: "Factures", url: "/invoices", icon: Receipt, flag: "invoicing" },
      { title: "Finances", url: "/finances", icon: Banknote, flag: "finances" },
      {
        title: "Trésorerie",
        url: "/treasury",
        icon: PiggyBank,
        flag: "treasury",
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        title: "Deployments",
        url: "/deployments",
        icon: Rocket,
        flag: "deployments",
      },
      { title: "Packages", url: "/packages", icon: Package, flag: "packages" },
      { title: "Licences", url: "/licenses", icon: Key, flag: "licenses" },
      {
        title: "Paramètres",
        url: "/settings",
        icon: Settings,
        flag: "settings",
      },
    ],
  },
];

function filterItems(
  items: NavItemWithFlag[],
  isEnabled: (flag: FeatureFlag) => boolean,
): NavItem[] {
  return items
    .filter((item) => !item.flag || isEnabled(item.flag))
    .map((item) => {
      const { flag, children, ...rest } = item;
      if (children?.length) {
        const filtered = filterItems(children, isEnabled);
        return filtered.length > 0 ? { ...rest, children: filtered } : rest;
      }
      return rest;
    });
}

function filterGroups(
  groups: NavGroupWithFlag[],
  isEnabled: (flag: FeatureFlag) => boolean,
): NavGroup[] {
  return groups
    .map((group) => ({
      label: group.label,
      display: group.display,
      items: filterItems(group.items, isEnabled),
    }))
    .filter((group) => group.items.length > 0);
}

export function OpsFrame({ children }: { children: ReactNode }) {
  const { isEnabled } = useFeatureFlags();
  const unreadCount = useQuery(api.notifications.unreadCount);
  const agents = useQuery(api.agents.list);
  const favorites = useQuery(api.favorites.list);
  const syncFavoriteLabels = useMutation(api.favorites.syncLabels);

  useEffect(() => {
    if (favorites && favorites.length > 0) {
      syncFavoriteLabels();
    }
  }, [favorites?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const navGroups = useMemo(() => {
    const filtered = filterGroups(allNavGroups, isEnabled);

    // Insert Favoris group after main nav (after Inbox)
    if (favorites && favorites.length > 0) {
      const favGroup: NavGroup = {
        label: "Favoris",
        items: favorites.map((fav) => ({
          title: fav.label,
          url: (urlMap[fav.entityType] ?? (() => "/"))(fav.entityId),
          icon: entityTypeIcons[fav.entityType] ?? Star,
        })),
      };
      // Insert before Clients group
      const insertIdx = filtered.findIndex((g) => g.label === "Clients");
      if (insertIdx >= 0) {
        filtered.splice(insertIdx, 0, favGroup);
      } else {
        filtered.push(favGroup);
      }
    }

    // Build Agents group dynamically from live data
    if (agents && agents.length > 0 && isEnabled("agents")) {
      const agentsGroup: NavGroup = {
        label: "Agents",
        items: agents.map((agent) => ({
          title: agent.name,
          url: `/agents/${agent.slug}`,
          icon: createAgentIconWithStatus(agent.name, agent.status),
        })),
      };
      // Insert Agents group after the first group (main nav)
      const firstGroup = filtered[0];
      const rest = filtered.slice(1);
      const withAgents = [firstGroup, agentsGroup, ...rest];
      if (!unreadCount) return withAgents;
      return withAgents.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.url === "/notifications" ? { ...item, badge: unreadCount } : item,
        ),
      }));
    }

    if (!unreadCount) return filtered;
    return filtered.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.url === "/notifications" ? { ...item, badge: unreadCount } : item,
      ),
    }));
  }, [isEnabled, unreadCount, agents, favorites]);

  return (
    <AppFrame
      logo={<BlazzLogo className="text-fg" />}
      navItems={navGroups}
      sidebarFooter={<OpsUserMenu />}
      tabs={{
        storageKey: "ops-tabs",
        alwaysShow: true,
        defaultTab: { url: "/", title: "Dashboard" },
      }}
    >
      {children}
    </AppFrame>
  );
}
