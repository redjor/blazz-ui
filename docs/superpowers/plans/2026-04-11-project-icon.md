# Project Icon Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettre à l'utilisateur de choisir une icône lucide et une couleur pour chaque projet dans `apps/ops`, visibles dans le form, les listes, la page détail et les selects de projet.

**Architecture :** Extraction du système lucide+couleur existant des catégories dans un module partagé `lib/icon-palette.ts` + `components/icon-picker.tsx`. Ajout de deux champs optionnels `icon` / `color` sur la table `projects`. Nouveau composant d'affichage `ProjectIcon` décliné en 3 tailles. Picker compact en popover inline avec le champ nom, style Linear. Zéro modification des packages `@blazz/ui` et `@blazz/pro`.

**Tech Stack :** Next.js 16, React 19, TypeScript strict, Convex, Base UI (via `@blazz/ui`), `react-hook-form` + `zod`, `lucide-react`, `vitest` (+ `convex-test`), `pnpm`.

**Spec :** [`docs/superpowers/specs/2026-04-11-project-icon-design.md`](../specs/2026-04-11-project-icon-design.md)

---

## Pré-requis exécution

- `cd /Users/jonathanruas/Development/blazz-ui-app` pour toutes les commandes
- `pnpm dev:ops` pour valider visuellement (port 3120)
- `pnpm --filter @blazz-ops/app test` (ou `cd apps/ops && pnpm test`) pour les tests Convex
- **Never modify** `packages/ui/` ou `packages/pro/`. Tout reste dans `apps/ops/`.

---

## File Structure

**Nouveaux fichiers :**

- `apps/ops/lib/icon-palette.ts` — constantes `ICON_COLORS`, `ICON_SET`, helpers `getIcon`, `getIconColorClasses`, maps `DOT_COLOR_MAP`, `ICON_COLOR_MAP`
- `apps/ops/components/icon-picker.tsx` — composants `IconPicker`, `ColorPicker`, `IconPickerTile`, `IconPickerField`
- `apps/ops/components/project-icon.tsx` — composant d'affichage `ProjectIcon`

**Fichiers modifiés :**

- `apps/ops/convex/schema.ts` — ajout `icon` + `color` à `projects`
- `apps/ops/convex/projects.ts` — args `icon` + `color` dans `create` et `update`
- `apps/ops/convex/projects.test.ts` — tests icon/color persistence
- `apps/ops/components/manage-categories-sheet.tsx` — supprime les constantes locales, importe depuis `lib/icon-palette` (re-exporte les anciens noms pour compat call sites)
- `apps/ops/app/(main)/settings/categories/_client.tsx` — supprime les pickers locaux, importe depuis `components/icon-picker`
- `apps/ops/components/project-form.tsx` — ajoute `IconPickerField` inline avec le nom
- `apps/ops/app/(main)/clients/[id]/_client.tsx` — ajoute `ProjectIcon` dans la liste des projets
- `apps/ops/app/(main)/projects/[pid]/page.tsx` — remplace `PageHeader` par une composition manuelle avec `ProjectIcon`
- `apps/ops/components/time-entry-form.tsx` — select projet : icon dans trigger + items
- `apps/ops/app/(main)/expenses/_expense-dialog.tsx` — select projet : icon dans trigger + items
- `apps/ops/components/invoice-editor.tsx` — select « Ajouter un projet » : icon dans les items (le trigger est statique)

---

## Task 1 : Créer `lib/icon-palette.ts`

**Files:**
- Create: `apps/ops/lib/icon-palette.ts`

- [ ] **Step 1 : Créer le fichier avec les constantes, helpers et maps**

Contenu exact :

```ts
import {
	Briefcase,
	Building2,
	Calculator,
	Calendar,
	Clock,
	Code,
	CreditCard,
	FileText,
	FolderOpen,
	Globe,
	Hash,
	Heart,
	Home,
	Layers,
	type LucideIcon,
	Mail,
	MessageSquare,
	Package,
	Receipt,
	Settings,
	ShoppingCart,
	Star,
	Tag,
	Users,
	Wallet,
	Zap,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Palette — 8 couleurs soft, utilisées par les catégories et les projets
// ---------------------------------------------------------------------------

export interface IconColorDef {
	id: string
	label: string
	/** Classes Tailwind pour le background de la tuile (light + dark) */
	bg: string
	/** Classes Tailwind pour la couleur du texte/icon sur la tuile */
	text: string
}

export const ICON_COLORS: IconColorDef[] = [
	{ id: "indigo", label: "Indigo", bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400" },
	{ id: "violet", label: "Violet", bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400" },
	{ id: "rose", label: "Rose", bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400" },
	{ id: "orange", label: "Orange", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
	{ id: "amber", label: "Ambre", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
	{ id: "emerald", label: "Émeraude", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
	{ id: "sky", label: "Ciel", bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-400" },
	{ id: "zinc", label: "Zinc", bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-700 dark:text-zinc-300" },
]

export function getIconColorClasses(color?: string): IconColorDef {
	return ICON_COLORS.find((c) => c.id === color) ?? ICON_COLORS[7] // zinc = fallback
}

// ---------------------------------------------------------------------------
// Icon set — 25 lucide icons curated pour freelance / project management
// ---------------------------------------------------------------------------

export interface IconDef {
	id: string
	label: string
	icon: LucideIcon
}

export const ICON_SET: IconDef[] = [
	{ id: "folder", label: "Dossier", icon: FolderOpen },
	{ id: "briefcase", label: "Travail", icon: Briefcase },
	{ id: "users", label: "Personnes", icon: Users },
	{ id: "building", label: "Entreprise", icon: Building2 },
	{ id: "receipt", label: "Facture", icon: Receipt },
	{ id: "wallet", label: "Finances", icon: Wallet },
	{ id: "credit-card", label: "Paiement", icon: CreditCard },
	{ id: "calculator", label: "Calcul", icon: Calculator },
	{ id: "calendar", label: "Calendrier", icon: Calendar },
	{ id: "clock", label: "Temps", icon: Clock },
	{ id: "file-text", label: "Document", icon: FileText },
	{ id: "mail", label: "Email", icon: Mail },
	{ id: "message", label: "Message", icon: MessageSquare },
	{ id: "code", label: "Code", icon: Code },
	{ id: "globe", label: "Web", icon: Globe },
	{ id: "package", label: "Package", icon: Package },
	{ id: "layers", label: "Couches", icon: Layers },
	{ id: "tag", label: "Label", icon: Tag },
	{ id: "hash", label: "Hash", icon: Hash },
	{ id: "star", label: "Favori", icon: Star },
	{ id: "heart", label: "Important", icon: Heart },
	{ id: "zap", label: "Urgent", icon: Zap },
	{ id: "shopping-cart", label: "Achat", icon: ShoppingCart },
	{ id: "home", label: "Maison", icon: Home },
	{ id: "settings", label: "Config", icon: Settings },
]

export function getIcon(iconId?: string): LucideIcon | null {
	if (!iconId) return null
	return ICON_SET.find((i) => i.id === iconId)?.icon ?? null
}

// ---------------------------------------------------------------------------
// Dot / text color maps (used for inline dot + icon rendering without tile)
// ---------------------------------------------------------------------------

export const DOT_COLOR_MAP: Record<string, string> = {
	indigo: "bg-indigo-500",
	violet: "bg-violet-500",
	rose: "bg-rose-500",
	orange: "bg-orange-500",
	amber: "bg-amber-500",
	emerald: "bg-emerald-500",
	sky: "bg-sky-500",
	zinc: "bg-zinc-400",
}

export const ICON_COLOR_MAP: Record<string, string> = {
	indigo: "text-indigo-500",
	violet: "text-violet-500",
	rose: "text-rose-500",
	orange: "text-orange-500",
	amber: "text-amber-500",
	emerald: "text-emerald-500",
	sky: "text-sky-500",
	zinc: "text-zinc-400",
}
```

