"use client"

import { Suspense } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { deals, formatCurrency, type Deal } from "@/lib/sample-data"
import { useSearchParams } from "next/navigation"

const stageConfig: Record<string, { label: string; color: string; variant: "success" | "info" | "warning" | "critical" | "outline" | "default" }> = {
	lead: { label: "Lead", color: "bg-gray-50 border-gray-200", variant: "outline" },
	qualified: { label: "Qualifié", color: "bg-blue-50 border-blue-200", variant: "info" },
	proposal: { label: "Proposition", color: "bg-yellow-50 border-yellow-200", variant: "warning" },
	negotiation: { label: "Négociation", color: "bg-purple-50 border-purple-200", variant: "default" },
	closed_won: { label: "Gagné", color: "bg-green-50 border-green-200", variant: "success" },
	closed_lost: { label: "Perdu", color: "bg-red-50 border-red-200", variant: "critical" },
}

const pipelineStages = ["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]

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

function KanbanView() {
	return (
		<div className="flex gap-4 overflow-x-auto pb-4">
			{pipelineStages.map((stage) => {
				const config = stageConfig[stage]
				const stageDeals = deals.filter((d) => d.stage === stage)
				const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0)

				return (
					<div
						key={stage}
						className="flex min-w-[280px] flex-col rounded-lg border bg-muted/30"
					>
						<div className="flex items-center justify-between p-3 border-b">
							<div className="flex items-center gap-2">
								<span className="text-sm font-semibold">{config.label}</span>
								<Badge variant="outline" className="text-xs">
									{stageDeals.length}
								</Badge>
							</div>
							<span className="text-xs text-muted-foreground">
								{formatCurrency(stageTotal)}
							</span>
						</div>
						<div className="flex-1 space-y-2 p-2">
							{stageDeals.map((deal) => (
								<DealCard key={deal.id} deal={deal} />
							))}
							{stageDeals.length === 0 && (
								<p className="py-8 text-center text-xs text-muted-foreground">
									Aucun deal
								</p>
							)}
						</div>
					</div>
				)
			})}
		</div>
	)
}

function DealsContent() {
	const searchParams = useSearchParams()
	const view = searchParams.get("view") ?? "kanban"

	const totalPipeline = deals
		.filter((d) => !["closed_won", "closed_lost"].includes(d.stage))
		.reduce((sum, d) => sum + d.amount, 0)

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
				<KanbanView />
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
								{deals.map((deal) => (
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
