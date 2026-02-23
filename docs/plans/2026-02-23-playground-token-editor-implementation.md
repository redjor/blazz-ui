# Playground Token Editor — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the playground page with a full-screen token editor featuring a left sidebar for editing design tokens and a main preview area showing live component previews.

**Architecture:** Sidebar (280px) with collapsible token groups (color picker + oklch input for colors, sliders for density) + main area with topbar search bar to toggle components on/off + scrollable grid of live component previews. Tokens are applied via inline CSS variables on the preview container. Reuses types/presets/helpers from existing `theme-presets.ts`.

**Tech Stack:** React 19, Next.js, Tailwind v4, existing shadcn/ui primitives, native `<input type="color">` for picker, oklch ↔ hex conversion.

---

### Task 1: Create oklch ↔ hex conversion utilities

**Files:**
- Create: `components/features/playground/color-utils.ts`

**Step 1: Write the color conversion utilities**

This module provides bidirectional conversion between hex colors and oklch values. The native `<input type="color">` works with hex, but our tokens use oklch.

```ts
import type { OklchColor } from "@/components/features/docs/theme-editor/theme-presets"

// oklch → sRGB → hex
// Uses CSS Color Level 4 approach via CanvasRenderingContext2D for browser-native conversion

/**
 * Convert an OklchColor to a hex string (e.g. "#5b3aff").
 * Uses a hidden canvas for browser-native oklch→sRGB conversion.
 */
export function oklchToHex(color: OklchColor): string {
  if (typeof document === "undefined") return "#808080"
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext("2d")!
  const oklchStr =
    color.a !== undefined && color.a < 1
      ? `oklch(${color.l} ${color.c} ${color.h} / ${color.a})`
      : `oklch(${color.l} ${color.c} ${color.h})`
  ctx.fillStyle = oklchStr
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

/**
 * Convert a hex string to an approximate OklchColor.
 * Uses CSS `oklch()` parsing via computed style trick.
 */
export function hexToOklch(hex: string): OklchColor {
  if (typeof document === "undefined") return { l: 0.5, c: 0, h: 0 }
  const el = document.createElement("div")
  el.style.color = hex
  document.body.appendChild(el)
  const computed = getComputedStyle(el).color
  document.body.removeChild(el)

  // computed is "rgb(r, g, b)" — convert to oklch via canvas
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = computed
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data

  // sRGB → linear
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)

  // linear sRGB → OKLab
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const l_3 = Math.cbrt(l_)
  const m_3 = Math.cbrt(m_)
  const s_3 = Math.cbrt(s_)

  const L = 0.2104542553 * l_3 + 0.793617785 * m_3 - 0.0040720468 * s_3
  const a = 1.9779984951 * l_3 - 2.428592205 * m_3 + 0.4505937099 * s_3
  const bVal = 0.0259040371 * l_3 + 0.7827717662 * m_3 - 0.808675766 * s_3

  const C = Math.sqrt(a * a + bVal * bVal)
  let H = (Math.atan2(bVal, a) * 180) / Math.PI
  if (H < 0) H += 360

  return {
    l: Math.round(L * 1000) / 1000,
    c: Math.round(C * 1000) / 1000,
    h: Math.round(H),
  }
}

/**
 * Parse an oklch string like "oklch(0.5 0.22 275)" into an OklchColor.
 * Returns null if parsing fails.
 */
export function parseOklchString(str: string): OklchColor | null {
  const match = str.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/
  )
  if (!match) return null
  return {
    l: Number.parseFloat(match[1]),
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
    ...(match[4] !== undefined ? { a: Number.parseFloat(match[4]) } : {}),
  }
}
```

**Step 2: Commit**

```bash
git add components/features/playground/color-utils.ts
git commit -m "feat(playground): add oklch-hex color conversion utilities"
```

---

### Task 2: Create TokenColorInput component

**Files:**
- Create: `components/features/playground/token-color-input.tsx`

**Dependencies:** Task 1

**Step 1: Write the TokenColorInput component**

