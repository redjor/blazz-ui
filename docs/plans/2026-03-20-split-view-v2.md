# SplitView v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refonte du SplitView en compound components avec handle invisible, pointer events, et responsive mobile stack.

**Architecture:** Compound components via React Context. `SplitView` gère le state (ratio, dragging) et rend le handle internement entre `SplitView.Master` et `SplitView.Detail`. Responsive via media query CSS (`md:` breakpoint).

**Tech Stack:** React 19, TypeScript, Tailwind v4, @blazz/ui (cn utility), withProGuard

---

### Task 1: Rewrite SplitView component

**Files:**
- Rewrite: `packages/pro/src/components/blocks/split-view.tsx`

**Step 1: Write the new SplitView component**

Replace the entire file with:

```tsx
"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"

// ── Context ──────────────────────────────────────────────────────────────────

interface SplitViewContextValue {
	ratio: number
	isDragging: boolean
}

const SplitViewContext = createContext<SplitViewContextValue | null>(null)

function useSplitViewContext() {
	const ctx = useContext(SplitViewContext)
	if (!ctx) throw new Error("SplitView.Master/Detail must be used within <SplitView>")
	return ctx
}

// ── Props ────────────────────────────────────────────────────────────────────

export interface SplitViewProps {
	defaultRatio?: number
	minRatio?: number
	maxRatio?: number
	className?: string
	children: React.ReactNode
}

export interface SplitViewPanelProps {
	className?: string
	children: React.ReactNode
}

// ── SplitView (root) ─────────────────────────────────────────────────────────

function SplitViewBase({
	defaultRatio = 0.4,
	minRatio = 0.25,
	maxRatio = 0.6,
	className,
	children,
}: SplitViewProps) {
	const [ratio, setRatio] = useState(defaultRatio)
	const [isDragging, setIsDragging] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const handlePointerDown = useCallback(
		(e: React.PointerEvent) => {
			e.preventDefault()
			;(e.target as HTMLElement).setPointerCapture(e.pointerId)
			setIsDragging(true)
		},
		[],
	)

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!isDragging || !containerRef.current) return
			const rect = containerRef.current.getBoundingClientRect()
			const newRatio = (e.clientX - rect.left) / rect.width
			setRatio(Math.max(minRatio, Math.min(maxRatio, newRatio)))
		},
		[isDragging, minRatio, maxRatio],
	)

	const handlePointerUp = useCallback(() => {
		setIsDragging(false)
	}, [])

	// Prevent text selection during drag
	useEffect(() => {
		if (isDragging) {
			document.body.style.cursor = "col-resize"
			document.body.style.userSelect = "none"
		} else {
			document.body.style.cursor = ""
			document.body.style.userSelect = ""
		}
		return () => {
			document.body.style.cursor = ""
			document.body.style.userSelect = ""
		}
	}, [isDragging])

	return (
		<SplitViewContext.Provider value={{ ratio, isDragging }}>
			<div
				ref={containerRef}
				className={cn("flex h-full flex-col overflow-hidden md:flex-row", className)}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
			>
				{children}

				{/* Resize handle — rendered inside container, positioned between panels via CSS order */}
			</div>
		</SplitViewContext.Provider>
	)
}

// ── Master ───────────────────────────────────────────────────────────────────

function Master({ className, children }: SplitViewPanelProps) {
	const { ratio } = useSplitViewContext()

	return (
		<div
			className={cn("order-1 min-h-0 overflow-y-auto md:order-1", className)}
			style={{ flex: `0 0 ${ratio * 100}%` }}
		>
			{children}
		</div>
	)
}

// ── Handle (internal) ────────────────────────────────────────────────────────

function Handle({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
	const { isDragging } = useSplitViewContext()

	return (
		<div
			className="relative order-2 hidden w-0 cursor-col-resize md:block"
			onPointerDown={onPointerDown}
		>
			{/* Hit zone — 8px wide, invisible */}
			<div className="absolute inset-y-0 -left-1 w-2 z-10" />
			{/* Visual indicator — 1px line, visible on hover/drag */}
			<div
				className={cn(
					"absolute inset-y-0 left-0 w-px transition-colors duration-150",
					isDragging ? "bg-fg-muted" : "bg-transparent hover:bg-border",
				)}
			/>
		</div>
	)
}

// ── Detail ───────────────────────────────────────────────────────────────────

function Detail({ className, children }: SplitViewPanelProps) {
	return (
		<div className={cn("order-3 min-h-0 flex-1 overflow-y-auto md:order-3", className)}>
			{children}
		</div>
	)
}

// ── Assembly ─────────────────────────────────────────────────────────────────

// We need Handle to access context AND pass onPointerDown from the root.
// Solution: render Handle inside SplitViewBase and inject children around it.

// Actually, let's restructure: the root renders Master, Handle, Detail in order.
// But compound components mean children are Master and Detail.
// We need to intercept children and inject Handle between them.

// Simpler approach: render children as-is, and the Handle is part of Master's right edge.
// Even simpler: use CSS order. Children render in any order, CSS sorts them.
// Handle is rendered by the root, not by the consumer.
```

