"use client"

import { useChat } from "@ai-sdk/react"
import { Conversation, ConversationContent, ConversationScrollButton } from "@blazz/pro/components/ai/chat/conversation"
import { Message, MessageContent, MessageResponse } from "@blazz/pro/components/ai/chat/message"
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@blazz/pro/components/ai/chat/prompt-input"
import { Shimmer } from "@blazz/pro/components/ai/chat/shimmer"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { RotateCcw } from "lucide-react"
import { useCallback } from "react"
import { toast } from "sonner"
import { ChatEntityPicker } from "@/components/chat/chat-entity-picker"
import { ChatSuggestions } from "@/components/chat/chat-suggestions"
import { ChatTodoCard, ChatTodoList } from "@/components/chat/chat-todo-card"
import { ChatToolHandler } from "@/components/chat/chat-tool-handler"

export default function ChatPageClient() {
	const { messages, sendMessage, status, stop, setMessages, addToolResult } = useChat({
		api: "/api/chat",
		onError: (err) => {
			toast.error(`Erreur chat : ${err.message}`)
		},
	})

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

	// Extract last assistant text for entity picker
	const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant")
	const lastAssistantText =
		status === "ready" && lastAssistantMessage
			? lastAssistantMessage.parts
					.filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text" && !!("text" in p && p.text))
					.map((p) => p.text)
					.join(" ")
			: ""

	// Empty state: Gemini-style centered layout
	if (!hasMessages) {
		return (
			<BlockStack className="h-full items-center justify-center px-4">
				<BlockStack gap="600" className="w-full max-w-2xl">
					<BlockStack gap="200" className="text-center">
						<h1 className="text-3xl font-semibold text-fg tracking-tight">Comment puis-je t&apos;aider ?</h1>
						<p className="text-sm text-fg-subtle">Je peux gérer tes todos, clients, projets et temps.</p>
					</BlockStack>

					<PromptInput onSubmit={handlePromptSubmit}>
						<PromptInputTextarea placeholder="Demande-moi quelque chose..." />
						<PromptInputFooter>
							<div />
							<PromptInputSubmit status="ready" />
						</PromptInputFooter>
					</PromptInput>

					<ChatSuggestions onSelect={handleSuggestion} />
				</BlockStack>
			</BlockStack>
		)
	}

	// Conversation state: messages + input pinned at bottom
	return (
		<BlockStack className="h-full">
			<InlineStack align="end" blockAlign="center" className="px-4 py-2 border-b border-edge">
				<Button variant="outline" size="sm" onClick={handleClear}>
					<RotateCcw className="size-3.5" />
					Effacer
				</Button>
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
										const toolName = part.type.replace("tool-", "")

										// Write tools needing client-side execution
										if (part.state === "input-available") {
											return <ChatToolHandler key={part.toolCallId} toolName={toolName} args={(part as any).input ?? {}} toolCallId={part.toolCallId} addToolResult={addToolResult} />
										}

										// Read tools with server-side results — render rich cards
										if (part.state === "output-available") {
											const output = (part as any).output
											if (toolName === "get-todo" && output?.id) {
												return <ChatTodoCard key={part.toolCallId} todoId={output.id} />
											}
											if (toolName === "list-todos" && Array.isArray(output)) {
												return <ChatTodoList key={part.toolCallId} todos={output} />
											}
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
									Réflexion en cours…
								</Shimmer>
							</MessageContent>
						</Message>
					)}
					{lastAssistantText && <ChatEntityPicker lastAssistantText={lastAssistantText} onSelect={handleSuggestion} />}
				</ConversationContent>
				<ConversationScrollButton />
			</Conversation>

			<div className="border-t border-edge bg-card px-4 py-3">
				<div className="max-w-3xl mx-auto">
					<PromptInput onSubmit={handlePromptSubmit}>
						<PromptInputTextarea placeholder="Demande-moi quelque chose..." disabled={isStreaming} />
						<PromptInputFooter>
							<div />
							<PromptInputSubmit status={isStreaming ? "streaming" : "ready"} onStop={stop} />
						</PromptInputFooter>
					</PromptInput>
				</div>
			</div>
		</BlockStack>
	)
}
