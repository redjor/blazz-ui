# Inbox + SplitView Integration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make SplitView handle visible with grip, remove Inbox layout wrappers, migrate consumers to use SplitView directly.

**Architecture:** Update SplitView handle from invisible to visible grip. Remove `Inbox`, `InboxSidebar`, `InboxDetail` from inbox.tsx. Update barrel exports. Migrate apps/ops notifications page and apps/docs inbox page to compose with SplitView.

**Tech Stack:** React 19, TypeScript, Tailwind v4, @blazz/pro, @blazz/ui

---

### Task 1: Update SplitView handle to visible grip

**Files:**
- Modify: `packages/pro/src/components/blocks/split-view.tsx:113-127`

**Step 1: Replace the invisible handle with a visible grip**

Replace the handle block (lines 113-127):
```tsx
{/* Resize handle — desktop only */}
<div
	className="group relative hidden w-0 shrink-0 cursor-col-resize md:block"
	onPointerDown={handlePointerDown}
>
	<div className="absolute inset-y-0 -left-1 z-10 w-2" />
	<div
		className={cn(
			"absolute inset-y-0 left-0 w-px transition-colors duration-150 ease-out",
			dragging
				? "bg-fg-muted"
				: "bg-transparent group-hover:bg-border",
		)}
	/>
</div>
```

With:
```tsx
{/* Resize handle — desktop only */}
<div
	className={cn(
		"hidden w-1 shrink-0 cursor-col-resize items-center justify-center transition-colors duration-150 ease-out md:flex",
		dragging ? "bg-surface-3" : "hover:bg-surface-3",
	)}
	onPointerDown={handlePointerDown}
>
	<div className="h-8 w-0.5 rounded-full bg-border" />
</div>
```

**Step 2: Verify build**

Run: `cd packages/pro && pnpm build`
Expected: BUILD SUCCESS

**Step 3: Commit**

```bash
git add packages/pro/src/components/blocks/split-view.tsx
git commit -m "feat(pro): SplitView handle visible with grip"
```

---

### Task 2: Remove Inbox layout wrappers from inbox.tsx

**Files:**
- Modify: `packages/pro/src/components/blocks/inbox.tsx`

**Step 1: Delete Inbox, InboxSidebar, InboxDetail**

Remove these sections from inbox.tsx (keep everything else):

1. Delete `InboxProps` interface (lines 613-616)
2. Delete `InboxBase` function (lines 618-620)
3. Delete `export const Inbox = withProGuard(...)` (line 622)
4. Delete `InboxSidebarProps` interface (lines 628-632)
5. Delete `InboxSidebar` function (lines 634-643)
6. Delete `InboxDetailProps` interface (lines 649-652)
7. Delete `InboxDetail` function (lines 654-658)

Keep all other components: `InboxHeader`, `InboxPanel`, `InboxList`, `InboxItem`, `InboxDetailEmpty`, `InboxDetailCard`, `filterInboxItems`, and all types.

**Step 2: Verify build**

Run: `cd packages/pro && pnpm build`
Expected: BUILD SUCCESS

**Step 3: Commit**

```bash
git add packages/pro/src/components/blocks/inbox.tsx
git commit -m "refactor(pro): remove Inbox, InboxSidebar, InboxDetail layout wrappers"
```

---

### Task 3: Update barrel exports

**Files:**
- Modify: `packages/pro/src/components/blocks/index.ts:33-61`

**Step 1: Remove deleted exports**

Replace the inbox type exports (lines 33-50):
```ts
export type {
	InboxActionType,
	InboxAuthor,
	InboxDetailEmptyProps,
	InboxDetailProps,
	InboxFilters,
	InboxHeaderProps,
	InboxItemProps,
	InboxListProps,
	InboxMenuAction,
	InboxNotification,
	InboxPanelProps,
	InboxPriority,
	InboxProps,
	InboxReadFilter,
	InboxSidebarProps,
	InboxStatusVariant,
} from "./inbox"
```

With (remove `InboxDetailProps`, `InboxProps`, `InboxSidebarProps`):
```ts
export type {
	InboxActionType,
	InboxAuthor,
	InboxDetailEmptyProps,
	InboxFilters,
	InboxHeaderProps,
	InboxItemProps,
	InboxListProps,
	InboxMenuAction,
	InboxNotification,
	InboxPanelProps,
	InboxPriority,
	InboxReadFilter,
	InboxStatusVariant,
} from "./inbox"
```