Wait — the Handle needs `onPointerDown` from the root, but also needs context. Let me restructure cleanly.

**Revised full implementation:**

```tsx
"use client"

import {
	Children,
	createContext,
	isValidElement,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"

// ── Context ──────────────────────────────────────────────────────────────────

interface SplitViewContextValue {
	ratio: number
}

const SplitViewContext = createContext<SplitViewContextValue | null>(null)

// ── Props ────────────────────────────────────────────────────────────────────

export interface SplitViewProps {
	/** Initial width ratio of the master panel (0–1). @default 0.4 */
	defaultRatio?: number
	/** Minimum width ratio. @default 0.25 */
	minRatio?: number
	/** Maximum width ratio. @default 0.6 */
	maxRatio?: number
	className?: string
	children: React.ReactNode
}

export interface SplitViewPanelProps {
	className?: string
	children: React.ReactNode
}

// ── SplitView (root) ─────────────────────────────────────────────────────────

function SplitViewBase({
	defaultRatio = 0.4,
	minRatio = 0.25,
	maxRatio = 0.6,
	className,
	children,
}: SplitViewProps) {
	const [ratio, setRatio] = useState(defaultRatio)
	const containerRef = useRef<HTMLDivElement>(null)
	const isDragging = useRef(false)
	const [dragging, setDragging] = useState(false)

	const handlePointerDown = useCallback((e: React.PointerEvent) => {
		e.preventDefault()
		;(e.target as HTMLElement).setPointerCapture(e.pointerId)
		isDragging.current = true
		setDragging(true)
	}, [])

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!isDragging.current || !containerRef.current) return
			const rect = containerRef.current.getBoundingClientRect()
			const newRatio = (e.clientX - rect.left) / rect.width
			setRatio(Math.max(minRatio, Math.min(maxRatio, newRatio)))
		},
		[minRatio, maxRatio],
	)

	const handlePointerUp = useCallback(() => {
		isDragging.current = false
		setDragging(false)
	}, [])

	useEffect(() => {
		if (dragging) {
			document.body.style.cursor = "col-resize"
			document.body.style.userSelect = "none"
		} else {
			document.body.style.cursor = ""
			document.body.style.userSelect = ""
		}
		return () => {
			document.body.style.cursor = ""
			document.body.style.userSelect = ""
		}
	}, [dragging])

	// Separate Master and Detail from children
	let masterNode: React.ReactNode = null
	let detailNode: React.ReactNode = null

	Children.forEach(children, (child) => {
		if (!isValidElement(child)) return
		if (child.type === Master) masterNode = child
		if (child.type === Detail) detailNode = child
	})

	return (
		<SplitViewContext.Provider value={{ ratio }}>
			<div
				ref={containerRef}
				className={cn("flex h-full flex-col overflow-hidden md:flex-row", className)}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
			>
				{/* Master panel */}
				{masterNode}

				{/* Resize handle — desktop only */}
				<div
					className="group relative hidden w-0 shrink-0 cursor-col-resize md:block"
					onPointerDown={handlePointerDown}
				>
					<div className="absolute inset-y-0 -left-1 z-10 w-2" />
					<div
						className={cn(
							"absolute inset-y-0 left-0 w-px transition-colors duration-150",
							dragging
								? "bg-fg-muted"
								: "bg-transparent group-hover:bg-border",
						)}
					/>
				</div>

				{/* Detail panel */}
				{detailNode}
			</div>
		</SplitViewContext.Provider>
	)
}

// ── Master ───────────────────────────────────────────────────────────────────

function Master({ className, children }: SplitViewPanelProps) {
	const ctx = useContext(SplitViewContext)
	if (!ctx) throw new Error("SplitView.Master must be used within <SplitView>")

	return (
		<div
			className={cn("min-h-0 shrink-0 overflow-y-auto", className)}
			style={{ width: `${ctx.ratio * 100}%` }}
		>
			{children}
		</div>
	)
}
Master.displayName = "SplitView.Master"

// ── Detail ───────────────────────────────────────────────────────────────────

function Detail({ className, children }: SplitViewPanelProps) {
	return (
		<div className={cn("min-h-0 min-w-0 flex-1 overflow-y-auto", className)}>
			{children}
		</div>
	)
}
Detail.displayName = "SplitView.Detail"

// ── Export ────────────────────────────────────────────────────────────────────

const SplitViewGuarded = withProGuard(SplitViewBase, "SplitView")

export const SplitView = Object.assign(SplitViewGuarded, {
	Master,
	Detail,
})
```

**Step 2: Verify it builds**

Run: `cd packages/pro && pnpm build`
Expected: BUILD SUCCESS

**Step 3: Commit**

```bash
git add packages/pro/src/components/blocks/split-view.tsx
git commit -m "feat(pro): rewrite SplitView as compound components with pointer events"
```

---

### Task 2: Update barrel exports

**Files:**
- Modify: `packages/pro/src/components/blocks/index.ts:92-93`

**Step 1: Update the export to include new types**

Replace lines 92-93:
```ts
export type { SplitViewProps } from "./split-view"
export { SplitView } from "./split-view"
```

