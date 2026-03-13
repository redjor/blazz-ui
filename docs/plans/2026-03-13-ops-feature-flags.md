# Ops Feature Flags — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a static feature flag system to `apps/ops` for dev-gating routes and page sections.

**Architecture:** TypeScript config object → `isEnabled()` helper → `<FeatureGate>` component for sections + nav filtering + route guard for direct URL access. All in `apps/ops/`, no changes to `packages/ui/`.

**Tech Stack:** TypeScript, React, Next.js (usePathname, redirect), Vitest

---

### Task 1: Create feature flags config

**Files:**
- Create: `apps/ops/lib/features.ts`
- Test: `apps/ops/lib/features.test.ts`

**Step 1: Write the test**

```ts
// apps/ops/lib/features.test.ts
import { describe, expect, it } from "vitest"
import { features, isEnabled, routeToFlag, type FeatureFlag } from "./features"

describe("isEnabled", () => {
  it("returns true for enabled flags", () => {
    // All flags are enabled by default
    for (const key of Object.keys(features) as FeatureFlag[]) {
      expect(isEnabled(key)).toBe(true)
    }
  })
})

describe("routeToFlag", () => {
  it("maps top-level routes to flags", () => {
    expect(routeToFlag("/chat")).toBe("chat")
    expect(routeToFlag("/todos")).toBe("todos")
    expect(routeToFlag("/packages")).toBe("packages")
  })

  it("maps nested routes to parent flag", () => {
    expect(routeToFlag("/clients/123")).toBe("clients")
    expect(routeToFlag("/clients/123/projects/456")).toBe("clients")
    expect(routeToFlag("/todos/abc")).toBe("todos")
  })

  it("returns null for unknown routes", () => {
    expect(routeToFlag("/unknown")).toBeNull()
    expect(routeToFlag("/settings")).toBeNull()
  })

  it("returns dashboard for root", () => {
    expect(routeToFlag("/")).toBe("dashboard")
  })

  it("maps /recap to recap flag", () => {
    expect(routeToFlag("/recap")).toBe("recap")
  })

  it("maps /time to time flag", () => {
    expect(routeToFlag("/time")).toBe("time")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd apps/ops && pnpm vitest run lib/features.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

```ts
// apps/ops/lib/features.ts
export const features = {
  dashboard: true,
  today: true,
  projects: true,
  clients: true,
  time: true,
  recap: true,
  todos: true,
  chat: true,
  packages: true,
} as const satisfies Record<string, boolean>

export type FeatureFlag = keyof typeof features

export function isEnabled(flag: FeatureFlag): boolean {
  return features[flag]
}

const routeMap: Record<string, FeatureFlag> = {
  "/": "dashboard",
  "/today": "today",
  "/projects": "projects",
  "/clients": "clients",
  "/time": "time",
  "/recap": "recap",
  "/todos": "todos",
  "/chat": "chat",
  "/packages": "packages",
}

export function routeToFlag(pathname: string): FeatureFlag | null {
  if (routeMap[pathname]) return routeMap[pathname]
  // Match nested routes: /clients/123 → "clients"
  for (const [route, flag] of Object.entries(routeMap)) {
    if (route !== "/" && pathname.startsWith(`${route}/`)) return flag
  }
  return null
}
```

**Step 4: Run test to verify it passes**

Run: `cd apps/ops && pnpm vitest run lib/features.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/ops/lib/features.ts apps/ops/lib/features.test.ts
git commit -m "feat(ops): add feature flags config with route mapping"
```

---

### Task 2: Create `<FeatureGate>` component

**Files:**
- Create: `apps/ops/components/feature-gate.tsx`

**Step 1: Write the component**

```tsx
// apps/ops/components/feature-gate.tsx
import type { ReactNode } from "react"
import { type FeatureFlag, isEnabled } from "@/lib/features"

