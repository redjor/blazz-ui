"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { PriorityIcon, ProjectBadge } from "@/components/edit-todo-dialog"
import { CategoryBadge } from "@/components/manage-categories-sheet"
import { formatDueDate, StatusIcon } from "@/components/todos-preset"
import type { Doc } from "@/convex/_generated/dataModel"

type TodoCategory = { _id: string; name: string; color?: string; icon?: string }

interface TodoCardProps {
	todo: Doc<"todos">
	projects: Doc<"projects">[]
	categories: TodoCategory[]
	/** If true, clicking navigates to detail page (default: true) */
	clickable?: boolean
}

export function TodoCard({ todo, projects, categories, clickable = true }: TodoCardProps) {
	const router = useRouter()
	const cat = categories.find((c) => c._id === todo.categoryId)
	const tags = todo.tags ?? []

	const handleClick = clickable ? () => router.push(`/todos/${todo._id}`) : undefined
	const handleKeyDown = clickable
		? (e: React.KeyboardEvent) => e.key === "Enter" && router.push(`/todos/${todo._id}`)
		: undefined

	return (
		<div
			className={`p-3 rounded-md border border-edge-subtle bg-background shadow-card transition-colors ${clickable ? "cursor-pointer hover:border-accent/50" : ""} ${todo.status === "done" ? "opacity-60" : ""}`}
			onClick={handleClick}
			role={clickable ? "button" : undefined}
			tabIndex={clickable ? 0 : undefined}
			onKeyDown={handleKeyDown}
		>
			<BlockStack gap="200">
				<InlineStack gap="150" blockAlign="center">
					<StatusIcon status={todo.status} className="size-4 shrink-0" />
					<p className="text-sm text-fg leading-snug">{todo.text}</p>
				</InlineStack>
				<InlineStack gap="150" wrap>
					<PriorityIcon priority={todo.priority} />
					{todo.dueDate &&
						todo.status !== "done" &&
						(() => {
							const { label, className } = formatDueDate(todo.dueDate)
							return (
								<span className={`inline-flex items-center gap-1 text-xs ${className}`}>
									<Calendar className="size-3" />
									{label}
								</span>
							)
						})()}
					<ProjectBadge projectId={todo.projectId} projects={projects} />
					{cat && <CategoryBadge name={cat.name} color={cat.color} icon={cat.icon} />}
				</InlineStack>
				{tags.length > 0 && (
					<InlineStack gap="100" wrap>
						{tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="text-xs text-fg-muted bg-card border border-edge rounded-full px-1.5 py-0"
							>
								{tag}
							</span>
						))}
						{tags.length > 3 && <span className="text-xs text-fg-muted">+{tags.length - 3}</span>}
					</InlineStack>
				)}
			</BlockStack>
		</div>
	)
}
