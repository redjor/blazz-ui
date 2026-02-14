# Pattern : Dashboard Opérationnel

> Page d'accueil avec KPIs, graphiques, activité récente.
> C'est la première page que l'utilisateur voit après connexion.

## Structure

```
PageHeader                    — "Tableau de bord" + sélecteur de période
StatsGrid                     — 4 KPI cards (row)
Section "Graphiques"
  └─ Grid 2 colonnes
       ChartCard (évolution)  — Line chart principal
       ChartCard (répartition)— Bar ou Pie chart secondaire
Section "Activité"
  └─ Grid 2 colonnes
       DataGrid (mini)        — Derniers éléments ajoutés/modifiés
       ActivityTimeline       — Dernières actions
```

## Code complet

### Page (`app/(dashboard)/page.tsx`)

```tsx
import { Suspense } from "react"
import { PageHeader } from "@/components/blocks/page-header"
import { StatsGrid } from "@/components/blocks/stats-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { RecentActivity } from "./_components/recent-activity"
import { Charts } from "./_components/charts"
import { RecentItems } from "./_components/recent-items"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const period = params.period ?? "30d"
  const stats = await getDashboardStats(period)

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        actions={[
          {
            type: "select",
            value: period,
            param: "period",
            options: [
              { value: "7d", label: "7 derniers jours" },
              { value: "30d", label: "30 derniers jours" },
              { value: "90d", label: "3 derniers mois" },
              { value: "1y", label: "12 derniers mois" },
            ],
          },
        ]}
      />

      {/* KPIs — chargement immédiat car léger */}
      <StatsGrid
        stats={[
          {
            label: "Clients actifs",
            value: stats.activeClients,
            trend: stats.activeClientsTrend,
            icon: "Users",
          },
          {
            label: "Interventions ce mois",
            value: stats.monthlyInterventions,
            trend: stats.interventionsTrend,
            icon: "Wrench",
          },
          {
            label: "Taux de conformité",
            value: `${stats.complianceRate}%`,
            trend: stats.complianceTrend,
            icon: "ShieldCheck",
          },
          {
            label: "Temps moyen résolution",
            value: stats.avgResolutionTime,
            trend: stats.resolutionTrend,
            trendInverted: true, // pour ce KPI, baisser = mieux
            icon: "Clock",
          },
        ]}
        columns={4}
      />

      {/* Graphiques — Suspense car plus lent */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[350px] rounded-lg" />}>
          <Charts period={period} />
        </Suspense>
      </div>

      {/* Activité récente */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[400px] rounded-lg" />}>
          <RecentItems />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[400px] rounded-lg" />}>
          <RecentActivity />
        </Suspense>
      </div>
    </>
  )
}
```

### KPIs — points importants

```tsx
// Le StatsGrid gère automatiquement :
// - Flèche verte ▲ si trend positif, rouge ▼ si négatif
// - trendInverted: true → inverse la logique (baisser = vert)
// - Sparkline optionnelle si on passe sparkData: number[]
// - Loading state via prop loading (affiche 4 Skeletons)
```

### Graphiques (`_components/charts.tsx`)

```tsx
import { ChartCard } from "@/components/blocks/chart-card"
import { getChartData } from "@/lib/actions/dashboard"

export async function Charts({ period }: { period: string }) {
  const { evolution, distribution } = await getChartData(period)

  return (
    <>
      <ChartCard
        title="Évolution des interventions"
        type="line"
        data={evolution}
        xKey="date"
        yKey="count"
        height={300}
      />
      <ChartCard
        title="Répartition par statut"
        type="bar"
        data={distribution}
        xKey="status"
        yKey="count"
        colorKey="status"
        height={300}
      />
    </>
  )
}
```

### Derniers éléments (`_components/recent-items.tsx`)

```tsx
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecentClients } from "@/lib/actions/dashboard"

export async function RecentItems() {
  const clients = await getRecentClients(5)

  return (
    <Card>
      <Card.Header>
        <Card.Title>Derniers clients</Card.Title>
        <Link href="/clients" className="text-sm text-muted-foreground hover:underline">
          Voir tout →
        </Link>
      </Card.Header>
      <Card.Content>
        <div className="space-y-3">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
            >
              <div>
                <p className="font-medium">{client.lastName} {client.firstName}</p>
                <p className="text-sm text-muted-foreground">{client.company}</p>
              </div>
              <Badge>{client.status}</Badge>
            </Link>
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}
```

## Checklist avant de livrer

- [ ] Sélecteur de période dans le header ✓
- [ ] Période dans l'URL (searchParams) ✓
- [ ] StatsGrid avec trend + icônes ✓
- [ ] `trendInverted` pour les métriques où baisser = bien ✓
- [ ] Suspense sur les sections lentes ✓
- [ ] Skeleton qui matche la taille du contenu ✓
- [ ] Grid responsive (2 cols desktop → 1 col mobile) ✓
- [ ] Liens "Voir tout →" vers les pages de liste ✓
- [ ] Données fraîches (pas de cache agressif sur le dashboard) ✓
