# Ops Agent System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 3 autonomous AI agents (CFO, Timekeeper, Product Lead) with Mission Control UI in Blazz Ops, using OpenAI API and a Worker Node daemon.

**Architecture:** Worker Node subscribes to Convex for new missions, loads agent souls (Markdown files), runs OpenAI tool loops, logs progress in real-time, and writes results back to Convex. UI is a kanban/list in the Ops app.

**Tech Stack:** OpenAI API (gpt-4.1-mini/gpt-4.1), Convex (backend + real-time), Next.js 16, @blazz/ui + @blazz/pro, node-cron, Markdown soul files.

**Design doc:** `docs/plans/2026-03-26-ops-agent-system-design.md`

---

## Task 1: Convex Schema — New Tables

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add `agents` table to schema**

Add after the existing `todos` table definition:

```typescript
agents: defineTable({
  userId: v.id("users"),
  slug: v.string(),
  name: v.string(),
  role: v.string(),
  model: v.string(),
  avatar: v.optional(v.string()),
  status: v.union(v.literal("idle"), v.literal("busy"), v.literal("disabled")),
  lastActiveAt: v.optional(v.number()),
  budget: v.object({
    maxPerMission: v.number(),
    maxPerDay: v.number(),
    maxPerMonth: v.number(),
  }),
  usage: v.object({
    todayUsd: v.number(),
    monthUsd: v.number(),
    totalUsd: v.number(),
    lastResetDay: v.string(),
    lastResetMonth: v.string(),
  }),
  permissions: v.object({
    safe: v.array(v.string()),
    confirm: v.array(v.string()),
    blocked: v.array(v.string()),
  }),
})
  .index("by_user", ["userId"])
  .index("by_slug", ["userId", "slug"]),
```

**Step 2: Add `missions` table**

```typescript
missions: defineTable({
  userId: v.id("users"),
  agentId: v.id("agents"),
  title: v.string(),
  prompt: v.string(),
  status: v.union(
    v.literal("planning"),
    v.literal("todo"),
    v.literal("in_progress"),
    v.literal("review"),
    v.literal("done"),
    v.literal("rejected"),
    v.literal("aborted"),
  ),
  priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
  mode: v.optional(v.union(v.literal("dry-run"), v.literal("live"))),
  output: v.optional(v.string()),
  structuredOutput: v.optional(v.any()),
  outputType: v.optional(v.string()),
  actions: v.optional(v.array(v.object({
    type: v.string(),
    description: v.string(),
    entityId: v.optional(v.string()),
    reversible: v.boolean(),
  }))),
  error: v.optional(v.string()),
  costUsd: v.optional(v.number()),
  maxIterations: v.optional(v.number()),
  rejectionReason: v.optional(v.string()),
  soulHash: v.optional(v.string()),
  templateId: v.optional(v.string()),
  cron: v.optional(v.string()),
  parentMissionId: v.optional(v.id("missions")),
  onComplete: v.optional(v.object({
    createMission: v.optional(v.object({
      agentSlug: v.string(),
      templateId: v.string(),
      condition: v.optional(v.string()),
    })),
  })),
  startedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  reviewedAt: v.optional(v.number()),
  metadata: v.optional(v.any()),
})
  .index("by_status", ["userId", "status"])
  .index("by_agent", ["userId", "agentId"])
  .index("by_cron", ["userId", "cron"]),
```

**Step 3: Add `agentLogs` table**

```typescript
agentLogs: defineTable({
  missionId: v.id("missions"),
  agentId: v.id("agents"),
  type: v.union(
    v.literal("thinking"),
    v.literal("tool_call"),
    v.literal("tool_result"),
    v.literal("error"),
    v.literal("budget_warning"),
    v.literal("done"),
  ),
  content: v.string(),
  toolName: v.optional(v.string()),
  duration: v.optional(v.number()),
})
  .index("by_mission", ["missionId"]),
```

**Step 4: Add `agentMemory` table**

```typescript
agentMemory: defineTable({
  userId: v.id("users"),
  agentId: v.id("agents"),
  missionId: v.optional(v.id("missions")),
  type: v.union(v.literal("summary"), v.literal("learning"), v.literal("fact")),
  content: v.string(),
  expiresAt: v.optional(v.number()),
})
  .index("by_agent", ["userId", "agentId"]),
```

**Step 5: Add `createdByAgent` to `todos` table**

Find the existing `todos` table definition and add:

```typescript
createdByAgent: v.optional(v.id("agents")),
```

**Step 6: Push schema**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema pushed successfully, 4 new tables created.

**Step 7: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add agents, missions, agentLogs, agentMemory tables"
```

---

## Task 2: Convex Functions — Agents CRUD

**Files:**
- Create: `apps/ops/convex/agents.ts`

**Step 1: Write agents.ts**

```typescript
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db
      .query("agents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
  },
})

export const get = query({
  args: { id: v.id("agents") },
  handler: async (ctx, { id }) => {
    const { userId } = await requireAuth(ctx)
    const agent = await ctx.db.get(id)
    if (!agent || agent.userId !== userId) throw new Error("Introuvable")
    return agent
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db
      .query("agents")
      .withIndex("by_slug", (q) => q.eq("userId", userId).eq("slug", slug))
      .unique()
  },
})

export const create = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    role: v.string(),
    model: v.string(),
    avatar: v.optional(v.string()),
    budget: v.object({
      maxPerMission: v.number(),
      maxPerDay: v.number(),
      maxPerMonth: v.number(),
    }),
    permissions: v.object({
      safe: v.array(v.string()),
      confirm: v.array(v.string()),
      blocked: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db.insert("agents", {
      ...args,
      userId,
      status: "idle",
      usage: {
        todayUsd: 0,
        monthUsd: 0,
        totalUsd: 0,
        lastResetDay: new Date().toISOString().slice(0, 10),
        lastResetMonth: new Date().toISOString().slice(0, 7),
      },
    })
  },
})

export const updateStatus = mutation({
  args: { id: v.id("agents"), status: v.union(v.literal("idle"), v.literal("busy"), v.literal("disabled")) },
  handler: async (ctx, { id, status }) => {
    const { userId } = await requireAuth(ctx)
    const agent = await ctx.db.get(id)
    if (!agent || agent.userId !== userId) throw new Error("Introuvable")
    await ctx.db.patch(id, { status, lastActiveAt: Date.now() })
  },
})

