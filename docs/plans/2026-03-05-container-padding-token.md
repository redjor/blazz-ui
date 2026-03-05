# Container Padding Token — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `--container-padding` CSS token and utility classes to unify padding across flat container components (Card, Dialog, Sheet, Popover, HoverCard, Alert).

**Architecture:** Single CSS custom property in `tokens.css` consumed via utility classes (`.p-container`, `.px-container`, etc.) and Tailwind arbitrary values for edge cases. Components replace hardcoded padding values with the token.

**Tech Stack:** CSS custom properties, Tailwind v4 (arbitrary values), React components

---

### Task 1: Add token and utility classes to tokens.css

**Files:**
- Modify: `packages/ui/styles/tokens.css:117-124` (Density section in `:root`)
- Modify: `packages/ui/styles/tokens.css:187-194` (Density section in `html.dark`)
- Modify: `packages/ui/styles/tokens.css:48-51` (Spacing section in `@theme inline`)
- Modify: `packages/ui/styles/tokens.css:569` (inside `@layer base`, before `* { border-color...}`)

**Step 1: Add token to `:root` Density section (line ~122, after `--section-gap`)**

```css
--container-padding: 1rem;
```

**Step 2: Add token to `html.dark` Density section (line ~192, after `--section-gap`)**

```css
--container-padding: 1rem;
```

**Step 3: Add Tailwind utility alias in `@theme inline` Spacing section (line ~51)**

```css
--spacing-container: var(--container-padding);
```

**Step 4: Add utility classes inside `@layer base` block (before `* { border-color...}` at line 569)**

```css
/* Container padding utilities */
.p-container  { padding: var(--container-padding); }
.px-container { padding-inline: var(--container-padding); }
.py-container { padding-block: var(--container-padding); }
.pt-container { padding-top: var(--container-padding); }
.-mx-container { margin-inline: calc(-1 * var(--container-padding)); }
.-mt-container { margin-top: calc(-1 * var(--container-padding)); }
.-mb-container { margin-bottom: calc(-1 * var(--container-padding)); }
```

**Step 5: Commit**

```bash
git add packages/ui/styles/tokens.css
git commit -m "feat(ui): add --container-padding token and utility classes"
```

---

### Task 2: Migrate Card component

**Files:**
- Modify: `packages/ui/src/components/ui/card.tsx`

**Step 1: Update CardHeader — replace `px-4 pt-4` with `px-container pt-container`**

```tsx
// line 36 — before:
"px-4 pt-4",
// after:
"px-container pt-container",
```

Also update the sm variant negative overrides:
```tsx
// line 37 — before:
"group-data-[size=sm]/card:px-0 group-data-[size=sm]/card:pt-0 group-data-[size=sm]/card:pb-3",
// after (unchanged — sm stays hardcoded):
"group-data-[size=sm]/card:px-0 group-data-[size=sm]/card:pt-0 group-data-[size=sm]/card:pb-3",
```

**Step 2: Update CardContent — replace `p-4` with `p-container`**

```tsx
// line 90 — before:
className={cn("group-data-[size=sm]/card:p-0 p-4", className)}
// after:
className={cn("group-data-[size=sm]/card:p-0 p-container", className)}
```

**Step 3: Update CardFooter — replace `p-4` with `p-container`**

```tsx
// line 102 — before:
"p-4 group-data-[size=sm]/card:p-3",
// after:
"p-container group-data-[size=sm]/card:p-3",
```

**Step 4: Commit**

```bash
git add packages/ui/src/components/ui/card.tsx
git commit -m "feat(ui): migrate Card to --container-padding token"
```

---

### Task 3: Migrate Dialog component

**Files:**
- Modify: `packages/ui/src/components/ui/dialog.tsx`

**Step 1: Update DialogContent — replace `p-4` with `p-container`**

In the long className string on line 62, replace `p-4` with `p-container`:

```tsx
// before (extract):
"... rounded-xl p-4 text-sm ring-1 ..."
// after:
"... rounded-xl p-container text-sm ring-1 ..."
```

**Step 2: Update DialogHeader — replace `-mx-4 -mt-4 p-4` with utility classes**

```tsx
// line 92 — before:
"gap-2 flex flex-col -mx-4 -mt-4 p-4",
// after:
"gap-2 flex flex-col -mx-container -mt-container p-container",
```

**Step 3: Update DialogFooter — replace `-mx-4 -mb-4 p-4` with utility classes**

