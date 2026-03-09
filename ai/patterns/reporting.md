# Pattern : Reporting / Analytics

> Page de rapports avec graphiques multiples, métriques calculées, export.
> Exemples : reporting commercial, analytics RH, suivi d'activité.

## Structure

```
PageHeader                — titre + sélecteur de période + export
Tabs                      — onglets par thématique de rapport
  └─ Tab "Vue d'ensemble"
       StatsGrid          — KPIs de la période
       Grid 2 colonnes
         ChartCard         — graphique principal
         ChartCard         — graphique secondaire
       DataTable            — tableau de détail
  └─ Tab "Performance"
       DataTable            — classement / ranking
       ChartCard           — comparaison
  └─ Tab "Prévisions"
       ForecastChart       — projection pondérée
```

## Code complet

### Page (`app/(dashboard)/reports/page.tsx`)

```tsx
import { Suspense } from "react"
import { Download } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { Tabs } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { OverviewTab } from "./_components/overview-tab"
import { PerformanceTab } from "./_components/performance-tab"
import { ForecastTab } from "./_components/forecast-tab"

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const period = params.period ?? "current-quarter"

  return (
    <>
      <PageHeader
        title="Rapports"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Rapports" },
        ]}
        actions={[
          {
            type: "select",
            param: "period",
            value: period,
            options: [
              { value: "current-month", label: "Ce mois" },
              { value: "current-quarter", label: "Ce trimestre" },
              { value: "current-year", label: "Cette année" },
              { value: "last-year", label: "Année dernière" },
            ],
          },
          { label: "Exporter PDF", onClick: () => {}, icon: Download, variant: "outline" },
        ]}
      />

      <Tabs defaultValue={params.tab ?? "overview"}>
        <Tabs.List>
          <Tabs.Trigger value="overview">Vue d'ensemble</Tabs.Trigger>
          <Tabs.Trigger value="performance">Performance</Tabs.Trigger>
          <Tabs.Trigger value="forecast">Prévisions</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Suspense fallback={<ReportSkeleton />}>
            <OverviewTab period={period} />
          </Suspense>
        </Tabs.Content>

        <Tabs.Content value="performance">
          <Suspense fallback={<ReportSkeleton />}>
            <PerformanceTab period={period} />
          </Suspense>
        </Tabs.Content>

        <Tabs.Content value="forecast">
          <Suspense fallback={<ReportSkeleton />}>
            <ForecastTab period={period} />
          </Suspense>
        </Tabs.Content>
      </Tabs>
    </>
  )
}

function ReportSkeleton() {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-[350px] rounded-lg" />
        <Skeleton className="h-[350px] rounded-lg" />
      </div>
    </div>
  )
}
```

### Vue d'ensemble (`_components/overview-tab.tsx`)

```tsx
import { StatsGrid } from "@/components/blocks/stats-grid"
import { ChartCard } from "@/components/blocks/chart-card"
import { getReportOverview } from "@/lib/actions/reports"

export async function OverviewTab({ period }: { period: string }) {
  const data = await getReportOverview(period)

  return (
    <div className="mt-6 space-y-6">
      <StatsGrid
        stats={[
          { label: "CA réalisé", value: formatCurrency(data.revenue), trend: data.revenueTrend },
          { label: "Deals gagnés", value: data.dealsWon, trend: data.dealsWonTrend },
          { label: "Taux de conversion", value: `${data.conversionRate}%`, trend: data.conversionTrend },
          { label: "Panier moyen", value: formatCurrency(data.avgDealSize), trend: data.avgDealTrend },
        ]}
        columns={4}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Funnel de conversion */}
        <ChartCard
          title="Funnel de conversion"
          type="funnel"
          data={data.funnel}
          /* [
            { stage: "Qualification", count: 100, rate: "100%" },
            { stage: "Proposition", count: 65, rate: "65%" },
            { stage: "Négociation", count: 42, rate: "42%" },
            { stage: "Closing", count: 28, rate: "28%" },
            { stage: "Gagné", count: 18, rate: "18%" },
          ] */
        />

        {/* Évolution CA mensuel */}
        <ChartCard
          title="CA mensuel"
          type="line"
          data={data.monthlyRevenue}
          xKey="month"
          yKey="revenue"
          compareData={data.monthlyRevenuePrevious}
          compareLegend="Année précédente"
          height={300}
        />
      </div>

      {/* Répartition par source */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="CA par secteur"
          type="pie"
          data={data.revenueBySector}
          nameKey="sector"
          valueKey="revenue"
        />
        <ChartCard
          title="Deals par source"
          type="bar"
          data={data.dealsBySource}
          xKey="source"
          yKey="count"
        />
      </div>
    </div>
  )
}
```

### Performance (`_components/performance-tab.tsx`)

```tsx
import { DataTable } from "@/components/blocks/data-table"
import { ChartCard } from "@/components/blocks/chart-card"
import { Avatar } from "@/components/ui/avatar"
import { getPerformanceReport } from "@/lib/actions/reports"

export async function PerformanceTab({ period }: { period: string }) {
  const data = await getPerformanceReport(period)

  const columns = [
    {
      id: "user",
      header: "Commercial",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar size="sm" user={row.user} />
          <span className="font-medium">{row.user.firstName} {row.user.lastName}</span>
        </div>
      ),
    },
    { id: "dealsCreated", header: "Deals créés", cell: (row) => row.dealsCreated, sortable: true },
    { id: "dealsWon", header: "Deals gagnés", cell: (row) => row.dealsWon, sortable: true },
    {
      id: "revenue",
      header: "CA généré",
      cell: (row) => formatCurrency(row.revenue),
      sortable: true,
    },
    {
      id: "conversionRate",
      header: "Taux conv.",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.conversionRate}%</span>
          <div className="h-2 w-16 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${row.conversionRate}%` }}
            />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "avgDealSize",
      header: "Panier moyen",
      cell: (row) => formatCurrency(row.avgDealSize),
      sortable: true,
    },
    {
      id: "activitiesLogged",
      header: "Activités",
      cell: (row) => row.activitiesLogged,
      sortable: true,
    },
  ]

  return (
    <div className="mt-6 space-y-6">
      <DataTable
        columns={columns}
        data={data.rankings}
        totalCount={data.rankings.length}
        currentPage={1}
        pageSize={50}
        sortField="revenue"
        sortDirection="desc"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="CA par commercial"
          type="bar"
          data={data.rankings}
          xKey="user.firstName"
          yKey="revenue"
          horizontal
          height={300}
        />
        <ChartCard
          title="Activités par type"
          type="stacked-bar"
          data={data.activitiesByType}
          xKey="user"
          series={[
            { key: "calls", label: "Appels", color: "#6366f1" },
            { key: "emails", label: "Emails", color: "#22c55e" },
            { key: "meetings", label: "RDV", color: "#f59e0b" },
          ]}
          height={300}
        />
      </div>
    </div>
  )
}
```

## Checklist avant de livrer

- [ ] Sélecteur de période global ✓
- [ ] Période dans l'URL ✓
- [ ] Tabs pour organiser les vues ✓
- [ ] Suspense + skeleton par tab ✓
- [ ] StatsGrid avec trends ✓
- [ ] Funnel de conversion ✓
- [ ] Comparaison vs période précédente sur le line chart ✓
- [ ] DataTable triable pour les classements ✓
- [ ] Barres de progression inline dans les tableaux ✓
- [ ] Export PDF du rapport ✓
- [ ] Responsive : graphiques en 1 colonne sur mobile ✓
