# Composition & Layout Guide

> Comment assembler des composants Blazz pour construire des pages et des composants custom.
> Ce guide couvre les layout primitives, les compositions courantes, et les règles d'imbrication.

---

## PARTIE 1 — LAYOUT PRIMITIVES

### Arbre de décision

```
"Je veux empiler des éléments..."
  └─ Verticalement ?     → BlockStack
  └─ Horizontalement ?   → InlineStack
  └─ En grille ?         → Grid + Grid.Cell

"Je veux un conteneur avec un style visuel..."
  └─ Background/border/shadow/padding ? → Box
  └─ Juste un gap entre enfants ?       → BlockStack ou InlineStack (PAS Box)

"Je veux combiner les deux..."
  └─ Box > BlockStack (conteneur stylé avec contenu empilé)
```

### Quand utiliser quoi

```
BOX         → Conteneur avec style visuel (background, border, padding, shadow)
              C'est un "wrapper styled". Ne sert PAS à positionner des enfants.

BLOCKSTACK  → Empiler des éléments verticalement (flex-col + gap)
              C'est le layout par défaut pour une page, une section, un formulaire.

INLINESTACK → Aligner des éléments horizontalement (flex-row + gap)
              C'est le layout pour header, toolbar, badges, boutons groupés.

GRID        → Grille 12 colonnes responsive avec Grid.Cell
              C'est le layout pour FieldGrid, dashboards, layouts multi-colonnes.

INLINEGRID  → Grille simple à colonnes égales (CSS grid)
              Pas de responsive — colonnes fixes, layout rapide.

DIVIDER     → Séparateur visuel horizontal (hr)
              Quand l'espacement seul ne suffit pas.

BLEED       → Marge négative contrôlée pour déborder du padding parent.
              Image ou Divider qui doit toucher les bords d'une card paddée.
```

### Box — Conteneur visuel

```tsx
import { Box } from "@blazz/ui/components/ui/box"

// Card simple
<Box padding="4" background="surface" border="default" borderRadius="lg">
  <BlockStack gap="200">
    <h3>Titre</h3>
    <p>Contenu</p>
  </BlockStack>
</Box>

// Section avec fond
<Box padding="6" background="raised" borderRadius="md">
  {children}
</Box>

// Polymorphe — rendu en <section>
<Box as="section" padding="6" background="surface">
  {children}
</Box>
```

**Variants disponibles :**
```
padding     : "0" | "2" | "4" | "6" | "8"
background  : "transparent" | "app" | "surface" | "raised" | "overlay" | "accent"
border      : "none" | "default"
borderRadius: "none" | "sm" | "md" | "lg" | "xl"
shadow      : "none" | "sm" | "md" | "lg"
as          : tout élément HTML ("div", "section", "article", "aside", etc.)
```

**Règles :**
- `shadow` → uniquement pour les dropdowns, modals, toasts (cf. Tufte)
- `background="raised"` → pour les zones qui se détachent du fond
- `background="accent"` → 10% opacity, pour les highlights subtils
- Ne PAS utiliser Box pour positionner des enfants — c'est un wrapper, pas un layout

### BlockStack — Empilement vertical

```tsx
import { BlockStack } from "@blazz/ui/components/ui/block-stack"

// Section de page
<BlockStack gap="600">       {/* 24px — entre sections */}
  <PageHeader />
  <StatsGrid />
  <DataGrid />
</BlockStack>

// Contenu d'une card
<BlockStack gap="200">       {/* 8px — entre éléments d'un groupe */}
  <span className="text-xs text-muted">Label</span>
  <span className="text-lg font-semibold">€45 000</span>
</BlockStack>

// Formulaire
<BlockStack gap="400" as="fieldset">  {/* 16px — entre les champs */}
  <FormField name="name" />
  <FormField name="email" />
  <FormField name="phone" />
</BlockStack>
```

