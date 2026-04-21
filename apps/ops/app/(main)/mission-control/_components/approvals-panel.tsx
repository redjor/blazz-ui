"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

function formatTime(ts: number): string {
	const diff = Date.now() - ts
	if (diff < 60_000) return "à l'instant"
	if (diff < 3600_000) return `il y a ${Math.floor(diff / 60_000)}min`
	return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

function formatArgs(args: unknown): string {
	if (args == null) return ""
	if (typeof args === "string") return args
	try {
		return JSON.stringify(args, null, 2)
	} catch {
		return String(args)
	}
}

export function ApprovalsPanel() {
	const approvals = useQuery(api.missionApprovals.listPending)
	const agents = useQuery(api.agents.list)
	const approveMut = useMutation(api.missionApprovals.approve)
	const rejectMut = useMutation(api.missionApprovals.reject)
	const [busyId, setBusyId] = useState<Id<"missionApprovals"> | null>(null)

	const agentMap = useMemo(() => {
		if (!agents) return new Map<Id<"agents">, { name: string; role: string }>()
		return new Map(agents.map((a) => [a._id, { name: a.name, role: a.role }]))
	}, [agents])

	const handleApprove = async (id: Id<"missionApprovals">) => {
		setBusyId(id)
		try {
			await approveMut({ id })
			toast.success("Approuvé")
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur")
		} finally {
			setBusyId(null)
		}
	}

	const handleReject = async (id: Id<"missionApprovals">) => {
		setBusyId(id)
		try {
			await rejectMut({ id, reason: "Rejeté depuis Mission Control" })
			toast.success("Rejeté")
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur")
		} finally {
			setBusyId(null)
		}
	}

	if (approvals === undefined) {
		return (
			<Card>
				<CardContent className="p-3">
					<BlockStack gap="200">
						{[1, 2].map((i) => (
							<Skeleton key={i} className="h-16 w-full rounded-md" />
						))}
					</BlockStack>
				</CardContent>
			</Card>
		)
	}

	if (approvals.length === 0) return null

	return (
		<Card>
			<CardContent className="p-0">
				<BlockStack>
					{approvals.map((approval) => {
						const agent = agentMap.get(approval.agentId)
						const argsStr = formatArgs(approval.toolArgs)
						const isBusy = busyId === approval._id
						return (
							<BlockStack key={approval._id} gap="200" className="px-4 py-3 border-b border-edge last:border-b-0">
								<InlineStack align="space-between" blockAlign="start" wrap={false}>
									<InlineStack gap="200" blockAlign="center" wrap={false} className="min-w-0 flex-1">
										{agent && <AgentAvatar name={agent.name} size={24} className="shrink-0" />}
										<BlockStack gap="050" className="min-w-0">
											<InlineStack gap="150" blockAlign="center" wrap={false}>
												{agent && <span className="text-sm font-medium text-fg">{agent.name}</span>}
												<span className="text-xs text-fg-muted">veut exécuter</span>
												<Badge variant="outline" className="text-[10px] font-mono">
													{approval.toolName}
												</Badge>
											</InlineStack>
											<Link href={`/missions/${approval.missionId}`} className="text-[11px] text-fg-muted hover:underline truncate">
												Voir la mission · {formatTime(approval.requestedAt)}
											</Link>
										</BlockStack>
									</InlineStack>
									<InlineStack gap="100" className="shrink-0">
										<Button variant="outline" size="sm" onClick={() => handleReject(approval._id)} disabled={isBusy}>
											<X className="size-3.5" />
											<span className="sr-only">Rejeter</span>
										</Button>
										<Button size="sm" onClick={() => handleApprove(approval._id)} disabled={isBusy}>
											<Check className="size-3.5 mr-1" />
											Approuver
										</Button>
									</InlineStack>
								</InlineStack>
								{argsStr && argsStr !== "{}" && <pre className="text-[11px] font-mono bg-muted/40 rounded p-2 overflow-x-auto max-h-24 whitespace-pre-wrap">{argsStr}</pre>}
							</BlockStack>
						)
					})}
				</BlockStack>
			</CardContent>
		</Card>
	)
}
