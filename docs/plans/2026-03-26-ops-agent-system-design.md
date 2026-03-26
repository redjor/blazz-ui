# Ops Agent System — Design

> Système d'agents autonomes style OpenClaw intégré dans Blazz Ops.
> Agents IA assignés à des missions via un Mission Control (kanban).

Date : 2026-03-26

---

## Vue d'ensemble

3 agents autonomes avec personnalité (Soul System), exécutés par un Worker Node daemon,
pilotés depuis une UI Mission Control dans l'app Ops.

### Agents

| Agent | Slug | Nom | Rôle | Modèle | Budget/mois |
|-------|------|-----|------|--------|-------------|
| CFO | `cfo` | Marc | Directeur Financier | gpt-4.1-mini | $5.00 |
| Timekeeper | `timekeeper` | Léo | Suivi de temps | gpt-4.1-mini | $2.00 |
| Product Lead | `product-lead` | Sarah | Chef de Produit Blazz UI | gpt-4.1 | $8.00 |

### Stack

- **UI** : Next.js (app Ops) — page Mission Control
- **Backend** : Convex (tables agents, missions, agentLogs, agentMemory)
- **Worker** : Daemon Node long-running, Convex subscription (pas polling)
- **LLM** : OpenAI API (gpt-4.1-mini / gpt-4.1) — pas Claude (coût)
- **Soul System** : Fichiers Markdown versionnés dans `apps/ops/agents/`

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  APP OPS (Next.js)                   │
│                                                      │
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │  Mission      │  │  Pages existantes            │ │
│  │  Control      │  │  (treasury, time, chat...)   │ │
│  │  /missions    │  │                              │ │
│  └──────┬───────┘  └──────────────────────────────┘ │
└─────────┼────────────────────────────────────────────┘
          │ Convex subscriptions (real-time)
          ▼
┌─────────────────────────────────────────────────────┐
│                CONVEX (Backend)                       │
│                                                      │
│  agents       missions      agentLogs   agentMemory │
│  (registry)   (queue)       (audit)     (mémoire)   │
└─────────┬────────────────────────────────────────────┘
          │ Convex subscription (réactif, pas polling)
          ▼
┌─────────────────────────────────────────────────────┐
│            WORKER NODE (Daemon)                       │
│                                                      │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐ │
│  │ Runner    │  │ Soul      │  │ Tool Registry    │ │
│  │ (loop)    │  │ Loader    │  │ (safe/confirm/   │ │
│  │           │  │           │  │  blocked)        │ │
│  └────┬──────┘  └───────────┘  └──────────────────┘ │
│       │                                              │
│  agents/                                             │
│  ├── cfo/          SOUL.md, STYLE.md, SKILL.md      │
│  ├── timekeeper/   SOUL.md, STYLE.md, SKILL.md      │
│  └── product-lead/ SOUL.md, STYLE.md, SKILL.md      │
└──────────────────────────────────────────────────────┘
          │
          ▼ Appels externes
   ┌──────────────────────────┐
   │ OpenAI API (GPT-4.1)     │
   │ Qonto API                │
   │ GitHub API                │
   │ Git local                 │
   │ Web Search                │
   └──────────────────────────┘
