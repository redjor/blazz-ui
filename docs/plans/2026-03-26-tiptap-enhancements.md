# Tiptap Editor Enhancements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add drag handles, text color/highlight, and table support to the existing Tiptap editor in apps/ops.

**Architecture:** Three independent features added as Tiptap extensions. Drag handles use a custom ProseMirror plugin (no @tiptap-pro). Color/highlight use official @tiptap extensions with popover pickers in the bubble menu. Tables use official @tiptap table extensions with a contextual toolbar.

**Tech Stack:** Tiptap v3.20.1 extensions, ProseMirror plugins, @blazz/ui components, Tailwind CSS

---

### Task 1: Install dependencies

**Files:**
- Modify: `apps/ops/package.json`

**Step 1: Install all needed Tiptap extensions**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app
pnpm add --filter ops @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-highlight @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-header @tiptap/extension-table-cell
```

**Step 2: Commit**

```bash
git add apps/ops/package.json pnpm-lock.yaml
git commit -m "feat(ops): add tiptap color, highlight, and table extensions"
```

---

### Task 2: Color & Highlight — Extensions + Bubble Menu

**Files:**
- Modify: `apps/ops/components/tiptap-editor.tsx`
- Modify: `apps/ops/app/globals.css`

**Step 1: Add extensions to editor config**

In `tiptap-editor.tsx`, add imports:

```typescript
import Color from "@tiptap/extension-color"
import TextStyle from "@tiptap/extension-text-style"
import Highlight from "@tiptap/extension-highlight"
import { Baseline, Highlighter } from "lucide-react"
```

Add to the `extensions` array inside `useEditor`:

```typescript
TextStyle,
Color,
Highlight.configure({ multicolor: true }),
```

**Step 2: Create color picker popovers for bubble menu**

Add a `ColorPickerPopover` component inside tiptap-editor.tsx (above `TiptapEditor`):

```tsx
const TEXT_COLORS = [
	{ label: "Default", value: "" },
	{ label: "Red", value: "oklch(0.65 0.22 25)" },
	{ label: "Orange", value: "oklch(0.7 0.17 55)" },
	{ label: "Yellow", value: "oklch(0.8 0.15 85)" },
	{ label: "Green", value: "oklch(0.7 0.17 150)" },
	{ label: "Blue", value: "oklch(0.65 0.2 260)" },
	{ label: "Purple", value: "oklch(0.6 0.22 300)" },
	{ label: "Pink", value: "oklch(0.7 0.18 350)" },
	{ label: "Gray", value: "oklch(0.55 0.01 270)" },
]

const HIGHLIGHT_COLORS = [
	{ label: "None", value: "" },
	{ label: "Yellow", value: "oklch(0.92 0.1 95)" },
	{ label: "Green", value: "oklch(0.9 0.1 150)" },
	{ label: "Blue", value: "oklch(0.9 0.1 240)" },
	{ label: "Purple", value: "oklch(0.9 0.1 300)" },
	{ label: "Pink", value: "oklch(0.9 0.1 350)" },
	{ label: "Orange", value: "oklch(0.9 0.1 60)" },
]

function ColorPicker({
	colors,
	activeColor,
	onSelect,
}: {
	colors: { label: string; value: string }[]
	activeColor: string
	onSelect: (color: string) => void
}) {
	return (
		<div className="grid grid-cols-5 gap-1 p-1.5">
			{colors.map((c) => (
				<button
					key={c.label}
					type="button"
					title={c.label}
					onClick={() => onSelect(c.value)}
					className={`size-6 rounded-md border transition-transform hover:scale-110 ${
						activeColor === c.value
							? "border-white ring-1 ring-white/50"
							: "border-white/20"
					}`}
					style={{
						backgroundColor: c.value || "transparent",
						...(c.value === "" ? { backgroundImage: "linear-gradient(135deg, transparent 45%, red 45%, red 55%, transparent 55%)" } : {}),
					}}
				/>
			))}
		</div>
	)
}
```

**Step 3: Add color buttons to bubble menu**

In the BubbleMenu JSX, after the H3 button, add:

```tsx
<div className="w-px h-4 bg-white/20 mx-0.5" />
{/* Text color */}
<div className="relative group">
	<BubbleButton
		onClick={() => {}}
		active={!!editor.getAttributes("textStyle").color}
		title="Couleur du texte"
	>
		<Baseline className="size-3.5" />
	</BubbleButton>
	<div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block z-50">
		<div className="bg-[oklch(0.2_0.005_285)] border border-white/10 rounded-lg shadow-xl p-1">
			<ColorPicker
				colors={TEXT_COLORS}
				activeColor={editor.getAttributes("textStyle").color ?? ""}
				onSelect={(color) => {
					if (color) {
						editor.chain().focus().setColor(color).run()
					} else {
						editor.chain().focus().unsetColor().run()
					}
				}}
			/>
		</div>
	</div>
