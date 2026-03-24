# Color Tuner Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Dev tool in apps/ops — a fixed button that opens a Sheet with oklch color pickers for all design tokens, with live preview and CSS copy.

**Architecture:** Single client component (`color-tuner.tsx`) with a Sheet from `@blazz/ui`. Reads current token values via `getComputedStyle`, provides L/C/H sliders per token, writes changes live via `style.setProperty`. Trigger button added to the main layout.

**Tech Stack:** React 19, @blazz/ui (Sheet, Slider, Button, ScrollArea), oklch parsing, clipboard API

---

### Task 1: Create the oklch parser utility

**Files:**
- Create: `apps/ops/components/color-tuner.tsx`

**Step 1: Write the oklch parse/format helpers at the top of the file**

```tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// ── oklch helpers ──────────────────────────────────────────────

interface OklchColor {
  l: number  // 0–1
  c: number  // 0–0.4
  h: number  // 0–360
}

function parseOklch(raw: string): OklchColor | null {
  // Match oklch(L C H) or oklch(L C H / alpha)
  const m = raw.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
  if (!m) return null
  return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) }
}

function formatOklch({ l, c, h }: OklchColor): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(0)})`
}
```

**Step 2: Verify by visual inspection**

No test runner in ops — verify the logic is correct by reading the code.

**Step 3: Commit**

```bash
git add apps/ops/components/color-tuner.tsx
git commit -m "feat(ops): add color-tuner scaffold with oklch helpers"
```

---

### Task 2: Define the token groups configuration

**Files:**
- Modify: `apps/ops/components/color-tuner.tsx`

**Step 1: Add the token groups constant after the helpers**

```tsx
// ── token groups ───────────────────────────────────────────────

interface TokenDef {
  variable: string
  label: string
}

interface TokenGroup {
  name: string
  tokens: TokenDef[]
}

const TOKEN_GROUPS: TokenGroup[] = [
  {
    name: "Surfaces",
    tokens: [
      { variable: "--surface-base", label: "Base" },
      { variable: "--surface-top", label: "Top" },
    ],
  },
  {
    name: "Text",
    tokens: [
      { variable: "--text-primary", label: "Primary" },
      { variable: "--text-secondary", label: "Secondary" },
      { variable: "--text-muted", label: "Muted" },
    ],
  },
  {
    name: "Borders",
    tokens: [
      { variable: "--border-default", label: "Default" },
      { variable: "--border-subtle", label: "Subtle" },
    ],
  },
  {
    name: "Accent",
    tokens: [
      { variable: "--accent", label: "Accent" },
      { variable: "--accent-hover", label: "Hover" },
      { variable: "--accent-foreground", label: "Foreground" },
    ],
  },
  {
    name: "Semantic",
    tokens: [
      { variable: "--success", label: "Success" },
      { variable: "--warning", label: "Warning" },
      { variable: "--destructive", label: "Destructive" },
      { variable: "--info", label: "Info" },
    ],
  },
  {
    name: "Chart",
    tokens: [
      { variable: "--chart-1", label: "Chart 1" },
      { variable: "--chart-2", label: "Chart 2" },
      { variable: "--chart-3", label: "Chart 3" },
      { variable: "--chart-4", label: "Chart 4" },
      { variable: "--chart-5", label: "Chart 5" },
    ],
  },
]
```

**Step 2: Commit**

```bash
git add apps/ops/components/color-tuner.tsx
git commit -m "feat(ops): add token groups config for color tuner"
```

---

### Task 3: Build the main ColorTuner component with state management

**Files:**
- Modify: `apps/ops/components/color-tuner.tsx`

**Step 1: Add imports for @blazz/ui components**

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@blazz/ui/components/ui/sheet"
import { Button } from "@blazz/ui/components/ui/button"
import { Slider } from "@blazz/ui/components/ui/slider"
import { ScrollArea } from "@blazz/ui/components/ui/scroll-area"
import { Palette, Copy, RotateCcw } from "lucide-react"
```

**Step 2: Write the main component with state init from computed styles**

```tsx
// ── state types ────────────────────────────────────────────────

type TokenValues = Record<string, OklchColor>

function readCurrentTokens(): TokenValues {
  const style = getComputedStyle(document.documentElement)
  const values: TokenValues = {}
  for (const group of TOKEN_GROUPS) {
    for (const token of group.tokens) {
      const raw = style.getPropertyValue(token.variable).trim()
      const parsed = parseOklch(raw)
      if (parsed) values[token.variable] = parsed
    }
  }
  return values
}

// ── main component ─────────────────────────────────────────────

export function ColorTuner() {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<TokenValues>({})
  const originalRef = useRef<TokenValues>({})
  const modifiedRef = useRef<Set<string>>(new Set())

  // Read tokens when sheet opens
  useEffect(() => {
    if (open) {
      const current = readCurrentTokens()
      setValues(current)
      originalRef.current = structuredClone(current)
      modifiedRef.current = new Set()
    }
  }, [open])

  const updateToken = useCallback((variable: string, channel: keyof OklchColor, value: number) => {
    setValues((prev) => {
      const next = { ...prev }
      const color = { ...next[variable], [channel]: value }
      next[variable] = color
      // Apply live
      document.documentElement.style.setProperty(variable, formatOklch(color))
      modifiedRef.current.add(variable)
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    for (const variable of modifiedRef.current) {
      document.documentElement.style.removeProperty(variable)
    }
    setValues(structuredClone(originalRef.current))
    modifiedRef.current = new Set()
  }, [])

  const handleCopy = useCallback(() => {
    const lines: string[] = []
    for (const variable of modifiedRef.current) {
      const color = values[variable]
      if (color) lines.push(`${variable}: ${formatOklch(color)};`)
    }
    if (lines.length > 0) {
      navigator.clipboard.writeText(lines.join("\n"))
    }
  }, [values])

  // Clean up overrides when sheet closes
  // (keep the changes visible — user is tuning live)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 z-50 size-9 rounded-full shadow-lg"
          />
        }
      >
        <Palette className="size-4" />
      </SheetTrigger>
      <SheetContent side="right" size="sm">
        <SheetHeader>
          <SheetTitle>Color Tuner</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 pb-4">
            {TOKEN_GROUPS.map((group) => (
              <TokenGroupSection
                key={group.name}
                group={group}
                values={values}
                onUpdate={updateToken}
              />
            ))}
          </div>
        </ScrollArea>
        <SheetFooter>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset
          </Button>
          <Button size="sm" onClick={handleCopy}>
            <Copy className="mr-1.5 size-3.5" />
            Copy CSS
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

**Step 3: Commit**

```bash
git add apps/ops/components/color-tuner.tsx
git commit -m "feat(ops): add ColorTuner component with live token editing"
```

---

### Task 4: Build the TokenGroupSection and TokenRow sub-components

**Files:**
- Modify: `apps/ops/components/color-tuner.tsx`

**Step 1: Add the sub-components before the main export**

```tsx
// ── sub-components ─────────────────────────────────────────────