```

### Flow principal

1. Tu crées une mission dans Mission Control (ou un cron la crée)
2. Tu l'assignes à un agent et la passes en "todo"
3. Le Worker détecte la mission (Convex subscription), charge le SOUL
4. L'agent exécute (tool loop OpenAI), log chaque étape dans `agentLogs`
5. Quand il finit → status "review", tu consultes l'output
6. Tu valides (done) ou rejettes avec raison (retour planning, raison injectée au re-run)

---

## Data Model (Convex)

### Table `agents`

```typescript
agents: defineTable({
  userId: v.id("users"),
  slug: v.string(),                // "cfo", "timekeeper", "product-lead"
  name: v.string(),                // "Marc", "Léo", "Sarah"
  role: v.string(),                // "Directeur Financier"
  model: v.string(),               // "gpt-4.1-mini" | "gpt-4.1"
  avatar: v.optional(v.string()),  // emoji ou URL
  status: v.string(),              // "idle" | "busy" | "disabled"
  lastActiveAt: v.optional(v.number()),
  budget: v.object({
    maxPerMission: v.number(),     // $ max par mission (ex: 0.15)
    maxPerDay: v.number(),         // $ max par jour (ex: 0.50)
    maxPerMonth: v.number(),       // $ max par mois (ex: 5.00)
  }),
  usage: v.object({
    todayUsd: v.number(),
    monthUsd: v.number(),
    totalUsd: v.number(),
    lastResetDay: v.string(),      // "2026-03-26"
    lastResetMonth: v.string(),    // "2026-03"
  }),
  permissions: v.object({
    safe: v.array(v.string()),     // tools auto-exécutés
    confirm: v.array(v.string()),  // tools qui nécessitent review post-mission
    blocked: v.array(v.string()),  // tools interdits
  }),
})
  .index("by_user", ["userId"])
  .index("by_slug", ["userId", "slug"])
```

### Table `missions`

```typescript
missions: defineTable({
  userId: v.id("users"),
  agentId: v.id("agents"),
  title: v.string(),
  prompt: v.string(),
  status: v.string(),              // "planning" | "todo" | "in_progress" | "review" | "done" | "rejected"
  priority: v.string(),            // "low" | "medium" | "high" | "urgent"
  mode: v.optional(v.string()),    // "dry-run" | "live" (default: "live")
  output: v.optional(v.string()),  // résultat markdown
  structuredOutput: v.optional(v.any()),  // JSON exploitable (forecast, audit...)
  outputType: v.optional(v.string()),     // "report" | "actions" | "spec"
  actions: v.optional(v.array(v.object({
    type: v.string(),              // "created_note", "created_issue", "updated_data"
    description: v.string(),
    entityId: v.optional(v.string()),
    reversible: v.boolean(),
  }))),
  error: v.optional(v.string()),
  costUsd: v.optional(v.number()),        // coût réel de la mission
  maxIterations: v.optional(v.number()),  // default 15
  rejectionReason: v.optional(v.string()),
  soulHash: v.optional(v.string()),       // hash des fichiers SOUL au moment du run
  templateId: v.optional(v.string()),     // ref vers le mode SKILL.md utilisé
  // Scheduling
  cron: v.optional(v.string()),           // ex: "0 17 * * 5" (vendredi 17h)
  parentMissionId: v.optional(v.id("missions")),  // chaînage
  onComplete: v.optional(v.object({
    createMission: v.optional(v.object({
      agentSlug: v.string(),
      templateId: v.string(),
      condition: v.optional(v.string()),  // ex: "anomaly_detected"
    })),
  })),
  // Timestamps
  startedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  reviewedAt: v.optional(v.number()),
  metadata: v.optional(v.any()),
})
  .index("by_status", ["userId", "status"])
  .index("by_agent", ["userId", "agentId"])
  .index("by_cron", ["userId", "cron"])
```

### Table `agentLogs`

```typescript
agentLogs: defineTable({
  missionId: v.id("missions"),
  agentId: v.id("agents"),
  type: v.string(),                // "thinking" | "tool_call" | "tool_result" | "error" | "budget_warning" | "done"
  content: v.string(),
  toolName: v.optional(v.string()),
  duration: v.optional(v.number()),
})
  .index("by_mission", ["missionId"])
```

### Table `agentMemory`

```typescript
agentMemory: defineTable({
  userId: v.id("users"),
  agentId: v.id("agents"),
  missionId: v.optional(v.id("missions")),  // source
  type: v.string(),                // "summary" | "learning" | "fact"
  content: v.string(),            // résumé ou fait appris
  expiresAt: v.optional(v.number()),  // mémoire qui expire (optionnel)
})
  .index("by_agent", ["userId", "agentId"])
