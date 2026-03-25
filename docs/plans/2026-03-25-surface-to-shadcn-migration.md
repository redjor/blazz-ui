# Surface → shadcn Tokens Migration

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the numbered surface-0..4 scale with semantic shadcn tokens (background, card, muted, popover) across the entire codebase.

**Architecture:** The surface scale collapses in light mode (surface-2/3/4 all = white), breaking hover states and elevation. Semantic tokens let each context have its own value independent of a linear scale. Migration is a CSS token rewrite + global find-and-replace in ~300 files.

**Tech Stack:** CSS custom properties, Tailwind v4 `@theme`, sed for bulk replacements.

---

## Token Mapping

| Old | New | Rationale |
|-----|-----|-----------|
| `bg-surface-0` | `bg-background` | Page backdrop |
| `bg-surface-1` | `bg-background` | Frame content area (same as page) |
| `bg-surface-2` | `bg-card` | Panels, tabs |
| `bg-surface` (bare) | `bg-card` | Cards, inputs, containers (349 uses mapped to surface-2) |
| `bg-surface-3` | `bg-muted` | Hover states, skeleton, badges, nav active |
| `bg-surface-3/XX` | `bg-muted/XX` | Opacity variants (table rows, sidebar hover) |
| `bg-surface-4` | `bg-popover` | Dialogs, sheets, menus, command palette |
| `bg-raised` | `bg-muted` | Elevated panels (12 uses, was surface-3) |
| `bg-panel` | `bg-popover` | Rare alias (0 uses in components) |
| `text-surface-3` | `text-muted-foreground` | Edge case (7 uses) |
| `ring-surface-3` | `ring-muted` | Edge case (4 uses) |

## Token Values

### Light
| Token | oklch | L |
|-------|-------|---|
| `background` | oklch(0.90 0 0) | 0.900 |
| `card` | oklch(1 0 0) | 1.000 |
| `muted` | oklch(0.955 0 0) | 0.955 |
| `accent` | oklch(0.955 0 0) | 0.955 |
| `secondary` | oklch(0.955 0 0) | 0.955 |
| `popover` | oklch(1 0 0) | 1.000 |

### Dark
| Token | oklch | L |
|-------|-------|---|
| `background` | oklch(0.145 0.005 270) | 0.145 |
| `card` | oklch(0.213 0.005 270) | 0.213 |
| `muted` | oklch(0.246 0.005 270) | 0.246 |
| `accent` | oklch(0.246 0.005 270) | 0.246 |
| `secondary` | oklch(0.246 0.005 270) | 0.246 |
| `popover` | oklch(0.28 0.005 270) | 0.280 |

### Borders (unchanged)
| Token | Light | Dark |
|-------|-------|------|
| `border-default` | oklch(0.88 0 0) | oklch(0.35 0.005 270 / 0.6) |
| `border-subtle` | oklch(0.92 0 0) | oklch(0.35 0.005 270 / 0.3) |

---

## Tasks

### Task 1: Rewrite CSS token definitions

**Files:**
- Modify: `packages/ui/styles/tokens.css`
- Modify: `apps/ops/app/globals.css`
- Modify: `apps/docs/src/styles/globals.css`

**Step 1: Rewrite `@theme inline` block**

Remove:
```css
--color-surface-0: var(--surface-0);
--color-surface-1: var(--surface-1);
--color-surface-2: var(--surface-2);
--color-surface-3: var(--surface-3);
--color-surface-4: var(--surface-4);
--color-surface: var(--surface-2);
--color-raised: var(--surface-3);
--color-panel: var(--surface-4);
```

Keep/update shadcn compat block:
```css
--color-background: var(--background);
--color-foreground: var(--text-primary);
--color-card: var(--card);
--color-card-foreground: var(--text-primary);
--color-muted: var(--muted);
--color-muted-foreground: var(--text-secondary);
--color-secondary: var(--secondary);
--color-secondary-foreground: var(--text-primary);
--color-accent: var(--accent);
--color-accent-foreground: var(--text-primary);
--color-primary: var(--accent-color);
--color-primary-foreground: var(--accent-foreground);
--color-popover: var(--popover);
--color-popover-foreground: var(--text-primary);
--color-border: var(--border-default);
--color-destructive: var(--destructive);
--color-input: var(--border-field);
--color-ring: var(--accent-color);
```

**Step 2: Rewrite `:root` light theme**

Replace surface-0..4 with:
```css
--background: oklch(0.90 0 0);
--card: oklch(1 0 0);
--muted: oklch(0.955 0 0);
--accent: oklch(0.955 0 0);
--secondary: oklch(0.955 0 0);
--popover: oklch(1 0 0);
```

**Step 3: Rewrite `html.dark` dark theme**

Replace surface-0..4 with:
```css
--background: oklch(0.145 0.005 270);
--card: oklch(0.213 0.005 270);
--muted: oklch(0.246 0.005 270);
--accent: oklch(0.246 0.005 270);
--secondary: oklch(0.246 0.005 270);
--popover: oklch(0.28 0.005 270);
```

**Step 4: Repeat for ops and docs globals.css**

**Step 5: Commit**
```
feat(ui): replace surface scale with semantic shadcn tokens in CSS
```

---

### Task 2: Bulk replace bg-surface-3 → bg-muted

**Scope:** All .tsx/.ts files in packages/ and apps/
**Count:** ~469 occurrences in 60 files

