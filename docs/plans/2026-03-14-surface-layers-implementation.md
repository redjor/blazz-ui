# Surface Layers Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current surface token system (`--bg-app`, `--bg-surface`, `--bg-raised`, `--bg-overlay` + zone-specific tokens) with a hierarchical 5-level scale (`surface-0` to `surface-4`) using `color-mix(in oklch)`.

**Architecture:** Define 2 anchor values (`--surface-base`, `--surface-top`) per theme. Compute 3 intermediate levels via `color-mix`. Map old tokens as aliases for backward compat. Migrate components incrementally.

**Tech Stack:** CSS custom properties, `color-mix(in oklch)`, Tailwind v4 `@theme inline`

**Design doc:** `docs/plans/2026-03-14-surface-layers-design.md`

---

## Phase 1 — Add new tokens + backward compat aliases

### Task 1: Add surface scale to `packages/ui/styles/tokens.css`

**Files:**
- Modify: `packages/ui/styles/tokens.css`

**Step 1: Add surface scale variables in `:root` block**

After the existing `/* Surfaces */` section in `:root` (line ~88), add the new scale:

```css
/* Surface layer scale */
--surface-base: oklch(0.94 0 0);
--surface-top:  oklch(1.0 0 0);
--surface-0: var(--surface-base);
--surface-1: color-mix(in oklch, var(--surface-base) 75%, var(--surface-top));
--surface-2: color-mix(in oklch, var(--surface-base) 50%, var(--surface-top));
--surface-3: color-mix(in oklch, var(--surface-base) 25%, var(--surface-top));
--surface-4: var(--surface-top);
```

**Step 2: Add surface scale variables in `html.dark` block**

After the existing `/* Surfaces */` section in `html.dark` (line ~159), add:

```css
/* Surface layer scale */
--surface-base: oklch(0.145 0.005 285);
--surface-top:  oklch(0.28 0.005 285);
--surface-0: var(--surface-base);
--surface-1: color-mix(in oklch, var(--surface-base) 75%, var(--surface-top));
--surface-2: color-mix(in oklch, var(--surface-base) 50%, var(--surface-top));
--surface-3: color-mix(in oklch, var(--surface-base) 25%, var(--surface-top));
--surface-4: var(--surface-top);
```

**Step 3: Add surface scale to corporate theme (light + dark)**

In `html[data-theme="corporate"]` (line ~220), add:

```css
--surface-base: oklch(0.94 0 0);
--surface-top:  oklch(1.0 0 0);
```

In `html[data-theme="corporate"].dark` (line ~238), add:

```css
--surface-base: oklch(0.145 0 0);
--surface-top:  oklch(0.28 0 0);
```

The `--surface-0` through `--surface-4` computed vars are inherited from `:root` / `html.dark` — no need to repeat the `color-mix` formulas per theme.

**Step 4: Add surface scale to warm theme (light + dark)**

In `html[data-theme="warm"]` (line ~260), add:

```css
--surface-base: oklch(0.93 0.01 75);
--surface-top:  oklch(0.995 0.005 75);
```

In `html[data-theme="warm"].dark` (line ~278), add:

```css
--surface-base: oklch(0.155 0.01 60);
--surface-top:  oklch(0.28 0.01 60);
```

**Step 5: Add Tailwind utilities in `@theme inline` block**

In the `@theme inline` block (line ~3), replace the existing `/* Surfaces */` section:

```css
/* Surfaces — hierarchical layer scale */
--color-surface-0: var(--surface-0);
--color-surface-1: var(--surface-1);
--color-surface-2: var(--surface-2);
--color-surface-3: var(--surface-3);
--color-surface-4: var(--surface-4);

/* Surfaces — backward compat aliases (deprecated) */
--color-surface: var(--surface-2);
--color-raised: var(--surface-3);
--color-panel: var(--surface-4);
```

**Step 6: Update shadcn compat section in `@theme inline`**

Update the shadcn compat mappings to point to new scale:

```css
--color-background: var(--surface-1);
--color-muted: var(--surface-3);
--color-secondary: var(--surface-3);
--color-accent: var(--surface-3);
--color-popover: var(--surface-4);
```

**Step 7: Add layout token aliases pointing to new scale**

In each theme's layout section, update:

```css
--top-background: var(--surface-0);
--main-background: var(--surface-1);
--sidebar-background: var(--surface-0);
```

**Step 8: Verify build**

Run: `cd /Users/jonathanruas/Development/blazz-ui-app && pnpm build`
Expected: Build succeeds — all old classes (`bg-surface`, `bg-raised`, `bg-panel`) still work via aliases.

**Step 9: Commit**

```bash
git add packages/ui/styles/tokens.css
git commit -m "feat(tokens): add hierarchical surface layer scale (surface-0 to surface-4)"
```

---

### Task 2: Mirror surface scale in app globals.css files

The 3 app globals.css files duplicate token definitions from `packages/ui`. They need the same `--surface-base` and `--surface-top` values added to their theme blocks.

