"use client"

import { useQuery, useMutation } from "convex/react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
	Inbox,
	InboxSidebar,
	InboxDetail,
	InboxHeader,
	InboxPanel,
	InboxList,
	InboxItem,
	InboxDetailEmpty,
	filterInboxItems,
	type InboxFilters,
	type InboxNotification,
} from "@blazz/pro/components/blocks/inbox"
import { toInboxNotification } from "@/lib/notifications"
import { NotificationDetail } from "@/components/notification-detail"

export default function NotificationsPageClient() {
	const notifications = useQuery(api.notifications.list, {})
	const markRead = useMutation(api.notifications.markRead)
	const markAllReadMutation = useMutation(api.notifications.markAllRead)
	const archiveAllReadMutation = useMutation(api.notifications.archiveAllRead)

	const [selectedId, setSelectedId] = useState<Id<"notifications"> | null>(null)
	const [filters, setFilters] = useState<InboxFilters>({})
	const [sourceFilter, setSourceFilter] = useState<string | null>(null)

	const isLoading = notifications === undefined

	const items: InboxNotification[] = (notifications ?? []).map(toInboxNotification)
	const filteredBySource = sourceFilter
		? items.filter((item) => {
				const original = notifications?.find((n) => n._id === item.id)
				return original?.source === sourceFilter
			})
		: items
	const filtered = filterInboxItems(filteredBySource, filters)

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
		markAllReadMutation(sourceFilter ? { source: sourceFilter } : {})
	}

	function handleArchiveAllRead() {
		archiveAllReadMutation({})
	}

	const sources = ["github", "vercel", "convex"] as const

	return (
		<Inbox className="h-[calc(100vh-3.5rem)]">
			<InboxSidebar width={380}>
				{/* Source filter chips */}
				<div className="flex items-center gap-1 px-3 pt-2">
					<button
						type="button"
						onClick={() => setSourceFilter(null)}
						className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
							sourceFilter === null
								? "bg-brand/15 text-brand"
								: "bg-fg/5 text-fg-muted hover:bg-fg/10"
						}`}
					>
						All
					</button>
					{sources.map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => setSourceFilter(sourceFilter === s ? null : s)}
							className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize transition-colors cursor-pointer ${
								sourceFilter === s
									? "bg-brand/15 text-brand"
									: "bg-fg/5 text-fg-muted hover:bg-fg/10"
							}`}
						>
							{s}
						</button>
					))}
				</div>

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
							<InboxItem
								key={item.id}
								item={item}
								selected={selectedId === item.id}
								onClick={handleSelect}
							/>
						))}
					</InboxList>
				</InboxPanel>
			</InboxSidebar>
			<InboxDetail>
				{selectedNotification ? (
					<NotificationDetail notification={selectedNotification} />
				) : (
					<InboxDetailEmpty />
				)}
			</InboxDetail>
		</Inbox>
	)
}
