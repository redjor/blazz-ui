# Component Sandbox — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone `apps/sandbox` app that lets you select any @blazz component, play with its props via auto-generated controls, edit children/slots in Monaco, and see live preview.

**Architecture:** Vite + TanStack Start app (same stack as docs). 2-column layout: sidebar with component tree + main area split into preview (top) and tabbed panel (Controls/Code/Examples). A build-time script parses TypeScript types to auto-generate a component registry with prop descriptors.

**Tech Stack:** Vite 7, TanStack Start, React 19, Tailwind v4, Monaco Editor (`@monaco-editor/react`), Sucrase (JSX transpilation), TypeScript Compiler API (type parsing), @blazz/ui + @blazz/pro.

---

### Task 1: Scaffold the app

**Files:**
- Create: `apps/sandbox/package.json`
- Create: `apps/sandbox/tsconfig.json`
- Create: `apps/sandbox/vite.config.ts`
- Create: `apps/sandbox/src/styles/app.css`
- Create: `apps/sandbox/src/routes/__root.tsx`
- Create: `apps/sandbox/src/routes/index.tsx`
- Create: `apps/sandbox/src/router.tsx`
- Create: `apps/sandbox/src/entry-client.tsx`
- Create: `apps/sandbox/src/entry-server.tsx`
- Modify: root `package.json` — add `dev:sandbox` script

**Step 1: Create `apps/sandbox/package.json`**

```json
{
  "name": "sandbox",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "biome check .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@blazz/pro": "workspace:*",
    "@blazz/ui": "workspace:*",
    "@monaco-editor/react": "^4.7.0",
    "@tanstack/react-router": "^1.166.7",
    "@tanstack/react-start": "^1.166.8",
    "class-variance-authority": "^0.7.1",
    "lucide-react": "^0.562.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "sucrase": "^3.35.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4",
    "@types/node": "^20",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4",
    "nitro": "3.0.1-alpha.2",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vite": "^7",
    "vite-tsconfig-paths": "^4"
  }
}
```

**Step 2: Create `apps/sandbox/tsconfig.json`**

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
      "@blazz/ui/*": ["../../packages/ui/src/*"],
      "@blazz/pro": ["../../packages/pro/src"],
      "@blazz/pro/*": ["../../packages/pro/src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "vite.config.ts"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create `apps/sandbox/vite.config.ts`**

```ts
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  server: { port: 3130 },
  resolve: {
    alias: [
      {
        find: /^@blazz\/ui(\/.*)?$/,
        replacement: `${path.resolve(__dirname, "../../packages/ui/src")}$1`,
      },
      {
        find: /^@blazz\/pro(\/.*)?$/,
        replacement: `${path.resolve(__dirname, "../../packages/pro/src")}$1`,
      },
    ],
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({ srcDirectory: "src" }),
    nitro(),
    viteReact(),
  ],
})
```

**Step 4: Create `apps/sandbox/src/styles/app.css`**

```css
@import "tailwindcss";
@import "@blazz/ui/styles/tokens.css";

@source "../../../../packages/ui/src/**/*.{ts,tsx}";
@source "../../../../packages/pro/src/**/*.{ts,tsx}";
```

**Step 5: Create TanStack Start boilerplate files**

`apps/sandbox/src/router.tsx`:
```tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export function createRouter() {
  return createTanStackRouter({ routeTree })
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

`apps/sandbox/src/entry-client.tsx`:
```tsx
import { hydrateRoot } from "react-dom/client"
import { StartClient } from "@tanstack/react-start/client"
import { createRouter } from "./router"

const router = createRouter()

hydrateRoot(document, <StartClient router={router} />)
```

`apps/sandbox/src/entry-server.tsx`:
```tsx
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server"
import { createRouter } from "./router"

export default createStartHandler({ createRouter })(defaultStreamHandler)
```

`apps/sandbox/src/routes/__root.tsx`:
```tsx
import { Outlet, createRootRoute } from "@tanstack/react-router"
import "~/styles/app.css"

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Blazz Sandbox" },
    ],
  }),
})

