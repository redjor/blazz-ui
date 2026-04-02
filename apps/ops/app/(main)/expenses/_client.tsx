"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { ConfirmationDialog } from "@blazz/ui/components/ui/confirmation-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@blazz/ui/components/ui/dropdown-menu"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { Car, ChevronLeft, ChevronRight, Edit2, MapPin, MoreHorizontal, Plus, ReceiptText, Trash2, Utensils } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatCurrency } from "@/lib/format"
import { ExpenseDialog } from "./_expense-dialog"

const TYPE_FILTER_ITEMS = [
	{ value: "all", label: "Tous les types" },
	{ value: "restaurant", label: "Restaurants" },
	{ value: "mileage", label: "Déplacements" },
]

export default function ExpensesPageClient() {
	const [month, setMonth] = useState(new Date())
	const [typeFilter, setTypeFilter] = useState<"all" | "restaurant" | "mileage">("all")
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogType, setDialogType] = useState<"restaurant" | "mileage">("restaurant")
	const [editingExpense, setEditingExpense] = useState<any | null>(null)
	const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: Id<"expenses"> | null }>({
		open: false,
		id: null,
	})

	const from = format(startOfMonth(month), "yyyy-MM-dd")
	const to = format(endOfMonth(month), "yyyy-MM-dd")

	const expenses = useQuery(api.expenses.list, {
		type: typeFilter === "all" ? undefined : typeFilter,
		from,
		to,
	})
	const stats = useQuery(api.expenses.stats, { from, to })
	const removeExpense = useMutation(api.expenses.remove)

	useAppTopBar([{ label: "Frais pro" }])

	function handlePrevMonth() {
		setMonth((prev) => {
			const d = new Date(prev)
			d.setMonth(d.getMonth() - 1)
			return d
		})
	}

	function handleNextMonth() {
		setMonth((prev) => {
			const d = new Date(prev)
			d.setMonth(d.getMonth() + 1)
			return d
		})
	}

	function handleNewExpense(type: "restaurant" | "mileage") {
		setEditingExpense(null)
		setDialogType(type)
		setDialogOpen(true)
	}

	function handleEdit(expense: any) {
		setEditingExpense(expense)
		setDialogType(expense.type)
		setDialogOpen(true)
	}

	async function handleDelete() {
		if (!deleteConfirm.id) return
		await removeExpense({ id: deleteConfirm.id })
		setDeleteConfirm({ open: false, id: null })
	}

	const monthLabel = format(month, "MMMM yyyy", { locale: fr })
	const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

	// Loading state
	if (expenses === undefined || stats === undefined) {
		return (
			<BlockStack gap="600" className="p-4">
				<PageHeader title="Frais professionnels" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-64 w-full" />
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="600" className="p-4">
			<PageHeader
				title="Frais professionnels"
				actions={
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button />}>
							<Plus className="size-4 mr-1" />
							Ajouter
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleNewExpense("restaurant")}>
								<Utensils className="size-4 mr-2" />
								Restaurant
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleNewExpense("mileage")}>
								<Car className="size-4 mr-2" />
								Déplacement
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				}
				bottom={
					<InlineStack align="space-between" blockAlign="center">
						<InlineStack gap="200" blockAlign="center">
							<Button variant="ghost" size="icon-sm" onClick={handlePrevMonth}>
								<ChevronLeft className="size-4" />
							</Button>
							<span className="text-sm font-medium text-fg min-w-[140px] text-center">{capitalizedMonth}</span>
							<Button variant="ghost" size="icon-sm" onClick={handleNextMonth}>
								<ChevronRight className="size-4" />
							</Button>
						</InlineStack>
						<Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as "all" | "restaurant" | "mileage")} items={TYPE_FILTER_ITEMS}>
							<SelectTrigger className="w-[180px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{TYPE_FILTER_ITEMS.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</InlineStack>
				}
			/>

			{/* Stats */}
			<StatsGrid
				columns={3}
				stats={[
					{
						label: "Restaurants",
						value: formatCurrency(stats.totalRestaurantCents / 100),
						description: `${stats.restaurantCount} repas`,
						icon: Utensils,
					},
					{
						label: "Kilomètres",
						value: `${stats.totalKm.toLocaleString("fr-FR")} km`,
						description: `${stats.mileageCount} trajets`,
						icon: MapPin,
					},
					{
						label: "Indemnités km",
						value: formatCurrency(stats.totalReimbursementCents / 100),
						description: "Barème URSSAF 2025",
						icon: Car,
					},
				]}
			/>

			{/* Expense list */}
			{expenses.length === 0 ? (
				<Card>
					<CardContent className="py-10 text-center">
						<BlockStack gap="200" className="items-center">
							<ReceiptText className="size-10 text-fg-muted" />
							<span className="text-sm text-fg-muted">Aucun frais ce mois</span>
						</BlockStack>
					</CardContent>
				</Card>
			) : (
				<Card>
					<div className="divide-y divide-separator">
						{expenses.map((expense) => (
							<div key={expense._id} className="flex items-center justify-between px-inset py-3 cursor-pointer hover:bg-raised/50 transition-colors" onClick={() => handleEdit(expense)}>
								<div className="flex flex-col gap-0.5 min-w-0 flex-1">
									<InlineStack gap="200" blockAlign="center">
										<Badge variant={expense.type === "restaurant" ? "default" : "secondary"}>{expense.type === "restaurant" ? "Restaurant" : "Déplacement"}</Badge>
										<span className="text-xs text-fg-muted">{format(new Date(expense.date), "dd MMM yyyy", { locale: fr })}</span>
									</InlineStack>
									<span className="text-sm text-fg truncate">
										{expense.type === "restaurant" ? [expense.guests, expense.purpose].filter(Boolean).join(" — ") || "—" : `${expense.departure ?? "?"} → ${expense.destination ?? "?"}`}
									</span>
									{expense.clientName && <span className="text-xs text-fg-muted">{expense.clientName}</span>}
								</div>
								<InlineStack gap="200" blockAlign="center">
									<span className="text-sm font-medium tabular-nums text-fg whitespace-nowrap">
										{expense.type === "restaurant" ? formatCurrency((expense.amountCents ?? 0) / 100) : `${expense.distanceKm ?? 0} km — ${formatCurrency((expense.reimbursementCents ?? 0) / 100)}`}
									</span>
									<DropdownMenu>
										<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
											<MoreHorizontal className="size-3.5" />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation()
													handleEdit(expense)
												}}
											>
												<Edit2 className="size-4 mr-2" />
												Modifier
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation()
													setDeleteConfirm({ open: true, id: expense._id })
												}}
											>
												<Trash2 className="size-4 mr-2 text-destructive" />
												Supprimer
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</InlineStack>
							</div>
						))}
					</div>
				</Card>
			)}

			{/* Dialogs */}
			<ExpenseDialog
				open={dialogOpen}
				onOpenChange={(open) => {
					setDialogOpen(open)
					if (!open) setEditingExpense(null)
				}}
				type={dialogType}
				expense={editingExpense}
			/>

			<ConfirmationDialog
				open={deleteConfirm.open}
				onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
				title="Supprimer ce frais ?"
				description="Cette action est irréversible."
				confirmLabel="Supprimer"
				cancelLabel="Annuler"
				variant="destructive"
				onConfirm={handleDelete}
			/>
		</BlockStack>
	)
}