```

### Modification table `todos` (existante)

Ajout d'un champ optionnel :

```typescript
createdByAgent: v.optional(v.id("agents"))  // si créé par un agent
```

---

## Soul System

### Structure fichiers

```
apps/ops/agents/
├── cfo/
│   ├── SOUL.md          ← Identité, croyances, limites
│   ├── STYLE.md         ← Voix, ton, format de sortie
│   └── SKILL.md         ← Modes opératoires + tools par mode
├── timekeeper/
│   ├── SOUL.md
│   ├── STYLE.md
│   └── SKILL.md
└── product-lead/
    ├── SOUL.md
    ├── STYLE.md
    └── SKILL.md
```

### SOUL.md — Identité

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
- Protéger les données bancaires — ne jamais les inclure dans les outputs.

## Vibe
Marc est un DAF expérimenté, direct, qui parle en chiffres. Il ne fait pas
dans le corporate bullshit. Quand il y a un problème de trésorerie, il le dit
cash. Il aime les tableaux, les projections, les scénarios worst-case.
```

### STYLE.md — Voix

```markdown
# Style de communication

## Format
- Rapports en markdown structuré (titres, tableaux, listes)
- Chiffres avec séparateur de milliers et symbole € (ex: 12 800 €)
- Toujours un résumé exécutif en haut (3 lignes max)
- Alertes en ⚠ avec recommandation actionable

## Ton
- Direct, pas de formules de politesse inutiles
- Tutoiement
- Phrases courtes, factuelles
- Pas de conditionnel quand les données sont claires ("tu vas perdre", pas "tu pourrais perdre")
```

### SKILL.md — Modes opératoires

```markdown
# Modes opératoires

Chaque mode est un template de mission invocable depuis Mission Control.

## audit
> Vérifier la cohérence des factures vs transactions Qonto.

Tools: qonto_transactions, list_invoices, list_time_entries, create_note
Prompt template: "Auditer les factures et transactions du mois de {mois}. Vérifier la cohérence, signaler les écarts."

## forecast
> Projeter la trésorerie sur N mois.

Tools: qonto_balance, list_projects, list_recurring_expenses, treasury_forecast
Prompt template: "Projeter la trésorerie sur {horizon} mois. Alerter si le solde descend sous {seuil} €."

## optimize
> Identifier les dépenses inutiles et opportunités.

Tools: qonto_transactions, list_invoices, list_recurring_expenses, create_note
Prompt template: "Analyser les dépenses des 3 derniers mois. Identifier les abonnements inutiles, retards clients, et opportunités d'économie."
```

### Chargement

```typescript
const soul = await fs.readFile(`agents/${agent.slug}/SOUL.md`, "utf-8")
const style = await fs.readFile(`agents/${agent.slug}/STYLE.md`, "utf-8")
const skill = await fs.readFile(`agents/${agent.slug}/SKILL.md`, "utf-8")
const systemPrompt = [soul, style, skill].join("\n\n---\n\n")
const soulHash = createHash("sha256").update(systemPrompt).digest("hex").slice(0, 8)
```

---

## Worker Node (Daemon)

### Architecture

```
apps/ops/worker/
├── index.ts              ← Point d'entrée, subscription Convex
├── runner.ts             ← Agent loop (OpenAI tool loop)
├── soul-loader.ts        ← Charge et hash les fichiers SOUL/STYLE/SKILL
├── budget.ts             ← Vérification et tracking budget
├── scheduler.ts          ← Cron scheduler pour missions récurrentes
├── tools/
│   ├── index.ts          ← Registry + résolution par permission
│   ├── finance.ts        ← qonto_balance, qonto_transactions, list_invoices, list_recurring_expenses, treasury_forecast
│   ├── time.ts           ← list_time_entries, list_projects, check_time_anomalies
│   ├── product.ts        ← git_log, git_diff, github_issues, github_create_issue, read_file, glob_files, web_search, write_file
│   └── shared.ts         ← create_note, create_todo
└── notifications.ts      ← Push dans feed Ops + webhook Telegram
```

