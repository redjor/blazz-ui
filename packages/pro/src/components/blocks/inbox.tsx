"use client"

import type { LucideIcon } from "lucide-react"
import {
	AtSign,
	Filter,
	Inbox as InboxIcon,
	MessageSquareQuote,
	MoreHorizontal,
	Reply,
	SmilePlus,
	UserPlus,
	X,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@blazz/ui"
import { ErrorState } from "@blazz/ui"
import { Button } from "@blazz/ui"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@blazz/ui"
import { Empty } from "@blazz/ui"
import { Skeleton } from "@blazz/ui"
import { Card, CardContent, CardFooter } from "@blazz/ui/components/ui/card"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Divider } from "@blazz/ui/components/ui/divider"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InboxActionType = "comment" | "reply" | "reaction" | "mention" | "added"

export type InboxStatusVariant = "urgent" | "done" | "in-progress" | "cancelled" | "default"

export type InboxPriority = "urgent" | "high" | "medium" | "low" | "none"

export interface InboxAuthor {
	name: string
	initials: string
	color?: string
	avatarUrl?: string
}

export interface InboxNotification {
	id: string
	title: string
	description: string
	author: InboxAuthor
	actionType: InboxActionType
	status?: InboxStatusVariant
	priority?: InboxPriority
	time: string
	read?: boolean
}

export interface InboxMenuAction {
	label: string
	onClick: () => void
	variant?: "default" | "destructive"
}

export type InboxReadFilter = "all" | "unread" | "read"

