# Thumbnail Generation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate 800x600 PNG thumbnails of every component (UI, blocks, AI) in light and dark themes, with a dots pattern background using design system tokens.

**Architecture:** Registry-driven approach — a central `config/thumbnail-registry.ts` lists all components, a dynamic Next.js route `app/thumbnail/[slug]/page.tsx` renders each on a dots background, and a Playwright script `scripts/generate-thumbnails.ts` screenshots them in batch. Preview wrappers in `components/thumbnails/` provide demo props.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Playwright, next-themes

---

### Task 1: Create the thumbnail registry

**Files:**
- Create: `config/thumbnail-registry.ts`

**Step 1: Create the registry file with all component entries**

```ts
export type ThumbnailCategory = "ui" | "blocks" | "ai"

export type ThumbnailEntry = {
  slug: string
  category: ThumbnailCategory
  label: string
}

export const thumbnailRegistry: ThumbnailEntry[] = [
  // ── UI Primitives ──────────────────────────────────
  { slug: "alert", category: "ui", label: "Alert" },
  { slug: "avatar", category: "ui", label: "Avatar" },
  { slug: "badge", category: "ui", label: "Badge" },
  { slug: "banner", category: "ui", label: "Banner" },
  { slug: "breadcrumb", category: "ui", label: "Breadcrumb" },
  { slug: "button", category: "ui", label: "Button" },
  { slug: "button-group", category: "ui", label: "Button Group" },
  { slug: "calendar", category: "ui", label: "Calendar" },
  { slug: "cells", category: "ui", label: "Cells" },
  { slug: "checkbox", category: "ui", label: "Checkbox" },
  { slug: "command", category: "ui", label: "Command" },
  { slug: "confirmation-dialog", category: "ui", label: "Confirmation Dialog" },
  { slug: "data-table", category: "ui", label: "Data Table" },
  { slug: "date-selector", category: "ui", label: "Date Selector" },
  { slug: "dialog", category: "ui", label: "Dialog" },
  { slug: "dropdown-menu", category: "ui", label: "Dropdown Menu" },
  { slug: "empty", category: "ui", label: "Empty" },
  { slug: "frame-panel", category: "ui", label: "Frame Panel" },
  { slug: "input", category: "ui", label: "Input" },
  { slug: "menu", category: "ui", label: "Menu" },
  { slug: "nav-menu", category: "ui", label: "Nav Menu" },
  { slug: "notification-center", category: "ui", label: "Notification Center" },
  { slug: "org-menu", category: "ui", label: "Org Menu" },
  { slug: "phone-input", category: "ui", label: "Phone Input" },
  { slug: "popover", category: "ui", label: "Popover" },
  { slug: "property", category: "ui", label: "Property" },
  { slug: "property-card", category: "ui", label: "Property Card" },
  { slug: "select", category: "ui", label: "Select" },
  { slug: "sheet", category: "ui", label: "Sheet" },
  { slug: "skeleton", category: "ui", label: "Skeleton" },
  { slug: "stats-strip", category: "ui", label: "Stats Strip" },
  { slug: "switch", category: "ui", label: "Switch" },
  { slug: "table", category: "ui", label: "Table" },
  { slug: "tabs", category: "ui", label: "Tabs" },
  { slug: "text", category: "ui", label: "Text" },
  { slug: "textarea", category: "ui", label: "Textarea" },
  { slug: "tooltip", category: "ui", label: "Tooltip" },

  // ── Block Components ───────────────────────────────
  { slug: "activity-timeline", category: "blocks", label: "Activity Timeline" },
  { slug: "bulk-action-bar", category: "blocks", label: "Bulk Action Bar" },
  { slug: "chart-card", category: "blocks", label: "Chart Card" },
  { slug: "data-grid", category: "blocks", label: "Data Grid" },
  { slug: "detail-panel", category: "blocks", label: "Detail Panel" },
  { slug: "error-state", category: "blocks", label: "Error State" },
  { slug: "field-grid", category: "blocks", label: "Field Grid" },
  { slug: "filter-bar", category: "blocks", label: "Filter Bar" },
  { slug: "form-field", category: "blocks", label: "Form Field" },
  { slug: "form-section", category: "blocks", label: "Form Section" },
  { slug: "multi-step-form", category: "blocks", label: "Multi-Step Form" },
  { slug: "page-header", category: "blocks", label: "Page Header" },
  { slug: "split-view", category: "blocks", label: "Split View" },
  { slug: "stats-grid", category: "blocks", label: "Stats Grid" },
  { slug: "status-flow", category: "blocks", label: "Status Flow" },

  // ── AI Components ──────────────────────────────────
  { slug: "ai-conversation", category: "ai", label: "Conversation" },
  { slug: "ai-message", category: "ai", label: "Message" },
  { slug: "ai-prompt-input", category: "ai", label: "Prompt Input" },
  { slug: "ai-suggestion", category: "ai", label: "Suggestion" },
  { slug: "ai-reasoning", category: "ai", label: "Reasoning" },
  { slug: "ai-chain-of-thought", category: "ai", label: "Chain of Thought" },
  { slug: "ai-sources", category: "ai", label: "Sources" },
  { slug: "ai-confirmation", category: "ai", label: "Confirmation" },
  { slug: "ai-model-selector", category: "ai", label: "Model Selector" },
  { slug: "ai-metric-card", category: "ai", label: "Metric Card" },
  { slug: "ai-stats-row", category: "ai", label: "Stats Row" },
  { slug: "ai-mini-chart", category: "ai", label: "Mini Chart" },
  { slug: "ai-comparison-table", category: "ai", label: "Comparison Table" },
  { slug: "ai-progress-card", category: "ai", label: "Progress Card" },
  { slug: "ai-data-list", category: "ai", label: "Data List" },
  { slug: "ai-data-grid", category: "ai", label: "AI Data Grid" },
  { slug: "ai-candidate-card", category: "ai", label: "Candidate Card" },
  { slug: "ai-contact-card", category: "ai", label: "Contact Card" },
  { slug: "ai-company-card", category: "ai", label: "Company Card" },
  { slug: "ai-deal-card", category: "ai", label: "Deal Card" },
  { slug: "ai-user-card", category: "ai", label: "User Card" },
  { slug: "ai-timeline", category: "ai", label: "AI Timeline" },
  { slug: "ai-event-card", category: "ai", label: "Event Card" },
  { slug: "ai-status-update", category: "ai", label: "Status Update" },
  { slug: "ai-approval-card", category: "ai", label: "Approval Card" },
  { slug: "ai-action-list", category: "ai", label: "Action List" },
  { slug: "ai-poll-card", category: "ai", label: "Poll Card" },
  { slug: "ai-email-preview", category: "ai", label: "Email Preview" },
  { slug: "ai-message-preview", category: "ai", label: "Message Preview" },
  { slug: "ai-task-card", category: "ai", label: "Task Card" },
  { slug: "ai-checklist-card", category: "ai", label: "Checklist Card" },
  { slug: "ai-invoice-card", category: "ai", label: "Invoice Card" },
  { slug: "ai-quote-summary", category: "ai", label: "Quote Summary" },
  { slug: "ai-pricing-table", category: "ai", label: "Pricing Table" },
  { slug: "ai-transaction-card", category: "ai", label: "Transaction Card" },
  { slug: "ai-calendar-card", category: "ai", label: "Calendar Card" },
  { slug: "ai-availability-card", category: "ai", label: "Availability Card" },
  { slug: "ai-insight-card", category: "ai", label: "Insight Card" },
  { slug: "ai-summary-card", category: "ai", label: "Summary Card" },
  { slug: "ai-rating-card", category: "ai", label: "Rating Card" },
  { slug: "ai-score-card", category: "ai", label: "Score Card" },
  { slug: "ai-location-card", category: "ai", label: "Location Card" },
  { slug: "ai-video-card", category: "ai", label: "Video Card" },
  { slug: "ai-file-card", category: "ai", label: "File Card" },
  { slug: "ai-link-preview", category: "ai", label: "Link Preview" },
  { slug: "ai-image-gallery", category: "ai", label: "Image Gallery" },
]
```