### Subscription Convex (pas polling)

```typescript
// worker/index.ts
const convex = new ConvexClient(process.env.CONVEX_URL!)

// Réagit instantanément aux nouvelles missions "todo"
convex.onUpdate(api.missions.listByStatus, { status: "todo" }, async (missions) => {
  for (const mission of missions) {
    if (!running.has(mission._id)) {
      running.set(mission._id, new AbortController())
      runMission(mission, running.get(mission._id)!.signal)
    }
  }
})
```

### Tool Loop

```typescript
// worker/runner.ts
async function runMission(mission: Mission, signal: AbortSignal) {
  const agent = await convex.query(api.agents.get, { id: mission.agentId })

  // 1. Vérif budget
  if (agent.usage.todayUsd >= agent.budget.maxPerDay) {
    await failMission(mission, "Budget journalier atteint")
    return
  }

  // 2. Charger soul
  const { systemPrompt, soulHash } = await loadSoul(agent.slug)

  // 3. Résoudre les tools (filtrés par permissions agent)
  const tools = resolveTools(agent, mission.mode === "dry-run")

  // 4. Passer en in_progress
  await convex.mutation(api.missions.updateStatus, {
    id: mission._id, status: "in_progress", soulHash
  })

  // 5. Injecter mémoire agent
  const memories = await convex.query(api.agentMemory.list, { agentId: agent._id })
  const memoryContext = memories.map(m => `[${m.type}] ${m.content}`).join("\n")

  // 6. Injecter rejectionReason si re-run
  const rejectionContext = mission.rejectionReason
    ? `\n\nMISSION PRÉCÉDENTE REJETÉE. Raison : ${mission.rejectionReason}\nAjuste ton approche en conséquence.`
    : ""

  const messages = [
    { role: "system", content: systemPrompt + "\n\n## Mémoire\n" + memoryContext + rejectionContext },
    { role: "user", content: mission.prompt },
  ]

  let missionCost = 0
  let iterations = 0
  const maxIter = mission.maxIterations ?? 15

  // 7. Agent loop
  while (!signal.aborted && iterations < maxIter) {
    iterations++

    const response = await openai.chat.completions.create({
      model: agent.model,
      messages,
      tools: tools.map(t => t.definition),
    })

    // Track cost
    const cost = calculateCost(response.usage, agent.model)
    missionCost += cost
    await convex.mutation(api.agents.addUsage, { id: agent._id, costUsd: cost })

    const choice = response.choices[0]

    // Log thinking
    if (choice.message.content) {
      await log(mission, agent, { type: "thinking", content: choice.message.content })
    }

    // Done?
    if (choice.finish_reason === "stop") break

    // Budget check mid-mission
    if (missionCost >= agent.budget.maxPerMission) {
      await log(mission, agent, { type: "budget_warning", content: "Budget mission atteint, synthèse forcée" })
      messages.push(choice.message)
      messages.push({
        role: "user",
        content: "BUDGET LIMIT: Conclus maintenant avec les données collectées."
      })
      continue
    }

    // Execute tool calls
    for (const call of choice.message.tool_calls ?? []) {
      await log(mission, agent, {
        type: "tool_call", toolName: call.function.name,
        content: call.function.arguments
      })

      // Dry-run: skip write tools
      const tool = tools.find(t => t.name === call.function.name)
      let result: string
      if (mission.mode === "dry-run" && tool?.category === "write") {
        result = JSON.stringify({ skipped: true, reason: "dry-run mode" })
      } else {
        result = JSON.stringify(await tool!.execute(JSON.parse(call.function.arguments)))
      }

      await log(mission, agent, {
        type: "tool_result", toolName: call.function.name, content: result
      })

      messages.push(choice.message)
      messages.push({ role: "tool", tool_call_id: call.id, content: result })
    }
  }

  // 8. Finaliser
  const finalContent = messages.filter(m => m.role === "assistant").pop()?.content ?? ""
  await convex.mutation(api.missions.complete, {
    id: mission._id,
    output: finalContent,
    costUsd: missionCost,
    soulHash,
  })

  // 9. Mémoire post-mission (auto-résumé)
  await generateMemory(agent, mission, finalContent)

  // 10. Notification
  await notify(mission, agent, finalContent)

  // 11. Chaînage
  if (mission.onComplete?.createMission) {
    await chainMission(mission)
  }

  running.delete(mission._id)
}
```

