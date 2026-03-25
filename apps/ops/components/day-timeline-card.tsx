"use client"

import { Button } from "@blazz/ui/components/ui/button"
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@blazz/ui/components/ui/card"
import { cn } from "@blazz/ui/lib/utils"
import { formatMinutes } from "@/lib/format"

export type TimelineItemKind =
	| "focus"
	| "admin"
	| "meeting"
	| "break"
	| "personal"
	| "uncategorized"

export type TimelineItem = {
	id: string
	start?: string
	end?: string
	minutes: number
	label: string
	description?: string | null
	kind: TimelineItemKind
	projectName?: string | null
}

type DayTimelineCardProps = {
	title?: string
	items: TimelineItem[]
	onItemClick?: (id: string) => void
	onAddClick?: () => void
}

const KIND_STYLES: Record<TimelineItemKind, string> = {
	focus: "border-brand/25 bg-brand/12 text-brand",
	admin: "border-amber-500/25 bg-amber-500/12 text-amber-700 dark:text-amber-400",
	meeting: "border-blue-500/25 bg-blue-500/12 text-blue-700 dark:text-blue-400",
	break: "border-green-500/25 bg-green-500/12 text-green-700 dark:text-green-400",
	personal: "border-edge bg-muted text-fg-muted",
	uncategorized: "border-edge bg-muted text-fg-muted",
}

function formatTimeRange(item: TimelineItem) {
	if (item.start && item.end) return `${item.start} -> ${item.end}`
	if (item.start) return `${item.start} -> ...`
	return "Sans horaire"
}

export function DayTimelineCard({
	title = "Timeline",
	items,
	onItemClick,
	onAddClick,
}: DayTimelineCardProps) {
	return (
		<Card>
			<CardHeader className="border-b border-separator">
				<CardTitle>{title}</CardTitle>
				<CardDescription>Relis la journée bloc par bloc.</CardDescription>
				{onAddClick ? (
					<CardAction>
						<Button type="button" variant="ghost" size="sm" onClick={onAddClick}>
							Ajouter
						</Button>
					</CardAction>
				) : null}
			</CardHeader>
			<div>
				{items.length === 0 ? (
					<div className="px-inset py-8 text-sm text-fg-muted">Aucun bloc pour cette journée.</div>
				) : (
					<ul className="divide-y divide-separator">
						{items.map((item) => {
							const content = (
								<>
									<div className="flex min-w-0 items-start gap-3">
										<span
											className={cn(
												"mt-0.5 inline-flex min-w-24 shrink-0 rounded-md border px-2 py-1 font-mono text-xs",
												KIND_STYLES[item.kind]
											)}
										>
											{formatTimeRange(item)}
										</span>
										<div className="min-w-0 flex-1 space-y-0.5">
											<p className="truncate text-sm font-medium text-fg">{item.label}</p>
											{item.projectName || item.description ? (
												<p className="truncate text-xs text-fg-muted">
													{item.projectName}
													{item.projectName && item.description ? " · " : ""}
													{item.description}
												</p>
											) : null}
										</div>
									</div>
									<span className="shrink-0 font-mono text-xs text-fg-muted">
										{formatMinutes(item.minutes)}
									</span>
								</>
							)

							if (!onItemClick) {
								return (
									<li
										key={item.id}
										className="flex items-start justify-between gap-3 px-inset py-3"
									>
										{content}
									</li>
								)
							}

							return (
								<li key={item.id}>
									<button
										type="button"
										onClick={() => onItemClick(item.id)}
										className="flex w-full items-start justify-between gap-3 px-inset py-3 text-left transition-colors hover:bg-muted/60"
									>
										{content}
									</button>
								</li>
							)
						})}
					</ul>
				)}
			</div>
		</Card>
	)
}
