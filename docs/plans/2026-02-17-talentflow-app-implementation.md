# TalentFlow App — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build TalentFlow, a 3-page ATS demo app (dashboard + candidates list + jobs list) using the Warm theme to showcase kit adaptability.

**Architecture:** Follows the exact same pattern as Forge CRM: route group under `(examples)`, dedicated layout with AppFrame + sidebar, DataTable presets for list pages, sample data file for mock data. Reuses all existing block components.

**Tech Stack:** Next.js 16, React 19, TypeScript, TanStack Table (via DataTable), Recharts (via ChartCard), Lucide icons.

---

### Task 1: Create TalentFlow sample data

**Files:**
- Create: `lib/sample-data/talentflow.ts`

**Step 1: Create the sample data file**

```tsx
/**
 * Sample data for TalentFlow ATS demo
 * Mock data for candidates, jobs, dashboard stats, and charts
 */

/* ─── Types ─── */

export type CandidateStage = "new" | "screening" | "interview" | "technical" | "offer" | "hired" | "rejected"

export interface Candidate {
	id: string
	firstName: string
	lastName: string
	email: string
	position: string
	stage: CandidateStage
	source: string
	score: number
	appliedAt: string
}

export type JobStatus = "open" | "closed" | "draft"

export interface Job {
	id: string
	title: string
	department: string
	location: string
	candidateCount: number
	status: JobStatus
	publishedAt: string
}

export interface TalentflowDashboardStats {
	openPositions: number
	openPositionsTrend: number
	applicationsThisMonth: number
	applicationsTrend: number
	interviewsThisWeek: number
	interviewsTrend: number
	hireRate: string
	hireRateTrend: number
}

/* ─── Dashboard Stats ─── */

export const talentflowDashboardStats: TalentflowDashboardStats = {
	openPositions: 12,
	openPositionsTrend: 20,
	applicationsThisMonth: 84,
	applicationsTrend: 15,
	interviewsThisWeek: 9,
	interviewsTrend: -10,
	hireRate: "24%",
	hireRateTrend: 5,
}

/* ─── Chart Data ─── */

export const applicationsChartData = [
	{ month: "Sep", applications: 42 },
	{ month: "Oct", applications: 56 },
	{ month: "Nov", applications: 38 },
	{ month: "Dec", applications: 29 },
	{ month: "Jan", applications: 67 },
	{ month: "Fév", applications: 84 },
]

export const pipelineChartData = [
	{ name: "Nouveau", count: 28 },
	{ name: "Screening", count: 18 },
	{ name: "Entretien", count: 12 },
	{ name: "Technique", count: 8 },
	{ name: "Offre", count: 5 },
	{ name: "Embauché", count: 3 },
]

/* ─── Jobs (8) ─── */

export const jobs: Job[] = [
	{ id: "j1", title: "Développeur Full-Stack Senior", department: "Engineering", location: "Paris", candidateCount: 18, status: "open", publishedAt: "2025-12-10" },
	{ id: "j2", title: "Product Designer", department: "Design", location: "Lyon", candidateCount: 12, status: "open", publishedAt: "2026-01-05" },
	{ id: "j3", title: "Data Analyst", department: "Data", location: "Paris", candidateCount: 9, status: "open", publishedAt: "2026-01-15" },
	{ id: "j4", title: "Responsable Marketing Digital", department: "Marketing", location: "Bordeaux", candidateCount: 7, status: "open", publishedAt: "2026-01-20" },
	{ id: "j5", title: "DevOps Engineer", department: "Engineering", location: "Remote", candidateCount: 14, status: "open", publishedAt: "2026-01-08" },
	{ id: "j6", title: "Customer Success Manager", department: "Support", location: "Paris", candidateCount: 6, status: "open", publishedAt: "2026-02-01" },
	{ id: "j7", title: "Comptable Senior", department: "Finance", location: "Paris", candidateCount: 4, status: "closed", publishedAt: "2025-10-15" },
	{ id: "j8", title: "Chef de Projet IT", department: "Engineering", location: "Nantes", candidateCount: 0, status: "draft", publishedAt: "2026-02-14" },
]

/* ─── Candidates (25) ─── */

const sources = ["LinkedIn", "Indeed", "Cooptation", "Site carrière", "Welcome to the Jungle"]

export const candidates: Candidate[] = [
	{ id: "ca1", firstName: "Lucas", lastName: "Moreau", email: "l.moreau@gmail.com", position: "Développeur Full-Stack Senior", stage: "technical", source: "LinkedIn", score: 88, appliedAt: "2026-01-12" },
	{ id: "ca2", firstName: "Emma", lastName: "Leroy", email: "emma.leroy@outlook.fr", position: "Product Designer", stage: "interview", source: "Welcome to the Jungle", score: 82, appliedAt: "2026-01-18" },
	{ id: "ca3", firstName: "Thomas", lastName: "Petit", email: "t.petit@yahoo.fr", position: "Développeur Full-Stack Senior", stage: "offer", source: "Cooptation", score: 92, appliedAt: "2025-12-20" },
	{ id: "ca4", firstName: "Léa", lastName: "Fontaine", email: "lea.fontaine@gmail.com", position: "Data Analyst", stage: "screening", source: "Indeed", score: 75, appliedAt: "2026-02-01" },
	{ id: "ca5", firstName: "Hugo", lastName: "Girard", email: "hugo.girard@proton.me", position: "DevOps Engineer", stage: "new", source: "LinkedIn", score: 70, appliedAt: "2026-02-10" },
	{ id: "ca6", firstName: "Camille", lastName: "Dupont", email: "c.dupont@gmail.com", position: "Responsable Marketing Digital", stage: "interview", source: "Site carrière", score: 85, appliedAt: "2026-01-25" },
	{ id: "ca7", firstName: "Nathan", lastName: "Bernard", email: "n.bernard@outlook.fr", position: "Développeur Full-Stack Senior", stage: "hired", source: "LinkedIn", score: 95, appliedAt: "2025-11-15" },
	{ id: "ca8", firstName: "Chloé", lastName: "Roux", email: "chloe.roux@gmail.com", position: "Product Designer", stage: "new", source: "Welcome to the Jungle", score: 68, appliedAt: "2026-02-12" },
	{ id: "ca9", firstName: "Maxime", lastName: "Lefebvre", email: "m.lefebvre@yahoo.fr", position: "Data Analyst", stage: "technical", source: "Cooptation", score: 80, appliedAt: "2026-01-10" },
	{ id: "ca10", firstName: "Inès", lastName: "Martinez", email: "ines.m@gmail.com", position: "Customer Success Manager", stage: "screening", source: "Indeed", score: 72, appliedAt: "2026-02-05" },
	{ id: "ca11", firstName: "Arthur", lastName: "Duval", email: "a.duval@proton.me", position: "DevOps Engineer", stage: "interview", source: "LinkedIn", score: 87, appliedAt: "2026-01-22" },
	{ id: "ca12", firstName: "Manon", lastName: "Simon", email: "manon.simon@gmail.com", position: "Développeur Full-Stack Senior", stage: "rejected", source: "Indeed", score: 45, appliedAt: "2026-01-05" },
	{ id: "ca13", firstName: "Raphaël", lastName: "Laurent", email: "r.laurent@outlook.fr", position: "Responsable Marketing Digital", stage: "new", source: "LinkedIn", score: 63, appliedAt: "2026-02-13" },
	{ id: "ca14", firstName: "Julie", lastName: "Morel", email: "j.morel@yahoo.fr", position: "Product Designer", stage: "technical", source: "Cooptation", score: 90, appliedAt: "2026-01-08" },
	{ id: "ca15", firstName: "Alexandre", lastName: "Thomas", email: "alex.thomas@gmail.com", position: "DevOps Engineer", stage: "offer", source: "Site carrière", score: 91, appliedAt: "2025-12-18" },
	{ id: "ca16", firstName: "Sarah", lastName: "Garcia", email: "s.garcia@proton.me", position: "Data Analyst", stage: "new", source: "Welcome to the Jungle", score: 66, appliedAt: "2026-02-14" },
	{ id: "ca17", firstName: "Paul", lastName: "Robert", email: "paul.r@gmail.com", position: "Développeur Full-Stack Senior", stage: "screening", source: "LinkedIn", score: 78, appliedAt: "2026-02-03" },
	{ id: "ca18", firstName: "Zoé", lastName: "Richard", email: "zoe.richard@outlook.fr", position: "Customer Success Manager", stage: "new", source: "Indeed", score: 71, appliedAt: "2026-02-11" },
	{ id: "ca19", firstName: "Louis", lastName: "Dumont", email: "l.dumont@yahoo.fr", position: "Développeur Full-Stack Senior", stage: "interview", source: "Cooptation", score: 83, appliedAt: "2026-01-28" },
	{ id: "ca20", firstName: "Clara", lastName: "Fournier", email: "clara.f@gmail.com", position: "Responsable Marketing Digital", stage: "rejected", source: "Site carrière", score: 40, appliedAt: "2026-01-15" },
	{ id: "ca21", firstName: "Gabriel", lastName: "Chevalier", email: "g.chevalier@proton.me", position: "DevOps Engineer", stage: "screening", source: "LinkedIn", score: 76, appliedAt: "2026-02-07" },
	{ id: "ca22", firstName: "Ambre", lastName: "Bonnet", email: "ambre.b@outlook.fr", position: "Product Designer", stage: "hired", source: "Welcome to the Jungle", score: 93, appliedAt: "2025-11-20" },
	{ id: "ca23", firstName: "Théo", lastName: "Lemaire", email: "theo.l@gmail.com", position: "Data Analyst", stage: "interview", source: "LinkedIn", score: 84, appliedAt: "2026-01-30" },
	{ id: "ca24", firstName: "Jade", lastName: "Michel", email: "jade.m@yahoo.fr", position: "Développeur Full-Stack Senior", stage: "new", source: "Indeed", score: 69, appliedAt: "2026-02-15" },
	{ id: "ca25", firstName: "Enzo", lastName: "Blanc", email: "enzo.blanc@gmail.com", position: "Customer Success Manager", stage: "technical", source: "Cooptation", score: 81, appliedAt: "2026-01-20" },
]
```

