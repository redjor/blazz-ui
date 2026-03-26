"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { MissionLogs } from "../_components/mission-logs"
import { MissionOutput } from "../_components/mission-output"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "info" | "success" | "warning" | "critical" }> = {
	planning: { label: "Planning", variant: "secondary" },
	todo: { label: "Todo", variant: "info" },
	in_progress: { label: "En cours", variant: "warning" },
	review: { label: "Review", variant: "default" },
	done: { label: "Done", variant: "success" },
	rejected: { label: "Rejet\u00E9", variant: "critical" },
	aborted: { label: "Abort\u00E9", variant: "critical" },
}

const priorityConfig: Record<string, { label: string; variant: "secondary" | "info" | "warning" | "critical" }> = {
	low: { label: "Low", variant: "secondary" },
	medium: { label: "Medium", variant: "info" },
	high: { label: "High", variant: "warning" },
	urgent: { label: "Urgent", variant: "critical" },
}

interface Props {
	id: string
}

export function MissionDetailClient({ id }: Props) {
	const missionId = id as Id<"missions">
	const mission = useQuery(api.missions.get, { id: missionId })
	const logs = useQuery(api.agentLogs.list, { missionId })
	const agent = useQuery(
		api.agents.get,
		mission?.agentId ? { id: mission.agentId } : "skip"
	)
	const updateStatus = useMutation(api.missions.updateStatus)
	const createMission = useMutation(api.missions.create)

	const [rejectOpen, setRejectOpen] = useState(false)
	const [rejectionReason, setRejectionReason] = useState("")
	const [loading, setLoading] = useState<string | null>(null)

	useAppTopBar(
		mission != null
			? [{ label: "Missions", href: "/missions" }, { label: mission.title }]
			: null
	)

	if (mission === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<BlockStack gap="200">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-6 w-64" />
				</BlockStack>
				<InlineStack gap="200">
					<Skeleton className="h-5 w-16" />
					<Skeleton className="h-5 w-16" />
					<Skeleton className="h-5 w-20" />
				</InlineStack>
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-48 w-full" />
			</BlockStack>
		)
	}

	if (mission === null) {
		return (
			<Box className="p-6 text-fg-muted text-sm">Mission introuvable.</Box>
		)
	}

	const status = statusConfig[mission.status] ?? statusConfig.planning
	const priority = priorityConfig[mission.priority] ?? priorityConfig.medium

	const duration =
		mission.startedAt && mission.completedAt
			? Math.round((mission.completedAt - mission.startedAt) / 1000)
			: null

	const formatDuration = (seconds: number) => {
		if (seconds < 60) return `${seconds}s`
		const m = Math.floor(seconds / 60)
		const s = seconds % 60
		return s > 0 ? `${m}m${s}s` : `${m}m`
	}

	const handleValidate = async () => {
		setLoading("validate")
		await updateStatus({ id: missionId, status: "done" })
		setLoading(null)
	}

	const handleReject = async () => {
		if (!rejectionReason.trim()) return
		setLoading("reject")
		await updateStatus({ id: missionId, status: "rejected", rejectionReason })
		setRejectOpen(false)
		setRejectionReason("")
		setLoading(null)
	}

	const handleAbort = async () => {
		setLoading("abort")
		await updateStatus({ id: missionId, status: "aborted" })
		setLoading(null)
	}

	const handleRerun = async () => {
		setLoading("rerun")
		await createMission({
			agentId: mission.agentId,
			title: `${mission.title} (re-run)`,
			prompt: mission.rejectionReason
				? `${mission.prompt}\n\n---\nPrevious attempt was rejected: ${mission.rejectionReason}`
				: mission.prompt,
			status: "todo",
			priority: mission.priority,
			mode: mission.mode,
			maxIterations: mission.maxIterations ?? undefined,
		})
		setLoading(null)
	}

	return (
		<>
			<BlockStack gap="600" className="p-6">
				{/* Header */}
				<PageHeader
					title={mission.title}
					actions={
						<InlineStack gap="200">
							{mission.status === "in_progress" && (
								<Button
									variant="destructive"
									size="sm"
									disabled={loading === "abort"}
									onClick={handleAbort}
								>
									Abort
								</Button>
							)}
							{mission.status === "review" && (
								<>
									<Button
										variant="default"
										size="sm"
										disabled={loading === "validate"}
										onClick={handleValidate}
									>
										Valider
									</Button>
									<Button
										variant="destructive"
										size="sm"
										disabled={loading === "reject"}
										onClick={() => setRejectOpen(true)}
									>
										Rejeter
									</Button>
									<Button
										variant="outline"
										size="sm"
										disabled={loading === "rerun"}
										onClick={handleRerun}
									>
										Re-run
									</Button>
								</>
							)}
							{(mission.status === "rejected" || mission.status === "done") && (
								<Button
									variant="outline"
									size="sm"
									disabled={loading === "rerun"}
									onClick={handleRerun}
								>
									Re-run
								</Button>
							)}
						</InlineStack>
					}
				/>

				{/* Meta badges */}
				<InlineStack gap="200" wrap>
					{agent && (
						<Badge variant="secondary" fill="subtle" size="md">
							{agent.avatar} {agent.name}
						</Badge>
					)}
					<Badge variant={status.variant} fill="subtle" size="md">
						{status.label}
					</Badge>
					<Badge variant={priority.variant} fill="subtle" size="md">
						{priority.label}
					</Badge>
					{mission.mode && (
						<Badge variant="secondary" fill="subtle" size="md">
							{mission.mode}
						</Badge>
					)}
					{mission.costUsd != null && (
						<Badge variant="secondary" fill="subtle" size="md">
							${mission.costUsd.toFixed(4)}
						</Badge>
					)}
					{duration != null && (
						<Badge variant="secondary" fill="subtle" size="md">
							{formatDuration(duration)}
						</Badge>
					)}
				</InlineStack>

				{/* Error banner */}
				{mission.error && (
					<Box className="rounded-lg border border-negative/30 bg-negative/10 p-3 text-sm text-negative">
						{mission.error}
					</Box>
				)}

				{/* Rejection reason */}
				{mission.rejectionReason && (
					<Box className="rounded-lg border border-caution/30 bg-caution/10 p-3 text-sm text-caution">
						Rejet : {mission.rejectionReason}
					</Box>
				)}

				{/* Tabs */}
				<Tabs defaultValue="output">
					<TabsList variant="line">
						<TabsTrigger value="output">Output</TabsTrigger>
						<TabsTrigger value="logs">
							Logs
							{logs && logs.length > 0 && (
								<Badge variant="secondary" fill="subtle" size="xs" className="ml-1">
									{logs.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value="actions">Actions</TabsTrigger>
						<TabsTrigger value="prompt">Prompt</TabsTrigger>
					</TabsList>

					<TabsContent value="output" className="pt-4">
						<MissionOutput output={mission.output} />
					</TabsContent>

					<TabsContent value="logs" className="pt-4">
						<MissionLogs logs={logs ?? []} />
					</TabsContent>

					<TabsContent value="actions" className="pt-4">
						{mission.actions && mission.actions.length > 0 ? (
							<BlockStack gap="200">
								{mission.actions.map((action, i) => (
									<InlineStack
										key={i}
										gap="300"
										blockAlign="center"
										className="py-2.5 border-b border-edge last:border-0"
									>
										<Badge
											variant={action.reversible ? "info" : "warning"}
											fill="subtle"
											size="sm"
										>
											{action.type}
										</Badge>
										<span className="text-sm text-fg flex-1">
											{action.description}
										</span>
										{action.entityId && (
											<span className="text-xs font-mono text-fg-muted">
												{action.entityId}
											</span>
										)}
										<Badge
											variant={action.reversible ? "success" : "critical"}
											fill="ghost"
											size="xs"
										>
											{action.reversible ? "reversible" : "irreversible"}
										</Badge>
									</InlineStack>
								))}
							</BlockStack>
						) : (
							<Box className="py-8 text-center text-sm text-fg-muted">
								Aucune action pour cette mission.
							</Box>
						)}
					</TabsContent>

					<TabsContent value="prompt" className="pt-4">
						<Box className="rounded-lg border border-edge bg-card p-4">
							<pre className="text-sm text-fg whitespace-pre-wrap break-words font-mono leading-relaxed">
								{mission.prompt}
							</pre>
						</Box>
					</TabsContent>
				</Tabs>
			</BlockStack>

			{/* Reject dialog */}
			<Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Rejeter la mission</DialogTitle>
					</DialogHeader>
					<BlockStack gap="400">
						<Textarea
							placeholder="Raison du rejet..."
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							rows={3}
						/>
					</BlockStack>
					<DialogFooter>
						<Button variant="outline" onClick={() => setRejectOpen(false)}>
							Annuler
						</Button>
						<Button
							variant="destructive"
							disabled={!rejectionReason.trim() || loading === "reject"}
							onClick={handleReject}
						>
							Rejeter
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
