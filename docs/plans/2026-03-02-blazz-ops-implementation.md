# Blazz Ops Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build `apps/ops`, a personal freelance management app (time tracking, clients, projects, invoiceable recap) within the Blazz monorepo.

**Architecture:** Next.js 16 static export + Convex backend (DB + real-time functions) + @blazz/ui components. Static export (`output: "export"`) makes the app Tauri-compatible for future Mac app wrapping. All data fetching is client-side via Convex hooks.

**Tech Stack:** Next.js 16, React 19, Convex, @blazz/ui, Tailwind v4, TypeScript strict, react-hook-form + zod, date-fns, sonner (toasts)

---

### Task 1: Scaffold `apps/ops` config files

**Files:**
- Create: `apps/ops/package.json`
- Create: `apps/ops/tsconfig.json`
- Create: `apps/ops/next.config.mjs`
- Create: `apps/ops/postcss.config.mjs`

**Step 1: Create `apps/ops/package.json`**

```json
{
  "name": "ops",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 3120",
    "dev:convex": "convex dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@blazz/ui": "workspace:*",
    "convex": "^1.22.0",
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "next-themes": "^0.4.6",
    "lucide-react": "^0.562.0",
    "react-hook-form": "^7.71.1",
    "@hookform/resolvers": "^5.2.2",
    "zod": "^4.3.5",
    "date-fns": "^4.1.0",
    "sonner": "^2.0.7",
    "postcss": "^8.5.6"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
}
```

**Step 2: Create `apps/ops/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@blazz/ui": ["../../packages/ui/src"],
      "@blazz/ui/*": ["../../packages/ui/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create `apps/ops/next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@blazz/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default config
```

**Step 4: Create `apps/ops/postcss.config.mjs`**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

export default config
```

**Step 5: Install dependencies**

```bash
cd /path/to/blazz-ui-app && pnpm install
```
Expected: Resolves workspace deps, installs convex + all packages.

**Step 6: Commit**

```bash
git add apps/ops/package.json apps/ops/tsconfig.json apps/ops/next.config.mjs apps/ops/postcss.config.mjs
git commit -m "feat(ops): scaffold apps/ops config files"
```

---

### Task 2: Initialize Convex project

**Files:**
- Create: `apps/ops/.env.local` (from template, not committed)
- Create: `apps/ops/convex/schema.ts`

> **Prerequisites:** You need a Convex account. Go to https://dashboard.convex.dev, create a new project named "blazz-ops". Then run the init command below.

**Step 1: Run Convex init**

```bash
cd apps/ops && npx convex dev --once
```
Expected: Prompts to login + select project, creates `convex/_generated/` and writes `CONVEX_DEPLOYMENT` + `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.

**Step 2: Verify `.env.local` was created**

```bash
cat apps/ops/.env.local
```
Expected: Contains `CONVEX_DEPLOYMENT=...` and `NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud`.

**Step 3: Add `.env.local` to `.gitignore` if not already**

Check `apps/ops/.gitignore` exists (Next.js creates it). If not:
```bash
echo ".env.local\n.next\nout\nnode_modules" > apps/ops/.gitignore
```

**Step 4: Write `apps/ops/convex/schema.ts`**

```typescript
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  clients: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  projects: defineTable({
    clientId: v.id("clients"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    currency: v.string(),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("closed")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_client", ["clientId"]),

  timeEntries: defineTable({
    projectId: v.id("projects"),
    date: v.string(),
    minutes: v.number(),
    hourlyRate: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
    invoicedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_date", ["date"]),
})
```

**Step 5: Push schema to Convex**

```bash
cd apps/ops && npx convex dev --once
```
Expected: Schema pushed, `convex/_generated/` updated with new types.

**Step 6: Commit**

```bash
git add apps/ops/convex/schema.ts apps/ops/.gitignore
git commit -m "feat(ops): add Convex schema — clients, projects, timeEntries"
```

---

### Task 3: Convex functions — clients + projects

**Files:**
- Create: `apps/ops/convex/clients.ts`
- Create: `apps/ops/convex/projects.ts`

**Step 1: Write `apps/ops/convex/clients.ts`**

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("clients").order("desc").collect()
  },
})

export const get = query({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => ctx.db.get(id),
})

export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("clients", { ...args, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("clients"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => ctx.db.patch(id, fields),
})

export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => ctx.db.delete(id),
})
```

**Step 2: Write `apps/ops/convex/projects.ts`**

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

const statusValidator = v.union(
  v.literal("active"),
  v.literal("paused"),
  v.literal("closed")
)

export const listByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    return ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .collect()
  },
})

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect()
  },
})

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => ctx.db.get(id),
})