export const addUsage = mutation({
  args: { id: v.id("agents"), costUsd: v.number() },
  handler: async (ctx, { id, costUsd }) => {
    const agent = await ctx.db.get(id)
    if (!agent) throw new Error("Introuvable")

    const today = new Date().toISOString().slice(0, 10)
    const month = new Date().toISOString().slice(0, 7)

    const todayUsd = agent.usage.lastResetDay === today ? agent.usage.todayUsd + costUsd : costUsd
    const monthUsd = agent.usage.lastResetMonth === month ? agent.usage.monthUsd + costUsd : costUsd

    await ctx.db.patch(id, {
      usage: {
        todayUsd,
        monthUsd,
        totalUsd: agent.usage.totalUsd + costUsd,
        lastResetDay: today,
        lastResetMonth: month,
      },
    })
  },
})

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx)

    const existing = await ctx.db
      .query("agents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
    if (existing.length > 0) return

    const agents = [
      {
        slug: "cfo",
        name: "Marc",
        role: "Directeur Financier",
        model: "gpt-4.1-mini",
        avatar: "🟡",
        budget: { maxPerMission: 0.15, maxPerDay: 0.50, maxPerMonth: 5.0 },
        permissions: {
          safe: ["qonto_balance", "qonto_transactions", "list_invoices", "list_recurring_expenses", "treasury_forecast", "list_projects", "list_time_entries"],
          confirm: ["create_note"],
          blocked: ["write_file", "github_create_issue"],
        },
      },
      {
        slug: "timekeeper",
        name: "Léo",
        role: "Suivi de temps",
        model: "gpt-4.1-mini",
        avatar: "🟢",
        budget: { maxPerMission: 0.05, maxPerDay: 0.20, maxPerMonth: 2.0 },
        permissions: {
          safe: ["list_time_entries", "list_projects", "check_time_anomalies"],
          confirm: ["create_note", "create_todo"],
          blocked: ["qonto_balance", "qonto_transactions", "write_file", "github_create_issue"],
        },
      },
      {
        slug: "product-lead",
        name: "Sarah",
        role: "Chef de Produit Blazz UI",
        model: "gpt-4.1",
        avatar: "🔵",
        budget: { maxPerMission: 0.30, maxPerDay: 1.0, maxPerMonth: 8.0 },
        permissions: {
          safe: ["git_log", "git_diff", "read_file", "glob_files", "github_issues", "web_search"],
          confirm: ["write_file", "github_create_issue", "create_note"],
          blocked: ["qonto_balance", "qonto_transactions"],
        },
      },
    ]

    for (const agent of agents) {
      await ctx.db.insert("agents", {
        ...agent,
        userId,
        status: "idle",
        usage: {
          todayUsd: 0, monthUsd: 0, totalUsd: 0,
          lastResetDay: new Date().toISOString().slice(0, 10),
          lastResetMonth: new Date().toISOString().slice(0, 7),
        },
      })
    }
  },
})
```

**Step 2: Push and verify**

Run: `cd apps/ops && npx convex dev --once`

**Step 3: Commit**

```bash
git add apps/ops/convex/agents.ts
git commit -m "feat(ops): add agents CRUD + seed with 3 default agents"
```

---

## Task 3: Convex Functions — Missions CRUD

**Files:**
- Create: `apps/ops/convex/missions.ts`

**Step 1: Write missions.ts**

```typescript
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const missionStatus = v.union(
  v.literal("planning"), v.literal("todo"), v.literal("in_progress"),
  v.literal("review"), v.literal("done"), v.literal("rejected"), v.literal("aborted"),
)

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    const { userId } = await requireAuth(ctx)
    if (status) {
      return ctx.db
        .query("missions")
        .withIndex("by_status", (q) => q.eq("userId", userId).eq("status", status))
        .collect()
    }
    const all = await ctx.db
      .query("missions")
      .withIndex("by_status", (q) => q.eq("userId", userId))
      .collect()
    return all.sort((a, b) => b._creationTime - a._creationTime)
  },
})

export const listByAgent = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db
      .query("missions")
      .withIndex("by_agent", (q) => q.eq("userId", userId).eq("agentId", agentId))
      .collect()
  },
})

export const listByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, { status }) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db
      .query("missions")
      .withIndex("by_status", (q) => q.eq("userId", userId).eq("status", status))
      .collect()
  },
})

export const listCron = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx)
    const all = await ctx.db
      .query("missions")
      .withIndex("by_status", (q) => q.eq("userId", userId))
      .collect()
    return all.filter((m) => m.cron && m.status === "done")
  },
})

export const get = query({
  args: { id: v.id("missions") },
  handler: async (ctx, { id }) => {
    const { userId } = await requireAuth(ctx)
    const mission = await ctx.db.get(id)
    if (!mission || mission.userId !== userId) throw new Error("Introuvable")
    return mission
  },
})

export const create = mutation({
  args: {
    agentId: v.id("agents"),
    title: v.string(),
    prompt: v.string(),
    status: missionStatus,
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    mode: v.optional(v.union(v.literal("dry-run"), v.literal("live"))),
    maxIterations: v.optional(v.number()),
    templateId: v.optional(v.string()),
    cron: v.optional(v.string()),
    onComplete: v.optional(v.object({
      createMission: v.optional(v.object({
        agentSlug: v.string(),
        templateId: v.string(),
        condition: v.optional(v.string()),
      })),
    })),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db.insert("missions", {
      ...args,
      userId,
      mode: args.mode ?? "live",
    })
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id("missions"),
    status: missionStatus,
    soulHash: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, soulHash, rejectionReason }) => {
    const mission = await ctx.db.get(id)
    if (!mission) throw new Error("Introuvable")

    const patch: Record<string, unknown> = { status }
    if (status === "in_progress") patch.startedAt = Date.now()
    if (status === "review" || status === "done") patch.completedAt = Date.now()
    if (status === "done" || status === "rejected") patch.reviewedAt = Date.now()
    if (soulHash) patch.soulHash = soulHash
    if (rejectionReason) patch.rejectionReason = rejectionReason

    await ctx.db.patch(id, patch)
  },
})

export const complete = mutation({
  args: {
    id: v.id("missions"),
    output: v.string(),
    structuredOutput: v.optional(v.any()),
    outputType: v.optional(v.string()),
    actions: v.optional(v.array(v.object({
      type: v.string(),
      description: v.string(),
      entityId: v.optional(v.string()),
      reversible: v.boolean(),
    }))),
    costUsd: v.number(),
    soulHash: v.string(),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, {
      ...data,
      status: "review",
      completedAt: Date.now(),
    })
  },
})

export const failMission = mutation({
  args: { id: v.id("missions"), error: v.string() },
  handler: async (ctx, { id, error }) => {
    await ctx.db.patch(id, { status: "review", error, completedAt: Date.now() })
  },
})

export const createFromTemplate = mutation({
  args: { templateMissionId: v.id("missions") },
  handler: async (ctx, { templateMissionId }) => {
    const template = await ctx.db.get(templateMissionId)
    if (!template) throw new Error("Template introuvable")

    return ctx.db.insert("missions", {
      userId: template.userId,
      agentId: template.agentId,
      title: `${template.title} (auto ${new Date().toLocaleDateString("fr-FR")})`,
      prompt: template.prompt,
      status: "todo",
      priority: template.priority,
      mode: template.mode,
      maxIterations: template.maxIterations,
      templateId: template.templateId,
      cron: template.cron,
      parentMissionId: templateMissionId,
      onComplete: template.onComplete,
    })
  },
})
```

**Step 2: Push and verify**

Run: `cd apps/ops && npx convex dev --once`

**Step 3: Commit**

```bash
git add apps/ops/convex/missions.ts
git commit -m "feat(ops): add missions CRUD + template creation"
```

---

## Task 4: Convex Functions — Agent Logs & Memory

**Files:**
- Create: `apps/ops/convex/agentLogs.ts`
- Create: `apps/ops/convex/agentMemory.ts`

**Step 1: Write agentLogs.ts**

```typescript
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  args: { missionId: v.id("missions") },
  handler: async (ctx, { missionId }) => {
    return ctx.db
      .query("agentLogs")
      .withIndex("by_mission", (q) => q.eq("missionId", missionId))
      .collect()
  },
})

export const append = mutation({
  args: {
    missionId: v.id("missions"),
    agentId: v.id("agents"),
    type: v.union(
      v.literal("thinking"), v.literal("tool_call"), v.literal("tool_result"),
      v.literal("error"), v.literal("budget_warning"), v.literal("done"),
    ),
    content: v.string(),
    toolName: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("agentLogs", args)
  },
})
```

**Step 2: Write agentMemory.ts**

```typescript
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    const { userId } = await requireAuth(ctx)
    const memories = await ctx.db
      .query("agentMemory")
      .withIndex("by_agent", (q) => q.eq("userId", userId).eq("agentId", agentId))
      .collect()

    // Filter expired
    const now = Date.now()
    return memories.filter((m) => !m.expiresAt || m.expiresAt > now)
  },
})