**Files:**
- Modify: `apps/docs/src/styles/globals.css`
- Modify: `apps/examples/app/globals.css`
- Modify: `apps/ops/app/globals.css`

**Step 1: For each globals.css, add to every `:root` / `html.dark` / theme block**

Add `--surface-base` and `--surface-top` with the same values as in `tokens.css`. Add the `--surface-0` through `--surface-4` computed vars in `:root` and `html.dark` only.

**Step 2: Update `@theme inline` in each globals.css**

Same changes as Task 1 Step 5-6 (add `--color-surface-0` through `--color-surface-4`, update compat aliases).

**Step 3: Update layout token aliases**

Same as Task 1 Step 7 (`--top-background`, `--main-background`, `--sidebar-background` → new scale).

**Step 4: Verify all apps build**

Run: `pnpm build`
Expected: All apps build successfully.

**Step 5: Commit**

```bash
git add apps/docs/src/styles/globals.css apps/examples/app/globals.css apps/ops/app/globals.css
git commit -m "feat(apps): mirror surface layer scale in app globals.css"
```

---

## Phase 2 — Migrate `packages/ui` components

### Task 3: Migrate frame/layout components (highest priority)

**Files:**
- Modify: `packages/ui/src/components/patterns/frame.tsx` — replace `--top-background` and `--main-background` CSS var usage with `--surface-0` / `--surface-1`
- Modify: `packages/ui/src/components/ui/sidebar.tsx` — replace `--sidebar-background` with `--surface-0`, `bg-raised` with `bg-surface-3`
- Modify: `packages/ui/src/components/patterns/navigation-tabs/navigation-tabs-bar.tsx` — replace `--sidebar-background` with `--surface-0`
- Modify: `packages/ui/src/components/patterns/app-top-bar.tsx` — replace `bg-raised` with `bg-surface-3`

**Step 1: Update each file**

Replace CSS var references and Tailwind classes per the mapping:
- `var(--top-background)` → `var(--surface-0)`
- `var(--main-background)` → `var(--surface-1)`
- `var(--sidebar-background)` → `var(--surface-0)`
- `bg-raised` → `bg-surface-3`

**Step 2: Verify build**

Run: `pnpm build`

**Step 3: Commit**

```bash
git add packages/ui/src/components/patterns/frame.tsx packages/ui/src/components/ui/sidebar.tsx packages/ui/src/components/patterns/navigation-tabs/navigation-tabs-bar.tsx packages/ui/src/components/patterns/app-top-bar.tsx
git commit -m "feat(layout): migrate frame/sidebar/topbar to surface-N tokens"
```

---

### Task 4: Migrate UI primitives (bg-panel → bg-surface-4)

**Files (all in `packages/ui/src/components/ui/`):**
- `button.tsx`, `dropdown-menu.tsx`, `dialog.tsx`, `sheet.tsx`, `command.tsx`, `select.tsx`, `menu.tsx`, `chart.tsx`, `popover.tsx`, `filter-panel.tsx`, `tags-input.tsx`

**Step 1: Global search-replace in `packages/ui/src/components/ui/`**

Replace all `bg-panel` → `bg-surface-4`

**Step 2: Migrate CSS var usages**
- `avatar.tsx`: `--bg-surface` → `--surface-2`
- `toast.tsx`: `--bg-overlay` → `--surface-4`
- `switch.tsx`: `bg-raised` → `bg-surface-3`

**Step 3: Verify build**

Run: `pnpm build`

**Step 4: Commit**

```bash
git add packages/ui/src/components/ui/
git commit -m "feat(ui): migrate primitives to surface-N tokens"
```

---

### Task 5: Migrate block components (bg-raised → bg-surface-3)

**Files (all in `packages/ui/src/components/blocks/`):**
- `data-table/data-table.tsx`, `data-table/data-table-actions-bar.tsx`, `data-table/data-table-bulk-selection-bar.tsx`
- `stats-grid.tsx`, `stats-strip.tsx`, `activity-timeline.tsx`, `kanban-board.tsx`, `notification-center.tsx`, `split-view.tsx`, `quote-preview.tsx`, `view-config-panel.tsx`
- `chart-card.tsx` (CSS var: `--bg-surface` → `--surface-2`)
- `forecast-chart.tsx` (CSS var: `--bg-surface` → `--surface-2`)

**Step 1: Global search-replace in `packages/ui/src/components/blocks/`**

- `bg-raised` → `bg-surface-3`
- `bg-panel` → `bg-surface-4`
- `var(--bg-surface)` → `var(--surface-2)` (in chart components)

**Step 2: Verify build**

Run: `pnpm build`

**Step 3: Commit**

```bash
git add packages/ui/src/components/blocks/
git commit -m "feat(blocks): migrate block components to surface-N tokens"
```

---

### Task 6: Migrate pattern and AI components

**Files:**
- `packages/ui/src/components/patterns/` — `user-menu.tsx`, `navbar.tsx`, `sidebar-user.tsx`
- `packages/ui/src/components/ai/` — 50+ generative card components