```tsx
// line 113 — before:
"bg-raised -mx-4 -mb-4 rounded-b-xl border-t border-separator p-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
// after:
"bg-raised -mx-container -mb-container rounded-b-xl border-t border-separator p-container flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
```

**Step 4: Commit**

```bash
git add packages/ui/src/components/ui/dialog.tsx
git commit -m "feat(ui): migrate Dialog to --container-padding token"
```

---

### Task 4: Migrate Sheet component

**Files:**
- Modify: `packages/ui/src/components/ui/sheet.tsx`

**Step 1: Update SheetHeader — replace `px-4 pt-4 pb-3`**

`pb-3` (0.75rem) is 75% of container-padding. Use style prop for the proportional value.

```tsx
// line 113 — before:
className={cn(
    "flex flex-col gap-1.5 px-4 pt-4 pb-3 border-b border-separator",
    className
)}
// after:
className={cn(
    "flex flex-col gap-1.5 px-container pt-container border-b border-separator",
    className
)}
style={{ paddingBottom: 'calc(var(--container-padding) * 0.75)' }}
```

**Step 2: Update SheetFooter — replace `px-4 py-3`**

`py-3` (0.75rem) is 75% of container-padding.

```tsx
// line 136-137 — before:
className={cn(
    "bg-raised border-t border-separator px-4 py-3 flex gap-2 justify-end",
    className
)}
// after:
className={cn(
    "bg-raised border-t border-separator px-container flex gap-2 justify-end",
    className
)}
style={{ paddingBlock: 'calc(var(--container-padding) * 0.75)' }}
```

**Step 3: Commit**

```bash
git add packages/ui/src/components/ui/sheet.tsx
git commit -m "feat(ui): migrate Sheet to --container-padding token"
```

---

### Task 5: Migrate Popover and HoverCard components

**Files:**
- Modify: `packages/ui/src/components/ui/popover.tsx`
- Modify: `packages/ui/src/components/ui/hover-card.tsx`

**Step 1: Update PopoverContent — replace `p-2.5` with `p-container`**

In the long className on line 43, replace `p-2.5` with `p-container`:

```tsx
// before (extract):
"... rounded-lg p-2.5 text-sm ..."
// after:
"... rounded-lg p-container text-sm ..."
```

**Step 2: Update HoverCardContent — replace `p-2.5` with `p-container`**

In the long className on line 41, replace `p-2.5` with `p-container`:

```tsx
// before (extract):
"... rounded-lg p-2.5 text-sm ..."
// after:
"... rounded-lg p-container text-sm ..."
```

**Step 3: Commit**

```bash
git add packages/ui/src/components/ui/popover.tsx packages/ui/src/components/ui/hover-card.tsx
git commit -m "feat(ui): migrate Popover and HoverCard to --container-padding token"
```

---

### Task 6: Migrate Alert component

**Files:**
- Modify: `packages/ui/src/components/ui/alert.tsx`

**Step 1: Update Alert cva — replace `px-2.5 py-2`**

`py-2` (0.5rem) is 50% of container-padding. Use style prop for vertical.

```tsx
// line 7 — before (extract from cva):
"... rounded-lg border px-2.5 py-2 text-left ..."
// after:
"... rounded-lg border px-container text-left ..."
```

Then add style prop on the Alert `<div>`:

```tsx
// line 31 — before:
className={cn(alertVariants({ variant }), className)}
// after:
className={cn(alertVariants({ variant }), className)}
style={{ paddingBlock: 'calc(var(--container-padding) * 0.5)' }}
```

**Step 2: Commit**

```bash
git add packages/ui/src/components/ui/alert.tsx
git commit -m "feat(ui): migrate Alert to --container-padding token"
```

---

### Task 7: Visual verification

**Step 1: Run the docs app**

```bash
pnpm dev:docs
```

**Step 2: Verify these pages in browser (port 3100)**

Check that padding looks correct (unchanged from before — should be 16px everywhere):
- Card component page
- Dialog component page
- Popover component page
- Alert component page

**Step 3: Test override — add `--container-padding: 0.5rem` via browser DevTools**

On any page, add to `:root` in DevTools:
```css
--container-padding: 0.5rem;
```

Verify all containers shrink their padding uniformly.

**Step 4: Build check**

```bash
pnpm build
```

Ensure no build errors.

**Step 5: Commit (if any fixes needed)**
