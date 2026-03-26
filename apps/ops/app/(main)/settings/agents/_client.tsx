"use client"

import {
	SettingsHeader,
	SettingsPage,
	SettingsSection,
} from "@blazz/pro/components/blocks/settings-block"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
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
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@blazz/ui/components/ui/tabs"
import { useMutation, useQuery } from "convex/react"
import { Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
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
	slug: string
	name: string
	role: string
	model: string
	avatar?: string
	status: "idle" | "busy" | "disabled"
	budget: { maxPerMission: number; maxPerDay: number; maxPerMonth: number }
	usage: { todayUsd: number; monthUsd: number; totalUsd: number; lastResetDay: string; lastResetMonth: string }
}

// ── Soul file hook ──

function useSoulFile(slug: string, file: string) {
	const [content, setContent] = useState("")
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		setLoading(true)
		fetch(`/api/agents/${slug}/soul`)
			.then((r) => r.json())
			.then((data) => {
				setContent(data[file] ?? "")
				setLoading(false)
			})
			.catch(() => setLoading(false))
	}, [slug, file])

	const save = useCallback(async () => {
		setSaving(true)
		try {
			await fetch(`/api/agents/${slug}/soul`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ file, content }),
			})
			toast.success("Fichier sauvegard\u00e9")
		} catch {
			toast.error("Erreur lors de la sauvegarde")
		} finally {
			setSaving(false)
		}
	}, [slug, file, content])

	return { content, setContent, loading, saving, save }
}

// ── Soul editor tab ──

const SOUL_DESCRIPTIONS: Record<string, string> = {
	soul: "D\u00e9finit qui est l\u2019agent\u00a0: ses valeurs, ses limites, sa personnalit\u00e9.",
	style: "Comment l\u2019agent communique\u00a0: ton, format, structure des r\u00e9ponses.",
	skill: "Les modes op\u00e9ratoires de l\u2019agent et ses outils disponibles.",
	context: "Connaissances de domaine permanentes. Toujours charg\u00e9es dans le prompt.",
}

function SoulEditorTab({ slug, file }: { slug: string; file: string }) {
	const { content, setContent, loading, saving, save } = useSoulFile(slug, file)

	if (loading) {
		return (
			<BlockStack gap="sm">
				<Skeleton className="h-4 w-64" />
				<Skeleton className="h-[300px] w-full" />
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="md">
			<p className="text-sm text-fg-muted">
				{SOUL_DESCRIPTIONS[file]}
			</p>
			<textarea
				className="w-full min-h-[300px] rounded-lg border border-edge bg-surface p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<InlineStack align="end">
				<Button onClick={save} disabled={saving}>
					{saving ? "Enregistrement..." : "Enregistrer"}
				</Button>
			</InlineStack>
		</BlockStack>
	)
}

// ── Memory tab ──

function MemoryTab({ agentId }: { agentId: Id<"agents"> }) {
	const memories = useQuery(api.agentMemory.list, { agentId })
	const deleteMemory = useMutation(api.agentMemory.remove)

	const handleDelete = useCallback(
		async (id: Id<"agentMemory">) => {
			try {
				await deleteMemory({ id })
				toast.success("M\u00e9moire supprim\u00e9e")
			} catch {
				toast.error("Erreur lors de la suppression")
			}
		},
		[deleteMemory]
	)

	if (memories === undefined) {
		return (
			<BlockStack gap="sm">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-10 w-full" />
				))}
			</BlockStack>
		)
	}

	if (memories.length === 0) {
		return (
			<p className="text-sm text-fg-muted">
				Aucune m\u00e9moire enregistr\u00e9e pour cet agent.
			</p>
		)
	}

	return (
		<BlockStack gap="sm">
			<p className="text-sm text-fg-muted">
				Informations apprises au fil des conversations et missions.
			</p>
			<BlockStack gap="xs">
				{memories.map((m) => (
					<InlineStack key={m._id} align="space-between" blockAlign="center">
						<InlineStack gap="sm" blockAlign="center">
							<Badge variant="outline">{m.category}</Badge>
							{m.scope === "shared" && <Badge variant="secondary">partag\u00e9</Badge>}
							<span className="text-sm">{m.content}</span>
						</InlineStack>
						<Button variant="ghost" size="sm" onClick={() => handleDelete(m._id as Id<"agentMemory">)}>
							<Trash2 className="size-3.5" />
						</Button>
					</InlineStack>
				))}
			</BlockStack>
		</BlockStack>
	)
}