**Step 2: Commit**

```bash
git add lib/sample-data/talentflow.ts
git commit -m "feat(talentflow): add sample data for ATS demo"
```

---

### Task 2: Create TalentFlow navigation config

**Files:**
- Create: `config/talentflow-navigation.ts`

**Context:** Follow the exact same pattern as `config/crm-navigation.ts`. Uses `SidebarConfig` type from `types/navigation.ts`.

**Step 1: Create the navigation config**

```tsx
"use client"

import { Briefcase, LayoutDashboard, Users } from "lucide-react"
import type { SidebarConfig } from "@/types/navigation"

export const talentflowSidebarConfig: SidebarConfig = {
	user: {
		name: "Marie Dubois",
		email: "marie.dubois@talentflow.io",
		role: "Responsable RH",
	},
	searchEnabled: true,
	searchPlaceholder: "Rechercher...",
	navigation: [
		{
			id: "recrutement",
			title: "Recrutement",
			items: [
				{
					id: "dashboard",
					title: "Tableau de bord",
					url: "/examples/talentflow/dashboard",
					icon: LayoutDashboard,
				},
				{
					id: "candidates",
					title: "Candidats",
					url: "/examples/talentflow/candidates",
					icon: Users,
				},
				{
					id: "jobs",
					title: "Offres d'emploi",
					url: "/examples/talentflow/jobs",
					icon: Briefcase,
				},
			],
		},
	],
}

export const talentflowNavigationConfig = talentflowSidebarConfig.navigation
```