export const add = mutation({
  args: {
    agentId: v.id("agents"),
    missionId: v.optional(v.id("missions")),
    type: v.union(v.literal("summary"), v.literal("learning"), v.literal("fact")),
    content: v.string(),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db.insert("agentMemory", { ...args, userId })
  },
})

export const remove = mutation({
  args: { id: v.id("agentMemory") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})
```

**Step 3: Push and verify**

Run: `cd apps/ops && npx convex dev --once`

**Step 4: Commit**

```bash
git add apps/ops/convex/agentLogs.ts apps/ops/convex/agentMemory.ts
git commit -m "feat(ops): add agentLogs and agentMemory convex functions"
```

---

## Task 5: Soul Files — 3 Agents

**Files:**
- Create: `apps/ops/agents/cfo/SOUL.md`
- Create: `apps/ops/agents/cfo/STYLE.md`
- Create: `apps/ops/agents/cfo/SKILL.md`
- Create: `apps/ops/agents/timekeeper/SOUL.md`
- Create: `apps/ops/agents/timekeeper/STYLE.md`
- Create: `apps/ops/agents/timekeeper/SKILL.md`
- Create: `apps/ops/agents/product-lead/SOUL.md`
- Create: `apps/ops/agents/product-lead/STYLE.md`
- Create: `apps/ops/agents/product-lead/SKILL.md`

**Step 1: Create CFO soul files**

`agents/cfo/SOUL.md`:
```markdown
# Marc — Directeur Financier

## Core Truths
- La trésorerie est la priorité n°1 d'un freelance. Pas de cash = pas de business.
- Toujours donner des chiffres précis, jamais "environ" ou "à peu près".
- Anticiper les problèmes 3 mois avant qu'ils n'arrivent.
- Chaque euro dépensé doit avoir un ROI identifiable.
- Être alarmiste sur les risques, optimiste sur les opportunités.

## Boundaries
- Ne jamais effectuer de paiement ou virement — signaler uniquement.
- Ne jamais supprimer de données comptables — créer des notes/alertes.
- Demander confirmation avant toute action qui modifie une facture.
- Protéger les données bancaires — ne jamais les inclure dans les outputs bruts.

## Vibe
Marc est un DAF expérimenté, direct, qui parle en chiffres. Il ne fait pas
dans le corporate bullshit. Quand il y a un problème de trésorerie, il le dit
cash. Il aime les tableaux, les projections, les scénarios worst-case.
```

`agents/cfo/STYLE.md`:
```markdown
# Style de communication

## Format
- Rapports en markdown structuré (titres, tableaux, listes)
- Chiffres avec séparateur de milliers et symbole € (ex: 12 800 €)
- Toujours un résumé exécutif en haut (3 lignes max)
- Alertes en ⚠ avec recommandation actionable
- Montants toujours en euros, 2 décimales pour les centimes

## Ton
- Direct, pas de formules de politesse inutiles
- Tutoiement
- Phrases courtes, factuelles
- Pas de conditionnel quand les données sont claires
```

`agents/cfo/SKILL.md`:
```markdown
# Modes opératoires

## audit
> Vérifier la cohérence des factures vs transactions Qonto.
Tools: qonto_transactions, list_invoices, list_time_entries, create_note
Prompt: "Auditer les factures et transactions du mois de {mois}. Vérifier la cohérence, signaler les écarts."

## forecast
> Projeter la trésorerie sur N mois.
Tools: qonto_balance, list_projects, list_recurring_expenses, treasury_forecast
Prompt: "Projeter la trésorerie sur {horizon} mois. Alerter si le solde descend sous {seuil} €."

## optimize
> Identifier les dépenses inutiles et opportunités.
Tools: qonto_transactions, list_invoices, list_recurring_expenses, create_note
Prompt: "Analyser les dépenses des 3 derniers mois. Identifier les abonnements inutiles, retards clients, et opportunités d'économie."
```

**Step 2: Create Timekeeper soul files**

`agents/timekeeper/SOUL.md`:
```markdown
# Léo — Suivi de Temps

## Core Truths
- Le temps non saisi est du revenu perdu. Chaque minute compte.
- Les anomalies se détectent par comparaison : semaine vs semaine, projet vs projet.
- Un freelance sain travaille entre 6h et 9h par jour ouvré, pas plus.
- Les jours sans saisie sont des alertes, pas des oublis à ignorer.
- La régularité de la saisie est plus importante que la précision à la minute.

## Boundaries
- Ne jamais modifier une entrée de temps existante — signaler uniquement.
- Ne jamais supprimer d'entrées — créer un todo ou une note.
- Alerter mais ne pas harceler — une notification suffit.

## Vibe
Léo est rapide, concis, bienveillant. Il n'est pas un flic du temps mais un
assistant qui rappelle gentiment. Il détecte les patterns et les anomalies.
Ses rapports sont courts — bullet points, pas de prose.
```

`agents/timekeeper/STYLE.md`:
```markdown
# Style de communication

## Format
- Bullet points, jamais de paragraphes
- Heures affichées en format Xh Ymin (ex: 7h 30min)
- Jours de la semaine en français (Lundi, Mardi...)
- Alertes avec icône : ⚠ anomalie, ✅ OK, ❌ manquant

## Ton
- Bienveillant mais factuel
- Tutoiement
- Phrases très courtes
- Pas de jugement sur les heures travaillées
```

`agents/timekeeper/SKILL.md`:
```markdown
# Modes opératoires

## weekly-check
> Vérifier que la semaine est complète.
Tools: list_time_entries, list_projects, check_time_anomalies
Prompt: "Vérifier les saisies de temps de la semaine du {lundi} au {vendredi}. Signaler les jours sans saisie et les anomalies."

## anomaly-scan
> Détecter les incohérences sur une période.
Tools: list_time_entries, list_projects, check_time_anomalies, create_note
Prompt: "Analyser les saisies de temps du mois de {mois}. Détecter les anomalies : jours vides, heures excessives (>10h), projets sans activité."

## recap
> Résumé de temps par projet pour facturation.
Tools: list_time_entries, list_projects
Prompt: "Récapituler les heures par projet pour {période}. Format : projet | heures | montant facturable."
```

**Step 3: Create Product Lead soul files**

`agents/product-lead/SOUL.md`:
```markdown
# Sarah — Chef de Produit Blazz UI

## Core Truths
- Le produit avance quand on shippe, pas quand on planifie.
- Chaque composant doit résoudre un vrai problème de dev, pas une idée abstraite.
- La concurrence (shadcn, Tremor, NextUI) est le benchmark permanent.
- Les specs doivent être assez précises pour qu'un dev code sans poser de questions.
- La dette technique est un choix produit, pas un accident.

## Boundaries
- Ne jamais merger du code — écrire des specs et des issues, pas du code final.
- Ne jamais supprimer de fichiers — signaler ce qui devrait être supprimé.
- Valider les hypothèses produit avec des données (git log, issues, usage) avant de recommander.
- Ne pas créer plus de 3 issues par mission — prioriser.

## Vibe
Sarah est une PM tech qui a codé avant de devenir PM. Elle comprend le code,
lit les diffs, et écrit des specs qui ressemblent à des plans d'archi, pas à
des user stories vagues. Elle est opiniâtre sur les priorités.
```

`agents/product-lead/STYLE.md`:
```markdown
# Style de communication

## Format
- Specs en markdown structuré avec sections : Contexte, Problème, Solution, Critères de validation
- Issues GitHub en format : titre court, body avec acceptance criteria
- Rapports d'analyse avec tableaux comparatifs
- Liens vers les fichiers du repo quand pertinent

## Ton
- Professionnel mais pas corporate
- Tutoiement
- Opinions tranchées avec justification
- Pas de "il faudrait peut-être" — soit on fait, soit on ne fait pas
```

`agents/product-lead/SKILL.md`:
```markdown
# Modes opératoires

## spec
> Écrire une spec pour un composant ou feature.
Tools: read_file, glob_files, git_log, web_search, write_file
Prompt: "Écrire la spec du composant {nom}. Analyser l'existant, regarder la concurrence, proposer l'API et les variants."

## audit
> Analyser l'état du repo et identifier les problèmes.
Tools: git_log, git_diff, glob_files, read_file, github_issues
Prompt: "Auditer le repo Blazz UI. Identifier : composants incomplets, TODOs, issues ouvertes sans assignee, code mort."

## roadmap
> Proposer les priorités pour le prochain sprint.
Tools: github_issues, git_log, read_file, web_search, create_note
Prompt: "Analyser l'état actuel du produit et proposer les 5 priorités pour les 2 prochaines semaines. Justifier chaque choix."

## investigate
> Investiguer un problème spécifique dans le code.
Tools: read_file, glob_files, git_log, git_diff, github_issues
Prompt: "Investiguer le problème : {description}. Identifier la cause racine, les fichiers impactés, et proposer un fix."
```

**Step 4: Commit**

```bash
git add apps/ops/agents/
git commit -m "feat(ops): add soul files for 3 agents (Marc, Léo, Sarah)"
```

---

## Task 6: Worker — Core Runner

**Files:**
- Create: `apps/ops/worker/package.json`
- Create: `apps/ops/worker/tsconfig.json`
- Create: `apps/ops/worker/src/index.ts`
- Create: `apps/ops/worker/src/runner.ts`
- Create: `apps/ops/worker/src/soul-loader.ts`
- Create: `apps/ops/worker/src/budget.ts`

**Step 1: Create worker package.json**

```json
{
  "name": "@blazz/ops-worker",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "tsx src/index.ts"
  },
  "dependencies": {
    "convex": "^1.33.0",
    "openai": "^6.32.0",
    "node-cron": "^3.0.3"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "@types/node-cron": "^3.0.11"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022"
  },
  "include": ["src/**/*"]
}
```

**Step 3: Write soul-loader.ts**

```typescript
import { readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { join } from "node:path"

const AGENTS_DIR = join(import.meta.dirname, "../../agents")

export interface SoulData {
  systemPrompt: string
  soulHash: string
}

export async function loadSoul(slug: string): Promise<SoulData> {
  const dir = join(AGENTS_DIR, slug)

  const [soul, style, skill] = await Promise.all([
    readFile(join(dir, "SOUL.md"), "utf-8"),
    readFile(join(dir, "STYLE.md"), "utf-8"),
    readFile(join(dir, "SKILL.md"), "utf-8"),
  ])

  const systemPrompt = [soul, style, skill].join("\n\n---\n\n")
  const soulHash = createHash("sha256").update(systemPrompt).digest("hex").slice(0, 8)

  return { systemPrompt, soulHash }
}
```

**Step 4: Write budget.ts**

```typescript
interface Agent {
  model: string
  budget: { maxPerMission: number; maxPerDay: number; maxPerMonth: number }
  usage: { todayUsd: number; monthUsd: number }
}

const RATES: Record<string, { input: number; output: number }> = {
  "gpt-4.1-mini": { input: 0.40, output: 1.60 },
  "gpt-4.1": { input: 2.00, output: 8.00 },
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
}

export function calculateCost(
  usage: { prompt_tokens: number; completion_tokens: number },
  model: string,
): number {
  const rate = RATES[model] ?? RATES["gpt-4.1-mini"]
  return (usage.prompt_tokens * rate.input + usage.completion_tokens * rate.output) / 1_000_000
}

export function canStartMission(agent: Agent): { ok: boolean; reason?: string } {
  const today = new Date().toISOString().slice(0, 10)
  const month = new Date().toISOString().slice(0, 7)

  // Reset checks are handled by Convex addUsage, but check current values
  if (agent.usage.todayUsd >= agent.budget.maxPerDay) {
    return { ok: false, reason: `Budget journalier atteint (${agent.usage.todayUsd.toFixed(3)}$ / ${agent.budget.maxPerDay}$)` }
  }
  if (agent.usage.monthUsd >= agent.budget.maxPerMonth) {
    return { ok: false, reason: `Budget mensuel atteint (${agent.usage.monthUsd.toFixed(3)}$ / ${agent.budget.maxPerMonth}$)` }
  }
  return { ok: true }
}

export function isMissionBudgetExceeded(missionCost: number, maxPerMission: number): boolean {
  return missionCost >= maxPerMission
}
```

**Step 5: Write runner.ts**

```typescript
import OpenAI from "openai"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../convex/_generated/api"
import { loadSoul } from "./soul-loader"
import { calculateCost, canStartMission, isMissionBudgetExceeded } from "./budget"
import type { Tool } from "./tools/index"

const openai = new OpenAI()

interface Mission {
  _id: string
  agentId: string
  title: string
  prompt: string
  mode?: string
  maxIterations?: number
  rejectionReason?: string
  onComplete?: { createMission?: { agentSlug: string; templateId: string; condition?: string } }
}

interface Agent {
  _id: string
  slug: string
  name: string
  model: string
  budget: { maxPerMission: number; maxPerDay: number; maxPerMonth: number }
  usage: { todayUsd: number; monthUsd: number; totalUsd: number; lastResetDay: string; lastResetMonth: string }
  permissions: { safe: string[]; confirm: string[]; blocked: string[] }
}

export async function runMission(
  convex: ConvexHttpClient,
  mission: Mission,
  agent: Agent,
  tools: Tool[],
  signal: AbortSignal,
) {
  // 1. Budget check
  const budgetCheck = canStartMission(agent)
  if (!budgetCheck.ok) {
    await convex.mutation(api.missions.failMission, { id: mission._id as any, error: budgetCheck.reason! })
    return
  }

  // 2. Load soul
  const { systemPrompt, soulHash } = await loadSoul(agent.slug)

  // 3. Resolve tools (filter by permissions)
  const allowedTools = tools.filter((t) => {
    if (agent.permissions.blocked.includes(t.name)) return false
    if (agent.permissions.safe.includes(t.name)) return true
    if (agent.permissions.confirm.includes(t.name)) return true
    return false
  })

  // 4. Update status
  await convex.mutation(api.missions.updateStatus, {
    id: mission._id as any,
    status: "in_progress",
    soulHash,
  })
  await convex.mutation(api.agents.updateStatus, { id: agent._id as any, status: "busy" })

  // 5. Load memory
  const memories = await convex.query(api.agentMemory.list, { agentId: agent._id as any })
  const memoryBlock = memories.length > 0
    ? "\n\n## Mémoire\n" + memories.slice(-10).map((m) => `[${m.type}] ${m.content}`).join("\n")
    : ""

  // 6. Rejection context
  const rejectionBlock = mission.rejectionReason
    ? `\n\nMISSION PRÉCÉDENTE REJETÉE. Raison : ${mission.rejectionReason}\nAjuste ton approche.`
    : ""

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt + memoryBlock + rejectionBlock },
    { role: "user", content: mission.prompt },
  ]

  let missionCost = 0
  let iterations = 0
  const maxIter = mission.maxIterations ?? 15
  const actions: Array<{ type: string; description: string; entityId?: string; reversible: boolean }> = []

  const log = async (type: string, content: string, toolName?: string) => {
    await convex.mutation(api.agentLogs.append, {
      missionId: mission._id as any,
      agentId: agent._id as any,
      type: type as any,
      content,
      toolName,
    })
  }

  try {
    while (!signal.aborted && iterations < maxIter) {
      iterations++

      const response = await openai.chat.completions.create({
        model: agent.model,
        messages,
        tools: allowedTools.length > 0 ? allowedTools.map((t) => t.definition) : undefined,
      })

      // Track cost
      if (response.usage) {
        const cost = calculateCost(response.usage, agent.model)
        missionCost += cost
        await convex.mutation(api.agents.addUsage, { id: agent._id as any, costUsd: cost })
      }

      const choice = response.choices[0]

      // Log thinking
      if (choice.message.content) {
        await log("thinking", choice.message.content)
      }

      // Done?
      if (choice.finish_reason === "stop") break

      // Budget check mid-mission
      if (isMissionBudgetExceeded(missionCost, agent.budget.maxPerMission)) {
        await log("budget_warning", `Budget mission atteint (${missionCost.toFixed(4)}$). Synthèse forcée.`)
        messages.push(choice.message)
        messages.push({ role: "user", content: "BUDGET LIMIT: Conclus maintenant avec les données collectées." })
        continue
      }

      // Execute tool calls
      if (choice.message.tool_calls) {
        messages.push(choice.message)

        for (const call of choice.message.tool_calls) {
          const tool = allowedTools.find((t) => t.name === call.function.name)
          if (!tool) {
            messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify({ error: "Tool not available" }) })
            continue
          }

          await log("tool_call", call.function.arguments, call.function.name)

          let result: string
          const isDryRun = mission.mode === "dry-run" && tool.category === "write"

          if (isDryRun) {
            result = JSON.stringify({ skipped: true, reason: "dry-run mode" })
          } else {
            try {
              const output = await tool.execute(JSON.parse(call.function.arguments), convex)
              result = JSON.stringify(output)

              // Track confirm actions
              if (agent.permissions.confirm.includes(tool.name)) {
                actions.push({
                  type: tool.name,
                  description: `${tool.name}(${call.function.arguments})`,
                  reversible: tool.category === "write",
                })
              }
            } catch (err) {
              result = JSON.stringify({ error: String(err) })
              await log("error", `Tool ${call.function.name} failed: ${err}`, call.function.name)
            }
          }

          await log("tool_result", result, call.function.name)
          messages.push({ role: "tool", tool_call_id: call.id, content: result })
        }
      }
    }

    // Final output
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && typeof m.content === "string")
    const output = (lastAssistant as any)?.content ?? "Mission terminée sans output."

    await log("done", `Mission terminée en ${iterations} itérations. Coût: ${missionCost.toFixed(4)}$`)

    await convex.mutation(api.missions.complete, {
      id: mission._id as any,
      output,
      actions: actions.length > 0 ? actions : undefined,
      costUsd: missionCost,
      soulHash,
    })
  } catch (err) {
    await log("error", String(err))
    await convex.mutation(api.missions.failMission, {
      id: mission._id as any,
      error: String(err),
    })
  } finally {
    await convex.mutation(api.agents.updateStatus, { id: agent._id as any, status: "idle" })
  }
}
```

**Step 6: Write index.ts (entry point)**

```typescript
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../convex/_generated/api"
import { runMission } from "./runner"
import { createToolRegistry } from "./tools/index"
import cron from "node-cron"