- [ ] **Step 2 : Vérifier que le fichier build sans erreur**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3 : Commit**

```bash
git add apps/ops/lib/icon-palette.ts
git commit -m "feat(ops): extract shared icon palette module"
```

---

## Task 2 : Migrer `manage-categories-sheet.tsx` pour consommer `icon-palette`

**Files:**
- Modify: `apps/ops/components/manage-categories-sheet.tsx`

- [ ] **Step 1 : Retirer les constantes locales et les remplacer par des ré-exports**

Ouvrir `apps/ops/components/manage-categories-sheet.tsx`. Chercher le bloc qui commence à `export const CATEGORY_COLORS = [` (ligne ~41) et qui se termine après `export const ICON_COLOR_MAP = {...}` (ligne ~154). Remplacer tout ce bloc par :

```ts
// Ré-exports depuis le module partagé — conserve les anciens noms pour les
// call sites existants (todos, chat, catégories...). À migrer progressivement.
export {
	ICON_COLORS as CATEGORY_COLORS,
	ICON_SET as CATEGORY_ICONS,
	getIconColorClasses as getCategoryColorClasses,
	getIcon as getCategoryIcon,
	DOT_COLOR_MAP,
	ICON_COLOR_MAP,
} from "@/lib/icon-palette"
```

Puis en haut du fichier, retirer les imports de lucide qui étaient uniquement utilisés par `CATEGORY_ICONS` — mais **conserver** ceux qui servent encore pour le `CategoryBadge` ou d'autres composants locaux. Chercher avec grep :

```bash
grep -nE "Briefcase|Building2|Calculator|Calendar|Clock|Code|CreditCard|FileText|FolderOpen|Globe|Hash|Heart|Home|Layers|LucideIcon|Mail|MessageSquare|Package|Receipt|Settings|ShoppingCart|Star|Tag|Users|Wallet|Zap" apps/ops/components/manage-categories-sheet.tsx
```

Ceux qui n'apparaissent plus nulle part dans le fichier après la suppression des constantes peuvent être retirés de l'import `lucide-react`. Garder `Plus`, `Trash2` et tout ce qui est utilisé par `CategoryBadge` / le sheet UI.

- [ ] **Step 2 : Vérifier que le fichier compile**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3 : Lancer le lint**

Run: `pnpm biome check apps/ops/components/manage-categories-sheet.tsx`
Expected: no errors (unused imports corrigés).

- [ ] **Step 4 : Vérifier visuellement que les catégories marchent toujours**

Run: `pnpm dev:ops` (si pas déjà lancé)
Naviguer : `http://localhost:3120/settings/categories`
Expected : la page catégories charge, les catégories existantes affichent leur icon + couleur, le create/edit fonctionne.

- [ ] **Step 5 : Commit**

```bash
git add apps/ops/components/manage-categories-sheet.tsx
git commit -m "refactor(ops): re-export category constants from icon-palette"
```

---

## Task 3 : Créer `components/icon-picker.tsx`

**Files:**
- Create: `apps/ops/components/icon-picker.tsx`

- [ ] **Step 1 : Écrire le composant complet**

Contenu exact du fichier :

