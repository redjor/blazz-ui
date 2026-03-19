import type { InboxNotification } from "@blazz/pro/components/blocks/inbox"
import { formatDistanceToNowStrict } from "date-fns"

type ConvexNotification = {
	_id: string
	title: string
	description: string
	actionType: string
	status?: string
	priority?: string
	authorName: string
	authorInitials: string
	authorColor?: string
	authorAvatar?: string
	read?: boolean
	createdAt: number
}

const actionTypeMap: Record<string, InboxNotification["actionType"]> = {
	comment: "comment",
	reply: "reply",
	reaction: "reaction",
	mention: "mention",
	added: "added",
}

export function toInboxNotification(n: ConvexNotification): InboxNotification {
	return {
		id: n._id,
		title: n.title,
		description: n.description,
		actionType: actionTypeMap[n.actionType] ?? "comment",
		status: (n.status as InboxNotification["status"]) ?? "default",
		priority: (n.priority as InboxNotification["priority"]) ?? "none",
		author: {
			name: n.authorName,
			initials: n.authorInitials,
			color: n.authorColor,
			avatarUrl: n.authorAvatar,
		},
		time: formatDistanceToNowStrict(new Date(n.createdAt), { addSuffix: false })
			.replace(" seconds", "s")
			.replace(" second", "s")
			.replace(" minutes", "m")
			.replace(" minute", "m")
			.replace(" hours", "h")
			.replace(" hour", "h")
			.replace(" days", "d")
			.replace(" day", "d"),
		read: n.read ?? false,
	}
}