### Abort

```typescript
// Appelé depuis l'UI via Convex mutation
// Le worker écoute un flag "aborted" sur la mission
convex.onUpdate(api.missions.get, { id: missionId }, (mission) => {
  if (mission.status === "aborted") {
    running.get(missionId)?.abort()
  }
})
```

### Cron Scheduler

```typescript
// worker/scheduler.ts
import cron from "node-cron"

async function startScheduler() {
  const cronMissions = await convex.query(api.missions.listCron)

  for (const template of cronMissions) {
    cron.schedule(template.cron!, async () => {
      await convex.mutation(api.missions.createFromTemplate, {
        templateMissionId: template._id,
      })
      // La mission créée en "todo" sera captée par la subscription
    })
  }
}
```

---

## Tool Registry

### Permissions par agent

```typescript
// Defaults
const agentPermissions = {
  cfo: {
    safe: ["qonto_balance", "qonto_transactions", "list_invoices",
           "list_recurring_expenses", "treasury_forecast", "list_projects",
           "list_time_entries"],
    confirm: ["create_note"],
    blocked: ["write_file", "github_create_issue", "delete_*"],
  },
  timekeeper: {
    safe: ["list_time_entries", "list_projects", "check_time_anomalies"],
    confirm: ["create_note", "create_todo"],
    blocked: ["qonto_*", "write_file", "github_*", "delete_*"],
  },
  "product-lead": {
    safe: ["git_log", "git_diff", "read_file", "glob_files",
           "github_issues", "web_search"],
    confirm: ["write_file", "github_create_issue", "create_note"],
    blocked: ["qonto_*", "delete_*"],
  },
}
```

- **safe** : exécuté automatiquement
- **confirm** : exécuté, mais flaggé dans les actions pour review
- **blocked** : jamais exécuté, l'agent reçoit "Tool not available"

### Tool definitions

| Tool | Category | Description |
|------|----------|-------------|
| `qonto_balance` | read | Solde actuel compte Qonto |
| `qonto_transactions` | read | Transactions (période, type) |
| `list_invoices` | read | Factures (client, statut, période) |
| `list_recurring_expenses` | read | Dépenses récurrentes |
| `treasury_forecast` | read | Projection trésorerie |
| `list_projects` | read | Projets (actifs, terminés) |
| `list_time_entries` | read | Entrées de temps (projet, période) |
| `check_time_anomalies` | read | Détecte anomalies (jours vides, heures excessives) |
| `git_log` | read | Historique commits (branch, période, author) |
| `git_diff` | read | Diff entre deux refs |
| `read_file` | read | Lire un fichier du repo |
| `glob_files` | read | Trouver des fichiers par pattern |
| `github_issues` | read | Lister/filtrer les issues GitHub |
| `web_search` | read | Recherche web |
| `create_note` | write | Créer une note dans Convex |
| `create_todo` | write | Créer un todo dans Convex |
| `write_file` | write | Écrire un fichier (specs, docs) |
| `github_create_issue` | write | Créer une issue GitHub |

---

## Budget System

### 3 niveaux de contrôle

