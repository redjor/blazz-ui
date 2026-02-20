# Notification Center Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a compound NotificationCenter block with 4 composable sub-components, doc page, and refactor the existing NotificationSheet to use it.

**Architecture:** Compound components pattern — `NotificationCenter` (container with header + states), `NotificationList` (scrollable wrapper), `NotificationGroup` (date separator), `NotificationItem` (individual notification with icon, actions, unread dot). All in one file, exported via `components/blocks/index.ts`.

**Tech Stack:** React 19, TypeScript, Tailwind v4, Lucide icons, Badge component, DropdownMenu component, Skeleton, EmptyState, ErrorState blocks.

---

### Task 1: Create NotificationCenter block — types & container

**Files:**
- Create: `components/blocks/notification-center.tsx`

**Step 1: Write the types and NotificationCenter container**

```tsx
"use client"

import { Bell, Check, MoreHorizontal } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/blocks/empty-state"
import { ErrorState } from "@/components/blocks/error-state"
import { cn } from "@/lib/utils"

// --- Types ---

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

// --- NotificationCenter ---

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
	return (
		<div className={cn("flex flex-col h-full", className)}>
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-edge">
				<div className="flex items-center gap-2">
					<h2 className="text-sm font-semibold text-fg">Notifications</h2>
					{unreadCount > 0 && (
						<Badge variant="info" size="xs">
							{unreadCount}
						</Badge>
					)}
				</div>
				{unreadCount > 0 && onMarkAllRead && (
					<button
						type="button"
						onClick={onMarkAllRead}
						className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors"
					>
						<Check className="size-3" />
						Mark all read
					</button>
				)}
			</div>

			{/* Body */}
			{loading ? (
				<NotificationSkeleton />
			) : error ? (
				<ErrorState onRetry={onRetry} className="flex-1" />
			) : (
				children
			)}
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add components/blocks/notification-center.tsx
git commit -m "feat(notification-center): add types and NotificationCenter container"
```

---

### Task 2: Add NotificationList, NotificationGroup, NotificationSkeleton

**Files:**
- Modify: `components/blocks/notification-center.tsx`

**Step 1: Add NotificationList, NotificationGroup, and NotificationSkeleton below NotificationCenter**

```tsx
// --- NotificationList ---

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

// --- NotificationGroup ---

export interface NotificationGroupProps {
	label: string
	children: React.ReactNode
	className?: string
}

export function NotificationGroup({ label, children, className }: NotificationGroupProps) {
	return (
		<div className={cn("", className)}>
			<div className="flex items-center gap-3 px-4 py-2">
				<span className="text-[11px] font-medium uppercase text-fg-muted whitespace-nowrap">
					{label}
				</span>
				<div className="h-px flex-1 bg-edge" />
			</div>
			{children}
		</div>
	)
}

// --- NotificationSkeleton (internal) ---

function NotificationSkeleton() {
	return (
		<div className="flex-1 overflow-y-auto">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex gap-3 px-4 py-3">
					<Skeleton className="size-8 rounded-lg shrink-0" />
					<div className="flex-1 space-y-1.5">
						<Skeleton className="h-3.5 w-32" />
						<Skeleton className="h-3 w-48" />
						<Skeleton className="h-2.5 w-16" />
					</div>
				</div>
			))}
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add components/blocks/notification-center.tsx
git commit -m "feat(notification-center): add NotificationList, NotificationGroup, skeleton"
```

---

### Task 3: Add NotificationItem

**Files:**
- Modify: `components/blocks/notification-center.tsx`

**Step 1: Add icon variant color map and NotificationItem**

```tsx
// --- Icon variant colors ---

const iconVariantClasses: Record<string, string> = {
	info: "bg-blue-500/15 text-blue-500",
	success: "bg-emerald-500/15 text-emerald-500",
	warning: "bg-amber-500/15 text-amber-400",
	critical: "bg-red-500/15 text-red-400",
}

// --- NotificationItem ---

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
	const { icon: Icon, iconVariant, title, description, time, read, actions = [] } = notification
	const primaryActions = actions.filter((a) => a.variant === "primary")
	const secondaryActions = actions.filter((a) => a.variant !== "primary")

	return (
		<div
			className={cn(
				"group relative flex gap-3 px-4 py-3 transition-colors hover:bg-raised border-b border-edge/50",
				!read && "bg-white/[0.02]",
				onClick && "cursor-pointer",
				className
			)}
			onClick={() => onClick?.(notification)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") onClick?.(notification)
			}}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			{/* Icon */}
			<div
				className={cn(
					"mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
					iconVariant ? iconVariantClasses[iconVariant] : "bg-fg/5 text-fg-muted"
				)}
			>
				<Icon className="size-4" />
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-fg truncate">{title}</span>
					{!read && (
						<span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
					)}
					<span className="ml-auto text-[11px] text-fg-subtle whitespace-nowrap shrink-0">
						{time}
					</span>
				</div>
				{description && (
					<p className="mt-0.5 text-xs text-fg-muted truncate">{description}</p>
				)}
				{primaryActions.length > 0 && (
					<div className="mt-1.5 flex gap-2">
						{primaryActions.map((action) => (
							<button
								key={action.label}
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									action.onClick()
								}}
								className="text-xs font-medium text-brand hover:text-brand/80 transition-colors"
							>
								{action.label}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Secondary actions — "…" menu on hover */}
			{secondaryActions.length > 0 && (
				<div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={(e) => e.stopPropagation()}
								/>
							}
						>
							<MoreHorizontal className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" sideOffset={4}>
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
```

**Step 2: Commit**

```bash
git add components/blocks/notification-center.tsx
git commit -m "feat(notification-center): add NotificationItem with actions and icon variants"
```

---

### Task 4: Export from blocks index