export const create = mutation({
  args: {
    clientId: v.id("clients"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    currency: v.string(),
    status: statusValidator,
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("projects", { ...args, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    currency: v.string(),
    status: statusValidator,
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => ctx.db.patch(id, fields),
})
```

**Step 3: Push functions to Convex**

```bash
cd apps/ops && npx convex dev --once
```
Expected: Functions deployed, no errors.

**Step 4: Commit**

```bash
git add apps/ops/convex/clients.ts apps/ops/convex/projects.ts
git commit -m "feat(ops): add Convex functions for clients and projects"
```

---

### Task 4: Convex functions — timeEntries

**Files:**
- Create: `apps/ops/convex/timeEntries.ts`

**Step 1: Write `apps/ops/convex/timeEntries.ts`**

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {
    projectId: v.optional(v.id("projects")),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, from, to }) => {
    let entries = projectId
      ? await ctx.db
          .query("timeEntries")
          .withIndex("by_project", (q) => q.eq("projectId", projectId))
          .collect()
      : await ctx.db.query("timeEntries").collect()

    if (from) entries = entries.filter((e) => e.date >= from)
    if (to) entries = entries.filter((e) => e.date <= to)

    return entries.sort((a, b) => b.date.localeCompare(a.date))
  },
})

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 10 }) => {
    return ctx.db.query("timeEntries").order("desc").take(limit)
  },
})

// Used for recap: all uninvoiced entries, optionally filtered
export const listForRecap = query({
  args: {
    projectId: v.optional(v.id("projects")),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    includeInvoiced: v.optional(v.boolean()),
  },
  handler: async (ctx, { projectId, from, to, includeInvoiced = false }) => {
    let entries = projectId
      ? await ctx.db
          .query("timeEntries")
          .withIndex("by_project", (q) => q.eq("projectId", projectId))
          .collect()
      : await ctx.db.query("timeEntries").collect()

    if (!includeInvoiced) entries = entries.filter((e) => !e.invoicedAt)
    if (from) entries = entries.filter((e) => e.date >= from)
    if (to) entries = entries.filter((e) => e.date <= to)
    entries = entries.filter((e) => e.billable)

    return entries.sort((a, b) => a.date.localeCompare(b.date))
  },
})

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    date: v.string(),
    minutes: v.number(),
    hourlyRate: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("timeEntries", { ...args, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("timeEntries"),
    date: v.string(),
    minutes: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
  },
  handler: async (ctx, { id, ...fields }) => ctx.db.patch(id, fields),
})

export const remove = mutation({
  args: { id: v.id("timeEntries") },
  handler: async (ctx, { id }) => ctx.db.delete(id),
})

export const markInvoiced = mutation({
  args: { ids: v.array(v.id("timeEntries")) },
  handler: async (ctx, { ids }) => {
    const now = Date.now()
    await Promise.all(ids.map((id) => ctx.db.patch(id, { invoicedAt: now })))
  },
})
```

**Step 2: Push + verify**

```bash
cd apps/ops && npx convex dev --once
```
Expected: All functions deployed without errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/timeEntries.ts
git commit -m "feat(ops): add Convex functions for timeEntries"
```

---

### Task 5: App shell — layout + nav + globals.css

**Files:**
- Create: `apps/ops/app/globals.css`
- Create: `apps/ops/app/providers.tsx`
- Create: `apps/ops/app/layout.tsx`
- Create: `apps/ops/components/ops-nav.tsx`

**Step 1: Write `apps/ops/app/globals.css`**

Copy the design tokens from `apps/examples/app/globals.css` verbatim (same Tailwind v4 setup, same token definitions). Only change the `@source` paths:

```css
@import "tailwindcss";

@source "../app/**/*.{js,ts,jsx,tsx}";
@source "../components/**/*.{js,ts,jsx,tsx}";
@source "../../../packages/ui/src/**/*.{js,ts,jsx,tsx}";
@custom-variant dark (&:is(.dark *));

/* ← paste the rest of apps/examples/app/globals.css exactly */
```

**Step 2: Write `apps/ops/app/providers.tsx`**

```tsx
"use client"

import type { ReactNode } from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ThemeProvider } from "next-themes"
import { ThemePaletteProvider } from "@blazz/ui/lib/theme-context"
import { Toaster } from "sonner"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <ThemePaletteProvider>
          {children}
          <Toaster richColors />
        </ThemePaletteProvider>
      </ThemeProvider>
    </ConvexProvider>
  )
}
```

**Step 3: Write `apps/ops/app/layout.tsx`**

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blazz Ops",
  description: "Freelance time tracking & billing",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**Step 4: Write `apps/ops/components/ops-nav.tsx`**

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Clock, FileText } from "lucide-react"
import { cn } from "@blazz/ui/lib/utils"

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/time", label: "Temps", icon: Clock },
  { href: "/recap", label: "Récap", icon: FileText },
]

export function OpsNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-3">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            "text-fg-muted hover:text-fg hover:bg-raised",
            pathname === href && "text-fg bg-raised"
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
```

**Step 5: Verify the app starts**

```bash
cd apps/ops && pnpm dev
```
Expected: App starts on http://localhost:3120 (may show 404 since no pages yet — that's fine).

**Step 6: Commit**

```bash
git add apps/ops/app/globals.css apps/ops/app/providers.tsx apps/ops/app/layout.tsx apps/ops/components/ops-nav.tsx
git commit -m "feat(ops): add app shell — layout, providers, nav"
```

---

### Task 6: App frame wrapper + route placeholders

**Files:**
- Create: `apps/ops/components/ops-frame.tsx`
- Create: `apps/ops/app/(dashboard)/page.tsx`
- Create: `apps/ops/app/(clients)/page.tsx`
- Create: `apps/ops/app/(time)/page.tsx`
- Create: `apps/ops/app/(recap)/page.tsx`

**Step 1: Write `apps/ops/components/ops-frame.tsx`**

```tsx
import type { ReactNode } from "react"
import { OpsNav } from "./ops-nav"

export function OpsFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-surface">
      <aside className="w-56 border-r border-edge flex flex-col shrink-0">
        <div className="p-4 border-b border-edge">
          <span className="font-semibold text-sm text-fg">Blazz Ops</span>
        </div>
        <OpsNav />
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
```

**Step 2: Write placeholder pages for all 4 routes**

`apps/ops/app/(dashboard)/page.tsx`:
```tsx
import { OpsFrame } from "@/components/ops-frame"

export default function DashboardPage() {
  return (
    <OpsFrame>
      <div className="p-6">
        <h1 className="text-xl font-semibold text-fg">Dashboard</h1>
      </div>
    </OpsFrame>
  )
}
```

Repeat for `(clients)/page.tsx`, `(time)/page.tsx`, `(recap)/page.tsx` — same structure, different `<h1>` text ("Clients", "Temps", "Récap").

**Step 3: Verify navigation works**

```bash
pnpm dev:ops  # or cd apps/ops && pnpm dev
```
Navigate to http://localhost:3120 — should show Dashboard with sidebar. Click nav links, routes should load.

**Step 4: Commit**

```bash
git add apps/ops/components/ops-frame.tsx apps/ops/app/
git commit -m "feat(ops): add app frame and route placeholders"
```

---

### Task 7: Clients screens — list + detail

**Files:**
- Modify: `apps/ops/app/(clients)/page.tsx`
- Create: `apps/ops/app/(clients)/[id]/page.tsx`
- Create: `apps/ops/components/client-form.tsx`
- Create: `apps/ops/components/project-form.tsx`

**Step 1: Write `apps/ops/components/client-form.tsx`**

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Textarea } from "@blazz/ui/components/ui/textarea"

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  defaultValues?: Partial<FormValues> & { id?: Id<"clients"> }
  onSuccess?: () => void
}

