# Zune2Do Inline Images — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add inline image support (slash command, drag & drop, paste) to the Tiptap editor in Zune2Do todo detail pages.

**Architecture:** Images upload to Convex Storage via the existing `generateUploadUrl` pattern, then insert into Tiptap as `<img src="convex-url">`. The HTML is auto-saved in the `description` field. No schema change needed.

**Tech Stack:** `@tiptap/extension-image`, Convex Storage API, Tiptap 3.x

---

### Task 1: Install `@tiptap/extension-image`

**Files:**
- Modify: `apps/ops/package.json`

**Step 1: Install the dependency**

Run: `cd apps/ops && pnpm add @tiptap/extension-image`

**Step 2: Verify installation**

Run: `grep tiptap/extension-image apps/ops/package.json`
Expected: `"@tiptap/extension-image": "^3.x.x"`

**Step 3: Commit**

```bash
git add apps/ops/package.json pnpm-lock.yaml
git commit -m "feat(ops): add @tiptap/extension-image dependency"
```

---

### Task 2: Add `generateUploadUrl` mutation to todos

**Files:**
- Modify: `apps/ops/convex/todos.ts`

**Step 1: Add the mutation**

Add at the end of `apps/ops/convex/todos.ts`:

```typescript
export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx)
		return ctx.storage.generateUploadUrl()
	},
})
```

This is the same 4-line pattern used in `convex/clients.ts:36-41` and `convex/contractFiles.ts:31-36`.

**Step 2: Verify Convex picks it up**

Run: `cd apps/ops && npx convex dev --once`
Expected: no errors, mutation registered.

**Step 3: Commit**

```bash
git add apps/ops/convex/todos.ts
git commit -m "feat(ops): add generateUploadUrl mutation for todo images"
```

---

### Task 3: Add Image extension + upload pipeline to TiptapEditor

**Files:**
- Modify: `apps/ops/components/tiptap-editor.tsx`

**Step 1: Add imports**

At the top of `tiptap-editor.tsx`, add:

```typescript
import Image from "@tiptap/extension-image"
import { ImagePlus, Loader2 } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
```

Add `ImagePlus` to the existing lucide-react import (merge it). `Loader2` too.

**Step 2: Update component signature**

The `TiptapEditor` currently doesn't need Convex access. We need to call `generateUploadUrl` inside it. Since it's already a `"use client"` component and the todo detail page uses Convex, we can use `useMutation` directly inside the editor.

**Step 3: Add upload function and Image extension**

Inside the `TiptapEditor` component, before the `useEditor` call:

```typescript
const generateUploadUrl = useMutation(api.todos.generateUploadUrl)

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

async function uploadImage(file: File, editor: ReturnType<typeof useEditor>) {
	if (!editor) return

	if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
		toast.error("Format non supporté. Utilisez PNG, JPG, WebP ou GIF.")
		return
	}
	if (file.size > MAX_IMAGE_SIZE) {
		toast.error("Image trop lourde (max 5 MB).")
		return
	}

	// Insert a placeholder paragraph while uploading
	const placeholderText = "⏳ Upload en cours…"
	editor.chain().focus().insertContent(`<p><em>${placeholderText}</em></p>`).run()

	try {
		const url = await generateUploadUrl()
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": file.type },
			body: file,
		})
		const { storageId } = await res.json()

		// Get the public URL — we use a simple approach: construct from the upload response
		// Convex storage URLs are served via the deployment URL
		const storageUrl = `${url.split("/api/")[0]}/api/storage/${storageId}`

		// Remove placeholder and insert image
		const { doc } = editor.state
		let placeholderPos: number | null = null
		doc.descendants((node, pos) => {
			if (placeholderPos !== null) return false
			if (node.isText && node.text?.includes(placeholderText)) {
				placeholderPos = pos
				return false
			}
		})

		if (placeholderPos !== null) {
			// Find the paragraph containing the placeholder
			const resolved = doc.resolve(placeholderPos)
			const paragraphStart = resolved.before(resolved.depth)
			const paragraphEnd = resolved.after(resolved.depth)
			editor
				.chain()
				.focus()
				.deleteRange({ from: paragraphStart, to: paragraphEnd })
				.setImage({ src: storageUrl })
				.run()
		} else {
			// Fallback: just insert at cursor
			editor.chain().focus().setImage({ src: storageUrl }).run()
		}
	} catch {
		toast.error("Échec de l'upload.")
		// Try to remove placeholder
		const { doc } = editor.state
		doc.descendants((node, pos) => {
			if (node.isText && node.text?.includes(placeholderText)) {
				const resolved = doc.resolve(pos)
				editor
					.chain()
					.deleteRange({ from: resolved.before(resolved.depth), to: resolved.after(resolved.depth) })
					.run()
				return false
			}
		})
	}
}
```

**IMPORTANT NOTE:** The `storageUrl` construction above is wrong. Convex storage URLs can't be constructed client-side from a storageId. Instead, we need a query/mutation that calls `ctx.storage.getUrl(storageId)`. Here's the correct approach:

