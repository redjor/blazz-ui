"use client"

import { AlertCircle, CheckCircle2, Circle, Clock } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { Badge } from "../../../ui/badge"

export type TaskPriority = "low" | "medium" | "high" | "urgent"
export type TaskStatus = "todo" | "in-progress" | "done" | "blocked"

export interface TaskCardProps {
	title: string
	description?: string
	assignee?: { name: string; avatar?: string }
	dueDate?: string
	priority?: TaskPriority
	status?: TaskStatus
	subtasks?: { done: number; total: number }
	href?: string
	actions?: ReactNode
	className?: string
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)
}

const priorityConfig = {
	low: { label: "Low", variant: "default" as const },
	medium: { label: "Medium", variant: "info" as const },
	high: { label: "High", variant: "warning" as const },
	urgent: { label: "Urgent", variant: "critical" as const },
} as const

const statusConfig = {
	todo: { label: "To do", icon: Circle, color: "text-fg-muted" },
	"in-progress": { label: "In progress", icon: Clock, color: "text-blue-500" },
	done: { label: "Done", icon: CheckCircle2, color: "text-emerald-500" },
	blocked: { label: "Blocked", icon: AlertCircle, color: "text-red-500" },
} as const

function TaskCardBase({
	title,
	description,
	assignee,
	dueDate,
	priority,
	status = "todo",
	subtasks,
	href,
	actions,
	className,
}: TaskCardProps) {
	const sConfig = statusConfig[status]
	const StatusIcon = sConfig.icon
	const Wrapper = href ? Link : "div"
	const wrapperProps = href ? { href } : {}

	return (
		<Wrapper
			{...(wrapperProps as Record<string, string>)}
			className={cn(
				"block rounded-lg border border-container bg-surface p-4",
				href && "transition-colors hover:bg-surface-3 cursor-pointer",
				className
			)}
		>
			<div className="flex items-start gap-2.5">
				<StatusIcon className={cn("size-4 mt-0.5 shrink-0", sConfig.color)} />
				<div className="min-w-0 flex-1">
					<span className="text-sm font-semibold text-fg">{title}</span>
					{description && (
						<p className="mt-0.5 text-xs text-fg-muted line-clamp-2">{description}</p>
					)}
				</div>
			</div>

			<div className="mt-3 flex flex-wrap items-center gap-2">
				{priority && (
					<Badge variant={priorityConfig[priority].variant} size="xs" fill="subtle">
						{priorityConfig[priority].label}
					</Badge>
				)}
				{dueDate && (
					<span className="inline-flex items-center gap-1 text-xs text-fg-muted">
						<Clock className="size-3" />
						{dueDate}
					</span>
				)}
				{subtasks && (
					<span className="text-xs text-fg-muted">
						{subtasks.done}/{subtasks.total} subtasks
					</span>
				)}
				{assignee && (
					<div className="ml-auto flex items-center gap-1.5">
						<Avatar size="xs">
							{assignee.avatar && <AvatarImage src={assignee.avatar} alt={assignee.name} />}
							<AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
						</Avatar>
						<span className="text-xs text-fg-muted">{assignee.name}</span>
					</div>
				)}
			</div>

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</Wrapper>
	)
}

export const TaskCard = withProGuard(TaskCardBase, "TaskCard")
