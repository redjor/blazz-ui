"use client"

import { BudgetCard } from "@blazz/pro/components/blocks/budget-card"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Grid } from "@blazz/ui/components/ui/grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import type { LucideIcon } from "lucide-react"
import { Banknote, CheckSquare, Clock, CreditCard, FileText, FolderOpen, Send } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
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

// ─── Main Dashboard ───────────────────────────────────────────

export default function DashboardPageClient() {
	const now = useMemo(() => new Date(), [])
	const { from, to, prevStart, prevEnd } = useMemo(() => {
		const prevMonth = subMonths(now, 1)
		return {
			from: format(startOfMonth(now), "yyyy-MM-dd"),
			to: format(endOfMonth(now), "yyyy-MM-dd"),
			prevStart: format(startOfMonth(prevMonth), "yyyy-MM-dd"),
			prevEnd: format(endOfMonth(prevMonth), "yyyy-MM-dd"),
		}
	}, [now])

	const monthEntries = useQuery(api.timeEntries.list, { from, to })
	const prevMonthEntries = useQuery(api.timeEntries.list, { from: prevStart, to: prevEnd })
	const projectsWithBudget = useQuery(api.projects.listAllWithBudget)
	const forecast = useQuery(api.finances.forecast)
	const todos = useQuery(api.todos.list, {})

	const isLoading =
		monthEntries === undefined || prevMonthEntries === undefined || projectsWithBudget === undefined

	// Current month — memoized
	const { totalMinutes, totalAmount } = useMemo(() => {
		const billable = monthEntries?.filter((e) => e.billable) ?? []
		return {
			totalMinutes: billable.reduce((s, e) => s + e.minutes, 0),
			totalAmount: billable.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0),
		}
	}, [monthEntries])

	// Previous month (trends) — memoized
	const { hoursTrend, revenueTrend } = useMemo(() => {
		const prevBillable = prevMonthEntries?.filter((e) => e.billable) ?? []
		const prevMinutes = prevBillable.reduce((s, e) => s + e.minutes, 0)
		const prevAmount = prevBillable.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
		return {
			hoursTrend: trendPercent(totalMinutes, prevMinutes),
			revenueTrend: trendPercent(totalAmount, prevAmount),
		}
	}, [prevMonthEntries, totalMinutes, totalAmount])

	const activeProjects = useMemo(
		() => projectsWithBudget?.filter((p) => p.status === "active") ?? [],
		[projectsWithBudget]
	)
	const openTodos = useMemo(
		() => todos?.filter((t) => t.status !== "done")?.length ?? 0,
		[todos]
	)

	const monthTitle = useMemo(
		() => format(now, "MMMM yyyy", { locale: fr }).replace(/^\w/, (c) => c.toUpperCase()),
		[now]
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
						{activeProjects.map((project) => {
							const percent = project.budgetPercent ?? 0
							const budgetLabel = project.contractDaysPerMonth
								? `${project.daysConsumed} / ${project.contractDaysPerMonth}j`
								: project.budgetAmount
									? `budget ${formatCurrency(project.budgetAmount)}`
									: `${project.daysConsumed}j consommés`
							return (
								<Grid.Cell key={project._id} columnSpan={{ xs: 12, sm: 6, md: 4 }}>
									<Link
										href={`/clients/${project.clientId}/projects/${project._id}`}
										className="block"
									>
										<BudgetCard
											name={project.name}
											revenue={project.billableRevenue}
											daysConsumed={project.daysConsumed}
											percent={percent}
											budgetLabel={budgetLabel}
											autoColor
											formatCurrency={formatCurrency}
										/>
									</Link>
								</Grid.Cell>
							)
						})}
					</Grid>
				</BlockStack>
			)}

			{isLoading && (
				<BlockStack gap="200">
					<Skeleton className="h-3 w-24" />
					<Grid>
						{[1, 2, 3].map((i) => (
							<Grid.Cell key={i} columnSpan={{ xs: 12, sm: 6, md: 4 }}>
								<BudgetCard name="" revenue={0} daysConsumed={0} percent={0} loading />
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
