# Docs App Migration: Next.js → TanStack Start — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the `apps/docs/` documentation app from Next.js 16 to TanStack Start, preserving all 131+ component doc pages, landing page, and thumbnail routes.

**Architecture:** TanStack Start with Vite, file-based routing via TanStack Router, server functions for Shiki syntax highlighting, cookie-based theming, and static prerendering via `crawlLinks`. The UI library `@blazz/ui` remains untouched.

**Tech Stack:** TanStack Start, TanStack Router, Vite, React 19, Tailwind CSS v4 (Vite plugin), Shiki (server functions), cookie-based theming

**Design doc:** `docs/plans/2026-02-26-docs-tanstack-start-migration-design.md`

---

## Task 1: Update dependencies in package.json

**Files:**
- Modify: `apps/docs/package.json`

**Step 1: Update package.json**

Replace the dependencies to swap Next.js for TanStack Start:

```json
{
  "name": "docs",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vinxi dev --port 3100",
    "build": "vinxi build",
    "start": "vinxi start",
    "lint": "biome check .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@blazz/ui": "workspace:*",
    "@tanstack/react-router": "^1.114.3",
    "@tanstack/react-start": "^1.114.3",
    "ai": "^6.0.97",
    "class-variance-authority": "^0.7.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.562.0",
    "motion": "^12.29.0",
    "react": "19.2.3",
    "react-day-picker": "^9.13.2",
    "react-dom": "19.2.3",
    "shiki": "^3.22.0",
    "sonner": "^2.0.7",
    "streamdown": "^2.3.0",
    "@streamdown/cjk": "^1.0.2",
    "@streamdown/code": "^1.0.3",
    "@streamdown/math": "^1.0.2",
    "@streamdown/mermaid": "^1.0.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4",
    "@tanstack/react-router-devtools": "^1.114.3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4",
    "playwright": "^1.52.0",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vite": "^6",
    "vite-tsconfig-paths": "^4"
  }
}
```

**Removed:** `next`, `next-themes`, `postcss`, `@tailwindcss/postcss`
**Added:** `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-router-devtools`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite`, `vite-tsconfig-paths`

**Step 2: Install dependencies**

Run: `cd apps/docs && pnpm install`
Expected: Clean install, no errors

**Step 3: Commit**

```bash
git add apps/docs/package.json pnpm-lock.yaml
git commit -m "chore(docs): swap next.js deps for tanstack start"
```

---

## Task 2: Create Vite config and entry points

**Files:**
- Create: `apps/docs/vite.config.ts`
- Create: `apps/docs/src/entry-client.tsx`
- Create: `apps/docs/src/entry-server.tsx`
- Create: `apps/docs/src/router.tsx`
- Modify: `apps/docs/tsconfig.json`
- Delete: `apps/docs/next.config.mjs`
- Delete: `apps/docs/postcss.config.mjs`

**Step 1: Create `vite.config.ts`**

```ts
// apps/docs/vite.config.ts
import { defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  server: { port: 3100 },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      prerender: {
        routes: ["/"],
        crawlLinks: true,
      },
    }),
    viteReact(),
  ],
})
```

**Step 2: Create `src/entry-client.tsx`**

```tsx
// apps/docs/src/entry-client.tsx
import { StartClient } from "@tanstack/react-start/client"
import { hydrateRoot } from "react-dom/client"

hydrateRoot(document, <StartClient />)
```

**Step 3: Create `src/entry-server.tsx`**

```tsx
// apps/docs/src/entry-server.tsx
import { getRouterManifest } from "@tanstack/react-start/router-manifest"
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server"
import { getRouter } from "./router"

export default createStartHandler({
  createRouter: getRouter,
  getRouterManifest,
})(defaultStreamHandler)
```

**Step 4: Create `src/router.tsx`**

```tsx
// apps/docs/src/router.tsx
import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })
  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

**Step 5: Update `tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "paths": {
      "~/*": ["./src/*"],
      "@blazz/ui": ["../../packages/ui/src"],
      "@blazz/ui/*": ["../../packages/ui/src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "vite.config.ts"],
  "exclude": ["node_modules"]
}
```

**Note:** Path alias changes from `@/*` to `~/*` (TanStack Start convention). This means all `@/` imports in migrated files must become `~/`.

**Step 6: Delete Next.js config files**

Delete: `apps/docs/next.config.mjs`, `apps/docs/postcss.config.mjs`