**Mapping gap → espacement (échelle 4px) :**
```
gap="050" → 2px     gap="400" → 16px   ← entre champs de formulaire
gap="100" → 4px     gap="500" → 20px
gap="150" → 6px     gap="600" → 24px   ← entre sections
gap="200" → 8px     gap="800" → 32px   ← entre blocs majeurs
gap="300" → 12px    gap="1200" → 48px  ← entre zones de page
```

**Règles :**
- `gap="200"` (8px) pour éléments d'un même groupe (label + valeur, items d'une liste)
- `gap="400"` (16px) pour éléments liés mais distincts (champs de formulaire)
- `gap="600"` (24px) pour sections d'une page
- `gap="800"` (32px) pour blocs majeurs

### InlineStack — Alignement horizontal

```tsx
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"

// Toolbar / Header actions
<InlineStack gap="200" align="space-between" blockAlign="center">
  <h2>Contacts (247)</h2>
  <InlineStack gap="200">
    <Button variant="outline">Exporter</Button>
    <Button>+ Ajouter</Button>
  </InlineStack>
</InlineStack>

// Badges / Tags
<InlineStack gap="100" wrap={true}>
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
  <Badge>Tailwind</Badge>
</InlineStack>

// Label + valeur inline
<InlineStack gap="100" blockAlign="center">
  <span className="size-2 rounded-full bg-success" />
  <span className="text-sm text-secondary">Actif</span>
</InlineStack>
```

**Props clés :**
```
gap        : même échelle que BlockStack
align      : "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"
blockAlign : "start" | "center" | "end" | "baseline" | "stretch"
wrap       : true (défaut) | false
direction  : "row" (défaut) | "row-reverse"
```

**Règles :**
- `align="space-between"` pour header avec titre à gauche et actions à droite
- `blockAlign="center"` pour aligner verticalement des éléments de tailles différentes
- `blockAlign="baseline"` pour aligner du texte de tailles différentes
- `wrap={false}` pour les toolbars qui ne doivent pas wraper

### Grid + Grid.Cell — Grille 12 colonnes

```tsx
import { Grid } from "@blazz/ui/components/ui/grid"

// Dashboard KPIs (4 colonnes)
<Grid>
  <Grid.Cell columnSpan={{ xs: 6, md: 3 }}><KpiCard /></Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, md: 3 }}><KpiCard /></Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, md: 3 }}><KpiCard /></Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, md: 3 }}><KpiCard /></Grid.Cell>
</Grid>

// FieldGrid 3 colonnes
<Grid columns={{ md: 12 }}>
  <Grid.Cell columnSpan={{ xs: 6, md: 4 }}>Champ 1</Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, md: 4 }}>Champ 2</Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, md: 4 }}>Champ 3</Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 12, md: 12 }}>Champ pleine largeur</Grid.Cell>
</Grid>
```

**Patterns de colonnes courants :**
```
4 × 3  → KPIs, stats cards            → columnSpan={{ xs: 6, md: 3 }}
3 × 4  → FieldGrid 3 cols             → columnSpan={{ xs: 6, md: 4 }}
2 × 6  → Charts, sections doubles     → columnSpan={{ xs: 12, md: 6 }}
1 × 12 → Pleine largeur               → columnSpan={{ xs: 12 }}
8 + 4  → Contenu principal + sidebar   → columnSpan md: 8 + md: 4
```

### InlineGrid — Grille simple

```tsx
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"

// 3 colonnes égales
<InlineGrid columns={3} gap="400">
  <Card /><Card /><Card />
</InlineGrid>

// Colonnes asymétriques (2/3 + 1/3)
<InlineGrid columns="twoThirds" gap="600">
  <main>Contenu principal</main>
  <aside>Sidebar</aside>
</InlineGrid>
```

**Quand InlineGrid vs Grid :**
```
InlineGrid → colonnes fixes, pas de responsive, layout rapide
             Ex: 2 charts côte à côte, formulaire 2 colonnes simple

Grid       → responsive 12 colonnes, Grid.Cell avec columnSpan par breakpoint
             Ex: dashboard KPIs (4 cols desktop → 2 cols mobile), FieldGrid
```