const CONVEX_URL = process.env.CONVEX_URL
if (!CONVEX_URL) throw new Error("CONVEX_URL required")

const convex = new ConvexHttpClient(CONVEX_URL)
const running = new Map<string, AbortController>()

async function pollMissions() {
  try {
    const todoMissions = await convex.query(api.missions.listByStatus, { status: "todo" })

    for (const mission of todoMissions) {
      if (running.has(mission._id)) continue

      const agent = await convex.query(api.agents.get, { id: mission.agentId })
      if (!agent || agent.status === "disabled") continue

      const controller = new AbortController()
      running.set(mission._id, controller)

      const tools = createToolRegistry(convex)

      runMission(convex, mission as any, agent as any, tools, controller.signal)
        .finally(() => running.delete(mission._id))
    }
  } catch (err) {
    console.error("[worker] poll error:", err)
  }
}

// Poll every 5 seconds (ConvexHttpClient doesn't support subscriptions)
setInterval(pollMissions, 5000)
console.log("[worker] started, polling every 5s")

// Cron scheduler for recurring missions
async function startCronScheduler() {
  try {
    const cronMissions = await convex.query(api.missions.listCron, {})
    for (const template of cronMissions) {
      if (!template.cron) continue
      cron.schedule(template.cron, async () => {
        console.log(`[cron] creating mission from template: ${template.title}`)
        await convex.mutation(api.missions.createFromTemplate, { templateMissionId: template._id })
      })
    }
    console.log(`[cron] ${cronMissions.length} recurring missions scheduled`)
  } catch (err) {
    console.error("[cron] scheduler error:", err)
  }
}

