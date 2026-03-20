# Semantic Versioning & Tagging — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mettre en place un systeme de versioning semantique avec Changesets pour les 6 packages publiables du monorepo.

**Architecture:** Changesets PR-based workflow. Les changesets s'accumulent sur `develop`, le merge vers `main` declenche une Release PR automatique via GitHub Actions. Le merge de la Release PR publie sur npm et cree les git tags.

**Tech Stack:** Changesets, GitHub Actions, pnpm, Turborepo, npm registry

**Design doc:** `docs/plans/2026-03-19-semantic-versioning-design.md`

---

### Task 1: Update Changesets config

**Files:**
- Modify: `.changeset/config.json`

**Step 1: Update the config**

Replace the full content of `.changeset/config.json` with:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.2/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["docs", "ops", "sandbox"],
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
    "onlyUpdatePeerDependentsWhenOutOfRange": true
  }
}
```

Changes from current:
- `ignore`: `["docs", "examples"]` → `["docs", "ops", "sandbox"]` (examples no longer exists, add ops and sandbox)
- Add `___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH` for peerDependency handling

**Step 2: Verify config is valid JSON**

Run: `cat .changeset/config.json | python3 -m json.tool`
Expected: Pretty-printed JSON, no errors

**Step 3: Commit**

```bash
git add .changeset/config.json
git commit -m "chore: update changesets config for all packages"
```

---

### Task 2: Update root package.json scripts

**Files:**
- Modify: `package.json` (root)

**Step 1: Update the release script and add release:dry**

In root `package.json`, change the `scripts` section:

```json
{
  "release": "turbo build && changeset publish",
  "release:dry": "turbo build && changeset publish --dry-run"
}
```

Changes:
- `release`: `turbo build --filter=@blazz/ui && changeset publish` → `turbo build && changeset publish` (build ALL packages, not just ui)
- Add `release:dry` script for pre-publish verification

Leave all other scripts unchanged.

**Step 2: Verify scripts are valid**

Run: `node -e "const p = require('./package.json'); console.log(p.scripts.release, '|', p.scripts['release:dry'])"`
Expected: `turbo build && changeset publish | turbo build && changeset publish --dry-run`

**Step 3: Commit**

```bash
git add package.json
git commit -m "chore: update release scripts for all packages"
```

---

### Task 3: Rewrite release.yml workflow

**Files:**
- Modify: `.github/workflows/release.yml`

**Step 1: Replace the workflow**

Replace the full content of `.github/workflows/release.yml` with:

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    name: Release Packages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9.9.0

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
          registry-url: https://registry.npmjs.org

      - run: pnpm install --frozen-lockfile

      - run: pnpm lint

      - run: pnpm type-check

      - run: pnpm build

      - name: Create Release PR or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version-packages
          title: "chore: release packages"
          commit: "chore: release packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Changes from current:
- Trigger: `push tags v*` → `push branches [main]`
- Job name: `Release @blazz/ui` → `Release Packages`
- Build: `pnpm build --filter=@blazz/ui` → `pnpm build` (all packages)
- Add validation: `pnpm lint` + `pnpm type-check` before build
- Title/commit: `@blazz/ui` → `packages`

**Step 2: Validate YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/release.yml'))"`
Expected: No errors

**Step 3: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "chore: update release workflow for all packages"
```

---

### Task 4: Update ci.yml workflow

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Update the build step**

In `.github/workflows/ci.yml`, change the last line:

```yaml
      - run: pnpm build
```

Change from: `pnpm build --filter=@blazz/ui` → `pnpm build` (build all packages)

**Step 2: Validate YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"`
Expected: No errors

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "chore: build all packages in CI"
```

---

### Task 5: Verify the full setup locally

**Step 1: Verify changeset status**

Run: `pnpm changeset status`
Expected: "No changesets present" (clean state)

**Step 2: Test dry-run build**

Run: `pnpm build`
Expected: All 6 packages build successfully

**Step 3: Test dry-run release**

Run: `pnpm release:dry`
Expected: Build succeeds, changeset publish shows "No unpublished packages" (dry-run)

**Step 4: Final commit (if any fixes needed)**

If any adjustments were required, commit them:
```bash
git commit -m "fix: adjust versioning setup"
```