### Bleed — Marge négative contrôlée

```tsx
import { Bleed } from "@blazz/ui/components/ui/bleed"

// Image full-width dans une card paddée
<Box padding="4" background="surface" border="default" borderRadius="lg">
  <BlockStack gap="300">
    <h3>Titre</h3>
    <Bleed marginInline="400">          {/* annule le p-4 horizontal */}
      <img src="..." className="w-full" />
    </Bleed>
    <p>Description sous l'image</p>
  </BlockStack>
</Box>

// Divider full-width dans un contenu paddé
<Box padding="6">
  <BlockStack gap="400">
    <section>Section 1</section>
    <Bleed marginInline="600">
      <Divider />
    </Bleed>
    <section>Section 2</section>
  </BlockStack>
</Box>
```

**Règles :**
- La valeur de Bleed doit correspondre au padding du parent (parent `padding="4"` → `marginInline="400"`)
- Utilise les directions logiques (inline/block) — respecte le RTL

### Divider — Séparateur

```tsx
import { Divider } from "@blazz/ui/components/ui/divider"

<Divider />                          // Subtil (défaut)
<Divider borderColor="default" />    // Plus visible
```

**Règles :**
- Préférer l'espacement (BlockStack gap) au Divider pour séparer les sections
- Utiliser Divider quand le gap seul ne suffit pas
- `borderColor="secondary"` (défaut) pour 90% des cas

---

## PARTIE 2 — LAYOUT PAR TYPE DE PAGE

### Dashboard

```
PageHeader (titre + sélecteur de période)
↓ 24px
StatsGrid (4 KPIs en une ligne)
↓ 24px
Grid 2 colonnes (ChartCards)
↓ 24px
Grid 2 colonnes (Table mini + Timeline)
```

**Règles :**
- Max 4 KPIs en première ligne. 5+ → 4 principaux en haut, 2 secondaires plus bas.
- KPI card : VALEUR = point focal (24px, semibold). Label = caption (11px, muted).
- Graphiques en grid 2 colonnes. Bar chart (état actuel) à gauche, line chart (évolution) à droite.
- Mini DataGrid en bas : MAX 5 lignes + "Voir tout →".

### Page de liste (Resource List)

```
PageHeader (titre + count + actions)
↓ 16px
FilterBar (recherche + filtres)
↓ 0px (collé à la table)
DataGrid
↓ sticky en bas
BulkActionBar (si sélection)
```

**Règles :**
- Count dans le titre : "Entreprises (2 847)"
- Filtres AU-DESSUS de la table, jamais à côté
- Première colonne = identifiant, cliquable, font-medium
- Colonnes de chiffres alignées à droite
- Statuts = dot + texte
- Actions = menu ⋯ en dernière colonne
- Filtres et pagination persistés dans l'URL

### Page de détail (Resource Detail)

```
PageHeader (breadcrumb + titre + badge statut + actions)
↓ 24px
Tabs (Résumé | Contacts | Deals | Activités)
↓ 16px
Contenu du tab actif
```

**Tab Résumé — FieldGrid :**
- 2 colonnes si < 8 champs, 3 colonnes si 8-15 champs
- Champs longs (adresse, description) → col-span pleine largeur
- Label : 13px, text-muted. Valeur : 14px, font-medium.

### Formulaire (Create/Edit)

```
PageHeader (breadcrumb + "Nouveau [ressource]")
↓ 24px
FormSection "Informations" (collapsible, ouvert)
  FieldGrid de FormFields
↓ 24px
FormSection "Détails" (collapsible, ouvert)
↓ sticky en bas
Footer [Annuler] [Sauvegarder]
```

**Règles :**
- < 6 champs → 1 colonne. 6-12 → 2 colonnes. 12-20 → 2 colonnes + FormSections. > 20 → MultiStepForm.
- Labels AU-DESSUS des inputs
- Footer sticky TOUJOURS visible

### Pipeline Kanban

