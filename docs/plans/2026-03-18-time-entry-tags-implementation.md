# Time Entry Tags — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add free-form, multi-value tags to time entries with autocomplete from previously used tags.

**Architecture:** Inline `tags: string[]` on timeEntries (no separate table). New `distinctTags` query for autocomplete. Tag input component with comma/enter to add, × to remove.

**Tech Stack:** Convex (schema + mutations + queries), React, react-hook-form, zod, @blazz/ui primitives

---

### Task 1: Add `tags` field to Convex schema

**Files:**
- Modify: `apps/ops/convex/schema.ts:92-117`

**Step 1: Add tags to timeEntries schema**

In `schema.ts`, add `tags` field to the timeEntries table definition, after `status`:

```ts
tags: v.optional(v.array(v.string())),
```

Insert after line 109 (closing paren of status union), before `createdAt: v.number()`.

**Step 2: Verify Convex picks up the change**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema pushed successfully.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add tags field to timeEntries schema"
```

---

### Task 2: Add `tags` to create & update mutations

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts:83-137`

**Step 1: Add tags arg to `create` mutation**

In the `create` mutation args (line 84-98), add after `status`:

```ts
tags: v.optional(v.array(v.string())),
```

The handler already spreads `...args` into the insert, so tags will be stored automatically.

**Step 2: Add tags arg to `update` mutation**

In the `update` mutation args (line 109-124), add after `status`:

```ts
tags: v.optional(v.array(v.string())),
```

The handler already spreads `...fields` into the patch, so tags will be updated automatically.

**Step 3: Verify**

Run: `cd apps/ops && npx convex dev --once`
Expected: Functions pushed successfully.

**Step 4: Commit**

```bash
git add apps/ops/convex/timeEntries.ts
git commit -m "feat(ops): accept tags in create/update time entry mutations"
```

---

### Task 3: Add `distinctTags` query

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts`

**Step 1: Add the query**

Add this query at the end of the file (before the closing):

```ts
export const distinctTags = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const entries = await ctx.db
			.query("timeEntries")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		const tagSet = new Set<string>()
		for (const entry of entries) {
			if (entry.tags) {
				for (const tag of entry.tags) {
					tagSet.add(tag)
				}
			}
		}
		return [...tagSet].sort()
	},
})
```

**Step 2: Verify**

Run: `cd apps/ops && npx convex dev --once`
Expected: Functions pushed successfully.

**Step 3: Commit**

```bash
git add apps/ops/convex/timeEntries.ts
git commit -m "feat(ops): add distinctTags query for autocomplete"
```

---

### Task 4: Create TagInput component

**Files:**
- Create: `apps/ops/components/tag-input.tsx`

**Step 1: Create the component**

```tsx
"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { X } from "lucide-react"
import { useRef, useState, useCallback, useEffect } from "react"

interface TagInputProps {
	value: string[]
	onChange: (tags: string[]) => void
	suggestions?: string[]
	placeholder?: string
}