</div>
{/* Highlight */}
<div className="relative group">
	<BubbleButton
		onClick={() => {}}
		active={!!editor.getAttributes("highlight").color}
		title="Surlignage"
	>
		<Highlighter className="size-3.5" />
	</BubbleButton>
	<div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block z-50">
		<div className="bg-[oklch(0.2_0.005_285)] border border-white/10 rounded-lg shadow-xl p-1">
			<ColorPicker
				colors={HIGHLIGHT_COLORS}
				activeColor={editor.getAttributes("highlight").color ?? ""}
				onSelect={(color) => {
					if (color) {
						editor.chain().focus().toggleHighlight({ color }).run()
					} else {
						editor.chain().focus().unsetHighlight().run()
					}
				}}
			/>
		</div>
	</div>
</div>
```

**Step 4: Commit**

```bash
git add apps/ops/components/tiptap-editor.tsx
git commit -m "feat(ops): add text color and highlight to Tiptap bubble menu"
```

---

### Task 3: Table Support — Extensions + Slash Menu + Table Toolbar

**Files:**
- Modify: `apps/ops/components/tiptap-editor.tsx`
- Modify: `apps/ops/app/globals.css`

**Step 1: Add table extensions to editor config**

In `tiptap-editor.tsx`, add imports:

```typescript
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import { Table as TableIcon, Columns, Rows, Trash2 } from "lucide-react"
```

Add to `extensions` array:

```typescript
Table.configure({ resizable: false }),
TableRow,
TableHeader,
TableCell,
```

**Step 2: Add "Tableau" entry in slash menu**

Add to `SLASH_COMMANDS` array (in the style group, after "Image"):

```typescript
{
	label: "Tableau",
	hint: "|||",
	icon: <TableIcon className="size-4" />,
	command: "table",
},
```

Add case in `executeCommand` switch:

```typescript
case "table":
	e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
	break
```

**Step 3: Add table toolbar**

Add a `TableToolbar` component inside tiptap-editor.tsx that shows contextual actions when cursor is in a table:

```tsx
function TableToolbar({
	editor,
}: {
	editor: NonNullable<ReturnType<typeof useEditor>>
}) {
	if (!editor.isActive("table")) return null

	return (
		<div className="flex items-center gap-0.5 bg-[oklch(0.2_0.005_285)] border border-white/10 rounded-lg px-1 py-0.5 shadow-xl mb-2">
			<BubbleButton
				onClick={() => editor.chain().focus().addColumnBefore().run()}
				title="Colonne avant"
			>
				<Columns className="size-3.5" />
			</BubbleButton>
			<BubbleButton
				onClick={() => editor.chain().focus().addColumnAfter().run()}
				title="Colonne après"
			>
				<Columns className="size-3.5" />
			</BubbleButton>
			<BubbleButton
				onClick={() => editor.chain().focus().deleteColumn().run()}
				title="Supprimer colonne"
			>
				<Columns className="size-3.5 text-red-400" />
			</BubbleButton>
			<div className="w-px h-4 bg-white/20 mx-0.5" />
			<BubbleButton
				onClick={() => editor.chain().focus().addRowBefore().run()}
				title="Ligne avant"
			>
				<Rows className="size-3.5" />
			</BubbleButton>
			<BubbleButton
				onClick={() => editor.chain().focus().addRowAfter().run()}
				title="Ligne après"
			>
				<Rows className="size-3.5" />
			</BubbleButton>
			<BubbleButton
				onClick={() => editor.chain().focus().deleteRow().run()}
				title="Supprimer ligne"
			>
				<Rows className="size-3.5 text-red-400" />
			</BubbleButton>
			<div className="w-px h-4 bg-white/20 mx-0.5" />
			<BubbleButton
				onClick={() => editor.chain().focus().deleteTable().run()}
				title="Supprimer tableau"
			>
				<Trash2 className="size-3.5 text-red-400" />
			</BubbleButton>
		</div>
	)
}
```

Render the toolbar just before `<EditorContent>`:

```tsx
<TableToolbar editor={editor} />
<EditorContent editor={editor} />
```

Note: The TableToolbar is rendered above the editor, not as a floating element. It appears/disappears based on whether cursor is in a table. The editor needs `shouldRerenderOnTransaction: true` OR we need to force re-render on selection changes. Since the editor currently has `shouldRerenderOnTransaction: false`, we need to change this to make table toolbar reactive. Alternatively, use a local state + onSelectionUpdate.

Better approach: add `onSelectionUpdate` to the editor config to track table state:

```typescript
// Add state in TiptapEditor:
const [isInTable, setIsInTable] = useState(false)

