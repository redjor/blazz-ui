"use client"

import type { SortingState } from "@tanstack/react-table"
import {
	ArrowUpDown,
	ChevronDown,
	Copy,
	Edit2,
	ListFilter,
	MoreVertical,
	Plus,
	Save,
	Search,
	SlidersHorizontal,
	Trash2,
	X,
} from "lucide-react"
import * as React from "react"
import { cn } from "../../../lib/utils"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { ButtonGroup } from "../../ui/button-group"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Input } from "../../ui/input"
import { Menu, MenuPopup, MenuPortal, MenuPositioner, MenuTrigger } from "../../ui/menu"
import { useDataTableTranslations } from "./data-table.i18n"
import type { DataTableView } from "./data-table.types"
import { DataTableGroupMenu } from "./data-table-group-menu"
import { DataTableSortMenu } from "./data-table-sort-menu"

interface DataTableActionsBarProps {
	// Views
	views?: DataTableView[]
	activeView?: DataTableView | null
	onViewChange?: (view: DataTableView) => void
	onViewOverwrite?: (viewId: string) => void
	onViewDuplicate?: (viewId: string) => void
	onViewRename?: (viewId: string) => void
	onViewDelete?: (viewId: string) => void
	onCreateView?: () => void
	enableCustomViews?: boolean

	// Search
	searchOpen: boolean
	onSearchOpenChange: (open: boolean) => void
	searchValue: string
	onSearchChange: (value: string) => void
	searchPlaceholder?: string

	// Sort
	sorting: SortingState
	onSortingChange: (sorting: SortingState) => void
	sortableColumns: Array<{ id: string; label: string }>

	// Grouping
	enableGrouping?: boolean
	groupableColumns?: Array<{ id: string; label: string }>
	grouping?: string[]
	onGroupingChange?: (grouping: string[]) => void

	// Filters
	filterCount: number
	onOpenFilterBuilder: () => void
	showInlineFilters?: boolean
	onToggleInlineFilters?: () => void

	/** When true, a single button toggles both search and inline filters */
	combineSearchAndFilters?: boolean

	// Save view
	onSaveView?: () => void

	// Locale
	locale?: "fr" | "en"
}

/**
 * Shared dropdown content for view actions (Save, Duplicate, Rename, Delete).
 * Used by both active and inactive custom view dropdowns.
 */
function ViewActionsDropdownContent({
	view,
	onViewOverwrite,
	onViewDuplicate,
	onViewRename,
	onViewDelete,
	t,
}: {
	view: DataTableView
	onViewOverwrite?: (viewId: string) => void
	onViewDuplicate?: (viewId: string) => void
	onViewRename?: (viewId: string) => void
	onViewDelete?: (viewId: string) => void
	t: { save: string; duplicate: string; rename: string; delete: string }
}) {
	return (
		<DropdownMenuContent align="end" sideOffset={4}>
			{onViewOverwrite && (
				<DropdownMenuItem
					onClick={() => {
						onViewOverwrite(view.id)
					}}
				>
					<Save className="h-4 w-4" />
					<span>{t.save}</span>
				</DropdownMenuItem>
			)}
			{onViewDuplicate && (
				<DropdownMenuItem
					onClick={() => {
						onViewDuplicate(view.id)
					}}
				>
					<Copy className="h-4 w-4" />
					<span>{t.duplicate}</span>
				</DropdownMenuItem>
			)}
			{onViewRename && (
				<DropdownMenuItem
					onClick={() => {
						onViewRename(view.id)
					}}
				>
					<Edit2 className="h-4 w-4" />
					<span>{t.rename}</span>
				</DropdownMenuItem>
			)}
			{(onViewOverwrite || onViewDuplicate || onViewRename) && onViewDelete && (
				<DropdownMenuSeparator />
			)}
			{onViewDelete && (
				<DropdownMenuItem
					variant="destructive"
					onClick={() => {
						onViewDelete(view.id)
					}}
				>
					<Trash2 className="h-4 w-4" />
					<span>{t.delete}</span>
				</DropdownMenuItem>
			)}
		</DropdownMenuContent>
	)
}