Atomic component: a color swatch (opens native picker) + an editable oklch text input. Both stay in sync.

```tsx
"use client"

import { useCallback, useRef, useState } from "react"
import type { OklchColor } from "@/components/features/docs/theme-editor/theme-presets"
import { oklchToString } from "@/components/features/docs/theme-editor/theme-presets"
import { oklchToHex, hexToOklch, parseOklchString } from "./color-utils"

interface TokenColorInputProps {
  label: string
  color: OklchColor
  onChange: (color: OklchColor) => void
}

export function TokenColorInput({ label, color, onChange }: TokenColorInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [textValue, setTextValue] = useState(() => oklchToString(color))
  const [isFocused, setIsFocused] = useState(false)

  // Sync text when color changes externally (but not while user is typing)
  const displayText = isFocused ? textValue : oklchToString(color)

  const handlePickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = hexToOklch(e.target.value)
      // Preserve alpha from original if it had one
      if (color.a !== undefined) {
        newColor.a = color.a
      }
      onChange(newColor)
      setTextValue(oklchToString(newColor))
    },
    [color.a, onChange],
  )

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      setTextValue(raw)
      const parsed = parseOklchString(raw)
      if (parsed) {
        onChange(parsed)
      }
    },
    [onChange],
  )

  const handleTextBlur = useCallback(() => {
    setIsFocused(false)
    // Reset to canonical form on blur
    setTextValue(oklchToString(color))
  }, [color])

  return (
    <div className="flex items-center gap-2 group">
      {/* Color swatch — clicking it opens native picker */}
      <button
        type="button"
        className="size-6 shrink-0 rounded border border-edge cursor-pointer hover:ring-2 hover:ring-brand/30 transition-shadow"
        style={{ backgroundColor: oklchToString(color) }}
        onClick={() => inputRef.current?.click()}
        aria-label={`Pick color for ${label}`}
      />
      {/* Hidden native color picker */}
      <input
        ref={inputRef}
        type="color"
        value={oklchToHex(color)}
        onChange={handlePickerChange}
        className="sr-only"
        tabIndex={-1}
      />
      {/* Token name */}
      <span className="w-24 shrink-0 truncate text-xs font-mono text-fg-muted">
        {label}
      </span>
      {/* Editable oklch value */}
      <input
        type="text"
        value={displayText}
        onChange={handleTextChange}
        onFocus={() => {
          setIsFocused(true)
          setTextValue(oklchToString(color))
        }}
        onBlur={handleTextBlur}
        className="flex-1 min-w-0 rounded border border-edge-subtle bg-transparent px-1.5 py-0.5 text-2xs font-mono text-fg-subtle focus:border-brand focus:text-fg focus:outline-none transition-colors"
        spellCheck={false}
      />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/features/playground/token-color-input.tsx
git commit -m "feat(playground): add TokenColorInput (picker + oklch input)"
```

---

### Task 3: Create preview registry and preview components

**Files:**
- Create: `components/features/playground/preview-registry.ts`
- Create: `components/features/playground/previews/button-preview.tsx`
- Create: `components/features/playground/previews/badge-preview.tsx`
- Create: `components/features/playground/previews/card-preview.tsx`
- Create: `components/features/playground/previews/input-preview.tsx`
- Create: `components/features/playground/previews/table-preview.tsx`
- Create: `components/features/playground/previews/alert-preview.tsx`
- Create: `components/features/playground/previews/index.ts`

**Step 1: Write the preview registry**

```ts
// components/features/playground/preview-registry.ts
import type { ComponentType } from "react"

export interface PreviewEntry {
  id: string
  label: string
  component: ComponentType
  defaultActive: boolean
}

// Lazy-loaded registry — components imported in the barrel
export { PREVIEW_REGISTRY } from "./previews"
```

**Step 2: Write the preview components**

Each preview is a small self-contained component showing the main variants of a UI primitive. They render inside the token-scoped container so they automatically pick up the overridden CSS variables.