**Step 2: Commit**

```bash
git add config/thumbnail-registry.ts
git commit -m "feat(thumbnails): add component thumbnail registry"
```

---

### Task 2: Create the ThumbnailShell wrapper component

**Files:**
- Create: `components/thumbnails/thumbnail-shell.tsx`

This is a **client component** that:
- Renders the 800x600 dots background wrapper
- Forces the theme via `next-themes` `useTheme()` based on a `?theme=` search param
- Centers the child component with flexbox

**Step 1: Create the shell component**

```tsx
"use client"

import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function ThumbnailShell({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme()
  const searchParams = useSearchParams()
  const requestedTheme = searchParams.get("theme")

  useEffect(() => {
    if (requestedTheme === "light" || requestedTheme === "dark") {
      setTheme(requestedTheme)
    }
  }, [requestedTheme, setTheme])

  return (
    <div
      className="flex items-center justify-center bg-surface"
      style={{
        width: 800,
        height: 600,
        backgroundImage:
          "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="max-w-[720px] max-h-[540px] overflow-hidden">
        {children}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/thumbnails/thumbnail-shell.tsx
git commit -m "feat(thumbnails): add ThumbnailShell wrapper with dots bg"
```

---

### Task 3: Create the thumbnail route layout

**Files:**
- Create: `app/thumbnail/layout.tsx`

