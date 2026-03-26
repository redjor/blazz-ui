"use client"

import { useChat } from "@ai-sdk/react"
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
import { Shimmer } from "@blazz/pro/components/ai/chat/shimmer"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { RotateCcw } from "lucide-react"
import { useCallback } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"

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
}

export function AgentChatClient({ slug }: { slug: string }) {
	const agent = useQuery(api.agents.getBySlug, { slug })
	const { messages, sendMessage, status, stop, setMessages } = useChat({
		api: `/api/agents/${slug}/chat`,
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
	}, [setMessages])

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
						<Box className="text-4xl">{agent.avatar}</Box>
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
						<InlineStack gap="200" align="center" wrap>
							{suggestions.map((text) => (
								<Button
									key={text}
									variant="outline"
									size="sm"
									onClick={() => handleSuggestion(text)}
								>
									{text}
								</Button>
							))}
						</InlineStack>
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
					<Box className="text-lg">{agent.avatar}</Box>
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
										if (part.state === "output-available") {
											const output = (part as any).output
											return (
												<MessageResponse key={part.toolCallId}>
													{typeof output === "string" ? output : JSON.stringify(output, null, 2)}
												</MessageResponse>
											)
										}
									}
									return null
								})}
							</MessageContent>
						</Message>
					))}
					{status === "submitted" && (
						<Message from="assistant">
							<MessageContent>
								<Shimmer className="text-sm" duration={1.5}>
									{agent.name} réfléchit...
								</Shimmer>
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