**Step 1: Global search-replace**

- `bg-raised` → `bg-surface-3` across both directories

**Step 2: Verify build**

Run: `pnpm build`

**Step 3: Commit**

```bash
git add packages/ui/src/components/patterns/ packages/ui/src/components/ai/
git commit -m "feat(patterns,ai): migrate to surface-N tokens"
```

---

## Phase 3 — Migrate apps

### Task 7: Migrate apps/docs

**Files:**
- Components in `apps/docs/src/components/` — replace `bg-raised` → `bg-surface-3`, `bg-panel` → `bg-surface-4`
- Routes in `apps/docs/src/routes/` — same replacements
- Update documentation/code examples that reference old token names

**Step 1: Global search-replace in `apps/docs/src/`**

- `bg-raised` → `bg-surface-3`
- `bg-panel` → `bg-surface-4`

**Step 2: Verify build**

Run: `pnpm build`

**Step 3: Commit**

```bash
git add apps/docs/
git commit -m "feat(docs): migrate to surface-N tokens"
```

---

### Task 8: Migrate apps/examples

**Files:**
- Components in `apps/examples/components/` — replace `bg-raised` → `bg-surface-3`
- Routes in `apps/examples/app/` — same replacements

**Step 1: Global search-replace in `apps/examples/`**

- `bg-raised` → `bg-surface-3`
- `bg-panel` → `bg-surface-4`

**Step 2: Verify build**

Run: `pnpm build`

**Step 3: Commit**

```bash
git add apps/examples/
git commit -m "feat(examples): migrate to surface-N tokens"
```

---

### Task 9: Migrate apps/ops

**Files:**
- Components in `apps/ops/components/` — replace `bg-raised` → `bg-surface-3`
- CSS var usages in `apps/ops/app/globals.css` (already handled in Task 2, but check component CSS vars)

**Step 1: Global search-replace in `apps/ops/`**

- `bg-raised` → `bg-surface-3`
- `bg-panel` → `bg-surface-4`
- Any `var(--bg-surface)` → `var(--surface-2)` in component inline styles

**Step 2: Verify build**

Run: `pnpm build`

**Step 3: Commit**

```bash
git add apps/ops/
git commit -m "feat(ops): migrate to surface-N tokens"
```

---

### Task 10: Migrate packages/quick-login

**Files:**
- `packages/quick-login/src/components/quick-account-sheet.tsx`
- `packages/quick-login/src/components/quick-account-list-item.tsx`

**Step 1: Replace `bg-raised` → `bg-surface-3`**

**Step 2: Verify build**

Run: `pnpm build`

**Step 3: Commit**

```bash
git add packages/quick-login/
git commit -m "feat(quick-login): migrate to surface-N tokens"
```

---

## Phase 4 — Cleanup

### Task 11: Remove deprecated tokens

**Files:**
- Modify: `packages/ui/styles/tokens.css`
- Modify: `apps/docs/src/styles/globals.css`
- Modify: `apps/examples/app/globals.css`
- Modify: `apps/ops/app/globals.css`

**Step 1: Remove old surface variables from all theme blocks**

Remove `--bg-app`, `--bg-surface`, `--bg-raised`, `--bg-overlay` from every `:root`, `html.dark`, and theme-specific block.

**Step 2: Remove deprecated compat aliases from `@theme inline`**

Remove `--color-surface`, `--color-raised`, `--color-panel` (the old ones — NOT `--color-surface-0` etc.).

**Step 3: Remove zone-specific layout tokens**

Remove `--top-background`, `--main-background`, `--sidebar-background` definitions. Components should reference `--surface-0` / `--surface-1` directly by this point.

**Step 4: Remove sidebar-specific surface tokens**

Remove `--sidebar-background` from all theme blocks.

**Step 5: Verify build**

Run: `pnpm build`
Expected: Clean build — no references to removed tokens remain.

**Step 6: Verify no remaining references**

Run: `grep -r "bg-app\|--bg-surface\|--bg-raised\|--bg-overlay\|--top-background\|--main-background\|--sidebar-background" packages/ apps/ --include="*.tsx" --include="*.ts" --include="*.css"`
Expected: No matches.

**Step 7: Commit**

```bash
git add packages/ui/styles/tokens.css apps/docs/src/styles/globals.css apps/examples/app/globals.css apps/ops/app/globals.css
git commit -m "chore(tokens): remove deprecated surface tokens after migration"
```

---

## Summary

| Phase | Tasks | Risk | Breaks anything? |
|-------|-------|------|-------------------|
| Phase 1 | Tasks 1-2 | Low | No — additive only |
| Phase 2 | Tasks 3-6 | Medium | No — aliases ensure backward compat |
| Phase 3 | Tasks 7-10 | Low | No — mechanical search-replace |
| Phase 4 | Task 11 | Medium | Only if migration incomplete |

**Total: 11 tasks, 4 phases.** Phase 1 is the critical foundation. Phases 2-3 are parallelizable per task. Phase 4 is the final cleanup gate.
