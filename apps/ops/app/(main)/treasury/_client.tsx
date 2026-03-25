"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { ConfirmationDialog } from "@blazz/ui/components/ui/confirmation-dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useAction, useMutation, useQuery } from "convex/react"
import { toast } from "sonner"
import {
	CalendarClock,
	Edit2,
	Pause,
	Play,
	Plus,
	Receipt,
	Trash2,
	TrendingDown,
	Wallet,
} from "lucide-react"
import { useMemo, useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatCurrency } from "@/lib/format"
import { CashflowChart } from "@/components/cashflow-chart"
import { ExpenseDialog } from "./_expense-dialog"
import { TreasurySettingsDialog } from "./_settings-dialog"
import { SuggestionsSection } from "./_suggestions-section"

const FREQ_LABELS: Record<string, string> = {
	monthly: "Mensuel",
	quarterly: "Trimestriel",
	yearly: "Annuel",
}

export default function TreasuryPageClient() {
	const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
	const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: Id<"recurringExpenses"> | null }>({ open: false, id: null })
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [horizon, setHorizon] = useState<"6m" | "eoy" | "12m">("eoy")

	const forecastMonths = useMemo(() => {
		const now = new Date()
		if (horizon === "eoy") {
			return 12 - now.getMonth()
		}
		return horizon === "12m" ? 12 : 6
	}, [horizon])

	const expenses = useQuery(api.recurringExpenses.list)
	const forecast = useQuery(api.treasury.forecast, { months: forecastMonths })
	const summary = useQuery(api.treasury.expenseSummary)
	const settings = useQuery(api.treasury.getSettings)

	const updateExpense = useMutation(api.recurringExpenses.update)
	const removeExpense = useMutation(api.recurringExpenses.remove)

	const [editingExpense, setEditingExpense] = useState<(typeof expenses extends (infer T)[] | undefined ? T : never) | null>(null)

	const getOrganization = useAction(api.qonto.getOrganization)
	const analyzeRecurring = useAction(api.qonto.analyzeRecurring)
	const [syncing, setSyncing] = useState(false)

	async function handleSync() {
		setSyncing(true)
		try {
			const org = await getOrganization({})
			const mainAccount = org.bankAccounts[0]
			if (!mainAccount) {
				toast.error("Aucun compte bancaire trouvé sur Qonto")
				return
			}
			const result = await analyzeRecurring({ bankAccountSlug: mainAccount.slug })
			if (result.count > 0) {
				toast.success(`${result.count} dépense${result.count > 1 ? "s" : ""} récurrente${result.count > 1 ? "s" : ""} détectée${result.count > 1 ? "s" : ""}`)
			} else {
				toast.info("Aucune nouvelle dépense récurrente détectée")
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur lors du sync Qonto")
		} finally {
			setSyncing(false)
		}
	}

	useAppTopBar([{ label: "Trésorerie" }])

	// Loading
	if (expenses === undefined || forecast === undefined || summary === undefined) {
		return (
			<BlockStack gap="600" className="p-4">
				<PageHeader title="Trésorerie" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-64 w-full" />
			</BlockStack>
		)
	}

	function handleEdit(expense: NonNullable<typeof editingExpense>) {
		setEditingExpense(expense)
		setExpenseDialogOpen(true)
	}

	function handleNew() {
		setEditingExpense(null)
		setExpenseDialogOpen(true)
	}

	async function handleToggleActive(id: Id<"recurringExpenses">, currentlyActive: boolean) {
		await updateExpense({ id, active: !currentlyActive })
	}

	async function handleDelete() {
		if (!deleteConfirm.id) return
		await removeExpense({ id: deleteConfirm.id })
		setDeleteConfirm({ open: false, id: null })
	}

	const activeExpenses = expenses.filter((e) => e.active)
	const inactiveExpenses = expenses.filter((e) => !e.active)

	return (
		<BlockStack gap="600" className="p-4">
			<PageHeader
				title="Trésorerie"
				actions={
					<InlineStack gap="200">
						<Button variant="outline" onClick={handleSync} disabled={syncing}>
							{syncing ? "Sync en cours…" : "Sync Qonto"}
						</Button>
						<Button variant="outline" onClick={() => setSettingsOpen(true)}>
							Paramètres
						</Button>
						<Button onClick={handleNew}>
							<Plus className="size-4 mr-1" />
							Dépense
						</Button>
					</InlineStack>
				}
				bottom={<p className="text-sm text-fg-muted">Dépenses récurrentes &amp; prévisionnel cashflow</p>}
			/>

			{/* Stats */}
			<StatsGrid
				columns={4}
				stats={[
					{
						label: "Charges mensuelles",
						value: formatCurrency(summary.totalMonthlyCents / 100),
						description: `${summary.count} dépenses actives`,
						icon: Receipt,
					},
					{
						label: "Charges annuelles",
						value: formatCurrency(summary.totalYearlyCents / 100),
						icon: CalendarClock,
					},
					{
						label: "Solde initial",
						value: forecast.manualBalanceCents != null
							? formatCurrency(forecast.manualBalanceCents / 100)
							: "Non défini",
						description: forecast.manualBalanceCents == null ? "Sync Qonto ou Paramètres" : undefined,
						icon: Wallet,
					},
					{
						label: "Solde projeté (fin)",
						value: forecast.months.length > 0
							? formatCurrency(forecast.months[forecast.months.length - 1].balanceCents / 100)
							: "—",
						description: horizon === "eoy" ? "fin d'année" : `dans ${forecastMonths} mois`,
						icon: TrendingDown,
					},
				]}
			/>

			{/* Qonto suggestions */}
			<SuggestionsSection />

			{/* Cashflow Chart */}
			{forecast.months.length > 0 && (
				<BlockStack gap="300">
					<InlineStack align="space-between" blockAlign="center">
						<h2 className="text-sm font-medium text-fg-muted">Prévisionnel</h2>
						<InlineStack gap="050">
							{([
								{ key: "6m", label: "6 mois" },
								{ key: "eoy", label: "Fin d'année" },
								{ key: "12m", label: "12 mois" },
							] as const).map(({ key, label }) => (
								<Button
									key={key}
									variant={horizon === key ? "secondary" : "ghost"}
									size="sm"
									onClick={() => setHorizon(key)}
								>
									{label}
								</Button>
							))}
						</InlineStack>
					</InlineStack>
					<CashflowChart months={forecast.months} />
				</BlockStack>
			)}

			{/* Active expenses */}
			<BlockStack gap="300">
				<InlineStack align="space-between" blockAlign="center">
					<h2 className="text-sm font-medium text-fg-muted">
						Dépenses récurrentes ({activeExpenses.length})
					</h2>
				</InlineStack>

				{activeExpenses.length === 0 ? (
					<Card>
						<CardContent className="py-10 text-center">
							<BlockStack gap="200" className="items-center">
								<Receipt className="size-10 text-fg-muted" />
								<span className="text-sm text-fg-muted">Aucune dépense récurrente</span>
								<Button variant="outline" size="sm" onClick={handleNew}>
									<Plus className="size-3 mr-1" />
									Ajouter une dépense
								</Button>
							</BlockStack>
						</CardContent>
					</Card>
				) : (
					<Card>
						<div className="divide-y divide-separator">
							{activeExpenses.map((expense) => (
								<div
									key={expense._id}
									className="flex items-center justify-between px-inset py-3"
								>
									<div className="flex flex-col gap-0.5 min-w-0 flex-1">
										<span className="text-sm font-medium text-fg truncate">
											{expense.name}
										</span>
										<InlineStack gap="200">
											<span className="text-xs text-fg-muted">
												{FREQ_LABELS[expense.frequency]}
											</span>
											{expense.amountType === "variable" && (
												<span className="text-xs text-caution">≈ estimé</span>
											)}
											{expense.dayOfMonth && (
												<span className="text-xs text-fg-muted">
													le {expense.dayOfMonth} du mois
												</span>
											)}
										</InlineStack>
									</div>
									<InlineStack gap="200" blockAlign="center">
										<span className="text-sm font-medium tabular-nums text-fg">
											{formatCurrency(expense.amountCents / 100)}
										</span>
										<InlineStack gap="050">
											<Button
												variant="ghost"
												size="icon-sm"
												onClick={() => handleEdit(expense)}
												title="Modifier"
											>
												<Edit2 className="size-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon-sm"
												onClick={() => handleToggleActive(expense._id, true)}
												title="Mettre en pause"
											>
												<Pause className="size-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon-sm"
												onClick={() => setDeleteConfirm({ open: true, id: expense._id })}
												title="Supprimer"
											>
												<Trash2 className="size-3.5 text-destructive" />
											</Button>
										</InlineStack>
									</InlineStack>
								</div>
							))}
						</div>
					</Card>
				)}
			</BlockStack>

			{/* Inactive expenses */}
			{inactiveExpenses.length > 0 && (
				<BlockStack gap="300">
					<h2 className="text-sm font-medium text-fg-muted">
						En pause ({inactiveExpenses.length})
					</h2>
					<Card>
						<div className="divide-y divide-separator">
							{inactiveExpenses.map((expense) => (
								<div
									key={expense._id}
									className="flex items-center justify-between px-inset py-3 opacity-60"
								>
									<div className="flex flex-col gap-0.5 min-w-0 flex-1">
										<span className="text-sm text-fg truncate">{expense.name}</span>
										<span className="text-xs text-fg-muted">
											{FREQ_LABELS[expense.frequency]} · {formatCurrency(expense.amountCents / 100)}
										</span>
									</div>
									<InlineStack gap="050">
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => handleToggleActive(expense._id, false)}
											title="Réactiver"
										>
											<Play className="size-3.5" />
										</Button>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => setDeleteConfirm({ open: true, id: expense._id })}
											title="Supprimer"
										>
											<Trash2 className="size-3.5 text-destructive" />
										</Button>
									</InlineStack>
								</div>
							))}
						</div>
					</Card>
				</BlockStack>
			)}

			{/* Monthly forecast table */}
			{forecast.months.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Détail mensuel</CardTitle>
					</CardHeader>
					<CardContent>
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-edge text-fg-muted text-left">
									<th className="pb-2 font-medium">Mois</th>
									<th className="pb-2 font-medium text-right">Revenus</th>
									<th className="pb-2 font-medium text-right">Dépenses</th>
									<th className="pb-2 font-medium text-right">Net</th>
									<th className="pb-2 font-medium text-right">Solde</th>
								</tr>
							</thead>
							<tbody>
								{forecast.months.map((m) => {
									const net = m.revenueCents - m.expenseCents
									return (
										<tr key={m.yearMonth} className="border-b border-edge/50">
											<td className="py-2 font-medium">{m.label}</td>
											<td className="py-2 text-right tabular-nums text-positive">
												{formatCurrency(m.revenueCents / 100)}
											</td>
											<td className="py-2 text-right tabular-nums text-destructive">
												{formatCurrency(m.expenseCents / 100)}
											</td>
											<td
												className={`py-2 text-right tabular-nums ${net >= 0 ? "text-positive" : "text-critical"}`}
											>
												{net >= 0 ? "+" : ""}
												{formatCurrency(net / 100)}
											</td>
											<td
												className={`py-2 text-right tabular-nums font-medium ${m.balanceCents >= 0 ? "text-fg" : "text-critical"}`}
											>
												{formatCurrency(m.balanceCents / 100)}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</CardContent>
				</Card>
			)}

			{/* Dialogs */}
			<ExpenseDialog
				open={expenseDialogOpen}
				onOpenChange={(open) => {
					setExpenseDialogOpen(open)
					if (!open) setEditingExpense(null)
				}}
				expense={editingExpense}
			/>

			<ConfirmationDialog
				open={deleteConfirm.open}
				onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
				title="Supprimer cette dépense ?"
				description="Cette action est irréversible."
				confirmLabel="Supprimer"
				cancelLabel="Annuler"
				variant="destructive"
				onConfirm={handleDelete}
			/>

			<TreasurySettingsDialog
				open={settingsOpen}
				onOpenChange={setSettingsOpen}
				settings={settings}
			/>
		</BlockStack>
	)
}
