# Package Split Implementation Plan — @blazz/ui + @blazz/pro

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split `@blazz/ui` into two npm packages — `@blazz/ui` (open-source, 105 composants) and `@blazz/pro` (payant, 101+ composants).

**Architecture:** Physical split in monorepo. `packages/ui/` keeps primitives + patterns, `packages/pro/` gets blocks + AI. Pro declares UI as peerDependency. Imports in all apps migrated.

**Tech Stack:** Turborepo, pnpm workspaces, tsup (ESM), Changesets, TypeScript strict.

**Design doc:** `docs/plans/2026-03-15-package-split-design.md`

---

### Task 1: Create `packages/pro/` scaffold

**Files:**
- Create: `packages/pro/package.json`
- Create: `packages/pro/tsup.config.ts`
- Create: `packages/pro/tsconfig.json`
- Create: `packages/pro/src/index.ts` (empty placeholder)

**Step 1: Create `packages/pro/package.json`**

```json
{
  "name": "@blazz/pro",
  "version": "0.1.0",
  "private": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./components/blocks/*": {
      "import": "./dist/components/blocks/*/index.js",
      "types": "./dist/components/blocks/*/index.d.ts"
    },
    "./components/ai/*": {
      "import": "./dist/components/ai/*/index.js",
      "types": "./dist/components/ai/*/index.d.ts"
    }
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },
  "peerDependencies": {
    "@blazz/ui": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0"
  },
  "dependencies": {
    "@tanstack/react-table": "^8.21.3",
    "ai": "^6.0.116",
    "@streamdown/cjk": "^1.0.1",
    "@streamdown/code": "^3.2.0",
    "@streamdown/math": "^1.0.0",
    "@streamdown/mermaid": "^1.0.4",
    "streamdown": "^2.4.0",
    "recharts": "2.15.4",
    "embla-carousel-react": "^8.6.0",
    "tokenlens": "^1.3.1",
    "use-stick-to-bottom": "^1.1.3"
  }
}
```

**Step 2: Create `packages/pro/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create `packages/pro/tsup.config.ts`**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss", "@blazz/ui"],
  treeshake: true,
});
```

**Step 4: Create `packages/pro/src/index.ts`**

```ts
// Placeholder — will be populated after component move
export {};
```

**Step 5: Verify scaffold builds**

Run: `cd packages/pro && pnpm install && pnpm build`
Expected: Build succeeds with empty output.

**Step 6: Commit**

```bash
git add packages/pro/
git commit -m "feat(pro): scaffold @blazz/pro package"
```

---

### Task 2: Move blocks from `packages/ui/` to `packages/pro/`

**Files:**
- Move: `packages/ui/src/components/blocks/` → `packages/pro/src/components/blocks/`
- Remove presets: `packages/pro/src/components/blocks/data-table/presets/` (all 15 preset files)

**Step 1: Move the blocks directory**

```bash
mkdir -p packages/pro/src/components
cp -r packages/ui/src/components/blocks packages/pro/src/components/blocks
```

**Step 2: Remove data-table presets**

```bash
rm -rf packages/pro/src/components/blocks/data-table/presets
```

Remove any re-export of presets from `packages/pro/src/components/blocks/data-table/index.ts` if present.

**Step 3: Update internal imports in blocks**

All blocks use relative imports to `../../ui/button`, `../../ui/checkbox`, etc. These must change to `@blazz/ui` imports:

Search & replace across `packages/pro/src/components/blocks/`:
- `from "../../ui/` → `from "@blazz/ui/components/ui/`
- `from "../ui/` → `from "@blazz/ui/components/ui/`
- `from "../../lib/` → needs case-by-case handling (see Task 4)
- `from "../../types/` → `from "@blazz/ui/types/` or inline

**Step 4: Verify no broken imports**

Run: `cd packages/pro && pnpm tsc --noEmit`
Expected: Type-check passes (may need iterative fixes).

**Step 5: Commit**

```bash
git add packages/pro/src/components/blocks/
git commit -m "feat(pro): move blocks components from @blazz/ui"
```

---

### Task 3: Move AI components from `packages/ui/` to `packages/pro/`

**Files:**
- Move: `packages/ui/src/components/ai/` → `packages/pro/src/components/ai/`

**Step 1: Move the ai directory**

```bash
cp -r packages/ui/src/components/ai packages/pro/src/components/ai
```

**Step 2: Update internal imports in AI components**

Search & replace across `packages/pro/src/components/ai/`:
- `from "../../ui/` → `from "@blazz/ui/components/ui/`
- `from "../ui/` → `from "@blazz/ui/components/ui/`
- `from "../../lib/` → case-by-case (see Task 4)

**Step 3: Verify type-check**

Run: `cd packages/pro && pnpm tsc --noEmit`

**Step 4: Commit**

