# Client Stats Strip Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Afficher un bloc `StatsStrip` sur la page client qui agrège le pipeline de facturation (à facturer / facturé non payé / payé / CA total) de tous les projets du client.

**Architecture:** Nouveau query Convex `clients.getStats` qui charge tous les projets du client puis toutes leurs `timeEntries` billable et calcule 4 agrégats. La page client consomme ce query et passe les stats au composant `StatsStrip` existant.

**Tech Stack:** Convex (query), React/Next.js (useQuery), `StatsStrip` de `@blazz/ui/components/blocks/stats-strip`

---

### Task 1: Ajouter le query Convex `clients.getStats`

**Files:**
- Modify: `apps/ops/convex/clients.ts`

**Step 1: Ouvrir le fichier et repérer la fin**

Lire `apps/ops/convex/clients.ts` pour voir les imports existants et la fin du fichier.

**Step 2: Ajouter le query à la fin du fichier**

```ts
export const getStats = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .collect()

    const allEntries = (
      await Promise.all(
        projects.map((p) =>
          ctx.db
            .query("timeEntries")
            .withIndex("by_project", (q) => q.eq("projectId", p._id))
            .collect()
        )
      )
    )
      .flat()
      .filter((e) => e.billable)

    const calc = (filter: (e: (typeof allEntries)[number]) => boolean) =>
      Math.round(
        allEntries.filter(filter).reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
      )

    return {
      toInvoice: calc((e) => e.status === "ready_to_invoice"),
      invoiced: calc((e) => e.status === "invoiced"),
      paid: calc((e) => e.status === "paid"),
      total: calc(() => true),
    }
  },
})
```

Note : `v` et `query` sont déjà importés en haut du fichier.

**Step 3: Commit**

```bash
git add apps/ops/convex/clients.ts
git commit -m "feat(ops): add getStats query aggregating billing pipeline per client"
```

---

### Task 2: Intégrer le StatsStrip dans la page client

**Files:**
- Modify: `apps/ops/app/clients/[id]/page.tsx`

**Step 1: Ajouter l'import `StatsStrip`**

En haut du fichier, après les imports existants de `@blazz/ui` :

```ts
import { StatsStrip } from "@blazz/ui/components/blocks/stats-strip"
```

**Step 2: Ajouter le `useQuery` pour les stats**

Dans le composant, après la ligne :
```ts
const projects = useQuery(api.projects.listByClient, { clientId: id as Id<"clients"> })
```

Ajouter :
```ts
const clientStats = useQuery(api.clients.getStats, { clientId: id as Id<"clients"> })
```

**Step 3: Ajouter le helper de formatage**

Juste avant le `return`, ajouter :
```ts
const fmt = (n: number) => `${n.toLocaleString("fr-FR")} €`
```

**Step 4: Insérer le StatsStrip dans le JSX**

Dans le `return`, entre la fermeture du bloc `{/* Avatar + coordonnées */}` (après `</div>`) et le début de `{/* Projets */}` :

```tsx
{/* Stats pipeline */}
<StatsStrip
  loading={clientStats === undefined}
  stats={
    clientStats
      ? [
          { label: "À facturer", value: fmt(clientStats.toInvoice) },
          { label: "Facturé (non payé)", value: fmt(clientStats.invoiced) },
          { label: "Payé", value: fmt(clientStats.paid) },
          { label: "CA total", value: fmt(clientStats.total) },
        ]
      : []
  }
/>
```

**Step 5: Vérifier visuellement**

- `pnpm dev:ops` → ouvrir http://localhost:3120
- Aller sur un client qui a des projets avec des time entries
- Vérifier que le strip s'affiche correctement avec les 4 stats
- Vérifier l'état loading (skeleton) en rechargant la page

**Step 6: Commit**

```bash
git add apps/ops/app/clients/[id]/page.tsx
git commit -m "feat(ops): add billing pipeline stats strip to client detail page"
```