Replace the inbox value exports (lines 51-61):
```ts
export {
	filterInboxItems,
	Inbox,
	InboxDetail,
	InboxDetailEmpty,
	InboxHeader,
	InboxItem,
	InboxList,
	InboxPanel,
	InboxSidebar,
} from "./inbox"
```

With (remove `Inbox`, `InboxDetail`, `InboxSidebar`):
```ts
export {
	filterInboxItems,
	InboxDetailEmpty,
	InboxHeader,
	InboxItem,
	InboxList,
	InboxPanel,
} from "./inbox"
```

**Step 2: Verify build**

Run: `cd packages/pro && pnpm build`
Expected: BUILD SUCCESS

**Step 3: Commit**

```bash
git add packages/pro/src/components/blocks/index.ts
git commit -m "refactor(pro): remove Inbox/InboxSidebar/InboxDetail from barrel exports"
```

---

### Task 4: Migrate apps/ops notifications page

**Files:**
- Modify: `apps/ops/app/(main)/notifications/_client.tsx`

**Step 1: Replace Inbox wrapper with SplitView**

The current code uses:
```tsx
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
```

Replace with:
```tsx
import { SplitView } from "@blazz/pro/components/blocks/split-view"
import {
	InboxHeader,
	InboxPanel,
	InboxList,
	InboxItem,
	InboxDetailEmpty,
	filterInboxItems,
	type InboxFilters,
	type InboxNotification,
} from "@blazz/pro/components/blocks/inbox"
```

Replace the JSX return (lines 55-88):
```tsx
return (
	<Inbox className="h-[calc(100vh-3.5rem)]">
		<InboxSidebar width={380}>
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
```

With:
```tsx
return (
	<SplitView defaultRatio={0.35} className="h-[calc(100vh-3.5rem)]">
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
						<InboxItem
							key={item.id}
							item={item}
							selected={selectedId === item.id}
							onClick={handleSelect}
						/>
					))}
				</InboxList>
			</InboxPanel>
		</SplitView.Master>
		<SplitView.Detail>
			{selectedNotification ? (
				<NotificationDetail notification={selectedNotification} />
			) : (
				<InboxDetailEmpty />
			)}
		</SplitView.Detail>
	</SplitView>
)
```

**Step 2: Verify build**

Run: `cd apps/ops && pnpm build`
Expected: BUILD SUCCESS (note: `typescript.ignoreBuildErrors: true` in next.config.mjs)

**Step 3: Commit**

```bash
git add apps/ops/app/(main)/notifications/_client.tsx
git commit -m "refactor(ops): migrate notifications page to SplitView"
```

---

### Task 5: Update docs inbox page

**Files:**
- Modify: `apps/docs/src/routes/_docs/docs/blocks/inbox.tsx`

**Step 1: Update all Inbox/InboxSidebar/InboxDetail usages**

Read the file first. Then:

1. Update imports: remove `Inbox`, `InboxSidebar`, `InboxDetail`. Add `SplitView` from `@blazz/pro/components/blocks/split-view`.

2. Replace all `<Inbox>` / `<InboxSidebar>` / `<InboxDetail>` patterns with `<SplitView>` / `<SplitView.Master>` / `<SplitView.Detail>` in:
   - Code example strings (the `examples` array)
   - Live demo components (HeroDemo, etc.)
   - Props tables: remove InboxProps/InboxSidebarProps/InboxDetailProps sections if they exist, or update references

3. Pattern to find and replace:
   - `<Inbox ...>` → `<SplitView defaultRatio={0.35} ...>`
   - `<InboxSidebar ...>` → `<SplitView.Master className="flex flex-col">`
   - `</InboxSidebar>` → `</SplitView.Master>`
   - `<InboxDetail>` → `<SplitView.Detail>`
   - `</InboxDetail>` → `</SplitView.Detail>`
   - `</Inbox>` → `</SplitView>`

**Step 2: Verify docs build**

Run: `pnpm dev:docs` and check `/docs/blocks/inbox` loads.

**Step 3: Commit**

```bash
git add apps/docs/src/routes/_docs/docs/blocks/inbox.tsx
git commit -m "docs: update inbox doc page to use SplitView instead of layout wrappers"
```

---

### Task 6: Final verification

**Step 1: Full build**

Run: `pnpm build`
Expected: All packages and apps build successfully.

**Step 2: Lint modified files**

Run: `npx biome check packages/pro/src/components/blocks/split-view.tsx packages/pro/src/components/blocks/inbox.tsx packages/pro/src/components/blocks/index.ts apps/ops/app/\(main\)/notifications/_client.tsx`
Expected: No errors.