With:
```ts
export type { SplitViewProps, SplitViewPanelProps } from "./split-view"
export { SplitView } from "./split-view"
```

**Step 2: Verify build**

Run: `cd packages/pro && pnpm build`
Expected: BUILD SUCCESS

**Step 3: Commit**

```bash
git add packages/pro/src/components/blocks/index.ts
git commit -m "feat(pro): export SplitViewPanelProps from blocks barrel"
```

---

### Task 3: Update docs page

**Files:**
- Rewrite: `apps/docs/src/routes/_docs/docs/blocks/split-view.tsx`

**Step 1: Update the doc page demos to use compound component API**

Key changes:
- All `<SplitView master={...} detail={...} emptyDetail={...}>` become `<SplitView><SplitView.Master>...</SplitView.Master><SplitView.Detail>...</SplitView.Detail></SplitView>`
- The `emptyDetail` prop no longer exists — the consumer handles it inside `SplitView.Detail` with a conditional
- Update the props table: remove `master`, `detail`, `emptyDetail`, add `children`
- Update `SplitViewPanelProps` section
- Update code examples strings

The `ContactListItem`, `ContactDetail`, `HeroDemo`, `BasicDemo`, `CustomRatioDemo` all need updating.

Example of updated HeroDemo:
```tsx
function HeroDemo() {
	const [selectedId, setSelectedId] = useState<string | null>("1")
	const selected = contacts.find((c) => c.id === selectedId)

	return (
		<SplitView>
			<SplitView.Master>
				<div className="border-b border-edge px-4 py-3">
					<p className="text-sm font-semibold text-fg">Contacts</p>
					<p className="text-xs text-fg-muted">{contacts.length} résultats</p>
				</div>
				{contacts.map((c) => (
					<ContactListItem
						key={c.id}
						contact={c}
						selected={c.id === selectedId}
						onClick={() => setSelectedId(c.id)}
					/>
				))}
			</SplitView.Master>
			<SplitView.Detail>
				{selected ? (
					<ContactDetail contact={selected} />
				) : (
					<div className="flex h-full items-center justify-center text-sm text-fg-muted">
						Sélectionnez un contact
					</div>
				)}
			</SplitView.Detail>
		</SplitView>
	)
}
```

**Step 2: Update props table**

Replace `splitViewProps` array:
```ts
const splitViewProps: DocProp[] = [
	{
		name: "defaultRatio",
		type: "number",
		default: "0.4",
		description: "Initial width ratio of the master panel (0 to 1).",
	},
	{
		name: "minRatio",
		type: "number",
		default: "0.25",
		description: "Minimum width ratio the master panel can be resized to.",
	},
	{
		name: "maxRatio",
		type: "number",
		default: "0.6",
		description: "Maximum width ratio the master panel can be resized to.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the outer container.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Must contain SplitView.Master and SplitView.Detail.",
	},
]
```

Add a second props table section for `SplitView.Master` / `SplitView.Detail`:
```ts
const panelProps: DocProp[] = [
	{
		name: "className",
		type: "string",
		description: "Additional classes for the panel container.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Panel content.",
	},
]
```

**Step 3: Verify docs build**

Run: `pnpm dev:docs` and check `/docs/blocks/split-view` loads without errors.

**Step 4: Commit**

```bash
git add apps/docs/src/routes/_docs/docs/blocks/split-view.tsx
git commit -m "docs: update SplitView doc page for compound component API"
```

---

### Task 4: Update thumbnail preview

**Files:**
- Modify: `apps/docs/src/components/thumbnails/block-previews.tsx` (SplitViewPreview function)

**Step 1: Update SplitViewPreview to use new API**

```tsx
export function SplitViewPreview() {
	return (
		<div className="h-[360px] w-[640px] p-4">
			<SplitView defaultRatio={0.35}>
				<SplitView.Master>
					<div className="divide-y divide-edge">
						{splitViewItems.map((item) => (
							<div
								key={item.name}
								className={`flex items-center gap-3 px-4 py-3 ${item.active ? "bg-brand/5" : ""}`}
							>
								<div className="flex size-8 items-center justify-center rounded-full bg-surface-3 text-xs font-medium">
									{item.name.charAt(0)}
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-fg">{item.name}</p>
									<p className="text-xs text-fg-muted">{item.subtitle}</p>
								</div>
								<ChevronRight className="size-4 text-fg-muted" />
							</div>
						))}
					</div>
				</SplitView.Master>
				<SplitView.Detail>
					{/* detail content stays the same */}
				</SplitView.Detail>
			</SplitView>
		</div>
	)
}
```

**Step 2: Verify docs build**

Run: `pnpm dev:docs`

**Step 3: Commit**

```bash
git add apps/docs/src/components/thumbnails/block-previews.tsx
git commit -m "docs: update SplitView thumbnail for compound component API"
```

---

### Task 5: Final verification

**Step 1: Full build**

Run: `pnpm build`
Expected: All packages and apps build successfully.

**Step 2: Type check**

Run: `cd packages/pro && pnpm type-check`
Expected: No type errors.

**Step 3: Lint**

Run: `pnpm lint`
Expected: No lint errors.