**Step 2: Commit**

```bash
git add config/talentflow-navigation.ts
git commit -m "feat(talentflow): add sidebar navigation config"
```

---

### Task 3: Create DataTable presets for candidates and jobs

**Files:**
- Create: `components/features/data-table/presets/talentflow-candidates.tsx`
- Create: `components/features/data-table/presets/talentflow-jobs.tsx`
- Modify: `components/features/data-table/presets/index.ts`

**Context:** Follow the pattern of `crm-contacts.tsx`. Use column factory helpers (`createTextColumn`, `createStatusColumn`), view builders (`createStatusViews`), and action builders (`createCRUDActions`, `createBulkActions`).

**Step 1: Create candidates preset**

```tsx
'use client';

import { Badge } from '@/components/ui/badge';
import type { Candidate } from '@/lib/sample-data/talentflow';
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';
import {
  createTextColumn,
  createStatusColumn,
} from '../factories/column-builders';
import { createStatusViews } from '../factories/view-builders';
import { createCRUDActions, createBulkActions } from '../factories/action-builders';

export interface CandidatesPresetConfig {
  onView?: (candidate: Candidate) => void | Promise<void>;
  onBulkArchive?: (candidates: Candidate[]) => void | Promise<void>;
  onBulkDelete?: (candidates: Candidate[]) => void | Promise<void>;
}

export interface CandidatesPreset {
  columns: DataTableColumnDef<Candidate>[];
  views: DataTableView[];
  rowActions: RowAction<Candidate>[];
  bulkActions: BulkAction<Candidate>[];
}

export function createCandidatesPreset(config: CandidatesPresetConfig = {}): CandidatesPreset {
  const { onView, onBulkArchive, onBulkDelete } = config;

  const columns: DataTableColumnDef<Candidate>[] = [
    {
      accessorKey: 'lastName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
      cell: ({ row }) => (
        <span className="font-medium text-fg">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
      enableSorting: true,
      filterConfig: {
        type: 'text',
        placeholder: 'Rechercher par nom...',
        showInlineFilter: true,
        defaultInlineFilter: false,
        filterLabel: 'Nom',
      },
    } as DataTableColumnDef<Candidate>,
    createTextColumn<Candidate>({
      accessorKey: 'position',
      title: 'Poste visé',
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    createStatusColumn<Candidate>({
      accessorKey: 'stage',
      title: 'Étape',
      statusMap: {
        new: { variant: 'secondary', label: 'Nouveau' },
        screening: { variant: 'info', label: 'Screening' },
        interview: { variant: 'info', label: 'Entretien' },
        technical: { variant: 'warning', label: 'Technique' },
        offer: { variant: 'success', label: 'Offre' },
        hired: { variant: 'success', label: 'Embauché' },
        rejected: { variant: 'destructive', label: 'Refusé' },
      },
      filterOptions: [
        { label: 'Nouveau', value: 'new' },
        { label: 'Screening', value: 'screening' },
        { label: 'Entretien', value: 'interview' },
        { label: 'Technique', value: 'technical' },
        { label: 'Offre', value: 'offer' },
        { label: 'Embauché', value: 'hired' },
        { label: 'Refusé', value: 'rejected' },
      ],
      showInlineFilter: true,
      defaultInlineFilter: true,
    }),
    createTextColumn<Candidate>({
      accessorKey: 'source',
      title: 'Source',
      showInlineFilter: false,
    }),
    {
      accessorKey: 'score',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />,
      cell: ({ row }) => {
        const score = row.getValue('score') as number;
        const color = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'destructive';
        return <Badge variant={color}>{score}%</Badge>;
      },
      enableSorting: true,
    } as DataTableColumnDef<Candidate>,
    createTextColumn<Candidate>({
      accessorKey: 'appliedAt',
      title: 'Date',
      showInlineFilter: false,
    }),
  ];

  const views = createStatusViews({
    column: 'stage',
    statuses: [
      { id: 'new', name: 'Nouveaux', value: 'new' },
      { id: 'interview', name: 'En entretien', value: 'interview' },
      { id: 'offer', name: 'Offre envoyée', value: 'offer' },
      { id: 'hired', name: 'Embauchés', value: 'hired' },
    ],
    allViewName: 'Tous',
  });

  const rowActions = createCRUDActions<Candidate>({
    onView,
    labels: { view: 'Voir le profil' },
  });

  const bulkActions = createBulkActions<Candidate>({
    onArchive: onBulkArchive,
    onDelete: onBulkDelete,
    archiveConfirmation: (count) => `Archiver ${count} candidat(s) ?`,
    deleteConfirmation: (count) => `Supprimer ${count} candidat(s) ?`,
    labels: {
      archive: 'Archiver la sélection',
      delete: 'Supprimer la sélection',
    },
  });

  return { columns, views, rowActions, bulkActions };
}
```