// Add to useEditor config:
onSelectionUpdate: ({ editor: e }) => {
	setIsInTable(e.isActive("table"))
},
```

Then render `{isInTable && <TableToolbar editor={editor} />}`.

**Step 4: Add table CSS**

In `apps/ops/app/globals.css`, add after the existing `.tiptap-notion img.ProseMirror-selectednode` rule:

```css
/* Tables */
.tiptap-notion table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  overflow: hidden;
}

.tiptap-notion th,
.tiptap-notion td {
  border: 1px solid var(--border-default);
  padding: 0.5rem 0.75rem;
  vertical-align: top;
  min-width: 80px;
  position: relative;
}

.tiptap-notion th {
  font-weight: 600;
  background: var(--muted);
  text-align: left;
}

.tiptap-notion td > p,
.tiptap-notion th > p {
  margin: 0;
}

.tiptap-notion .selectedCell::after {
  content: "";
  position: absolute;
  inset: 0;
  background: oklch(0.585 0.22 275 / 0.15);
  pointer-events: none;
}
```

**Step 5: Commit**

```bash
git add apps/ops/components/tiptap-editor.tsx apps/ops/app/globals.css
git commit -m "feat(ops): add table support to Tiptap editor"
```

---

### Task 4: Drag Handles — ProseMirror Plugin

**Files:**
- Create: `apps/ops/components/tiptap-drag-handle.tsx`
- Modify: `apps/ops/components/tiptap-editor.tsx`
- Modify: `apps/ops/app/globals.css`

**Step 1: Create the drag handle plugin**

Create `apps/ops/components/tiptap-drag-handle.tsx`:

This is a Tiptap extension that creates a drag handle UI element. It uses a ProseMirror plugin to:
- Track mouse position over the editor
- Resolve which top-level block the cursor is nearest to
- Position a floating handle element to the left of that block
- Handle drag start/end with ProseMirror's built-in NodeSelection

```tsx
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, NodeSelection } from "@tiptap/pm/state"
import { GripVertical, Plus } from "lucide-react"
import { createRoot } from "react-dom/client"

const HANDLE_WIDTH = 48 // width of handle container
const dragHandlePluginKey = new PluginKey("dragHandle")

function createHandleElement() {
	const wrapper = document.createElement("div")
	wrapper.className = "tiptap-drag-handle"
	wrapper.draggable = false

	// Plus button
	const plusBtn = document.createElement("button")
	plusBtn.type = "button"
	plusBtn.className = "tiptap-drag-handle-btn tiptap-drag-handle-plus"
	plusBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`

	// Drag button
	const dragBtn = document.createElement("button")
	dragBtn.type = "button"
	dragBtn.className = "tiptap-drag-handle-btn tiptap-drag-handle-grip"
	dragBtn.draggable = true
	dragBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>`

	wrapper.appendChild(plusBtn)
	wrapper.appendChild(dragBtn)

	return { wrapper, plusBtn, dragBtn }
}

