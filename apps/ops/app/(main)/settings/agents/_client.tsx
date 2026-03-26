"use client"

import {
	SettingsHeader,
	SettingsPage,
	SettingsSection,
} from "@blazz/pro/components/blocks/settings-block"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@blazz/ui/components/ui/item"
import { Progress } from "@blazz/ui/components/ui/progress"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Switch } from "@blazz/ui/components/ui/switch"
import { Text } from "@blazz/ui/components/ui/text"
import { useMutation, useQuery } from "convex/react"
import { useCallback } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"

const MODEL_OPTIONS = [
	{ value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
	{ value: "gpt-4.1", label: "GPT-4.1" },
	{ value: "gpt-4o-mini", label: "GPT-4o Mini" },
]

type Agent = {
	_id: Id<"agents">
	name: string
	role: string
	model: string
	avatar?: string
	status: "idle" | "busy" | "disabled"
	budget: { maxPerMission: number; maxPerDay: number; maxPerMonth: number }
	usage: { todayUsd: number; monthUsd: number; totalUsd: number; lastResetDay: string; lastResetMonth: string }
}

function AgentCard({ agent }: { agent: Agent }) {
	const update = useMutation(api.agents.update)

	const save = useCallback(
		async (fields: Record<string, unknown>) => {
			try {
				await update({ id: agent._id, ...fields } as Parameters<typeof update>[0])
				toast.success("Agent mis à jour")
			} catch {
				toast.error("Erreur lors de la mise à jour")
			}
		},
		[update, agent._id]
	)

	const handleBlur = useCallback(
		(field: string, value: string) => {
			if (field === "name" && value !== agent.name) {
				save({ name: value })
			} else if (field === "role" && value !== agent.role) {
				save({ role: value })
			}
		},
		[save, agent.name, agent.role]
	)

	const handleBudgetBlur = useCallback(
		(budgetField: "maxPerMission" | "maxPerDay" | "maxPerMonth", value: string) => {
			const num = Number.parseFloat(value)
			if (Number.isNaN(num) || num < 0) return
			if (num === agent.budget[budgetField]) return
			save({
				budget: {
					...agent.budget,
					[budgetField]: num,
				},
			})
		},
		[save, agent.budget]
	)

	const usagePercent = agent.budget.maxPerMonth > 0
		? Math.min(100, Math.round((agent.usage.monthUsd / agent.budget.maxPerMonth) * 100))
		: 0

	const isEnabled = agent.status !== "disabled"

	return (
		<SettingsSection title={`${agent.name} — ${agent.role}`}>
			<Item>
				<ItemContent>
					<InlineStack align="center" gap="sm">
						<AgentAvatar name={agent.name} size={32} />
						<BlockStack gap="none">
							<ItemTitle>{agent.name}</ItemTitle>
							<ItemDescription>{agent.role}</ItemDescription>
						</BlockStack>
					</InlineStack>
				</ItemContent>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Nom</ItemTitle>
					<ItemDescription>Nom affiché de l'agent.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Input
						className="w-48"
						defaultValue={agent.name}
						onBlur={(e) => handleBlur("name", e.target.value)}
					/>
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Rôle</ItemTitle>
					<ItemDescription>Description du rôle de l'agent.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Input
						className="w-48"
						defaultValue={agent.role}
						onBlur={(e) => handleBlur("role", e.target.value)}
					/>
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Modèle</ItemTitle>
					<ItemDescription>Modèle LLM utilisé par l'agent.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Select
						value={agent.model}
						onValueChange={(value) => save({ model: value })}
						items={MODEL_OPTIONS}
					>
						<SelectTrigger className="w-48">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MODEL_OPTIONS.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Budget par mission</ItemTitle>
					<ItemDescription>Coût max par exécution (en $).</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Input
						className="w-48"
						type="number"
						step="0.01"
						min="0"
						defaultValue={agent.budget.maxPerMission}
						onBlur={(e) => handleBudgetBlur("maxPerMission", e.target.value)}
					/>
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Budget par jour</ItemTitle>
					<ItemDescription>Dépense max quotidienne (en $).</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Input
						className="w-48"
						type="number"
						step="0.01"
						min="0"
						defaultValue={agent.budget.maxPerDay}
						onBlur={(e) => handleBudgetBlur("maxPerDay", e.target.value)}
					/>
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Budget par mois</ItemTitle>
					<ItemDescription>Dépense max mensuelle (en $).</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Input
						className="w-48"
						type="number"
						step="0.01"
						min="0"
						defaultValue={agent.budget.maxPerMonth}
						onBlur={(e) => handleBudgetBlur("maxPerMonth", e.target.value)}
					/>
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Activé</ItemTitle>
					<ItemDescription>Désactiver l'agent l'empêche d'exécuter des missions.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Switch
						checked={isEnabled}
						onCheckedChange={(checked) =>
							save({ status: checked ? "idle" : "disabled" })
						}
					/>
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Usage ce mois</ItemTitle>
					<ItemDescription>
						${agent.usage.monthUsd.toFixed(2)} / ${agent.budget.maxPerMonth.toFixed(2)} ({usagePercent}%)
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Progress value={usagePercent} className="w-48" />
				</ItemActions>
			</Item>
		</SettingsSection>
	)

}

function LoadingSkeleton() {
	return (
		<SettingsPage>
			<SettingsHeader title="Agents" description="Gérez vos agents autonomes." />
			<BlockStack gap="lg">
				{[1, 2, 3].map((i) => (
					<BlockStack key={i} gap="sm">
						<Skeleton className="h-6 w-64" />
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-12 w-full" />
					</BlockStack>
				))}
			</BlockStack>
		</SettingsPage>
	)
}

export function AgentsSettingsClient() {
	const agents = useQuery(api.agents.list)

	if (agents === undefined) return <LoadingSkeleton />

	return (
		<SettingsPage>
			<SettingsHeader title="Agents" description="Gérez vos agents autonomes." />
			{agents.map((agent) => (
				<AgentCard key={agent._id} agent={agent as Agent} />
			))}
			{agents.length === 0 && (
				<Text variant="muted">Aucun agent configuré. Lancez le seed depuis les missions.</Text>
			)}
		</SettingsPage>
	)
}
