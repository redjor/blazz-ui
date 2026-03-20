"use client"

import { Suggestion, Suggestions } from "@blazz/pro/components/ai/chat/suggestion"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type EntityType = "project" | "client" | "category" | null

const ENTITY_PATTERNS: { type: EntityType; pattern: RegExp }[] = [
	{ type: "project", pattern: /quel\s+projet|choisi[rs]?\s+(un|le)\s+projet|projet\s+.*(lequel|\?)/i },
	{ type: "client", pattern: /quel\s+client|choisi[rs]?\s+(un|le)\s+client|client\s+.*(lequel|\?)/i },
	{ type: "category", pattern: /quelle\s+cat[ée]gorie|choisi[rs]?\s+(une|la)\s+cat[ée]gorie/i },
]

function detectEntityType(text: string): EntityType {
	for (const { type, pattern } of ENTITY_PATTERNS) {
		if (pattern.test(text)) return type
	}
	// Also detect numbered lists of projects/clients in the message
	if (/\d+\.\s+.+projet/i.test(text) || (/projet/i.test(text) && /\d+\./m.test(text))) {
		return "project"
	}
	if (/\d+\.\s+.+client/i.test(text) || (/client/i.test(text) && /\d+\./m.test(text))) {
		return "client"
	}
	return null
}

interface ChatEntityPickerProps {
	lastAssistantText: string
	onSelect: (text: string) => void
}

export function ChatEntityPicker({ lastAssistantText, onSelect }: ChatEntityPickerProps) {
	const entityType = detectEntityType(lastAssistantText)

	const projects = useQuery(api.projects.listAll, entityType === "project" ? {} : "skip")
	const clients = useQuery(api.clients.list, entityType === "client" ? {} : "skip")
	const categories = useQuery(api.categories.list, entityType === "category" ? {} : "skip")

	if (!entityType) return null

	let items: { label: string; value: string }[] = []

	if (entityType === "project" && projects) {
		items = projects.map((p) => ({ label: p.name, value: p.name }))
	} else if (entityType === "client" && clients) {
		items = clients.map((c) => ({ label: c.name, value: c.name }))
	} else if (entityType === "category" && categories) {
		items = categories.map((c) => ({ label: c.name, value: c.name }))
	}

	if (items.length === 0) return null

	return (
		<BlockStack gap="100" className="py-2">
			<span className="text-xs text-fg-subtle">
				{entityType === "project" && "Projets disponibles :"}
				{entityType === "client" && "Clients disponibles :"}
				{entityType === "category" && "Catégories disponibles :"}
			</span>
			<Suggestions>
				{items.map((item) => (
					<Suggestion key={item.value} suggestion={item.value} onClick={() => onSelect(item.value)}>
						{item.label}
					</Suggestion>
				))}
			</Suggestions>
		</BlockStack>
	)
}
