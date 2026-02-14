"use client"

import { Suspense, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/blocks/page-header"
import { KanbanBoard, type KanbanColumn } from "@/components/blocks/kanban-board"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { deals as initialDeals, formatCurrency, type Deal } from "@/lib/sample-data"
import { useSearchParams } from "next/navigation"

const stageConfig: Record<string, { label: string; variant: "success" | "info" | "warning" | "critical" | "outline" | "default" }> = {
	lead: { label: "Lead", variant: "outline" },
	qualified: { label: "Qualifié", variant: "info" },
	proposal: { label: "Proposition", variant: "warning" },
	negotiation: { label: "Négociation", variant: "default" },
	closed_won: { label: "Gagné", variant: "success" },
	closed_lost: { label: "Perdu", variant: "critical" },
}

const kanbanColumns: KanbanColumn<Deal>[] = [
	{ id: "lead", label: "Lead" },
	{ id: "qualified", label: "Qualifié" },
	{ id: "proposal", label: "Proposition" },
	{ id: "negotiation", label: "Négociation" },
	{ id: "closed_won", label: "Gagné" },
	{ id: "closed_lost", label: "Perdu" },
]

function DealCard({ deal }: { deal: Deal }) {
	return (
		<a
			href={`/deals/${deal.id}`}
			className="block rounded-lg border bg-background p-3 shadow-sm hover:shadow-md transition-shadow"
		>
			<p className="text-sm font-medium truncate">{deal.title}</p>
			<p className="mt-1 text-xs text-muted-foreground">{deal.companyName}</p>
			<div className="mt-2 flex items-center justify-between">
				<span className="text-sm font-semibold">
					{formatCurrency(deal.amount)}
				</span>
				<span className="text-xs text-muted-foreground">
					{deal.probability}%
				</span>
			</div>
			<p className="mt-1 text-xs text-muted-foreground">
				{deal.assignedTo}
			</p>
		</a>
	)
}

function DealsContent() {
	const searchParams = useSearchParams()
	const view = searchParams.get("view") ?? "kanban"
	const [dealsList, setDealsList] = useState(initialDeals)

	const totalPipeline = dealsList
		.filter((d) => !["closed_won", "closed_lost"].includes(d.stage))
		.reduce((sum, d) => sum + d.amount, 0)

	const handleMove = (itemId: string, _from: string, toColumn: string) => {
		const stage = toColumn as Deal["stage"]
		setDealsList((prev) =>
			prev.map((d) => (d.id === itemId ? { ...d, stage } : d))
		)
		const deal = dealsList.find((d) => d.id === itemId)
		const stageLabel = stageConfig[stage]?.label ?? stage
		toast.success(`${deal?.title ?? "Deal"} → ${stageLabel}`)
	}

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Pipeline"
				description={`${formatCurrency(totalPipeline)} en pipeline`}
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Pipeline" },
				]}
				actions={[
					{
						label: view === "kanban" ? "Vue table" : "Vue kanban",
						href: `/deals?view=${view === "kanban" ? "table" : "kanban"}`,
						variant: "outline",
					},
					{ label: "Nouveau deal", href: "/deals/new", icon: Plus },
				]}
			/>

			{view === "kanban" ? (
				<KanbanBoard
					columns={kanbanColumns}
					items={dealsList}
					getColumnId={(deal) => deal.stage}
					onMove={handleMove}
					renderCard={(deal) => <DealCard deal={deal} />}
					renderColumnHeader={(column, items) => {
						const stageTotal = items.reduce((sum, d) => sum + d.amount, 0)
						return (
							<div className="flex items-center justify-between border-b p-3">
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold">{column.label}</span>
									<Badge variant="outline" className="text-xs">
										{items.length}
									</Badge>
								</div>
								<span className="text-xs text-muted-foreground">
									{formatCurrency(stageTotal)}
								</span>
							</div>
						)
					}}
				/>
			) : (
				<Card>
					<CardContent className="p-0">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b bg-muted/50">
									<th className="px-4 py-3 text-left font-medium">Deal</th>
									<th className="px-4 py-3 text-left font-medium">Entreprise</th>
									<th className="px-4 py-3 text-left font-medium">Étape</th>
									<th className="px-4 py-3 text-right font-medium">Montant</th>
									<th className="px-4 py-3 text-right font-medium">Proba.</th>
									<th className="px-4 py-3 text-left font-medium">Assigné à</th>
								</tr>
							</thead>
							<tbody>
								{dealsList.map((deal) => (
									<tr key={deal.id} className="border-b last:border-0 hover:bg-muted/30">
										<td className="px-4 py-3">
											<a href={`/deals/${deal.id}`} className="font-medium hover:underline">
												{deal.title}
											</a>
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{deal.companyName}
										</td>
										<td className="px-4 py-3">
											<Badge variant={stageConfig[deal.stage]?.variant ?? "outline"}>
												{stageConfig[deal.stage]?.label ?? deal.stage}
											</Badge>
										</td>
										<td className="px-4 py-3 text-right font-medium">
											{formatCurrency(deal.amount)}
										</td>
										<td className="px-4 py-3 text-right text-muted-foreground">
											{deal.probability}%
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{deal.assignedTo}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default function DealsPage() {
	return (
		<Suspense fallback={<Skeleton className="h-[600px] m-6 rounded-lg" />}>
			<DealsContent />
		</Suspense>
	)
}
