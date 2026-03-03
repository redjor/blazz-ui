# LLM Documentation — Design

**Date:** 2026-03-03
**Status:** Approved
**Scope:** Dual-audience LLM-friendly documentation for @blazz/ui

---

## Problem

LLMs (Claude Code, Cursor, Copilot) generate incorrect @blazz/ui code because:
- They don't know the `items` prop is required on `Select` → display raw values instead of labels
- They use `asChild` instead of `render={}` (Base UI, not Radix)
- They use `<input type="date">` instead of `<DateSelector>`
- They don't know which named exports to import for composite components
- They invent layout structure instead of using `AppFrame`/`AppSidebar` patterns

---

## Audiences

1. **Public** — customers' AI coding assistants (Claude Code, Cursor, Copilot) when building apps with @blazz/ui
2. **Internal** — this project's Claude Code when working on the monorepo

---

## Architecture

```
apps/docs/src/data/
  components/
    select.ts           ← data file per priority component (~30 total)
    button.ts
    dialog.ts
    date-selector.ts
    combobox.ts
    ...
  registry.ts           ← imports all data files, exports unified array

apps/docs/scripts/
  generate-llms.ts      ← reads registry → generates both outputs

apps/docs/public/
  llms.txt              ← public output (llmstxt.org standard)

packages/ui/
  AI.md                 ← internal output (Claude Code context)
```

---

## Data File Schema

Each component gets a `.ts` file in `apps/docs/src/data/components/`:

```ts
import type { DocProp } from "~/components/docs/doc-props-table"

export const selectData = {
  name: "Select",
  category: "ui" as const,
  description: "Dropdown pour sélectionner une valeur unique dans une liste.",
  docPath: "/docs/components/ui/select",

  imports: {
    path: "@blazz/ui/components/ui/select",
    named: ["Select", "SelectTrigger", "SelectValue", "SelectContent", "SelectItem", "SelectGroup", "SelectLabel"],
  },

  props: [
    {
      name: "items",
      type: "Array<{ value: string; label: string }>",
      description: "Requis fonctionnellement — sans ce prop, SelectValue affiche la value brute.",
    },
    // ...
  ] satisfies DocProp[],

  // Non-optionnel — au moins un gotcha par composant
  gotchas: [
    "ALWAYS pass `items` prop — without it SelectValue renders raw value ('active') not label ('Active')",
    "Use `render={<Button />}` not `asChild` on trigger components — this is Base UI, not Radix",
  ],

  canonicalExample: `
<Select
  items={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
  value={status}
  onValueChange={setStatus}
>
  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
  </SelectContent>
</Select>`.trim(),
}
```

**Rules:**
- `props` uses existing `DocProp` type — doc pages import from this file, zero duplication
- `gotchas` is required — minimum one entry per component
- `imports.named` lists all sub-components so LLMs know exactly what to import
- `canonicalExample` is a JSX string — kept minimal, must be updated when API changes
- `category` is typed as const for registry type safety

---

## Registry

```ts
// apps/docs/src/data/registry.ts
import { selectData } from "./components/select"
import { buttonData } from "./components/button"
// ...

export const registry = [
  selectData,
  buttonData,
  // ...
] as const

export type ComponentData = typeof registry[number]
```

---

## Output Formats

### `public/llms.txt` (llmstxt.org standard)

```markdown
# @blazz/ui

> AI-native React component kit for data-heavy pro apps.

## Critical Rules

- ALL trigger components use `render={<Component />}` NOT `asChild` (Base UI, not Radix)
- DateSelector NOT `<input type="date">` — import from @blazz/ui/components/ui/date-selector
- Select/Combobox: `items` prop is ALWAYS required to show labels instead of raw values
- Import paths: `@blazz/ui/components/{category}/{name}` — not from barrel `@blazz/ui`

---

## Select

Import: `@blazz/ui/components/ui/select`
Named: `Select, SelectTrigger, SelectValue, SelectContent, SelectItem`
Docs: https://blazz.io/docs/components/ui/select

Dropdown pour sélectionner une valeur unique.

⚠️ `items` prop obligatoire — sans lui, SelectValue affiche "active" au lieu de "Active"
⚠️ Base UI — `render={<Button />}` jamais `asChild`

Props: items (Array<{value,label}>), value (string), onValueChange (fn), disabled (boolean)

\`\`\`tsx
<Select items={[{ value: "active", label: "Active" }]} value={v} onValueChange={setV}>
  <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
  <SelectContent><SelectItem value="active">Active</SelectItem></SelectContent>
</Select>
\`\`\`
```

### `packages/ui/AI.md` (internal Claude Code context)

```markdown
# @blazz/ui — AI Context

## Critical patterns (read before generating code)

### 1. Select — ALWAYS pass items
\`\`\`tsx
<Select items={[{ value: "id", label: "Display Name" }]} value={v} onValueChange={setV}>
\`\`\`

### 2. Triggers — render={} not asChild (Base UI)
\`\`\`tsx
<DialogTrigger render={<Button />}>Open</DialogTrigger>   // ✅
<DialogTrigger asChild><Button /></DialogTrigger>          // ❌
\`\`\`

### 3. Dates — DateSelector not input type="date"
\`\`\`tsx
import { DateSelector } from "@blazz/ui/components/ui/date-selector"
<DateSelector value={date} onValueChange={setDate} />
\`\`\`

## Component index
| Component | Import path | Key gotcha |
|-----------|-------------|------------|
| Select | .../ui/select | items required |
| Dialog | .../ui/dialog | render={} not asChild |
| DateSelector | .../ui/date-selector | never input type="date" |
...
```

---

## Generator Script

`apps/docs/scripts/generate-llms.ts`

- Imports registry from `../src/data/registry.ts`
- Renders `llms.txt` → writes to `../public/llms.txt`
- Renders `AI.md` → writes to `../../../packages/ui/AI.md`
- Run via `pnpm generate:llms` in `apps/docs/`
- Integrated in `pnpm build` pipeline (runs before vite build)

---

## Priority Components (~30)

### UI — Forms (8)
`Select`, `DateSelector`, `Combobox`, `Input`, `Textarea`, `Checkbox`, `Switch`, `RadioGroup`

### UI — Overlays (6)
`Dialog`, `Sheet`, `DropdownMenu`, `Popover`, `Tooltip`, `ConfirmationDialog`

### UI — Primitives (5)
`Button`, `Badge`, `Avatar`, `Tabs`, `Skeleton`

### Patterns (6)
`AppFrame`, `AppSidebar`, `AppTopBar`, `FormField`, `FieldGrid`, `PageHeaderShell`

### Blocks (5)
`DataTable`, `StatsGrid`, `FilterBar`, `DetailPanel`, `ActivityTimeline`

---

## Migration Strategy

- Component doc pages with a data file: import `props` from the data file (remove inline `DocProp[]`)
- Component doc pages without a data file: keep inline `DocProp[]` unchanged
- No big-bang migration — data files added incrementally per component

---

## Out of Scope

- AI category components (deferred — complex, lower ROI)
- Automatic TypeScript prop extraction (fragile, rejected in design phase)
- Real-time generation / API endpoint (static file is sufficient)