```bash
git add packages/pro/src/components/ai/
git commit -m "feat(pro): move AI components from @blazz/ui"
```

---

### Task 4: Move pro-specific hooks and lib to `packages/pro/`

**Files:**
- Move: `packages/ui/src/hooks/use-data-table-url-state.ts` → `packages/pro/src/hooks/`
- Move: `packages/ui/src/hooks/use-data-table-views.ts` → `packages/pro/src/hooks/`
- Move: `packages/ui/src/hooks/use-block-navigation.ts` → `packages/pro/src/hooks/`
- Move: `packages/ui/src/lib/license-context.tsx` → `packages/pro/src/lib/`
- Move: `packages/ui/src/lib/license.ts` → `packages/pro/src/lib/`
- Move: `packages/ui/src/lib/with-pro-guard.tsx` → `packages/pro/src/lib/`
- Delete: `packages/ui/src/lib/linear-data.ts`
- Delete: `packages/ui/src/lib/sample-data.ts`
- Delete: `packages/ui/src/lib/stockbase-data.ts`
- Delete: `packages/ui/src/lib/talentflow-data.ts`

**Step 1: Move hooks**

```bash
mkdir -p packages/pro/src/hooks
cp packages/ui/src/hooks/use-data-table-url-state.ts packages/pro/src/hooks/
cp packages/ui/src/hooks/use-data-table-views.ts packages/pro/src/hooks/
cp packages/ui/src/hooks/use-block-navigation.ts packages/pro/src/hooks/
```

**Step 2: Create hooks barrel**

Create `packages/pro/src/hooks/index.ts`:

```ts
export * from "./use-block-navigation";
export * from "./use-data-table-url-state";
export * from "./use-data-table-views";
```

**Step 3: Move license/pro-guard lib**

```bash
mkdir -p packages/pro/src/lib
cp packages/ui/src/lib/license-context.tsx packages/pro/src/lib/
cp packages/ui/src/lib/license.ts packages/pro/src/lib/
cp packages/ui/src/lib/with-pro-guard.tsx packages/pro/src/lib/
```

**Step 4: Create lib barrel**

Create `packages/pro/src/lib/index.ts`:

```ts
export * from "./license-context";
export * from "./license";
export * from "./with-pro-guard";
```

**Step 5: Update imports in moved hooks/lib**

Any import referencing `../../lib/utils` or `../../lib/theme-context` should point to `@blazz/ui`.

**Step 6: Commit**

```bash
git add packages/pro/src/hooks/ packages/pro/src/lib/
git commit -m "feat(pro): move pro-specific hooks and license system"
```

---

### Task 5: Write `packages/pro/src/index.ts` barrel

**Files:**
- Modify: `packages/pro/src/index.ts`

**Step 1: Write the barrel export**

Reference `packages/ui/src/index.ts` lines 3-32 (current block exports) and `packages/ui/src/components/blocks/index.ts` for the exact export list. Replicate it pointing to the new paths.

```ts
// Components — Blocks
export * from "./components/blocks";

// Components — AI (no barrel due to naming conflicts — import directly)
// import { ChatMessage } from "@blazz/pro/components/ai/chat"

// Hooks
export * from "./hooks";

// Lib — License
export * from "./lib";
```

**Step 2: Verify build**

Run: `cd packages/pro && pnpm build`
Expected: `dist/index.js` + `dist/index.d.ts` generated.

**Step 3: Commit**

```bash
git add packages/pro/src/index.ts
git commit -m "feat(pro): add barrel exports"
```

---

### Task 6: Clean `packages/ui/` — remove moved code

**Files:**
- Delete: `packages/ui/src/components/blocks/` (entire directory)
- Delete: `packages/ui/src/components/ai/` (entire directory)
- Delete: `packages/ui/src/hooks/use-data-table-url-state.ts`
- Delete: `packages/ui/src/hooks/use-data-table-views.ts`
- Delete: `packages/ui/src/hooks/use-block-navigation.ts`
- Delete: `packages/ui/src/lib/license-context.tsx`
- Delete: `packages/ui/src/lib/license.ts`
- Delete: `packages/ui/src/lib/with-pro-guard.tsx`
- Delete: `packages/ui/src/lib/linear-data.ts`
- Delete: `packages/ui/src/lib/sample-data.ts`
- Delete: `packages/ui/src/lib/stockbase-data.ts`
- Delete: `packages/ui/src/lib/talentflow-data.ts`
- Modify: `packages/ui/src/hooks/index.ts` — remove 3 pro hooks
- Modify: `packages/ui/src/index.ts` — remove all block/AI/pro exports

**Step 1: Delete moved directories and files**

