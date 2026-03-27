"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@blazz/pro/components/ai/chat/conversation"
import { Message, MessageContent, MessageResponse } from "@blazz/pro/components/ai/chat/message"
import {
	PromptInput,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@blazz/pro/components/ai/chat/prompt-input"
import { Suggestions, Suggestion } from "@blazz/pro/components/ai/chat/suggestion"
import {
	ChainOfThought,
	ChainOfThoughtHeader,
	ChainOfThoughtContent,
	ChainOfThoughtStep,
} from "@blazz/pro/components/ai/reasoning/chain-of-thought"
import { TaskCard } from "@blazz/pro/components/ai/generative/workflow/task-card"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { RotateCcw } from "lucide-react"
import { useCallback, useMemo } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"

const suggestionsMap: Record<string, string[]> = {
	cfo: [
		"Quel est mon solde Qonto ?",
		"Projette ma trésorerie sur 3 mois",
		"Audite mes dépenses du mois",
	],
	timekeeper: [
		"Vérifie ma semaine",
		"Résume mes heures par projet ce mois",
		"Y a-t-il des anomalies ?",
	],
	"product-lead": [
		"Quelles sont les issues ouvertes ?",
		"Propose les priorités du sprint",
		"Audite l'état du repo",
	],
	assistant: [
		"Prépare mon daily brief",
		"Trie mes nouveaux todos",
		"Quels todos sont en retard ?",
	],
	"account-manager": [
		"Résume la situation par client",
		"Des projets qui finissent bientôt ?",
		"Factures impayées ?",
	],
}

const TOOL_LABELS: Record<string, string> = {
	"create-todo": "Création de todo",
	"create-note": "Création de note",
	"create-mission": "Création de mission",
	"list-todos": "Lecture des todos",
	"list-projects": "Lecture des projets",
	"list-clients": "Lecture des clients",
	"list-time-entries": "Lecture du temps",
	"list-invoices": "Lecture des factures",
	"list-categories": "Lecture des catégories",
	"list-recurring-expenses": "Dépenses récurrentes",
	"qonto-balance": "Solde Qonto",
	"qonto-transactions": "Transactions Qonto",
	"treasury-forecast": "Prévision trésorerie",
	"check-time-anomalies": "Anomalies de temps",
	"get-project": "Détail projet",
	"get-client": "Détail client",
	"get-todo": "Détail todo",
}

function extractToolName(part: any): string {
	// part.type can be "tool-create-todo" or "dynamic-tool"
	if (part.toolName) return part.toolName
	if (typeof part.type === "string" && part.type.startsWith("tool-")) {
		return part.type.slice(5) // "tool-create-todo" → "create-todo"
	}
	return "outil"
}

function ToolCallDisplay({ part }: { part: any }) {
	const toolName = extractToolName(part)
	const label = TOOL_LABELS[toolName] ?? toolName
	const isComplete = part.state === "output-available"
	const output = isComplete ? (part.output ?? part.result) : null
	const args = part.args ?? part.input

	// Render a TaskCard for create-todo tool results
	if (isComplete && toolName === "create-todo") {
		const title = args?.text ?? (typeof output === "string" ? output : output?.text ?? "Todo créé")
		const priority = args?.priority ?? "normal"
		return <TaskCard title={title} status="todo" priority={priority} className="my-2" />
	}

	// Render a note card for create-note
	if (isComplete && toolName === "create-note") {
		const title = args?.title ?? (typeof output === "string" ? output : output?.title ?? "Note créée")
		return (
			<Box className="my-2 rounded-lg border border-edge bg-card p-3">
				<BlockStack gap="050">
					<span className="text-xs text-fg-muted">📝 Note créée</span>
					<span className="text-sm font-medium text-fg">{title}</span>
				</BlockStack>
			</Box>
		)
	}

	// For read tools: show a compact chain-of-thought
	return (
		<ChainOfThought defaultOpen={false} className="my-1">
			<ChainOfThoughtHeader>
				{isComplete ? `✅ ${label}` : `⏳ ${label}...`}
			</ChainOfThoughtHeader>
			<ChainOfThoughtContent>
				<ChainOfThoughtStep
					label={label}
					status={isComplete ? "complete" : "active"}
					description={isComplete ? "Données récupérées" : "En cours..."}
				/>
				{isComplete && output && (
					<pre className="mt-2 text-xs bg-muted/50 rounded p-2 overflow-x-auto max-h-32 overflow-y-auto">
						{typeof output === "string" ? output : JSON.stringify(output, null, 2).slice(0, 500)}
					</pre>
				)}
			</ChainOfThoughtContent>
		</ChainOfThought>
	)
}

export function AgentChatClient({ slug }: { slug: string }) {
	const agent = useQuery(api.agents.getBySlug, { slug })
	const savedMessages = useQuery(
		api.chatMessages.list,
		agent ? { agentId: agent._id } : "skip",
	)
	const clearMessages = useMutation(api.chatMessages.clear)

	const transport = useMemo(
		() => new DefaultChatTransport({
			body: { agentSlug: slug },
		}),
		[slug],
	)

	// Convert saved messages to useChat format
	const initialMessages = useMemo(() => {
		if (!savedMessages || savedMessages.length === 0) return undefined
		return savedMessages.map((m) => ({
			id: m._id,
			role: m.role as "user" | "assistant",
			content: m.content,
			parts: [{ type: "text" as const, text: m.content }],
		}))
	}, [savedMessages])

	const { messages, sendMessage, status, stop, setMessages } = useChat({
		transport,
		messages: initialMessages,
		maxSteps: 5,
		onError: (err) => {
			toast.error(`Erreur agent : ${err.message}`)
		},
	})

	useAppTopBar(
		agent != null
			? [{ label: "Agents", href: "/missions" }, { label: agent.name }]
			: null
	)

	const handlePromptSubmit = useCallback(
		({ text }: { text: string; files: unknown[] }) => {
			const trimmed = text.trim()
			if (!trimmed) return
			sendMessage({ text: trimmed })
		},
		[sendMessage]
	)

	const handleSuggestion = useCallback(
		(text: string) => {
			sendMessage({ text })
		},
		[sendMessage]
	)

	const handleClear = useCallback(() => {
		setMessages([])
		if (agent) {
			clearMessages({ agentId: agent._id })
		}
	}, [setMessages, agent, clearMessages])

	const isStreaming = status === "streaming" || status === "submitted"
	const hasMessages = messages.length > 0
	const suggestions = suggestionsMap[slug] ?? []

	// Loading state
	if (agent === undefined) {
		return (
			<BlockStack gap="400" className="h-full items-center justify-center px-4">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-6 w-64" />
			</BlockStack>
		)
	}

	// Agent not found
	if (agent === null) {
		return (
			<BlockStack gap="200" className="h-full items-center justify-center px-4">
				<p className="text-lg font-medium text-fg">Agent introuvable</p>
				<p className="text-sm text-fg-subtle">
					L'agent "{slug}" n'existe pas. Lance le seed depuis Mission Control.
				</p>
			</BlockStack>
		)
	}

	const budgetPercent = agent.budget.maxPerDay > 0
		? Math.round((agent.usage.todayUsd / agent.budget.maxPerDay) * 100)
		: 0

	// Empty state
	if (!hasMessages) {
		return (
			<BlockStack className="h-full items-center justify-center px-4">
				<BlockStack gap="600" className="w-full max-w-2xl">
					<BlockStack gap="200" className="items-center text-center">
						<AgentAvatar name={agent.name} size={64} />
						<h1 className="text-3xl font-semibold text-fg tracking-tight">
							{agent.name}
						</h1>
						<p className="text-sm text-fg-subtle">{agent.role}</p>
						<InlineStack gap="200" blockAlign="center">
							<Badge variant="secondary">
								{agent.model}
							</Badge>
							<Badge variant={budgetPercent >= 80 ? "warning" : "secondary"}>
								${agent.usage.todayUsd.toFixed(2)} / ${agent.budget.maxPerDay.toFixed(2)} jour
							</Badge>
						</InlineStack>
					</BlockStack>

					<PromptInput onSubmit={handlePromptSubmit}>
						<PromptInputTextarea placeholder={`Demande quelque chose à ${agent.name}...`} />
						<PromptInputFooter>
							<Box />
							<PromptInputSubmit status="ready" />
						</PromptInputFooter>
					</PromptInput>

					{suggestions.length > 0 && (
						<Suggestions className="justify-center">
							{suggestions.map((text) => (
								<Suggestion key={text} suggestion={text} onClick={handleSuggestion} />
							))}
						</Suggestions>
					)}
				</BlockStack>
			</BlockStack>
		)
	}

	// Conversation state
	return (
		<BlockStack className="h-full">
			<InlineStack align="space-between" blockAlign="center" className="px-4 py-2 border-b border-edge">
				<InlineStack gap="200" blockAlign="center">
					<AgentAvatar name={agent.name} size={28} />
					<span className="text-sm font-medium text-fg">{agent.name}</span>
					<Badge variant="secondary" className="text-xs">
						{agent.role}
					</Badge>
				</InlineStack>
				<InlineStack gap="200" blockAlign="center">
					<Badge variant={budgetPercent >= 80 ? "warning" : "secondary"} className="text-xs">
						${agent.usage.todayUsd.toFixed(2)} / ${agent.budget.maxPerDay.toFixed(2)}
					</Badge>
					<Button variant="outline" size="sm" onClick={handleClear}>
						<RotateCcw className="size-3.5" />
						Effacer
					</Button>
				</InlineStack>
			</InlineStack>

			<Conversation className="flex-1 min-h-0">
				<ConversationContent className="max-w-3xl mx-auto px-4">
					{messages.map((message) => (
						<Message key={message.id} from={message.role as "user" | "assistant"}>
							<MessageContent>
								{message.parts.map((part, i) => {
									if (part.type === "text" && part.text) {
										return <MessageResponse key={`text-${i}`}>{part.text}</MessageResponse>
									}
									if ("toolCallId" in part && "state" in part) {
										return <ToolCallDisplay key={(part as any).toolCallId} part={part} />
									}
									return null
								})}
							</MessageContent>
						</Message>
					))}
					{status === "submitted" && (
						<Message from="assistant">
							<MessageContent>
								<span className="text-sm text-fg-muted animate-pulse">
									{agent.name} réfléchit...
								</span>
							</MessageContent>
						</Message>
					)}
				</ConversationContent>
				<ConversationScrollButton />
			</Conversation>

			<Box className="border-t border-edge bg-card px-4 py-3">
				<Box className="max-w-3xl mx-auto">
					<PromptInput onSubmit={handlePromptSubmit}>
						<PromptInputTextarea
							placeholder={`Demande quelque chose à ${agent.name}...`}
							disabled={isStreaming}
						/>
						<PromptInputFooter>
							<Box />
							<PromptInputSubmit status={isStreaming ? "streaming" : "ready"} onStop={stop} />
						</PromptInputFooter>
					</PromptInput>
				</Box>
			</Box>
		</BlockStack>
	)
}