```tsx
"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Popover, PopoverContent, PopoverTrigger } from "@blazz/ui/components/ui/popover"
import { useState } from "react"
import { getIcon, getIconColorClasses, ICON_COLORS, ICON_SET } from "@/lib/icon-palette"

// ---------------------------------------------------------------------------
// ColorPicker — rangée de 8 pastilles
// ---------------------------------------------------------------------------

interface ColorPickerProps {
	value: string
	onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
	return (
		<InlineStack gap="100" wrap>
			{ICON_COLORS.map((c) => (
				<button
					key={c.id}
					type="button"
					onClick={() => onChange(c.id)}
					className={`size-6 rounded-full border-2 transition-all ${c.bg} ${value === c.id ? "border-fg scale-110" : "border-transparent"}`}
					title={c.label}
					aria-label={c.label}
					aria-pressed={value === c.id}
				/>
			))}
		</InlineStack>
	)
}

// ---------------------------------------------------------------------------
// IconPicker — grille 8 colonnes d'icônes
// ---------------------------------------------------------------------------

interface IconPickerProps {
	value: string
	onChange: (icon: string) => void
	color: string
}

export function IconPicker({ value, onChange, color }: IconPickerProps) {
	const colorClasses = getIconColorClasses(color)

	return (
		<div className="grid grid-cols-8 gap-1">
			{ICON_SET.map((item) => {
				const isSelected = value === item.id
				return (
					<button
						key={item.id}
						type="button"
						onClick={() => onChange(item.id)}
						className={`flex items-center justify-center size-8 rounded-md transition-all ${
							isSelected ? `bg-muted ring-1 ring-edge ${colorClasses.text}` : "text-fg-muted hover:bg-card hover:text-fg-secondary"
						}`}
						title={item.label}
						aria-label={item.label}
						aria-pressed={isSelected}
					>
						<item.icon className="size-4" />
					</button>
				)
			})}
		</div>
	)
}

// ---------------------------------------------------------------------------
// IconPickerTile — preview read-only, utilisée dans le trigger du popover
// et partout où on veut afficher l'état courant du picker
// ---------------------------------------------------------------------------

interface IconPickerTileProps {
	icon?: string
	color?: string
	size?: "sm" | "md"
}

export function IconPickerTile({ icon, color, size = "md" }: IconPickerTileProps) {
	const Icon = getIcon(icon) ?? getIcon("folder")!
	const classes = getIconColorClasses(color)
	const sizeCls = size === "md" ? "size-10" : "size-8"
	const iconCls = size === "md" ? "size-5" : "size-4"
	return (
		<span className={`inline-flex items-center justify-center rounded-md ${sizeCls} ${classes.bg}`}>
			<Icon className={`${iconCls} ${classes.text}`} />
		</span>
	)
}

// ---------------------------------------------------------------------------
// IconPickerField — trigger en tuile + popover avec les deux pickers
// ---------------------------------------------------------------------------

interface IconPickerFieldProps {
	icon?: string
	color?: string
	onIconChange: (icon: string) => void
	onColorChange: (color: string) => void
	/** aria-label du bouton trigger, default : "Choisir une icône et une couleur" */
	ariaLabel?: string
}

export function IconPickerField({
	icon,
	color,
	onIconChange,
	onColorChange,
	ariaLabel = "Choisir une icône et une couleur",
}: IconPickerFieldProps) {
	const [open, setOpen] = useState(false)
	const resolvedIcon = icon ?? "folder"
	const resolvedColor = color ?? "zinc"

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				type="button"
				aria-label={ariaLabel}
				className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand"
			>
				<IconPickerTile icon={resolvedIcon} color={resolvedColor} size="md" />
			</PopoverTrigger>
			<PopoverContent align="start" className="w-[320px] p-3">
				<BlockStack gap="300">
					<BlockStack gap="150">
						<p className="text-xs font-medium text-fg-muted">Couleur</p>
						<ColorPicker value={resolvedColor} onChange={onColorChange} />
					</BlockStack>
					<BlockStack gap="150">
						<p className="text-xs font-medium text-fg-muted">Icône</p>
						<IconPicker
							value={resolvedIcon}
							color={resolvedColor}
							onChange={(id) => {
								onIconChange(id)
								setOpen(false)
							}}
						/>
					</BlockStack>
				</BlockStack>
			</PopoverContent>
		</Popover>
	)
}
```