// ── General tab (existing fields) ──

function GeneralTab({ agent, save, handleBlur, handleBudgetBlur }: {
	agent: Agent
	save: (fields: Record<string, unknown>) => Promise<void>
	handleBlur: (field: string, value: string) => void
	handleBudgetBlur: (budgetField: "maxPerMission" | "maxPerDay" | "maxPerMonth", value: string) => void
}) {
	const usagePercent = agent.budget.maxPerMonth > 0
		? Math.min(100, Math.round((agent.usage.monthUsd / agent.budget.maxPerMonth) * 100))
		: 0

	const isEnabled = agent.status !== "disabled"

	return (
		<BlockStack gap="none">
			<Item>
				<ItemContent>
					<ItemTitle>Nom</ItemTitle>
					<ItemDescription>Nom affich\u00e9 de l\u2019agent.</ItemDescription>
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
					<ItemTitle>R\u00f4le</ItemTitle>
					<ItemDescription>Description du r\u00f4le de l\u2019agent.</ItemDescription>
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
					<ItemTitle>Mod\u00e8le</ItemTitle>
					<ItemDescription>Mod\u00e8le LLM utilis\u00e9 par l\u2019agent.</ItemDescription>
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
					<ItemDescription>Co\u00fbt max par ex\u00e9cution (en $).</ItemDescription>
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
					<ItemDescription>D\u00e9pense max quotidienne (en $).</ItemDescription>
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
					<ItemDescription>D\u00e9pense max mensuelle (en $).</ItemDescription>
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
					<ItemTitle>Activ\u00e9</ItemTitle>
					<ItemDescription>D\u00e9sactiver l\u2019agent l\u2019emp\u00eache d\u2019ex\u00e9cuter des missions.</ItemDescription>
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
		</BlockStack>
	)
}

// ── Agent card with tabs ──

function AgentCard({ agent }: { agent: Agent }) {
	const update = useMutation(api.agents.update)

	const save = useCallback(
		async (fields: Record<string, unknown>) => {
			try {
				await update({ id: agent._id, ...fields } as Parameters<typeof update>[0])
				toast.success("Agent mis \u00e0 jour")
			} catch {
				toast.error("Erreur lors de la mise \u00e0 jour")
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

	return (
		<SettingsSection title={`${agent.name} \u2014 ${agent.role}`}>
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

			<Tabs defaultValue="general">
				<TabsList variant="line">
					<TabsTrigger value="general">G\u00e9n\u00e9ral</TabsTrigger>
					<TabsTrigger value="soul">Personnalit\u00e9</TabsTrigger>
					<TabsTrigger value="style">Style</TabsTrigger>
					<TabsTrigger value="skill">Comp\u00e9tences</TabsTrigger>
					<TabsTrigger value="context">Contexte</TabsTrigger>
					<TabsTrigger value="memory">M\u00e9moire</TabsTrigger>
				</TabsList>

				<TabsContent value="general">
					<GeneralTab
						agent={agent}
						save={save}
						handleBlur={handleBlur}
						handleBudgetBlur={handleBudgetBlur}
					/>
				</TabsContent>

				<TabsContent value="soul">
					<SoulEditorTab slug={agent.slug} file="soul" />
				</TabsContent>

				<TabsContent value="style">
					<SoulEditorTab slug={agent.slug} file="style" />
				</TabsContent>

				<TabsContent value="skill">
					<SoulEditorTab slug={agent.slug} file="skill" />
				</TabsContent>

				<TabsContent value="context">
					<SoulEditorTab slug={agent.slug} file="context" />
				</TabsContent>

				<TabsContent value="memory">
					<MemoryTab agentId={agent._id} />
				</TabsContent>
			</Tabs>
		</SettingsSection>
	)
}

function LoadingSkeleton() {
	return (
		<SettingsPage>
			<SettingsHeader title="Agents" description="G\u00e9rez vos agents autonomes." />
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
			<SettingsHeader title="Agents" description="G\u00e9rez vos agents autonomes." />
			{agents.map((agent) => (
				<AgentCard key={agent._id} agent={agent as Agent} />
			))}
			{agents.length === 0 && (
				<Text variant="muted">Aucun agent configur\u00e9. Lancez le seed depuis les missions.</p>
			)}
		</SettingsPage>
	)
}