**Step 7: Commit**

```bash
git add apps/docs/vite.config.ts apps/docs/src/entry-client.tsx apps/docs/src/entry-server.tsx apps/docs/src/router.tsx apps/docs/tsconfig.json
git rm apps/docs/next.config.mjs apps/docs/postcss.config.mjs
git commit -m "feat(docs): add vite config and tanstack start entry points"
```

---

## Task 3: Create root route and move styles

**Files:**
- Create: `apps/docs/src/routes/__root.tsx`
- Move: `apps/docs/globals.css` → `apps/docs/src/styles/globals.css`
- Delete: `apps/docs/app/layout.tsx` (after migration)

**Step 1: Move and adapt `globals.css`**

Move `apps/docs/globals.css` to `apps/docs/src/styles/globals.css`.

Update the `@source` directives at the top for new paths:

```css
@import "tailwindcss";

@source "../**/*.{ts,tsx}";
@source "../../../packages/ui/src/**/*.{ts,tsx}";
@source "../../../../node_modules/streamdown/**/*.{js,mjs}";

/* ... rest of the file stays the same ... */
```

The `@source` paths need to be relative to the CSS file's new location at `src/styles/`.

**Step 2: Create `__root.tsx`**

```tsx
// apps/docs/src/routes/__root.tsx
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import type { ReactNode } from "react"
import appCss from "~/styles/globals.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Blazz UI" },
      { name: "description", content: "Pro UI Kit — AI-native components for data-heavy apps" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png" },
    ],
    scripts: [
      // Inline script to apply theme from cookie before paint (anti-flash)
      {
        children: `(function(){try{var m=document.cookie.match(/theme=(\\w+)/);var t=m?m[1]:'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

**Note:** The Inter font from `next/font/google` is replaced. Either add a `<link>` to Google Fonts in `head.links`, or use `@font-face` in CSS, or drop it (system font stack). Decision: add Google Fonts link for now:

```tsx
links: [
  { rel: "stylesheet", href: appCss },
  { rel: "icon", href: "/favicon.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
],
```

And add `font-family: 'Inter', sans-serif` to the `body` in CSS or as a class.

**Step 3: Verify the app starts**

Run: `cd apps/docs && pnpm dev`
Expected: Vite dev server starts on port 3100. The root route should render an empty page with correct head tags.

**Step 4: Commit**

```bash
git add apps/docs/src/routes/__root.tsx apps/docs/src/styles/globals.css
git rm apps/docs/globals.css
git commit -m "feat(docs): add root route with theme anti-flash and move styles"
```

---

## Task 4: Create theme system (cookie-based)

**Files:**
- Create: `apps/docs/src/lib/theme.ts`
- Create: `apps/docs/src/components/theme-toggle.tsx`

**Step 1: Create theme utilities and server function**

```ts
// apps/docs/src/lib/theme.ts
import { createServerFn } from "@tanstack/react-start"

export type Theme = "light" | "dark"

export function getThemeFromCookie(cookieHeader: string | undefined): Theme {
  const match = cookieHeader?.match(/theme=(\w+)/)
  return match?.[1] === "light" ? "light" : "dark"
}

export const setThemeCookie = createServerFn({ method: "POST" })
  .inputValidator((d: Theme) => d)
  .handler(async ({ data }) => {
    const { setHeader } = await import("@tanstack/react-start/server")
    setHeader("Set-Cookie", `theme=${data}; Path=/; Max-Age=31536000; SameSite=Lax`)
  })
```

**Step 2: Create ThemeToggle component**

```tsx
// apps/docs/src/components/theme-toggle.tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { setThemeCookie, type Theme } from "~/lib/theme"

export function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark")
    const next: Theme = isDark ? "light" : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    setThemeCookie({ data: next })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-md p-2 text-fg-muted hover:text-fg hover:bg-raised transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="size-4 hidden dark:block" />
      <Moon className="size-4 block dark:hidden" />
    </button>
  )
}
```

**Note:** Check if `@blazz/ui` already exports a `ThemeToggle` or similar — if so, adapt that one to use the cookie approach instead of creating a new one. The current `components/layout/theme-toggle.tsx` in the docs app uses `next-themes` `useTheme()`, so it needs replacing.

**Step 3: Commit**

```bash
git add apps/docs/src/lib/theme.ts apps/docs/src/components/theme-toggle.tsx
git commit -m "feat(docs): add cookie-based theme system replacing next-themes"
```

---

## Task 5: Create Shiki server function

**Files:**
- Create: `apps/docs/src/lib/shiki.ts`
- Create: `apps/docs/src/lib/highlight.server.ts`

**Step 1: Move Shiki highlighter to `src/lib/shiki.ts`**

Copy from current `apps/docs/lib/shiki.ts`:

```ts
// apps/docs/src/lib/shiki.ts
import { createHighlighter, type Highlighter } from "shiki"

let highlighter: Highlighter | null = null

async function getHighlighter() {
  if (highlighter) return highlighter
  highlighter = await createHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["tsx", "css", "bash", "json"],
  })
  return highlighter
}

export async function highlight(code: string, lang: string = "tsx") {
  const h = await getHighlighter()
  return h.codeToHtml(code, {
    lang,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
  })
}
```

**Step 2: Create server function wrapper**

```ts
// apps/docs/src/lib/highlight.server.ts
import { createServerFn } from "@tanstack/react-start"
import { highlight } from "./shiki"

export const highlightCode = createServerFn({ method: "GET" })
  .inputValidator((d: { code: string; lang?: string }) => d)
  .handler(async ({ data }) => {
    return highlight(data.code, data.lang ?? "tsx")
  })
```

**Step 3: Commit**

```bash
git add apps/docs/src/lib/shiki.ts apps/docs/src/lib/highlight.server.ts
git commit -m "feat(docs): add shiki server function for syntax highlighting"
```

---

## Task 6: Migrate doc components to `src/components/`

**Files:**
- Create: `apps/docs/src/components/docs/doc-page.tsx` (copy, update imports)
- Create: `apps/docs/src/components/docs/doc-example.tsx` (rewrite — no longer async Server Component)
- Create: `apps/docs/src/components/docs/doc-example-client.tsx` (copy, update imports)
- Create: `apps/docs/src/components/docs/doc-section.tsx` (copy)
- Create: `apps/docs/src/components/docs/doc-toc.tsx` (copy)
- Create: `apps/docs/src/components/docs/doc-hero.tsx` (copy)
- Create: `apps/docs/src/components/docs/doc-props-table.tsx` (copy)
- Create: `apps/docs/src/components/docs/doc-do-dont.tsx` (copy)
- Create: `apps/docs/src/components/docs/doc-related.tsx` (copy, replace `next/link`)
- Create: `apps/docs/src/components/docs/doc-tokens.tsx` (copy)
- Create: `apps/docs/src/components/docs/component-card.tsx` (copy, replace `next/link`)
- Create: `apps/docs/src/components/docs/component-card-thumbnail.tsx` (copy, replace `next/image`)
- Create: `apps/docs/src/components/docs/components-sidebar.tsx` (copy, replace `next/link` + `next/navigation`)
- Create: `apps/docs/src/components/docs/index.ts` (copy barrel)

**Step 1: Copy all doc components**

Copy each file from `apps/docs/components/docs/` to `apps/docs/src/components/docs/`. For each file:

1. Replace `@/` imports with `~/`
2. Replace `next/link` → `@tanstack/react-router` `Link` component
3. Replace `next/navigation` `usePathname()` → `@tanstack/react-router` `useLocation()` (returns `{ pathname }`)
4. Replace `next/image` → `<img>` tag (no Next.js image optimization needed for a docs site)

**Key replacements:**

```tsx
// BEFORE (next/link)
import Link from "next/link"
<Link href="/docs/components/ui/button">Button</Link>

// AFTER (tanstack router)
import { Link } from "@tanstack/react-router"
<Link to="/docs/components/ui/button">Button</Link>
```

```tsx
// BEFORE (next/navigation)
import { usePathname } from "next/navigation"
const pathname = usePathname()

// AFTER (tanstack router)
import { useLocation } from "@tanstack/react-router"
const { pathname } = useLocation()
```

```tsx
// BEFORE (next/image)
import Image from "next/image"
<Image src="/logo.svg" alt="Logo" width={120} height={30} />

// AFTER (standard img)
<img src="/logo.svg" alt="Logo" width={120} height={30} />
```

**Step 2: Rewrite `doc-example.tsx`**

The current `DocExample` is an async Server Component that calls `highlight()`. In TanStack Start, highlighting happens in the route loader. `DocExample` becomes a simple re-export of `DocExampleClient`:

```tsx
// apps/docs/src/components/docs/doc-example.tsx
// In TanStack Start, highlighting is done in route loaders.
// DocExample is now just DocExampleClient with highlightedCode provided by the loader.
export { DocExampleClient as DocExample, DocExampleSync } from "./doc-example-client"
```

**Step 3: Verify components compile**

Run: `cd apps/docs && pnpm type-check`
Expected: No TypeScript errors in `src/components/docs/`

**Step 4: Commit**

```bash
git add apps/docs/src/components/docs/
git commit -m "feat(docs): migrate doc components with tanstack router links"
```

---

## Task 7: Migrate landing page components and route

**Files:**
- Copy: `apps/docs/components/landing/*` → `apps/docs/src/components/landing/*`
- Create: `apps/docs/src/routes/index.tsx`

**Step 1: Copy landing components**

Copy all files from `apps/docs/components/landing/` to `apps/docs/src/components/landing/`. For each:

1. Replace `@/` → `~/`
2. Replace `next/link` → `{ Link } from "@tanstack/react-router"` (href → to)
3. Replace `next/image` → `<img>`

Files to migrate: `navbar.tsx`, `hero.tsx`, `stats-bar.tsx`, `features-grid.tsx`, `app-showcase.tsx`, `roi-calculator.tsx`, `pricing.tsx`, `faq.tsx`, `footer.tsx`

**Step 2: Create landing page route**

```tsx
// apps/docs/src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { Navbar } from "~/components/landing/navbar"
import { Hero } from "~/components/landing/hero"
import { StatsBar } from "~/components/landing/stats-bar"
import { FeaturesGrid } from "~/components/landing/features-grid"
import { AppShowcase } from "~/components/landing/app-showcase"
import { RoiCalculator } from "~/components/landing/roi-calculator"
import { Pricing } from "~/components/landing/pricing"
import { Faq } from "~/components/landing/faq"
import { Footer } from "~/components/landing/footer"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-app">
      <Navbar />
      <Hero />
      <StatsBar />
      <FeaturesGrid />
      <AppShowcase />
      <RoiCalculator />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  )
}
```

**Step 3: Verify landing page renders**

Run: `cd apps/docs && pnpm dev`
Navigate to: `http://localhost:3100/`
Expected: Landing page renders correctly with all sections

**Step 4: Commit**

```bash
git add apps/docs/src/components/landing/ apps/docs/src/routes/index.tsx
git commit -m "feat(docs): migrate landing page to tanstack start"
```

---

## Task 8: Create docs layout (pathless route)

**Files:**
- Create: `apps/docs/src/routes/_docs.tsx`
- Copy: `apps/docs/config/navigation.ts` → `apps/docs/src/config/navigation.ts`
- Copy: `apps/docs/config/components-navigation.ts` → `apps/docs/src/config/components-navigation.ts`
- Copy: `apps/docs/config/app.config.ts` → `apps/docs/src/config/app.config.ts`

**Step 1: Copy config files**

Copy `apps/docs/config/` directory to `apps/docs/src/config/`. In each file:

1. Replace `@/` → `~/`
2. Replace `process.env.NEXT_PUBLIC_*` → `import.meta.env.VITE_*`

**Step 2: Create `.env.development`**

```env
VITE_EXAMPLES_URL=http://localhost:3110
```

(replaces the old `.env.development` with `NEXT_PUBLIC_EXAMPLES_URL`)

**Step 3: Create `_docs.tsx` pathless layout**

```tsx
// apps/docs/src/routes/_docs.tsx
"use client"

import { createFileRoute, Outlet } from "@tanstack/react-router"
import { CommandPalette } from "@blazz/ui/components/features/command-palette/command-palette"
import { AppFrame } from "@blazz/ui/components/layout/app-frame"
import { FrameProvider, useFrame } from "@blazz/ui/components/layout/frame-context"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { sidebarConfig, navigationConfig } from "~/config/navigation"
import { useFrameLayout } from "@blazz/ui/lib/use-frame-layout"
import { Toaster } from "sonner"

export const Route = createFileRoute("/_docs")({
  component: DocsLayout,
})

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""

const sections = [
  { id: "examples", label: "Examples", href: examplesUrl || "/examples" },
]

function DocsLayoutInner() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useFrame()
  useFrameLayout()

  return (
    <SidebarProvider>
      <AppFrame
        sidebarConfig={sidebarConfig}
        sections={sections}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        activeSection=""
        minimalTopBar
      >
        <Outlet />
      </AppFrame>
      <CommandPalette
        navigation={navigationConfig}
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
      <Toaster />
    </SidebarProvider>
  )
}

function DocsLayout() {
  return (
    <FrameProvider>
      <DocsLayoutInner />
    </FrameProvider>
  )
}
```

**Step 4: Verify layout renders**

Run: `cd apps/docs && pnpm dev`
Navigate to any `/_docs/*` route — should show the AppFrame with sidebar
Expected: Sidebar, top bar, and command palette render correctly

**Step 5: Commit**

```bash
git add apps/docs/src/routes/_docs.tsx apps/docs/src/config/ apps/docs/.env.development
git commit -m "feat(docs): add docs layout with sidebar and command palette"
```

---

## Task 9: Migrate a pilot batch of component pages (5 pages)

Before bulk-migrating 131 pages, validate the pattern on 5 representative pages.

**Files:**
- Create: `apps/docs/src/routes/_docs/docs/components/index.tsx` (components overview)
- Create: `apps/docs/src/routes/_docs/docs/components/ui/button.tsx`
- Create: `apps/docs/src/routes/_docs/docs/components/ui/card.tsx`
- Create: `apps/docs/src/routes/_docs/docs/components/ai/index.tsx` (AI overview)
- Create: `apps/docs/src/routes/_docs/docs/components/charts/index.tsx` (charts overview)

**Step 1: Understand the page migration pattern**

Each page follows this transformation:

```tsx
// BEFORE (Next.js - app/(docs)/docs/components/ui/button/page.tsx)
import { DocPage } from "@/components/docs"
import { DocExample } from "@/components/docs"
// ...
export default function ButtonPage() {
  return (
    <DocPage title="Button" subtitle="...">
      <DocExample title="Default" code={`<Button>Click</Button>`}>
        <Button>Click</Button>
      </DocExample>
    </DocPage>
  )
}

// AFTER (TanStack Start - src/routes/_docs/docs/components/ui/button.tsx)
import { createFileRoute } from "@tanstack/react-router"
import { highlightCode } from "~/lib/highlight.server"
import { DocPage, DocExampleClient } from "~/components/docs"

const examples = [
  { title: "Default", code: `<Button>Click</Button>`, lang: "tsx" },
]

export const Route = createFileRoute("/_docs/docs/components/ui/button")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map((ex) => highlightCode({ data: { code: ex.code, lang: ex.lang } }))
    )
    return { examples: examples.map((ex, i) => ({ ...ex, html: highlighted[i] })) }
  },
  component: ButtonPage,
})

function ButtonPage() {
  const { examples } = Route.useLoaderData()
  // Render using DocExampleClient with pre-highlighted HTML
}
```

**Important:** Each page has unique JSX content (live previews with actual `@blazz/ui` components). The `children` of `DocExample` (the live preview) are NOT in the code string — they're rendered React components. So the pattern is:

```tsx
// Each example needs both the code string (for highlighting) and the React preview
<DocExampleClient
  title="Default"
  code={codeString}
  highlightedCode={highlightedHtml}
>
  <Button>Click me</Button>  {/* Live preview */}
</DocExampleClient>
```

**Step 2: Create the 5 pilot pages**

Migrate each page following the pattern above. For each:
1. Extract code strings into a `const examples` array at module level
2. Create the `loader` that highlights all code strings via `highlightCode`
3. Adapt the component to use `Route.useLoaderData()` and `DocExampleClient`
4. Replace all `@/` imports with `~/`
5. Replace `next/link` → TanStack `Link`

**Step 3: Verify pilot pages render**

Run: `cd apps/docs && pnpm dev`
Navigate to: `http://localhost:3100/docs/components/ui/button`
Expected: Button doc page renders with:
- Correct layout (sidebar, top bar)
- Live component previews
- Syntax-highlighted code blocks (both dark and light themes)
- Copy button works
- Toggle code works

**Step 4: Commit**

```bash
git add apps/docs/src/routes/_docs/docs/components/
git commit -m "feat(docs): migrate 5 pilot component pages to tanstack start"
```

---

## Task 10: Bulk migrate all remaining component pages

**Files:** All 126+ remaining pages under `apps/docs/app/(docs)/docs/components/`

**Step 1: Migrate by category**

Follow the exact same pattern as Task 9. Migrate in this order:

1. **UI primitives** (~50 pages): `apps/docs/src/routes/_docs/docs/components/ui/*.tsx`
2. **Layout components** (~11 pages): `apps/docs/src/routes/_docs/docs/components/layout/*.tsx`
3. **AI components** (~55 pages): `apps/docs/src/routes/_docs/docs/components/ai/**/*.tsx`
4. **Charts** (~6 pages): `apps/docs/src/routes/_docs/docs/components/charts/*.tsx`
5. **Category index pages** (~9 pages): actions, colors, data-display, feedback, forms, navigation, overlays, typography

For each page:
- `@/` → `~/`
- `next/link` → TanStack `Link` (href → to)
- Async `DocExample` → `DocExampleClient` with loader-provided HTML
- `export default function PageName()` → `createFileRoute` + named component

**Step 2: Commit after each category**

```bash
git commit -m "feat(docs): migrate UI component pages to tanstack start"
git commit -m "feat(docs): migrate layout component pages to tanstack start"
git commit -m "feat(docs): migrate AI component pages to tanstack start"
git commit -m "feat(docs): migrate chart component pages to tanstack start"
git commit -m "feat(docs): migrate category index pages to tanstack start"
```

**Step 3: Verify all pages**

Run: `cd apps/docs && pnpm dev`
Spot-check 10+ pages across different categories.
Expected: All pages render with correct highlighting, previews, and navigation.

---

## Task 11: Migrate thumbnail route

**Files:**
- Copy: `apps/docs/components/thumbnails/*` → `apps/docs/src/components/thumbnails/*`
- Copy: `apps/docs/config/thumbnail-registry.ts` → `apps/docs/src/config/thumbnail-registry.ts`
- Create: `apps/docs/src/routes/thumbnail/$slug.tsx`

**Step 1: Copy thumbnail components and registry**

Copy files, replace `@/` → `~/`.

For `thumbnail-shell.tsx`: replace `useSearchParams()` from `next/navigation` with TanStack Router equivalent:

```tsx
// BEFORE
import { useSearchParams } from "next/navigation"
const searchParams = useSearchParams()
const value = searchParams.get("key")

// AFTER
import { useSearch } from "@tanstack/react-router"
const search = useSearch({ from: "/thumbnail/$slug" })
const value = search.key
```

**Step 2: Create dynamic thumbnail route**

```tsx
// apps/docs/src/routes/thumbnail/$slug.tsx
import { createFileRoute } from "@tanstack/react-router"
import { thumbnailRegistry } from "~/config/thumbnail-registry"
import { previewMap } from "~/components/thumbnails"
import { ThumbnailShell } from "~/components/thumbnails/thumbnail-shell"

export const Route = createFileRoute("/thumbnail/$slug")({
  component: ThumbnailPage,
})

function ThumbnailPage() {
  const { slug } = Route.useParams()
  const entry = thumbnailRegistry.find((e) => e.slug === slug)
  if (!entry) return <div>Not found</div>

  const Preview = previewMap[slug]
  if (!Preview) return <div>Not found</div>

  return (
    <ThumbnailShell>
      <Preview />
    </ThumbnailShell>
  )
}
```

**Step 3: Add thumbnail routes to prerender config**

Update `vite.config.ts`:

```ts
tanstackStart({
  prerender: {
    routes: [
      "/",
      // Thumbnails are prerendered explicitly since they're not linked in nav
      ...thumbnailRegistry.map((t) => `/thumbnail/${t.slug}`),
    ],
    crawlLinks: true,
  },
}),
```

Note: You'll need to import `thumbnailRegistry` at the top of `vite.config.ts`.

**Step 4: Verify thumbnails**

Run: `cd apps/docs && pnpm dev`
Navigate to: `http://localhost:3100/thumbnail/button`
Expected: Thumbnail preview renders correctly

**Step 5: Commit**

```bash
git add apps/docs/src/components/thumbnails/ apps/docs/src/config/thumbnail-registry.ts apps/docs/src/routes/thumbnail/
git commit -m "feat(docs): migrate thumbnail route to tanstack start"
```

---

## Task 12: Migrate remaining lib and utilities

**Files:**
- Copy: `apps/docs/lib/sample-data.ts` → `apps/docs/src/lib/sample-data.ts`
- Copy: `apps/docs/lib/linear-data.ts` → `apps/docs/src/lib/linear-data.ts`
- Copy any other `lib/` files

**Step 1: Copy lib files**

Straightforward copy. No Next.js-specific code in these files.

**Step 2: Commit**

```bash
git add apps/docs/src/lib/
git commit -m "feat(docs): migrate lib utilities"
```

---

## Task 13: Move static assets

**Files:**
- Move: `apps/docs/public/` stays at `apps/docs/public/` (Vite serves from same location)

**Step 1: Verify public directory**

Vite serves static files from `public/` by default, same as Next.js. No change needed.
Verify favicon and any other static assets load correctly.

**Step 2: Commit (if any changes)**

```bash
git commit -m "chore(docs): verify static assets"
```

---

## Task 14: Clean up old Next.js files

**Files:**
- Delete: `apps/docs/app/` (entire directory)
- Delete: `apps/docs/components/` (old location — now at `src/components/`)
- Delete: `apps/docs/config/` (old location — now at `src/config/`)
- Delete: `apps/docs/lib/` (old location — now at `src/lib/`)
- Delete: `apps/docs/.env.development` (old one — new one already created)
- Delete: `apps/docs/next-env.d.ts` (if exists)

**Step 1: Verify all functionality works from `src/` paths**

Run: `cd apps/docs && pnpm dev`
Verify: Landing, docs pages, thumbnails, theme toggle, command palette, syntax highlighting

**Step 2: Delete old directories**

```bash
git rm -r apps/docs/app/
git rm -r apps/docs/components/
git rm -r apps/docs/config/
git rm -r apps/docs/lib/
git rm apps/docs/.env.development  # old one
```

**Step 3: Commit**

```bash
git commit -m "chore(docs): remove old next.js files after migration"
```

---

## Task 15: Update Turborepo config

**Files:**
- Modify: `turbo.json` (if docs-specific config exists)

**Step 1: Check if turbo.json references Next.js-specific tasks**

Look for `"build"` pipeline entries that reference `next build`. Update to `vinxi build` if needed. Usually Turborepo just runs the `build` script from package.json, which we already updated to `vinxi build`.

**Step 2: Verify monorepo commands work**

Run: `pnpm dev:docs` (from root)
Run: `pnpm build` (from root)
Expected: Both work correctly with the new Vite/Vinxi setup

**Step 3: Commit (if changes needed)**

```bash
git add turbo.json
git commit -m "chore: update turbo config for docs vite migration"
```

---

## Task 16: Final verification and build test

**Step 1: Run full build**

Run: `cd apps/docs && pnpm build`
Expected: Vinxi builds successfully, all prerendered routes generate

**Step 2: Run production server**

Run: `cd apps/docs && pnpm start`
Navigate through the app and verify:
- [ ] Landing page loads
- [ ] Theme toggle works (persists across refreshes via cookie)
- [ ] Docs sidebar navigation works
- [ ] Component pages render with highlighted code
- [ ] Code toggle and copy work
- [ ] Command palette (Cmd+K) works
- [ ] Thumbnail pages render
- [ ] No console errors

**Step 3: Run type check**

Run: `cd apps/docs && pnpm type-check`
Expected: No TypeScript errors

**Step 4: Run lint**

Run: `cd apps/docs && pnpm lint`
Expected: No lint errors (or only pre-existing ones)

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat(docs): complete migration from next.js to tanstack start"
```

---

## Summary

| Task | Description | Effort |
|------|------------|--------|
| 1 | Update dependencies | Small |
| 2 | Vite config + entry points | Small |
| 3 | Root route + styles | Small |
| 4 | Theme system (cookie) | Small |
| 5 | Shiki server function | Small |
| 6 | Migrate doc components | Medium |
| 7 | Landing page + route | Medium |
| 8 | Docs layout (pathless) | Small |
| 9 | Pilot 5 component pages | Medium |
| 10 | Bulk migrate 126+ pages | Large |
| 11 | Thumbnail route | Small |
| 12 | Migrate lib utilities | Small |
| 13 | Static assets | Trivial |
| 14 | Clean up old files | Small |
| 15 | Turborepo config | Small |
| 16 | Final verification | Medium |

**Total: 16 tasks. The bulk of the work is Task 10 (126+ pages)** but each page follows the same mechanical pattern.