startCronScheduler()

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("[worker] shutting down...")
  for (const [id, controller] of running) {
    controller.abort()
  }
  process.exit(0)
})
```

> Note : `ConvexHttpClient` ne supporte pas les subscriptions en dehors du navigateur. On utilise un polling 5s. Pour une v2, on pourrait utiliser un WebSocket Convex ou un trigger Convex `scheduler.runAfter`.

**Step 7: Install deps and verify**

Run: `cd apps/ops/worker && pnpm install`

**Step 8: Commit**

```bash
git add apps/ops/worker/
git commit -m "feat(ops): add worker daemon core (runner, soul loader, budget)"
```

---

## Task 7: Worker — Tool Registry

**Files:**
- Create: `apps/ops/worker/src/tools/index.ts`
- Create: `apps/ops/worker/src/tools/finance.ts`
- Create: `apps/ops/worker/src/tools/time.ts`
- Create: `apps/ops/worker/src/tools/product.ts`
- Create: `apps/ops/worker/src/tools/shared.ts`

**Step 1: Write tools/index.ts**

```typescript
import type { ConvexHttpClient } from "convex/browser"
import type OpenAI from "openai"
import { financeTools } from "./finance"
import { timeTools } from "./time"
import { productTools } from "./product"
import { sharedTools } from "./shared"

export interface Tool {
  name: string
  category: "read" | "write"
  definition: OpenAI.ChatCompletionTool
  execute: (args: Record<string, unknown>, convex: ConvexHttpClient) => Promise<unknown>
}

export function createToolRegistry(convex: ConvexHttpClient): Tool[] {
  return [
    ...financeTools(convex),
    ...timeTools(convex),
    ...productTools(),
    ...sharedTools(convex),
  ]
}
```

**Step 2: Write tools/finance.ts**

```typescript
import type { ConvexHttpClient } from "convex/browser"
import { api } from "../../../convex/_generated/api"
import type { Tool } from "./index"