function RootComponent() {
  return (
    <html lang="en" className="dark">
      <head />
      <body className="bg-surface text-fg antialiased">
        <Outlet />
      </body>
    </html>
  )
}
```

`apps/sandbox/src/routes/index.tsx`:
```tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">Blazz Sandbox</h1>
      <p className="text-fg-muted mt-2">Select a component from the sidebar.</p>
    </div>
  )
}
```

**Step 6: Add `dev:sandbox` script to root `package.json`**

Add to `scripts`:
```json
"dev:sandbox": "turbo dev --filter=sandbox"
```

**Step 7: Install dependencies and verify dev server starts**

Run:
```bash
cd apps/sandbox && pnpm install
pnpm dev:sandbox
```

Expected: Vite dev server on port 3130, page renders "Blazz Sandbox".

**Step 8: Commit**

```bash
git add apps/sandbox/ package.json pnpm-lock.yaml
git commit -m "feat(sandbox): scaffold app with Vite + TanStack Start"
```

---

### Task 2: Component registry — manual seed

Before building the type-parser script (complex), start with a hand-written registry for ~10 key components. This unblocks all UI work immediately.

**Files:**
- Create: `apps/sandbox/src/lib/registry.ts`
- Create: `apps/sandbox/src/lib/registry-data.ts`

**Step 1: Define registry types in `apps/sandbox/src/lib/registry.ts`**

```ts
export type PropType =
  | "boolean"
  | "string"
  | "number"
  | "union"
  | "enum"
  | "slot"
  | "function"
  | "object"
  | "array"

export type PropGroup = "main" | "style" | "slots" | "callbacks"

export interface PropDescriptor {
  name: string
  type: PropType
  options?: string[]
  default?: unknown
  group: PropGroup
  description?: string
}

export interface ComponentEntry {
  name: string
  slug: string
  category: "ui" | "patterns" | "blocks" | "ai"
  importPath: string
  props: PropDescriptor[]
  defaultCode: string
}

export type Registry = ComponentEntry[]
```

**Step 2: Seed registry with ~10 components in `apps/sandbox/src/lib/registry-data.ts`**

```ts
import type { Registry } from "./registry"