```bash
rm -rf packages/ui/src/components/blocks
rm -rf packages/ui/src/components/ai
rm packages/ui/src/hooks/use-data-table-url-state.ts
rm packages/ui/src/hooks/use-data-table-views.ts
rm packages/ui/src/hooks/use-block-navigation.ts
rm packages/ui/src/lib/license-context.tsx
rm packages/ui/src/lib/license.ts
rm packages/ui/src/lib/with-pro-guard.tsx
rm packages/ui/src/lib/linear-data.ts
rm packages/ui/src/lib/sample-data.ts
rm packages/ui/src/lib/stockbase-data.ts
rm packages/ui/src/lib/talentflow-data.ts
```

**Step 2: Update `packages/ui/src/hooks/index.ts`**

Remove exports for `use-block-navigation`, `use-data-table-url-state`, `use-data-table-views`. Keep only:

```ts
export * from "./use-command-palette";
export * from "./use-debounced";
export * from "./use-navigation-with-params";
```

**Step 3: Update `packages/ui/src/index.ts`**

Remove lines 3-32 (all block exports). Remove lines 110-112 (AI comment). Remove license/pro-guard exports. Keep only:
- UI primitive exports (lines 33-109)
- Patterns barrel (line 115)
- UnsavedChangesBar (line 117-119)
- Remaining hooks (use-command-palette, use-debounced, use-navigation-with-params)
- Theme context, utils, types

**Step 4: Verify build**

Run: `cd packages/ui && pnpm build`
Expected: Build succeeds with reduced output.

**Step 5: Commit**

```bash
git add -A packages/ui/
git commit -m "refactor(ui): remove blocks, AI, and pro-specific code"
```

---

### Task 7: Update `packages/ui/package.json` — slim dependencies

**Files:**
- Modify: `packages/ui/package.json`

**Step 1: Remove pro dependencies**

Remove from `dependencies`:
- `@tanstack/react-table`
- `ai`
- `@streamdown/cjk`, `@streamdown/code`, `@streamdown/math`, `@streamdown/mermaid`
- `streamdown`
- `recharts`
- `tokenlens`
- `use-stick-to-bottom`

**Step 2: Move form deps to optional peer**

Remove from `dependencies`:
- `react-hook-form`
- `@hookform/resolvers`
- `zod`

Add to `peerDependencies` (optional):
```json
"peerDependenciesMeta": {
  "react-hook-form": { "optional": true },
  "@hookform/resolvers": { "optional": true },
  "zod": { "optional": true }
}
```

And add them to `peerDependencies`:
```json
"react-hook-form": "^7.0.0",
"@hookform/resolvers": "^5.0.0",
"zod": "^4.0.0"
```

**Step 3: Add sub-path exports**

Replace the `exports` field:
```json
"exports": {
  ".": {
    "import": "./dist/index.js",
    "types": "./dist/index.d.ts"
  },
  "./components/ui/*": {
    "import": "./dist/components/ui/*/index.js",
    "types": "./dist/components/ui/*/index.d.ts"
  },
  "./components/patterns/*": {
    "import": "./dist/components/patterns/*/index.js",
    "types": "./dist/components/patterns/*/index.d.ts"
  },
  "./styles/*": "./styles/*"
}
```

**Step 4: Verify install + build**

Run: `pnpm install && cd packages/ui && pnpm build`

**Step 5: Commit**

```bash
git add packages/ui/package.json pnpm-lock.yaml
git commit -m "refactor(ui): slim dependencies, add sub-path exports"
```

---

### Task 8: Update `packages/ui/tsup.config.ts` — multi-entry

**Files:**
- Modify: `packages/ui/tsup.config.ts`

**Step 1: Switch to multi-entry**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/ui/*/index.ts",
    "src/components/patterns/*/index.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss"],
  treeshake: true,
});
```

Note: Remove the `define` block for `BLAZZ_LICENSE_SECRET` — that moves to `packages/pro/tsup.config.ts`.

**Step 2: Update `packages/pro/tsup.config.ts`**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/blocks/*/index.ts",
    "src/components/ai/*/index.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss", "@blazz/ui"],
  treeshake: true,
  define: {
    "process.env.BLAZZ_LICENSE_SECRET": JSON.stringify(
      process.env.BLAZZ_LICENSE_SECRET || ""
    ),
  },
});
```

**Step 3: Verify both builds**

Run: `pnpm build --filter=@blazz/ui && pnpm build --filter=@blazz/pro`
Expected: Both build successfully with multi-entry output.

**Step 4: Commit**

```bash
git add packages/ui/tsup.config.ts packages/pro/tsup.config.ts
git commit -m "build: multi-entry tsup config for both packages"
```

---

### Task 9: Add `@blazz/pro` as dependency in apps

**Files:**
- Modify: `apps/docs/package.json`
- Modify: `apps/examples/package.json`
- Modify: `apps/ops/package.json`

**Step 1: Add workspace dependency**