export const DragHandle = Extension.create({
	name: "dragHandle",

	addProseMirrorPlugins() {
		const { editor } = this

		let currentNodePos: number | null = null
		const { wrapper, plusBtn, dragBtn } = createHandleElement()

		return [
			new Plugin({
				key: dragHandlePluginKey,

				view(editorView) {
					// Append handle to editor's parent
					const editorDom = editorView.dom
					const parent = editorDom.parentElement
					if (parent) {
						parent.style.position = "relative"
						parent.appendChild(wrapper)
					}

					// Plus button: simulate "/" keystroke at the start of the hovered block
					plusBtn.addEventListener("mousedown", (e) => {
						e.preventDefault()
						e.stopPropagation()
						if (currentNodePos === null) return

						// Set cursor to start of block and insert "/"
						const pos = currentNodePos + 1
						const tr = editorView.state.tr.setSelection(
							editorView.state.selection.constructor.near(
								editorView.state.doc.resolve(pos)
							)
						)
						editorView.dispatch(tr)
						editorView.focus()

						// Insert "/" to trigger slash menu
						const insertTr = editorView.state.tr.insertText("/", editorView.state.selection.from)
						editorView.dispatch(insertTr)
					})

					// Drag button: start drag with NodeSelection
					dragBtn.addEventListener("dragstart", (e) => {
						if (currentNodePos === null) return
						const node = editorView.state.doc.nodeAt(currentNodePos)
						if (!node) return

						const sel = NodeSelection.create(editorView.state.doc, currentNodePos)
						editorView.dispatch(editorView.state.tr.setSelection(sel))

						// Set drag data
						const slice = editorView.state.selection.content()
						const { dom, text } = editorView.serializeForClipboard(slice)
						e.dataTransfer?.clearData()
						e.dataTransfer?.setData("text/html", dom.innerHTML)
						e.dataTransfer?.setData("text/plain", text)
						e.dataTransfer!.effectAllowed = "move"

						// Drag image
						const nodeEl = editorView.nodeDOM(currentNodePos) as HTMLElement | null
						if (nodeEl) {
							e.dataTransfer?.setDragImage(nodeEl, 0, 0)
						}

						wrapper.classList.add("dragging")
					})

					dragBtn.addEventListener("dragend", () => {
						wrapper.classList.remove("dragging")
					})

					return {
						update(view) {
							// Position is updated in handleDOMEvents.mousemove
						},
						destroy() {
							wrapper.remove()
						},
					}
				},

				props: {
					handleDOMEvents: {
						mousemove(view, event) {
							// Find the top-level node under mouse
							const editorRect = view.dom.getBoundingClientRect()
							const y = event.clientY

							// Find position in document
							const pos = view.posAtCoords({ left: editorRect.left + 10, top: y })
							if (!pos) {
								wrapper.style.display = "none"
								return false
							}

							// Resolve to top-level block
							const resolved = view.state.doc.resolve(pos.pos)
							const topLevelPos = resolved.start(1) - 1

							if (topLevelPos < 0) {
								wrapper.style.display = "none"
								return false
							}

							const node = view.state.doc.nodeAt(topLevelPos)
							if (!node) {
								wrapper.style.display = "none"
								return false
							}

							currentNodePos = topLevelPos

							// Position the handle
							const nodeEl = view.nodeDOM(topLevelPos) as HTMLElement | null
							if (!nodeEl || !nodeEl.getBoundingClientRect) {
								wrapper.style.display = "none"
								return false
							}

							const nodeRect = nodeEl.getBoundingClientRect()
							const parentRect = view.dom.parentElement!.getBoundingClientRect()

							wrapper.style.display = "flex"
							wrapper.style.top = `${nodeRect.top - parentRect.top}px`
							wrapper.style.left = `-${HANDLE_WIDTH + 4}px`

							return false
						},

						mouseleave(_view, _event) {
							// Delay hiding to allow hovering over the handle itself
							setTimeout(() => {
								if (!wrapper.matches(":hover")) {
									wrapper.style.display = "none"
								}
							}, 100)
							return false
						},
					},
				},
			}),
		]
	},
})
```

**Step 2: Add drag handle CSS to globals.css**

```css
/* Drag handle */
.tiptap-drag-handle {
  display: none;
  position: absolute;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  z-index: 10;
  transition: opacity 0.15s;
}

.tiptap-drag-handle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  color: var(--text-muted);
  cursor: grab;
  transition: background-color 0.15s, color 0.15s;
}

.tiptap-drag-handle-btn:hover {
  background-color: var(--muted);
  color: var(--text-default);
}

.tiptap-drag-handle-plus {
  cursor: pointer;
}

.tiptap-drag-handle.dragging .tiptap-drag-handle-grip {
  cursor: grabbing;
}

.tiptap-drag-handle-grip:active {
  cursor: grabbing;
}
```

**Step 3: Register extension in editor**

In `tiptap-editor.tsx`, add import:

```typescript
import { DragHandle } from "./tiptap-drag-handle"
```

Add to `extensions` array:

```typescript
DragHandle,
```

Add padding-left to the editor container to make room for drag handles. In the editor wrapper `<div className="relative">`, add a style or class that gives left padding:

Change the wrapper div to:
```tsx
<div className="relative pl-14">
```

This gives 56px left padding so the drag handles (48px wide) have space.

**Step 4: Commit**

```bash
git add apps/ops/components/tiptap-drag-handle.tsx apps/ops/components/tiptap-editor.tsx apps/ops/app/globals.css
git commit -m "feat(ops): add drag handles to Tiptap editor blocks"
```

---

### Task 5: Test & Polish

**Step 1: Start dev server**

```bash
pnpm dev:ops
```

**Step 2: Test each feature**

Open a note at `http://localhost:3120/notes`:

**Drag handles:**
1. Hover over any block → verify handle (⠿) + plus (+) appear on the left
2. Click + → verify slash menu opens at that position
3. Drag a block → verify it moves to new position
4. Test with headings, paragraphs, lists, images, tables

**Color/Highlight:**
1. Select text → bubble menu appears
2. Hover over A (color) button → palette appears
3. Select a color → text changes color
4. Select "Default" → color resets
5. Hover over highlighter → palette appears
6. Select a highlight color → background appears
7. Select "None" → highlight removed

**Tables:**
1. Type `/` → select "Tableau"
2. 3x3 table appears with header row
3. Cursor in table → table toolbar appears above editor
4. Add column → column added
5. Delete column → column removed
6. Add row → row added
7. Delete row → row removed
8. Delete table → entire table removed
9. Type in cells, verify formatting works inside cells

**Step 3: Fix issues and commit**

```bash
git add -u
git commit -m "fix(ops): polish drag handles, color, and table features"
```
