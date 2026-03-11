# Releasing @blazz/ui

## Prerequisites (one-time setup)

1. **npm token** — Go to [npmjs.com](https://www.npmjs.com) → Avatar → Access Tokens → Generate New Token (type: **Automation**).

2. **GitHub secret** — In your repo: Settings → Secrets and variables → Actions → New repository secret:
   - `NPM_TOKEN` — your npm automation token
   - `BLAZZ_LICENSE_SECRET` — the HMAC secret used to validate license keys

3. **Changesets access** — Already configured as `"public"` in `.changeset/config.json`.

## Release flow

### 1. Create a changeset

After making changes to `packages/ui/`, describe what changed:

```bash
pnpm changeset
```

It will ask:
- **Which package?** → `@blazz/ui`
- **Bump type?** → `patch` (bugfix), `minor` (new feature), `major` (breaking change)
- **Summary?** → Short description of the change

This creates a markdown file in `.changeset/`. Commit it with your changes.

### 2. Push to main

```bash
git push origin main
```

The `release.yml` workflow runs and creates a **Release PR** titled "chore: release @blazz/ui". This PR:
- Bumps the version in `packages/ui/package.json`
- Updates `CHANGELOG.md`
- Consumes all pending changesets

### 3. Merge the Release PR

Review the version bump, then merge. The workflow runs again and:
- Builds `@blazz/ui`
- Publishes to npm via `changeset publish`

### 4. Verify

```bash
npm view @blazz/ui version
```

## Generating license keys

```bash
BLAZZ_LICENSE_SECRET=your-secret npx tsx packages/ui/scripts/generate-license.ts <plan> <orgId> <expiry>
```

- **plan**: `PRO`, `TEAM`, or `ENTERPRISE`
- **orgId**: client identifier (e.g. `acme42`)
- **expiry**: `YYYYMMDD` format (e.g. `20270311`)

Example:

```bash
BLAZZ_LICENSE_SECRET=your-secret npx tsx packages/ui/scripts/generate-license.ts PRO acme42 20270311
# → BLAZZ-PRO-acme42-20270311-fc64191e719fd736
```

The secret must match `BLAZZ_LICENSE_SECRET` used in CI when building the package.

## Quick reference

| Action | Command |
|--------|---------|
| Create changeset | `pnpm changeset` |
| Preview version bump | `pnpm version-packages` |
| Build package locally | `pnpm build --filter=@blazz/ui` |
| Publish manually (emergency) | `cd packages/ui && npm publish --access public` |
| Generate license key | `BLAZZ_LICENSE_SECRET=... npx tsx packages/ui/scripts/generate-license.ts PRO org 20270311` |