```
PageHeader (titre + toggle Kanban|Table + actions)
↓ 16px
FilterBar
↓ 0px
KanbanBoard (scroll horizontal)
  KanbanColumn (scroll vertical)
    KanbanCard
```

---

## PARTIE 3 — COMPOSITIONS COURANTES

### Page standard

```tsx
<BlockStack gap="600">
  <InlineStack align="space-between" blockAlign="center">
    <h1>Contacts (247)</h1>
    <Button>+ Ajouter</Button>
  </InlineStack>
  <DataGrid />
</BlockStack>
```

### Card KPI

```tsx
<Box padding="4" background="surface" border="default" borderRadius="lg">
  <BlockStack gap="200">
    <span className="text-xs text-muted uppercase tracking-wide">Revenu</span>
    <span className="text-2xl font-semibold tabular-nums">€1.2M</span>
    <InlineStack gap="100" blockAlign="center">
      <ArrowUp className="size-3 text-success" />
      <span className="text-sm text-success">+8.2%</span>
    </InlineStack>
  </BlockStack>
</Box>
```

### Fiche détail — section

```tsx
<BlockStack gap="600">
  <BlockStack gap="100">
    <h2 className="text-base font-semibold">Informations</h2>
    <Divider />
  </BlockStack>
  <Grid columns={{ md: 12 }}>
    <Grid.Cell columnSpan={{ md: 4 }}>
      <BlockStack gap="050">
        <span className="text-xs text-muted">Nom</span>
        <span className="text-sm font-medium">Acme Corp</span>
      </BlockStack>
    </Grid.Cell>
    {/* ... autres champs */}
  </Grid>
</BlockStack>
```

### Toolbar avec actions groupées

```tsx
<InlineStack gap="200" align="space-between" blockAlign="center">
  <InlineStack gap="200" blockAlign="center">
    <Input placeholder="Rechercher..." className="w-64" />
    <Select items={{ active: "Actif", inactive: "Inactif" }}>
      <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Actif</SelectItem>
        <SelectItem value="inactive">Inactif</SelectItem>
      </SelectContent>
    </Select>
  </InlineStack>
  <InlineStack gap="200">
    <Button variant="outline" size="sm">Exporter</Button>
    <Button size="sm">+ Ajouter</Button>
  </InlineStack>
</InlineStack>
```

### Dialog avec formulaire

```tsx
<Dialog>
  <DialogTrigger render={<Button />}>Nouveau client</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Nouveau client</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
      <BlockStack gap="400">
        <FormField name="name" label="Nom" />
        <FormField name="email" label="Email" />
        <InlineGrid columns={2} gap="400">
          <FormField name="phone" label="Téléphone" />
          <FormField name="company" label="Entreprise" />
        </InlineGrid>
      </BlockStack>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "..." : "Créer"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

---

## PARTIE 4 — CONSTRUIRE UN COMPOSANT CUSTOM

### Quand créer un composant custom

```
CRÉER si :
- Le même assemblage de 3+ primitives apparaît 2+ fois
- Le composant a une sémantique métier claire (ClientCard, DealStage, InvoiceRow)
- L'assemblage a des props propres qui simplifient l'usage

NE PAS CRÉER si :
- L'assemblage n'apparaît qu'une fois (inline le code)
- La "réutilisation" est hypothétique (YAGNI)
- Le composant n'a qu'un enfant passé tel quel (wrapper inutile)
```

### Structure type

```tsx
// components/client-card.tsx

import { Box } from "@blazz/ui/components/ui/box"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Avatar } from "@blazz/ui/components/ui/avatar"
import { Badge } from "@blazz/ui/components/ui/badge"

interface ClientCardProps {
  name: string
  email: string
  status: "active" | "inactive" | "prospect"
  avatarUrl?: string
  onClick?: () => void
}

const statusMap = {
  active: { label: "Actif", variant: "success" },
  inactive: { label: "Inactif", variant: "default" },
  prospect: { label: "Prospect", variant: "info" },
} as const