```typescript
budget: {
  maxPerMission: number   // abort + synthèse forcée si dépassé
  maxPerDay: number       // refuse de lancer la mission
  maxPerMonth: number     // refuse de lancer la mission
}
```

### Defaults par agent

| Agent | Par mission | Par jour | Par mois |
|-------|------------|----------|----------|
| Marc (CFO) | $0.15 | $0.50 | $5.00 |
| Léo (Timekeeper) | $0.05 | $0.20 | $2.00 |
| Sarah (Product Lead) | $0.30 | $1.00 | $8.00 |

### Reset automatique

- `todayUsd` reset à minuit (comparaison `lastResetDay` vs date du jour)
- `monthUsd` reset le 1er du mois (comparaison `lastResetMonth` vs mois courant)

### Calcul du coût

```typescript
function calculateCost(usage: { prompt_tokens: number; completion_tokens: number }, model: string): number {
  const rates: Record<string, { input: number; output: number }> = {
    "gpt-4.1-mini": { input: 0.40, output: 1.60 },   // per 1M tokens
    "gpt-4.1":      { input: 2.00, output: 8.00 },
  }
  const rate = rates[model]
  return (usage.prompt_tokens * rate.input + usage.completion_tokens * rate.output) / 1_000_000
}
```

---

## Notifications

### Quand notifier

| Événement | Notification |
|-----------|-------------|
| Mission terminée → review | Feed Ops + Telegram |
| Mission en erreur | Feed Ops + Telegram |
| Budget jour/mois atteint | Feed Ops + Telegram |
| Mission cron créée auto | Feed Ops |
| Chaînage déclenché | Feed Ops |

### Canaux

1. **Feed Ops** : feedItem dans la table `feedItems` existante (visible dans /veille)
2. **Telegram webhook** : POST vers bot Telegram (optionnel, configuré dans settings)

---

## Mission Control UI

### Fichiers

```
apps/ops/app/(main)/missions/
  page.tsx                    ← Server Component
  _client.tsx                 ← Client (kanban/liste + interactions)
  [id]/
    page.tsx                  ← Détail mission
    _client.tsx               ← Client (logs live, review actions)
  _components/
    mission-card.tsx          ← Card dans le kanban/liste
    mission-form.tsx          ← Dialog création (agent picker, template, prompt)
    agent-picker.tsx          ← Select agent avec avatar + rôle + budget restant
    mission-logs.tsx          ← ActivityTimeline temps réel
    mission-output.tsx        ← Rendu markdown + structured output
```

### Page principale `/missions`

- **Vue par défaut : liste** (plus dense au début, peu de missions)
- **Vue kanban en option** (toggle dans le header)
- 5 colonnes/statuts : Planning, Todo, In Progress, Review, Done
- Pattern pipeline-kanban de Blazz (Page + PageHeader + KanbanBoard)
- Drag & drop : déplacer en "todo" déclenche l'agent
- Composants : `Page`, `PageHeader`, `Badge`, `KanbanBoard` ou `DataGrid`, `Dialog`

### Mission Card

```
┌─────────────────────────────┐
│ Audit dépenses mars 2026    │  title, 13px, font-medium
│ 🟡 Marc · CFO              │  avatar + nom + rôle, 12px, text-muted
│ ● Haute   $0.03 / $0.15    │  dot priorité + coût/budget
└─────────────────────────────┘
```

- Border subtil 1px, pas de shadow
- Hover : border-color passe à --border-default
- Clic : `/missions/[id]`

### Détail mission `/missions/[id]`

- `PageHeader` : titre + agent + statut + priorité + coût + durée
- `Tabs` : Output | Logs | Actions | Prompt
  - **Output** : markdown rendu + structured output (chart si forecast)
  - **Logs** : `ActivityTimeline` avec Convex subscription (live)
  - **Actions** : liste des mutations effectuées (confirm tools flaggés)
  - **Prompt** : le prompt original + soul hash