export function ClientForm({ defaultValues, onSuccess }: Props) {
  const create = useMutation(api.clients.create)
  const update = useMutation(api.clients.update)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onSubmit = async (values: FormValues) => {
    try {
      if (defaultValues?.id) {
        await update({ id: defaultValues.id, ...values })
        toast.success("Client mis à jour")
      } else {
        await create(values)
        toast.success("Client créé")
      }
      onSuccess?.()
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nom *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" {...register("phone")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Textarea id="address" rows={2} {...register("address")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {defaultValues?.id ? "Mettre à jour" : "Créer le client"}
      </Button>
    </form>
  )
}
```

**Step 2: Write `apps/ops/components/project-form.tsx`**

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  tjm: z.coerce.number().min(1, "TJM requis"),
  hoursPerDay: z.coerce.number().min(1).max(24),
  currency: z.string().min(1),
  status: z.enum(["active", "paused", "closed"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  clientId: Id<"clients">
  defaultValues?: Partial<FormValues> & { id?: Id<"projects"> }
  onSuccess?: () => void
}

export function ProjectForm({ clientId, defaultValues, onSuccess }: Props) {
  const create = useMutation(api.projects.create)
  const update = useMutation(api.projects.update)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tjm: 600,
      hoursPerDay: 8,
      currency: "EUR",
      status: "active",
      ...defaultValues,
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      if (defaultValues?.id) {
        await update({ id: defaultValues.id, ...values })
        toast.success("Projet mis à jour")
      } else {
        await create({ clientId, ...values })
        toast.success("Projet créé")
      }
      onSuccess?.()
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nom *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="tjm">TJM (€)</Label>
          <Input id="tjm" type="number" {...register("tjm")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hoursPerDay">H/jour</Label>
          <Input id="hoursPerDay" type="number" {...register("hoursPerDay")} />
        </div>
        <div className="space-y-1.5">
          <Label>Devise</Label>
          <Input {...register("currency")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Statut</Label>
        <Select defaultValue={watch("status")} onValueChange={(v) => setValue("status", v as "active" | "paused" | "closed")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="paused">En pause</SelectItem>
            <SelectItem value="closed">Clôturé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Date début</Label>
          <Input type="date" {...register("startDate")} />
        </div>
        <div className="space-y-1.5">
          <Label>Date fin</Label>
          <Input type="date" {...register("endDate")} />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {defaultValues?.id ? "Mettre à jour" : "Créer le projet"}
      </Button>
    </form>
  )
}
```

**Step 3: Write `apps/ops/app/(clients)/page.tsx`**

```tsx
"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OpsFrame } from "@/components/ops-frame"
import { ClientForm } from "@/components/client-form"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@blazz/ui/components/ui/dialog"
import { Plus, ChevronRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ClientsPage() {
  const clients = useQuery(api.clients.list)
  const remove = useMutation(api.clients.remove)
  const [open, setOpen] = useState(false)

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-fg">Clients</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="size-4 mr-1.5" />Nouveau client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouveau client</DialogTitle></DialogHeader>
              <ClientForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {clients === undefined && <p className="text-fg-muted text-sm">Chargement…</p>}
        {clients?.length === 0 && <p className="text-fg-muted text-sm">Aucun client. Créez-en un !</p>}

        <div className="space-y-2">
          {clients?.map((client) => (
            <Link
              key={client._id}
              href={`/clients/${client._id}`}
              className="flex items-center justify-between p-4 rounded-lg border border-edge bg-raised hover:bg-panel transition-colors"
            >
              <div>
                <p className="font-medium text-fg">{client.name}</p>
                {client.email && <p className="text-sm text-fg-muted">{client.email}</p>}
              </div>
              <ChevronRight className="size-4 text-fg-muted" />
            </Link>
          ))}
        </div>
      </div>
    </OpsFrame>
  )
}
```

**Step 4: Write `apps/ops/app/(clients)/[id]/page.tsx`**

```tsx
"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { OpsFrame } from "@/components/ops-frame"
import { ProjectForm } from "@/components/project-form"
import { ClientForm } from "@/components/client-form"
import { Button } from "@blazz/ui/components/ui/button"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@blazz/ui/components/ui/dialog"
import { Plus } from "lucide-react"
import { use } from "react"

interface Props {
  params: Promise<{ id: string }>
}

const statusLabel = { active: "Actif", paused: "En pause", closed: "Clôturé" }
const statusVariant = { active: "success", paused: "warning", closed: "secondary" } as const

export default function ClientDetailPage({ params }: Props) {
  const { id } = use(params)
  const client = useQuery(api.clients.get, { id: id as Id<"clients"> })
  const projects = useQuery(api.projects.listByClient, { clientId: id as Id<"clients"> })
  const [editOpen, setEditOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)

  if (!client) return <OpsFrame><div className="p-6 text-fg-muted">Chargement…</div></OpsFrame>

  return (
    <OpsFrame>
      <div className="p-6 space-y-8">
        {/* Client header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-fg">{client.name}</h1>
            {client.email && <p className="text-sm text-fg-muted">{client.email}</p>}
            {client.phone && <p className="text-sm text-fg-muted">{client.phone}</p>}
          </div>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Modifier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Modifier le client</DialogTitle></DialogHeader>
              <ClientForm
                defaultValues={{ ...client, id: client._id }}
                onSuccess={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-fg">Projets</h2>
            <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="size-4 mr-1.5" />Nouveau projet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nouveau projet</DialogTitle></DialogHeader>
                <ProjectForm clientId={id as Id<"clients">} onSuccess={() => setProjectOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {projects?.length === 0 && <p className="text-sm text-fg-muted">Aucun projet.</p>}

          <div className="space-y-2">
            {projects?.map((project) => (
              <div key={project._id} className="flex items-center justify-between p-4 rounded-lg border border-edge bg-raised">
                <div>
                  <p className="font-medium text-fg">{project.name}</p>
                  <p className="text-xs text-fg-muted">{project.tjm}€/jour · {project.hoursPerDay}h/j · {project.currency}</p>
                </div>
                <Badge variant={statusVariant[project.status]}>{statusLabel[project.status]}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OpsFrame>
  )
}
```

**Step 5: Verify in browser**

Navigate to http://localhost:3120/clients. Create a client, click it, create a project.

**Step 6: Commit**

```bash
git add apps/ops/
git commit -m "feat(ops): add clients list, detail, and project CRUD screens"
```

---

### Task 8: Time entry screen

**Files:**
- Modify: `apps/ops/app/(time)/page.tsx`
- Create: `apps/ops/components/time-entry-form.tsx`

**Step 1: Write `apps/ops/components/time-entry-form.tsx`**

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { format } from "date-fns"

const schema = z.object({
  projectId: z.string().min(1, "Projet requis"),
  date: z.string().min(1, "Date requise"),
  hours: z.coerce.number().min(0.25, "Minimum 15min").max(24),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onSuccess?: () => void
}

export function TimeEntryForm({ onSuccess }: Props) {
  const activeProjects = useQuery(api.projects.listActive)
  const create = useMutation(api.timeEntries.create)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      hours: 1,
    },
  })

  const onSubmit = async (values: FormValues) => {
    const project = activeProjects?.find((p) => p._id === values.projectId)
    if (!project) return toast.error("Projet introuvable")

    const hourlyRate = project.tjm / project.hoursPerDay

    try {
      await create({
        projectId: values.projectId as Id<"projects">,
        date: values.date,
        minutes: Math.round(values.hours * 60),
        hourlyRate,
        description: values.description,
        billable: true,
      })
      toast.success("Entrée ajoutée")
      reset({ date: values.date, hours: 1, projectId: values.projectId })
      onSuccess?.()
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Projet *</Label>
        <Select onValueChange={(v) => setValue("projectId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un projet…" />
          </SelectTrigger>
          <SelectContent>
            {activeProjects?.map((p) => (
              <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Date *</Label>
          <Input type="date" {...register("date")} />
        </div>
        <div className="space-y-1.5">
          <Label>Durée (heures) *</Label>
          <Input type="number" step="0.25" {...register("hours")} />
          {errors.hours && <p className="text-xs text-red-500">{errors.hours.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Input placeholder="Ce qui a été fait…" {...register("description")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>Ajouter</Button>
    </form>
  )
}
```

**Step 2: Write `apps/ops/app/(time)/page.tsx`**

```tsx
"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OpsFrame } from "@/components/ops-frame"
import { TimeEntryForm } from "@/components/time-entry-form"
import { Button } from "@blazz/ui/components/ui/button"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`
}

export default function TimePage() {
  const entries = useQuery(api.timeEntries.list, {})
  const remove = useMutation(api.timeEntries.remove)

  const handleDelete = async (id: string) => {
    try {
      await remove({ id: id as Parameters<typeof remove>[0]["id"] })
      toast.success("Entrée supprimée")
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  return (
    <OpsFrame>
      <div className="p-6 space-y-8">
        <h1 className="text-xl font-semibold text-fg">Saisie des heures</h1>

        {/* Form */}
        <div className="rounded-xl border border-edge bg-raised p-6 max-w-lg">
          <h2 className="font-medium text-fg mb-4">Nouvelle entrée</h2>
          <TimeEntryForm />
        </div>

        {/* History */}
        <div className="space-y-3">
          <h2 className="font-medium text-fg">Historique</h2>

          {entries === undefined && <p className="text-fg-muted text-sm">Chargement…</p>}
          {entries?.length === 0 && <p className="text-fg-muted text-sm">Aucune entrée.</p>}

          <div className="space-y-2">
            {entries?.map((entry) => (
              <div key={entry._id} className="flex items-center justify-between p-4 rounded-lg border border-edge bg-raised">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-fg-muted w-24">
                    {format(new Date(entry.date), "dd MMM", { locale: fr })}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-fg">{entry.description ?? "—"}</p>
                    <p className="text-xs text-fg-muted">
                      {formatMinutes(entry.minutes)} · {entry.hourlyRate}€/h · {((entry.minutes / 60) * entry.hourlyRate).toFixed(2)}€
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!entry.billable && <Badge variant="secondary">Non facturable</Badge>}
                  {entry.invoicedAt && <Badge variant="success">Facturé</Badge>}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-fg-muted hover:text-red-500"
                    onClick={() => handleDelete(entry._id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OpsFrame>
  )
}
```

**Step 3: Verify**

Add a few time entries. Verify they appear in the list immediately (Convex real-time).

**Step 4: Commit**

```bash
git add apps/ops/
git commit -m "feat(ops): add time entry form and history screen"
```

---

### Task 9: Dashboard screen

**Files:**
- Modify: `apps/ops/app/(dashboard)/page.tsx`

**Step 1: Replace dashboard placeholder with real content**

```tsx
"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OpsFrame } from "@/components/ops-frame"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { fr } from "date-fns/locale"

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`
}

export default function DashboardPage() {
  const now = new Date()
  const from = format(startOfMonth(now), "yyyy-MM-dd")
  const to = format(endOfMonth(now), "yyyy-MM-dd")

  const monthEntries = useQuery(api.timeEntries.list, { from, to })
  const activeProjects = useQuery(api.projects.listActive)
  const recentEntries = useQuery(api.timeEntries.recent, { limit: 10 })

  const totalMinutes = monthEntries?.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0) ?? 0
  const totalAmount = monthEntries?.filter((e) => e.billable).reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0) ?? 0

  return (
    <OpsFrame>
      <div className="p-6 space-y-8">
        <h1 className="text-xl font-semibold text-fg capitalize">
          {format(now, "MMMM yyyy", { locale: fr })}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-edge bg-raised p-5">
            <p className="text-xs text-fg-muted uppercase tracking-wide mb-1">Heures ce mois</p>
            <p className="text-3xl font-semibold text-fg">{formatMinutes(totalMinutes)}</p>
          </div>
          <div className="rounded-xl border border-edge bg-raised p-5">
            <p className="text-xs text-fg-muted uppercase tracking-wide mb-1">Facturable ce mois</p>
            <p className="text-3xl font-semibold text-fg">{totalAmount.toFixed(0)}€</p>
          </div>
        </div>

        {/* Active projects */}
        {(activeProjects?.length ?? 0) > 0 && (
          <div className="space-y-3">
            <h2 className="font-medium text-fg">Projets actifs</h2>
            <div className="space-y-2">
              {activeProjects?.map((project) => (
                <div key={project._id} className="flex items-center justify-between p-3 rounded-lg border border-edge bg-raised">
                  <p className="text-sm font-medium text-fg">{project.name}</p>
                  <p className="text-xs text-fg-muted">{project.tjm}€/j</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent entries */}
        {(recentEntries?.length ?? 0) > 0 && (
          <div className="space-y-3">
            <h2 className="font-medium text-fg">Entrées récentes</h2>
            <div className="space-y-1.5">
              {recentEntries?.map((entry) => (
                <div key={entry._id} className="flex items-center justify-between py-2 border-b border-edge last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-fg-muted w-20">{format(new Date(entry.date), "dd MMM", { locale: fr })}</span>
                    <span className="text-sm text-fg">{entry.description ?? "—"}</span>
                  </div>
                  <span className="text-sm font-mono text-fg-muted">{formatMinutes(entry.minutes)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </OpsFrame>
  )
}
```

**Step 2: Verify**

Dashboard shows correct month stats, active projects, recent entries.

**Step 3: Commit**

```bash
git add apps/ops/app/\(dashboard\)/page.tsx
git commit -m "feat(ops): add dashboard with month stats and recent entries"
```

---

### Task 10: Recap screen + CSV export

**Files:**
- Modify: `apps/ops/app/(recap)/page.tsx`

**Step 1: Write `apps/ops/app/(recap)/page.tsx`**

```tsx
"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { OpsFrame } from "@/components/ops-frame"
import { Button } from "@blazz/ui/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Badge } from "@blazz/ui/components/ui/badge"
import { toast } from "sonner"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { Download, CheckCheck } from "lucide-react"

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`
}

function getPeriod(preset: string) {
  const now = new Date()
  if (preset === "current") return { from: format(startOfMonth(now), "yyyy-MM-dd"), to: format(endOfMonth(now), "yyyy-MM-dd") }
  if (preset === "last") {
    const last = subMonths(now, 1)
    return { from: format(startOfMonth(last), "yyyy-MM-dd"), to: format(endOfMonth(last), "yyyy-MM-dd") }
  }
  return null
}

export default function RecapPage() {
  const [clientId, setClientId] = useState<string>("")
  const [projectId, setProjectId] = useState<string>("")
  const [period, setPeriod] = useState("current")
  const [from, setFrom] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"))
  const [to, setTo] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"))

  const clients = useQuery(api.clients.list)
  const allProjects = useQuery(api.projects.listByClient, clientId ? { clientId: clientId as Id<"clients"> } : "skip")
  const markInvoiced = useMutation(api.timeEntries.markInvoiced)

  const effectiveFrom = period !== "custom" ? getPeriod(period)?.from : from
  const effectiveTo = period !== "custom" ? getPeriod(period)?.to : to

  const entries = useQuery(api.timeEntries.listForRecap, {
    projectId: projectId ? (projectId as Id<"projects">) : undefined,
    from: effectiveFrom,
    to: effectiveTo,
  })

  // If client filter but no project filter — we need to filter entries by clientId via projects
  // For simplicity, filter client-side if no projectId selected
  const filteredEntries = !projectId && clientId && allProjects
    ? entries?.filter((e) => allProjects.some((p) => p._id === e.projectId))
    : entries

  const totalMinutes = filteredEntries?.reduce((s, e) => s + e.minutes, 0) ?? 0
  const totalAmount = filteredEntries?.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0) ?? 0
  const totalDays = totalMinutes / 60 / 8

  const handleMarkInvoiced = async () => {
    if (!filteredEntries?.length) return
    const ids = filteredEntries.map((e) => e._id)
    try {
      await markInvoiced({ ids })
      toast.success(`${ids.length} entrée(s) marquées comme facturées`)
    } catch {
      toast.error("Erreur")
    }
  }

  const handleExportCSV = () => {
    if (!filteredEntries?.length) return
    const rows = [
      ["Date", "Description", "Durée", "Taux (€/h)", "Montant (€)"],
      ...filteredEntries.map((e) => [
        e.date,
        e.description ?? "",
        formatMinutes(e.minutes),
        e.hourlyRate.toString(),
        ((e.minutes / 60) * e.hourlyRate).toFixed(2),
      ]),
      ["", "TOTAL", formatMinutes(totalMinutes), "", totalAmount.toFixed(2)],
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `recap-${effectiveFrom}-${effectiveTo}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Export CSV téléchargé")
  }

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <h1 className="text-xl font-semibold text-fg">Récapitulatif</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-4 rounded-xl border border-edge bg-raised">
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={(v) => { setClientId(v); setProjectId("") }}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Tous" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                {clients?.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {clientId && (
            <div className="space-y-1.5">
              <Label>Projet</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Tous" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  {allProjects?.map((p) => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Période</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Mois en cours</SelectItem>
                <SelectItem value="last">Mois précédent</SelectItem>
                <SelectItem value="custom">Personnalisée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {period === "custom" && (
            <>
              <div className="space-y-1.5">
                <Label>Du</Label>
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
              </div>
              <div className="space-y-1.5">
                <Label>Au</Label>
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
              </div>
            </>
          )}
        </div>

        {/* Table */}
        {filteredEntries && filteredEntries.length > 0 ? (
          <>
            <div className="rounded-xl border border-edge overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-raised border-b border-edge">
                  <tr>
                    <th className="text-left p-3 font-medium text-fg-muted">Date</th>
                    <th className="text-left p-3 font-medium text-fg-muted">Description</th>
                    <th className="text-right p-3 font-medium text-fg-muted">Durée</th>
                    <th className="text-right p-3 font-medium text-fg-muted">Taux</th>
                    <th className="text-right p-3 font-medium text-fg-muted">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry._id} className="border-b border-edge last:border-0">
                      <td className="p-3 text-fg-muted">{format(new Date(entry.date), "dd MMM", { locale: fr })}</td>
                      <td className="p-3 text-fg">{entry.description ?? "—"}</td>
                      <td className="p-3 text-right font-mono text-fg">{formatMinutes(entry.minutes)}</td>
                      <td className="p-3 text-right text-fg-muted">{entry.hourlyRate}€/h</td>
                      <td className="p-3 text-right font-medium text-fg">{((entry.minutes / 60) * entry.hourlyRate).toFixed(2)}€</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-raised border-t border-edge">
                  <tr>
                    <td colSpan={2} className="p-3 font-medium text-fg">Total</td>
                    <td className="p-3 text-right font-mono font-medium text-fg">{formatMinutes(totalMinutes)}</td>
                    <td className="p-3 text-right text-fg-muted">{totalDays.toFixed(1)}j</td>
                    <td className="p-3 text-right font-semibold text-fg">{totalAmount.toFixed(2)}€</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="size-4 mr-1.5" />Export CSV
              </Button>
              <Button onClick={handleMarkInvoiced}>
                <CheckCheck className="size-4 mr-1.5" />Marquer comme facturé ({filteredEntries.length})
              </Button>
            </div>
          </>
        ) : (
          <p className="text-fg-muted text-sm">
            {filteredEntries === undefined ? "Chargement…" : "Aucune entrée non facturée sur cette période."}
          </p>
        )}
      </div>
    </OpsFrame>
  )
}
```

**Step 2: Test the full flow**

1. Add time entries on `/time`
2. Go to `/recap` → filter by period → verify table shows entries
3. Click "Export CSV" → verify file downloads
4. Click "Marquer comme facturé" → entries disappear from recap (invoicedAt set)

**Step 3: Commit**

```bash
git add apps/ops/app/\(recap\)/page.tsx
git commit -m "feat(ops): add recap screen with CSV export and mark-as-invoiced"
```

---

### Task 11: Tauri stub

**Files:**
- Create: `apps/ops/src-tauri/tauri.conf.json`
- Create: `apps/ops/src-tauri/Cargo.toml`

**Step 1: Write `apps/ops/src-tauri/tauri.conf.json`**

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Blazz Ops",
  "version": "0.1.0",
  "identifier": "dev.blazz.ops",
  "build": {
    "frontendDist": "../out"
  },
  "app": {
    "windows": [
      {
        "title": "Blazz Ops",
        "width": 1200,
        "height": 800,
        "minWidth": 900,
        "minHeight": 600
      }
    ]
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/icon.icns", "icons/icon.ico", "icons/32x32.png", "icons/128x128.png"]
  }
}
```

**Step 2: Write `apps/ops/src-tauri/Cargo.toml`**

```toml
[package]
name = "blazz-ops"
version = "0.1.0"
description = "Blazz Ops desktop app"
authors = []
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[lib]
name = "app_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-opener = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

> **Note:** These files are stubs. No Rust toolchain needed now. To activate the Mac app later: install Rust + Tauri CLI, run `cargo tauri dev` from `apps/ops/`.

**Step 3: Commit**

```bash
git add apps/ops/src-tauri/
git commit -m "feat(ops): add Tauri stub config for future Mac app"
```

---

### Task 12: Wire up `pnpm dev:ops` in root

**Files:**
- Modify: `package.json` (root)

**Step 1: Check root package.json scripts**

```bash
cat package.json | grep -A 20 '"scripts"'
```

**Step 2: Add `dev:ops` script**

In root `package.json`, add to `scripts`:
```json
"dev:ops": "turbo dev --filter=ops"
```

**Step 3: Verify it starts**

```bash
pnpm dev:ops
```
Expected: `apps/ops` starts on port 3120.

**Step 4: Final commit**

```bash
git add package.json
git commit -m "chore: add pnpm dev:ops script for apps/ops"
```

---

## Done ✓

The app is live at http://localhost:3120 with:
- Dashboard with monthly stats
- Client & project management (CRUD)
- Manual time entry with history
- Recap with CSV export + mark-as-invoiced
- Convex real-time backend
- Tauri stub for future Mac app
