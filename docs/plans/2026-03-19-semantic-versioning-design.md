# Semantic Versioning & Tagging — Design

**Date:** 2026-03-19
**Status:** Validated

## Context

Monorepo avec 6 packages publiables, tous a `v0.1.0`, aucun tag git, aucun changeset cree.
Changesets est installe mais le workflow est incomplet (ne gere que `@blazz/ui`).

## Decisions

| Decision | Choix |
|----------|-------|
| Workflow | Changesets classique (PR-based) |
| Versioning | Independant par package |
| Branche de release | `main` (merge depuis `develop`) |
| Changelog | Auto par package (defaut Changesets) |
| Pre-releases | Pas maintenant (YAGNI) |
| Format des tags | Defaut Changesets : `@blazz/ui@0.2.0` |

## Packages concernes

- `@blazz/ui` (open-source)
- `@blazz/pro` (paid)
- `@blazz/tabs`
- `@blazz/quick-login`
- `@blazz/mcp`
- `react-dirty-guard`

Apps ignorees : `docs`, `ops`, `sandbox`

## Workflow quotidien

```
1. Travail sur develop/feature/*
2. pnpm changeset → choix packages, type (patch/minor/major), description
3. Le .md du changeset est commite avec le code
4. Quand pret a release : merge develop → main
5. Le bot Changesets cree/update une Release PR sur main
6. Merge la Release PR → publish npm + git tags auto
```

## Changements techniques

### 1. `.changeset/config.json`

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

### 2. Scripts root (`package.json`)

```json
{
  "changeset": "changeset",
  "version-packages": "changeset version",
  "release": "turbo build && changeset publish",
  "release:dry": "turbo build && changeset publish --dry-run"
}
```

### 3. `.github/workflows/release.yml`

- Trigger : push sur `main` (au lieu de tag `v*`)
- Validation : lint + type-check + build (tous les packages)
- Changesets action : cree Release PR ou publie

### 4. `.github/workflows/ci.yml`

- Build tous les packages (au lieu de `--filter=@blazz/ui`)

## PeerDependency handling

`@blazz/pro` declare `@blazz/ui` en peerDependency.
`onlyUpdatePeerDependentsWhenOutOfRange: true` evite les bumps inutiles de `@blazz/pro`
quand `@blazz/ui` fait un patch dans le range existant.

## Risques identifies

- **NPM_TOKEN** doit etre configure dans les secrets GitHub
- **Merge `develop → main` est manuel** : les changesets s'accumulent sans etre publies si on oublie
- **Dry-run** disponible via `pnpm release:dry` pour verifier avant merge
