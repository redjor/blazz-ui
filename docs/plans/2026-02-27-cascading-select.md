# Cascading Select Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a drill-down hierarchical select component (`CascadingSelect` primitive + `CategorySelect` block) with breadcrumb navigation, allowing users to select any node at any depth in a recursive tree.

**Architecture:** `Popover` + custom drill-down state (`path: CascadingSelectNode[]`) as a `ui/` primitive; a `blocks/` wrapper adds react-hook-form integration. The doc page follows the exact pattern of `apps/docs/src/routes/_docs/docs/components/ui/combobox.tsx`.

**Tech Stack:** React 19, TypeScript strict, Tailwind v4, Lucide icons, Radix Popover (via existing `ui/popover`), react-hook-form (block only).

---

## Task 1: Create `ui/cascading-select.tsx` primitive

**Files:**
- Create: `packages/ui/src/components/ui/cascading-select.tsx`

**Step 1: Create the file with this exact content**

```tsx
"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface CascadingSelectNode {
  id: string
  label: string
  children?: CascadingSelectNode[]
}

export interface CascadingSelectProps {
  nodes: CascadingSelectNode[]
  value?: string
  onValueChange?: (id: string) => void
  placeholder?: string
  className?: string
}

function findPath(
  nodes: CascadingSelectNode[],
  id: string
): CascadingSelectNode[] | null {
  for (const node of nodes) {
    if (node.id === id) return [node]
    if (node.children) {
      const sub = findPath(node.children, id)
      if (sub) return [node, ...sub]
    }
  }
  return null
}

export function CascadingSelect({
  nodes,
  value,
  onValueChange,
  placeholder = "Select...",
  className,
}: CascadingSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [path, setPath] = React.useState<CascadingSelectNode[]>([])

  const currentItems =
    path.length === 0 ? nodes : (path[path.length - 1].children ?? [])

  const selectedPath = value ? findPath(nodes, value) : null
  const triggerLabel = selectedPath
    ? selectedPath.map((n) => n.label).join(" › ")
    : placeholder

  function handleSelect(node: CascadingSelectNode) {
    onValueChange?.(node.id)
    setOpen(false)
  }

  function handleDrillDown(e: React.MouseEvent, node: CascadingSelectNode) {
    e.stopPropagation()
    setPath((prev) => [...prev, node])
  }

  function handleBack() {
    setPath((prev) => prev.slice(0, -1))
  }

  function handleBreadcrumbJump(index: number) {
    setPath(path.slice(0, index + 1))
  }

  React.useEffect(() => {
    if (!open) setPath([])
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "focus-visible:border-brand focus-visible:ring-brand/20 border-field bg-surface hover:bg-raised hover:text-fg aria-expanded:bg-raised aria-expanded:text-fg rounded-lg border bg-clip-padding text-sm font-medium focus-visible:ring-[3px] inline-flex items-center justify-between whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none select-none gap-1.5 px-2.5 h-8 w-full",
          !selectedPath && "text-fg-muted",
          className
        )}
        aria-expanded={open}
      >
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        {path.length > 0 && (
          <div className="flex items-center gap-1.5 border-b border-edge px-2 py-2">
            <button
              type="button"
              onClick={handleBack}
              className="text-fg-muted hover:text-fg rounded p-0.5 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {path.map((node, i) => (
              <React.Fragment key={node.id}>
                {i > 0 && (
                  <ChevronRight className="h-3 w-3 shrink-0 text-fg-muted" />
                )}
                {i < path.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => handleBreadcrumbJump(i)}
                    className="text-xs text-fg-muted transition-colors hover:text-fg"
                  >
                    {node.label}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-fg">
                    {node.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="max-h-64 overflow-y-auto py-1">
          {currentItems.length === 0 ? (
            <p className="px-3 py-2 text-xs text-fg-muted">No items</p>
          ) : (
            currentItems.map((node) => (
              <div key={node.id} className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => handleSelect(node)}
                  className={cn(
                    "flex-1 rounded-l-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-raised",
                    value === node.id && "font-medium text-brand"
                  )}
                >
                  {node.label}
                </button>
                {node.children?.length ? (
                  <button
                    type="button"
                    onClick={(e) => handleDrillDown(e, node)}
                    className="rounded-r-md border-l border-edge/40 px-2.5 py-1.5 text-fg-muted transition-colors hover:bg-raised hover:text-fg"
                    aria-label={`Expand ${node.label}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/ui && pnpm tsc --noEmit
