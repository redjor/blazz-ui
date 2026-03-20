# Docs Next.js Migration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate `apps/docs` from TanStack Start + Nitro to Next.js 16 with full static export (`output: "export"`).

**Architecture:** New `apps/docs-next` app using Next.js App Router. Landing page at `/`, documentation under `/docs/...`. All pages are static (SSG). Code highlighting moves from TanStack ServerFn to a build-time utility called at module scope. Components, data, config, and styles are copied from the existing app with minimal changes.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, next-themes, shiki, @blazz/ui, @blazz/pro

**Design doc:** `docs/plans/2026-03-20-docs-nextjs-migration-design.md`

---

## Key Migration Patterns

### Route migration pattern

TanStack Start routes use `createFileRoute` + `loader` + `useLoaderData`. In Next.js App Router with static export, each route becomes a `page.tsx` in the corresponding directory. The component function body stays identical — only the framework boilerplate changes.

**Before (TanStack):**
```tsx
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { highlightCode } from "~/lib/highlight-code"

const examples = [...]

export const Route = createFileRoute("/_docs/docs/components/ui/button")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map(async (ex) => ({
        key: ex.key,
        html: await highlightCode({ data: { code: ex.code } }),
      }))
    )
    return { highlighted }
  },
  component: ButtonPage,
})

function ButtonPage() {
  const { highlighted } = useLoaderData({ from: "/_docs/docs/components/ui/button" })
  // ... JSX
}
```

**After (Next.js):**
```tsx
import { highlight } from "~/lib/shiki"

const examples = [...]

// Highlight at module scope — runs at build time in static export
const highlightedPromise = Promise.all(
  examples.map(async (ex) => ({
    key: ex.key,
    html: await highlight(ex.code),
  }))
)

export default async function ButtonPage() {
  const highlighted = await highlightedPromise
  // ... same JSX
}
```

### Import alias change

- TanStack: `~/` → `./src/`
- Next.js: `~/` → `./src/` (keep same alias via tsconfig paths, no `@/` to avoid conflict with workspace `@blazz/*`)

### Theme system change

- TanStack: custom `setThemeCookie` ServerFn + inline script in `__root.tsx`
- Next.js: `next-themes` ThemeProvider (same as `apps/ops`), no server function needed

### Link component change

- TanStack: `import { Link } from "@tanstack/react-router"` + `<Link to="...">`
- Next.js: `import Link from "next/link"` + `<Link href="...">`
- Search-and-replace: `to=` → `href=` on Link components, `<Link to=` → `<Link href=`

### useLocation change

- TanStack: `import { useLocation } from "@tanstack/react-router"`
- Next.js: `import { usePathname } from "next/navigation"`
- `useLocation().pathname` → `usePathname()`

---

## Task 1: Scaffold Next.js app

**Files:**
- Create: `apps/docs-next/package.json`
- Create: `apps/docs-next/next.config.mjs`
- Create: `apps/docs-next/tsconfig.json`
- Create: `apps/docs-next/postcss.config.mjs`

**Step 1: Create package.json**

```json
{
  "name": "docs-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 3101",
    "build": "tsx scripts/generate-llms.ts && next build",
    "start": "next start",
    "lint": "biome check .",
    "type-check": "tsc --noEmit",
    "generate:llms": "tsx scripts/generate-llms.ts"
  },
  "dependencies": {
    "@blazz/pro": "workspace:*",
    "@blazz/ui": "workspace:*",
    "@hookform/resolvers": "^5.2.2",
    "class-variance-authority": "^0.7.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.562.0",
    "motion": "^12.36.0",
    "next": "16.1.1",
    "next-themes": "^0.4.6",
    "react": "19.2.3",
    "react-day-picker": "^9.14.0",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.71.1",
    "shiki": "^3.22.0",
    "sonner": "^2.0.7",
    "zod": "^4.3.5"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "tsx": "^4.21.0",
    "typescript": "^5"
  }
}
```

**Step 2: Create next.config.mjs**

```js
/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@blazz/ui", "@blazz/pro"],
}

export default config
```