export interface InboxFilters {
	read?: InboxReadFilter
	actionTypes?: InboxActionType[]
	statuses?: InboxStatusVariant[]
	priorities?: InboxPriority[]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const actionTypeIcons: Record<InboxActionType, LucideIcon> = {
	comment: MessageSquareQuote,
	reply: Reply,
	reaction: SmilePlus,
	mention: AtSign,
	added: UserPlus,
}

const statusDotClasses: Record<InboxStatusVariant, string> = {
	urgent: "bg-red-500",
	done: "bg-emerald-500",
	"in-progress": "text-fg-muted",
	cancelled: "bg-red-500",
	default: "bg-fg-muted/40",
}

// ---------------------------------------------------------------------------
// InboxStatusDot
// ---------------------------------------------------------------------------

function InboxStatusDot({ status }: { status: InboxStatusVariant }) {
	if (status === "in-progress") {
		return (
			<svg className="size-3.5 shrink-0 text-fg-muted" viewBox="0 0 16 16" fill="none">
				<circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
				<path
					d="M8 1.5A6.5 6.5 0 0 1 14.5 8"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		)
	}

	return <span className={cn("size-2.5 shrink-0 rounded-full", statusDotClasses[status])} />
}

// ---------------------------------------------------------------------------
// InboxAvatar
// ---------------------------------------------------------------------------

function InboxAvatar({ author, actionType }: { author: InboxAuthor; actionType: InboxActionType }) {
	const ActionIcon = actionTypeIcons[actionType]

	return (
		<div className="relative shrink-0">
			{/* Avatar circle */}
			{author.avatarUrl ? (
				<img
					src={author.avatarUrl}
					alt={author.name}
					className="size-7 rounded-full object-cover"
				/>
			) : (
				<div
					className="flex size-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
					style={{ backgroundColor: author.color ?? "#6b7280" }}
				>
					{author.initials}
				</div>
			)}

			{/* Action type badge */}
			<div className="absolute -bottom-0.5 -left-0.5 flex size-3.5 items-center justify-center rounded-full bg-surface ring-2 ring-surface">
				<ActionIcon className="size-2.5 text-fg-muted" />
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// InboxPriorityBadge
// ---------------------------------------------------------------------------

function InboxPriorityBadge({ priority }: { priority: InboxPriority }) {
	if (priority === "none" || priority === "low" || priority === "medium") {
		return null
	}

	return (
		<span
			className={cn(
				"inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold",
				priority === "urgent" && "bg-orange-500/15 text-orange-500",
				priority === "high" && "bg-orange-500/15 text-orange-500"
			)}
		>
			!
		</span>
	)
}

// ---------------------------------------------------------------------------
// InboxSkeleton
// ---------------------------------------------------------------------------

function InboxSkeleton() {
	return (
		<div className="flex gap-3 px-3 py-2.5">
			<Skeleton className="size-7 shrink-0 rounded-full" />
			<div className="flex-1 space-y-1.5">
				<div className="flex items-center gap-2">
					<Skeleton className="h-3.5 w-44" />
					<Skeleton className="ml-auto h-3 w-8" />
				</div>
				<Skeleton className="h-3 w-56" />
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// InboxItem
// ---------------------------------------------------------------------------

export interface InboxItemProps {
	item: InboxNotification
	selected?: boolean
	onClick?: (item: InboxNotification) => void
	className?: string
}

export function InboxItem({ item, selected = false, onClick, className }: InboxItemProps) {
	const isUnread = !item.read

	return (
		<div
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			onClick={() => onClick?.(item)}
			onKeyDown={(e) => {
				if (onClick && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault()
					onClick(item)
				}
			}}
			className={cn(
				"group relative flex items-start gap-3 px-3 py-2.5 transition-colors",
				onClick && "cursor-pointer",
				selected
				? "bg-white/[0.04]"
				: isUnread
					? "bg-white/[0.02] hover:bg-white/[0.04]"
					: "hover:bg-white/[0.02]",
				className
			)}
		>
			{/* Avatar + action icon */}
			<InboxAvatar author={item.author} actionType={item.actionType} />

			{/* Content */}
			<div className="min-w-0 flex-1">
				{/* Title row */}
				<div className="flex items-center gap-1.5">
					<span
						className={cn(
							"truncate text-[13px]",
							isUnread ? "font-medium text-fg" : "text-fg-muted"
						)}
					>
						{item.title}
					</span>
					{item.status && item.status !== "default" && <InboxStatusDot status={item.status} />}
				</div>

				{/* Description row */}
				<div className="flex items-center gap-1.5">
					<span className="truncate text-xs text-fg-muted">{item.description}</span>
					{item.priority &&
						item.priority !== "none" &&
						item.priority !== "low" &&
						item.priority !== "medium" && <InboxPriorityBadge priority={item.priority} />}
					<span className="ml-auto shrink-0 text-[11px] text-fg-muted/60 tabular-nums">
						{item.time}
					</span>
				</div>
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// InboxList
// ---------------------------------------------------------------------------

export interface InboxListProps {
	children: React.ReactNode
	className?: string
}

export function InboxList({ children, className }: InboxListProps) {
	return <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>
}

// ---------------------------------------------------------------------------
// Filter helpers
// ---------------------------------------------------------------------------

const readFilterLabels: Record<InboxReadFilter, string> = {
	all: "All",
	unread: "Unread",
	read: "Read",
}

const actionTypeLabels: Record<InboxActionType, string> = {
	comment: "Comments",
	reply: "Replies",
	reaction: "Reactions",
	mention: "Mentions",
	added: "Added",
}

const statusLabels: Record<InboxStatusVariant, string> = {
	urgent: "Urgent",
	done: "Done",
	"in-progress": "In progress",
	cancelled: "Cancelled",
	default: "Default",
}

const _priorityLabels: Record<InboxPriority, string> = {
	urgent: "Urgent",
	high: "High",
	medium: "Medium",
	low: "Low",
	none: "None",
}

function isFiltersEmpty(filters: InboxFilters): boolean {
	return (
		(!filters.read || filters.read === "all") &&
		(!filters.actionTypes || filters.actionTypes.length === 0) &&
		(!filters.statuses || filters.statuses.length === 0) &&
		(!filters.priorities || filters.priorities.length === 0)
	)
}

export function filterInboxItems(
	items: InboxNotification[],
	filters: InboxFilters
): InboxNotification[] {
	return items.filter((item) => {
		if (filters.read === "unread" && item.read) return false
		if (filters.read === "read" && !item.read) return false
		if (
			filters.actionTypes &&
			filters.actionTypes.length > 0 &&
			!filters.actionTypes.includes(item.actionType)
		)
			return false
		if (
			filters.statuses &&
			filters.statuses.length > 0 &&
			(!item.status || !filters.statuses.includes(item.status))
		)
			return false
		if (
			filters.priorities &&
			filters.priorities.length > 0 &&
			(!item.priority || !filters.priorities.includes(item.priority))
		)
			return false
		return true
	})
}

// ---------------------------------------------------------------------------
// InboxFilterChip (internal)
// ---------------------------------------------------------------------------

function InboxFilterChip({
	label,
	active,
	onClick,
}: {
	label: string
	active: boolean
	onClick: () => void
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer",
				active ? "bg-brand/15 text-brand" : "bg-fg/5 text-fg-muted hover:bg-fg/10"
			)}
		>
			{label}
		</button>
	)
}

// ---------------------------------------------------------------------------
// InboxFilterBar (internal)
// ---------------------------------------------------------------------------

function InboxFilterBar({
	filters,
	onFiltersChange,
}: {
	filters: InboxFilters
	onFiltersChange: (filters: InboxFilters) => void
}) {
	const toggleActionType = (type: InboxActionType) => {
		const current = filters.actionTypes ?? []
		const next = current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
		onFiltersChange({ ...filters, actionTypes: next.length > 0 ? next : undefined })
	}

	const toggleStatus = (status: InboxStatusVariant) => {
		const current = filters.statuses ?? []
		const next = current.includes(status)
			? current.filter((s) => s !== status)
			: [...current, status]
		onFiltersChange({ ...filters, statuses: next.length > 0 ? next : undefined })
	}

	const cycleReadFilter = () => {
		const order: InboxReadFilter[] = ["all", "unread", "read"]
		const idx = order.indexOf(filters.read ?? "all")
		const next = order[(idx + 1) % order.length]
		onFiltersChange({ ...filters, read: next })
	}

	return (
		<div className="flex flex-col gap-1.5 border-b border-edge px-3 pb-2">
			{/* Read filter */}
			<div className="flex items-center gap-1 flex-wrap">
				<InboxFilterChip
					label={readFilterLabels[filters.read ?? "all"]}
					active={!!filters.read && filters.read !== "all"}
					onClick={cycleReadFilter}
				/>
				<span className="mx-0.5 h-3 w-px bg-edge" />
				{(Object.keys(actionTypeLabels) as InboxActionType[]).map((type) => (
					<InboxFilterChip
						key={type}
						label={actionTypeLabels[type]}
						active={filters.actionTypes?.includes(type) ?? false}
						onClick={() => toggleActionType(type)}
					/>
				))}
			</div>
			{/* Status filter */}
			<div className="flex items-center gap-1 flex-wrap">
				{(["urgent", "in-progress", "done", "cancelled"] as InboxStatusVariant[]).map((status) => (
					<InboxFilterChip
						key={status}
						label={statusLabels[status]}
						active={filters.statuses?.includes(status) ?? false}
						onClick={() => toggleStatus(status)}
					/>
				))}
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// InboxHeader
// ---------------------------------------------------------------------------

export interface InboxHeaderProps {
	title?: string
	menuActions?: InboxMenuAction[]
	filters?: InboxFilters
	onFiltersChange?: (filters: InboxFilters) => void
	className?: string
}

export function InboxHeader({
	title = "Inbox",
	menuActions,
	filters,
	onFiltersChange,
	className,
}: InboxHeaderProps) {
	const [showFilters, setShowFilters] = useState(false)
	const hasActiveFilters = filters ? !isFiltersEmpty(filters) : false

	return (
		<div className={cn("flex flex-col", className)}>
			{/* Top bar */}
			<div className="flex items-center gap-1 px-3 py-2">
				<h2 className="text-sm font-semibold text-fg">{title}</h2>

				{menuActions && menuActions.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button variant="ghost" size="icon-xs" className="text-fg-muted">
									<MoreHorizontal className="size-3.5" />
								</Button>
							}
						/>
						<DropdownMenuContent align="start" sideOffset={4}>
							{menuActions.map((action) => (
								<DropdownMenuItem
									key={action.label}
									onClick={action.onClick}
									className={action.variant === "destructive" ? "text-negative" : undefined}
								>
									{action.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				<div className="ml-auto flex items-center gap-0.5">
					{onFiltersChange && (
						<Button
							variant="ghost"
							size="icon-xs"
							onClick={() => {
								if (showFilters && hasActiveFilters) {
									onFiltersChange({})
								}
								setShowFilters(!showFilters)
							}}
							className={cn("text-fg-muted", hasActiveFilters && "text-brand")}
						>
							{showFilters && hasActiveFilters ? (
								<X className="size-3.5" />
							) : (
								<Filter className="size-3.5" />
							)}
						</Button>
					)}
				</div>
			</div>

			{/* Filter bar */}
			{showFilters && onFiltersChange && filters && (
				<InboxFilterBar filters={filters} onFiltersChange={onFiltersChange} />
			)}
		</div>
	)
}

// ---------------------------------------------------------------------------
// InboxPanel (main container)
// ---------------------------------------------------------------------------

export interface InboxPanelProps {
	children?: React.ReactNode
	loading?: boolean
	error?: boolean
	onRetry?: () => void
	className?: string
}

export function InboxPanel({
	children,
	loading = false,
	error = false,
	onRetry,
	className,
}: InboxPanelProps) {
	const hasChildren = children !== undefined && children !== null && children !== false

	return (
		<div className={cn("flex h-full flex-col", className)}>
			{loading ? (
				<div className="flex-1">
					{Array.from({ length: 8 }).map((_, i) => (
						<InboxSkeleton key={i} />
					))}
				</div>
			) : error ? (
				<ErrorState onRetry={onRetry} className="flex-1" />
			) : hasChildren ? (
				children
			) : (
				<Empty
					icon={InboxIcon}
					title="No notifications"
					description="You're all caught up."
					className="flex-1"
					size="sm"
				/>
			)}
		</div>
	)
}

// ---------------------------------------------------------------------------
// InboxDetailEmpty (right panel empty state)
// ---------------------------------------------------------------------------

export interface InboxDetailEmptyProps {
	title?: string
	className?: string
}

export function InboxDetailEmpty({
	title = "Select a notification",
	className,
}: InboxDetailEmptyProps) {
	return (
		<div className={cn("flex flex-1 flex-col items-center justify-center gap-3", className)}>
			<svg
				className="size-20 text-fg-muted/20"
				viewBox="0 0 80 80"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			>
				{/* Tray / inbox icon */}
				<path
					d="M16 32L8 52V64C8 66.2 9.8 68 12 68H68C70.2 68 72 66.2 72 64V52L64 32"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path d="M8 52H28L32 58H48L52 52H72" strokeLinecap="round" strokeLinejoin="round" />
				<path
					d="M20 32V16C20 13.8 21.8 12 24 12H56C58.2 12 60 13.8 60 16V32"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<span className="text-sm text-fg-muted">{title}</span>
		</div>
	)
}

// ---------------------------------------------------------------------------
// InboxDetailCard (styled notification detail card)
// ---------------------------------------------------------------------------

export interface InboxDetailCardSource {
	name: string
	logo?: string
	initials?: string
}

export interface InboxDetailCardAuthor {
	name: string
	avatar?: string
	initials?: string
	color?: string
	label?: string
}

export interface InboxDetailCardProps {
	title: string
	description?: string
	source?: InboxDetailCardSource
	time?: string
	author?: InboxDetailCardAuthor
	actions?: React.ReactNode
	className?: string
}

export function InboxDetailCard({
	title,
	description,
	source,
	time,
	author,
	actions,
	className,
}: InboxDetailCardProps) {
	const showAuthor = author && source && author.name.toLowerCase() !== source.name.toLowerCase()

	return (
		<div className={cn("flex h-full items-center justify-center p-8", className)}>
			<Card
				elevated
				className="w-full max-w-[520px] animate-in fade-in slide-in-from-bottom-2 duration-200"
			>
				<CardContent>
					{/* Source strip */}
					{source && (
						<InlineStack gap="200" align="space-between" blockAlign="center">
							<InlineStack gap="200" blockAlign="center">
								{source.logo ? (
									<img src={source.logo} alt={source.name} className="size-5" />
								) : source.initials ? (
									<span className="text-[9px] font-semibold uppercase text-fg-muted">
										{source.initials}
									</span>
								) : null}
								<span className="text-xs font-medium text-fg">{source.name}</span>
							</InlineStack>
							{time && <span className="text-2xs text-fg-subtle">{time}</span>}
						</InlineStack>
					)}

					{/* Body */}
					<BlockStack gap="400" className={source ? "pt-5" : undefined}>
						<BlockStack gap="100">
							<h2 className="text-lg font-semibold tracking-tight text-fg leading-snug">
								{title}
							</h2>
							{description && (
								<p className="text-sm text-fg-muted leading-relaxed">{description}</p>
							)}
						</BlockStack>

						{/* Author — hidden when same as source */}
						{showAuthor && (
							<>
								<Divider />
								<InlineStack gap="200" blockAlign="center">
									{author.avatar ? (
										<img
											src={author.avatar}
											alt={author.name}
											className="size-7 rounded-full"
										/>
									) : (
										<div
											className="flex size-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
											style={{ backgroundColor: author.color ?? "#6b7280" }}
										>
											{author.initials}
										</div>
									)}
									<span className="text-xs font-medium text-fg">{author.name}</span>
									<span className="text-2xs text-fg-subtle">{author.label ?? "Author"}</span>
								</InlineStack>
							</>
						)}
					</BlockStack>
				</CardContent>

				{/* Actions */}
				{actions && <CardFooter className="gap-2">{actions}</CardFooter>}
			</Card>
		</div>
	)
}