export function ClientCard({ name, email, status, avatarUrl, onClick }: ClientCardProps) {
  return (
    <Box
      padding="4"
      background="surface"
      border="default"
      borderRadius="lg"
      as={onClick ? "button" : "div"}
      onClick={onClick}
      className={onClick ? "cursor-pointer hover:border-edge" : undefined}
    >
      <InlineStack gap="300" blockAlign="center">
        <Avatar src={avatarUrl} fallback={name} size="sm" />
        <BlockStack gap="050">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-fg-muted">{email}</span>
        </BlockStack>
        <Badge variant={statusMap[status].variant} className="ml-auto">
          {statusMap[status].label}
        </Badge>
      </InlineStack>
    </Box>
  )
}
```

### Règles de construction

1. **Props typées** — Interface explicite, pas de `Record<string, any>`. Nommer les props par ce qu'elles représentent (`status`), pas par comment elles sont rendues (`badgeColor`).

2. **Composition interne** — Utiliser les layout primitives (BlockStack, InlineStack, Box), jamais des `<div>` avec des classes flex.

3. **Pas de style inline** — Passer par les props des primitives (`padding`, `gap`, `background`) ou par `className` si nécessaire. Pas de `style={{}}`.

4. **Maps de variants** — Les mappings visuels (status → couleur, type → icône) sont des `const` en dehors du composant, typés `as const`.

5. **Polymorphisme via `as`** — Si le composant peut être un `<button>` ou un `<a>` selon le contexte, utiliser la prop `as` de Box ou rendre le root conditionnel.

6. **Pas de logique métier** — Le composant custom est purement visuel. Les fetches, mutations, calculs vont dans des hooks ou des server actions à l'extérieur.

### Exemple : composant métier complexe

```tsx
// components/deal-card.tsx — Card de deal pour le kanban

interface DealCardProps {
  title: string
  company: string
  amount: number
  probability: number
  assignee: { name: string; avatarUrl?: string }
  daysInStage: number
}