export function financeTools(convex: ConvexHttpClient): Tool[] {
  return [
    {
      name: "qonto_balance",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "qonto_balance",
          description: "Get current Qonto bank account balance",
          parameters: { type: "object", properties: {}, required: [] },
        },
      },
      execute: async () => {
        const settings = await convex.query(api.treasury.getSettings, {})
        return {
          balanceCents: settings?.qontoBalanceCents ?? 0,
          balanceEur: (settings?.qontoBalanceCents ?? 0) / 100,
          lastUpdated: settings?._creationTime,
        }
      },
    },
    {
      name: "qonto_transactions",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "qonto_transactions",
          description: "List recent Qonto bank transactions. Returns the 10 most recent.",
          parameters: { type: "object", properties: {}, required: [] },
        },
      },
      execute: async () => {
        // Delegate to Convex action
        return convex.action(api.qonto.listTransactions, {})
      },
    },
    {
      name: "list_invoices",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "list_invoices",
          description: "List all invoices. Returns id, client, amount, status, dates.",
          parameters: {
            type: "object",
            properties: {
              status: { type: "string", enum: ["draft", "sent", "paid"], description: "Filter by status" },
            },
            required: [],
          },
        },
      },
      execute: async (args) => {
        return convex.query(api.invoices.list, args as any)
      },
    },
    {
      name: "list_recurring_expenses",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "list_recurring_expenses",
          description: "List active recurring expenses (subscriptions, charges, etc.)",
          parameters: { type: "object", properties: {}, required: [] },
        },
      },
      execute: async () => {
        return convex.query(api.treasury.expenseSummary, {})
      },
    },
    {
      name: "treasury_forecast",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "treasury_forecast",
          description: "Get cashflow forecast for the next N months",
          parameters: {
            type: "object",
            properties: {
              months: { type: "number", description: "Number of months to forecast (default 6)" },
            },
            required: [],
          },
        },
      },
      execute: async (args) => {
        return convex.query(api.treasury.forecast, { months: (args.months as number) ?? 6 })
      },
    },
  ]
}
```

**Step 3: Write tools/time.ts**

```typescript
import type { ConvexHttpClient } from "convex/browser"
import { api } from "../../../convex/_generated/api"
import type { Tool } from "./index"

export function timeTools(convex: ConvexHttpClient): Tool[] {
  return [
    {
      name: "list_time_entries",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "list_time_entries",
          description: "List time entries. Can filter by project and date range.",
          parameters: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Filter by project ID" },
              from: { type: "string", description: "Start date YYYY-MM-DD" },
              to: { type: "string", description: "End date YYYY-MM-DD" },
            },
            required: [],
          },
        },
      },
      execute: async (args) => {
        return convex.query(api.timeEntries.list, args as any)
      },
    },
    {
      name: "list_projects",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "list_projects",
          description: "List all projects with their status, client, and budget info.",
          parameters: { type: "object", properties: {}, required: [] },
        },
      },
      execute: async () => {
        return convex.query(api.projects.listAll, {})
      },
    },
    {
      name: "check_time_anomalies",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "check_time_anomalies",
          description: "Check for time tracking anomalies: empty days, excessive hours (>10h), gaps. Specify a date range.",
          parameters: {
            type: "object",
            properties: {
              from: { type: "string", description: "Start date YYYY-MM-DD" },
              to: { type: "string", description: "End date YYYY-MM-DD" },
            },
            required: ["from", "to"],
          },
        },
      },
      execute: async (args) => {
        const entries = await convex.query(api.timeEntries.list, {
          from: args.from as string,
          to: args.to as string,
        })

        // Analyze anomalies
        const byDate: Record<string, number> = {}
        for (const e of entries as any[]) {
          byDate[e.date] = (byDate[e.date] ?? 0) + e.minutes
        }

        const anomalies: string[] = []
        const start = new Date(args.from as string)
        const end = new Date(args.to as string)

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const day = d.getDay()
          if (day === 0 || day === 6) continue // skip weekends
          const dateStr = d.toISOString().slice(0, 10)
          const minutes = byDate[dateStr] ?? 0

          if (minutes === 0) anomalies.push(`❌ ${dateStr}: aucune saisie`)
          else if (minutes > 600) anomalies.push(`⚠ ${dateStr}: ${Math.round(minutes / 60)}h (>10h)`)
          else if (minutes < 120) anomalies.push(`⚠ ${dateStr}: seulement ${Math.round(minutes / 60)}h (<2h)`)
        }

        return {
          totalDays: Object.keys(byDate).length,
          totalMinutes: Object.values(byDate).reduce((a, b) => a + b, 0),
          anomalies,
          anomalyCount: anomalies.length,
        }
      },
    },
  ]
}
```

**Step 4: Write tools/product.ts**

```typescript
import { execSync } from "node:child_process"
import { readFile } from "node:fs/promises"
import { glob } from "node:fs/promises"
import { join } from "node:path"
import type { Tool } from "./index"

const REPO_ROOT = join(import.meta.dirname, "../../../..")

export function productTools(): Tool[] {
  return [
    {
      name: "git_log",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "git_log",
          description: "Get recent git commits. Returns hash, author, date, message.",
          parameters: {
            type: "object",
            properties: {
              count: { type: "number", description: "Number of commits (default 20)" },
              path: { type: "string", description: "Filter by file path" },
            },
            required: [],
          },
        },
      },
      execute: async (args) => {
        const count = (args.count as number) ?? 20
        const pathFilter = args.path ? `-- ${args.path}` : ""
        const output = execSync(
          `git log --oneline --format="%H|%an|%ad|%s" --date=short -${count} ${pathFilter}`,
          { cwd: REPO_ROOT, encoding: "utf-8", timeout: 10000 },
        )
        return output.trim().split("\n").map((line) => {
          const [hash, author, date, ...msg] = line.split("|")
          return { hash, author, date, message: msg.join("|") }
        })
      },
    },
    {
      name: "git_diff",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "git_diff",
          description: "Get diff between two git refs (branches, commits, tags)",
          parameters: {
            type: "object",
            properties: {
              from: { type: "string", description: "Base ref (e.g. main)" },
              to: { type: "string", description: "Target ref (e.g. HEAD)" },
              path: { type: "string", description: "Filter by file path" },
            },
            required: ["from", "to"],
          },
        },
      },
      execute: async (args) => {
        const pathFilter = args.path ? `-- ${args.path}` : ""
        const output = execSync(
          `git diff --stat ${args.from}...${args.to} ${pathFilter}`,
          { cwd: REPO_ROOT, encoding: "utf-8", timeout: 10000 },
        )
        return output.trim()
      },
    },
    {
      name: "read_file",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "read_file",
          description: "Read a file from the repository. Path relative to repo root.",
          parameters: {
            type: "object",
            properties: {
              path: { type: "string", description: "File path relative to repo root" },
            },
            required: ["path"],
          },
        },
      },
      execute: async (args) => {
        const content = await readFile(join(REPO_ROOT, args.path as string), "utf-8")
        return { path: args.path, content: content.slice(0, 10000) } // Cap at 10k chars
      },
    },
    {
      name: "glob_files",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "glob_files",
          description: "Find files matching a glob pattern in the repository",
          parameters: {
            type: "object",
            properties: {
              pattern: { type: "string", description: "Glob pattern (e.g. 'packages/ui/src/**/*.tsx')" },
            },
            required: ["pattern"],
          },
        },
      },
      execute: async (args) => {
        const output = execSync(
          `find . -path './${args.pattern}' -type f | head -50`,
          { cwd: REPO_ROOT, encoding: "utf-8", timeout: 10000 },
        )
        return output.trim().split("\n").filter(Boolean)
      },
    },
    {
      name: "github_issues",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "github_issues",
          description: "List GitHub issues. Returns title, state, labels, assignee.",
          parameters: {
            type: "object",
            properties: {
              state: { type: "string", enum: ["open", "closed", "all"], description: "Filter by state (default: open)" },
              limit: { type: "number", description: "Max results (default 20)" },
            },
            required: [],
          },
        },
      },
      execute: async (args) => {
        const state = (args.state as string) ?? "open"
        const limit = (args.limit as number) ?? 20
        try {
          const output = execSync(
            `gh issue list --state ${state} --limit ${limit} --json number,title,state,labels,assignees,createdAt`,
            { cwd: REPO_ROOT, encoding: "utf-8", timeout: 15000 },
          )
          return JSON.parse(output)
        } catch {
          return { error: "gh CLI not available or not authenticated" }
        }
      },
    },
    {
      name: "web_search",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "web_search",
          description: "Search the web for information (competitor analysis, trends, etc.)",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search query" },
            },
            required: ["query"],
          },
        },
      },
      execute: async (args) => {
        // Use a simple search via DuckDuckGo HTML (no API key needed)
        try {
          const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(args.query as string)}`
          const res = await fetch(url, { headers: { "User-Agent": "BlazzOps/1.0" } })
          const html = await res.text()
          // Extract result snippets (basic extraction)
          const results = html.match(/class="result__snippet">(.*?)<\//g)?.slice(0, 5).map((s) =>
            s.replace(/class="result__snippet">/, "").replace(/<\//, "").trim()
          ) ?? []
          return { query: args.query, results }
        } catch {
          return { query: args.query, results: [], error: "Search failed" }
        }
      },
    },
    {
      name: "write_file",
      category: "write",
      definition: {
        type: "function",
        function: {
          name: "write_file",
          description: "Write content to a file in the repository. For specs, docs, and plans only.",
          parameters: {
            type: "object",
            properties: {
              path: { type: "string", description: "File path relative to repo root" },
              content: { type: "string", description: "File content" },
            },
            required: ["path", "content"],
          },
        },
      },
      execute: async (args) => {
        const { writeFile: wf } = await import("node:fs/promises")
        const fullPath = join(REPO_ROOT, args.path as string)
        await wf(fullPath, args.content as string, "utf-8")
        return { written: args.path, bytes: (args.content as string).length }
      },
    },
    {
      name: "github_create_issue",
      category: "write",
      definition: {
        type: "function",
        function: {
          name: "github_create_issue",
          description: "Create a GitHub issue with title, body, and optional labels",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Issue title" },
              body: { type: "string", description: "Issue body (markdown)" },
              labels: { type: "array", items: { type: "string" }, description: "Labels to apply" },
            },
            required: ["title", "body"],
          },
        },
      },
      execute: async (args) => {
        const labels = (args.labels as string[])?.map((l) => `--label "${l}"`).join(" ") ?? ""
        try {
          const output = execSync(
            `gh issue create --title "${args.title}" --body "${(args.body as string).replace(/"/g, '\\"')}" ${labels} --json number,url`,
            { cwd: REPO_ROOT, encoding: "utf-8", timeout: 15000 },
          )
          return JSON.parse(output)
        } catch {
          return { error: "gh CLI not available or not authenticated" }
        }
      },
    },
  ]
}
```

**Step 5: Write tools/shared.ts**

```typescript
import type { ConvexHttpClient } from "convex/browser"
import { api } from "../../../convex/_generated/api"
import type { Tool } from "./index"