**`previews/button-preview.tsx`**:
```tsx
import { Button } from "@/components/ui/button"

export function ButtonPreview() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm">Default</Button>
        <Button size="sm" variant="outline">Outline</Button>
        <Button size="sm" variant="secondary">Secondary</Button>
        <Button size="sm" variant="ghost">Ghost</Button>
        <Button size="sm" variant="destructive">Destructive</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="xs">XS</Button>
        <Button size="sm">SM</Button>
        <Button>MD</Button>
        <Button size="lg">LG</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled Outline</Button>
      </div>
    </div>
  )
}
```

**`previews/badge-preview.tsx`**:
```tsx
import { Badge } from "@/components/ui/badge"

export function BadgePreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="critical">Critical</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  )
}
```

**`previews/card-preview.tsx`**:
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export function CardPreview() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description with secondary text.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input placeholder="Type something..." />
        <p className="text-xs text-fg-muted">
          This is muted text inside the card content area.
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-fg-subtle">Footer</span>
        <Button size="sm" className="ml-auto">Save</Button>
      </CardFooter>
    </Card>
  )
}
```

**`previews/input-preview.tsx`**:
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputPreview() {
  return (
    <div className="space-y-3 max-w-xs">
      <div className="space-y-1">
        <Label htmlFor="demo-input">Label</Label>
        <Input id="demo-input" placeholder="Default input" />
      </div>
      <Input placeholder="Disabled" disabled />
      <Input placeholder="With value" defaultValue="Hello world" />
    </div>
  )
}
```

**`previews/table-preview.tsx`**:
```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const rows = [
  { name: "Acme Corp", status: "Active", amount: "$12,500" },
  { name: "Globex Inc", status: "Pending", amount: "$8,200" },
  { name: "Wayne Ent.", status: "Active", amount: "$24,300" },
]

export function TablePreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-edge">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>
                <Badge variant={row.status === "Active" ? "success" : "warning"} size="xs">
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

**`previews/alert-preview.tsx`**:
```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function AlertPreview() {
  return (
    <div className="space-y-2 max-w-md">
      <Alert>
        <AlertTitle>Default alert</AlertTitle>
        <AlertDescription>This is a default alert message.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    </div>
  )
}
```

**`previews/index.ts`** (barrel with registry):
```ts
import type { PreviewEntry } from "../preview-registry"
import { ButtonPreview } from "./button-preview"
import { BadgePreview } from "./badge-preview"
import { CardPreview } from "./card-preview"
import { InputPreview } from "./input-preview"
import { TablePreview } from "./table-preview"
import { AlertPreview } from "./alert-preview"

export const PREVIEW_REGISTRY: PreviewEntry[] = [
  { id: "button", label: "Button", component: ButtonPreview, defaultActive: true },
  { id: "badge", label: "Badge", component: BadgePreview, defaultActive: true },
  { id: "card", label: "Card", component: CardPreview, defaultActive: true },
  { id: "input", label: "Input", component: InputPreview, defaultActive: true },
  { id: "table", label: "Table", component: TablePreview, defaultActive: true },
  { id: "alert", label: "Alert", component: AlertPreview, defaultActive: false },
]
```

**Step 3: Commit**

```bash
git add components/features/playground/preview-registry.ts components/features/playground/previews/
git commit -m "feat(playground): add preview registry with 6 component previews"
```

---

### Task 4: Create PlaygroundSidebar component

**Files:**
- Create: `components/features/playground/playground-sidebar.tsx`

**Dependencies:** Task 1, Task 2

**Step 1: Write the PlaygroundSidebar**

The sidebar contains: preset picker, light/dark toggle, collapsible token groups with TokenColorInput, density sliders, and export button.

```tsx
"use client"

import { useState } from "react"
import { Check, ChevronDown, Copy, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  TOKEN_GROUPS,
  PRESETS,
  DENSITY_TOKENS,
  oklchToString,
  generateExportCss,
  type TokenKey,
  type TokenValues,
  type PresetName,
  type OklchColor,
  type DensityValues,
} from "@/components/features/docs/theme-editor/theme-presets"
import { TokenColorInput } from "./token-color-input"