export function FeatureGate({
  flag,
  children,
}: {
  flag: FeatureFlag
  children: ReactNode
}) {
  if (!isEnabled(flag)) return null
  return <>{children}</>
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/feature-gate.tsx
git commit -m "feat(ops): add FeatureGate component"
```

---

### Task 3: Filter navigation by feature flags

**Files:**
- Modify: `apps/ops/components/ops-frame.tsx:1-46` (imports + navItems + type)

**Step 1: Add flag field to nav items and filter**

In `apps/ops/components/ops-frame.tsx`:

1. Add import at top:
```ts
import { type FeatureFlag, isEnabled } from "@/lib/features"
```

2. Add `flag` field to each nav item:
```ts
const navItems: Array<{
  title: string
  url: string
  icon: React.ComponentType
  flag?: FeatureFlag
  items?: Array<{ title: string; url: string; flag?: FeatureFlag }>
}> = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, flag: "dashboard" },
  { title: "Aujourd'hui", url: "/today", icon: Sun, flag: "today" },
  { title: "Projets", url: "/projects", icon: FolderOpen, flag: "projects" },
  { title: "Clients", url: "/clients", icon: Users, flag: "clients" },
  {
    title: "Suivi de temps",
    url: "/time",
    icon: Clock,
    flag: "time",
    items: [{ title: "Récapitulatif", url: "/recap", flag: "recap" }],
  },
  { title: "Todos", url: "/todos", icon: CheckSquare, flag: "todos" },
  { title: "Chat", url: "/chat", icon: MessageSquare, flag: "chat" },
  { title: "Packages", url: "/packages", icon: Package, flag: "packages" },
]
```

3. In `OpsSidebar`, filter before rendering (line 79):
```tsx
{navItems
  .filter((item) => !item.flag || isEnabled(item.flag))
  .map((item) => {
    // Also filter sub-items
    const filteredItems = item.items?.filter((sub) => !sub.flag || isEnabled(sub.flag))
    const itemWithFilteredSubs = filteredItems?.length
      ? { ...item, items: filteredItems }
      : { ...item, items: undefined }
    // ... rest of existing render logic using itemWithFilteredSubs
```

**Step 2: Verify manually**

Run: `pnpm dev:ops`
Set one flag to `false` in `lib/features.ts`, confirm it disappears from sidebar.

**Step 3: Commit**

```bash
git add apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): filter sidebar navigation by feature flags"
```

---

### Task 4: Add route guard

**Files:**
- Create: `apps/ops/components/route-guard.tsx`
- Modify: `apps/ops/app/(main)/layout.tsx`

**Step 1: Create RouteGuard component**

```tsx
// apps/ops/components/route-guard.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { isEnabled, routeToFlag } from "@/lib/features"

export function RouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const flag = routeToFlag(pathname)
    if (flag && !isEnabled(flag)) {
      router.replace("/")
    }
  }, [pathname, router])

  const flag = routeToFlag(pathname)
  if (flag && !isEnabled(flag)) return null

  return <>{children}</>
}
```

**Step 2: Wire into layout**

In `apps/ops/app/(main)/layout.tsx`, wrap children:

```tsx
import { OpsFrame } from "@/components/ops-frame"
import { RouteGuard } from "@/components/route-guard"
import { AuthGuard } from "./auth-guard"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OpsFrame>
        <RouteGuard>{children}</RouteGuard>
      </OpsFrame>
    </AuthGuard>
  )
}
```

**Step 3: Verify manually**

Run: `pnpm dev:ops`
Set `chat: false` in `lib/features.ts`, navigate to `/chat` directly → should redirect to `/`.

**Step 4: Commit**

```bash
git add apps/ops/components/route-guard.tsx apps/ops/app/(main)/layout.tsx
git commit -m "feat(ops): add route guard for disabled feature flags"
```

---

### Task 5: Final verification

**Step 1: Run all ops tests**

Run: `cd apps/ops && pnpm vitest run`
Expected: All pass

**Step 2: Type check**

Run: `cd apps/ops && pnpm tsc --noEmit`
Expected: No errors (or only pre-existing Convex errors)

**Step 3: Test the full flow**

1. Set `packages: false` in `lib/features.ts`
2. `pnpm dev:ops`
3. Verify: "Packages" gone from sidebar
4. Navigate to `/packages` → redirects to `/`
5. Reset flag to `true`

**Step 4: Final commit**

Only if any cleanup was needed.
