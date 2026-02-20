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
