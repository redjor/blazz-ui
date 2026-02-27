"use client"

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Bell, Check, MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Empty } from "../ui/empty"
import { ErrorState } from "../patterns/error-state"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NotificationAction {
	label: string
	onClick: () => void
	variant?: "default" | "primary"
}

export interface Notification {
	id: string
	icon: LucideIcon
	iconVariant?: "info" | "success" | "warning" | "critical"
	title: string
	description?: string
	time: string
	read?: boolean
	actions?: NotificationAction[]
}

// ---------------------------------------------------------------------------
// Icon variant color map
// ---------------------------------------------------------------------------

const iconVariantClasses: Record<string, string> = {
	info: "bg-blue-500/15 text-blue-500",
	success: "bg-emerald-500/15 text-emerald-500",
	warning: "bg-amber-500/15 text-amber-400",
	critical: "bg-red-500/15 text-red-400",
}

const defaultIconClasses = "bg-fg/5 text-fg-muted"

// ---------------------------------------------------------------------------
// NotificationTrigger
// ---------------------------------------------------------------------------

export interface NotificationTriggerProps {
	unreadCount?: number
	className?: string
}

export function NotificationTrigger({
	unreadCount = 0,
	className,
}: NotificationTriggerProps) {
	const prevCountRef = useRef(unreadCount)
	const [animate, setAnimate] = useState(false)

	useEffect(() => {
		if (unreadCount > prevCountRef.current) {
			setAnimate(true)
		}
		prevCountRef.current = unreadCount
	}, [unreadCount])

	return (
		<button
			type="button"
			className={cn(
				"relative rounded-lg p-2 transition-colors hover:bg-raised",
				className,
			)}
			aria-label="Notifications"
		>
			<Bell
				className="size-4 text-fg-muted origin-top"
				style={animate ? { animation: "bell-ring 0.8s ease-in-out" } : undefined}
				onAnimationEnd={() => setAnimate(false)}
			/>
			{unreadCount > 0 && (
				<span
					className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500"
					style={animate ? { animation: "dot-pulse 0.6s ease-in-out" } : undefined}
				/>
			)}
		</button>
	)
}

// ---------------------------------------------------------------------------
// NotificationSkeleton (internal)
// ---------------------------------------------------------------------------

