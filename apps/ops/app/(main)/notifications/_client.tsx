"use client"

import { filterInboxItems, InboxDetailEmpty, type InboxFilters, InboxHeader, InboxItem, InboxList, type InboxNotification, InboxPanel } from "@blazz/pro/components/blocks/inbox"
import { SplitView } from "@blazz/pro/components/blocks/split-view"
import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { NotificationDetail } from "@/components/notification-detail"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toInboxNotification } from "@/lib/notifications"

export default function NotificationsPageClient() {
	const notifications = useQuery(api.notifications.list, {})
	const markRead = useMutation(api.notifications.markRead)
	const markAllReadMutation = useMutation(api.notifications.markAllRead)
	const archiveAllReadMutation = useMutation(api.notifications.archiveAllRead)

	const [selectedId, setSelectedId] = useState<Id<"notifications"> | null>(null)
	const [filters, setFilters] = useState<InboxFilters>({})
	const isLoading = notifications === undefined

	const items: InboxNotification[] = (notifications ?? []).map(toInboxNotification)
	const filtered = filterInboxItems(items, filters)

	const selectedNotification = notifications?.find((n) => n._id === selectedId)

	function handleSelect(item: InboxNotification) {
		const id = item.id as Id<"notifications">
		setSelectedId(id)
		const original = notifications?.find((n) => n._id === id)
		if (original && !original.read) {
			markRead({ id })
		}
	}

	function handleMarkAllRead() {
		markAllReadMutation({})
	}

	function handleArchiveAllRead() {
		archiveAllReadMutation({})
	}

	return (
		<SplitView defaultWidth={380} className="h-[calc(100vh-3.5rem)]">
			<SplitView.Master className="flex flex-col">
				<InboxHeader
					title="Notifications"
					filters={filters}
					onFiltersChange={setFilters}
					menuActions={[
						{ label: "Mark all read", onClick: handleMarkAllRead },
						{ label: "Archive all read", onClick: handleArchiveAllRead },
					]}
				/>
				<InboxPanel loading={isLoading}>
					<InboxList>
						{filtered.map((item) => (
							<InboxItem key={item.id} item={item} selected={selectedId === item.id} onClick={handleSelect} />
						))}
					</InboxList>
				</InboxPanel>
			</SplitView.Master>
			<SplitView.Detail>{selectedNotification ? <NotificationDetail notification={selectedNotification} /> : <InboxDetailEmpty />}</SplitView.Detail>
		</SplitView>
	)
}