**Files:**
- Modify: `components/blocks/index.ts`

**Step 1: Add exports at the end of the file**

```ts
export { NotificationCenter, NotificationList, NotificationGroup, NotificationItem } from "./notification-center"
export type {
	NotificationCenterProps,
	NotificationListProps,
	NotificationGroupProps,
	NotificationItemProps,
	Notification,
	NotificationAction,
} from "./notification-center"
```

**Step 2: Commit**

```bash
git add components/blocks/index.ts
git commit -m "feat(notification-center): export from blocks index"
```

---

### Task 5: Refactor NotificationSheet to use the new block

**Files:**
- Modify: `components/layout/notification-sheet.tsx`

**Step 1: Rewrite NotificationSheet as a thin wrapper**

Replace the entire file with:

```tsx
"use client"

import { Bell } from "lucide-react"
import { DollarSign, UserPlus, MessageSquare, AlertCircle } from "lucide-react"
import { useState } from "react"
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet"
import {
	NotificationCenter,
	NotificationList,
	NotificationItem,
	NotificationGroup,
} from "@/components/blocks/notification-center"
import type { Notification } from "@/components/blocks/notification-center"

const mockNotifications: Notification[] = [
	{
		id: "1",
		icon: DollarSign,
		iconVariant: "success",
		title: "Deal won",
		description: 'Acme Corp — "Enterprise Plan" closed at $48,000',
		time: "2 min ago",
		read: false,
		actions: [
			{ label: "View deal", onClick: () => {}, variant: "primary" },
			{ label: "Archive", onClick: () => {} },
		],
	},
	{
		id: "2",
		icon: UserPlus,
		iconVariant: "info",
		title: "New contact added",
		description: "Sarah Chen was added to Acme Corp",
		time: "15 min ago",
		read: false,
		actions: [{ label: "View contact", onClick: () => {}, variant: "primary" }],
	},
	{
		id: "3",
		icon: MessageSquare,
		iconVariant: "info",
		title: "Comment on deal",
		description: 'Marc left a note on "Globex Renewal"',
		time: "1h ago",
		read: false,
	},
	{
		id: "4",
		icon: AlertCircle,
		iconVariant: "warning",
		title: "Quote expiring",
		description: "Quote #Q-2024-089 expires tomorrow",
		time: "3h ago",
		read: true,
		actions: [
			{ label: "Renew", onClick: () => {}, variant: "primary" },
			{ label: "Dismiss", onClick: () => {} },
		],
	},
	{
		id: "5",
		icon: DollarSign,
		iconVariant: "success",
		title: "Deal moved to Negotiation",
		description: 'Wayne Enterprises — "Security Suite" updated',
		time: "5h ago",
		read: true,
	},
	{
		id: "6",
		icon: UserPlus,
		iconVariant: "info",
		title: "Contact updated",
		description: "John Doe email changed",
		time: "1d ago",
		read: true,
	},
]

export function NotificationSheet() {
	const [notifications, setNotifications] = useState(mockNotifications)
	const unreadCount = notifications.filter((n) => !n.read).length

	function markAllRead() {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
	}

	function markRead(notif: Notification) {
		setNotifications((prev) =>
			prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
		)
	}

	return (
		<Sheet>
			<SheetTrigger
				className="relative rounded-lg p-2 transition-colors hover:bg-raised"
				aria-label="Notifications"
			>
				<Bell className="size-4 text-fg-muted" />
				{unreadCount > 0 && (
					<span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
				)}
			</SheetTrigger>

			<SheetContent side="right">
				<NotificationCenter
					onMarkAllRead={markAllRead}
					unreadCount={unreadCount}
				>
					<NotificationList>
						{notifications.map((n) => (
							<NotificationItem
								key={n.id}
								notification={n}
								onClick={markRead}
							/>
						))}
					</NotificationList>
				</NotificationCenter>
			</SheetContent>
		</Sheet>
	)
}
```

**Step 2: Verify the app still renders** — open the CRM dashboard and click the bell icon.

**Step 3: Commit**

```bash
git add components/layout/notification-sheet.tsx
git commit -m "refactor(notification-sheet): use NotificationCenter block"
```

---

### Task 6: Create doc page

**Files:**
- Create: `app/(docs)/docs/components/ui/notification-center/page.tsx`

**Step 1: Create the doc page with examples**

The page should follow the existing doc pattern (see `app/(docs)/docs/components/ui/sheet/page.tsx`) with:
- `DocPage`, `DocHero`, `DocSection`, `DocExample`, `DocPropsTable`, `DocRelated`
- Hero: basic NotificationCenter in a Sheet
- Examples:
  1. **Basic** — flat list, no groups
  2. **With Groups** — "Today" / "Yesterday" groups
  3. **With Actions** — primary + secondary actions on items
  4. **Loading State** — `loading` prop
  5. **Empty State** — no items
  6. **In a Sheet** — full integration with SheetHeader/SheetFooter
- Props tables for `NotificationCenter`, `NotificationItem`, `Notification`, `NotificationAction`
- Related: Sheet, Badge, DropdownMenu

Use mock data inline (import Lucide icons for icons). The page is `"use client"` since it uses interactive Sheet examples.

**Step 2: Commit**

```bash
git add "app/(docs)/docs/components/ui/notification-center/page.tsx"
git commit -m "docs(notification-center): add doc page with examples"
```

---

### Task 7: Add to showcase navigation

**Files:**
- Modify: `config/navigation.ts`

**Step 1: Find the blocks/components section and add a Notification Center entry**

Add an entry pointing to `/docs/components/ui/notification-center` in the appropriate navigation group.

**Step 2: Commit**

```bash
git add config/navigation.ts
git commit -m "docs(notification-center): add to showcase navigation"
```