export function DealCard({ title, company, amount, probability, assignee, daysInStage }: DealCardProps) {
  return (
    <Box padding="3" background="surface" border="default" borderRadius="md" className="cursor-grab">
      <BlockStack gap="200">
        {/* Titre + montant */}
        <InlineStack align="space-between" blockAlign="start">
          <BlockStack gap="050">
            <span className="text-sm font-medium line-clamp-1">{title}</span>
            <span className="text-xs text-fg-muted">{company}</span>
          </BlockStack>
          <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
            €{amount.toLocaleString("fr-FR")}
          </span>
        </InlineStack>

        {/* Assignee + ancienneté */}
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="100" blockAlign="center">
            <Avatar src={assignee.avatarUrl} fallback={assignee.name} size="xs" />
            <span className="text-xs text-fg-muted">{assignee.name}</span>
          </InlineStack>
          <span className="text-xs text-fg-subtle">{daysInStage}j</span>
        </InlineStack>

        {/* Barre de probabilité */}
        <div className="h-0.5 w-full rounded-full bg-edge-subtle">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${probability}%` }}
          />
        </div>
      </BlockStack>
    </Box>
  )
}
```

---

## PARTIE 5 — RÈGLES D'IMBRICATION

### Règle 1 : Source unique de padding

Un seul niveau contrôle le padding horizontal à un instant donné. Si le parent a `padding="4"`, un enfant ne doit PAS recevoir `px-4` en plus.

```
❌ Box padding="4" > div className="px-4"     → double padding (32px au lieu de 16px)
✅ Box padding="4" > BlockStack               → 16px total
```

### Règle 2 : Radius concentrique

Quand un parent arrondi contient un enfant arrondi avec un gap (padding) entre les deux :

```
inner_radius = outer_radius - gap

Exemple : Card avec radius-lg (8px) et padding 8px
→ inner element radius = 8px - 8px = 0px (pas de radius)

Exemple : Card avec radius-xl (12px) et padding 4px
→ inner element radius = 12px - 4px = 8px (radius-lg)
```

### Règle 3 : Pattern Footer "bleed"

Quand un Footer est à l'intérieur d'un conteneur paddé, il annule le padding parent :

```tsx
<Box padding="4">
  <BlockStack gap="400">
    <div>Contenu...</div>

    {/* Footer qui touche les bords */}
    <Bleed marginInline="400" marginBlockEnd="400">
      <Box padding="4" className="border-t border-edge">
        <InlineStack align="end" gap="200">
          <Button variant="outline">Annuler</Button>
          <Button>Sauvegarder</Button>
        </InlineStack>
      </Box>
    </Bleed>
  </BlockStack>
</Box>
```

### Règle 4 : Box > Layout > Contenu

L'ordre d'imbrication standard :

```
Box (style visuel : background, border, padding)
  └─ BlockStack ou InlineStack (positionnement : gap, alignement)
       └─ Contenu (texte, composants)

JAMAIS :
  BlockStack > Box (le Box serait un enfant du layout, pas un wrapper)
  Box > Box (redondant sauf cas de nesting volontaire type card-in-card)
```

### Règle 5 : Quand `<div>` est OK

```
✅ position: absolute/fixed (pas de primitive pour ça)
✅ overflow: auto/hidden (scroll containers)
✅ Wrapper pour un composant tiers qui exige un DOM spécifique
✅ Barre de progression (élément de taille dynamique via style)
✅ Overlay/backdrop

❌ Tout le reste → utilise les primitives
```

---

## PARTIE 6 — COMPOSANTS VISUELS SPÉCIFIQUES

### Tables (DataGrid)

```
ALIGNEMENT :
- Texte → à gauche
- Chiffres → à droite
- Dates → à gauche
- Statuts → à gauche
- Actions → dernière colonne, à droite

HEADER : 12px, font-weight 500, text-muted, sticky
CELL : 13px, text-primary. Subtext 12px text-muted sous le texte principal.
ROW : height 40px, hover bg-surface-hover, sélection bg-accent 5-10%
```

### Formulaires

```
CHAMPS :
- Label au-dessus de l'input (jamais à côté)
- Label : 13px, font-medium, text-primary
- Input : 32px height, 13px font-size
- Focus : border-accent, ring 2px accent/20%
- Erreur : border-destructive, message 12px destructive
- Valeur manquante : "—" (em dash)

COMPOSANTS OBLIGATOIRES :
- Dates → <DateSelector> (jamais <Input type="date">)
- Plage de dates → <DateRangeSelector> (jamais 2 DateSelector séparés)
- Sélection → <Select> avec items prop (jamais <select> natif)

BOUTONS dans Dialog :
- Toujours dans <DialogFooter>
- type="button" sur Annuler (évite submit accidentel)
- disabled={isSubmitting} sur les DEUX boutons
```

### Cards KPI (StatsGrid)

```
┌──────────────────────┐
│ Label           Icon │   ← Caption (11px, muted), icône 16px muted
│                      │
│ €1.2M               │   ← Display (24px, semibold, primary) — POINT FOCAL
│ ▲ 8%   ░░░████      │   ← Trend (13px, success/destructive) + sparkline
└──────────────────────┘

- Max 4 cards par ligne
- Valeur = 2-3x plus grande que le reste
- Trend coloré (vert ▲, rouge ▼)
```

### Graphiques (ChartCard)

```
- Pas de grille verticale
- Lignes horizontales subtiles (5-10% opacity)
- Pas de légende si < 3 séries (labels directs)
- Tooltip au hover avec valeurs exactes
- PAS de pie chart → bar chart horizontal
- Bar chart (état actuel) à gauche, line chart (évolution) à droite
```

### Empty States

```
Deux types :
- "no data" : icône + titre + description + CTA créer
- "no results" : icône + "Aucun résultat" + lien "Réinitialiser"

Jamais d'espace vide sans explication.
Icône en text-muted, jamais en accent.
```
