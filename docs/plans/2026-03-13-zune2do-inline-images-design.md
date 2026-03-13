# Zune2Do — Inline Images Design

## Summary
Add inline image support to the Tiptap editor in Zune2Do todo detail pages. Users can insert images via slash command `/image`, drag & drop, or paste (Cmd+V). Images are uploaded to Convex Storage and embedded as URLs in the Tiptap HTML content.

## Architecture

**Storage:** Convex Storage (existing pattern from logos/contracts). No new table — image URLs live in the Tiptap HTML stored in `description`.

**Extension:** `@tiptap/extension-image` added to the editor.

## Upload Pipeline (shared by all 3 methods)

```
User action (slash cmd / drag-drop / paste)
  → File selected
  → Client validation (type + size ≤ 5MB)
  → generateUploadUrl() Convex mutation
  → POST file to signed URL
  → Get storageId from response
  → ctx.storage.getUrl(storageId) → permanent URL
  → editor.chain().setImage({ src: url }).run()
  → Debounced auto-save → HTML saved in description
```

## Changes

### 1. `convex/todos.ts` — New mutation
- `generateUploadUrl`: 3-line mutation, same pattern as `clients.ts`

### 2. `components/tiptap-editor.tsx` — Editor enhancements
- Add `Image` extension from `@tiptap/extension-image`
- `uploadImage(file)` function — Convex upload pipeline
- Slash command `/image` in existing slash menu
- `handleDrop` and `handlePaste` editor props for drag & drop and paste
- CSS styling for inline images (max-width, border-radius)

### 3. `package.json` — New dependency
- `@tiptap/extension-image`

## Constraints
- Accepted types: PNG, JPG, WebP, GIF
- Max size: 5 MB per image
- Error toast on invalid file
- Loading placeholder during upload
- No limit on number of images per todo

## Out of Scope
- No separate table for images (URL lives in HTML)
- No gallery/sidebar view
- No in-editor resize (v1)
- No Convex storage cleanup when image removed from text (future)