function NotificationSkeleton() {
	return (
		<div className="flex gap-3 px-4 py-3">
			<Skeleton className="size-8 shrink-0 rounded-lg" />
			<div className="flex-1 space-y-2">
				<div className="flex items-center gap-2">
					<Skeleton className="h-3.5 w-32" />
					<Skeleton className="ml-auto h-3 w-14" />
				</div>
				<Skeleton className="h-3 w-48" />
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// NotificationCenter
// ---------------------------------------------------------------------------

export interface NotificationCenterProps {
	children?: React.ReactNode
	loading?: boolean
	error?: boolean
	onRetry?: () => void
	onMarkAllRead?: () => void
	unreadCount?: number
	className?: string
}

export function NotificationCenter({
	children,
	loading = false,
	error = false,
	onRetry,
	onMarkAllRead,
	unreadCount = 0,
	className,
}: NotificationCenterProps) {
	const hasChildren =
		children !== undefined && children !== null && children !== false

	return (
		<div className={cn("flex h-full flex-col", className)}>
			{/* Header */}
			<div className="flex items-center justify-between border-b border-separator px-4 py-3">
				<div className="flex items-center gap-2">
					<h2 className="text-sm font-semibold text-fg">Notifications</h2>
					{unreadCount > 0 && (
						<Badge variant="default" size="xs">
							{unreadCount}
						</Badge>
					)}
				</div>
				{onMarkAllRead && unreadCount > 0 && (
					<Button
						variant="ghost"
						size="xs"
						onClick={onMarkAllRead}
						className="text-fg-muted"
					>
						<Check className="size-3" data-icon="inline-start" />
						Mark all read
					</Button>
				)}
			</div>

			{/* Body */}
			{loading ? (
				<div className="flex-1">
					{Array.from({ length: 4 }).map((_, i) => (
						<NotificationSkeleton key={i} />
					))}
				</div>
			) : error ? (
				<ErrorState onRetry={onRetry} className="flex-1" />
			) : hasChildren ? (
				children
			) : (
				<Empty
					icon={Bell}
					title="No notifications"
					description="You're all caught up. New notifications will appear here."
					className="flex-1"
					size="sm"
				/>
			)}
		</div>
	)
}

// ---------------------------------------------------------------------------
// NotificationList
// ---------------------------------------------------------------------------

export interface NotificationListProps {
	children: React.ReactNode
	className?: string
}

export function NotificationList({ children, className }: NotificationListProps) {
	return (
		<div className={cn("flex-1 overflow-y-auto", className)}>
			{children}
		</div>
	)
}

// ---------------------------------------------------------------------------
// NotificationGroup
// ---------------------------------------------------------------------------

export interface NotificationGroupProps {
	label: string
	children: React.ReactNode
	className?: string
}

export function NotificationGroup({
	label,
	children,
	className,
}: NotificationGroupProps) {
	return (
		<div className={cn("", className)}>
			<div className="flex items-center gap-2 px-4 py-2">
				<span className="text-2xs font-medium uppercase text-fg-muted">
					{label}
				</span>
				<div className="h-px flex-1 bg-edge" />
			</div>
			{children}
		</div>
	)
}

// ---------------------------------------------------------------------------
// NotificationItem
// ---------------------------------------------------------------------------

export interface NotificationItemProps {
	notification: Notification
	onClick?: (notification: Notification) => void
	className?: string
}

export function NotificationItem({
	notification,
	onClick,
	className,
}: NotificationItemProps) {
	const Icon = notification.icon
	const isUnread = !notification.read

	const primaryActions = notification.actions?.filter(
		(a) => a.variant === "primary",
	)
	const secondaryActions = notification.actions?.filter(
		(a) => !a.variant || a.variant === "default",
	)

	return (
		<div
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			onClick={() => onClick?.(notification)}
			onKeyDown={(e) => {
				if (onClick && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault()
					onClick(notification)
				}
			}}
			className={cn(
				"group relative flex gap-3 px-4 py-3 transition-colors",
				onClick && "cursor-pointer",
				isUnread && "bg-white/[0.02]",
				"hover:bg-raised",
				className,
			)}
		>
			{/* Icon */}
			<div
				className={cn(
					"flex size-8 shrink-0 items-center justify-center rounded-lg",
					notification.iconVariant
						? iconVariantClasses[notification.iconVariant]
						: defaultIconClasses,
				)}
			>
				<Icon className="size-4" />
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				{/* Title row */}
				<div className="flex items-center gap-1.5">
					<span className="truncate text-sm font-medium text-fg">
						{notification.title}
					</span>
					{isUnread && (
						<span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
					)}
					<span className="ml-auto shrink-0 text-xs text-fg-muted">
						{notification.time}
					</span>
				</div>

				{/* Description */}
				{notification.description && (
					<p className="mt-0.5 text-sm text-fg-muted line-clamp-2">
						{notification.description}
					</p>
				)}

				{/* Primary actions */}
				{primaryActions && primaryActions.length > 0 && (
					<div className="mt-1.5 flex items-center gap-3">
						{primaryActions.map((action) => (
							<button
								key={action.label}
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									action.onClick()
								}}
								className="text-xs font-medium text-brand hover:text-brand-hover transition-colors cursor-pointer"
							>
								{action.label}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Secondary actions (dropdown, hover only) */}
			{secondaryActions && secondaryActions.length > 0 && (
				<div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button variant="ghost" size="icon-xs">
									<MoreHorizontal className="size-3.5" />
								</Button>
							}
						/>
						<DropdownMenuContent align="end" side="bottom" sideOffset={4}>
							{secondaryActions.map((action) => (
								<DropdownMenuItem
									key={action.label}
									onClick={(e) => {
										e.stopPropagation()
										action.onClick()
									}}
								>
									{action.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}
		</div>
	)
}