- Actions bas de page : Valider | Rejeter (avec raison obligatoire) | Re-run | Abort (si in_progress)

### Création de mission

Dialog modale :
1. **Agent picker** — Select avec avatar + nom + rôle + budget restant du mois
2. **Template** — Select dérivé des modes SKILL.md de l'agent choisi (pré-remplit le prompt)
3. **Titre** — text input
4. **Prompt** — textarea (pré-rempli si template)
5. **Priorité** — low / medium / high / urgent
6. **Mode** — live (default) / dry-run
7. **Cron** — optionnel, expression cron pour récurrence
8. **Statut initial** — planning (draft) ou todo (lancement immédiat)

### 4 états obligatoires

| État | Implémentation |
|------|---------------|
| Loading | Skeleton liste/kanban (colonnes + cards fantômes) |
| Empty | EmptyState "Aucune mission" + CTA "Créer votre première mission" |
| Error | ErrorState + retry |
| In Progress (live) | Card avec shimmer + logs temps réel |

---

## Dry-Run Mode

- Les tools `write` (create_note, write_file, github_create_issue) sont interceptés
- L'agent reçoit `{ skipped: true, reason: "dry-run mode" }` au lieu du résultat réel
- L'output est produit normalement (l'agent raisonne comme si les actions avaient eu lieu)
- Visible dans le détail mission : badge "DRY-RUN" sur la mission
- Utile pour tester un nouveau prompt, un nouveau soul, ou valider avant de passer en live

---

## Chaînage Multi-Agent

```typescript
onComplete: {
  createMission: {
    agentSlug: "product-lead",
    templateId: "investigate",
    condition: "anomaly_detected"  // optionnel
  }
}
```

- À la fin d'une mission, si `onComplete` est défini, le worker crée une nouvelle mission
- Le `condition` est évalué sur le `structuredOutput` (ex: `output.anomalies.length > 0`)
- La nouvelle mission hérite du contexte via `parentMissionId`
- Exemple : Marc détecte une anomalie de facturation → Sarah investigue le code de facturation

---

## Mémoire Agent

### Post-mission auto-résumé

Après chaque mission terminée, le worker demande à l'agent :

```
Résume en 2-3 phrases les informations clés apprises lors de cette mission
qui seraient utiles pour tes futures missions. Ne résume pas le rapport,
résume ce que tu as APPRIS (patterns, anomalies récurrentes, contexte business).
```

Le résumé est stocké dans `agentMemory` avec `type: "summary"`.

### Injection

Au début de chaque mission, les 10 dernières mémoires de l'agent sont injectées
dans le system prompt sous une section `## Mémoire`.

### Expiration

Les mémoires `type: "fact"` peuvent avoir un `expiresAt` (ex: "solde au 26 mars" expire après 7 jours).
Les mémoires `type: "learning"` n'expirent pas.

---

## Déploiement

### Dev

```bash
# Terminal 1 : app Ops
pnpm dev:ops

# Terminal 2 : Convex
cd apps/ops && npx convex dev

# Terminal 3 : Worker
cd apps/ops && pnpm worker:dev   # nodemon worker/index.ts
```

### Prod

```bash
# Option 1 : PM2
pm2 start apps/ops/worker/index.ts --name ops-worker

# Option 2 : Docker sidecar
docker-compose up worker

# Option 3 : Future Tauri sidecar (src-tauri/ déjà prêt)
```

---

## V2 Roadmap (hors scope v1)

- **Soul éditable depuis l'UI** — éditeur Markdown in-app pour tweaker la personnalité
- **Dashboard agents** — page `/missions/agents` avec stats, budget graphique, historique
- **Structured output → charts** — le forecast de Marc alimente directement des Recharts
- **Agent marketplace** — templates d'agents partagés (ex: "Agent Comptable", "Agent DevOps")
- **Voice briefing** — résumé audio quotidien généré par les agents (TTS)