**Step 2: Create jobs preset**

```tsx
'use client';

import { Badge } from '@/components/ui/badge';
import type { Job } from '@/lib/sample-data/talentflow';
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';
import {
  createTextColumn,
  createStatusColumn,
} from '../factories/column-builders';
import { createStatusViews } from '../factories/view-builders';
import { createCRUDActions, createBulkActions } from '../factories/action-builders';

export interface JobsPresetConfig {
  onView?: (job: Job) => void | Promise<void>;
  onEdit?: (job: Job) => void | Promise<void>;
  onBulkArchive?: (jobs: Job[]) => void | Promise<void>;
  onBulkDelete?: (jobs: Job[]) => void | Promise<void>;
}

export interface JobsPreset {
  columns: DataTableColumnDef<Job>[];
  views: DataTableView[];
  rowActions: RowAction<Job>[];
  bulkActions: BulkAction<Job>[];
}

export function createJobsPreset(config: JobsPresetConfig = {}): JobsPreset {
  const { onView, onEdit, onBulkArchive, onBulkDelete } = config;

  const columns: DataTableColumnDef<Job>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Poste" />,
      cell: ({ row }) => (
        <span className="font-medium text-fg">{row.getValue('title')}</span>
      ),
      enableSorting: true,
      filterConfig: {
        type: 'text',
        placeholder: 'Rechercher un poste...',
        showInlineFilter: true,
        defaultInlineFilter: false,
        filterLabel: 'Poste',
      },
    } as DataTableColumnDef<Job>,
    createTextColumn<Job>({
      accessorKey: 'department',
      title: 'Département',
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    createTextColumn<Job>({
      accessorKey: 'location',
      title: 'Lieu',
      showInlineFilter: false,
    }),
    {
      accessorKey: 'candidateCount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Candidats" />,
      cell: ({ row }) => {
        const count = row.getValue('candidateCount') as number;
        return <span className="tabular-nums">{count}</span>;
      },
      enableSorting: true,
    } as DataTableColumnDef<Job>,
    createStatusColumn<Job>({
      accessorKey: 'status',
      title: 'Statut',
      statusMap: {
        open: { variant: 'success', label: 'Ouvert' },
        closed: { variant: 'secondary', label: 'Fermé' },
        draft: { variant: 'outline', label: 'Brouillon' },
      },
      filterOptions: [
        { label: 'Ouvert', value: 'open' },
        { label: 'Fermé', value: 'closed' },
        { label: 'Brouillon', value: 'draft' },
      ],
      showInlineFilter: true,
      defaultInlineFilter: true,
    }),
    createTextColumn<Job>({
      accessorKey: 'publishedAt',
      title: 'Publié le',
      showInlineFilter: false,
    }),
  ];

  const views = createStatusViews({
    column: 'status',
    statuses: [
      { id: 'open', name: 'Ouvertes', value: 'open' },
      { id: 'closed', name: 'Fermées', value: 'closed' },
      { id: 'draft', name: 'Brouillons', value: 'draft' },
    ],
    allViewName: 'Toutes',
  });

  const rowActions = createCRUDActions<Job>({
    onView,
    onEdit,
    labels: { view: 'Voir', edit: 'Modifier' },
  });

  const bulkActions = createBulkActions<Job>({
    onArchive: onBulkArchive,
    onDelete: onBulkDelete,
    archiveConfirmation: (count) => `Archiver ${count} offre(s) ?`,
    deleteConfirmation: (count) => `Supprimer ${count} offre(s) ?`,
    labels: {
      archive: 'Archiver la sélection',
      delete: 'Supprimer la sélection',
    },
  });

  return { columns, views, rowActions, bulkActions };
}
```