This layout strips all shell UI (sidebar, topbar). Just renders children bare.

**Step 1: Create the minimal layout**

```tsx
export default function ThumbnailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface">
      {children}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/thumbnail/layout.tsx
git commit -m "feat(thumbnails): add minimal thumbnail route layout"
```

---

### Task 4: Create preview components — UI primitives (batch 1)

**Files:**
- Create: `components/thumbnails/ui-previews.tsx`

This file exports one `*Preview` function per UI component, rendering it with demo props. Each preview is self-contained with realistic data. This is a large file — all UI previews in one place.

**Step 1: Create UI preview components**

Create `components/thumbnails/ui-previews.tsx` with exports like:

```tsx
import { Button } from "@/components/ui/button"
// ... other imports

export function ButtonPreview() {
  return (
    <div className="flex gap-3">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  )
}

export function InputPreview() {
  return (
    <div className="flex flex-col gap-3 w-72">
      <Input placeholder="Email address" />
      <Input placeholder="Disabled" disabled />
    </div>
  )
}

// ... one export per UI component slug
```

Each function name matches the pattern: `{PascalCaseSlug}Preview`.

**Key rules for previews:**
- No external data fetching — all props are hardcoded
- Keep previews compact (fit within 720x540 max)
- Use realistic but generic data (names, numbers, dates)
- For overlay components (Dialog, Sheet, Popover), render them in their "open" state inline if possible, or just show their trigger + a static representation

**Step 2: Commit**

```bash
git add components/thumbnails/ui-previews.tsx
git commit -m "feat(thumbnails): add UI component preview wrappers"
```

---

### Task 5: Create preview components — Block components

**Files:**
- Create: `components/thumbnails/block-previews.tsx`

Same pattern as Task 4 but for block components. Each export renders a block with demo data.

**Step 1: Create block preview components**

```tsx
import { StatsGrid } from "@/components/blocks/stats-grid"
import { TrendingUp, Users, DollarSign, Target } from "lucide-react"
// ... other imports

export function StatsGridPreview() {
  return (
    <StatsGrid
      columns={4}
      stats={[
        { label: "Revenue", value: "$48,200", trend: 12.5, icon: DollarSign },
        { label: "Customers", value: "2,340", trend: 8.1, icon: Users },
        { label: "Deals Won", value: "64", trend: -3.2, icon: Target },
        { label: "Growth", value: "+18%", trend: 18, icon: TrendingUp },
      ]}
    />
  )
}

// ... one export per block slug
```

**Step 2: Commit**

```bash
git add components/thumbnails/block-previews.tsx
git commit -m "feat(thumbnails): add block component preview wrappers"
```

---

### Task 6: Create preview components — AI components

**Files:**
- Create: `components/thumbnails/ai-previews.tsx`

Same pattern for AI/generative components.

**Step 1: Create AI preview components**

```tsx
import { MetricCard } from "@/components/ai"
// ... other imports

export function AiMetricCardPreview() {
  return (
    <MetricCard
      title="Monthly Revenue"
      value="$142,500"
      change={12.3}
      period="vs last month"
    />
  )
}

// ... one export per AI slug
```

**Step 2: Commit**

```bash
git add components/thumbnails/ai-previews.tsx
git commit -m "feat(thumbnails): add AI component preview wrappers"
```

---

### Task 7: Create the preview registry map

**Files:**
- Create: `components/thumbnails/index.ts`

Maps each slug to its preview component for dynamic lookup.

**Step 1: Create the index mapping**

```tsx
import type { ComponentType } from "react"

// UI
import { ButtonPreview, InputPreview, /* ... */ } from "./ui-previews"
// Blocks
import { StatsGridPreview, DataGridPreview, /* ... */ } from "./block-previews"
// AI
import { AiMetricCardPreview, AiCandidateCardPreview, /* ... */ } from "./ai-previews"

export const previewMap: Record<string, ComponentType> = {
  // UI
  "button": ButtonPreview,
  "input": InputPreview,
  // ... all UI slugs

  // Blocks
  "stats-grid": StatsGridPreview,
  "data-grid": DataGridPreview,
  // ... all block slugs

  // AI
  "ai-metric-card": AiMetricCardPreview,
  "ai-candidate-card": AiCandidateCardPreview,
  // ... all AI slugs
}
```

**Step 2: Commit**

```bash
git add components/thumbnails/index.ts
git commit -m "feat(thumbnails): add slug-to-preview mapping index"
```

---

### Task 8: Create the dynamic thumbnail route

**Files:**
- Create: `app/thumbnail/[slug]/page.tsx`

**Step 1: Create the dynamic page**

