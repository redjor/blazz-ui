"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DataTableView } from "./data-table.types"

interface DataTableViewTabsProps {
	views: DataTableView[]
	activeView: DataTableView | null
	onViewChange: (view: DataTableView) => void
	onCreateView?: () => void
	enableCustomViews?: boolean
}

export function DataTableViewTabs({
	views,
	activeView,
	onViewChange,
	onCreateView,
	enableCustomViews = false,
}: DataTableViewTabsProps) {
	return (
		<div className="border-b border-border" data-slot="data-table-view-tabs">
			<div className="flex items-center gap-1 px-3">
				{views.map((view) => (
					<button
						key={view.id}
						type="button"
						onClick={() => onViewChange(view)}
						className={cn(
							"relative px-4 py-3 text-xs font-medium transition-colors hover:text-foreground",
							"border-b-2 -mb-px",
							activeView?.id === view.id
								? "border-foreground text-foreground"
								: "border-transparent text-muted-foreground"
						)}
					>
						<div className="flex items-center gap-2">
							{view.icon && <view.icon className="h-4 w-4" />}
							<span>{view.name}</span>
						</div>
					</button>
				))}

				{enableCustomViews && onCreateView && (
					<button
						type="button"
						onClick={onCreateView}
						className="relative px-3 py-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						<Plus className="h-4 w-4" />
					</button>
				)}
			</div>
		</div>
	)
}