**Step 3: Add exports to presets index**

In `components/features/data-table/presets/index.ts`, append:

```ts
// TalentFlow ATS presets
export * from './talentflow-candidates';
export * from './talentflow-jobs';
```

**Step 4: Commit**

```bash
git add components/features/data-table/presets/talentflow-candidates.tsx components/features/data-table/presets/talentflow-jobs.tsx components/features/data-table/presets/index.ts
git commit -m "feat(talentflow): add candidates and jobs DataTable presets"
```

---

### Task 4: Create TalentFlow layout

**Files:**
- Create: `app/(examples)/examples/talentflow/layout.tsx`

**Context:** Copy the exact pattern from `app/(examples)/layout.tsx` (the CRM layout), replacing `crmNavigationConfig` with `talentflowNavigationConfig` and `activeSection="crm"` with `activeSection="talentflow"`.

**Step 1: Create the layout**

```tsx
"use client"

import type * as React from "react"
import { Toaster } from "sonner"
import { CommandPalette } from "@/components/features/command-palette/command-palette"
import {
	NavigationTabsProvider,
	NavigationTabsInterceptor,
	useNavigationTabs,
	useNavigationTabUrlSync,
} from "@/components/features/navigation-tabs"
import { AppFrame } from "@/components/layout/app-frame"
import { FrameProvider, useFrame } from "@/components/layout/frame-context"
import { TabBar } from "@/components/layout/tab-bar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { talentflowNavigationConfig } from "@/config/talentflow-navigation"
import { titleFromPathname } from "@/lib/tab-utils"
import { useFrameLayout } from "@/lib/use-frame-layout"

function TalentFlowLayoutInner({ children }: { children: React.ReactNode }) {
	const { setCommandPaletteOpen } = useFrame()
	const { showTabBar } = useNavigationTabs()
	useFrameLayout()
	useNavigationTabUrlSync(titleFromPathname)

	return (
		<SidebarProvider>
			<AppFrame
				navigation={talentflowNavigationConfig}
				tabBar={showTabBar ? <TabBar /> : undefined}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				activeSection="talentflow"
			>
				{children}
			</AppFrame>
			<NavigationTabsInterceptor
				excludePaths={["/docs"]}
				titleResolver={titleFromPathname}
			/>
			<CommandPalette navigation={talentflowNavigationConfig} />
			<Toaster />
		</SidebarProvider>
	)
}

export default function TalentFlowLayout({ children }: { children: React.ReactNode }) {
	return (
		<FrameProvider>
			<NavigationTabsProvider storageKey="blazz-talentflow-tabs">
				<TalentFlowLayoutInner>{children}</TalentFlowLayoutInner>
			</NavigationTabsProvider>
		</FrameProvider>
	)
}
```