**Notes :**
- Pas de `<div>` de layout — on utilise `BlockStack` et `InlineStack`.
- Les `<button>` des pickers sont de vrais boutons HTML (pattern existant copié des catégories), pas des `<Button>` `@blazz/ui` — c'est une exception justifiée pour un comportement très custom (grille de 25 boutons).
- Le popover se ferme automatiquement au clic sur un icon, mais **reste ouvert** au changement de couleur (l'utilisateur peut vouloir tester plusieurs couleurs).

- [ ] **Step 2 : Vérifier la compilation**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3 : Commit**

```bash
git add apps/ops/components/icon-picker.tsx
git commit -m "feat(ops): add shared icon picker components"
```

---

## Task 4 : Migrer `settings/categories/_client.tsx` pour utiliser `icon-picker`

**Files:**
- Modify: `apps/ops/app/(main)/settings/categories/_client.tsx`

- [ ] **Step 1 : Remplacer les imports**

Ouvrir le fichier. En haut, remplacer la ligne :
```ts
import { CATEGORY_COLORS, CATEGORY_ICONS, getCategoryIcon } from "@/components/manage-categories-sheet"
```
par :
```ts
import { ColorPicker, IconPicker } from "@/components/icon-picker"
import { getIcon, ICON_COLORS } from "@/lib/icon-palette"
```

- [ ] **Step 2 : Supprimer les composants locaux `ColorPicker` et `IconPicker`**

Dans le fichier, chercher la fonction `ColorPicker` locale (ligne ~56 → ~70) et la fonction `IconPicker` locale (ligne ~72 → ~105). Les supprimer entièrement — elles sont maintenant importées depuis `@/components/icon-picker`.

- [ ] **Step 3 : Remplacer les usages de `getCategoryIcon` et `CATEGORY_COLORS`**

Dans `CategoryIcon` local (~ligne 38), remplacer `getCategoryIcon(iconId)` par `getIcon(iconId)`.

Les autres références à `CATEGORY_COLORS` / `CATEGORY_ICONS` disparaissent avec la suppression des pickers locaux.

- [ ] **Step 4 : Vérifier compilation + lint**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Run: `pnpm biome check apps/ops/app/\(main\)/settings/categories/_client.tsx`
Expected: no errors.

- [ ] **Step 5 : Validation visuelle**

Run: `pnpm dev:ops` (si pas déjà lancé)
Naviguer : `http://localhost:3120/settings/categories`
Tester :
- [ ] Créer une catégorie avec icon + couleur
- [ ] Éditer une catégorie existante
- [ ] Les pickers s'affichent dans le dialog avec la même apparence qu'avant

Expected : comportement et apparence identiques à avant la migration.

- [ ] **Step 6 : Commit**

```bash
git add apps/ops/app/\(main\)/settings/categories/_client.tsx
git commit -m "refactor(ops): consume shared icon picker in categories settings"
```

---

## Task 5 : Ajouter les champs `icon` + `color` au schéma Convex

**Files:**
- Modify: `apps/ops/convex/schema.ts:22-41`

- [ ] **Step 1 : Ajouter les deux champs à la table `projects`**

Ouvrir `apps/ops/convex/schema.ts`. Chercher le bloc `projects: defineTable({`. Ajouter les deux champs **avant** `createdAt` :

```ts
projects: defineTable({
	userId: v.string(),
	clientId: v.id("clients"),
	name: v.string(),
	description: v.optional(v.string()),
	tjm: v.number(),
	hoursPerDay: v.number(),
	budgetAmount: v.optional(v.number()),
	currency: v.union(v.literal("EUR")),
	status: v.union(v.literal("active"), v.literal("paused"), v.literal("closed")),
	startDate: v.optional(v.string()),
	endDate: v.optional(v.string()),
	tags: v.optional(v.array(v.id("tags"))),
	icon: v.optional(v.string()),
	color: v.optional(v.string()),
	createdAt: v.number(),
})
```

- [ ] **Step 2 : Répliquer le changement dans `test.schema.ts`**

Ouvrir `apps/ops/convex/test.schema.ts` et appliquer la même modification à la table `projects` (ajout de `icon` et `color` optionnels avant `createdAt`).

- [ ] **Step 3 : Vérifier la compilation Convex**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4 : Commit**

```bash
git add apps/ops/convex/schema.ts apps/ops/convex/test.schema.ts
git commit -m "feat(ops): add icon and color fields to projects schema"
```

---

## Task 6 : Étendre les mutations `create` et `update` des projets (TDD)

**Files:**
- Modify: `apps/ops/convex/projects.ts:188-228`
- Test: `apps/ops/convex/projects.test.ts`

- [ ] **Step 1 : Écrire les tests en premier**

Ouvrir `apps/ops/convex/projects.test.ts`. Ajouter à la fin du `describe("projects CRUD", ...)` (juste avant la fermeture `})` du bloc) les tests suivants :

```ts
it("creates a project with icon and color", async () => {
	const { asUser } = setup()
	const clientId = await createClient(asUser)
	const id = await asUser.mutation(api.projects.create, {
		clientId,
		name: "Website",
		tjm: 800,
		hoursPerDay: 8,
		currency: "EUR",
		status: "active",
		icon: "briefcase",
		color: "indigo",
	})
	const project = await asUser.query(api.projects.get, { id })
	expect(project?.icon).toBe("briefcase")
	expect(project?.color).toBe("indigo")
})

it("creates a project without icon and color (fields undefined)", async () => {
	const { asUser } = setup()
	const clientId = await createClient(asUser)
	const id = await asUser.mutation(api.projects.create, {
		clientId,
		name: "No icon",
		tjm: 800,
		hoursPerDay: 8,
		currency: "EUR",
		status: "active",
	})
	const project = await asUser.query(api.projects.get, { id })
	expect(project?.icon).toBeUndefined()
	expect(project?.color).toBeUndefined()
})

it("updates icon and color on an existing project", async () => {
	const { asUser } = setup()
	const clientId = await createClient(asUser)
	const id = await asUser.mutation(api.projects.create, {
		clientId,
		name: "Website",
		tjm: 800,
		hoursPerDay: 8,
		currency: "EUR",
		status: "active",
	})
	await asUser.mutation(api.projects.update, {
		id,
		name: "Website",
		tjm: 800,
		hoursPerDay: 8,
		currency: "EUR",
		status: "active",
		icon: "code",
		color: "emerald",
	})
	const project = await asUser.query(api.projects.get, { id })
	expect(project?.icon).toBe("code")
	expect(project?.color).toBe("emerald")
})
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils échouent**

Run: `cd apps/ops && pnpm test -- projects.test.ts`
Expected: les 3 nouveaux tests échouent parce que les args `icon` et `color` ne sont pas acceptés par les mutations (`ArgumentValidationError` ou équivalent Convex).

- [ ] **Step 3 : Étendre la mutation `create`**

Ouvrir `apps/ops/convex/projects.ts`. Trouver `export const create = mutation({` (~ligne 188). Modifier les `args` pour ajouter les deux champs optionnels après `endDate` :

```ts
export const create = mutation({
	args: {
		clientId: v.id("clients"),
		name: v.string(),
		description: v.optional(v.string()),
		tjm: v.number(),
		hoursPerDay: v.number(),
		budgetAmount: v.optional(v.number()),
		currency: v.string(),
		status: statusValidator,
		startDate: v.optional(v.string()),
		endDate: v.optional(v.string()),
		icon: v.optional(v.string()),
		color: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const client = await ctx.db.get(args.clientId)
		if (!client || client.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.insert("projects", { ...args, userId, createdAt: Date.now() })
	},
})
```

- [ ] **Step 4 : Étendre la mutation `update`**

Juste en dessous (`export const update = mutation({`), même chose :

```ts
export const update = mutation({
	args: {
		id: v.id("projects"),
		name: v.string(),
		description: v.optional(v.string()),
		tjm: v.number(),
		hoursPerDay: v.number(),
		budgetAmount: v.optional(v.number()),
		currency: v.string(),
		status: statusValidator,
		startDate: v.optional(v.string()),
		endDate: v.optional(v.string()),
		icon: v.optional(v.string()),
		color: v.optional(v.string()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const { userId } = await requireAuth(ctx)
		const project = await ctx.db.get(id)
		if (!project || project.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, fields)
	},
})
```

- [ ] **Step 5 : Relancer les tests**

Run: `cd apps/ops && pnpm test -- projects.test.ts`
Expected: tous les tests du fichier passent (les 3 nouveaux + les existants).

- [ ] **Step 6 : Commit**

```bash
git add apps/ops/convex/projects.ts apps/ops/convex/projects.test.ts
git commit -m "feat(ops): accept icon and color in project create/update mutations"
```

---

## Task 7 : Créer `components/project-icon.tsx`

**Files:**
- Create: `apps/ops/components/project-icon.tsx`

- [ ] **Step 1 : Écrire le composant**

Contenu exact :

```tsx
import { getIcon, getIconColorClasses } from "@/lib/icon-palette"

interface ProjectIconProps {
	icon?: string
	color?: string
	/** xs = 20px (select), sm = 24px (list), md = 40px (header) */
	size?: "xs" | "sm" | "md"
	className?: string
}

const SIZE_CLASSES: Record<NonNullable<ProjectIconProps["size"]>, { tile: string; icon: string }> = {
	xs: { tile: "size-5", icon: "size-3" },
	sm: { tile: "size-6", icon: "size-3.5" },
	md: { tile: "size-10", icon: "size-5" },
}

export function ProjectIcon({ icon, color, size = "sm", className }: ProjectIconProps) {
	const Icon = getIcon(icon) ?? getIcon("folder")!
	const classes = getIconColorClasses(color)
	const s = SIZE_CLASSES[size]
	return (
		<span
			className={`inline-flex shrink-0 items-center justify-center rounded-md ${s.tile} ${classes.bg} ${className ?? ""}`}
		>
			<Icon className={`${s.icon} ${classes.text}`} />
		</span>
	)
}
```

- [ ] **Step 2 : Compilation**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3 : Commit**

```bash
git add apps/ops/components/project-icon.tsx
git commit -m "feat(ops): add ProjectIcon display component"
```

---

## Task 8 : Intégrer `IconPickerField` dans `project-form.tsx`

**Files:**
- Modify: `apps/ops/components/project-form.tsx`

- [ ] **Step 1 : Étendre le schéma zod**

Ouvrir `apps/ops/components/project-form.tsx`. Trouver le `const schema = z.object({` (~ligne 18). Ajouter les deux champs optionnels :

```ts
const schema = z.object({
	name: z.string().min(1, "Nom requis"),
	description: z.string().optional(),
	tjm: z.coerce.number().min(1, "TJM requis"),
	hoursPerDay: z.coerce.number().min(1).max(24),
	budgetAmount: z.preprocess((v) => (v === "" || v === undefined ? undefined : Number(v)), z.number().positive().optional()),
	currency: z.string().min(1),
	status: z.enum(["active", "paused", "closed"]),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	icon: z.string().optional(),
	color: z.string().optional(),
})
```

- [ ] **Step 2 : Importer `IconPickerField` et `InlineStack`**

En haut du fichier, à côté des autres imports `@blazz/ui` :

```ts
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { IconPickerField } from "@/components/icon-picker"
```

- [ ] **Step 3 : Remplacer le bloc "Nom" par un `InlineStack` avec le picker**

Trouver le bloc actuel (~ligne 80-84) :

```tsx
<div className="space-y-1.5">
	<Label htmlFor="proj-name">Nom *</Label>
	<Input id="proj-name" {...register("name")} />
	{errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
</div>
```

Le remplacer par :

```tsx
<div className="space-y-1.5">
	<Label htmlFor="proj-name">Nom *</Label>
	<InlineStack gap="300" blockAlign="center">
		<IconPickerField
			icon={watch("icon")}
			color={watch("color")}
			onIconChange={(v) => setValue("icon", v, { shouldDirty: true })}
			onColorChange={(v) => setValue("color", v, { shouldDirty: true })}
		/>
		<div className="flex-1 min-w-0">
			<Input id="proj-name" {...register("name")} />
		</div>
	</InlineStack>
	{errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
</div>
```

**Pourquoi un `<div>` ici ?** Exception justifiée : on a besoin de `flex-1 min-w-0` sur le wrapper de l'Input pour qu'il prenne tout l'espace restant dans l'`InlineStack`. C'est le seul cas où `InlineStack.Item` n'est pas dispo.

- [ ] **Step 4 : Compilation + lint**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Run: `pnpm biome check apps/ops/components/project-form.tsx`
Expected: no errors.

- [ ] **Step 5 : Validation visuelle**

Run: `pnpm dev:ops`
Naviguer : `http://localhost:3120/clients` → choisir un client → bouton "Nouveau projet"
Tester :
- [ ] La tuile icon apparaît à gauche du champ nom
- [ ] Clic sur la tuile → popover s'ouvre avec `ColorPicker` en haut et `IconPicker` en bas
- [ ] Clic sur une pastille couleur → la couleur change dans la tuile, le popover **reste ouvert**
- [ ] Clic sur un icon → l'icon change dans la tuile, le popover **se ferme**
- [ ] Submit → projet créé avec icon + color persistés

Également tester l'édition :
- [ ] Éditer un projet existant sans icon → la tuile affiche le fallback `folder` + `zinc`
- [ ] Changer icon + couleur → submit → persistés

- [ ] **Step 6 : Commit**

```bash
git add apps/ops/components/project-form.tsx
git commit -m "feat(ops): add icon picker to project form"
```

---

## Task 9 : Afficher `ProjectIcon` dans la liste projets d'un client

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/_client.tsx:147-172`

- [ ] **Step 1 : Importer `ProjectIcon`**

En haut du fichier (à côté des autres imports locaux) :

```ts
import { ProjectIcon } from "@/components/project-icon"
```

- [ ] **Step 2 : Insérer `ProjectIcon` dans chaque item de projet**

Trouver le bloc `{projects?.map((project) => (` (~ligne 147). Remplacer la structure interne du `Link` pour inclure l'icon :

```tsx
{projects?.map((project) => (
	<InlineStack key={project._id} align="space-between" blockAlign="center" className="py-2.5 border-b border-edge last:border-0">
		<Link href={`/projects/${project._id}`} className="flex-1 min-w-0 hover:opacity-75 transition-opacity">
			<InlineStack gap="300" blockAlign="center">
				<ProjectIcon icon={project.icon} color={project.color} size="sm" />
				<div className="min-w-0 flex-1">
					<span className="block text-sm font-medium text-fg truncate">{project.name}</span>
					<span className="block text-xs text-fg-muted mt-0.5 font-mono truncate">
						{project.tjm}€/j · {project.hoursPerDay}h/j · {project.currency}
						{project.startDate && ` · depuis ${project.startDate}`}
					</span>
				</div>
			</InlineStack>
		</Link>
		<InlineStack gap="300" blockAlign="center" className="shrink-0 ml-4">
			{project.budgetPercent !== null && (
				<span
					className={`inline-block size-2 rounded-full ${project.budgetPercent >= 90 ? "bg-red-500" : project.budgetPercent >= 70 ? "bg-amber-500" : "bg-green-500"}`}
					title={`Budget : ${project.budgetPercent}%`}
				/>
			)}
			<span className="flex items-center gap-1.5 text-xs text-fg-muted">
				<span className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`} />
				{statusLabel[project.status]}
			</span>
			<Button variant="ghost" size="icon" className="size-8 text-fg-muted" onClick={() => setEditingProject(project)}>
				<Pencil className="size-3.5" />
			</Button>
		</InlineStack>
	</InlineStack>
))}
```

**Note :** le query `api.projects.listByClient` retourne déjà `icon` et `color` si présents (Convex retourne tous les champs par défaut). Pas besoin de toucher à la query.

**Note 2 :** on garde le `<div className="min-w-0 flex-1">` pour le wrapper du texte — même exception justifiée qu'avant : `flex-1 min-w-0` nécessaire pour le truncate, et on ajoute `truncate` sur les spans pour éviter le débordement sur des noms longs.

- [ ] **Step 3 : Vérifier que le type `project` a bien `icon` et `color`**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Expected: no errors. Si le type ne contient pas `icon`/`color`, c'est que le schéma Convex n'a pas regénéré les types — relancer `pnpm dev:ops` (le worker Convex regénère automatiquement `_generated/`).

- [ ] **Step 4 : Validation visuelle**

Run: `pnpm dev:ops`
Naviguer : `http://localhost:3120/clients/<id>`
Expected :
- [ ] Chaque projet affiche sa tuile icon à gauche
- [ ] Les projets sans icon affichent le fallback `folder` + `zinc`
- [ ] Le texte (nom + meta) reste lisible, pas de débordement

- [ ] **Step 5 : Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/_client.tsx
git commit -m "feat(ops): show ProjectIcon in client project list"
```

---

## Task 10 : Afficher `ProjectIcon` dans la page détail projet

**Files:**
- Modify: `apps/ops/app/(main)/projects/[pid]/page.tsx:115-134`

- [ ] **Step 1 : Importer `ProjectIcon`**

En haut du fichier (avec les autres imports locaux) :

```ts
import { ProjectIcon } from "@/components/project-icon"
```

- [ ] **Step 2 : Remplacer `PageHeader` par une composition manuelle**

**Rationale :** `PageHeader` (`@blazz/pro/components/blocks/page-header`) accepte `title: string` seulement, pas de slot `leading`. On ne peut pas modifier le package. Donc on compose manuellement avec `InlineStack` pour préserver le look mais ajouter l'icon devant le titre.

Trouver le bloc actuel (~ligne 117-134) :

```tsx
<BlockStack gap="800" className="p-6">
	<BlockStack gap="150">
		<PageHeader
			title={project.name}
			actions={
				<InlineStack gap="200" blockAlign="center">
					<FavoriteButton entityType="project" entityId={pid} label={project.name} />
					<Button variant="outline" onClick={() => setEditOpen(true)}>
						Modifier
					</Button>
				</InlineStack>
			}
		/>
		<InlineStack as="span" gap="150" blockAlign="center" className="text-xs text-fg-muted">
			<span className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`} />
			{statusLabel[project.status]}
		</InlineStack>
	</BlockStack>
```

Le remplacer par :

```tsx
<BlockStack gap="800" className="p-6">
	<BlockStack gap="150">
		<InlineStack align="space-between" blockAlign="center" gap="400">
			<InlineStack blockAlign="center" gap="300" className="min-w-0">
				<ProjectIcon icon={project.icon} color={project.color} size="md" />
				<h1 className="text-lg font-semibold leading-normal text-fg truncate">{project.name}</h1>
			</InlineStack>
			<InlineStack gap="200" blockAlign="center" className="shrink-0">
				<FavoriteButton entityType="project" entityId={pid} label={project.name} />
				<Button variant="outline" onClick={() => setEditOpen(true)}>
					Modifier
				</Button>
			</InlineStack>
		</InlineStack>
		<InlineStack as="span" gap="150" blockAlign="center" className="text-xs text-fg-muted">
			<span className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`} />
			{statusLabel[project.status]}
		</InlineStack>
	</BlockStack>
```

- [ ] **Step 3 : Retirer l'import `PageHeader` s'il n'est plus utilisé**

Chercher dans le fichier :
```bash
grep -n "PageHeader" apps/ops/app/\(main\)/projects/\[pid\]/page.tsx
```
S'il n'apparaît plus que dans la ligne d'import, retirer l'import correspondant :
```ts
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
```

- [ ] **Step 4 : Compilation + lint**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Run: `pnpm biome check "apps/ops/app/(main)/projects/[pid]/page.tsx"`
Expected: no errors.

- [ ] **Step 5 : Validation visuelle**

Naviguer : `http://localhost:3120/projects/<id>`
Expected :
- [ ] Tuile icon `size-10` à gauche du titre
- [ ] Titre + actions sur la même ligne, correctement alignés
- [ ] Status dot reste sous le titre (comme avant)
- [ ] Dark mode OK

- [ ] **Step 6 : Commit**

```bash
git add apps/ops/app/\(main\)/projects/\[pid\]/page.tsx
git commit -m "feat(ops): show ProjectIcon in project detail header"
```

---

## Task 11 : Intégrer `ProjectIcon` dans le select de `time-entry-form.tsx`

**Files:**
- Modify: `apps/ops/components/time-entry-form.tsx:140-165`

- [ ] **Step 1 : Importer `ProjectIcon` + `InlineStack`**

En haut du fichier :

```ts
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { ProjectIcon } from "@/components/project-icon"
```

Si `InlineStack` est déjà importé, ne pas redoubler.

- [ ] **Step 2 : Élargir le type `projects` local pour inclure `icon` + `color`**

Trouver le type inline à la ligne ~147 :
```ts
projects?.map((p: { _id: string; name: string }) => ({
	value: p._id,
	label: p.name,
})) ?? []
```
Le transformer en :
```ts
projects?.map((p: { _id: string; name: string; icon?: string; color?: string }) => ({
	value: p._id,
	label: p.name,
})) ?? []
```

Et plus bas (ligne ~157), même élargissement dans le `map` des `SelectItem`.

- [ ] **Step 3 : Override visuel du `SelectTrigger` pour afficher l'icon devant le nom**

Remplacer le bloc `<SelectTrigger>` à `</Select>` (~lignes 153-163) par :

```tsx
<SelectTrigger className="w-full">
	{(() => {
		const selected = projects?.find((p: { _id: string; name: string; icon?: string; color?: string }) => p._id === watch("projectId"))
		if (!selected) return <SelectValue placeholder="Choisir un projet…" />
		return (
			<InlineStack gap="200" blockAlign="center">
				<ProjectIcon icon={selected.icon} color={selected.color} size="xs" />
				<span className="truncate">{selected.name}</span>
			</InlineStack>
		)
	})()}
</SelectTrigger>
<SelectContent>
	{projects?.map((p: { _id: string; name: string; icon?: string; color?: string }) => (
		<SelectItem key={p._id} value={p._id} label={p.name}>
			<InlineStack gap="200" blockAlign="center">
				<ProjectIcon icon={p.icon} color={p.color} size="xs" />
				<span>{p.name}</span>
			</InlineStack>
		</SelectItem>
	))}
</SelectContent>
```

**Points clés :**
- `items={[{value, label: string}]}` sur le `<Select>` reste intact — label texte pour l'accessibilité et le rendu par défaut de `Select.Value` quand `items` est fourni.
- Le trigger override manuel du rendu via une IIFE qui lookup le projet courant.
- Les `SelectItem` reçoivent toujours `label={p.name}` string (critique pour le matching Base UI) et des `children` JSX.

- [ ] **Step 4 : Compilation + lint + validation**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Run: `pnpm biome check apps/ops/components/time-entry-form.tsx`
Expected: no errors.

Validation visuelle : naviguer sur une page où `time-entry-form` apparaît (ex: `/time` → "Nouvelle saisie"), vérifier :
- [ ] Le select affiche le placeholder quand aucun projet n'est choisi
- [ ] Après sélection : icon + nom dans le trigger
- [ ] Dans le dropdown : chaque option montre icon + nom

- [ ] **Step 5 : Commit**

```bash
git add apps/ops/components/time-entry-form.tsx
git commit -m "feat(ops): show ProjectIcon in time entry project select"
```

---

## Task 12 : Intégrer `ProjectIcon` dans le select de `expenses/_expense-dialog.tsx`

**Files:**
- Modify: `apps/ops/app/(main)/expenses/_expense-dialog.tsx:291-314`

- [ ] **Step 1 : Inspecter le typage de `projectItems`**

Chercher où `projectItems` est défini dans le fichier :

```bash
grep -n "projectItems" apps/ops/app/\(main\)/expenses/_expense-dialog.tsx
```

Probablement un `useMemo` qui map `projects` → `{value, label}`. Il faut :
1. Enrichir le map pour conserver `icon` + `color` (par exemple un state parallèle ou inclure le projet complet).
2. Alternative plus propre : avoir accès à `projects` (résultat de `useQuery(api.projects.listByClient, ...)`) directement dans le JSX du select.

Le plus simple : utiliser directement la query `projects` pour le lookup du trigger + les items du dropdown, et garder `projectItems` pour l'accessibilité du `items` prop.

- [ ] **Step 2 : Ajouter les imports**

```ts
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { ProjectIcon } from "@/components/project-icon"
```

- [ ] **Step 3 : Override du select**

Ouvrir le fichier, trouver le bloc (~lignes 292-314) :

```tsx
{selectedClientId && (
	<div className="space-y-2">
		<Label>Projet</Label>
		<Controller
			control={control}
			name="projectId"
			render={({ field }) => (
				<Select value={field.value} onValueChange={field.onChange} items={projectItems}>
					<SelectTrigger>
						<SelectValue placeholder="Aucun" />
					</SelectTrigger>
					<SelectContent>
						{projectItems.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		/>
	</div>
)}
```

Le remplacer par :

```tsx
{selectedClientId && (
	<div className="space-y-2">
		<Label>Projet</Label>
		<Controller
			control={control}
			name="projectId"
			render={({ field }) => {
				const selectedProject = projects?.find((p) => p._id === field.value)
				return (
					<Select value={field.value} onValueChange={field.onChange} items={projectItems}>
						<SelectTrigger>
							{selectedProject ? (
								<InlineStack gap="200" blockAlign="center">
									<ProjectIcon icon={selectedProject.icon} color={selectedProject.color} size="xs" />
									<span className="truncate">{selectedProject.name}</span>
								</InlineStack>
							) : (
								<SelectValue placeholder="Aucun" />
							)}
						</SelectTrigger>
						<SelectContent>
							{projects?.map((p) => (
								<SelectItem key={p._id} value={p._id} label={p.name}>
									<InlineStack gap="200" blockAlign="center">
										<ProjectIcon icon={p.icon} color={p.color} size="xs" />
										<span>{p.name}</span>
									</InlineStack>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)
			}}
		/>
	</div>
)}
```

**Note :** on passe `label={p.name}` explicitement sur chaque `SelectItem` (ajout par rapport à la version existante) pour que Base UI matche correctement la value au label dans les `items`.

- [ ] **Step 4 : Compilation + lint + validation**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Run: `pnpm biome check "apps/ops/app/(main)/expenses/_expense-dialog.tsx"`

Validation : ouvrir la modale de création d'une dépense, sélectionner un client qui a des projets avec icons → vérifier trigger + items.

- [ ] **Step 5 : Commit**

```bash
git add "apps/ops/app/(main)/expenses/_expense-dialog.tsx"
git commit -m "feat(ops): show ProjectIcon in expense project select"
```

---

## Task 13 : Intégrer `ProjectIcon` dans le select « Ajouter un projet » de `invoice-editor.tsx`

**Files:**
- Modify: `apps/ops/components/invoice-editor.tsx:755-786`

**Note :** ce select est un "action select" (trigger statique "Ajouter un projet"), donc on n'override PAS le trigger. On ajoute juste l'icon dans les items du dropdown.

- [ ] **Step 1 : Imports**

```ts
import { ProjectIcon } from "@/components/project-icon"
```

(`InlineStack` est déjà importé dans ce fichier.)

- [ ] **Step 2 : Override des `SelectItem`**

Trouver le bloc (~lignes 773-778) :

```tsx
{availableProjects.map((p) => (
	<SelectItem key={p._id} value={p._id}>
		{p.name}
	</SelectItem>
))}
```

Le remplacer par :

```tsx
{availableProjects.map((p) => (
	<SelectItem key={p._id} value={p._id} label={p.name}>
		<InlineStack gap="200" blockAlign="center">
			<ProjectIcon icon={p.icon} color={p.color} size="xs" />
			<span>{p.name}</span>
		</InlineStack>
	</SelectItem>
))}
```

**Note :** `availableProjects` est déjà typé avec les champs du projet, incluant `icon` et `color` après que le schéma Convex ait regénéré les types. Si le typescript compile, c'est bon.

**Note 2 :** le `Select` du invoice-editor utilise `items={Object.fromEntries(...)}` (format Record, pas Array). Ce n'est pas idéal vis-à-vis de la règle mémoire ("Array uniquement") mais c'est l'existant et n'entre pas dans le scope du spec.

- [ ] **Step 3 : Compilation + validation**

Run: `cd apps/ops && pnpm exec tsc --noEmit`
Run: `pnpm biome check apps/ops/components/invoice-editor.tsx`

Validation : créer/éditer une facture avec un client qui a plusieurs projets → vérifier que le dropdown "Ajouter un projet" affiche icon + nom.

- [ ] **Step 4 : Commit**

```bash
git add apps/ops/components/invoice-editor.tsx
git commit -m "feat(ops): show ProjectIcon in invoice editor add-project select"
```

---

## Task 14 : Validation finale — build, lint, typecheck, tests, smoke test UI

**Files:** aucun nouveau changement attendu.

- [ ] **Step 1 : Typecheck complet**

Run: `cd /Users/jonathanruas/Development/blazz-ui-app && pnpm --filter @blazz-ops/app exec tsc --noEmit`
Expected: no errors.

(Si le filter name diffère, ajuster : `pnpm --filter ops exec tsc --noEmit` ou `cd apps/ops && pnpm exec tsc --noEmit`.)

- [ ] **Step 2 : Lint global**

Run: `pnpm biome check apps/ops`
Expected: no errors.

- [ ] **Step 3 : Tests Convex**

Run: `cd apps/ops && pnpm test`
Expected: all tests pass (incluant les 3 nouveaux sur icon/color).

- [ ] **Step 4 : Build**

Run: `cd /Users/jonathanruas/Development/blazz-ui-app && pnpm build`
Expected: build complet OK pour toutes les apps.

- [ ] **Step 5 : Smoke test UI complet**

Lancer `pnpm dev:ops` si pas déjà. Checklist :

- [ ] `/settings/categories` : create + edit catégorie → pickers marchent (non-régression)
- [ ] `/clients/<id>` : créer un projet avec icon + couleur → tuile visible dans la liste
- [ ] `/clients/<id>` : éditer le projet, changer l'icon → mise à jour immédiate
- [ ] `/projects/<id>` : tuile `md` visible dans le header, à côté du titre
- [ ] `/time` : nouvelle saisie → select projet affiche icon dans trigger + dropdown
- [ ] `/expenses` : nouvelle dépense avec client + projet → select projet affiche icon dans trigger + dropdown
- [ ] Invoice editor → "Ajouter un projet" → dropdown affiche icon + nom
- [ ] Dark mode : toutes les surfaces OK (toggle via `next-themes`)
- [ ] Un projet **sans** icon/color : fallback `folder` + `zinc` partout

- [ ] **Step 6 : Commit final (si besoin d'ajustements mineurs)**

Si rien à commit, sauter cette étape. Sinon :

```bash
git add -A
git commit -m "chore(ops): final fixes from smoke test for project icon feature"
```

---

## Self-review checklist (exécutée par l'auteur du plan)

- [x] Chaque section du spec a une tâche correspondante
- [x] Aucun placeholder (`TODO`, `TBD`, "add error handling", etc.)
- [x] Chaque step qui modifie du code inclut le code complet
- [x] Chemins de fichiers absolus ou relatifs cohérents
- [x] Les types et props utilisés sont cohérents entre les tasks (`IconPickerField`, `ProjectIcon`, `IconPickerTile`)
- [x] Les noms de fonctions sont cohérents (`getIcon`, `getIconColorClasses` — pas `getCategoryIcon` dans les nouveaux fichiers)
- [x] L'ordre des tasks respecte les dépendances (palette → picker → migration catégories → schema → mutations → display → intégrations)
- [x] TDD appliqué aux mutations Convex (Task 6 écrit les tests avant le code)
- [x] Commits fréquents (un par task)
- [x] La règle CLAUDE.md "ne pas toucher aux packages" est respectée — tout reste dans `apps/ops/`