interface PlaygroundSidebarProps {
  presetName: PresetName
  mode: "light" | "dark"
  tokens: TokenValues
  densityValues: DensityValues
  lightTokens: TokenValues
  darkTokens: TokenValues
  onPresetChange: (name: PresetName) => void
  onModeChange: (mode: "light" | "dark") => void
  onTokenChange: (key: TokenKey, color: OklchColor) => void
  onDensityChange: (key: string, value: number) => void
}

export function PlaygroundSidebar({
  presetName,
  mode,
  tokens,
  densityValues,
  lightTokens,
  darkTokens,
  onPresetChange,
  onModeChange,
  onTokenChange,
  onDensityChange,
}: PlaygroundSidebarProps) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const handleExport = async () => {
    const css = generateExportCss(lightTokens, darkTokens, densityValues)
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-edge bg-surface">
      {/* Header: Presets + Mode */}
      <div className="space-y-2 border-b border-edge p-3">
        {/* Preset picker */}
        <div className="flex items-center gap-0.5 rounded-lg border border-edge-subtle bg-raised p-0.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => onPresetChange(p.name)}
              className={cn(
                "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                presetName === p.name
                  ? "bg-surface text-fg shadow-sm"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Light / Dark toggle */}
        <div className="flex items-center gap-0.5 rounded-lg border border-edge-subtle bg-raised p-0.5">
          <button
            type="button"
            onClick={() => onModeChange("light")}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
              mode === "light"
                ? "bg-surface text-fg shadow-sm"
                : "text-fg-muted hover:text-fg",
            )}
          >
            <Sun className="size-3" />
            Light
          </button>
          <button
            type="button"
            onClick={() => onModeChange("dark")}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
              mode === "dark"
                ? "bg-surface text-fg shadow-sm"
                : "text-fg-muted hover:text-fg",
            )}
          >
            <Moon className="size-3" />
            Dark
          </button>
        </div>
      </div>

      {/* Token groups (scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {TOKEN_GROUPS.map((group) => {
          const isCollapsed = collapsed[group.title]
          return (
            <div key={group.title}>
              <button
                type="button"
                onClick={() => toggleSection(group.title)}
                className="flex w-full items-center gap-1 py-1.5 text-xs font-semibold uppercase tracking-wider text-fg-muted hover:text-fg"
              >
                <ChevronDown
                  className={cn(
                    "size-3 transition-transform",
                    isCollapsed && "-rotate-90",
                  )}
                />
                {group.title}
              </button>
              {!isCollapsed && (
                <div className="space-y-1.5 pb-3 pl-1">
                  {group.tokens.map((tokenKey) => (
                    <TokenColorInput
                      key={tokenKey}
                      label={tokenKey}
                      color={tokens[tokenKey]}
                      onChange={(color) => onTokenChange(tokenKey, color)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Density */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection("Density")}
            className="flex w-full items-center gap-1 py-1.5 text-xs font-semibold uppercase tracking-wider text-fg-muted hover:text-fg"
          >
            <ChevronDown
              className={cn(
                "size-3 transition-transform",
                collapsed.Density && "-rotate-90",
              )}
            />
            Density & Spacing
          </button>
          {!collapsed.Density && (
            <div className="space-y-2 pb-3 pl-1">
              {DENSITY_TOKENS.map((token) => {
                const decimals = token.unit === "rem" ? 3 : token.step < 1 ? 1 : 0
                return (
                  <div key={token.key} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-fg-muted">{token.label}</span>
                      <span className="text-2xs font-mono text-fg-subtle tabular-nums">
                        {densityValues[token.key].toFixed(decimals)}{token.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={token.min}
                      max={token.max}
                      step={token.step}
                      value={densityValues[token.key]}
                      onChange={(e) => onDensityChange(token.key, Number.parseFloat(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Export */}
      <div className="border-t border-edge p-3">
        <Button variant="outline" size="sm" onClick={handleExport} className="w-full gap-1.5">
          {copied ? (
            <>
              <Check className="size-3 text-positive" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Export CSS
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
```

**Step 2: Commit**

```bash
git add components/features/playground/playground-sidebar.tsx
git commit -m "feat(playground): add PlaygroundSidebar with token editor"
```

---

### Task 5: Create PlaygroundPreview component

**Files:**
- Create: `components/features/playground/playground-preview.tsx`

**Dependencies:** Task 3

**Step 1: Write the PlaygroundPreview**

Main area with topbar (search + active component chips) and scrollable preview grid.

```tsx
"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { PREVIEW_REGISTRY } from "./preview-registry"

interface PlaygroundPreviewProps {
  className?: string
}

export function PlaygroundPreview({ className }: PlaygroundPreviewProps) {
  const [activeIds, setActiveIds] = useState<Set<string>>(
    () => new Set(PREVIEW_REGISTRY.filter((e) => e.defaultActive).map((e) => e.id)),
  )
  const [search, setSearch] = useState("")

  const filteredRegistry = useMemo(() => {
    if (!search.trim()) return PREVIEW_REGISTRY
    const q = search.toLowerCase()
    return PREVIEW_REGISTRY.filter((e) => e.label.toLowerCase().includes(q))
  }, [search])

  const toggleComponent = (id: string) => {
    setActiveIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const activeEntries = PREVIEW_REGISTRY.filter((e) => activeIds.has(e.id))

  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden", className)}>
      {/* Topbar: search + chips */}
      <div className="flex items-center gap-2 border-b border-edge px-4 py-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-fg-subtle" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className="w-full rounded-md border border-edge-subtle bg-raised py-1 pl-7 pr-2 text-xs text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none"
          />
        </div>

        {/* Component chips from search results */}
        <div className="flex flex-wrap items-center gap-1">
          {filteredRegistry.map((entry) => {
            const isActive = activeIds.has(entry.id)
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => toggleComponent(entry.id)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-2xs font-medium transition-colors",
                  isActive
                    ? "bg-brand text-brand-fg"
                    : "bg-raised text-fg-muted hover:text-fg",
                )}
              >
                {entry.label}
                {isActive && <X className="size-2.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeEntries.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-fg-muted">
            No components selected. Use the search bar to add components.
          </div>
        ) : (
          <div className="space-y-6">
            {activeEntries.map((entry) => {
              const Comp = entry.component
              return (
                <section key={entry.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-fg">{entry.label}</h3>
                    <button
                      type="button"
                      onClick={() => toggleComponent(entry.id)}
                      className="text-fg-subtle hover:text-fg transition-colors"
                      aria-label={`Remove ${entry.label}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <div className="rounded-lg border border-edge bg-surface p-4">
                    <Comp />
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/features/playground/playground-preview.tsx
git commit -m "feat(playground): add PlaygroundPreview with search and toggle"
```

---

### Task 6: Assemble the playground page

**Files:**
- Modify: `app/playground/page.tsx` (full rewrite)

**Dependencies:** Task 4, Task 5

**Step 1: Rewrite the playground page**

Wire everything together: state management at the page level, pass tokens down to sidebar and preview.

```tsx
"use client"

import * as React from "react"
import {
  PRESETS,
  tokensToInlineStyles,
  densityToInlineStyles,
  getDefaultDensity,
  type TokenKey,
  type TokenValues,
  type PresetName,
  type OklchColor,
  type DensityValues,
} from "@/components/features/docs/theme-editor/theme-presets"
import { PlaygroundSidebar } from "@/components/features/playground/playground-sidebar"
import { PlaygroundPreview } from "@/components/features/playground/playground-preview"

export default function PlaygroundPage() {
  const [presetName, setPresetName] = React.useState<PresetName>("slate")
  const [lightTokens, setLightTokens] = React.useState<TokenValues>(() =>
    structuredClone(PRESETS[0].light),
  )
  const [darkTokens, setDarkTokens] = React.useState<TokenValues>(() =>
    structuredClone(PRESETS[0].dark),
  )
  const [densityValues, setDensityValues] = React.useState<DensityValues>(getDefaultDensity)
  const [mode, setMode] = React.useState<"light" | "dark">("dark")

  const tokens = mode === "light" ? lightTokens : darkTokens
  const setTokens = mode === "light" ? setLightTokens : setDarkTokens

  const handlePresetChange = (name: PresetName) => {
    const p = PRESETS.find((x) => x.name === name)!
    setPresetName(name)
    setLightTokens(structuredClone(p.light))
    setDarkTokens(structuredClone(p.dark))
  }

  const handleTokenChange = (key: TokenKey, color: OklchColor) => {
    setTokens((prev) => ({ ...prev, [key]: color }))
  }

  const handleDensityChange = (key: string, value: number) => {
    setDensityValues((prev) => ({ ...prev, [key]: value }))
  }

  const inlineStyles: React.CSSProperties = {
    ...tokensToInlineStyles(tokens),
    ...densityToInlineStyles(densityValues),
    colorScheme: mode,
    fontSize: `${densityValues["base-font-size"]}px`,
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <PlaygroundSidebar
        presetName={presetName}
        mode={mode}
        tokens={tokens}
        densityValues={densityValues}
        lightTokens={lightTokens}
        darkTokens={darkTokens}
        onPresetChange={handlePresetChange}
        onModeChange={setMode}
        onTokenChange={handleTokenChange}
        onDensityChange={handleDensityChange}
      />

      {/* Preview area with token overrides */}
      <div className="flex-1 overflow-hidden" style={inlineStyles}>
        <PlaygroundPreview />
      </div>
    </div>
  )
}
```

**Step 2: Verify it compiles**

Run: `npx next build --no-lint 2>&1 | head -20` or `npx next dev` and visit `/playground`

**Step 3: Commit**

```bash
git add app/playground/page.tsx
git commit -m "feat(playground): full-screen token editor with sidebar + preview"
```

---

### Task 7: Visual polish and QA

**Files:**
- Modify: various files from Tasks 1-6

**Step 1: Manual QA checklist**

Visit `/playground` and verify:
- [ ] Sidebar preset picker switches between Slate, Corporate, Warm
- [ ] Light/Dark toggle works — preview re-renders with correct tokens
- [ ] Clicking a color swatch opens the native color picker
- [ ] Changing a color in the picker updates the preview in real time
- [ ] Editing the oklch text input updates the swatch and preview
- [ ] Density sliders change row height, padding, radius in the table preview
- [ ] Search bar filters the component chips
- [ ] Toggling chips adds/removes components from preview
- [ ] Export CSS copies valid CSS to clipboard
- [ ] Collapsible sections in sidebar work (toggle arrow)
- [ ] Page scrolls properly (sidebar scrolls independently from preview)
- [ ] No console errors

**Step 2: Fix any issues found**

**Step 3: Final commit**

```bash
git add -A
git commit -m "fix(playground): visual polish and QA fixes"
```

---

## File Summary

| File | Action |
|------|--------|
| `components/features/playground/color-utils.ts` | Create |
| `components/features/playground/token-color-input.tsx` | Create |
| `components/features/playground/preview-registry.ts` | Create |
| `components/features/playground/previews/button-preview.tsx` | Create |
| `components/features/playground/previews/badge-preview.tsx` | Create |
| `components/features/playground/previews/card-preview.tsx` | Create |
| `components/features/playground/previews/input-preview.tsx` | Create |
| `components/features/playground/previews/table-preview.tsx` | Create |
| `components/features/playground/previews/alert-preview.tsx` | Create |
| `components/features/playground/previews/index.ts` | Create |
| `components/features/playground/playground-sidebar.tsx` | Create |
| `components/features/playground/playground-preview.tsx` | Create |
| `app/playground/page.tsx` | Rewrite |

**Total: 12 new files + 1 rewrite**
