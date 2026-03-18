# AppFrame — Batteries-included app shell block

**Date:** 2026-03-17
**Package:** `@blazz/pro/components/blocks/app-frame/`
**Status:** Design approved

## Objectif

Extraire le pattern OPS (sidebar + tabs + top bar + breadcrumbs + main panel) en un composant `AppFrame` réutilisable dans `@blazz/pro`. Réduire ~400 lignes de boilerplate à ~25 lignes par app.

## API Surface

```tsx
import { AppFrame, useAppTopBar } from "@blazz/pro/components/blocks/app-frame"

<AppFrame
  // Sidebar
  logo={<img src="/logo.svg" />}
  navItems={[
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Clients", url: "/clients", icon: Users },
    {
      title: "Temps", url: "/time", icon: Clock,
      children: [
        { title: "Récap", url: "/time/recap" }
      ]
    },
  ]}
  sidebarFooter={<UserMenu />}
  sidebarCollapsible="offcanvas"

  // Tabs
  tabs={{
    storageKey: "my-app-tabs",
    alwaysShow: true,
    defaultTab: { url: "/", title: "Dashboard" },
  }}

  // Layout
  rounded={true}
>
  {children}
</AppFrame>
```

### Hook `useAppTopBar`

```tsx
function ClientsPage() {
  useAppTopBar(
    [{ label: "Clients" }],
    <Button size="sm">Nouveau</Button>
  )
  return <BlockStack>...</BlockStack>
}
```

## Types

```tsx
interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  children?: NavItem[]
  badge?: string | number
}

interface TabsConfig {
  storageKey: string
  alwaysShow?: boolean        // default: false
  defaultTab: { url: string; title: string }
}

interface AppFrameProps {
  logo?: ReactNode
  navItems: NavItem[]
  sidebarFooter?: ReactNode
  sidebarCollapsible?: "offcanvas" | "icon" | "none"  // default: "offcanvas"
  tabs?: TabsConfig
  rounded?: boolean           // default: true
  className?: string
  children: ReactNode
}

interface BreadcrumbItem {
  label: string
  href?: string
}

function useAppTopBar(
  breadcrumbs: BreadcrumbItem[] | null,
  actions?: ReactNode
): void
```

## Architecture interne

```
AppFrame (public)
├── AppFrameProvider (context: breadcrumbs, actions)
│   ├── TabsProvider (@blazz/tabs)
│   │   ├── SidebarProvider (@blazz/ui)
│   │   │   └── Frame (@blazz/ui/patterns/frame)
│   │   │       ├── AppFrameSidebar (interne)
│   │   │       │   ├── SidebarHeader → logo
│   │   │       │   ├── SidebarContent → navItems → auto SidebarMenu/Collapsible
│   │   │       │   └── SidebarFooter → sidebarFooter slot
│   │   │       ├── AppFrameTabBar (interne)
│   │   │       │   ├── SidebarTrigger (quand collapsed)
│   │   │       │   └── TabsBar + TabsItem + D&D
│   │   │       ├── TopBar (breadcrumbs + actions from context)
│   │   │       └── ScrollArea → children
```

## Fichiers

```
packages/pro/src/components/blocks/app-frame/
├── index.ts                    ← export { AppFrame, useAppTopBar }
├── app-frame.tsx               ← composant principal + provider
├── app-frame-sidebar.tsx       ← génère sidebar depuis navItems
├── app-frame-tab-bar.tsx       ← tab bar + URL sync
├── app-frame-top-bar.tsx       ← breadcrumbs + actions depuis context
└── types.ts                    ← NavItem, TabsConfig, AppFrameProps, etc.
```

## Migration OPS

`apps/ops/components/ops-frame.tsx` (~400 lignes) → ~25 lignes :

```tsx
import { AppFrame } from "@blazz/pro/components/blocks/app-frame"

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Users },
]

export function OpsFrame({ children }: { children: ReactNode }) {
  return (
    <AppFrame
      logo={<Image src="/blazz-logo.svg" ... />}
      navItems={navItems}
      sidebarFooter={<OpsUserMenu />}
      tabs={{ storageKey: "ops-tabs", alwaysShow: true, defaultTab: { url: "/", title: "Dashboard" } }}
    >
      {children}
    </AppFrame>
  )
}
```

## Ce qui ne change PAS

- `@blazz/ui` — aucune modification (Frame, TopBar, Sidebar intacts)
- `@blazz/tabs` — aucune modification
- Feature flags — app-specific, filtrer navItems avant de passer
- Auth guards — restent dans le layout Next.js
