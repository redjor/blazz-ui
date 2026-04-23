# iOS Bookmark Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettre de sauver un lien depuis n'importe quelle app iOS (Instagram, X, Safari, Threads…) vers Blazz Ops en un partage, via un iOS Shortcut qui appelle un endpoint HTTP Convex protégé par Bearer token.

**Architecture:** Un `iOS Shortcut` récupère l'URL du Share Sheet et POST sur `https://<deploy>.convex.site/bookmark` avec un Bearer token. L'endpoint Convex valide l'auth, classifie le type d'URL (tweet / youtube / image / video / link) via un helper pur testable, puis insère dans la table `bookmarks` existante via une `internalMutation` sans session Google OAuth (auth faite au niveau HTTP).

**Tech Stack:** Convex (httpAction + internalMutation), TypeScript, vitest + convex-test, iOS Shortcuts (app native Raccourcis).

**Scope MVP (ce plan) :**
- Endpoint `POST /bookmark` accepte `{url, note?, sourceApp?, title?}`
- Classifieur de type d'URL par regex (tweet / youtube / image / video / link)
- iOS Shortcut qui capture URL depuis Share Sheet et POST
- Pas de fetch métadonnées (titre/thumbnail) — reporté v2
- Pas de classification LLM auto-tags — reporté v2

---

## File Structure

**Files créés :**
- `apps/ops/convex/lib/bookmark-url.ts` — classifieur d'URL pur (data + regex)
- `apps/ops/convex/lib/bookmark-url.test.ts` — tests unitaires du classifieur

**Files modifiés :**
- `apps/ops/convex/bookmarks.ts` — ajout `internalCreateFromUrl` (pas de user auth, appelé uniquement depuis httpAction)
- `apps/ops/convex/http.ts` — ajout route `POST /bookmark` avec Bearer auth

---

## Task 1 : URL classifier (TDD)

**Files:**
- Create: `apps/ops/convex/lib/bookmark-url.ts`
- Create: `apps/ops/convex/lib/bookmark-url.test.ts`

- [ ] **Step 1.1 — Écrire les tests**

Create `apps/ops/convex/lib/bookmark-url.test.ts`:

```typescript
import { describe, expect, it } from "vitest"
import { classifyUrl, extractHost } from "./bookmark-url"

describe("classifyUrl", () => {
	it("classifies twitter/x posts as tweet", () => {
		expect(classifyUrl("https://twitter.com/user/status/123")).toBe("tweet")
		expect(classifyUrl("https://x.com/user/status/123")).toBe("tweet")
		expect(classifyUrl("https://mobile.twitter.com/user/status/123")).toBe("tweet")
	})

	it("classifies youtube as youtube", () => {
		expect(classifyUrl("https://www.youtube.com/watch?v=abc")).toBe("youtube")
		expect(classifyUrl("https://youtu.be/abc")).toBe("youtube")
		expect(classifyUrl("https://youtube.com/shorts/xyz")).toBe("youtube")
	})

	it("classifies instagram reels/posts as video", () => {
		expect(classifyUrl("https://www.instagram.com/reel/abc/")).toBe("video")
		expect(classifyUrl("https://www.instagram.com/p/xyz/")).toBe("video")
	})

	it("classifies tiktok as video", () => {
		expect(classifyUrl("https://www.tiktok.com/@user/video/123")).toBe("video")
	})

	it("classifies direct image URLs as image", () => {
		expect(classifyUrl("https://example.com/pic.jpg")).toBe("image")
		expect(classifyUrl("https://example.com/pic.PNG")).toBe("image")
		expect(classifyUrl("https://example.com/pic.webp?size=large")).toBe("image")
	})

	it("classifies direct video files as video", () => {
		expect(classifyUrl("https://example.com/clip.mp4")).toBe("video")
		expect(classifyUrl("https://example.com/clip.MOV")).toBe("video")
	})

	it("falls back to link for anything else", () => {
		expect(classifyUrl("https://news.ycombinator.com/item?id=1")).toBe("link")
		expect(classifyUrl("https://github.com/anthropic")).toBe("link")
	})

	it("returns link for malformed URLs instead of throwing", () => {
		expect(classifyUrl("not a url")).toBe("link")
		expect(classifyUrl("")).toBe("link")
	})
})

describe("extractHost", () => {
	it("returns the host without www", () => {
		expect(extractHost("https://www.example.com/path")).toBe("example.com")
		expect(extractHost("https://sub.example.com/path")).toBe("sub.example.com")
	})

	it("returns null for malformed URLs", () => {
		expect(extractHost("not a url")).toBeNull()
		expect(extractHost("")).toBeNull()
	})
})
```

