"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Bot, Kanban, LayoutList, Plus, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { api } from "@/convex/_generated/api"
import { MissionCard } from "./_components/mission-card"
import { MissionForm } from "./_components/mission-form"

type Status = "planning" | "todo" | "in_progress" | "review" | "done" | "rejected" | "aborted"

const STATUS_GROUPS: { key: Status; label: string }[] = [
	{ key: "in_progress", label: "En cours" },
	{ key: "review", label: "En revue" },
	{ key: "todo", label: "A faire" },
	{ key: "planning", label: "Planification" },
	{ key: "done", label: "Terminees" },
	{ key: "rejected", label: "Rejetees" },
	{ key: "aborted", label: "Annulees" },
]

const KANBAN_COLUMNS: { key: Status; label: string }[] = [
	{ key: "planning", label: "Planification" },
	{ key: "todo", label: "A faire" },
	{ key: "in_progress", label: "En cours" },
	{ key: "review", label: "En revue" },
	{ key: "done", label: "Terminees" },
]

export function MissionsClient() {
	const router = useRouter()
	const [formOpen, setFormOpen] = useState(false)
	const [view, setView] = useState<"list" | "kanban">("kanban")
	const missions = useQuery(api.missions.list, {})
	const agents = useQuery(api.agents.list)

	useAppTopBar([{ label: "Mission Control" }])

	const agentMap = useMemo(() => {
		if (!agents) return new Map()
		return new Map(agents.map((a) => [a._id, a]))
	}, [agents])

	const grouped = useMemo(() => {
		if (!missions) return new Map<Status, typeof missions>()
		const map = new Map<Status, typeof missions>()
		for (const group of STATUS_GROUPS) {
			const items = missions.filter((m) => m.status === group.key)
			if (items.length > 0) {
				map.set(group.key, items)
			}
		}
		return map
	}, [missions])

	const activeMissionCount = useMemo(() => {
		if (!missions) return 0
		return missions.filter((m) => ["todo", "in_progress", "review"].includes(m.status)).length
	}, [missions])

	// Loading state
	if (missions === undefined || agents === undefined) {
		return (
			<BlockStack gap="600" className="p-4">
				<PageHeader title="Mission Control" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-64 w-full" />
			</BlockStack>
		)
	}

	// Empty state
	if (missions.length === 0) {
		return (
			<BlockStack gap="600" className="p-4">
				<PageHeader
					title="Mission Control"
					actions={
						<Button onClick={() => setFormOpen(true)}>
							<Plus className="size-4 mr-1" />
							Nouvelle mission
						</Button>
					}
				/>
				<Card>
					<CardContent className="py-16 text-center">
						<BlockStack gap="300" className="items-center">
							<Bot className="size-12 text-fg-muted" />
							<span className="text-sm text-fg-muted">Aucune mission. Creez-en une pour demarrer vos agents.</span>
							<Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
								<Plus className="size-3 mr-1" />
								Creer une mission
							</Button>
						</BlockStack>
					</CardContent>
				</Card>
				<MissionForm open={formOpen} onOpenChange={setFormOpen} agents={agents} />
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="600" className="p-4">
			<PageHeader
				title="Mission Control"
				actions={
					<InlineStack gap="200">
						<InlineStack gap="050">
							<Button variant={view === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setView("list")}>
								<LayoutList className="size-4" />
							</Button>
							<Button variant={view === "kanban" ? "secondary" : "ghost"} size="sm" onClick={() => setView("kanban")}>
								<Kanban className="size-4" />
							</Button>
						</InlineStack>
						<Button onClick={() => setFormOpen(true)}>
							<Plus className="size-4 mr-1" />
							Nouvelle mission
						</Button>
					</InlineStack>
				}
				bottom={
					<InlineStack gap="200">
						<Badge variant="secondary">
							<Zap className="size-3 mr-1" />
							{activeMissionCount} active{activeMissionCount > 1 ? "s" : ""}
						</Badge>
						<Badge variant="outline">{missions.length} total</Badge>
					</InlineStack>
				}
			/>

			{view === "kanban" ? (
				<div className="overflow-x-auto -mx-4 px-4 pb-4">
					<InlineStack gap="300" className="min-w-max items-start">
						{KANBAN_COLUMNS.map(({ key, label }) => {
							const items = grouped.get(key) ?? []
							return (
								<BlockStack key={key} gap="200" className="w-72 shrink-0">
									<InlineStack gap="200" blockAlign="center" className="px-1">
										<span className="text-sm font-medium text-fg-muted">{label}</span>
										<Badge variant="outline" className="text-[10px]">
											{items.length}
										</Badge>
									</InlineStack>
									<BlockStack gap="200" className="min-h-[120px] rounded-lg bg-muted/50 p-2">
										{items.length === 0 ? (
											<Box className="flex items-center justify-center h-20">
												<span className="text-xs text-fg-muted">Aucune mission</span>
											</Box>
										) : (
											items.map((mission) => <MissionCard key={mission._id} mission={mission} agent={agentMap.get(mission.agentId) ?? null} onClick={() => router.push(`/missions/${mission._id}`)} />)
										)}
									</BlockStack>
								</BlockStack>
							)
						})}
					</InlineStack>
				</div>
			) : (
				/* List view — missions grouped by status */
				STATUS_GROUPS.map(({ key, label }) => {
					const items = grouped.get(key)
					if (!items || items.length === 0) return null

					return (
						<BlockStack key={key} gap="300">
							<InlineStack gap="200" blockAlign="center">
								<h2 className="text-sm font-medium text-fg-muted">{label}</h2>
								<Badge variant="outline" className="text-[10px]">
									{items.length}
								</Badge>
							</InlineStack>

							<BlockStack gap="200">
								{items.map((mission) => (
									<MissionCard key={mission._id} mission={mission} agent={agentMap.get(mission.agentId) ?? null} onClick={() => router.push(`/missions/${mission._id}`)} />
								))}
							</BlockStack>
						</BlockStack>
					)
				})
			)}

			{/* Form dialog */}
			<MissionForm open={formOpen} onOpenChange={setFormOpen} agents={agents} />
		</BlockStack>
	)
}