export const registry: Registry = [
  {
    name: "Button",
    slug: "button",
    category: "ui",
    importPath: "@blazz/ui/components/ui/button",
    props: [
      { name: "variant", type: "union", options: ["default", "outline", "secondary", "ghost", "destructive", "link"], default: "default", group: "main" },
      { name: "size", type: "union", options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"], default: "default", group: "main" },
      { name: "disabled", type: "boolean", default: false, group: "main" },
      { name: "children", type: "slot", group: "slots" },
      { name: "className", type: "string", default: "", group: "style" },
      { name: "onClick", type: "function", group: "callbacks" },
    ],
    defaultCode: `<Button variant="default" size="default">Click me</Button>`,
  },
  {
    name: "Badge",
    slug: "badge",
    category: "ui",
    importPath: "@blazz/ui/components/ui/badge",
    props: [
      { name: "variant", type: "union", options: ["default", "secondary", "outline", "destructive", "success", "warning"], default: "default", group: "main" },
      { name: "children", type: "slot", group: "slots" },
      { name: "className", type: "string", default: "", group: "style" },
    ],
    defaultCode: `<Badge variant="default">Badge</Badge>`,
  },
  {
    name: "Input",
    slug: "input",
    category: "ui",
    importPath: "@blazz/ui/components/ui/input",
    props: [
      { name: "placeholder", type: "string", default: "Type here...", group: "main" },
      { name: "disabled", type: "boolean", default: false, group: "main" },
      { name: "type", type: "union", options: ["text", "email", "password", "number", "url", "tel"], default: "text", group: "main" },
      { name: "className", type: "string", default: "", group: "style" },
      { name: "onChange", type: "function", group: "callbacks" },
    ],
    defaultCode: `<Input placeholder="Type here..." />`,
  },
  {
    name: "Switch",
    slug: "switch",
    category: "ui",
    importPath: "@blazz/ui/components/ui/switch",
    props: [
      { name: "checked", type: "boolean", default: false, group: "main" },
      { name: "disabled", type: "boolean", default: false, group: "main" },
      { name: "onCheckedChange", type: "function", group: "callbacks" },
    ],
    defaultCode: `<Switch />`,
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "ui",
    importPath: "@blazz/ui/components/ui/checkbox",
    props: [
      { name: "checked", type: "boolean", default: false, group: "main" },
      { name: "disabled", type: "boolean", default: false, group: "main" },
      { name: "onCheckedChange", type: "function", group: "callbacks" },
    ],
    defaultCode: `<Checkbox />`,
  },
  {
    name: "Slider",
    slug: "slider",
    category: "ui",
    importPath: "@blazz/ui/components/ui/slider",
    props: [
      { name: "defaultValue", type: "number", default: 50, group: "main" },
      { name: "min", type: "number", default: 0, group: "main" },
      { name: "max", type: "number", default: 100, group: "main" },
      { name: "step", type: "number", default: 1, group: "main" },
      { name: "disabled", type: "boolean", default: false, group: "main" },
    ],
    defaultCode: `<Slider defaultValue={[50]} max={100} step={1} />`,
  },
  {
    name: "Card",
    slug: "card",
    category: "ui",
    importPath: "@blazz/ui/components/ui/card",
    props: [
      { name: "children", type: "slot", group: "slots" },
      { name: "className", type: "string", default: "", group: "style" },
    ],
    defaultCode: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>`,
  },
  {
    name: "Avatar",
    slug: "avatar",
    category: "ui",
    importPath: "@blazz/ui/components/ui/avatar",
    props: [
      { name: "className", type: "string", default: "", group: "style" },
    ],
    defaultCode: `<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`,
  },
  {
    name: "Tabs",
    slug: "tabs",
    category: "ui",
    importPath: "@blazz/ui/components/ui/tabs",
    props: [
      { name: "defaultValue", type: "string", default: "tab1", group: "main" },
      { name: "children", type: "slot", group: "slots" },
    ],
    defaultCode: `<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>`,
  },
  {
    name: "Select",
    slug: "select",
    category: "ui",
    importPath: "@blazz/ui/components/ui/select",
    props: [
      { name: "defaultValue", type: "string", default: "", group: "main" },
      { name: "disabled", type: "boolean", default: false, group: "main" },
      { name: "children", type: "slot", group: "slots" },
    ],
    defaultCode: `<Select items={[{ value: "apple", label: "Apple" }, { value: "banana", label: "Banana" }, { value: "cherry", label: "Cherry" }]}>
  <SelectTrigger>
    <SelectValue placeholder="Pick a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry">Cherry</SelectItem>
  </SelectContent>
</Select>`,
  },
]
```

**Step 3: Add helper functions to `registry.ts`**

```ts
import { registry } from "./registry-data"

// ... types above ...

export function getComponent(slug: string): ComponentEntry | undefined {
  return registry.find((c) => c.slug === slug)
}

export function getComponentsByCategory(category: ComponentEntry["category"]): ComponentEntry[] {
  return registry.filter((c) => c.category === category)
}

export function searchComponents(query: string): ComponentEntry[] {
  const q = query.toLowerCase()
  return registry.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q))
}

export { registry }
```

**Step 4: Commit**

```bash
git add apps/sandbox/src/lib/
git commit -m "feat(sandbox): add component registry types and seed data"
```

---

### Task 3: Sidebar — component tree with search & recents

**Files:**
- Create: `apps/sandbox/src/components/component-tree.tsx`
- Create: `apps/sandbox/src/lib/recents.ts`
- Modify: `apps/sandbox/src/routes/__root.tsx` — add sidebar layout

**Step 1: Create `apps/sandbox/src/lib/recents.ts`**

```ts
const STORAGE_KEY = "sandbox:recents"
const MAX_RECENTS = 5

export function getRecents(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function addRecent(slug: string): void {
  const recents = getRecents().filter((s) => s !== slug)
  recents.unshift(slug)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recents.slice(0, MAX_RECENTS)))
}
```

**Step 2: Create `apps/sandbox/src/components/component-tree.tsx`**

Build the sidebar component with:
- Search input at top (autofocus)
- "Recents" section (from localStorage, max 5)
- 4 collapsible category sections: UI, Patterns, Blocks, AI
- Each item is a `<Link>` to `/$category/$slug`
- Active item highlighted with `bg-brand/10 text-brand`
- Badge "modified" if localStorage has persisted state for that component

Use `@blazz/ui` components: `Input` (search), `Collapsible`/`CollapsibleTrigger`/`CollapsibleContent`, `ScrollArea`.

The component should:
- Filter results in real-time as user types in search
- Show all categories expanded when searching
- Show categories collapsed by default when not searching
- Highlight the currently active component via router params

**Step 3: Update `__root.tsx` to include sidebar layout**

Wrap `<Outlet />` in a 2-column flex layout:
- Left: `<ComponentTree />` (w-60, fixed, full height, border-right)
- Right: `<Outlet />` (flex-1)

**Step 4: Verify sidebar renders and navigation works**

Run `pnpm dev:sandbox`, confirm sidebar shows search + 10 seeded components in the UI category.

**Step 5: Commit**

```bash
git add apps/sandbox/src/
git commit -m "feat(sandbox): add sidebar with component tree, search, and recents"
```

---

### Task 4: Preview panel

**Files:**
- Create: `apps/sandbox/src/components/preview-panel.tsx`
- Create: `apps/sandbox/src/components/preview-toolbar.tsx`
- Create: `apps/sandbox/src/components/callback-toast.tsx`
- Create: `apps/sandbox/src/lib/scope.ts`
- Create: `apps/sandbox/src/lib/code-runner.ts`

**Step 1: Create `apps/sandbox/src/lib/scope.ts`**

Export an object containing all @blazz/ui and @blazz/pro components + React hooks + Lucide icons. This scope is injected into the code runner so users don't need import statements in Monaco.

```ts
import * as React from "react"
import * as BlazzUI from "@blazz/ui"
import * as LucideIcons from "lucide-react"

export const scope: Record<string, unknown> = {
  // React
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useMemo: React.useMemo,
  useCallback: React.useCallback,
  Fragment: React.Fragment,

  // All @blazz/ui exports
  ...BlazzUI,

  // Common Lucide icons
  ...LucideIcons,
}
```

Note: @blazz/pro blocks will be added later since they need direct imports.

**Step 2: Create `apps/sandbox/src/lib/code-runner.ts`**

```ts
import { transform } from "sucrase"
import { scope } from "./scope"

interface RunResult {
  element: React.ReactElement | null
  error: string | null
}

export function runCode(code: string, extraScope?: Record<string, unknown>): RunResult {
  try {
    const wrappedCode = `return (${code})`
    const transformed = transform(wrappedCode, {
      transforms: ["jsx", "typescript"],
      jsxRuntime: "classic",
      production: true,
    }).code

    const allScope = { ...scope, ...extraScope }
    const keys = Object.keys(allScope)
    const values = Object.values(allScope)

    const fn = new Function("React", ...keys, transformed)
    const element = fn(scope.React, ...values)

    return { element, error: null }
  } catch (err) {
    return { element: null, error: (err as Error).message }
  }
}
```

**Step 3: Create `apps/sandbox/src/components/callback-toast.tsx`**

A small overlay component that renders in the bottom-right of the preview panel. When a callback fires, it shows a toast with the callback name and args, auto-dismisses after 3s. Uses a simple state array with `useEffect` timers.

**Step 4: Create `apps/sandbox/src/components/preview-toolbar.tsx`**

Toolbar above the preview with:
- Viewport toggle: Desktop (100%) | Tablet (768px) | Mobile (375px) — sets max-width on preview container
- Theme toggle: Light | Dark — toggles `.dark` class on preview wrapper only
- Copy Code button — copies current code to clipboard
- Fullscreen button — opens preview in a dialog/overlay

Use `@blazz/ui` components: `ButtonGroup`, `Button`, `Tooltip`.

**Step 5: Create `apps/sandbox/src/components/preview-panel.tsx`**

The preview panel component:
- Takes `code: string` and `onCallbackFired: (name, args) => void`
- Wraps the rendered output in a div with dotted grid background
- Shows error bar (red, bottom) if `runCode` returns an error
- Debounces code changes by 300ms before re-running
- Catches render errors with an ErrorBoundary

**Step 6: Verify preview renders a Button with default code**

Temporarily hardcode `<PreviewPanel code='<Button>Hello</Button>' />` in the index route.

**Step 7: Commit**

```bash
git add apps/sandbox/src/
git commit -m "feat(sandbox): add preview panel with code runner and toolbar"
```

---

### Task 5: Props panel (Controls tab)

**Files:**
- Create: `apps/sandbox/src/components/props-panel.tsx`
- Create: `apps/sandbox/src/components/controls/boolean-control.tsx`
- Create: `apps/sandbox/src/components/controls/string-control.tsx`
- Create: `apps/sandbox/src/components/controls/number-control.tsx`
- Create: `apps/sandbox/src/components/controls/union-control.tsx`
- Create: `apps/sandbox/src/components/controls/json-control.tsx`
- Create: `apps/sandbox/src/components/controls/index.ts`

**Step 1: Create individual control components**

Each control component takes `{ name, value, onChange, descriptor }` and renders the appropriate UI:

- `BooleanControl` → `<Switch>` from @blazz/ui
- `StringControl` → `<Input>` from @blazz/ui
- `NumberControl` → `<Input type="number">` + `<Slider>` from @blazz/ui
- `UnionControl` → `<Select>` from @blazz/ui with options from `descriptor.options`
- `JsonControl` → `<Textarea>` from @blazz/ui with JSON.parse validation

Each control is labeled with the prop name and shows the type in muted text.

**Step 2: Create `apps/sandbox/src/components/controls/index.ts`**

Barrel export + a `ControlRenderer` component that picks the right control based on `descriptor.type`. Skips `slot` and `function` types (handled by Code tab and callback toasts respectively).

**Step 3: Create `apps/sandbox/src/components/props-panel.tsx`**

Takes `{ props: PropDescriptor[], values: Record<string, unknown>, onChange }`.

- Groups props by `descriptor.group` ("main", "style", "callbacks", "slots")
- Renders each group as a section with a label
- Shows "callbacks" group as read-only labels with event indicator
- Shows "slots" group as a note "Edit in Code tab"
- Reset button at the top resets all values to defaults from descriptors
- Compact layout: labels on left, controls on right

**Step 4: Commit**

```bash
git add apps/sandbox/src/components/controls/ apps/sandbox/src/components/props-panel.tsx
git commit -m "feat(sandbox): add props panel with auto-generated controls"
```

---

### Task 6: Monaco editor (Code tab)

**Files:**
- Create: `apps/sandbox/src/components/code-editor.tsx`

**Step 1: Create `apps/sandbox/src/components/code-editor.tsx`**

Uses `@monaco-editor/react`:
- Language: `typescript` with JSX enabled
- Theme: `vs-dark` (matches dark mode)
- Options: `minimap: false`, `lineNumbers: "on"`, `fontSize: 13`, `tabSize: 2`, `wordWrap: "on"`, `scrollBeyondLastLine: false`, `automaticLayout: true`
- `onChange` fires with debounce 300ms
- Shows a loading spinner while Monaco loads (it's async)

Configure Monaco to understand JSX:
```ts
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.React,
  jsxFactory: "React.createElement",
  esModuleInterop: true,
  allowJs: true,
})
```

**Step 2: Commit**

```bash
git add apps/sandbox/src/components/code-editor.tsx
git commit -m "feat(sandbox): add Monaco editor component"
```

---

### Task 7: Playground page — wire everything together

**Files:**
- Create: `apps/sandbox/src/routes/$category/$component.tsx`
- Create: `apps/sandbox/src/components/sandbox-shell.tsx`
- Create: `apps/sandbox/src/lib/persistence.ts`

**Step 1: Create `apps/sandbox/src/lib/persistence.ts`**

```ts
const PREFIX = "sandbox:"

interface PersistedState {
  code: string
  props: Record<string, unknown>
}

export function loadState(slug: string): PersistedState | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${slug}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveState(slug: string, state: PersistedState): void {
  localStorage.setItem(`${PREFIX}${slug}`, JSON.stringify(state))
}

export function clearState(slug: string): void {
  localStorage.removeItem(`${PREFIX}${slug}`)
}

export function hasPersistedState(slug: string): boolean {
  return localStorage.getItem(`${PREFIX}${slug}`) !== null
}
```

**Step 2: Create `apps/sandbox/src/components/sandbox-shell.tsx`**

The main playground layout that assembles all pieces:

```
┌─────────────────────────────────────┐
│  PreviewToolbar                     │
│  ┌─────────────────────────────────┐│
│  │         PreviewPanel            ││
│  │                                 ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ [Controls] [Code] [Examples]  ↺ ││
│  │                                 ││
│  │   (active tab content)          ││
│  │                                 ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

Props:
- `entry: ComponentEntry`

State:
- `code: string` — current JSX code (initialized from persistence or `entry.defaultCode`)
- `propValues: Record<string, unknown>` — current prop values
- `activeTab: "controls" | "code" | "examples"`

Behavior:
- When `propValues` change via controls → regenerate `code` by updating prop values in the JSX string
- When `code` changes via Monaco → try to parse prop values back out (best-effort, don't break on failure)
- Auto-save to localStorage on every change (debounced 500ms)
- Reset button: clears localStorage, resets code + props to defaults

Use `@blazz/ui` `Tabs` for the bottom panel tab switcher.

The divider between preview and bottom panel should be **resizable** — use a simple drag handle (`cursor-row-resize`, `onMouseDown` + `onMouseMove` to adjust heights).

**Step 3: Create `apps/sandbox/src/routes/$category/$component.tsx`**

```tsx
import { createFileRoute } from "@tanstack/react-router"
import { getComponent } from "~/lib/registry"
import { SandboxShell } from "~/components/sandbox-shell"
import { addRecent } from "~/lib/recents"

export const Route = createFileRoute("/$category/$component")({
  component: ComponentPage,
})

function ComponentPage() {
  const { category, component } = Route.useParams()
  const entry = getComponent(component)

  useEffect(() => {
    if (entry) addRecent(entry.slug)
  }, [entry])

  if (!entry) {
    return <div className="p-8 text-fg-muted">Component not found.</div>
  }

  return <SandboxShell entry={entry} />
}
```

**Step 4: Verify end-to-end flow**

Navigate to `http://localhost:3130/ui/button`:
1. Preview shows a rendered Button
2. Controls tab shows variant, size, disabled controls
3. Changing variant control updates the preview
4. Code tab shows the JSX, editable
5. Editing code updates the preview
6. Navigating away and back preserves state

**Step 5: Commit**

```bash
git add apps/sandbox/src/
git commit -m "feat(sandbox): wire playground page with preview, controls, and code editor"
```

---

### Task 8: Examples tab

**Files:**
- Create: `apps/sandbox/src/components/examples-panel.tsx`
- Modify: `apps/sandbox/src/lib/registry.ts` — add `examples` field
- Modify: `apps/sandbox/src/lib/registry-data.ts` — add examples to seed components

**Step 1: Add `examples` field to `ComponentEntry`**

```ts
export interface ComponentExample {
  name: string
  code: string
}

export interface ComponentEntry {
  // ... existing fields ...
  examples?: ComponentExample[]
}
```

**Step 2: Add examples to seed data**

Add 2-3 examples per seeded component. For example, Button:
```ts
examples: [
  { name: "All variants", code: `<div className="flex flex-wrap gap-2">
  <Button variant="default">Default</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="link">Link</Button>
</div>` },
  { name: "With icon", code: `<Button><Plus className="size-4" /> Add item</Button>` },
  { name: "Loading state", code: `<Button disabled><Spinner className="size-4" /> Loading...</Button>` },
]
```

**Step 3: Create `apps/sandbox/src/components/examples-panel.tsx`**

- Lists all examples as clickable cards with the example name
- Clicking an example sets the code in the editor and resets props to defaults
- Shows a small code preview (first 3 lines, truncated) under each example name
- If no examples defined, shows "No examples available" message

**Step 4: Commit**

```bash
git add apps/sandbox/src/
git commit -m "feat(sandbox): add examples tab with presets"
```

---

### Task 9: Variants grid mode

**Files:**
- Create: `apps/sandbox/src/components/variants-grid.tsx`
- Modify: `apps/sandbox/src/components/preview-toolbar.tsx` — add variants toggle
- Modify: `apps/sandbox/src/components/sandbox-shell.tsx` — add variants mode state

**Step 1: Create `apps/sandbox/src/components/variants-grid.tsx`**

Takes `{ entry, propValues, code }`:
- Finds the first `union` type prop in the entry
- Renders a grid of the component with each option of that union prop
- Each cell shows the option label above the rendered component
- Grid is responsive: `grid-cols-2` on small, `grid-cols-3` on medium, `grid-cols-4` on large
- Uses the same `runCode` function, substituting the union value in the code for each cell

**Step 2: Add "Variants" toggle to toolbar**

A `Button` with `variant="ghost"` and a grid icon. When active, the preview panel switches to the variants grid instead of the single preview.

**Step 3: Wire into `sandbox-shell.tsx`**

Add `showVariants: boolean` state. When true, render `<VariantsGrid>` instead of `<PreviewPanel>`.

**Step 4: Commit**

```bash
git add apps/sandbox/src/
git commit -m "feat(sandbox): add variants grid mode"
```

---

### Task 10: Auto-generate registry from TypeScript types

**Files:**
- Create: `apps/sandbox/scripts/generate-registry.ts`
- Modify: `apps/sandbox/package.json` — add `generate` script

**Step 1: Create `apps/sandbox/scripts/generate-registry.ts`**

Uses TypeScript Compiler API to:

1. Create a `ts.Program` from `packages/ui/src/index.ts` and `packages/pro/src/index.ts`
2. For each exported symbol that looks like a component (PascalCase function returning JSX):
   - Find the props type (first parameter type)
   - Extract each property: name, type, optional, default
   - Map TS types to `PropType`:
     - `boolean` → `"boolean"`
     - `string` → `"string"`
     - `number` → `"number"`
     - Union of string literals → `"union"` with `options`
     - `ReactNode` → `"slot"`
     - Function signature → `"function"`
     - Object/interface → `"object"`
     - Array → `"array"`
   - Detect default values from destructuring defaults in the function body
3. Generate `defaultCode` as `<ComponentName />` (overrides can improve this later)
4. Write the result to `apps/sandbox/src/lib/registry-data.generated.ts`
5. The manual `registry-data.ts` file imports and merges with generated data (manual wins on conflicts)

Script CLI:
```bash
tsx apps/sandbox/scripts/generate-registry.ts
```

**Step 2: Add scripts to `package.json`**

```json
"generate": "tsx scripts/generate-registry.ts",
"dev": "tsx scripts/generate-registry.ts && vite dev"
```

**Step 3: Run and verify**

```bash
cd apps/sandbox && pnpm generate
```

Expected: `registry-data.generated.ts` contains entries for all exported components.

**Step 4: Commit**

```bash
git add apps/sandbox/
git commit -m "feat(sandbox): add TypeScript type parser for auto-generating registry"
```

---

### Task 11: Polish and integrate

**Files:**
- Modify: `apps/sandbox/src/routes/index.tsx` — redirect to first component or show welcome
- Modify: `apps/sandbox/src/routes/__root.tsx` — head title per component
- Modify: `apps/sandbox/src/components/component-tree.tsx` — add "modified" badge
- Modify: `apps/sandbox/src/components/sandbox-shell.tsx` — keyboard shortcuts

**Step 1: Add keyboard shortcuts**

- `Cmd+S` → noop (prevent browser save, state is auto-saved)
- `Cmd+Shift+C` → copy current code to clipboard
- `Cmd+Shift+R` → reset to defaults
- `Cmd+1/2/3` → switch tabs (Controls/Code/Examples)

**Step 2: Add "modified" badge to sidebar**

In `component-tree.tsx`, check `hasPersistedState(slug)` for each component. If true, show a small blue dot next to the name.

**Step 3: Update home page**

Show a welcome message with:
- Total component count from registry
- Quick links to popular components
- Search prompt

**Step 4: Final smoke test**

Verify the full flow:
1. Dev server starts on port 3130
2. Sidebar shows all components grouped by category
3. Search filters components
4. Clicking a component loads the playground
5. Controls update preview
6. Monaco editor updates preview
7. Examples load correctly
8. Variants grid works
9. State persists across navigation
10. Reset clears state

**Step 5: Commit**

```bash
git add apps/sandbox/
git commit -m "feat(sandbox): polish UX — shortcuts, modified badges, welcome page"
```
