"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import Link from "next/link"
import { useMemo } from "react"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

type AgentStatus = "idle" | "busy" | "paused" | "error" | "disabled"

const STATUS_DOT: Record<AgentStatus, string> = {
	busy: "bg-emerald-500 animate-pulse",
	idle: "bg-fg-muted/40",
	paused: "bg-caution",
	error: "bg-critical",
	disabled: "bg-fg-muted/20",
}

type AgentLite = {
	_id: Id<"agents">
	slug: string
	name: string
	role: string
	status: string
	reportsTo?: Id<"agents">
}

type OrgNode = {
	agent: AgentLite
	children: OrgNode[]
}

// Walk up reportsTo; return true if we encounter `agent._id` → cycle detected.
function isInCycle(agent: AgentLite, byId: Map<Id<"agents">, AgentLite>): boolean {
	const seen = new Set<Id<"agents">>([agent._id])
	let current = agent.reportsTo
	while (current) {
		if (seen.has(current)) return true
		seen.add(current)
		const parent = byId.get(current)
		if (!parent) return false
		current = parent.reportsTo
	}
	return false
}

function buildTree(agents: AgentLite[]): { roots: OrgNode[]; cycledIds: Set<Id<"agents">> } {
	const byId = new Map<Id<"agents">, OrgNode>()
	const agentsById = new Map<Id<"agents">, AgentLite>()
	for (const agent of agents) {
		byId.set(agent._id, { agent, children: [] })
		agentsById.set(agent._id, agent)
	}

	// Find all agents whose reportsTo chain loops back — they need to be
	// promoted to roots so they don't vanish from the tree.
	const cycledIds = new Set<Id<"agents">>()
	for (const agent of agents) {
		if (agent.reportsTo && isInCycle(agent, agentsById)) {
			cycledIds.add(agent._id)
		}
	}

	const roots: OrgNode[] = []
	for (const agent of agents) {
		const node = byId.get(agent._id)
		if (!node) continue
		const isCycled = cycledIds.has(agent._id)
		const hasValidParent = agent.reportsTo && byId.has(agent.reportsTo)
		if (!isCycled && hasValidParent && agent.reportsTo) {
			byId.get(agent.reportsTo)?.children.push(node)
		} else {
			roots.push(node)
		}
	}
	return { roots, cycledIds }
}

function OrgCard({ agent }: { agent: AgentLite }) {
	const status = (agent.status ?? "idle") as AgentStatus
	return (
		<Link href={`/agents/${agent.slug}`} className="block w-44 rounded-lg border border-edge bg-card p-3 transition-colors hover:bg-muted/50 hover:border-border">
			<BlockStack gap="150" className="items-center text-center">
				<span className="relative">
					<AgentAvatar name={agent.name} size={44} />
					<span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-surface ${STATUS_DOT[status]}`} />
				</span>
				<BlockStack gap="050" className="items-center">
					<span className="text-sm font-medium text-fg leading-tight">{agent.name}</span>
					<span className="text-[11px] text-fg-muted line-clamp-2 leading-tight">{agent.role}</span>
				</BlockStack>
			</BlockStack>
		</Link>
	)
}

function OrgSubtree({ node, connectorAbove = false }: { node: OrgNode; connectorAbove?: boolean }) {
	return (
		<BlockStack gap="0" className="w-auto items-center shrink-0">
			{connectorAbove && <div className="h-4 w-px bg-edge" />}
			<OrgCard agent={node.agent} />
			{node.children.length > 0 && (
				<>
					<div className="h-4 w-px bg-edge" />
					<div className="relative">
						{node.children.length > 1 && <div className="absolute top-0 left-[88px] right-[88px] h-px bg-edge" />}
						<InlineStack gap="400" blockAlign="start" wrap={false}>
							{node.children.map((child) => (
								<OrgSubtree key={child.agent._id} node={child} connectorAbove />
							))}
						</InlineStack>
					</div>
				</>
			)}
		</BlockStack>
	)
}

function OrgChartSkeleton() {
	return (
		<Card>
			<CardContent className="p-8">
				<BlockStack gap="400" className="items-center">
					<Skeleton className="h-24 w-44 rounded-lg" />
					<InlineStack gap="400">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} className="h-24 w-44 rounded-lg" />
						))}
					</InlineStack>
				</BlockStack>
			</CardContent>
		</Card>
	)
}

export function OrgChartPanel() {
	const agents = useQuery(api.agents.list)

	const { roots, cycledIds, orphanCount } = useMemo(() => {
		if (!agents) return { roots: [] as OrgNode[], cycledIds: new Set<Id<"agents">>(), orphanCount: 0 }
		const { roots, cycledIds } = buildTree(agents)
		const ids = new Set(agents.map((a) => a._id))
		const orphanCount = agents.filter((a) => a.reportsTo && !ids.has(a.reportsTo)).length
		return { roots, cycledIds, orphanCount }
	}, [agents])

	if (agents === undefined) return <OrgChartSkeleton />

	if (agents.length === 0) {
		return (
			<Card>
				<CardContent className="py-8 text-center">
					<span className="text-sm text-fg-muted">Aucun agent configuré.</span>
				</CardContent>
			</Card>
		)
	}

	const hasHierarchy = agents.some((a) => a.reportsTo != null)

	if (!hasHierarchy) {
		return (
			<Card>
				<CardContent className="py-8 text-center">
					<BlockStack gap="200" className="items-center">
						<span className="text-sm text-fg-muted">Hiérarchie non configurée.</span>
						<span className="text-xs text-fg-muted">
							Lance <code className="font-mono text-[11px]">agents.applyDefaultHierarchy</code> pour désigner Alex comme racine.
						</span>
					</BlockStack>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardContent className="p-6 overflow-x-auto">
				<BlockStack gap="400" className="items-center min-w-fit">
					{roots.map((root) => (
						<OrgSubtree key={root.agent._id} node={root} />
					))}
					{(orphanCount > 0 || cycledIds.size > 0) && (
						<InlineStack gap="200" wrap>
							{orphanCount > 0 && (
								<Badge variant="outline" className="text-[10px]">
									{orphanCount} agent(s) sans manager valide
								</Badge>
							)}
							{cycledIds.size > 0 && (
								<Badge variant="outline" className="text-[10px] border-critical/50 text-critical">
									Cycle détecté sur {cycledIds.size} agent(s)
								</Badge>
							)}
						</InlineStack>
					)}
				</BlockStack>
			</CardContent>
		</Card>
	)
}