```
Expected: no errors related to the new file.

**Step 3: Commit**

```bash
git add packages/ui/src/components/ui/cascading-select.tsx
git commit -m "feat(ui): add CascadingSelect primitive"
```

---

## Task 2: Create `blocks/category-select.tsx` form block

**Files:**
- Create: `packages/ui/src/components/blocks/category-select.tsx`

**Step 1: Create the file**

```tsx
"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Label } from "../ui/label"
import { cn } from "../../lib/utils"
import {
  CascadingSelect,
  type CascadingSelectNode,
} from "../ui/cascading-select"

export interface CategorySelectProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>
  label: string
  control: Control<TFieldValues>
  nodes: CascadingSelectNode[]
  placeholder?: string
  description?: string
  required?: boolean
  className?: string
}

export function CategorySelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  control,
  nodes,
  placeholder,
  description,
  required,
  className,
}: CategorySelectProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("space-y-1.5", className)}>
          <Label htmlFor={name}>
            {label}
            {required && <span className="ml-0.5 text-negative">*</span>}
          </Label>
          <CascadingSelect
            nodes={nodes}
            value={field.value ?? ""}
            onValueChange={field.onChange}
            placeholder={placeholder}
          />
          {description && !fieldState.error && (
            <p className="text-xs text-fg-muted">{description}</p>
          )}
          {fieldState.error && (
            <p className="text-xs text-negative">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  )
}
```

**Step 2: Commit**

```bash
git add packages/ui/src/components/blocks/category-select.tsx
git commit -m "feat(blocks): add CategorySelect form block"
```

---

## Task 3: Add exports to `packages/ui/src/index.ts`

**Files:**
- Modify: `packages/ui/src/index.ts`

**Step 1: Add primitive export**

Find the line `export * from "./components/ui/combobox"` (line ~20) and add the cascading-select export right after it:

```ts
export * from "./components/ui/cascading-select"
```

**Step 2: Add block export**

Find the line `export * from "./components/blocks/form-field"` (line ~91) and add after it:

```ts
export * from "./components/blocks/category-select"
```

**Step 3: Verify build**

```bash
cd packages/ui && pnpm tsc --noEmit
```
Expected: no errors.

**Step 4: Commit**

```bash
git add packages/ui/src/index.ts
git commit -m "feat(ui): export CascadingSelect and CategorySelect"
```

---

## Task 4: Add to docs navigation config

**Files:**
- Modify: `apps/docs/src/config/navigation.ts`

**Step 1: Add nav entry**

Find the `comp-forms` items array. Find the line with `Combobox` entry (around line 74):

```ts
{ title: "Combobox", url: "/docs/components/ui/combobox", keywords: [...] },
```

Add right after it:

```ts
{ title: "Cascading Select", url: "/docs/components/ui/cascading-select", keywords: ["hierarchy", "drill-down", "nested select", "cascading", "tree select", "category picker"] },
```

**Step 2: Commit**

```bash
git add apps/docs/src/config/navigation.ts
git commit -m "docs: add Cascading Select to navigation"
```

---

## Task 5: Create doc page

**Files:**
- Create: `apps/docs/src/routes/_docs/docs/components/ui/cascading-select.tsx`

**Step 1: Create the file**

Model: `apps/docs/src/routes/_docs/docs/components/ui/combobox.tsx`. Use TanStack Router `createFileRoute`, `DocPage`, `DocSection`, `DocHero`, `DocExampleClient`, `DocPropsTable`, `DocRelated`.

```tsx
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { CascadingSelect, type CascadingSelectNode } from "@blazz/ui/components/ui/cascading-select"
import { Label } from "@blazz/ui/components/ui/label"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const PRODUCT_CATEGORIES: CascadingSelectNode[] = [
  {
    id: "boissons",
    label: "Boissons",
    children: [
      {
        id: "alcools",
        label: "Alcools",
        children: [
          { id: "aperitifs", label: "Apéritifs" },
          { id: "vins", label: "Vins" },
          { id: "bières", label: "Bières" },
        ],
      },
      { id: "eaux", label: "Eaux" },
      { id: "jus", label: "Jus de fruits" },
      { id: "sodas", label: "Sodas & Soft drinks" },
    ],
  },
  {
    id: "alimentation",
    label: "Alimentation",
    children: [
      {
        id: "frais",
        label: "Frais",
        children: [
          { id: "viandes", label: "Viandes" },
          { id: "poissons", label: "Poissons" },
          { id: "produits-laitiers", label: "Produits laitiers" },
        ],
      },
      { id: "epicerie", label: "Épicerie" },
      { id: "surgeles", label: "Surgelés" },
    ],
  },
  {
    id: "electronique",
    label: "Électronique",
    children: [
      { id: "smartphones", label: "Smartphones" },
      { id: "ordinateurs", label: "Ordinateurs" },
      { id: "audio", label: "Audio" },
    ],
  },
]

