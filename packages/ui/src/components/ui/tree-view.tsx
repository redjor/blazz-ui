"use client"

import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"
import * as React from "react"
import { cn } from "../../lib/utils"

/* ---------------------------------------------------------------------------
 * TreeView
 * --------------------------------------------------------------------------- */

export interface TreeNode {
	id: string
	label: string
	icon?: React.ReactNode
	children?: TreeNode[]
}

export interface TreeViewProps {
	data: TreeNode[]
	/** Controlled selected node IDs */
	selected?: string[]
	/** Callback on selection change */
	onSelect?: (ids: string[]) => void
	/** Controlled expanded node IDs */
	expanded?: string[]
	/** Callback on expand change */
	onExpandChange?: (ids: string[]) => void
	/** Allow multiple selection. @default false */
	multiSelect?: boolean
	className?: string
}

function TreeView({
	data,
	selected: controlledSelected,
	onSelect,
	expanded: controlledExpanded,
	onExpandChange,
	multiSelect = false,
	className,
}: TreeViewProps) {
	const [internalSelected, setInternalSelected] = React.useState<string[]>([])
	const [internalExpanded, setInternalExpanded] = React.useState<string[]>([])

	const selected = controlledSelected ?? internalSelected
	const expanded = controlledExpanded ?? internalExpanded

	const toggleExpand = (id: string) => {
		const next = expanded.includes(id) ? expanded.filter((e) => e !== id) : [...expanded, id]
		if (!controlledExpanded) setInternalExpanded(next)
		onExpandChange?.(next)
	}

	const handleSelect = (id: string) => {
		let next: string[]
		if (multiSelect) {
			next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
		} else {
			next = selected.includes(id) ? [] : [id]
		}
		if (!controlledSelected) setInternalSelected(next)
		onSelect?.(next)
	}

	return (
		<div data-slot="tree-view" role="tree" className={cn("text-sm", className)}>
			{data.map((node) => (
				<TreeNodeItem
					key={node.id}
					node={node}
					level={0}
					selected={selected}
					expanded={expanded}
					onSelect={handleSelect}
					onToggleExpand={toggleExpand}
				/>
			))}
		</div>
	)
}

/* ---------------------------------------------------------------------------
 * TreeNodeItem (internal)
 * --------------------------------------------------------------------------- */

interface TreeNodeItemProps {
	node: TreeNode
	level: number
	selected: string[]
	expanded: string[]
	onSelect: (id: string) => void
	onToggleExpand: (id: string) => void
}

function TreeNodeItem({
	node,
	level,
	selected,
	expanded,
	onSelect,
	onToggleExpand,
}: TreeNodeItemProps) {
	const hasChildren = node.children && node.children.length > 0
	const isExpanded = expanded.includes(node.id)
	const isSelected = selected.includes(node.id)

	return (
		<div role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
			<div
				className={cn(
					"flex items-center gap-1 rounded-md px-1.5 py-1 cursor-pointer",
					"transition-colors hover:bg-raised",
					"outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
					isSelected && "bg-brand/10 text-brand"
				)}
				style={{ paddingLeft: `${level * 16 + 6}px` }}
				onClick={() => onSelect(node.id)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault()
						onSelect(node.id)
					}
					if (e.key === "ArrowRight" && hasChildren && !isExpanded) {
						e.preventDefault()
						onToggleExpand(node.id)
					}
					if (e.key === "ArrowLeft" && hasChildren && isExpanded) {
						e.preventDefault()
						onToggleExpand(node.id)
					}
				}}
				tabIndex={0}
				role="button"
			>
				{hasChildren ? (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							onToggleExpand(node.id)
						}}
						className="shrink-0 p-0.5 text-fg-muted hover:text-fg outline-none"
						tabIndex={-1}
					>
						<ChevronRightIcon
							className={cn(
								"size-3.5 transition-transform duration-150",
								isExpanded && "rotate-90"
							)}
						/>
					</button>
				) : (
					<span className="w-[18px] shrink-0" />
				)}

				<span className="shrink-0 text-fg-muted">
					{node.icon ??
						(hasChildren ? <FolderIcon className="size-4" /> : <FileIcon className="size-4" />)}
				</span>

				<span className="truncate">{node.label}</span>
			</div>

			{hasChildren && isExpanded && (
				<div role="group">
					{node.children!.map((child) => (
						<TreeNodeItem
							key={child.id}
							node={child}
							level={level + 1}
							selected={selected}
							expanded={expanded}
							onSelect={onSelect}
							onToggleExpand={onToggleExpand}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export { TreeView }
