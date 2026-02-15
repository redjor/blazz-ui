"use client"

import { Bell, Check, MessageSquare, UserPlus, DollarSign, AlertCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

type NotificationType = "deal" | "contact" | "message" | "alert"

interface Notification {
	id: string
	type: NotificationType
	title: string
	description: string
	time: string
	read: boolean
}

const mockNotifications: Notification[] = [
	{
		id: "1",
		type: "deal",
		title: "Deal won",
		description: 'Acme Corp — "Enterprise Plan" closed at $48,000',
		time: "2 min ago",
		read: false,
	},
	{
		id: "2",
		type: "contact",
		title: "New contact added",
		description: "Sarah Chen was added to Acme Corp",
		time: "15 min ago",
		read: false,
	},
	{
		id: "3",
		type: "message",
		title: "Comment on deal",
		description: 'Marc left a note on "Globex Renewal"',
		time: "1h ago",
		read: false,
	},
	{
		id: "4",
		type: "alert",
		title: "Quote expiring",
		description: "Quote #Q-2024-089 expires tomorrow",
		time: "3h ago",
		read: true,
	},
	{
		id: "5",
		type: "deal",
		title: "Deal moved to Negotiation",
		description: 'Wayne Enterprises — "Security Suite" updated',
		time: "5h ago",
		read: true,
	},
	{
		id: "6",
		type: "contact",
		title: "Contact updated",
		description: "John Doe email changed",
		time: "1d ago",
		read: true,
	},
]

const typeIcon: Record<NotificationType, React.ReactNode> = {
	deal: <DollarSign className="size-4" />,
	contact: <UserPlus className="size-4" />,
	message: <MessageSquare className="size-4" />,
	alert: <AlertCircle className="size-4" />,
}

const typeBg: Record<NotificationType, string> = {
	deal: "bg-emerald-500/15 text-emerald-400",
	contact: "bg-blue-500/15 text-blue-400",
	message: "bg-violet-500/15 text-violet-400",
	alert: "bg-amber-500/15 text-amber-400",
}

export function NotificationSheet() {
	const [notifications, setNotifications] = useState(mockNotifications)
	const unreadCount = notifications.filter((n) => !n.read).length

	function markAllRead() {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
	}

	function markRead(id: string) {
		setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
	}

	return (
		<Sheet>
			<SheetTrigger
				className="relative rounded-lg p-2 transition-colors hover:bg-gray-800"
				aria-label="Notifications"
			>
				<Bell className="size-4 text-gray-300" />
				{unreadCount > 0 && (
					<span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
				)}
			</SheetTrigger>

			<SheetContent side="right" className="w-[380px] flex flex-col bg-surface border-edge">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-edge px-4 py-3">
					<div className="flex items-center gap-2">
						<h2 className="text-sm font-semibold text-fg">Notifications</h2>
						{unreadCount > 0 && (
							<Badge variant="info" size="xs">
								{unreadCount}
							</Badge>
						)}
					</div>
					{unreadCount > 0 && (
						<button
							type="button"
							onClick={markAllRead}
							className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors"
						>
							<Check className="size-3" />
							Mark all read
						</button>
					)}
				</div>

				{/* List */}
				<div className="flex-1 overflow-y-auto">
					{notifications.map((notification) => (
						<button
							key={notification.id}
							type="button"
							onClick={() => markRead(notification.id)}
							className={cn(
								"flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-raised border-b border-edge/50",
								!notification.read && "bg-white/[0.02]"
							)}
						>
							<div
								className={cn(
									"mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
									typeBg[notification.type]
								)}
							>
								{typeIcon[notification.type]}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-fg truncate">
										{notification.title}
									</span>
									{!notification.read && (
										<span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
									)}
								</div>
								<p className="mt-0.5 text-xs text-fg-muted truncate">
									{notification.description}
								</p>
								<span className="mt-1 text-[11px] text-fg-subtle">
									{notification.time}
								</span>
							</div>
						</button>
					))}
				</div>
			</SheetContent>
		</Sheet>
	)
}