```tsx
import { notFound } from "next/navigation"
import { thumbnailRegistry } from "@/config/thumbnail-registry"
import { previewMap } from "@/components/thumbnails"
import { ThumbnailShell } from "@/components/thumbnails/thumbnail-shell"

type Params = Promise<{ slug: string }>

export default async function ThumbnailPage({ params }: { params: Params }) {
  const { slug } = await params
  const entry = thumbnailRegistry.find((e) => e.slug === slug)
  if (!entry) notFound()

  const Preview = previewMap[slug]
  if (!Preview) notFound()

  return (
    <ThumbnailShell>
      <Preview />
    </ThumbnailShell>
  )
}

export function generateStaticParams() {
  return thumbnailRegistry.map((entry) => ({ slug: entry.slug }))
}
```

**Step 2: Verify manually**

Run: `pnpm dev` (port 3100)
Visit: `http://localhost:3100/thumbnail/button`
Expected: Button variants centered on dots background, light theme

Visit: `http://localhost:3100/thumbnail/button?theme=dark`
Expected: Same but dark theme

**Step 3: Commit**

```bash
git add app/thumbnail/[slug]/page.tsx
git commit -m "feat(thumbnails): add dynamic thumbnail route"
```

---

### Task 9: Create the Playwright screenshot script

**Files:**
- Create: `scripts/generate-thumbnails.ts`
- Modify: `package.json` (add `thumbnails` script)

**Step 1: Create the Playwright script**

```ts
import { chromium } from "playwright"
import { thumbnailRegistry } from "../config/thumbnail-registry"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"

const BASE_URL = "http://localhost:3100"
const OUTPUT_DIR = join(process.cwd(), "public", "thumbnails")
const THEMES = ["light", "dark"] as const
const VIEWPORT = { width: 800, height: 600 }

async function main() {
  const args = process.argv.slice(2)
  const themeArg = args.find((a) => a.startsWith("--theme="))?.split("=")[1]
  const componentArg = args.find((a) => a.startsWith("--component="))?.split("=")[1]

  const themes = themeArg && themeArg !== "both"
    ? [themeArg as "light" | "dark"]
    : THEMES

  const entries = componentArg
    ? thumbnailRegistry.filter((e) => e.slug === componentArg)
    : thumbnailRegistry

  if (entries.length === 0) {
    console.error(`No component found for: ${componentArg}`)
    process.exit(1)
  }

  // Ensure output dirs exist
  for (const theme of themes) {
    await mkdir(join(OUTPUT_DIR, theme), { recursive: true })
  }

  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: VIEWPORT })
  const page = await context.newPage()

  let success = 0
  let errors = 0

  for (const entry of entries) {
    for (const theme of themes) {
      const url = `${BASE_URL}/thumbnail/${entry.slug}?theme=${theme}`
      const outPath = join(OUTPUT_DIR, theme, `${entry.slug}.png`)

      try {
        await page.goto(url, { waitUntil: "networkidle" })
        await page.waitForTimeout(500) // let theme + animations settle
        await page.screenshot({ path: outPath, type: "png" })
        console.log(`✓ ${theme}/${entry.slug}.png`)
        success++
      } catch (err) {
        console.error(`✗ ${theme}/${entry.slug}: ${err}`)
        errors++
      }
    }
  }

  await browser.close()
  console.log(`\nDone: ${success} generated, ${errors} errors`)
}

main()
```

**Step 2: Add the pnpm script to package.json**

Add to `"scripts"` in `package.json`:

```json
"thumbnails": "npx tsx scripts/generate-thumbnails.ts"
```

**Step 3: Commit**

```bash
git add scripts/generate-thumbnails.ts package.json
git commit -m "feat(thumbnails): add Playwright batch screenshot script"
```

---

### Task 10: End-to-end validation

**Step 1: Start dev server**

Run: `pnpm dev` (in a separate terminal, port 3100)

**Step 2: Test single component**

Run: `pnpm thumbnails --component=button`
Expected: Files created at `public/thumbnails/light/button.png` and `public/thumbnails/dark/button.png`

**Step 3: Open and verify the PNGs**

Check:
- 800x600 resolution
- Dots pattern visible
- Component centered
- Light vs dark theme difference clear

**Step 4: Run full batch**

Run: `pnpm thumbnails`
Expected: ~158 PNGs generated in `public/thumbnails/`

**Step 5: Add thumbnails dir to .gitignore (optional)**

If thumbnails should be regenerated and not committed:
```
# Generated thumbnails
public/thumbnails/
```

Or keep them committed for fast doc page loading.

**Step 6: Commit**

```bash
git add public/thumbnails/ .gitignore
git commit -m "feat(thumbnails): generate initial component thumbnails"
```