**Step 3: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "plugins": [{ "name": "next" }],
    "paths": {
      "~/*": ["./src/*"],
      "@blazz/ui": ["../../packages/ui/src"],
      "@blazz/ui/*": ["../../packages/ui/src/*"],
      "@blazz/pro": ["../../packages/pro/src"],
      "@blazz/pro/*": ["../../packages/pro/src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "next-env.d.ts", "scripts/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 4: Create postcss.config.mjs**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

**Step 5: Install dependencies**

Run: `cd apps/docs-next && pnpm install`

**Step 6: Verify scaffold**

Run: `cd apps/docs-next && pnpm dev`
Expected: Next.js starts on port 3101 (will 404 — no pages yet)

**Step 7: Commit**

```bash
git add apps/docs-next/package.json apps/docs-next/next.config.mjs apps/docs-next/tsconfig.json apps/docs-next/postcss.config.mjs pnpm-lock.yaml
git commit -m "feat(docs-next): scaffold Next.js 16 app with static export"
```

---

## Task 2: Copy shared assets and source files

**Files:**
- Copy: `apps/docs/src/styles/` → `apps/docs-next/src/styles/`
- Copy: `apps/docs/src/config/` → `apps/docs-next/src/config/`
- Copy: `apps/docs/src/data/` → `apps/docs-next/src/data/`
- Copy: `apps/docs/src/components/docs/` → `apps/docs-next/src/components/docs/`
- Copy: `apps/docs/src/components/landing/` → `apps/docs-next/src/components/landing/`
- Copy: `apps/docs/src/components/theme-toggle.tsx` → `apps/docs-next/src/components/theme-toggle.tsx`
- Copy: `apps/docs/src/lib/shiki.ts` → `apps/docs-next/src/lib/shiki.ts`
- Copy: `apps/docs/scripts/` → `apps/docs-next/scripts/`
- Copy: `apps/docs/public/` → `apps/docs-next/public/`

**Step 1: Copy directories**

Run:
```bash
mkdir -p apps/docs-next/src/{styles,config,data,components,lib,scripts}
cp -r apps/docs/src/styles/ apps/docs-next/src/styles/
cp -r apps/docs/src/config/ apps/docs-next/src/config/
cp -r apps/docs/src/data/ apps/docs-next/src/data/
cp -r apps/docs/src/components/docs apps/docs-next/src/components/docs
cp -r apps/docs/src/components/landing apps/docs-next/src/components/landing
cp -r apps/docs/src/components/thumbnails apps/docs-next/src/components/thumbnails
cp apps/docs/src/components/theme-toggle.tsx apps/docs-next/src/components/theme-toggle.tsx
cp apps/docs/src/lib/shiki.ts apps/docs-next/src/lib/shiki.ts
cp -r apps/docs/scripts/ apps/docs-next/scripts/
cp -r apps/docs/public/ apps/docs-next/public/
```

**Step 2: Remove `highlight-code.ts` (TanStack ServerFn — not needed)**

The old `apps/docs/src/lib/highlight-code.ts` uses `createServerFn` from TanStack. We don't copy it. Instead, pages will import `highlight` directly from `~/lib/shiki`.

**Step 3: Fix ThemeToggle — remove ServerFn dependency**

Edit `apps/docs-next/src/components/theme-toggle.tsx`:

```tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex items-center justify-center rounded-md p-2 text-fg-muted hover:text-fg hover:bg-surface-3 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="size-4 hidden dark:block" />
      <Moon className="size-4 block dark:hidden" />
    </button>
  )
}
```

**Step 4: Copy any remaining lib files needed by components**

Run: check what other files exist in `apps/docs/src/lib/` and copy relevant ones (skip `theme.ts` and `highlight-code.ts` — those are TanStack-specific).

```bash
ls apps/docs/src/lib/
# Copy everything except highlight-code.ts and theme.ts
```

**Step 5: Commit**

```bash
git add apps/docs-next/src/ apps/docs-next/scripts/ apps/docs-next/public/
git commit -m "feat(docs-next): copy shared components, data, config, styles, and assets"
```

---

## Task 3: Root layout + landing page

**Files:**
- Create: `apps/docs-next/src/app/layout.tsx`
- Create: `apps/docs-next/src/app/page.tsx`

**Step 1: Create root layout**

Create `apps/docs-next/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { BlazzProvider } from "@blazz/pro"
import "~/styles/globals.css"

const BLAZZ_DEV_LICENSE = "BLAZZ-PRO-BLAZZDEV-20271231-569bc77c0666d084"

export const metadata: Metadata = {
  title: "Blazz UI",
  description: "Pro UI Kit — AI-native components for data-heavy apps",
  icons: { icon: "/favicon.png" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="font-['Inter',sans-serif] antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <BlazzProvider licenseKey={BLAZZ_DEV_LICENSE}>
            {children}
          </BlazzProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 2: Create landing page**

Create `apps/docs-next/src/app/page.tsx`:

```tsx
import { Faq } from "~/components/landing/faq"
import { FeaturesGrid } from "~/components/landing/features-grid"
import { Footer } from "~/components/landing/footer"
import { Hero } from "~/components/landing/hero"
import { Navbar } from "~/components/landing/navbar"
import { Pricing } from "~/components/landing/pricing"
import { RoiCalculator } from "~/components/landing/roi-calculator"
import { StatsBar } from "~/components/landing/stats-bar"

export default function Home() {
  return (
    <div className="min-h-screen bg-app">
      <Navbar />
      <Hero />
      <StatsBar />
      <FeaturesGrid />
      <RoiCalculator />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  )
}
```

**Step 3: Fix any `Link` imports in landing components**

Search landing components for `@tanstack/react-router` imports. Replace:
- `import { Link } from "@tanstack/react-router"` → `import Link from "next/link"`
- `<Link to=` → `<Link href=`

Run: `grep -r "@tanstack" apps/docs-next/src/components/landing/`

Fix each file found.

**Step 4: Fix any `Link` imports in docs components**

Run: `grep -r "@tanstack" apps/docs-next/src/components/docs/`

Fix each file found (same pattern as step 3).

**Step 5: Fix any `Link` imports in config files**

Run: `grep -r "@tanstack" apps/docs-next/src/config/`

Fix if needed.

**Step 6: Verify dev server**

Run: `cd apps/docs-next && pnpm dev`
Expected: Landing page renders at `http://localhost:3101/`

**Step 7: Commit**

```bash
git add apps/docs-next/src/app/
git commit -m "feat(docs-next): add root layout with ThemeProvider and landing page"
```

---

## Task 4: Docs layout

**Files:**
- Create: `apps/docs-next/src/app/docs/layout.tsx`

**Step 1: Create docs layout**

This is adapted from `apps/docs/src/routes/_docs.tsx`. Key changes:
- `useLocation` → `usePathname` from `next/navigation`
- `Link` from `next/link`
- `Outlet` → `{children}`
- `import.meta.env.VITE_EXAMPLES_URL` → `process.env.NEXT_PUBLIC_EXAMPLES_URL ?? ""`

Create `apps/docs-next/src/app/docs/layout.tsx`:

```tsx
"use client"

import { CommandPalette } from "@blazz/ui/components/patterns/command-palette/command-palette"
import { NavbarTab, NavbarTabs } from "@blazz/ui/components/patterns/navbar"
import { Kbd, KbdGroup } from "@blazz/ui/components/ui/kbd"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { Toaster } from "@blazz/ui/components/ui/toast"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search } from "lucide-react"
import { type ReactNode, useEffect, useState } from "react"
import { DocsMobileSheet } from "~/components/docs/docs-mobile-sheet"
import { DocsSidebar } from "~/components/docs/docs-sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { getSectionForPathname, navigationConfig, sectionTabs } from "~/config/navigation"

function useSyncDocTitle() {
  const pathname = usePathname()
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const h1 = document.querySelector("h1")
      document.title = h1?.textContent ? `${h1.textContent} — Blazz UI` : "Blazz UI"
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const activeSectionId = getSectionForPathname(pathname)
  useSyncDocTitle()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-app">
      {/* Topbar */}
      <header className="h-14 shrink-0 bg-app z-50">
        <div className="flex h-full items-center px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-fg-muted hover:text-fg hover:bg-surface-3 transition-colors lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="size-5" />
            </button>
            <Link href="/" className="hidden lg:flex items-center">
              <img src="/logo_blazz_white.svg" alt="Blazz UI" className="hidden h-6 dark:block" />
              <img src="/logo_blazz_black.svg" alt="Blazz UI" className="block h-6 dark:hidden" />
            </Link>
          </div>

          <NavbarTabs value={activeSectionId} className="hidden lg:flex ml-6">
            {sectionTabs.map((tab) => (
              <NavbarTab key={tab.id} value={tab.id}>
                <Link href={tab.defaultUrl}>{tab.label}</Link>
              </NavbarTab>
            ))}
          </NavbarTabs>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-md p-2 text-fg-muted hover:text-fg hover:bg-surface-3 transition-colors"
            >
              <Search className="size-4" />
              <KbdGroup className="hidden sm:inline-flex">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Body */}
      <SidebarProvider style={{ minHeight: 0 }} className="flex-1 gap-2 px-2 pb-2">
        <DocsSidebar sectionId={activeSectionId} />
        <main className="flex-1 overflow-y-auto min-w-0 bg-surface rounded-lg border border-container">
          {children}
        </main>
        <DocsMobileSheet
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          sectionId={activeSectionId}
        />
      </SidebarProvider>

      <CommandPalette
        navigation={navigationConfig}
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
      <Toaster />
    </div>
  )
}
```

**Step 2: Fix DocsSidebar if it uses TanStack imports**

Run: `grep -r "@tanstack\|useLocation" apps/docs-next/src/components/docs/docs-sidebar.tsx`

Replace `Link` and `useLocation` imports as per the migration pattern.

**Step 3: Fix DocsMobileSheet if it uses TanStack imports**

Run: `grep -r "@tanstack\|useLocation" apps/docs-next/src/components/docs/docs-mobile-sheet.tsx`

Fix same pattern.

**Step 4: Fix any other docs components using TanStack Router**

Run: `grep -rn "@tanstack" apps/docs-next/src/`

Fix ALL remaining TanStack imports. The only TanStack-specific patterns to replace:
- `import { Link } from "@tanstack/react-router"` → `import Link from "next/link"`
- `<Link to=` → `<Link href=`
- `import { useLocation } from "@tanstack/react-router"` → `import { usePathname } from "next/navigation"`
- `useLocation().pathname` or `const { pathname } = useLocation()` → `usePathname()`
- `import { useLoaderData } from "@tanstack/react-router"` → remove (handled differently)
- `import { createFileRoute } from "@tanstack/react-router"` → remove (not needed)

**Step 5: Create docs index page**

Create `apps/docs-next/src/app/docs/page.tsx` — copy content from `apps/docs/src/routes/_docs/docs/index.tsx`, removing TanStack boilerplate.

**Step 6: Verify**

Run: `cd apps/docs-next && pnpm dev`
Expected: `/docs` renders with sidebar, topbar, and index content

**Step 7: Commit**

```bash
git add apps/docs-next/src/app/docs/ apps/docs-next/src/components/
git commit -m "feat(docs-next): add docs layout with sidebar and command palette"
```

---

## Task 5: Migrate first batch of UI component pages (5-10 pages)

**Files:**
- Create: `apps/docs-next/src/app/docs/components/ui/button/page.tsx`
- Create: `apps/docs-next/src/app/docs/components/ui/input/page.tsx`
- Create: `apps/docs-next/src/app/docs/components/ui/dialog/page.tsx`
- Create: `apps/docs-next/src/app/docs/components/ui/select/page.tsx`
- Create: `apps/docs-next/src/app/docs/components/ui/badge/page.tsx`
- Create: `apps/docs-next/src/app/docs/components/ui/index/page.tsx` (if category index exists)
- Create: `apps/docs-next/src/app/docs/components/layout.tsx` (if shared layout needed)

**Step 1: Create the migration helper**

To avoid repeating highlight logic in every page, create a shared utility.

Create `apps/docs-next/src/lib/highlight-examples.ts`:

```tsx
import { highlight } from "~/lib/shiki"

export type Example = { key: string; code: string }

export async function highlightExamples(examples: readonly Example[] | Example[]) {
  return Promise.all(
    examples.map(async (ex) => ({
      key: ex.key,
      html: await highlight(ex.code),
    }))
  )
}
```

**Step 2: Migrate button page**

Copy `apps/docs/src/routes/_docs/docs/components/ui/button.tsx` to `apps/docs-next/src/app/docs/components/ui/button/page.tsx`.

Apply the migration pattern:
1. Remove `createFileRoute`, `useLoaderData` imports
2. Remove the `Route = createFileRoute(...)({...})` block
3. Make the component the default export and async
4. Replace loader with top-level `highlightExamples()` call
5. Await the promise inside the async component

```tsx
import { Button } from "@blazz/ui/components/ui/button"
import { Spinner } from "@blazz/ui/components/ui/spinner"
import { ChevronRight, Mail, Plus } from "lucide-react"
import { DocDoDont } from "~/components/docs/doc-do-dont"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
  // ... same examples array as before
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [...]
const buttonProps: DocProp[] = [...]

export default async function ButtonPage() {
  const highlighted = await highlightedPromise
  const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

  return (
    <DocPage title="Button" subtitle="..." toc={toc}>
      {/* ... same JSX as before */}
    </DocPage>
  )
}
```

**Step 3: Migrate 4-9 more pages using the same pattern**

For each page:
1. Copy the source file
2. Remove TanStack boilerplate
3. Add `highlightExamples` import
4. Make component async + default export
5. Replace `useLoaderData` with awaited promise

**Step 4: Handle pages without loaders (index pages)**

Index pages like `components/ui/index.tsx` don't have loaders — they just render grids of cards. These are simpler:
1. Copy JSX
2. Remove `createFileRoute`
3. Export default

**Step 5: Verify**

Run: `cd apps/docs-next && pnpm dev`
Navigate to: `http://localhost:3101/docs/components/ui/button`
Expected: Button doc page renders with syntax-highlighted code examples

**Step 6: Commit**

```bash
git add apps/docs-next/src/app/docs/components/ apps/docs-next/src/lib/highlight-examples.ts
git commit -m "feat(docs-next): migrate first batch of UI component pages"
```

---

## Task 6: Bulk migrate remaining UI component pages (~50 pages)

**Step 1: List all remaining UI component pages**

Run: `ls apps/docs/src/routes/_docs/docs/components/ui/`

For each file not yet migrated, apply the same pattern from Task 5.

**Step 2: Migrate all pages**

Use parallel agents — each agent migrates 10-15 pages. The pattern is mechanical:
1. Copy file to `apps/docs-next/src/app/docs/components/ui/{name}/page.tsx`
2. Remove TanStack imports and boilerplate
3. Replace loader pattern with `highlightExamples`
4. Make component default export + async (if it has examples)
5. Fix any `Link` imports (`to=` → `href=`)

**Step 3: Migrate layout and patterns subcategories**

Same pattern for:
- `apps/docs/src/routes/_docs/docs/components/layout/*.tsx` → `apps/docs-next/src/app/docs/components/layout/*/page.tsx`
- `apps/docs/src/routes/_docs/docs/components/patterns/*.tsx` → `apps/docs-next/src/app/docs/components/patterns/*/page.tsx`

**Step 4: Migrate category index pages**

- `components/index.tsx`
- `components/ui/index.tsx` (if exists)
- Category pages (`actions.tsx`, `forms.tsx`, `feedback.tsx`, etc.)

These are flat category pages — check if they map to `/docs/components/actions` etc. and create corresponding directories.

**Step 5: Verify all pages**

Run: `cd apps/docs-next && pnpm build`
Expected: All pages generate as static HTML without errors

**Step 6: Commit**

```bash
git add apps/docs-next/src/app/docs/components/
git commit -m "feat(docs-next): migrate all UI component doc pages"
```

---

## Task 7: Migrate blocks pages (~37 pages)

**Step 1: Migrate blocks index**

Copy `apps/docs/src/routes/_docs/docs/blocks/index.tsx` → `apps/docs-next/src/app/docs/blocks/page.tsx`

**Step 2: Migrate all block pages**

Same pattern. Block pages tend to be more complex (more demo components, mock data), but the migration pattern is identical:
- Remove TanStack boilerplate
- Replace loader with `highlightExamples`
- Fix Link/useLocation imports

For each file in `apps/docs/src/routes/_docs/docs/blocks/`:
→ `apps/docs-next/src/app/docs/blocks/{name}/page.tsx`

Special case: `data-table/` may have nested routes — check structure and create corresponding directories.

**Step 3: Verify**

Run: `cd apps/docs-next && pnpm dev`
Navigate to: `http://localhost:3101/docs/blocks`
Expected: Blocks index + individual block pages render correctly

**Step 4: Commit**

```bash
git add apps/docs-next/src/app/docs/blocks/
git commit -m "feat(docs-next): migrate all block doc pages"
```

---

## Task 8: Migrate AI pages (~18 pages)

**Step 1: Migrate AI index**

Copy `apps/docs/src/routes/_docs/docs/ai/index.tsx` → `apps/docs-next/src/app/docs/ai/page.tsx`

**Step 2: Migrate all AI component pages**

Same pattern as Tasks 6-7.

**Step 3: Verify**

Run: `cd apps/docs-next && pnpm dev`
Navigate to: `http://localhost:3101/docs/ai`

**Step 4: Commit**

```bash
git add apps/docs-next/src/app/docs/ai/
git commit -m "feat(docs-next): migrate all AI doc pages"
```

---

## Task 9: Migrate remaining pages (guide, utils, mcp, license)

**Step 1: Migrate guide pages**

```
apps/docs/src/routes/_docs/docs/guide/ → apps/docs-next/src/app/docs/guide/
```

**Step 2: Migrate utils pages**

```
apps/docs/src/routes/_docs/docs/utils/ → apps/docs-next/src/app/docs/utils/
```

**Step 3: Migrate standalone pages**

- `mcp.tsx` → `apps/docs-next/src/app/docs/mcp/page.tsx`
- `sandbox.tsx` → SKIP (goes to separate app later)
- `license/` → `apps/docs-next/src/app/license/page.tsx`

**Step 4: Verify**

Run: `cd apps/docs-next && pnpm build`
Expected: Full static export succeeds

**Step 5: Commit**

```bash
git add apps/docs-next/src/app/docs/guide/ apps/docs-next/src/app/docs/utils/ apps/docs-next/src/app/docs/mcp/ apps/docs-next/src/app/license/
git commit -m "feat(docs-next): migrate guide, utils, mcp, and license pages"
```

---

## Task 10: Add 404 page + final polish

**Files:**
- Create: `apps/docs-next/src/app/not-found.tsx`

**Step 1: Create 404 page**

Create `apps/docs-next/src/app/not-found.tsx`:

```tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-fg-muted">Page introuvable</p>
      <Link href="/" className="text-sm text-brand hover:underline">
        Retour à l'accueil
      </Link>
    </div>
  )
}
```

**Step 2: Remove any remaining `import.meta.env` references**

Run: `grep -rn "import.meta.env" apps/docs-next/src/`

Replace with `process.env.NEXT_PUBLIC_*` equivalents.

**Step 3: Verify full build**

Run: `cd apps/docs-next && pnpm build`
Expected: Static export completes. Check `out/` directory has all HTML files.

**Step 4: Verify page count**

Run: `find apps/docs-next/out -name "*.html" | wc -l`
Expected: ~211 HTML files (matching original route count)

**Step 5: Commit**

```bash
git add apps/docs-next/
git commit -m "feat(docs-next): add 404 page and finalize migration"
```

---

## Task 11: Swap apps and clean up

**Step 1: Remove old docs app**

Run: `rm -rf apps/docs`

**Step 2: Rename new app**

Run: `mv apps/docs-next apps/docs`

**Step 3: Update package.json name**

Edit `apps/docs/package.json`: change `"name": "docs-next"` → `"name": "docs"`

**Step 4: Update dev script port back to 3100**

Edit `apps/docs/package.json`: change port from 3101 to 3100:
```json
"dev": "next dev --turbopack -p 3100"
```

**Step 5: Update turbo.json if needed**

Check that `turbo.json` outputs include `.next/**` (already present).

**Step 6: Update pnpm-workspace.yaml if needed**

Verify `apps/*` pattern still catches the renamed app (it should — same directory name).

**Step 7: Full build test**

Run: `pnpm build`
Expected: Entire monorepo builds successfully

**Step 8: Commit**

```bash
git add -A
git commit -m "feat(docs): replace TanStack Start with Next.js 16 static export"
```

---

## Task 12: Update monorepo scripts and CI

**Step 1: Verify `pnpm dev:docs` script**

Check root `package.json` for `dev:docs` script. Update if it references old config.

**Step 2: Clean up old TanStack artifacts**

Remove any `.tanstack/` or `.output/` directories if they were committed.

**Step 3: Final verification**

Run:
```bash
pnpm dev:docs   # Should start on port 3100
pnpm build      # Full monorepo build
pnpm lint       # Lint passes
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore(docs): clean up TanStack artifacts and update monorepo scripts"
```