export function DataTableActionsBar({
	views,
	activeView,
	onViewChange,
	onViewOverwrite,
	onViewDuplicate,
	onViewRename,
	onViewDelete,
	onCreateView,
	enableCustomViews = false,
	searchOpen,
	onSearchOpenChange,
	searchValue,
	onSearchChange,
	searchPlaceholder,
	sorting,
	onSortingChange,
	sortableColumns,
	enableGrouping = false,
	groupableColumns = [],
	grouping = [],
	onGroupingChange,
	filterCount,
	onOpenFilterBuilder,
	showInlineFilters = false,
	onToggleInlineFilters,
	combineSearchAndFilters = false,
	onSaveView,
	locale = "fr",
}: DataTableActionsBarProps) {
	const t = useDataTableTranslations(locale)
	const searchInputRef = React.useRef<HTMLInputElement>(null)

	// Focus search input when search opens
	React.useEffect(() => {
		if (searchOpen && searchInputRef.current) {
			searchInputRef.current.focus()
		}
	}, [searchOpen])

	// Handle Escape key to close search
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && searchOpen) {
				onSearchOpenChange(false)
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [searchOpen, onSearchOpenChange])

	// Combined toggle: opens/closes both search and inline filters at once
	const handleCombinedToggle = React.useCallback(() => {
		const newState = !searchOpen
		onSearchOpenChange(newState)
		if (onToggleInlineFilters && showInlineFilters !== newState) {
			onToggleInlineFilters()
		}
	}, [searchOpen, showInlineFilters, onSearchOpenChange, onToggleInlineFilters])

	// Combined cancel: close both and clear search
	const handleCombinedCancel = React.useCallback(() => {
		onSearchOpenChange(false)
		onSearchChange("")
		if (onToggleInlineFilters && showInlineFilters) {
			onToggleInlineFilters()
		}
	}, [onSearchOpenChange, onSearchChange, showInlineFilters, onToggleInlineFilters])

	// --- Overflow views logic (Shopify-style) ---
	// Strategy: render all views on first pass (visibleCount=null), measure widths
	// in useLayoutEffect (before paint), then show only what fits + "Plus de vues" dropdown.
	// Uses JS max-width (not CSS flex-1/min-w-0) to avoid breaking the table's 100% width.
	// The container has overflow-x-auto as a last-resort scroll fallback.
	const barRef = React.useRef<HTMLDivElement>(null)
	const containerRef = React.useRef<HTMLDivElement>(null)
	const itemWidths = React.useRef<number[]>([])
	const [visibleCount, setVisibleCount] = React.useState<number | null>(null)

	// Invalidate width cache when views change
	const viewsFingerprint = views?.map((v) => v.id).join(",") ?? ""
	const prevFingerprint = React.useRef(viewsFingerprint)
	if (prevFingerprint.current !== viewsFingerprint) {
		prevFingerprint.current = viewsFingerprint
		itemWidths.current = []
	}

	React.useLayoutEffect(() => {
		const bar = barRef.current
		const container = containerRef.current
		if (!bar || !container || !views?.length || searchOpen) return

		// Phase 1: Measure items when showing all (visibleCount === null)
		if (visibleCount === null) {
			const items = container.querySelectorAll<HTMLElement>("[data-view-item]")
			if (items.length === views.length) {
				itemWidths.current = Array.from(items).map((el) => el.offsetWidth)
			}
		}

		const widths = itemWidths.current
		if (widths.length !== views.length) return

		// Phase 2: Calculate available space and how many views fit
		const calculate = () => {
			const barPadding = 16 // p-2 = 8px * 2
			const barInnerWidth = bar.clientWidth - barPadding

			// Right actions width (last child of bar)
			const rightSection = (Array.from(bar.children) as HTMLElement[]).at(-1)
			const rightWidth = rightSection?.offsetWidth ?? 0

			// Constrain the views container via JS max-width
			const available = barInnerWidth - rightWidth
			container.style.maxWidth = `${available}px`

			const GAP = 4 // gap-1 = 4px
			const hasCreate = !!(enableCustomViews && onCreateView)
			const CREATE_W = hasCreate ? 36 : 0

			// Total width if all tabs shown (no "Plus de vues")
			const itemCount = widths.length + (hasCreate ? 1 : 0)
			let allFitTotal = widths.reduce((sum, w) => sum + w, 0) + CREATE_W
			allFitTotal += Math.max(0, itemCount - 1) * GAP

			if (allFitTotal <= available) {
				setVisibleCount(null)
				return
			}

			// Not all fit - find how many tabs fit alongside "Plus de vues" + "+" button
			const MORE_W = 120
			const fixedCount = 1 + (hasCreate ? 1 : 0)
			const fixedWidth = MORE_W + CREATE_W

			let count = 0
			let tabsWidth = 0
			for (let i = 0; i < widths.length; i++) {
				const newTabsWidth = tabsWidth + widths[i]
				const totalItems = i + 1 + fixedCount
				const totalGaps = Math.max(0, totalItems - 1) * GAP
				if (newTabsWidth + fixedWidth + totalGaps > available) break
				tabsWidth = newTabsWidth
				count++
			}

			setVisibleCount(Math.max(1, count))
		}

		calculate()

		const observer = new ResizeObserver(calculate)
		observer.observe(bar)

		return () => observer.disconnect()
	}, [views, visibleCount, searchOpen, enableCustomViews, onCreateView])

	// Derived data
	const showAllViews = visibleCount === null
	const displayedViews = showAllViews ? (views ?? []) : (views ?? []).slice(0, visibleCount)
	const overflowViews = !showAllViews && views ? views.slice(visibleCount ?? views.length) : []

	return (
		<div data-slot="data-table-actions-bar" className="border-b border-separator">
			{/* Main Actions Bar */}
			<div ref={barRef} className="flex items-center justify-between p-2">
				{/* Left: Views or Search Bar */}
				{searchOpen ? (
					/* Search Bar - Replaces views when open */
					<div className="flex flex-1 items-center gap-2 mr-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
							<Input
								ref={searchInputRef}
								type="text"
								placeholder={searchPlaceholder || t.searchPlaceholder}
								value={searchValue}
								onChange={(e) => onSearchChange(e.target.value)}
								className="h-8 pl-9 pr-9"
								aria-label="Search"
							/>
							{searchValue && (
								<button
									type="button"
									onClick={() => onSearchChange("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
									aria-label="Clear search"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
						{onSaveView && (
							<Button
								variant="ghost"
								size="sm"
								onClick={onSaveView}
								className="h-8 px-3 text-xs gap-1.5"
							>
								<Save className="h-3.5 w-3.5" />
								{t.save}
							</Button>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={
								combineSearchAndFilters
									? handleCombinedCancel
									: () => {
											onSearchOpenChange(false)
											onSearchChange("")
										}
							}
							className="h-8 px-3 text-xs"
						>
							{t.cancel}
						</Button>
					</div>
				) : (
					/* Views container - max-width set by JS to fit available space */
					<div ref={containerRef} className="flex items-center gap-1 overflow-x-clip">
						{views && views.length > 0 ? (
							<>
								{displayedViews.map((view) => {
									const isCustomView = !view.isSystem
									const isActive = activeView?.id === view.id
									const hasDropdownActions =
										isCustomView &&
										(onViewOverwrite || onViewDuplicate || onViewRename || onViewDelete)

									// Use ButtonGroup for active custom views with dropdown
									if (isActive && hasDropdownActions) {
										return (
											<div key={view.id} data-view-item className="shrink-0">
												<ButtonGroup>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => onViewChange?.(view)}
														className="rounded-r-none whitespace-nowrap"
													>
														{view.name}
													</Button>
													<DropdownMenu>
														<DropdownMenuTrigger
															render={
																<Button variant="ghost" size="sm" className="!pl-2 rounded-l-none">
																	<MoreVertical className="h-3.5 w-3.5" />
																</Button>
															}
														/>
														<ViewActionsDropdownContent
															view={view}
															onViewOverwrite={onViewOverwrite}
															onViewDuplicate={onViewDuplicate}
															onViewRename={onViewRename}
															onViewDelete={onViewDelete}
															t={t}
														/>
													</DropdownMenu>
												</ButtonGroup>
											</div>
										)
									}

									// Regular view button (system views or inactive custom views)
									return (
										<div
											key={view.id}
											data-view-item
											className="group relative flex shrink-0 items-center"
										>
											<button
												type="button"
												onClick={() => onViewChange?.(view)}
												className={cn(
													"relative inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors",
													isActive
														? "bg-raised text-fg"
														: "text-fg-muted hover:bg-raised/50 hover:text-fg"
												)}
											>
												<span>{view.name}</span>
											</button>

											{/* Dropdown menu for inactive custom views */}
											{hasDropdownActions && !isActive && (
												<DropdownMenu>
													<DropdownMenuTrigger
														render={
															<button
																type="button"
																className="inline-flex opacity-0 group-hover:opacity-100 data-[popup-open]:opacity-100 focus:opacity-100 h-8 w-6 items-center justify-center rounded-md text-fg-muted hover:bg-raised/50 hover:text-fg transition-opacity"
																aria-label="View options"
															>
																<MoreVertical className="h-3.5 w-3.5" />
															</button>
														}
													/>
													<ViewActionsDropdownContent
														view={view}
														onViewOverwrite={onViewOverwrite}
														onViewDuplicate={onViewDuplicate}
														onViewRename={onViewRename}
														onViewDelete={onViewDelete}
														t={t}
													/>
												</DropdownMenu>
											)}
										</div>
									)
								})}

								{/* "Plus de vues" overflow dropdown */}
								{overflowViews.length > 0 && (
									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button
													variant="ghost"
													size="sm"
													className="h-8 shrink-0 whitespace-nowrap"
												>
													<span>{t.moreViews}</span>
													<ChevronDown className="ml-1 h-3 w-3" />
												</Button>
											}
										/>
										<DropdownMenuContent align="start" sideOffset={4}>
											{overflowViews.map((view) => (
												<DropdownMenuItem
													key={view.id}
													onClick={() => onViewChange?.(view)}
													className={cn(activeView?.id === view.id && "bg-raised text-fg")}
												>
													{view.name}
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								)}
								{/* Create View Button */}
								{enableCustomViews && onCreateView && (
									<Button
										variant="ghost"
										size="sm"
										onClick={onCreateView}
										className="h-8 shrink-0 px-2"
										aria-label={t.createView}
									>
										<Plus className="h-3.5 w-3.5" />
									</Button>
								)}
							</>
						) : null}
					</div>
				)}

				{/* Right: Action Icons */}
				<div className="flex shrink-0 items-center gap-1">
					{combineSearchAndFilters ? (
						/* Single combined search + filters button - hidden when open (cancel button used instead) */
						!searchOpen && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleCombinedToggle}
								className="relative h-8 gap-1 px-2"
								aria-label="Toggle search and filters"
								aria-expanded={searchOpen}
							>
								<Search className="h-4 w-4" />
								<ListFilter className="h-4 w-4" />
								{filterCount > 0 && (
									<Badge
										variant="secondary"
										className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px] font-medium flex items-center justify-center"
									>
										{filterCount}
									</Badge>
								)}
							</Button>
						)
					) : (
						<>
							{/* Search Icon */}
							<Button
								variant="outline"
								size="icon-sm"
								onClick={() => onSearchOpenChange(!searchOpen)}
								className={cn("h-8 w-8", searchOpen && "bg-raised text-fg")}
								aria-label="Toggle search"
								aria-expanded={searchOpen}
							>
								<Search className="h-4 w-4" />
							</Button>

							{/* Filters Icon */}
							<Button
								variant="outline"
								size="icon-sm"
								onClick={onToggleInlineFilters || onOpenFilterBuilder}
								className={cn("relative h-8 w-8", showInlineFilters && "bg-raised text-fg")}
								aria-label="Toggle filters"
								aria-expanded={showInlineFilters}
							>
								<SlidersHorizontal className="h-4 w-4" />
								{filterCount > 0 && (
									<Badge
										variant="secondary"
										className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px] font-medium flex items-center justify-center"
									>
										{filterCount}
									</Badge>
								)}
							</Button>
						</>
					)}

					{/* Group by */}
					{enableGrouping && onGroupingChange && (
						<DataTableGroupMenu
							groupableColumns={groupableColumns}
							grouping={grouping}
							onGroupingChange={onGroupingChange}
							locale={locale}
						/>
					)}

					{/* Sort Icon */}
					<Menu>
						<MenuTrigger
							className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-separator bg-surface text-sm font-medium transition-colors hover:bg-raised hover:text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50"
							aria-label="Sort options"
						>
							<ArrowUpDown className="h-4 w-4" />
						</MenuTrigger>
						<MenuPortal>
							<MenuPositioner sideOffset={8}>
								<MenuPopup>
									<DataTableSortMenu
										columns={sortableColumns}
										sorting={sorting}
										onSortingChange={onSortingChange}
										locale={locale}
									/>
								</MenuPopup>
							</MenuPositioner>
						</MenuPortal>
					</Menu>
				</div>
			</div>
		</div>
	)
}
