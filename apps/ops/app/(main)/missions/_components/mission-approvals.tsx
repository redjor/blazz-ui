"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useMutation, useQuery } from "convex/react"
import { Check, X } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

function formatArgs(args: unknown): string {
	if (args == null) return ""
	if (typeof args === "string") return args
	try {
		return JSON.stringify(args, null, 2)
	} catch {
		return String(args)
	}
}

export function MissionApprovalsInline({ missionId }: { missionId: Id<"missions"> }) {
	const approvals = useQuery(api.missionApprovals.listByMission, { missionId })
	const approveMut = useMutation(api.missionApprovals.approve)
	const rejectMut = useMutation(api.missionApprovals.reject)
	const [busyId, setBusyId] = useState<Id<"missionApprovals"> | null>(null)

	const pending = useMemo(() => (approvals ?? []).filter((a) => a.status === "pending"), [approvals])

	if (pending.length === 0) return null

	const handleApprove = async (id: Id<"missionApprovals">) => {
		setBusyId(id)
		try {
			await approveMut({ id })
			toast.success("Approuvé — l'agent reprend")
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur")
		} finally {
			setBusyId(null)
		}
	}

	const handleReject = async (id: Id<"missionApprovals">) => {
		setBusyId(id)
		try {
			await rejectMut({ id, reason: "Rejeté depuis la mission" })
			toast.success("Rejeté")
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur")
		} finally {
			setBusyId(null)
		}
	}

	return (
		<Card className="border-caution/40 bg-caution/5">
			<CardContent className="p-4">
				<BlockStack gap="300">
					<InlineStack gap="200" blockAlign="center">
						<span className="size-2 rounded-full bg-caution animate-pulse" />
						<span className="text-sm font-medium text-fg">{pending.length > 1 ? `${pending.length} actions à valider` : "Action à valider"}</span>
					</InlineStack>
					{pending.map((approval) => {
						const argsStr = formatArgs(approval.toolArgs)
						const isBusy = busyId === approval._id
						return (
							<BlockStack key={approval._id} gap="200" className="rounded-md border border-edge bg-card p-3">
								<InlineStack align="space-between" blockAlign="center" wrap={false}>
									<InlineStack gap="200" blockAlign="center">
										<span className="text-sm text-fg">L&apos;agent veut exécuter</span>
										<Badge variant="outline" className="text-[11px] font-mono">
											{approval.toolName}
										</Badge>
									</InlineStack>
									<InlineStack gap="100">
										<Button variant="outline" size="sm" onClick={() => handleReject(approval._id)} disabled={isBusy}>
											<X className="size-3.5 mr-1" />
											Rejeter
										</Button>
										<Button size="sm" onClick={() => handleApprove(approval._id)} disabled={isBusy}>
											<Check className="size-3.5 mr-1" />
											Approuver
										</Button>
									</InlineStack>
								</InlineStack>
								{argsStr && argsStr !== "{}" && <pre className="text-[11px] font-mono bg-muted/40 rounded p-2 overflow-x-auto max-h-40 whitespace-pre-wrap">{argsStr}</pre>}
							</BlockStack>
						)
					})}
				</BlockStack>
			</CardContent>
		</Card>
	)
}