const GEOGRAPHIC: CascadingSelectNode[] = [
  {
    id: "france",
    label: "France",
    children: [
      {
        id: "ile-de-france",
        label: "Île-de-France",
        children: [
          { id: "paris", label: "Paris" },
          { id: "versailles", label: "Versailles" },
        ],
      },
      {
        id: "paca",
        label: "PACA",
        children: [
          { id: "marseille", label: "Marseille" },
          { id: "nice", label: "Nice" },
        ],
      },
    ],
  },
  {
    id: "belgique",
    label: "Belgique",
    children: [
      { id: "bruxelles", label: "Bruxelles" },
      { id: "liege", label: "Liège" },
    ],
  },
]

const examples = [
  {
    key: "default",
    code: `const [value, setValue] = React.useState("")

<CascadingSelect
  nodes={categories}
  value={value}
  onValueChange={setValue}
  placeholder="Select a category..."
/>`,
  },
  {
    key: "with-label",
    code: `<div className="space-y-1.5">
  <Label>Category <span className="text-negative">*</span></Label>
  <CascadingSelect
    nodes={categories}
    value={value}
    onValueChange={setValue}
    placeholder="Select a category..."
  />
</div>`,
  },
  {
    key: "geographic",
    code: `<CascadingSelect
  nodes={geographicZones}
  value={value}
  onValueChange={setValue}
  placeholder="Select a region..."
/>`,
  },
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/cascading-select")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map(async (ex) => ({
        key: ex.key,
        html: await highlightCode({ data: { code: ex.code } }),
      }))
    )
    return { highlighted }
  },
  component: CascadingSelectPage,
})

const toc = [
  { id: "examples", title: "Examples" },
  { id: "props", title: "Props" },
  { id: "guidelines", title: "Guidelines" },
  { id: "related", title: "Related" },
]

const cascadingSelectProps: DocProp[] = [
  {
    name: "nodes",
    type: "CascadingSelectNode[]",
    description:
      "Root-level nodes of the tree. Each node has id, label, and optional children array.",
  },
  {
    name: "value",
    type: "string",
    description: "The controlled selected node id.",
  },
  {
    name: "onValueChange",
    type: "(id: string) => void",
    description: "Callback fired when the user selects a node.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Select..."',
    description: "Text shown in the trigger when no value is selected.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes for the trigger button.",
  },
]

/* ── Demo components ── */

function DefaultDemo() {
  const [value, setValue] = React.useState("")
  return (
    <div className="w-[300px]">
      <CascadingSelect
        nodes={PRODUCT_CATEGORIES}
        value={value}
        onValueChange={setValue}
        placeholder="Select a category..."
      />
    </div>
  )
}

function WithLabelDemo() {
  const [value, setValue] = React.useState("aperitifs")
  return (
    <div className="w-[300px] space-y-1.5">
      <Label>
        Category <span className="text-negative">*</span>
      </Label>
      <CascadingSelect
        nodes={PRODUCT_CATEGORIES}
        value={value}
        onValueChange={setValue}
        placeholder="Select a category..."
      />
    </div>
  )
}