In each app's `package.json`, add to `dependencies`:

```json
"@blazz/pro": "workspace:*"
```

**Step 2: Install**

Run: `pnpm install`

**Step 3: Commit**

```bash
git add apps/docs/package.json apps/examples/package.json apps/ops/package.json pnpm-lock.yaml
git commit -m "chore(apps): add @blazz/pro workspace dependency"
```

---

### Task 10: Migrate imports in `apps/docs/`

**Files:**
- Modify: All files in `apps/docs/` that import from `@blazz/ui/components/blocks/` or `@blazz/ui/components/ai/`

**Step 1: Search & replace block imports**

```bash
# Find all files with block/ai imports
grep -r "@blazz/ui/components/blocks" apps/docs/ --include="*.tsx" --include="*.ts" -l
grep -r "@blazz/ui/components/ai" apps/docs/ --include="*.tsx" --include="*.ts" -l
```

Replace:
- `@blazz/ui/components/blocks/` → `@blazz/pro/components/blocks/`
- `@blazz/ui/components/ai/` → `@blazz/pro/components/ai/`

**Step 2: Fix barrel imports**

Find imports like `import { StatsStrip, KanbanBoard } from "@blazz/ui"` and split them:
- UI/pattern components stay: `import { Button } from "@blazz/ui"`
- Block/AI components move: `import { StatsStrip } from "@blazz/pro"`

**Step 3: Fix hook/lib imports**

- `import { useDataTableUrlState } from "@blazz/ui"` → `from "@blazz/pro"`
- `import { BlazzProvider, useLicense } from "@blazz/ui"` → `from "@blazz/pro"`

**Step 4: Verify build**

Run: `pnpm build --filter=docs`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add apps/docs/
git commit -m "refactor(docs): migrate imports to @blazz/pro"
```

---

### Task 11: Migrate imports in `apps/examples/`

**Files:**
- Modify: All files in `apps/examples/` that import blocks/AI from `@blazz/ui`

**Step 1-4: Same process as Task 10**

Search, replace, fix barrel imports, verify build.

Run: `pnpm build --filter=examples`

**Step 5: Commit**

```bash
git add apps/examples/
git commit -m "refactor(examples): migrate imports to @blazz/pro"
```

---

### Task 12: Migrate imports in `apps/ops/`

**Files:**
- Modify: All files in `apps/ops/` that import blocks/AI from `@blazz/ui`

**Step 1-4: Same process as Task 10**

Run: `pnpm build --filter=ops`

**Step 5: Commit**

```bash
git add apps/ops/
git commit -m "refactor(ops): migrate imports to @blazz/pro"
```

---

### Task 13: Full monorepo build verification

**Step 1: Clean all dist**

```bash
pnpm -r exec rm -rf dist .next .output out
```

**Step 2: Full build**

Run: `pnpm build`
Expected: All packages and apps build successfully in dependency order.

**Step 3: Verify dependency order**

Turborepo should resolve: `@blazz/ui` → `@blazz/pro` → apps.

**Step 4: Spot-check sub-path imports**

```bash
# Verify sub-path exports resolve
node -e "import('@blazz/ui/components/ui/button')"
node -e "import('@blazz/pro/components/blocks/data-table')"
```

**Step 5: Commit any remaining fixes**

```bash
git add -A
git commit -m "chore: full monorepo build verification after package split"
```

---

### Task 14: Delete original blocks/AI from `packages/ui/`

This is a safety task — verify that `packages/ui/src/components/blocks/` and `packages/ui/src/components/ai/` were actually deleted in Task 6. If they're still present (e.g., copy was done instead of move), delete them now.

**Step 1: Verify deletion**

```bash
ls packages/ui/src/components/blocks 2>/dev/null && echo "STILL EXISTS — DELETE" || echo "OK"
ls packages/ui/src/components/ai 2>/dev/null && echo "STILL EXISTS — DELETE" || echo "OK"
```

**Step 2: Final commit if needed**

```bash
git status
# If clean, nothing to do
```

---

### Task 15: Update documentation references

**Files:**
- Modify: `packages/ui/AI.md` — remove block/AI component references, add pointer to `@blazz/pro`
- Modify: `CLAUDE.md` — update import paths and package taxonomy

**Step 1: Update `packages/ui/AI.md`**

Add a header note:

```markdown
> Blocks (data-table, charts, kanban...) and AI components have moved to `@blazz/pro`.
> Import: `import { DataTable } from "@blazz/pro/components/blocks/data-table"`
```

Remove sections documenting block/AI components.

**Step 2: Update `CLAUDE.md`**

Update the architecture section to reflect two packages. Update import paths.

**Step 3: Commit**

```bash
git add packages/ui/AI.md CLAUDE.md
git commit -m "docs: update references for @blazz/ui + @blazz/pro split"
```
