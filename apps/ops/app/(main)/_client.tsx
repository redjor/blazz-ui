"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Grid } from "@blazz/ui/components/ui/grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Progress, ProgressTrack, ProgressIndicator } from "@blazz/ui/components/ui/progress"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { useQuery } from "convex/react"
import {
	endOfMonth,
	format,
	startOfMonth,
	subMonths,
} from "date-fns"
import { fr } from "date-fns/locale"
import {
	Clock,
	Banknote,
	FolderOpen,
	CheckSquare,
	FileText,
	Send,
	CreditCard,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { formatCurrency, formatMinutes } from "@/lib/format"

// ─── Helpers ──────────────────────────────────────────────────

function trendPercent(current: number, previous: number) {
	if (previous === 0) return current > 0 ? 100 : 0
	return Math.round(((current - previous) / previous) * 100)
}

// ─── Pipeline Segment ─────────────────────────────────────────

function PipelineSegment({
	label,
	amount,
	icon: Icon,
	accentClass,
}: {
	label: string
	amount: number
	icon: LucideIcon
	accentClass: string
}) {
	return (
		<div className="flex-1 min-w-0">
			<div className="flex items-start justify-between gap-2">
				<BlockStack gap="100">
					<span className="text-xs font-medium text-fg-muted">{label}</span>
					<span className="text-xl font-semibold tabular-nums tracking-tight">
						{formatCurrency(amount / 100)}
					</span>
				</BlockStack>
				<div className={`rounded-md p-1.5 shrink-0 ${accentClass}`}>
					<Icon className="size-3.5" />
				</div>
			</div>
		</div>
	)
}

function PipelineSkeleton() {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex gap-6">
					{[1, 2, 3].map((i) => (
						<BlockStack key={i} gap="200" className="flex-1">
							<InlineStack gap="200" blockAlign="center" wrap={false}>
								<Skeleton className="size-6 rounded-md" />
								<Skeleton className="h-3 w-20" />
							</InlineStack>
							<Skeleton className="h-7 w-20" />
							<Skeleton className="h-3 w-14" />
						</BlockStack>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

// ─── Project Budget Card ──────────────────────────────────────

function ProjectBudgetCard({
	name,
	budgetPercent,
	daysConsumed,
	billableRevenue,
	budgetAmount,
}: {
	name: string
	budgetPercent: number | null
	daysConsumed: number
	billableRevenue: number
	budgetAmount: number | null | undefined
}) {
	const hasBudget = budgetAmount != null && budgetAmount > 0
	const percent = budgetPercent ?? 0
	const clamped = Math.min(percent, 100)
	const isWarning = percent > 75 && percent <= 90
	const isDanger = percent > 90

	const barColor = isDanger
		? "bg-negative"
		: isWarning
			? "bg-caution"
			: "bg-brand"

	return (
		<Card>
			<CardContent className="p-4">
				<BlockStack gap="300">
					<span className="text-sm font-medium truncate">{name}</span>

					<div className="flex items-baseline justify-between gap-2">
						<span className="text-lg font-semibold tabular-nums tracking-tight">
							{formatCurrency(billableRevenue)}
						</span>
						<span className="text-xs text-fg-muted tabular-nums">
							{daysConsumed}j
						</span>
					</div>

					{hasBudget ? (
						<BlockStack gap="100">
							<Progress value={clamped}>
								<ProgressTrack className="h-1 rounded-full">
									<ProgressIndicator className={`rounded-full transition-all duration-300 ${barColor}`} />
								</ProgressTrack>
							</Progress>
							<div className="flex items-center justify-between">
								<span className="text-2xs text-fg-muted tabular-nums">
									budget {formatCurrency(budgetAmount)}
								</span>
								<span className={`text-2xs font-medium tabular-nums ${isDanger ? "text-negative" : isWarning ? "text-caution" : "text-fg-muted"}`}>
									{Math.round(percent)}%
								</span>
							</div>
						</BlockStack>
					) : (
						<div className="h-1 rounded-full bg-surface-3" />
					)}
				</BlockStack>
			</CardContent>
		</Card>
	)
}

function ProjectBudgetCardSkeleton() {
	return (
		<Card>
			<CardContent className="p-4">
				<BlockStack gap="300">
					<div className="flex items-center justify-between">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-3 w-12" />
					</div>
					<div className="flex items-baseline justify-between">
						<Skeleton className="h-6 w-20" />
						<Skeleton className="h-3 w-8" />
					</div>
					<Skeleton className="h-1 w-full rounded-full" />
				</BlockStack>
			</CardContent>
		</Card>
	)
}


// ─── Main Dashboard ───────────────────────────────────────────

export default function DashboardPageClient() {
	const now = new Date()
	const from = format(startOfMonth(now), "yyyy-MM-dd")
	const to = format(endOfMonth(now), "yyyy-MM-dd")

	const prevMonth = subMonths(now, 1)
	const prevStart = format(startOfMonth(prevMonth), "yyyy-MM-dd")
	const prevEnd = format(endOfMonth(prevMonth), "yyyy-MM-dd")

	const monthEntries = useQuery(api.timeEntries.list, { from, to })
	const prevMonthEntries = useQuery(api.timeEntries.list, { from: prevStart, to: prevEnd })
	const projectsWithBudget = useQuery(api.projects.listAllWithBudget)
	const forecast = useQuery(api.finances.forecast)
	const todos = useQuery(api.todos.list, {})

	const isLoading =
		monthEntries === undefined ||
		prevMonthEntries === undefined ||
		projectsWithBudget === undefined

	// Current month
	const billable = monthEntries?.filter((e) => e.billable) ?? []
	const totalMinutes = billable.reduce((s, e) => s + e.minutes, 0)
	const totalAmount = billable.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)

	// Previous month (trends)
	const prevBillable = prevMonthEntries?.filter((e) => e.billable) ?? []
	const prevMinutes = prevBillable.reduce((s, e) => s + e.minutes, 0)
	const prevAmount = prevBillable.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)

	const hoursTrend = trendPercent(totalMinutes, prevMinutes)
	const revenueTrend = trendPercent(totalAmount, prevAmount)

	const activeProjects = projectsWithBudget?.filter((p) => p.status === "active") ?? []
	const openTodos = todos?.filter((t) => t.status !== "done")?.length ?? 0

	const monthTitle = format(now, "MMMM yyyy", { locale: fr }).replace(/^\w/, (c) =>
		c.toUpperCase()
	)

	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader title={monthTitle} description="Vue d'ensemble" />

			{/* ─── KPIs (StatsGrid) ──────────────────────── */}
			<StatsGrid
				columns={4}
				loading={isLoading}
				stats={[
					{
						label: "Heures",
						value: formatMinutes(totalMinutes),
						icon: Clock,
						trend: hoursTrend,
					},
					{
						label: "Revenu",
						value: formatCurrency(totalAmount),
						icon: Banknote,
						trend: revenueTrend,
					},
					{
						label: "Projets actifs",
						value: activeProjects.length,
						icon: FolderOpen,
					},
					{
						label: "Tâches ouvertes",
						value: openTodos,
						icon: CheckSquare,
					},
				]}
			/>

			{/* ─── Financial Pipeline (single card) ──────── */}
			<BlockStack gap="200">
				<span className="text-xs font-medium text-fg-muted uppercase tracking-wider">
					Pipeline financier
				</span>
				{forecast === undefined ? (
					<PipelineSkeleton />
				) : (
					<Card>
						<CardContent className="p-4">
							<div className="flex divide-x divide-edge">
								<div className="flex-1 pr-4">
									<PipelineSegment
										label="Brouillons"
										amount={forecast.draftCents}
										icon={FileText}
										accentClass="bg-surface-3 text-fg-muted"
									/>
								</div>
								<div className="flex-1 px-4">
									<PipelineSegment
										label="À facturer"
										amount={forecast.readyToInvoiceCents}
										icon={Send}
										accentClass="bg-inform/10 text-inform"
									/>
								</div>
								<div className="flex-1 pl-4">
									<PipelineSegment
										label="En attente"
										amount={forecast.unpaidCents}
										icon={CreditCard}
										accentClass="bg-caution/10 text-caution"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</BlockStack>

			{/* ─── Active Project Budgets ─────────────────── */}
			{activeProjects.length > 0 && (
				<BlockStack gap="200">
					<div className="flex items-center justify-between">
						<span className="text-xs font-medium text-fg-muted uppercase tracking-wider">
							Projets actifs
						</span>
						<span className="text-xs text-fg-muted tabular-nums">
							{activeProjects.length} projets
						</span>
					</div>
					<Grid>
						{activeProjects.map((project) => (
							<Grid.Cell key={project._id} columnSpan={{ xs: 12, sm: 6, md: 4 }}>
								<ProjectBudgetCard
									name={project.name}
									budgetPercent={project.budgetPercent}
									daysConsumed={project.daysConsumed}
									billableRevenue={project.billableRevenue}
									budgetAmount={project.budgetAmount}
								/>
							</Grid.Cell>
						))}
					</Grid>
				</BlockStack>
			)}

			{isLoading && (
				<BlockStack gap="200">
					<Skeleton className="h-3 w-24" />
					<Grid>
						{[1, 2, 3].map((i) => (
							<Grid.Cell key={i} columnSpan={{ xs: 12, sm: 6, md: 4 }}>
								<ProjectBudgetCardSkeleton />
							</Grid.Cell>
						))}
					</Grid>
				</BlockStack>
			)}

			{!isLoading && monthEntries?.length === 0 && activeProjects.length === 0 && (
				<Box padding="8" className="text-center">
					<span className="text-fg-muted text-sm">
						Pas encore de données. Créez un client et des projets pour commencer.
					</span>
				</Box>
			)}
		</BlockStack>
	)
}