export function sharedTools(convex: ConvexHttpClient): Tool[] {
  return [
    {
      name: "create_note",
      category: "write",
      definition: {
        type: "function",
        function: {
          name: "create_note",
          description: "Create a note in Blazz Ops. Used for alerts, recommendations, audit findings.",
          parameters: {
            type: "object",
            properties: {
              content: { type: "string", description: "Note content (markdown)" },
              entityType: { type: "string", enum: ["general", "client", "project", "invoice"], description: "What this note relates to" },
              entityId: { type: "string", description: "ID of the related entity (optional)" },
            },
            required: ["content"],
          },
        },
      },
      execute: async (args) => {
        return convex.mutation(api.notes.create, {
          content: args.content as string,
          entityType: (args.entityType as string) ?? "general",
          entityId: args.entityId as string | undefined,
        })
      },
    },
    {
      name: "create_todo",
      category: "write",
      definition: {
        type: "function",
        function: {
          name: "create_todo",
          description: "Create a todo task in Blazz Ops.",
          parameters: {
            type: "object",
            properties: {
              text: { type: "string", description: "Todo text" },
              priority: { type: "string", enum: ["urgent", "high", "normal", "low"] },
              dueDate: { type: "string", description: "Due date YYYY-MM-DD" },
            },
            required: ["text"],
          },
        },
      },
      execute: async (args) => {
        return convex.mutation(api.todos.create, {
          text: args.text as string,
          status: "todo",
          priority: (args.priority as string) ?? "normal",
          dueDate: args.dueDate as string | undefined,
        })
      },
    },
  ]
}
```

**Step 6: Commit**

```bash
git add apps/ops/worker/src/tools/
git commit -m "feat(ops): add worker tool registry (finance, time, product, shared)"
```

---

## Task 8: Worker — Notifications & Memory

**Files:**
- Create: `apps/ops/worker/src/notifications.ts`
- Create: `apps/ops/worker/src/memory.ts`

**Step 1: Write notifications.ts**

```typescript
import type { ConvexHttpClient } from "convex/browser"
import { api } from "../../../convex/_generated/api"

interface Mission { _id: string; title: string }
interface Agent { name: string; role: string; avatar?: string }

export async function notifyMissionComplete(
  convex: ConvexHttpClient,
  mission: Mission,
  agent: Agent,
  output: string,
) {
  // 1. Feed item in Ops
  try {
    await convex.mutation(api.notifications.internalCreate, {
      source: "convex",
      title: `${agent.avatar ?? "🤖"} ${agent.name} a terminé : ${mission.title}`,
      body: output.slice(0, 200) + (output.length > 200 ? "..." : ""),
      url: `/missions/${mission._id}`,
      externalId: `mission-${mission._id}`,
    })
  } catch (err) {
    console.error("[notify] feed error:", err)
  }

  // 2. Telegram webhook (optional)
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID
  if (telegramToken && telegramChatId) {
    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `${agent.avatar ?? "🤖"} *${agent.name}* a terminé : *${mission.title}*\n\n${output.slice(0, 500)}`,
          parse_mode: "Markdown",
        }),
      })
    } catch (err) {
      console.error("[notify] telegram error:", err)
    }
  }
}

export async function notifyBudgetAlert(
  convex: ConvexHttpClient,
  agent: Agent,
  type: "day" | "month",
  current: number,
  max: number,
) {
  try {
    await convex.mutation(api.notifications.internalCreate, {
      source: "convex",
      title: `⚠ Budget ${type === "day" ? "journalier" : "mensuel"} atteint pour ${agent.name}`,
      body: `${current.toFixed(3)}$ / ${max}$`,
      url: "/missions",
      externalId: `budget-${agent.name}-${type}-${new Date().toISOString().slice(0, 10)}`,
    })
  } catch (err) {
    console.error("[notify] budget alert error:", err)
  }
}
```

**Step 2: Write memory.ts**

```typescript
import OpenAI from "openai"
import type { ConvexHttpClient } from "convex/browser"
import { api } from "../../../convex/_generated/api"

const openai = new OpenAI()