**Step 2: Update top bar `activeSection` type and sections array**

In `components/layout/app-top-bar.tsx`:

1. Change `activeSection` type from `"docs" | "crm"` to `"docs" | "crm" | "talentflow"`
2. Add TalentFlow to the `sections` array:

```tsx
const sections = [
	{ id: "docs" as const, label: "Docs", href: "/docs/components" },
	{ id: "crm" as const, label: "CRM", href: "/examples/crm/dashboard" },
	{ id: "talentflow" as const, label: "TalentFlow", href: "/examples/talentflow/dashboard" },
]
```

**Step 3: Commit**

```bash
git add app/(examples)/examples/talentflow/layout.tsx components/layout/app-top-bar.tsx
git commit -m "feat(talentflow): add layout and top bar section"
```

---

### Task 5: Create TalentFlow dashboard page

**Files:**
- Create: `app/(examples)/examples/talentflow/dashboard/page.tsx`

**Context:** Follow the exact pattern of `app/(examples)/examples/crm/dashboard/page.tsx`. Uses `PageHeader`, `StatsGrid`, `ChartCard` blocks.

**Step 1: Create the dashboard page**

```tsx
"use client"

import { Briefcase, Calendar, TrendingUp, Users } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { StatsGrid } from "@/components/blocks/stats-grid"
import { ChartCard } from "@/components/blocks/chart-card"
import {
	talentflowDashboardStats,
	applicationsChartData,
	pipelineChartData,
} from "@/lib/sample-data/talentflow"

export default function TalentFlowDashboardPage() {
	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title="Tableau de bord"
				description="Vue d'ensemble du recrutement"
			/>

			<StatsGrid
				stats={[
					{
						label: "Postes ouverts",
						value: talentflowDashboardStats.openPositions,
						trend: talentflowDashboardStats.openPositionsTrend,
						icon: Briefcase,
					},
					{
						label: "Candidatures ce mois",
						value: talentflowDashboardStats.applicationsThisMonth,
						trend: talentflowDashboardStats.applicationsTrend,
						icon: Users,
					},
					{
						label: "Entretiens cette semaine",
						value: talentflowDashboardStats.interviewsThisWeek,
						trend: talentflowDashboardStats.interviewsTrend,
						icon: Calendar,
					},
					{
						label: "Taux d'embauche",
						value: talentflowDashboardStats.hireRate,
						trend: talentflowDashboardStats.hireRateTrend,
						icon: TrendingUp,
					},
				]}
				columns={4}
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<ChartCard
					title="Candidatures reçues"
					type="line"
					data={applicationsChartData}
					xKey="month"
					yKey="applications"
					height={300}
				/>
				<ChartCard
					title="Pipeline recrutement"
					type="bar"
					data={pipelineChartData}
					xKey="name"
					yKey="count"
					height={300}
				/>
			</div>
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add app/(examples)/examples/talentflow/dashboard/page.tsx
git commit -m "feat(talentflow): add dashboard page"
```