export function TagInput({ value, onChange, suggestions = [], placeholder = "Ajouter un tag…" }: TagInputProps) {
	const [input, setInput] = useState("")
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const filtered = suggestions.filter(
		(s) => s.includes(input.toLowerCase()) && !value.includes(s)
	)

	const addTag = useCallback(
		(tag: string) => {
			const normalized = tag.toLowerCase().trim()
			if (normalized && !value.includes(normalized)) {
				onChange([...value, normalized])
			}
			setInput("")
			setShowSuggestions(false)
			setSelectedIndex(0)
		},
		[value, onChange]
	)

	const removeTag = useCallback(
		(tag: string) => {
			onChange(value.filter((t) => t !== tag))
		},
		[value, onChange]
	)

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if ((e.key === "Enter" || e.key === ",") && input.trim()) {
			e.preventDefault()
			if (showSuggestions && filtered.length > 0) {
				addTag(filtered[selectedIndex])
			} else {
				addTag(input)
			}
		} else if (e.key === "Backspace" && !input && value.length > 0) {
			removeTag(value[value.length - 1])
		} else if (e.key === "ArrowDown" && showSuggestions) {
			e.preventDefault()
			setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
		} else if (e.key === "ArrowUp" && showSuggestions) {
			e.preventDefault()
			setSelectedIndex((i) => Math.max(i - 1, 0))
		} else if (e.key === "Escape") {
			setShowSuggestions(false)
		}
	}

	// Close suggestions on click outside
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setShowSuggestions(false)
			}
		}
		document.addEventListener("mousedown", handler)
		return () => document.removeEventListener("mousedown", handler)
	}, [])

	return (
		<div ref={containerRef} className="relative">
			<div
				className="flex min-h-8 flex-wrap items-center gap-1.5 rounded-md border border-edge bg-surface px-2.5 py-1.5 text-sm transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20"
				onClick={() => inputRef.current?.focus()}
			>
				{value.map((tag) => (
					<Badge key={tag} variant="secondary" className="gap-1 pl-2 pr-1 text-xs">
						{tag}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								removeTag(tag)
							}}
							className="rounded-sm p-0.5 transition-colors hover:bg-fg/10"
						>
							<X className="size-3" />
						</button>
					</Badge>
				))}
				<input
					ref={inputRef}
					value={input}
					onChange={(e) => {
						setInput(e.target.value)
						setShowSuggestions(true)
						setSelectedIndex(0)
					}}
					onFocus={() => setShowSuggestions(true)}
					onKeyDown={handleKeyDown}
					placeholder={value.length === 0 ? placeholder : ""}
					className="min-w-[80px] flex-1 border-0 bg-transparent p-0 text-sm text-fg outline-none placeholder:text-fg-muted"
				/>
			</div>

			{showSuggestions && input && filtered.length > 0 && (
				<div className="absolute z-50 mt-1 w-full rounded-md border border-edge bg-surface shadow-md">
					{filtered.slice(0, 8).map((suggestion, i) => (
						<button
							key={suggestion}
							type="button"
							className={`w-full px-3 py-1.5 text-left text-sm transition-colors ${
								i === selectedIndex
									? "bg-brand/10 text-brand"
									: "text-fg hover:bg-surface-3"
							}`}
							onMouseDown={(e) => {
								e.preventDefault()
								addTag(suggestion)
							}}
							onMouseEnter={() => setSelectedIndex(i)}
						>
							{suggestion}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/tag-input.tsx
git commit -m "feat(ops): add TagInput component with autocomplete"
```

---

### Task 5: Add tags to TimeEntryForm

**Files:**
- Modify: `apps/ops/components/time-entry-form.tsx`

**Step 1: Update zod schema**

Add to the schema object (line 26-33), after `status`:

```ts
tags: z.array(z.string()).optional().default([]),
```

**Step 2: Add imports**

Add at the top:

```ts
import { TagInput } from "@/components/tag-input"
```

Add to the convex useQuery imports area:

```ts
const allTags = useQuery(api.timeEntries.distinctTags)
```

**Step 3: Add tags to form defaultValues**

In the `isEdit` branch of defaultValues (line 72-81), add:

```ts
tags: defaultValues.tags ?? [],
```

In the else branch (line 82-87), add:

```ts
tags: [],
```

**Step 4: Add tags to EditDefaults interface**

Add to `EditDefaults` (line 37-45):

```ts
tags?: string[]
```

**Step 5: Pass tags in submit handler**

In `onSubmit`, add `tags: values.tags` to both the `update()` and `create()` calls. Add it after the `status` field.

In the `reset()` call after create, add `tags: []`.

**Step 6: Add TagInput field to form JSX**

Insert between the description textarea (line 216) and the billable checkbox (line 218):

```tsx
<div className="space-y-1.5">
	<Label>Tags</Label>
	<TagInput
		value={watch("tags") ?? []}
		onChange={(tags) => setValue("tags", tags)}
		suggestions={allTags ?? []}
	/>
</div>
```

**Step 7: Verify the form works**

Run: `pnpm dev:ops`
Navigate to Today → click "Nouvelle entrée" → verify tags field appears.

**Step 8: Commit**

```bash
git add apps/ops/components/time-entry-form.tsx
git commit -m "feat(ops): add tags field to time entry form"
```

---

### Task 6: Add tags to QuickTimeEntryModal

**Files:**
- Modify: `apps/ops/components/quick-time-entry-modal.tsx`

**Step 1: Update zod schema**

Add to the schema object (line 25-29):

```ts
tags: z.array(z.string()).optional().default([]),
```

**Step 2: Add imports**

```ts
import { useQuery } from "convex/react"  // already has useMutation, change to include useQuery
import { TagInput } from "@/components/tag-input"
import { api } from "@/convex/_generated/api"  // already imported, just use api.timeEntries.distinctTags
```

Add query:

```ts
const allTags = useQuery(api.timeEntries.distinctTags)
```

**Step 3: Add tags to defaultValues and reset**

In `defaultValues` (line 63): add `tags: []`
In `reset()` calls (line 67 and 85): add `tags: []`

**Step 4: Pass tags in create call**

In `onSubmit`, add to the `create()` args (line 76-83):

```ts
tags: values.tags?.length ? values.tags : undefined,
```

**Step 5: Add TagInput to form JSX**

Insert between the description input and the billable checkbox (between line 156 and 158):

```tsx
<div className="space-y-1.5">
	<Label>Tags</Label>
	<TagInput
		value={watch("tags") ?? []}
		onChange={(tags) => setValue("tags", tags)}
		suggestions={allTags ?? []}
	/>
</div>
```

**Step 6: Commit**

```bash
git add apps/ops/components/quick-time-entry-modal.tsx
git commit -m "feat(ops): add tags to quick time entry modal"
```

---

### Task 7: Show tags on Today page entries

**Files:**
- Modify: `apps/ops/app/(main)/today/_client.tsx`

**Step 1: Add tag pills to entry list items**

In the `todayEntries.map()` render (around line 137-166), modify the button content to show tags. After the description span (line 154-156), add a tags display:

Replace the entry button inner content with:

```tsx
<span
	className="size-1.5 shrink-0 rounded-full"
	style={{
		backgroundColor: entry.billable
			? "var(--color-brand)"
			: "var(--color-fg-muted)",
	}}
/>
<span className="min-w-0 flex-1">
	<span className="truncate text-sm text-fg block">
		{entry.description || project?.name || "—"}
	</span>
	{entry.tags && entry.tags.length > 0 && (
		<span className="flex gap-1 mt-0.5">
			{entry.tags.map((tag) => (
				<span
					key={tag}
					className="inline-block rounded-full bg-surface-3 px-1.5 py-0 text-[11px] text-fg-muted"
				>
					{tag}
				</span>
			))}
		</span>
	)}
</span>
<span className="shrink-0 text-xs text-fg-muted">
	{project?.name ?? "—"}
</span>
<span className="shrink-0 font-mono text-sm tabular-nums text-fg-muted">
	{formatMinutes(entry.minutes)}
</span>
```

**Step 2: Pass tags to edit form**

In the edit dialog (line 290-299), add `tags` to the `defaultValues` prop:

```ts
tags: editingEntry.tags,
```

**Step 3: Commit**

```bash
git add apps/ops/app/(main)/today/_client.tsx
git commit -m "feat(ops): display tags on today page entries"
```

---

### Task 8: Add Tags column to Time list DataTable

**Files:**
- Modify: `apps/ops/app/(main)/time/_client.tsx`

**Step 1: Add tags column to columns definition**

In the `columns` useMemo (around line 212), add a new column after the `description` column (after line 283):

```ts
{
	id: "tags",
	accessorFn: (row) => (row.tags ?? []).join(", "),
	header: "Tags",
	cell: ({ row }) => {
		const tags = row.original.tags
		if (!tags || tags.length === 0) return <span className="text-fg-muted">—</span>
		return (
			<span className="flex gap-1 flex-wrap">
				{tags.map((tag) => (
					<span
						key={tag}
						className="inline-block rounded-full bg-surface-3 px-1.5 py-0 text-[11px] text-fg-muted"
					>
						{tag}
					</span>
				))}
			</span>
		)
	},
	enableSorting: false,
},
```

**Step 2: Pass tags to edit form**

Find where `editing` entry is passed to `TimeEntryForm` as `defaultValues` and add `tags: editing.tags`.

**Step 3: Commit**

```bash
git add apps/ops/app/(main)/time/_client.tsx
git commit -m "feat(ops): add Tags column to time entries data table"
```

---

### Task 9: Final verification

**Step 1: Run full build check**

```bash
cd apps/ops && pnpm build
```

Expected: Build succeeds.

**Step 2: Manual smoke test**

1. Open Today page → create entry with tags → verify tags appear in list
2. Edit entry → verify tags are pre-filled → modify tags → save → verify
3. Quick modal → add tags → verify they persist
4. Time → List view → verify Tags column shows pills
5. Create entry without tags → verify "—" shows in Tags column

**Step 3: Final commit if any fixes needed**