function TokenGroupSection({
  group,
  values,
  onUpdate,
}: {
  group: TokenGroup
  values: TokenValues
  onUpdate: (variable: string, channel: keyof OklchColor, value: number) => void
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium text-fg-muted uppercase tracking-wider">
        {group.name}
      </h3>
      <div className="space-y-3">
        {group.tokens.map((token) => {
          const color = values[token.variable]
          if (!color) return null
          return (
            <TokenRow
              key={token.variable}
              token={token}
              color={color}
              onUpdate={onUpdate}
            />
          )
        })}
      </div>
    </div>
  )
}

function TokenRow({
  token,
  color,
  onUpdate,
}: {
  token: TokenDef
  color: OklchColor
  onUpdate: (variable: string, channel: keyof OklchColor, value: number) => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div
          className="size-4 rounded-sm border border-edge shrink-0"
          style={{ backgroundColor: formatOklch(color) }}
        />
        <span className="text-xs font-medium text-fg">{token.label}</span>
        <span className="ml-auto text-2xs text-fg-muted font-mono">
          {formatOklch(color)}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <SliderField
          label="L"
          value={color.l}
          min={0}
          max={1}
          step={0.005}
          onChange={(v) => onUpdate(token.variable, "l", v)}
        />
        <SliderField
          label="C"
          value={color.c}
          min={0}
          max={0.4}
          step={0.005}
          onChange={(v) => onUpdate(token.variable, "c", v)}
        />
        <SliderField
          label="H"
          value={color.h}
          min={0}
          max={360}
          step={1}
          onChange={(v) => onUpdate(token.variable, "h", v)}
        />
      </div>
    </div>
  )
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-2xs text-fg-muted">{label}</span>
        <span className="text-2xs text-fg-muted font-mono tabular-nums">
          {value.toFixed(label === "H" ? 0 : 3)}
        </span>
      </div>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
        aria-label={label}
      />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/color-tuner.tsx
git commit -m "feat(ops): add token group and slider sub-components"
```

---

### Task 5: Wire into the ops main layout

**Files:**
- Modify: `apps/ops/app/(main)/layout.tsx`

**Step 1: Add the ColorTuner import and render it alongside OpsCommandPalette**

Current layout:
```tsx
import { OpsCommandPalette } from "@/components/ops-command-palette"
import { OpsFrame } from "@/components/ops-frame"
import { RouteGuard } from "@/components/route-guard"
import { FeatureFlagsProvider } from "@/lib/feature-flags-context"
import { AuthGuard } from "./auth-guard"

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard>
			<FeatureFlagsProvider>
				<OpsFrame>
					<RouteGuard>{children}</RouteGuard>
				</OpsFrame>
				<OpsCommandPalette />
			</FeatureFlagsProvider>
		</AuthGuard>
	)
}
```

Add after `<OpsCommandPalette />`:

```tsx
import { ColorTuner } from "@/components/color-tuner"

// Inside the return, after <OpsCommandPalette />:
<ColorTuner />
```

**Step 2: Run the dev server and verify the button appears**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && pnpm dev:ops
```

Open `http://localhost:3120`, verify:
- Palette button visible bottom-right
- Click opens Sheet with all token groups
- Sliders move and colors update live on the page
- Reset removes overrides
- Copy CSS puts modified tokens in clipboard

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/layout.tsx
git commit -m "feat(ops): wire color tuner into main layout"
```

---

### Task 6: Final polish and edge cases

**Files:**
- Modify: `apps/ops/components/color-tuner.tsx`

**Step 1: Handle border tokens with alpha**

The dark mode border tokens use `oklch(... / 0.6)` syntax. Update `parseOklch` to handle alpha:

```tsx
function parseOklch(raw: string): OklchColor | null {
  const m = raw.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
  if (!m) return null
  return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) }
}
```

The regex already handles this — it captures the first 3 numbers and ignores `/ alpha`. No change needed, but verify dark mode borders parse correctly.

**Step 2: Handle `color-mix` derived tokens**

`--surface-0` through `--surface-4` are derived via `color-mix()` from `--surface-base` and `--surface-top`. They will automatically update when base/top change — no need to expose them as individual sliders. Verify this works live.

**Step 3: Verify dark mode**

Toggle theme (if theme toggle exists in ops) and reopen the color tuner. Tokens should reflect the new theme's values.

**Step 4: Commit**

```bash
git add apps/ops/components/color-tuner.tsx
git commit -m "feat(ops): polish color tuner edge cases"
```
