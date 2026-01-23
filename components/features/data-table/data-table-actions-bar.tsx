"use client"

import type { SortingState } from "@tanstack/react-table"
import { ArrowUpDown, Copy, Edit2, MoreVertical, Plus, Search, SlidersHorizontal, Trash2, X } from "lucide-react"
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Menu, MenuPopup, MenuPortal, MenuPositioner, MenuTrigger } from "@/components/ui/menu"
import { cn } from "@/lib/utils"
import type { DataTableView } from "./data-table.types"
import { DataTableSortMenu } from "./data-table-sort-menu"
import { useDataTableTranslations } from "./data-table.i18n"

interface DataTableActionsBarProps {
	// Views
	views?: DataTableView[]
	activeView?: DataTableView | null
	onViewChange?: (view: DataTableView) => void
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

	// Filters
	filterCount: number
	onOpenFilterBuilder: () => void
	showInlineFilters?: boolean
	onToggleInlineFilters?: () => void

	// Locale
	locale?: "fr" | "en"
}

export function DataTableActionsBar({
	views,
	activeView,
	onViewChange,
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
	filterCount,
	onOpenFilterBuilder,
	showInlineFilters = false,
	onToggleInlineFilters,
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

	return (
		<div data-slot="data-table-actions-bar" className="border-b border-border">
			{/* Main Actions Bar */}
			<div className="flex items-center justify-between p-2">
				{/* Left: Views or Search Bar */}
				{searchOpen ? (
					/* Search Bar - Replaces views when open */
					<div className="flex flex-1 items-center gap-2 mr-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								ref={searchInputRef}
								type="search"
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
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									aria-label="Clear search"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								onSearchOpenChange(false)
								onSearchChange("")
							}}
							className="h-8 px-3 text-xs"
						>
							{t.cancel}
						</Button>
					</div>
				) : (
					/* Views - Shown when search is closed */
					<div className="flex items-center gap-1">
						{views && views.length > 0 ? (
							<>
								{views.map((view) => {
									const isCustomView = !view.isSystem
									const isActive = activeView?.id === view.id
									const hasDropdownActions = isCustomView && (onViewDuplicate || onViewRename || onViewDelete)

									// Use ButtonGroup for active custom views with dropdown
									if (isActive && hasDropdownActions) {
										return (
											<ButtonGroup key={view.id}>
												<Button
													variant="outline"
													size="sm"
													onClick={() => onViewChange?.(view)}
													className="rounded-r-none"
												>
													{view.name}
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger
														render={
															<Button variant="outline" size="sm" className="!pl-2 rounded-l-none">
																<MoreVertical className="h-3.5 w-3.5" />
															</Button>
														}
													/>
													<DropdownMenuContent align="end" sideOffset={4}>
														{onViewDuplicate && (
															<DropdownMenuItem
																onSelect={(e) => {
																	e.preventDefault()
																	onViewDuplicate(view.id)
																}}
															>
																<Copy className="h-4 w-4" />
																<span>Duplicate</span>
															</DropdownMenuItem>
														)}
														{onViewRename && (
															<DropdownMenuItem
																onSelect={(e) => {
																	e.preventDefault()
																	onViewRename(view.id)
																}}
															>
																<Edit2 className="h-4 w-4" />
																<span>Rename</span>
															</DropdownMenuItem>
														)}
														{(onViewDuplicate || onViewRename) && onViewDelete && <DropdownMenuSeparator />}
														{onViewDelete && (
															<DropdownMenuItem
																variant="destructive"
																onSelect={(e) => {
																	e.preventDefault()
																	onViewDelete(view.id)
																}}
															>
																<Trash2 className="h-4 w-4" />
																<span>Delete</span>
															</DropdownMenuItem>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											</ButtonGroup>
										)
									}

									// Regular view button (system views or inactive custom views)
									return (
										<div key={view.id} className="relative group flex items-center">
											<button
												type="button"
												onClick={() => onViewChange?.(view)}
												className={cn(
													"relative inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
													isActive
														? "bg-muted text-foreground"
														: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
												)}
											>
												<span>{view.name}</span>
											</button>

											{/* Dropdown menu for inactive custom views */}
											{hasDropdownActions && !isActive && (
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<button
															type="button"
															className={cn(
																"inline-flex h-8 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted/50 hover:text-foreground group-hover:opacity-100 focus:opacity-100"
															)}
															aria-label="View options"
															onClick={(e) => e.stopPropagation()}
														>
															<MoreVertical className="h-3.5 w-3.5" />
														</button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" sideOffset={4}>
														{onViewDuplicate && (
															<DropdownMenuItem
																onSelect={(e) => {
																	e.preventDefault()
																	onViewDuplicate(view.id)
																}}
															>
																<Copy className="h-4 w-4" />
																<span>Duplicate</span>
															</DropdownMenuItem>
														)}
														{onViewRename && (
															<DropdownMenuItem
																onSelect={(e) => {
																	e.preventDefault()
																	onViewRename(view.id)
																}}
															>
																<Edit2 className="h-4 w-4" />
																<span>Rename</span>
															</DropdownMenuItem>
														)}
														{(onViewDuplicate || onViewRename) && onViewDelete && <DropdownMenuSeparator />}
														{onViewDelete && (
															<DropdownMenuItem
																variant="destructive"
																onSelect={(e) => {
																	e.preventDefault()
																	onViewDelete(view.id)
																}}
															>
																<Trash2 className="h-4 w-4" />
																<span>Delete</span>
															</DropdownMenuItem>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											)}
										</div>
									)
								})}

								{/* Create View Button */}
								{enableCustomViews && onCreateView && (
									<Button
										variant="ghost"
										size="sm"
										onClick={onCreateView}
										className="h-8 px-2"
										aria-label="Create view"
									>
										<Plus className="h-3.5 w-3.5" />
									</Button>
								)}
							</>
						) : null}
					</div>
				)}

				{/* Right: Action Icons */}
				<div className="flex items-center gap-1">
					{/* Search Icon */}
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => onSearchOpenChange(!searchOpen)}
						className={cn("h-8 w-8", searchOpen && "bg-accent text-accent-foreground")}
						aria-label="Toggle search"
						aria-expanded={searchOpen}
					>
						<Search className="h-4 w-4" />
					</Button>

					{/* Filters Icon */}
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onToggleInlineFilters || onOpenFilterBuilder}
						className={cn(
							"relative h-8 w-8",
							showInlineFilters && "bg-accent text-accent-foreground"
						)}
						aria-label="Toggle filters"
						aria-expanded={showInlineFilters}
					>
						<SlidersHorizontal className="h-4 w-4" />
						{filterCount > 0 && (
							<Badge
								variant="default"
								className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px] font-medium flex items-center justify-center"
							>
								{filterCount}
							</Badge>
						)}
					</Button>

					{/* Sort Icon */}
					<Menu>
						<MenuTrigger
							className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
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
