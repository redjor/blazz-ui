"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { useQuery } from "convex/react"
import { TodoCard } from "@/components/todo-card"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

interface ChatTodoCardProps {
	todoId: string
}

/** Renders a real TodoCard from a todo ID returned by a read tool */
export function ChatTodoCard({ todoId }: ChatTodoCardProps) {
	const todo = useQuery(api.todos.get, { id: todoId as Id<"todos"> })
	const projects = useQuery(api.projects.listAll, {}) ?? []
	const categories = useQuery(api.categories.list, {}) ?? []

	if (!todo) return null

	return (
		<div className="py-2 max-w-sm">
			<TodoCard todo={todo} projects={projects} categories={categories} />
		</div>
	)
}

interface ChatTodoListProps {
	todos: Array<{ id: string; text: string; status: string; priority?: string }>
}

/** Renders multiple TodoCards from a list-todos tool result */
export function ChatTodoList({ todos }: ChatTodoListProps) {
	if (!todos || todos.length === 0) return null

	return (
		<BlockStack gap="200" className="py-2 max-w-sm">
			{todos.map((t) => (
				<ChatTodoCard key={t.id} todoId={t.id} />
			))}
		</BlockStack>
	)
}