- [ ] **Step 1.2 — Lancer (attendu FAIL)**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && pnpm vitest run convex/lib/bookmark-url.test.ts
```
Expected: FAIL `Cannot find module './bookmark-url'`.

- [ ] **Step 1.3 — Implémenter le classifieur**

Create `apps/ops/convex/lib/bookmark-url.ts`:

```typescript
export type BookmarkType = "tweet" | "youtube" | "image" | "video" | "link"

const TWEET_HOSTS = /(^|\.)((?:mobile\.)?twitter\.com|x\.com)$/i
const YOUTUBE_HOSTS = /(^|\.)(youtube\.com|youtu\.be)$/i
const INSTAGRAM_HOST = /(^|\.)instagram\.com$/i
const TIKTOK_HOST = /(^|\.)tiktok\.com$/i
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp|svg)(?:\?|$|#)/i
const VIDEO_EXT = /\.(mp4|mov|webm|mkv|m4v)(?:\?|$|#)/i

function safeUrl(raw: string): URL | null {
	try {
		return new URL(raw.trim())
	} catch {
		return null
	}
}

export function extractHost(raw: string): string | null {
	const u = safeUrl(raw)
	if (!u) return null
	return u.hostname.replace(/^www\./i, "")
}

export function classifyUrl(raw: string): BookmarkType {
	const u = safeUrl(raw)
	if (!u) return "link"

	const host = u.hostname
	const pathAndQuery = `${u.pathname}${u.search}`

	if (TWEET_HOSTS.test(host)) return "tweet"
	if (YOUTUBE_HOSTS.test(host)) return "youtube"
	if (INSTAGRAM_HOST.test(host)) return "video"
	if (TIKTOK_HOST.test(host)) return "video"
	if (VIDEO_EXT.test(pathAndQuery)) return "video"
	if (IMAGE_EXT.test(pathAndQuery)) return "image"
	return "link"
}
```

- [ ] **Step 1.4 — Lancer (attendu PASS)**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && pnpm vitest run convex/lib/bookmark-url.test.ts
```
Expected: PASS, 9 tests.

- [ ] **Step 1.5 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/lib/bookmark-url.ts apps/ops/convex/lib/bookmark-url.test.ts && git commit -m "feat(ops): add pure URL classifier for bookmarks"
```

---

## Task 2 : Internal mutation pour insérer sans user auth

**Files:**
- Modify: `apps/ops/convex/bookmarks.ts`

- [ ] **Step 2.1 — Ajouter `internalMutation` en haut du fichier dans les imports**

Ouvrir `apps/ops/convex/bookmarks.ts`. Ligne 2 actuellement :
```typescript
import { mutation, query } from "./_generated/server"
```
Remplacer par :
```typescript
import { internalMutation, mutation, query } from "./_generated/server"
```

- [ ] **Step 2.2 — Ajouter la mutation à la fin du fichier**

Append à la fin de `apps/ops/convex/bookmarks.ts` :

```typescript
// ── Internal: create from HTTP endpoint (no user session auth) ──

export const internalCreateFromUrl = internalMutation({
	args: {
		userId: v.string(),
		url: v.string(),
		type: v.union(v.literal("tweet"), v.literal("youtube"), v.literal("image"), v.literal("video"), v.literal("link")),
		title: v.optional(v.string()),
		note: v.optional(v.string()),
		sourceApp: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const url = args.url.trim()
		if (!url) throw new ConvexError("L'URL est requise")

		// Compose notes: "[from: Instagram] user note..." if sourceApp given
		const notes =
			args.sourceApp && args.note
				? `[from: ${args.sourceApp}] ${args.note}`
				: args.sourceApp
					? `[from: ${args.sourceApp}]`
					: args.note

		return ctx.db.insert("bookmarks", {
			userId: args.userId,
			url,
			type: args.type,
			title: args.title,
			notes,
			pinned: false,
			createdAt: Date.now(),
		})
	},
})
```

- [ ] **Step 2.3 — Déployer sur Convex dev**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex dev --once 2>&1 | tail -5
```
Expected: `Convex functions ready!` sans erreur.

- [ ] **Step 2.4 — Vérifier la mutation est enregistrée**

```bash
grep -n "internalCreateFromUrl" /Users/jonathanruas/Development/blazz-ui-app/apps/ops/convex/_generated/api.d.ts 2>&1 | head -3
```
Expected: au moins une ligne trouvée (mutation générée dans les types).

- [ ] **Step 2.5 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/bookmarks.ts && git commit -m "feat(ops): add internalCreateFromUrl bookmark mutation"
```

---

## Task 3 : Route HTTP `POST /bookmark`

**Files:**
- Modify: `apps/ops/convex/http.ts`

- [ ] **Step 3.1 — Ajouter les imports en haut (ligne ~4)**

Ouvrir `apps/ops/convex/http.ts`. Après les imports existants (autour de la ligne 4), ajouter :

```typescript
import { classifyUrl, extractHost } from "./lib/bookmark-url"
```

- [ ] **Step 3.2 — Ajouter la route avant `export default http`**

Localiser `export default http` et insérer **juste avant** :

```typescript
// ── Bookmark capture (iOS Shortcut / any Bearer-auth client) ──

http.route({
	path: "/bookmark",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const expected = process.env.BOOKMARK_SECRET
		if (!expected) {
			return new Response("BOOKMARK_SECRET not configured", { status: 500 })
		}
		const opsUserId = process.env.OPS_USER_ID
		if (!opsUserId) {
			return new Response("OPS_USER_ID not configured", { status: 500 })
		}

		const authHeader = request.headers.get("Authorization") ?? ""
		const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""
		if (bearer !== expected) {
			return new Response("Unauthorized", { status: 401 })
		}

		let body: { url?: string; note?: string; sourceApp?: string; title?: string }
		try {
			body = await request.json()
		} catch {
			return new Response(JSON.stringify({ error: "Invalid JSON" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		const rawUrl = (body.url ?? "").trim()
		if (!rawUrl) {
			return new Response(JSON.stringify({ error: "url is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		// Extract host as fallback sourceApp if none provided
		const sourceApp = body.sourceApp ?? extractHost(rawUrl) ?? undefined
		const type = classifyUrl(rawUrl)

		const id = await ctx.runMutation(internal.bookmarks.internalCreateFromUrl, {
			userId: opsUserId,
			url: rawUrl,
			type,
			title: body.title,
			note: body.note,
			sourceApp,
		})

		return new Response(JSON.stringify({ ok: true, id, type, sourceApp }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	}),
})
```

- [ ] **Step 3.3 — Déployer sur Convex dev**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex dev --once 2>&1 | tail -5
```
Expected: `Convex functions ready!` sans erreur.

- [ ] **Step 3.4 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/http.ts && git commit -m "feat(ops): expose POST /bookmark for iOS Shortcut capture"
```

---

## Task 4 : Setter `BOOKMARK_SECRET` dans Convex env

**Files:** aucun (env Convex)

- [ ] **Step 4.1 — Générer un secret**

```bash
openssl rand -hex 32 > /tmp/bookmark-secret.txt
head -c 20 /tmp/bookmark-secret.txt && echo "..."
```

- [ ] **Step 4.2 — Set dans Convex**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex env set BOOKMARK_SECRET "$(cat /tmp/bookmark-secret.txt)"
```

- [ ] **Step 4.3 — Vérifier**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex env list 2>&1 | grep -c BOOKMARK_SECRET
```
Expected: `1`.

- [ ] **Step 4.4 — Vérifier que `OPS_USER_ID` est déjà set**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex env list 2>&1 | grep -c OPS_USER_ID
```
Expected: `1` (déjà utilisé par le webhook GitHub). Si `0`, il faudra le set avec ton user ID Convex — consulter le dashboard → table `users` → copier le `_id`.

---

## Task 5 : Smoke tests curl

**Files:** aucun

- [ ] **Step 5.1 — Test auth invalide**

```bash
curl -s -X POST https://rightful-guineapig-376.eu-west-1.convex.site/bookmark \
  -H "Authorization: Bearer wrong" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  -w "\nHTTP %{http_code}\n"
```
Expected: `HTTP 401`, body `Unauthorized`.

- [ ] **Step 5.2 — Test URL manquante**

```bash
SECRET=$(cat /tmp/bookmark-secret.txt) && curl -s -X POST https://rightful-guineapig-376.eu-west-1.convex.site/bookmark \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nHTTP %{http_code}\n"
```
Expected: `HTTP 400`, body contains `"url is required"`.

- [ ] **Step 5.3 — Test capture tweet**

```bash
SECRET=$(cat /tmp/bookmark-secret.txt) && curl -s -X POST https://rightful-guineapig-376.eu-west-1.convex.site/bookmark \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://x.com/elonmusk/status/1"}' | python3 -m json.tool
```
Expected: `{"ok":true,"id":"...","type":"tweet","sourceApp":"x.com"}`.

- [ ] **Step 5.4 — Test capture Instagram avec sourceApp explicite**

```bash
SECRET=$(cat /tmp/bookmark-secret.txt) && curl -s -X POST https://rightful-guineapig-376.eu-west-1.convex.site/bookmark \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.instagram.com/reel/ABC/","sourceApp":"Instagram","note":"inspiration design"}' | python3 -m json.tool
```
Expected: `{"ok":true,"id":"...","type":"video","sourceApp":"Instagram"}`.

- [ ] **Step 5.5 — Vérifier en DB**

Ouvrir le dashboard Convex → table `bookmarks` → les 2 entrées ci-dessus doivent être présentes, avec `notes` préfixé `[from: x.com]` et `[from: Instagram] inspiration design` respectivement, `pinned: false`, bon `type`.

- [ ] **Step 5.6 — Nettoyer les données de test**

Dashboard Convex → table `bookmarks` → supprimer les 2 entrées de test.

---

## Task 6 : Configurer l'iOS Shortcut (action utilisateur)

**Files:** aucun

Cette task est manuelle — elle doit être faite sur ton iPhone dans l'app **Raccourcis** (Shortcuts). Reproductible en ~5 minutes.

- [ ] **Step 6.1 — Créer le Shortcut**

Sur iPhone, ouvre **Raccourcis** → onglet `Mes raccourcis` → bouton `+` (en haut à droite).

- [ ] **Step 6.2 — Configurer le Shortcut Input (Share Sheet)**

Nom : **Save to Blazz**

Tape l'icône `i` en bas → **Partager** → activer "Afficher dans la feuille de partage" → types d'entrée : cocher **URL** et **Texte** seulement. Décocher le reste.

- [ ] **Step 6.3 — Ajouter l'action "Obtenir le contenu de"**

Chercher `Obtenir le contenu de l'URL` (Get Contents of URL) → ajouter.

Configurer :
- **URL** : `https://rightful-guineapig-376.eu-west-1.convex.site/bookmark`
- **Méthode** : `POST`
- **En-têtes** :
  - Clé : `Authorization` / Valeur : `Bearer <coller_le_BOOKMARK_SECRET_ici>`
  - Clé : `Content-Type` / Valeur : `application/json`
- **Corps de la requête** : `JSON`
  - Clé `url` → Valeur = `Entrée du raccourci` (variable magic)
  - Clé `sourceApp` → Valeur = `iOS Share` (string simple — option bonus mais utile pour debug)

- [ ] **Step 6.4 — Ajouter une notification de succès**

Ajouter une action `Afficher la notification` (Show Notification) après l'action précédente.
- Titre : `✓ Saved`
- Corps : `Bookmark ajouté à Blazz`

- [ ] **Step 6.5 — Tester depuis Safari**

Ouvrir Safari → n'importe quelle page → bouton partage → descendre → tap **Save to Blazz**.
Expected : notif `✓ Saved` en 1-2 secondes. Vérifier dans le dashboard Convex → `bookmarks` → nouvelle entrée.

- [ ] **Step 6.6 — Tester depuis Instagram**

Ouvrir Instagram → un reel → icône partage (flèche en papier avion) → `Partager vers…` → descendre → **Save to Blazz**.
Expected : notif `✓ Saved`. Le `type` doit être `video` dans la DB.

Si le Shortcut n'apparaît pas dans le share sheet d'Insta : retourner dans Raccourcis → éditer le Shortcut → bouton `i` → vérifier que "Afficher dans la feuille de partage" est bien activé.

---

## Critères de succès (récap)

- [ ] 9 tests `bookmark-url.test.ts` passent
- [ ] `internalCreateFromUrl` visible dans `_generated/api.d.ts`
- [ ] `POST /bookmark` sans Bearer → 401
- [ ] `POST /bookmark` sans URL → 400 `"url is required"`
- [ ] `POST /bookmark` avec URL tweet → `type: "tweet"`, entrée en DB
- [ ] iOS Shortcut apparaît dans le Share Sheet Safari + Instagram
- [ ] Share depuis Instagram d'un reel → `type: "video"` en DB, notif `✓ Saved`

---

## Notes pour l'exécution

- **Branch** : travailler sur `develop` (actuelle), ou créer `feat/bookmark-capture` si tu préfères isoler. Commits directs sur develop sont OK vu le petit scope.
- **Deployment cible** : dev Convex (`rightful-guineapig-376.eu-west-1.convex.site`). Pour le mettre en prod plus tard, refaire Task 4 + Task 6 avec l'URL prod.
- **v2 différée** (hors scope) : fetch métadonnées (title + thumbnail), classification LLM des tags, collection auto selon le host, dédup si URL déjà existe.
