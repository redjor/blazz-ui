# Ajout d'un icon aux projets — Design spec

**Date :** 2026-04-11
**App :** `apps/ops`
**Statut :** En attente de review

## Contexte

Les projets (`apps/ops`) appartiennent à un client (qui a déjà son logo) mais
n'ont aucun signal visuel propre. Un utilisateur qui a 4 projets chez un même
client ne peut les distinguer qu'au nom. Ajouter un icon + couleur par projet
résout le problème et homogénéise le visuel avec les catégories, qui ont déjà
un système lucide + couleur fonctionnel.

## Objectif

Permettre à l'utilisateur de choisir une icône (lucide) et une couleur (parmi
une palette curated) pour chaque projet, visibles dans le form, les listes,
la page détail et les selects de projet.

## Non-goals

- Upload d'image custom (pas de Convex `_storage`).
- Color picker libre HEX.
- Modifications dans `packages/ui` ou `packages/pro` (règle CLAUDE.md).
- Migration des projets existants (les champs sont optionnels, fallback UI).
- Application aux tags, todos, clients — uniquement projets pour ce lot.
- Emoji picker (choix initial D du brainstorming, pivoté vers lucide pour
  réutiliser l'existant catégories).

## Choix de design clés

### Réutiliser le système catégories
`apps/ops/components/manage-categories-sheet.tsx` expose déjà
`CATEGORY_COLORS` (8 couleurs soft bg/text), `CATEGORY_ICONS` (25 lucide
icons curated : `folder`, `briefcase`, `building`, `code`, `package`, etc.),
`getCategoryIcon`, `getCategoryColorClasses`, `DOT_COLOR_MAP`,
`ICON_COLOR_MAP`. Le picker `IconPicker` + `ColorPicker` existe en local
dans `app/(main)/settings/categories/_client.tsx`.

Plutôt que dupliquer, on extrait tout dans un module partagé et les
catégories deviennent un consommateur comme les projets.

### Icon picker compact en popover
Fini le bloc de pickers empilé verticalement qui mange la hauteur du form.
Le `IconPickerField` devient une **tuile cliquable `size-10`** (preview de
l'état courant) placée **inline à gauche du champ nom**. Au clic, un
`Popover` s'ouvre avec `ColorPicker` en haut et `IconPicker` dessous. Pattern
Linear / Notion.

```
┌────┐  ┌──────────────────────────────┐
│ 📁 │  │ Nom du projet                │
└────┘  └──────────────────────────────┘
  ↑
  clic → popover { ColorPicker + IconPicker }
```

### Icon dans le Select projet — trigger ET items
La règle Blazz sur Select dit que `Select.Value` affiche la `value` brute
sauf si `items` est fourni en `{value, label: string}`. Ça force `label` à
être une string, donc on ne peut pas mettre un icon dans `SelectValue`
directement.

Solution : on garde `items` avec des labels texte pour l'accessibilité, et
on override le contenu visuel du `SelectTrigger` en allant chercher l'objet
projet sélectionné côté form state :

```tsx
<SelectTrigger>
  {selectedProject ? (
    <InlineStack gap="200" blockAlign="center">
      <ProjectIcon icon={selectedProject.icon} color={selectedProject.color} size="xs" />
      <span className="truncate">{selectedProject.name}</span>
    </InlineStack>
  ) : (
    <SelectValue placeholder="Choisir un projet" />
  )}
</SelectTrigger>
```

Les `SelectItem` dans le dropdown composent de la même manière :
`<ProjectIcon /> + nom` en children.

### Re-export vs vrai move : vrai move
Le module partagé devient la source de vérité. Les catégories importent
depuis `lib/icon-palette.ts`. Sémantique propre (`ICON_*` plutôt que
`CATEGORY_*`), une seule définition de la palette.

## Architecture

### Nouveaux fichiers

- **`apps/ops/lib/icon-palette.ts`** — constantes et helpers partagés
  - `ICON_COLORS` (ex-`CATEGORY_COLORS`) — 8 couleurs soft bg/text
  - `ICON_SET` (ex-`CATEGORY_ICONS`) — 25 lucide icons curated
  - `getIcon(iconId?)` (ex-`getCategoryIcon`)
  - `getIconColorClasses(color?)` (ex-`getCategoryColorClasses`)
  - `DOT_COLOR_MAP`, `ICON_COLOR_MAP`
  - Type `IconId = string`, `IconColor = string` (juste alias `string` pour
    éviter les enums TS trop rigides — la validation se fait à l'affichage
    via `getIcon`/`getIconColorClasses` qui fallback gracieusement)

- **`apps/ops/components/icon-picker.tsx`** — composants picker partagés
  - `IconPicker` — grille 8 colonnes d'icônes cliquables (extrait 1:1 de
    `settings/categories/_client.tsx`)
  - `ColorPicker` — rangée de 8 pastilles de couleur (extrait 1:1)
  - `IconPickerField` — wrapper form : tuile `size-10` cliquable + popover
    contenant `ColorPicker` + `IconPicker`
  - `IconPickerTile` — tuile standalone pour preview/trigger (utilisée par
    `IconPickerField` et potentiellement d'autres contextes)

- **`apps/ops/components/project-icon.tsx`** — composant d'affichage pur
  - `<ProjectIcon icon={} color={} size="xs|sm|md" />`
  - Fallback : `folder` / `zinc` si undefined
  - Tailles :
    - `xs` → `size-5` (pour selects)
    - `sm` → `size-6` (pour listes)
    - `md` → `size-8` (pour PageHeader)
  - Rendu : tuile `rounded-md` avec `bg-*-100 dark:bg-*-900/30` + lucide
    icon centré en `text-*-700 dark:text-*-400`

### Fichiers modifiés

- **`apps/ops/convex/schema.ts`** — ajout de deux champs optionnels à
  `projects` :
  ```ts
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  ```
  Pas de migration (optionnels).

- **`apps/ops/convex/projects.ts`** — mutations `create` et `update`
  reçoivent `icon?: string` et `color?: string` en args optionnels. Pas de
  défaut serveur — fallback purement UI.

- **`apps/ops/components/manage-categories-sheet.tsx`** — retire les
  constantes locales `CATEGORY_COLORS`, `CATEGORY_ICONS`, `DOT_COLOR_MAP`,
  `ICON_COLOR_MAP`, `getCategoryColorClasses`, `getCategoryIcon`. Importe
  depuis `@/lib/icon-palette`. `CategoryBadge` reste en local. Pour garder
  la compat des imports existants (`settings/categories/_client.tsx`
  importe `CATEGORY_COLORS`/`CATEGORY_ICONS`/`getCategoryIcon` depuis ici),
  on re-exporte les alias le temps de migrer les call sites — ou on
  migre direct si tous les call sites sont dans ce spec.

  **Audit des call sites de `CATEGORY_*` à migrer** (à faire durant
  l'implémentation) :
  - `app/(main)/settings/categories/_client.tsx` — en local `IconPicker`
    et `ColorPicker` dupliqués à supprimer au profit de ceux de
    `components/icon-picker.tsx` ; imports `CATEGORY_COLORS`,
    `CATEGORY_ICONS`, `getCategoryIcon` à remplacer par `ICON_COLORS`,
    `ICON_SET`, `getIcon`.
  - Tout autre fichier importe ces symboles ? (grep dans le plan avant
    implémentation)

- **`apps/ops/app/(main)/settings/categories/_client.tsx`** — supprime les
  `IconPicker` et `ColorPicker` locaux, importe depuis
  `@/components/icon-picker`. Update les imports de constantes.

- **`apps/ops/components/project-form.tsx`** :
  - Ajoute `icon` et `color` au schéma zod et au state.
  - Remplace le premier bloc (Label "Nom" + Input) par une ligne
    `InlineStack blockAlign="end" gap="300"` avec `<IconPickerField>` à
    gauche et le champ nom à droite (qui garde son label au-dessus).
  - Défauts à la création : `icon: undefined`, `color: undefined`
    (laissés vides, le fallback d'affichage s'en charge). Pas de défaut
    "folder"/"zinc" imposé pour laisser l'utilisateur reconnaître les
    projets non customisés.

- **`apps/ops/app/(main)/clients/[id]/_client.tsx`** — chaque item de
  projet gagne un `ItemMedia` avec `<ProjectIcon size="sm">` devant le nom.

- **`apps/ops/app/(main)/projects/[pid]/layout.tsx`** — `PageHeader` du
  projet reçoit un icon visuel avant le titre (`<ProjectIcon size="md">`).
  Si le `PageHeader` du layout ne supporte pas directement un icon, on
  compose en `InlineStack` dans le slot titre.

- **Selects de projet** (4 call sites à vérifier pendant l'implém) :
  - `apps/ops/components/time-entry-form.tsx`
  - `apps/ops/app/(main)/expenses/_expense-dialog.tsx`
  - `apps/ops/components/invoice-editor.tsx`
  - `apps/ops/components/todos-data-table.tsx` (si select projet présent)

  Pour chaque : garder `items={[{value, label}]}` en pur texte, override le
  contenu visuel du `SelectTrigger` en calculant `selectedProject` depuis
  la liste des projets et le render avec `<ProjectIcon size="xs"> + nom`.
  Les `SelectItem` dans le dropdown reçoivent des children `<ProjectIcon
  size="xs"> + nom` pour la cohérence visuelle.

## Data flow

```
User ouvre ProjectForm
  ↓
IconPickerField affiche la tuile (icon/color depuis form state ou fallback)
  ↓
Click tuile → Popover ouvre
  ↓
Click sur icon dans IconPicker → setValue("icon", id) → popover se ferme
Click sur pastille dans ColorPicker → setValue("color", id) → popover reste ouvert
  ↓
Submit form → mutation create/update avec icon + color
  ↓
Convex persiste → liste projets se refresh → ProjectIcon rendu dans les surfaces
```

## Gestion d'états

- **Projet sans icon/color** → `ProjectIcon` rend `folder` + `zinc` (fallback).
- **Icon id invalide** (ex: id supprimé de `ICON_SET` plus tard) →
  `getIcon()` retourne `null` → fallback `folder`.
- **Color id invalide** → `getIconColorClasses()` retourne l'entrée `zinc`
  par défaut.
- **Dark mode** → classes `bg-*-100 dark:bg-*-900/30` + `text-*-700
  dark:text-*-400` déjà testées par les catégories.
- **Form en mode édition** → `defaultValues.icon` et `defaultValues.color`
  alimentent l'état initial, la tuile affiche immédiatement le bon preview.

## Tests

### Convex (`convex/projects.test.ts`, existant)

Ajouts :
1. `create` avec `icon: "briefcase"` + `color: "indigo"` → check persistance
   en base.
2. `create` sans icon/color → check que les champs sont `undefined` en base.
3. `update` qui set icon + color sur un projet existant → check update
   réussi.
4. `update` qui efface un icon : le handler filtre les clés `undefined`
   avant `db.patch` pour éviter d'écraser involontairement. Si on veut
   réellement effacer, on passera `icon: null` côté API et on le
   convertira ; pour ce lot, l'UI ne permet pas d'effacer (on remplace
   toujours par un autre icon), donc ce cas n'est pas à couvrir.

### Composants

Pas de Testing Library setup pour `apps/ops` à confirmer avant implém. Si
absent : pas de tests composant. Validation visuelle via le dev server.

### Validation manuelle (checklist d'exécution)

- [ ] Form création projet : picker ouvre, change icon, change couleur,
      submit persiste.
- [ ] Form édition projet : icon/color pré-remplis, modif persiste.
- [ ] Liste projets d'un client : icon visible en `ItemMedia`.
- [ ] Page détail projet : icon visible dans PageHeader.
- [ ] Select projet dans time-entry-form : icon visible trigger + items.
- [ ] Select projet dans expense-dialog : idem.
- [ ] Select projet dans invoice-editor : idem.
- [ ] Dark mode : toutes les surfaces restent lisibles.
- [ ] Catégories (page settings) : toujours fonctionnelles après migration.

## Règles Blazz respectées

- **Layout primitives only** : `BlockStack`, `InlineStack`, `Box`, pas de
  `<div>` de layout dans les nouveaux composants.
- **Base UI render prop** : `PopoverTrigger render={<IconPickerTile />}`
  (pas `asChild`).
- **Select items obligatoire** : `items={[{value, label: string}]}` maintenu
  pour l'accessibilité ; override purement visuel du trigger.
- **Densité** : tuile `size-10` (40px) dans le form, alignée sur la hauteur
  visuelle de l'Input nom ; `size-6` (24px) dans les listes ; `size-5`
  (20px) dans les selects.
- **Sémantique couleur** : les couleurs du picker sont décoratives
  (identité projet), pas sémantiques (statut). C'est explicite — on ne
  réutilise pas `bg-brand` / `bg-success` / etc.
- **Pas de modifications `packages/ui` ou `packages/pro`** (tout reste dans
  `apps/ops`).

## Risques et mitigations

| Risque | Mitigation |
|---|---|
| Migration des catégories casse la page settings | Extraction 1:1 des composants, même API. Test manuel avant de merger. |
| Popover dans un Dialog (form projet est dans un Dialog) pose souci de z-index | Base UI gère nativement les portails imbriqués. Test manuel. |
| Override du SelectTrigger casse l'accessibilité | `items={[{value, label}]}` reste fourni pour le screen reader ; l'override est purement visuel. |
| Les 4 call sites de select projet ont tous une structure différente | Chaque intégration est indépendante, un commit par call site si besoin. |

## Ordre d'implémentation recommandé

1. Créer `lib/icon-palette.ts` (move des constantes + helpers).
2. Créer `components/icon-picker.tsx` (extraction `IconPicker` +
   `ColorPicker` + nouveau `IconPickerField` + `IconPickerTile`).
3. Migrer `manage-categories-sheet.tsx` + `settings/categories/_client.tsx`
   pour consommer les nouveaux modules. **Vérifier que les catégories
   marchent toujours.**
4. Ajouter les champs dans `schema.ts` + mutations `projects.ts`.
5. Créer `components/project-icon.tsx`.
6. Intégrer dans `project-form.tsx` (form).
7. Intégrer dans `clients/[id]/_client.tsx` (liste).
8. Intégrer dans `projects/[pid]/layout.tsx` (detail).
9. Intégrer dans les 4 selects (un par un).
10. Tests Convex.
11. Validation manuelle complète.