function GeographicDemo() {
  const [value, setValue] = React.useState("")
  return (
    <div className="w-[300px]">
      <CascadingSelect
        nodes={GEOGRAPHIC}
        value={value}
        onValueChange={setValue}
        placeholder="Select a region..."
      />
    </div>
  )
}

function CascadingSelectPage() {
  const { highlighted } = Route.useLoaderData()
  const html = (key: string) =>
    highlighted.find((h) => h.key === key)?.html ?? ""

  return (
    <DocPage
      title="Cascading Select"
      subtitle="A drill-down select for hierarchical data. Navigate level by level with breadcrumb orientation, selecting any node at any depth."
      toc={toc}
    >
      <DocHero>
        <WithLabelDemo />
      </DocHero>

      <DocSection id="examples" title="Examples">
        <DocExampleClient
          title="Default"
          description="Navigate a product category tree. Click a label to select, click › to drill into sub-categories."
          code={examples[0].code}
          highlightedCode={html("default")}
        >
          <DefaultDemo />
        </DocExampleClient>

        <DocExampleClient
          title="With Label and Pre-selected Value"
          description="Pair with a Label component. The trigger shows the full path when a deep node is selected."
          code={examples[1].code}
          highlightedCode={html("with-label")}
        >
          <WithLabelDemo />
        </DocExampleClient>

        <DocExampleClient
          title="Geographic Zones"
          description="Works for any hierarchical data — countries, regions, cities."
          code={examples[2].code}
          highlightedCode={html("geographic")}
        >
          <GeographicDemo />
        </DocExampleClient>
      </DocSection>

      <DocSection id="props" title="Props">
        <DocPropsTable props={cascadingSelectProps} />
      </DocSection>

      <DocSection id="guidelines" title="Guidelines">
        <ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
          <li>
            Use CascadingSelect when data has natural parent-child hierarchy
            (categories, geographies, org structures)
          </li>
          <li>
            Any node at any level is selectable — users are not forced to reach
            leaf nodes
          </li>
          <li>
            The trigger displays the full path (e.g., "Boissons › Alcools ›
            Apéritifs") so the selection is always clear
          </li>
          <li>
            For react-hook-form integration, use the CategorySelect block from
            @blazz/ui/components/blocks/category-select
          </li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <DocRelated
          items={[
            {
              title: "Select",
              href: "/docs/components/ui/select",
              description: "A simple dropdown for flat option lists.",
            },
            {
              title: "Combobox",
              href: "/docs/components/ui/combobox",
              description:
                "A searchable dropdown for large flat option sets.",
            },
            {
              title: "Tree View",
              href: "/docs/components/ui/tree-view",
              description:
                "A full tree display with expand/collapse for complex hierarchies.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
```

**Step 2: Run docs dev server and verify the page renders**

```bash
pnpm dev:docs
```
Open `http://localhost:3100/docs/components/ui/cascading-select`.

Expected:
- Page title "Cascading Select" renders
- Hero shows the WithLabel demo with "Boissons › Alcools › Apéritifs" pre-selected in the trigger
- Clicking the trigger opens the popover with root-level nodes
- Drilling into a node shows the breadcrumb header
- Selecting a node closes the popover and updates the trigger label
- Breadcrumb back navigation works

**Step 3: Commit**

```bash
git add apps/docs/src/routes/_docs/docs/components/ui/cascading-select.tsx
git commit -m "docs: add CascadingSelect doc page with 3 examples"
```

---

## Task 6: Final verification

**Step 1: Run lint**

```bash
pnpm lint
```
Expected: no errors.

**Step 2: Commit summary**

All 4 commits should now be present:
1. `feat(ui): add CascadingSelect primitive`
2. `feat(blocks): add CategorySelect form block`
3. `feat(ui): export CascadingSelect and CategorySelect`
4. `docs: add Cascading Select to navigation`
5. `docs: add CascadingSelect doc page with 3 examples`
