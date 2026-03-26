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
import { useQuery } from "convex/react";
import {
	Banknote,
	Bell,
	Bookmark,
	Bot,
	CheckSquare,
	Clock,
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
	Sun,
	Target,
	Users,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { useMemo } from "react";
import { OpsUserMenu } from "./ops-user-menu";

function createAgentIcon(name: string): ComponentType<{ className?: string }> {
  const url = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}`;
  function AgentIcon({ className }: { className?: string }) {
    return <img src={url} alt={name} width={16} height={16} className={`size-4 rounded-full shrink-0 ${className ?? ""}`} />;
  }
  AgentIcon.displayName = `AgentIcon(${name})`;
  return AgentIcon;
}

interface NavItemWithFlag extends NavItem {
  flag?: FeatureFlag;
  children?: NavItemWithFlag[];
}

interface NavGroupWithFlag {
  label?: string;
  items: NavItemWithFlag[];
}

const allNavGroups: NavGroupWithFlag[] = [
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
        title: "Mission Control",
        url: "/missions",
        icon: Bot,
        flag: "missions",
      },
    ],
  },
  {
    label: "Agents",
    items: [
      { title: "Marc", url: "/agents/cfo", icon: createAgentIcon("Marc"), flag: "agents" },
      { title: "Léo", url: "/agents/timekeeper", icon: createAgentIcon("Léo"), flag: "agents" },
      { title: "Sarah", url: "/agents/product-lead", icon: createAgentIcon("Sarah"), flag: "agents" },
      { title: "Alex", url: "/agents/assistant", icon: createAgentIcon("Alex"), flag: "agents" },
      { title: "Jules", url: "/agents/account-manager", icon: createAgentIcon("Jules"), flag: "agents" },
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
    label: "Temps & Argent",
    items: [
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
    label: "Productivité",
    items: [
      { title: "Objectifs", url: "/goals", icon: Target, flag: "goals" },
      { title: "Todos", url: "/todos", icon: CheckSquare, flag: "todos" },
    ],
  },
  {
    label: "Outils",
    items: [
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
      items: filterItems(group.items, isEnabled),
    }))
    .filter((group) => group.items.length > 0);
}

export function OpsFrame({ children }: { children: ReactNode }) {
  const { isEnabled } = useFeatureFlags();
  const unreadCount = useQuery(api.notifications.unreadCount);

  const navGroups = useMemo(() => {
    const filtered = filterGroups(allNavGroups, isEnabled);
    if (!unreadCount) return filtered;
    return filtered.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.url === "/notifications" ? { ...item, badge: unreadCount } : item,
      ),
    }));
  }, [isEnabled, unreadCount]);

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