export async function generatePostMissionMemory(
  convex: ConvexHttpClient,
  agentId: string,
  missionId: string,
  agentModel: string,
  output: string,
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Always use cheap model for memory
      messages: [
        {
          role: "system",
          content: `Tu es un assistant qui résume les apprentissages d'une mission.
Résume en 2-3 phrases UNIQUEMENT les informations clés apprises qui seraient utiles
pour de futures missions. Ne résume PAS le rapport — résume ce que tu as APPRIS
(patterns, anomalies récurrentes, contexte business, chiffres clés à retenir).
Réponds en français.`,
        },
        {
          role: "user",
          content: `Output de la mission :\n\n${output.slice(0, 3000)}`,
        },
      ],
      max_tokens: 200,
    })

    const summary = response.choices[0].message.content
    if (!summary) return

    await convex.mutation(api.agentMemory.add, {
      agentId: agentId as any,
      missionId: missionId as any,
      type: "summary",
      content: summary,
      // Summaries expire after 90 days
      expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
    })
  } catch (err) {
    console.error("[memory] generation error:", err)
  }
}
```

**Step 3: Commit**

```bash
git add apps/ops/worker/src/notifications.ts apps/ops/worker/src/memory.ts
git commit -m "feat(ops): add worker notifications (feed + telegram) and memory generation"
```

---

## Task 9: Add worker:dev script to root

**Files:**
- Modify: `apps/ops/package.json` (add worker script)
- Modify: `package.json` (root, add dev:worker)

**Step 1: Add script to apps/ops/package.json**

Add to `"scripts"`:
```json
"worker:dev": "cd worker && pnpm dev"
```

**Step 2: Add script to root package.json**

Add to `"scripts"`:
```json
"dev:worker": "pnpm --filter @blazz/ops-worker dev"
```

**Step 3: Add worker to pnpm-workspace.yaml if needed**

Check if `apps/ops/worker` is already included by the workspace globs. If not, add it.

**Step 4: Commit**

```bash
git add apps/ops/package.json package.json
git commit -m "feat(ops): add worker:dev script to package.json"
```

---

## Task 10: Mission Control UI — Page & Client

**Files:**
- Create: `apps/ops/app/(main)/missions/page.tsx`
- Create: `apps/ops/app/(main)/missions/_client.tsx`

Prerequisite: Read `blazz rules`, `blazz pattern pipeline-kanban`. Use `Page`, `PageHeader` from `@blazz/pro`, layout primitives from `@blazz/ui`. Never raw divs for layout.

**Step 1: Write page.tsx (Server Component)**

```tsx
import type { Metadata } from "next"
import { MissionsClient } from "./_client"

export const metadata: Metadata = { title: "Mission Control — Blazz Ops" }

export default function MissionsPage() {
  return <MissionsClient />
}
```

**Step 2: Write _client.tsx**

This is a large file — follows the pipeline-kanban pattern with list as default view. Key structure:

- `useQuery(api.missions.list)` for missions
- `useQuery(api.agents.list)` for agent data
- `useMutation(api.missions.create)` for new missions
- `useMutation(api.missions.updateStatus)` for drag-and-drop status changes
- `useState` for view toggle (list/kanban), dialog open
- Components: `Page`, `PageHeader`, `Badge`, `Button`, `Dialog`, `BlockStack`, `InlineStack`
- Mission cards show: title, agent avatar+name, priority dot, cost/budget
- Empty state when no missions

Full code to be written during implementation — follows patterns from `treasury/_client.tsx` and `todos/_client.tsx`.

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/missions/
git commit -m "feat(ops): add Mission Control page with list/kanban views"
```

---

## Task 11: Mission Control UI — Detail Page

**Files:**
- Create: `apps/ops/app/(main)/missions/[id]/page.tsx`
- Create: `apps/ops/app/(main)/missions/[id]/_client.tsx`

**Step 1: Write page.tsx**

```tsx
import type { Metadata } from "next"
import { MissionDetailClient } from "./_client"

export const metadata: Metadata = { title: "Mission — Blazz Ops" }

export default async function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <MissionDetailClient id={id} />
}
```

**Step 2: Write _client.tsx**

Key structure:
- `useQuery(api.missions.get, { id })` — mission data
- `useQuery(api.agentLogs.list, { missionId })` — real-time logs
- `useQuery(api.agents.get, { id: mission.agentId })` — agent info
- `Tabs`: Output (markdown) | Logs (ActivityTimeline) | Actions | Prompt
- Review actions: Validate (→ done), Reject (with required reason, Dialog), Re-run, Abort
- Abort sends `updateStatus(id, "aborted")`
- Badge for status, priority, dry-run, cost

Full code to be written during implementation.

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/missions/\[id\]/
git commit -m "feat(ops): add mission detail page with logs, output, and review actions"
```

---

## Task 12: Mission Control UI — Components

**Files:**
- Create: `apps/ops/app/(main)/missions/_components/mission-card.tsx`
- Create: `apps/ops/app/(main)/missions/_components/mission-form.tsx`
- Create: `apps/ops/app/(main)/missions/_components/agent-picker.tsx`
- Create: `apps/ops/app/(main)/missions/_components/mission-logs.tsx`
- Create: `apps/ops/app/(main)/missions/_components/mission-output.tsx`

**Step 1: mission-card.tsx** — Compact card for list/kanban with title, agent, priority dot, cost

**Step 2: mission-form.tsx** — Dialog with agent picker, template select (derived from SKILL modes), title, prompt textarea, priority, mode toggle, optional cron

**Step 3: agent-picker.tsx** — Select component showing agent avatar + name + role + budget remaining

**Step 4: mission-logs.tsx** — Real-time ActivityTimeline using Convex subscription on agentLogs

**Step 5: mission-output.tsx** — Markdown renderer for mission output

Full code to be written during implementation — each component follows @blazz/ui patterns.

**Step 6: Commit**

```bash
git add apps/ops/app/\(main\)/missions/_components/
git commit -m "feat(ops): add mission UI components (card, form, picker, logs, output)"
```

---

## Task 13: Navigation — Add Missions to Sidebar

**Files:**
- Modify: `apps/ops/config/navigation.ts` (or equivalent sidebar config)

**Step 1: Add "Mission Control" entry**

Find the navigation config and add a new entry:

```typescript
{
  title: "Mission Control",
  href: "/missions",
  icon: Bot, // from lucide-react
}
```

Place it in a prominent position (after Dashboard/Today, before operational pages).

**Step 2: Verify navigation works**

Run: `pnpm dev:ops` and check sidebar.

**Step 3: Commit**

```bash
git add apps/ops/config/
git commit -m "feat(ops): add Mission Control to sidebar navigation"
```

---

## Task 14: Integration Test — End to End

**Step 1: Start all services**

```bash
# Terminal 1
pnpm dev:ops

# Terminal 2
cd apps/ops && npx convex dev

# Terminal 3
cd apps/ops/worker && pnpm dev
```

**Step 2: Seed agents**

Open the Ops app, go to Convex dashboard, or call `agents.seed` mutation.

**Step 3: Create a test mission**

1. Go to `/missions`
2. Create a new mission: Agent = Léo (Timekeeper), Template = weekly-check, Priority = medium
3. Set status to "todo"

**Step 4: Verify worker picks it up**

Watch Terminal 3 — worker should log:
- Mission detected
- Soul loaded
- Tool calls
- Mission completed

**Step 5: Review mission**

1. Go back to `/missions`
2. Mission should be in "Review" column/status
3. Click to see output, logs, actions
4. Validate or reject

**Step 6: Test budget limits**

Set Léo's `maxPerMission` to $0.001 and run a mission. Should get "Budget mission atteint" in logs.

**Step 7: Test dry-run**

Create a mission with mode = "dry-run". Write tools should return `{ skipped: true }`.

**Step 8: Commit any fixes**

```bash
git commit -am "fix(ops): integration test fixes for agent system"
```

---

## Summary

| Task | Description | Estimated effort |
|------|-------------|-----------------|
| 1 | Convex schema (4 tables) | 10 min |
| 2 | Agents CRUD + seed | 15 min |
| 3 | Missions CRUD | 15 min |
| 4 | Agent logs + memory | 10 min |
| 5 | Soul files (9 files) | 20 min |
| 6 | Worker core (runner, index) | 30 min |
| 7 | Tool registry (18 tools) | 30 min |
| 8 | Notifications + memory gen | 15 min |
| 9 | Dev scripts | 5 min |
| 10 | Mission Control page | 30 min |
| 11 | Mission detail page | 25 min |
| 12 | UI components | 30 min |
| 13 | Navigation | 5 min |
| 14 | Integration test | 20 min |
| **Total** | | **~4h** |