Add a new query in `convex/todos.ts`:

```typescript
export const getStorageUrl = query({
	args: { storageId: v.id("_storage") },
	handler: async (ctx, { storageId }) => {
		return ctx.storage.getUrl(storageId)
	},
})
```

But since queries are reactive and we need a one-shot call, use a mutation instead:

```typescript
export const getStorageUrl = mutation({
	args: { storageId: v.id("_storage") },
	handler: async (ctx, { storageId }) => {
		return ctx.storage.getUrl(storageId)
	},
})
```

Then in the editor, replace the storageUrl construction with:

```typescript
const getStorageUrl = useMutation(api.todos.getStorageUrl)

// In uploadImage, after getting storageId:
const storageUrl = await getStorageUrl({ storageId })
```

**Step 4: Add Image extension to useEditor**

In the `extensions` array (line 226-240), add `Image`:

```typescript
extensions: [
	StarterKit.configure({
		heading: { levels: [2, 3] },
	}),
	Image.configure({
		inline: false,
		allowBase64: false,
	}),
	TaskList,
	TaskItem.configure({ nested: true }),
	Placeholder.configure({ ... }),
],
```

**Step 5: Add handleDrop and handlePaste to editorProps**

In the `editorProps` object (line 242), add these handlers alongside the existing `handleKeyDown`:

```typescript
editorProps: {
	attributes: {
		class: "tiptap-notion prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px]",
	},
	handleDrop: (view, event, _slice, moved) => {
		if (moved || !event.dataTransfer?.files.length) return false
		const file = event.dataTransfer.files[0]
		if (!file || !file.type.startsWith("image/")) return false
		event.preventDefault()
		uploadImage(file, editorRef.current)
		return true
	},
	handlePaste: (_view, event) => {
		const items = event.clipboardData?.items
		if (!items) return false
		for (const item of items) {
			if (item.type.startsWith("image/")) {
				event.preventDefault()
				const file = item.getAsFile()
				if (file) uploadImage(file, editorRef.current)
				return true
			}
		}
		return false
	},
	handleKeyDown: (_view, event) => {
		// ... existing slash menu logic unchanged
	},
},
```

**Step 6: Commit**

```bash
git add apps/ops/components/tiptap-editor.tsx apps/ops/convex/todos.ts
git commit -m "feat(ops): add inline image upload to Tiptap editor"
```

---

### Task 4: Add `/image` slash command

**Files:**
- Modify: `apps/ops/components/tiptap-editor.tsx`

**Step 1: Add image command to SLASH_COMMANDS array**

Add to the `SLASH_COMMANDS` array (after the "Séparateur" entry, line 70):

```typescript
{ label: "Image", description: "Insérer une image", icon: <ImagePlus className="size-4" />, command: "image" },
```

**Step 2: Add image case to executeCommand switch**

In the `executeCommand` function (line 196-222), add a case for `"image"`:

```typescript
case "image": {
	// Open file picker
	const input = document.createElement("input")
	input.type = "file"
	input.accept = "image/png,image/jpeg,image/webp,image/gif"
	input.onchange = () => {
		const file = input.files?.[0]
		if (file) uploadImage(file, e)
	}
	input.click()
	break
}
```

**Step 3: Commit**

```bash
git add apps/ops/components/tiptap-editor.tsx
git commit -m "feat(ops): add /image slash command to editor"
```

---

### Task 5: Style inline images

**Files:**
- Modify: `apps/ops/app/globals.css` (or wherever tiptap styles live)

**Step 1: Find existing tiptap styles**

Search for `.tiptap-notion` or `ProseMirror` styles in the CSS.

**Step 2: Add image styles**

```css
.tiptap-notion img {
	max-width: 100%;
	height: auto;
	border-radius: 0.5rem;
	margin: 0.75rem 0;
}

.tiptap-notion img.ProseMirror-selectednode {
	outline: 2px solid oklch(0.585 0.22 275);
	outline-offset: 2px;
}
```

**Step 3: Commit**

```bash
git add apps/ops/app/globals.css
git commit -m "style(ops): add inline image styles for tiptap editor"
```

---

### Task 6: Manual QA

**Step 1: Start dev server**

Run: `pnpm dev:ops`

**Step 2: Test slash command**

- Open any todo detail page
- Type `/image` in the editor
- Select "Image" from slash menu
- Pick a PNG/JPG file → should upload and appear inline

**Step 3: Test drag & drop**

- Drag an image file from Finder into the editor
- Should upload and appear inline

**Step 4: Test paste**

- Copy an image (e.g. screenshot with Cmd+Shift+4, then Cmd+V)
- Should upload and appear inline

**Step 5: Test validation**

- Try uploading a .txt file → should show error toast
- Try uploading a >5MB image → should show error toast

**Step 6: Test persistence**

- Insert an image, navigate away, come back → image should still be there (saved in HTML)