**Step 1: Replace with opacity variants first (longest match)**
```bash
# Order matters: longest patterns first
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-3\/80/bg-muted\/80/g'
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-3\/70/bg-muted\/70/g'
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-3\/60/bg-muted\/60/g'
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-3\/50/bg-muted\/50/g'
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-3\/40/bg-muted\/40/g'
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-3\/30/bg-muted\/30/g'
```

**Step 2: Replace bare bg-surface-3**
```bash
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-3/bg-muted/g'
```

**Step 3: Verify no remaining bg-surface-3**
```bash
grep -r 'bg-surface-3' --include='*.tsx' --include='*.ts' .
```
Expected: 0 matches (except maybe CSS definitions handled in Task 1)

**Step 4: Commit**
```
refactor: replace bg-surface-3 with bg-muted across all components
```

---

### Task 3: Bulk replace bg-surface-4 → bg-popover

**Scope:** 30 occurrences in 16 files

**Step 1: Replace**
```bash
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-4/bg-popover/g'
```

**Step 2: Verify**
```bash
grep -r 'bg-surface-4' --include='*.tsx' --include='*.ts' .
```

**Step 3: Commit**
```
refactor: replace bg-surface-4 with bg-popover
```

---

### Task 4: Bulk replace bg-surface-0, bg-surface-1, bg-surface-2

**Scope:** 31 occurrences total

**Step 1: Replace (order: longest first)**
```bash
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-0/bg-background/g'
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-1/bg-background/g'
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface-2/bg-card/g'
```

**Step 2: Verify**
```bash
grep -rE 'bg-surface-[012]' --include='*.tsx' --include='*.ts' .
```

**Step 3: Commit**
```
refactor: replace bg-surface-0/1/2 with bg-background and bg-card
```

---

### Task 5: Bulk replace bare bg-surface → bg-card

**Scope:** ~300 occurrences in ~200 files
**IMPORTANT:** Must run AFTER tasks 2-4 to avoid matching bg-surface-N patterns.

**Step 1: Replace**
```bash
# Use word boundary to avoid matching already-replaced tokens
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-surface\b/bg-card/g'
```

**Step 2: Verify no remaining bg-surface**
```bash
grep -rE '\bbg-surface\b' --include='*.tsx' --include='*.ts' .
```

**Step 3: Commit**
```
refactor: replace bg-surface with bg-card across all components
```

---

### Task 6: Replace bg-raised → bg-muted

**Scope:** 12 occurrences in 9 files

**Step 1: Replace**
```bash
find . -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/bg-raised/bg-muted/g'
```

**Step 2: Commit**
```
refactor: replace bg-raised with bg-muted
```

---

### Task 7: Handle edge cases (text-surface, ring-surface, border-surface)

**Scope:** ~11 occurrences in ~9 files — manual review required

**Step 1: Find all non-bg surface usages**
```bash
grep -rn 'text-surface\|ring-surface\|border-surface\|divide-surface\|outline-surface' --include='*.tsx' --include='*.ts' .
```

**Step 2: Replace manually**
- `text-surface-3` → `text-muted-foreground` (check context)
- `ring-surface-3` → `ring-muted`
- `ring-surface` → `ring-card`
- `border-surface` → `border-card`
- Review each to ensure semantic correctness

**Step 3: Commit**
```
refactor: migrate remaining surface token edge cases
```

---

### Task 8: Update color-tuner.tsx

**File:** `apps/ops/components/color-tuner.tsx`

**Step 1:** Replace surface token group with new semantic tokens:
```tsx
{
  name: "Surfaces",
  tokens: [
    { variable: "--background", label: "background (page)", light: { l: 0.90, c: 0, h: 0 }, dark: { l: 0.145, c: 0.005, h: 270 } },
    { variable: "--card", label: "card", light: { l: 1, c: 0, h: 0 }, dark: { l: 0.213, c: 0.005, h: 270 } },
    { variable: "--muted", label: "muted (hover)", light: { l: 0.955, c: 0, h: 0 }, dark: { l: 0.246, c: 0.005, h: 270 } },
    { variable: "--popover", label: "popover", light: { l: 1, c: 0, h: 0 }, dark: { l: 0.28, c: 0.005, h: 270 } },
  ],
},
```

**Step 2: Commit**
```
feat(ops): update color-tuner for new semantic tokens
```

---

### Task 9: Update docs color page

**File:** `apps/docs/src/app/docs/components/colors/page.tsx`

Check if it references surface-0..4 in documentation/examples and update to new token names.

**Step 1: Commit**
```
docs: update color docs for semantic tokens
```

---

### Task 10: Update AI.md

**File:** `packages/ui/AI.md`

Update any surface token references in the LLM documentation.

**Step 1: Commit**
```
docs: update AI.md with new semantic token names
```

---

### Task 11: Build verification

**Step 1: Run build**
```bash
pnpm build
```

**Step 2: Fix any remaining references**
If build errors reference surface tokens, fix them.

**Step 3: Visual check**
```bash
pnpm dev:ops
```
Verify: page background is gray (0.90), cards are white, hovers are visible (0.955).

---

## Execution Order

Tasks 1 → 2 → 3 → 4 → 5 (order critical) → 6 → 7 → 8 → 9 → 10 → 11

Tasks 2-4 MUST run before Task 5 (bare bg-surface replacement).
Task 7 requires manual review.
Task 11 is the final gate.