---

### Task 6: Create candidates list page

**Files:**
- Create: `app/(examples)/examples/talentflow/candidates/page.tsx`

**Context:** Follow the exact pattern of `app/(examples)/examples/crm/contacts/page.tsx`.

**Step 1: Create the candidates page**

```tsx
"use client"

import { useMemo } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/blocks/page-header"
import { DataTable, createCandidatesPreset } from "@/components/features/data-table"
import { Box } from "@/components/ui/box"
import { candidates } from "@/lib/sample-data/talentflow"

export default function CandidatesPage() {
	const { columns, views, rowActions, bulkActions } = useMemo(
		() =>
			createCandidatesPreset({
				onView: (candidate) => toast.info(`Profil de ${candidate.firstName} ${candidate.lastName}`),
				onBulkArchive: (items) => toast.success(`${items.length} candidat(s) archivé(s)`),
				onBulkDelete: (items) => toast.success(`${items.length} candidat(s) supprimé(s)`),
			}),
		[],
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Candidats"
				description="Suivez vos candidatures en cours"
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/talentflow/dashboard" },
					{ label: "Candidats" },
				]}
			/>

			<Box background="white" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={candidates}
					columns={columns}
					views={views}
					rowActions={rowActions}
					bulkActions={bulkActions}
					getRowId={(row) => row.id}
					enableSorting
					enablePagination
					enableRowSelection
					enableGlobalSearch
					enableAdvancedFilters
					enableCustomViews
					combineSearchAndFilters
					searchPlaceholder="Rechercher par nom, poste, source..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50] }}
				/>
			</Box>
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add app/(examples)/examples/talentflow/candidates/page.tsx
git commit -m "feat(talentflow): add candidates list page"
```

---

### Task 7: Create jobs list page

**Files:**
- Create: `app/(examples)/examples/talentflow/jobs/page.tsx`

**Step 1: Create the jobs page**

```tsx
"use client"

import { useMemo } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/blocks/page-header"
import { DataTable, createJobsPreset } from "@/components/features/data-table"
import { Box } from "@/components/ui/box"
import { jobs } from "@/lib/sample-data/talentflow"

export default function JobsPage() {
	const { columns, views, rowActions, bulkActions } = useMemo(
		() =>
			createJobsPreset({
				onView: (job) => toast.info(`Offre : ${job.title}`),
				onEdit: (job) => toast.info(`Modifier : ${job.title}`),
				onBulkArchive: (items) => toast.success(`${items.length} offre(s) archivée(s)`),
				onBulkDelete: (items) => toast.success(`${items.length} offre(s) supprimée(s)`),
			}),
		[],
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Offres d'emploi"
				description="Gérez vos offres de recrutement"
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/talentflow/dashboard" },
					{ label: "Offres d'emploi" },
				]}
			/>

			<Box background="white" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={jobs}
					columns={columns}
					views={views}
					rowActions={rowActions}
					bulkActions={bulkActions}
					getRowId={(row) => row.id}
					enableSorting
					enablePagination
					enableRowSelection
					enableGlobalSearch
					enableAdvancedFilters
					enableCustomViews
					combineSearchAndFilters
					searchPlaceholder="Rechercher par poste, département..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 10, pageSizeOptions: [10, 25, 50] }}
				/>
			</Box>
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add app/(examples)/examples/talentflow/jobs/page.tsx
git commit -m "feat(talentflow): add jobs list page"
```

---

### Task 8: Build verify and push

**Step 1: Run build**

```bash
npx next build
```

Expected: Build passes with no errors. New routes visible:
- `/examples/talentflow/dashboard`
- `/examples/talentflow/candidates`
- `/examples/talentflow/jobs`

**Step 2: Push all commits**

```bash
git push
```
