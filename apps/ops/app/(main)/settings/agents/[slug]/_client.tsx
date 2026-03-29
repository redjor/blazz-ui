"use client"

import { SettingsHeader, SettingsPage } from "@blazz/pro/components/blocks/settings-block"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@blazz/ui/components/ui/item"
import { Progress } from "@blazz/ui/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Switch } from "@blazz/ui/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"
import { useMutation, useQuery } from "convex/react"
import { Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { providerMap } from "@/lib/connections/providers"

// ── Types ──

type Agent = {
	_id: Id<"agents">
	slug: string
	name: string
	role: string
	model: string
	avatar?: string
	status: "idle" | "busy" | "disabled"
	budget: { maxPerMission: number; maxPerDay: number; maxPerMonth: number }
	usage: {
		todayUsd: number
		monthUsd: number
		totalUsd: number
		lastResetDay: string
		lastResetMonth: string
	}
}

const MODEL_OPTIONS = [
	{ value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
	{ value: "gpt-4.1", label: "GPT-4.1" },
	{ value: "gpt-4o-mini", label: "GPT-4o Mini" },
]

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
			toast.success("Fichier sauvegardé")
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
	soul: "Définit qui est l\u2019agent\u00a0: ses valeurs, ses limites, sa personnalité.",
	style: "Comment l\u2019agent communique\u00a0: ton, format, structure des réponses.",
	skill: "Les modes opératoires de l\u2019agent et ses outils disponibles.",
	context: "Connaissances de domaine permanentes. Toujours chargées dans le prompt.",
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
			<p className="text-sm text-fg-muted">{SOUL_DESCRIPTIONS[file]}</p>
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
				toast.success("Mémoire supprimée")
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
		return <p className="text-sm text-fg-muted">Aucune mémoire enregistrée pour cet agent.</p>
	}

	return (
		<BlockStack gap="sm">
			<p className="text-sm text-fg-muted">Informations apprises au fil des conversations et missions.</p>
			<BlockStack gap="xs">
				{memories.map((m) => (
					<InlineStack key={m._id} align="space-between" blockAlign="center">
						<InlineStack gap="sm" blockAlign="center">
							<Badge variant="outline">{m.category}</Badge>
							{m.scope === "shared" && <Badge variant="secondary">partagé</Badge>}
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

// ── Connections tab ──

function ConnectionsTab({ agentId }: { agentId: Id<"agents"> }) {
	const connections = useQuery(api.connections.list)
	const agentConns = useQuery(api.agentConnections.listByAgent, { agentId })
	const linkMut = useMutation(api.agentConnections.link)
	const unlinkMut = useMutation(api.agentConnections.unlink)

	if (connections === undefined || agentConns === undefined) {
		return (
			<BlockStack gap="200">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-16 w-full rounded-lg" />
				))}
			</BlockStack>
		)
	}

	const activeConnections = connections.filter((c) => c.status === "active")

	if (activeConnections.length === 0) {
		return (
			<BlockStack gap="200">
				<p className="text-sm text-fg-muted">
					Aucune connexion active. Configurez des connexions dans{" "}
					<a href="/settings/connections" className="text-brand underline">
						Paramètres &gt; Connexions
					</a>
					.
				</p>
			</BlockStack>
		)
	}

	const linkedIds = new Set(agentConns.map((c) => c._id))

	const handleToggle = async (connectionId: Id<"connections">, checked: boolean) => {
		try {
			if (checked) {
				await linkMut({ agentId, connectionId })
			} else {
				await unlinkMut({ agentId, connectionId })
			}
			toast.success(checked ? "Connexion activée" : "Connexion désactivée")
		} catch {
			toast.error("Erreur")
		}
	}

	return (
		<BlockStack gap="200">
			<p className="text-sm text-fg-muted">Activez les connexions que cet agent peut utiliser. Les outils associés seront automatiquement disponibles.</p>
			<BlockStack gap="none">
				{activeConnections.map((conn) => {
					const isLinked = linkedIds.has(conn._id)
					const provider = providerMap[conn.provider]
					if (!provider) return null
					const Icon = provider.icon

					return (
						<Item key={conn._id}>
							<ItemContent>
								<InlineStack gap="200" blockAlign="center">
									<Icon className="size-4 text-fg-muted" />
									<ItemTitle>{conn.label}</ItemTitle>
								</InlineStack>
								{isLinked && (
									<ItemDescription>
										<InlineStack gap="100" wrap>
											{provider.tools.map((t) => (
												<Badge key={t} variant="outline" className="text-xs">
													{t}
												</Badge>
											))}
										</InlineStack>
									</ItemDescription>
								)}
							</ItemContent>
							<ItemActions>
								<Switch checked={isLinked} onCheckedChange={(checked) => handleToggle(conn._id, checked)} />
							</ItemActions>
						</Item>
					)
				})}
			</BlockStack>
		</BlockStack>
	)
}

// ── General tab ──

function GeneralTab({
	agent,
	save,
	handleBlur,
	handleBudgetBlur,
}: {
	agent: Agent
	save: (fields: Record<string, unknown>) => Promise<void>
	handleBlur: (field: string, value: string) => void
	handleBudgetBlur: (budgetField: "maxPerMission" | "maxPerDay" | "maxPerMonth", value: string) => void
}) {
	const usagePercent = agent.budget.maxPerMonth > 0 ? Math.min(100, Math.round((agent.usage.monthUsd / agent.budget.maxPerMonth) * 100)) : 0

	const isEnabled = agent.status !== "disabled"

	return (
		<BlockStack gap="none">
			<Item>
				<ItemContent>
					<ItemTitle>Nom</ItemTitle>
					<ItemDescription>Nom affiché de l&apos;agent.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Input className="w-48" defaultValue={agent.name} onBlur={(e) => handleBlur("name", e.target.value)} />
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Rôle</ItemTitle>
					<ItemDescription>Description du rôle de l&apos;agent.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Input className="w-48" defaultValue={agent.role} onBlur={(e) => handleBlur("role", e.target.value)} />
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Modèle</ItemTitle>
					<ItemDescription>Modèle LLM utilisé par l&apos;agent.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Select value={agent.model} onValueChange={(value) => save({ model: value })} items={MODEL_OPTIONS}>
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
					<Input className="w-48" type="number" step="0.01" min="0" defaultValue={agent.budget.maxPerMission} onBlur={(e) => handleBudgetBlur("maxPerMission", e.target.value)} />
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Budget par jour</ItemTitle>
					<ItemDescription>Dépense max quotidienne (en $).</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Input className="w-48" type="number" step="0.01" min="0" defaultValue={agent.budget.maxPerDay} onBlur={(e) => handleBudgetBlur("maxPerDay", e.target.value)} />
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Budget par mois</ItemTitle>
					<ItemDescription>Dépense max mensuelle (en $).</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Input className="w-48" type="number" step="0.01" min="0" defaultValue={agent.budget.maxPerMonth} onBlur={(e) => handleBudgetBlur("maxPerMonth", e.target.value)} />
				</ItemActions>
			</Item>

			<Item>
				<ItemContent>
					<ItemTitle>Activé</ItemTitle>
					<ItemDescription>Désactiver l&apos;agent l&apos;empêche d&apos;exécuter des missions.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Switch checked={isEnabled} onCheckedChange={(checked) => save({ status: checked ? "idle" : "disabled" })} />
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

// ── Detail page ──

export function AgentDetailClient({ slug }: { slug: string }) {
	const agent = useQuery(api.agents.getBySlug, { slug })
	const update = useMutation(api.agents.update)

	const save = useCallback(
		async (fields: Record<string, unknown>) => {
			if (!agent) return
			try {
				await update({
					id: agent._id,
					...fields,
				} as Parameters<typeof update>[0])
				toast.success("Agent mis à jour")
			} catch {
				toast.error("Erreur lors de la mise à jour")
			}
		},
		[update, agent]
	)

	const handleBlur = useCallback(
		(field: string, value: string) => {
			if (!agent) return
			if (field === "name" && value !== agent.name) {
				save({ name: value })
			} else if (field === "role" && value !== agent.role) {
				save({ role: value })
			}
		},
		[save, agent]
	)

	const handleBudgetBlur = useCallback(
		(budgetField: "maxPerMission" | "maxPerDay" | "maxPerMonth", value: string) => {
			if (!agent) return
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
		[save, agent]
	)

	// Loading
	if (agent === undefined) {
		return (
			<SettingsPage>
				<SettingsHeader title="Agent" description="Chargement..." />
				<BlockStack gap="sm">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-[300px] w-full" />
				</BlockStack>
			</SettingsPage>
		)
	}

	// Not found
	if (agent === null) {
		return (
			<SettingsPage>
				<SettingsHeader title="Agent introuvable" description="Cet agent n'existe pas." />
			</SettingsPage>
		)
	}

	const typedAgent = agent as Agent

	return (
		<SettingsPage>
			<SettingsHeader title={`${agent.name} — ${agent.role}`} description={`Modèle: ${agent.model} · Budget: $${agent.budget.maxPerMonth}/mois`} />

			<InlineStack gap="300" blockAlign="center" className="mb-4">
				<AgentAvatar name={agent.name} size={48} />
				<BlockStack gap="050">
					<span className="text-lg font-semibold">{agent.name}</span>
					<span className="text-sm text-fg-muted">{agent.role}</span>
				</BlockStack>
			</InlineStack>

			<Tabs defaultValue="general">
				<TabsList variant="line">
					<TabsTrigger value="general">Général</TabsTrigger>
					<TabsTrigger value="soul">Personnalité</TabsTrigger>
					<TabsTrigger value="style">Style</TabsTrigger>
					<TabsTrigger value="skill">Compétences</TabsTrigger>
					<TabsTrigger value="context">Contexte</TabsTrigger>
					<TabsTrigger value="memory">Mémoire</TabsTrigger>
					<TabsTrigger value="connections">Connexions</TabsTrigger>
				</TabsList>

				<TabsContent value="general">
					<GeneralTab agent={typedAgent} save={save} handleBlur={handleBlur} handleBudgetBlur={handleBudgetBlur} />
				</TabsContent>

				<TabsContent value="soul">
					<SoulEditorTab slug={slug} file="soul" />
				</TabsContent>

				<TabsContent value="style">
					<SoulEditorTab slug={slug} file="style" />
				</TabsContent>

				<TabsContent value="skill">
					<SoulEditorTab slug={slug} file="skill" />
				</TabsContent>

				<TabsContent value="context">
					<SoulEditorTab slug={slug} file="context" />
				</TabsContent>

				<TabsContent value="memory">
					<MemoryTab agentId={typedAgent._id} />
				</TabsContent>

				<TabsContent value="connections">
					<ConnectionsTab agentId={typedAgent._id} />
				</TabsContent>
			</Tabs>
		</SettingsPage>
	)
}
