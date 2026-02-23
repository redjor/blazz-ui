# Pro UI Kit — Design Skill

> LIS CE FICHIER AVANT DE GÉNÉRER DU CODE UI.
> Chaque décision visuelle doit respecter ces principes.
> Ce fichier est la différence entre "ça marche" et "ça fait professionnel".

---

## Philosophie

Pro UI Kit design pour des **power users** qui passent 8h/jour dans l'app.
Le design doit être **DENSE et CLAIR** simultanément.

- **Dense** = beaucoup d'information visible sans scroller
- **Clair** = hiérarchie visuelle forte, l'œil sait où aller immédiatement

Référence : Linear, Vercel Dashboard, Airtable, Notion.
Anti-référence : Bootstrap, Material UI default, templates admin Dribbble.

> "Above all else, show the data." — Edward Tufte

---

## PARTIE 1 — LES LOIS FONDAMENTALES

### Loi 1 : Data-Ink Ratio (Edward Tufte)

Chaque pixel à l'écran doit justifier son existence. Si un élément visuel
peut être supprimé sans perte d'information, supprime-le.

```
Data-Ink Ratio = Pixels qui montrent des données / Total des pixels

OBJECTIF : maximiser ce ratio.
```

**Applications concrètes :**
- Pas de box-shadow sur les cards → utilise un border 1px subtil
- Pas de background coloré sur les badges de statut → utilise un dot ● + texte
- Pas de grille visible dans les graphiques → lignes horizontales subtiles uniquement
- Pas de header de colonne en gras + background → juste font-medium + border-bottom
- Pas de séparateurs verticaux dans les tables → l'espacement suffit
- Pas de bordures sur les boutons ghost → le texte + hover suffisent
- Pas d'icônes décoratives → chaque icône transmet une information ou facilite une action

**Le test Tufte :** pour chaque élément visuel, demande-toi :
"Si je supprime ça, est-ce que l'utilisateur perd de l'information ?"
Si non → supprime. Si oui → garde mais minimise.

```
❌ Card avec ombre, border, radius, padding généreux
✅ Card avec border 1px subtil (opacity 10%), padding serré

❌ Badge "Actif" avec background vert plein + texte blanc
✅ ● Actif (dot vert 6px + texte en text-secondary)

❌ Graphique avec grille complète + légende + titre + sous-titre
✅ Graphique avec lignes horizontales subtiles + titre court + tooltip au hover
```

---

### Loi 2 : Principes de Gestalt

Les principes de Gestalt expliquent comment le cerveau humain organise
l'information visuelle. Ce sont les lois physiques du design.

#### 2a. Proximité

**Les éléments proches sont perçus comme un groupe, même s'ils diffèrent
en forme, couleur ou taille.**

C'est LE principe le plus important en layout. La proximité est plus
puissante que la couleur, la forme, ou les bordures pour créer des groupes.

```
RÈGLE : L'espace ENTRE les groupes > l'espace DANS les groupes. Toujours.

Espace entre éléments d'un même groupe : 4-8px
Espace entre éléments liés mais distincts : 12-16px
Espace entre sections/groupes différents : 24-32px
Espace entre blocs majeurs de la page : 32-48px
```

**Application dans une fiche détail :**
```
Section "Informations"          ← 32px au-dessus (séparation du header)
  ┌─────────────────────────┐
  │ Label + Valeur           │  ← 4px entre label et valeur (très proches = liés)
  │                          │
  │ 16px                     │  ← entre les paires label/valeur
  │                          │
  │ Label + Valeur           │
  └─────────────────────────┘
                                ← 32px entre les sections
Section "Commercial"
  ┌─────────────────────────┐
  │ Label + Valeur           │
  │ ...                      │
  └─────────────────────────┘
```

**La proximité remplace les bordures.**
Si tu as besoin d'un border pour séparer deux zones, c'est souvent que
l'espacement est mal calibré. Essaie d'abord d'augmenter le gap.
Si ça ne suffit pas, un border subtil (opacity 10%) en dernier recours.

#### 2b. Similarité

**Les éléments qui partagent des caractéristiques visuelles (couleur, forme,
taille) sont perçus comme liés.**

```
RÈGLE : Même rôle = même apparence. Rôle différent = apparence différente.

- Tous les boutons primaires → même couleur, même taille, même radius
- Tous les liens de table → même couleur (accent), même font-weight
- Tous les labels → même taille (13px), même couleur (text-muted)
- Tous les badges de statut → même format (dot + texte)
```

**Conséquence directe :**
Si deux éléments se ressemblent mais n'ont pas le même rôle, l'utilisateur
sera confus. Différencie visuellement ce qui a un comportement différent.

#### 2c. Enclosure (Région commune)

**Les éléments dans une même zone fermée sont perçus comme un groupe.**

```
UTILISATION : Les cards et les sections avec background.

Card = un conteneur logique (une entité, un résumé, une stat)
Section = un groupe de champs liés dans un formulaire ou une fiche

RÈGLE : utilise l'enclosure avec parcimonie.
Trop de cards = perte de la hiérarchie (tout est au même niveau).
Réserve les cards aux éléments qui sont des ENTITÉS distinctes :
  ✅ Card pour chaque KPI dans un StatsGrid
  ✅ Card pour chaque item dans un kanban
  ❌ Card autour de chaque section d'un formulaire (utilise juste un titre + espacement)
```

#### 2d. Continuité

**L'œil suit les lignes et les courbes naturellement.**

```
UTILISATION : Les alignements.

- Tous les éléments d'une même colonne DOIVENT être alignés sur le même bord
- Les labels de formulaire alignés à gauche créent une ligne verticale
  que l'œil suit naturellement
- Les colonnes de chiffres dans les tables alignées à droite créent
  un alignement sur la virgule décimale
- Les éléments dans un FieldGrid s'alignent sur une grille implicite
```

#### 2e. Figure/Fond

**Le cerveau sépare automatiquement le "sujet" de l'"arrière-plan".**

```
UTILISATION :
- Le contenu principal (figure) se détache du background (fond)
- Les modals utilisent un overlay sombre pour pousser le fond en arrière
- Les menus dropdown utilisent une élévation subtile (border + léger shadow)
  pour se détacher du contenu derrière
- Les éléments sélectionnés ont un background distinct du reste
```

#### 2f. Point focal (Focal Point)

**L'élément visuellement différent des autres capte l'attention en premier.**

```
RÈGLE : UN SEUL point focal par zone visuelle.

- Un seul bouton primary par groupe d'actions
- Un seul chiffre en display (24px, semibold) par card KPI
- Un seul badge de couleur accent par row de table
- Si TOUT est mis en évidence, RIEN n'est mis en évidence

APPLICATION :
  ❌ [Primary] [Primary] [Primary]       → Tout est important = rien ne l'est
  ✅ [Primary] [Outline] [Ghost]         → La hiérarchie guide l'action

  ❌ Trois couleurs d'accent dans la même section
  ✅ Une couleur d'accent, le reste en text-secondary et text-muted
```

---

### Loi 3 : Hiérarchie visuelle

La hiérarchie visuelle guide l'œil dans l'ordre voulu.
Le cerveau traite l'information dans cet ordre :

```
1. Taille (le plus gros en premier)
2. Couleur/Contraste (le plus vif en premier)
3. Position (haut-gauche en premier, pattern en F)
4. Poids (le plus gras en premier)
5. Espacement (l'élément isolé attire l'attention)
```

#### Le pattern en F

Les utilisateurs d'apps professionnelles scannent en F :
- Ligne horizontale en haut (header, titre, actions)
- Ligne verticale à gauche (première colonne, sidebar)
- Scan rapide horizontal des lignes suivantes

```
F F F F F F F F F F
F
F F F F F F
F
F F F F
F
```

**Conséquences pour le layout :**
- Les informations les plus importantes en haut à gauche
- L'identifiant d'une row (nom, référence) toujours en première colonne
- Les actions principales en haut à droite du PageHeader
- La colonne d'actions secondaires (menu ⋯) en dernière position à droite

#### Maximum 3 niveaux par zone

```
Niveau 1 — FORT
  text-primary, font-semibold, 16-24px
  Usage : titres, valeurs clés, montants, noms

Niveau 2 — MOYEN
  text-secondary, font-medium, 13-14px
  Usage : labels, sous-titres, metadata

Niveau 3 — FAIBLE
  text-muted, font-normal, 12-13px
  Usage : timestamps, aide, info tertiaire, placeholders

Si tu as besoin de 4 niveaux → réorganise la section en 2 sous-sections.
```

---

### Loi 4 : Densité d'information

La densité est ce qui sépare une app enterprise d'un site SaaS marketing.
L'objectif : **montrer le maximum d'information utile par unité d'écran,
sans sacrifier la lisibilité.**

#### Le paradoxe de la densité

Plus il y a de données, plus chaque élément doit être compact.
Mais plus c'est compact, plus la hiérarchie doit être forte.

```
FAIBLE densité (marketing)    → gros texte, gros padding, peu d'info
HAUTE densité (enterprise)    → texte compact, padding serré, beaucoup d'info
                                MAIS hiérarchie visuelle renforcée

L'erreur classique : haute densité SANS hiérarchie = mur de données illisible
```

#### Les valeurs de densité Pro UI Kit

```css
/* Density tokens — le cœur du design enterprise */
--font-size-table: 13px;        /* PAS 14px — 1px fait une énorme différence en densité */
--line-height-table: 20px;      /* 1.54 ratio, compact mais lisible */
--row-height: 40px;             /* PAS 48, PAS 56 */
--row-height-compact: 32px;     /* Pour les tables très denses */
--cell-padding-x: 12px;
--cell-padding-y: 8px;
--input-height: 32px;           /* PAS 40px */
--input-height-lg: 36px;        /* Pour les formulaires standalone */
--button-height: 32px;
--button-height-lg: 36px;
--badge-padding: 2px 8px;       /* SERRÉ */
--sidebar-width: 240px;
--sidebar-collapsed: 64px;
--page-padding: 24px;
--page-max-width: 1440px;
--section-gap: 24px;
--group-gap: 16px;
--element-gap: 8px;
```

#### Progressive disclosure (divulgation progressive)

Ne pas montrer tout en même temps. Montrer le minimum nécessaire et
permettre à l'utilisateur d'aller plus loin.

```
Niveau 1 : Visible immédiatement
  → KPIs clés, colonnes principales, titre, statut

Niveau 2 : Visible au hover ou au clic
  → Actions secondaires (menu ⋯), tooltips, détails de cellule

Niveau 3 : Visible dans un panel ou une page dédiée
  → Historique, formulaires d'édition, logs d'activité

APPLICATION DANS UN DataGrid :
  Les 6-8 colonnes principales sont visibles.
  Les colonnes secondaires sont cachées par défaut (column picker).
  Les actions sur une row apparaissent au hover (menu ⋯).
  Le clic sur une row ouvre le détail dans un SplitView ou une navigation.
```

---

## PARTIE 2 — LE SYSTÈME VISUEL

### Espacement : l'échelle de 4px

Chaque margin, padding, gap doit être un multiple de 4px.
**Jamais de valeur arbitraire.**

```
4px   → micro espace (entre un dot de statut et son label)
8px   → espace entre éléments d'un même groupe
12px  → espace entre éléments liés mais distincts
16px  → espace dans un composant (padding d'une card simple)
24px  → espace entre groupes / sections
32px  → espace entre blocs majeurs
48px  → espace entre zones distinctes de la page
64px  → espace de séparation maximale
```

**La règle d'or :**
```
espace-interne < espace-entre-éléments < espace-entre-groupes < espace-entre-sections
```

Si tu respectes cette hiérarchie d'espacement, le layout sera lisible
automatiquement. C'est le principe de proximité de Gestalt appliqué
systématiquement.

### Typographie

**Police unique : Inter.** Pas de combo de fonts.
Inter est conçu pour les interfaces, optimisé pour les petites tailles,
et supporte les tabular figures (critique pour les colonnes de chiffres).

```
Display     : Inter 600, 24px, -0.025em tracking, line-height 1.2
Heading     : Inter 600, 18px, -0.02em tracking, line-height 1.3
Subheading  : Inter 500, 14px, -0.01em tracking, line-height 1.4
Body        : Inter 400, 14px, line-height 1.5
Body dense  : Inter 400, 13px, line-height 1.54   ← TABLES, FICHES
Caption     : Inter 500, 11px, uppercase, 0.05em tracking, line-height 1.4
Mono        : JetBrains Mono 400, 13px             ← IDs, codes, refs
```

**Règles typographiques absolues :**

1. `font-variant-numeric: tabular-nums` sur TOUTE colonne de chiffres
   (montants, quantités, pourcentages). Les chiffres doivent s'aligner
   verticalement.

2. Les montants sont TOUJOURS formatés :
   - Séparateur de milliers : espace insécable (1 234 567)
   - Symbole monétaire : €45 000 (pas 45000€, pas 45,000€)
   - Décimales cohérentes dans une même colonne (€45 000,00 OU €45 000)

3. Les dates sont relatives quand < 7 jours ("Il y a 2 jours"),
   absolues au-delà ("15 jan. 2025"). Jamais de timestamp complet
   sauf au hover (tooltip).

4. Les valeurs manquantes affichent "—" (em dash), JAMAIS un espace vide.

5. Le texte tronqué utilise `text-overflow: ellipsis` + tooltip complet
   au hover. Jamais de texte coupé sans indication.

### Couleurs et sémantique

**Règle fondamentale : la couleur est de l'information, pas de la décoration.**

Chaque utilisation de couleur doit transmettre un sens. Si un élément est
coloré "pour faire joli", supprime la couleur.

```
ACCENT (bleu par défaut)
  → Actions interactives : boutons primary, liens, sélection active
  → UN SEUL usage d'accent par zone visuelle

SUCCESS (vert)
  → Statut positif uniquement : "Actif", "Payé", "Complété", tendance ▲

WARNING (ambre)
  → Attention requise : "En attente", "Expire bientôt", seuil proche

DESTRUCTIVE (rouge)
  → Danger/Négatif : "Inactif", "En retard", "Erreur", tendance ▼, boutons de suppression

INFO (indigo)
  → Information neutre : "En cours", "Nouveau", étapes de workflow
```

**Règle du double codage :**
Ne JAMAIS transmettre une information uniquement par la couleur.
Toujours accompagner d'un texte, d'une icône, ou d'une forme.

```
❌ Badge rouge (daltoniens ne voient pas la différence)
✅ ● Erreur (dot rouge + mot "Erreur")

❌ Ligne de graphique verte vs rouge
✅ Ligne de graphique verte ▲ vs rouge ▼ (couleur + icône de direction)
```

### Borders et séparateurs

**Philosophie : les borders sont de la ponctuation, pas de la structure.**

```
Border subtil     : 1px solid var(--border-subtle)     → 10% opacity
Border default    : 1px solid var(--border-default)     → 25% opacity
Border emphasis   : 1px solid var(--border-emphasis)    → 50% opacity (rare)
```

**Quand utiliser un border :**
- Séparation de colonnes dans un header de table → OUI
- Séparation de rows dans une table → row alternating OU border, PAS les deux
- Contour d'une card → OUI, border subtil
- Séparation de sections dans une page → NON, utilise l'espacement
- Séparation header/content dans un dialog → OUI, border default
- Contour d'un input → OUI, border default, border-accent au focus

**Jamais de box-shadow sauf :**
- Dropdowns et menus (élévation nécessaire pour figure/fond)
- Modals (avec overlay sombre)
- Toasts (doivent se détacher du contenu)

### Micro-interactions et transitions

**Règle : les transitions sont ressenties, jamais vues.**

```
Hover sur un élément      : 150ms ease-out
Ouverture d'un dropdown   : 150ms ease-out
Changement de tab         : 150ms ease-out
Apparition d'un modal     : 200ms ease-out
Apparition d'un toast     : 200ms ease-out, slide-in depuis la droite
Skeleton → contenu        : 200ms ease-out (fade-in)
```

**Interdits :**
- Jamais de `ease-in-out` sur des éléments UI (réservé aux animations longues)
- Jamais de `bounce` ou `spring`
- Jamais de durée > 300ms
- Jamais d'animation sur un élément qui n'est pas interactif

**Hover states :**
```css
/* Table row */
.row:hover { background: var(--bg-surface-hover); }  /* 1 step plus clair */

/* Bouton */
.button:hover { background: var(--accent-hover); }   /* 1 step plus sombre */

/* Card cliquable */
.card:hover { border-color: var(--border-default); }  /* border apparaît */

/* Lien dans une table */
.link:hover { text-decoration: underline; }           /* underline, pas couleur */
```

---

## PARTIE 3 — LAYOUT PAR TYPE DE PAGE

### Dashboard

```
STRUCTURE :
PageHeader (titre + sélecteur de période)
↓ 24px
StatsGrid (4 KPIs en une ligne)
↓ 24px
Grid 2 colonnes (ChartCards)
↓ 24px
Grid 2 colonnes (Table mini + Timeline)
```

**Règles spécifiques :**
- Maximum 4 KPIs en première ligne. 5+ → l'œil ne sait plus où se poser.
  Si tu as 6 KPIs, mets-en 4 principaux en haut et 2 secondaires plus bas.
- Chaque KPI card : la VALEUR est le point focal (24px, semibold).
  Le label est en caption (11px, muted). Le trend est en bas (13px, coloré).
- Les graphiques sont en grid 2 colonnes. Jamais en pleine largeur sauf
  un graphique temporal principal.
- Le bar chart (état actuel) à gauche, le line chart (évolution) à droite.
  Présent → Tendance. L'œil lit de gauche à droite.
- Le mini DataGrid en bas montre MAX 5 lignes + "Voir tout →".
  C'est un aperçu, pas une table complète.
- Pas de légende si les données sont évidentes. Préférer les tooltips
  au hover.

### Page de liste (Resource List)

```
STRUCTURE :
PageHeader (titre + count + actions)
↓ 16px
FilterBar (recherche + filtres)
↓ 0px (collé à la table, même zone logique)
DataGrid
↓ sticky en bas
BulkActionBar (si sélection)
```

**Règles spécifiques :**
- Le count total est affiché dans le titre : "Entreprises (2 847)"
- Les filtres sont AU-DESSUS de la table, jamais à côté (sidebar de filtres)
- La barre de recherche est le premier élément de FilterBar
- Les badges de filtre actif sont visibles + bouton "Reset"
- Le DataGrid a un header sticky au scroll
- La première colonne (identifiant) est cliquable (lien vers le détail)
- La première colonne est en font-medium, les autres en font-normal
- Les colonnes de chiffres sont alignées à droite
- Les colonnes de statut utilisent le format dot + texte
- La colonne d'actions (menu ⋯) est en dernière position, sticky à droite
- La pagination est en bas : "1–25 sur 2 847 | < Page 1/114 >"
- Les filtres et la pagination sont persistés dans l'URL (searchParams)

**Hiérarchie de colonnes :**
```
Colonne 1 (identifiant) : font-medium, text-primary, cliquable     → attire l'œil
Colonnes 2-6 (données)  : font-normal, text-secondary               → information
Colonne 7 (statut)      : dot + text-secondary                      → état rapide
Colonne 8 (actions)     : icône ⋯, text-muted                      → secondaire
```

### Page de détail (Resource Detail)

```
STRUCTURE :
PageHeader (breadcrumb + titre + badge statut + actions)
↓ 24px
Tabs (Résumé | Contacts | Deals | Activités)
↓ 16px
Contenu du tab actif
```

**Règles spécifiques :**
- Le breadcrumb donne le contexte : Dashboard > Entreprises > Acme Corp
- Le titre inclut le badge de statut sur la même ligne
- Les actions (Modifier, Supprimer) sont en haut à droite, toujours
- Les tabs séparent les préoccupations logiques

**Tab Résumé — FieldGrid :**
```
FieldGrid cols={3}
┌─────────────┬─────────────┬─────────────┐
│ Label       │ Label       │ Label       │
│ Valeur      │ Valeur      │ Valeur      │  ← 1 paire = 4px entre label et valeur
├─ 16px ──────┼─────────────┼─────────────┤  ← entre les lignes
│ Label       │ Label       │ Label       │
│ Valeur      │ Valeur      │ Valeur      │
└─────────────┴─────────────┴─────────────┘

Label  : 13px, text-muted, font-normal
Valeur : 14px, text-primary, font-medium
```

- Le FieldGrid utilise 2 colonnes si < 8 champs, 3 colonnes si 8-15 champs
- Les champs longs (adresse, description) prennent toute la largeur (col-span-3)
- Les mini DataGrids dans les tabs (contacts, deals) ont un bouton "+ Ajouter"
  en haut à droite de la section

### Formulaire (Create/Edit)

```
STRUCTURE :
PageHeader (breadcrumb + "Nouveau [ressource]")
↓ 24px
FormSection "Informations" (collapsible, ouvert)
  FieldGrid de FormFields
↓ 24px
FormSection "Détails" (collapsible, ouvert)
  FieldGrid de FormFields
↓ 24px
FormSection "Options" (collapsible, fermé par défaut si secondaire)
↓ sticky en bas
Footer [Annuler] [Sauvegarder]
```

**Règles spécifiques :**
- Le contenu du formulaire dicte le layout :
  ```
  < 6 champs       → 1 colonne
  6-12 champs      → 2 colonnes
  12-20 champs     → 2 colonnes + FormSections collapsibles
  > 20 champs      → MultiStepForm (wizard)
  ```
- Les labels sont AU-DESSUS des inputs, jamais à côté (ça scale mieux)
- Les champs obligatoires ont un * après le label
- Le message d'erreur est en dessous de l'input, en 12px destructive
- Les selects de relation (ex: "Entreprise") sont recherchables
- Les champs conditionnels (ex: "Raison de perte" si deal perdu)
  apparaissent avec une transition subtile (150ms height + opacity)
- Le footer sticky avec les boutons d'action est TOUJOURS visible,
  même si le formulaire est long

### Pipeline Kanban

```
STRUCTURE :
PageHeader (titre + total + toggle vue Kanban|Table + actions)
↓ 16px
FilterBar
↓ 0px
KanbanBoard (scroll horizontal)
  KanbanColumn (scroll vertical chacune)
    KanbanCard
```

**Règles spécifiques :**
- Header de colonne : nom de l'étape + count + total agrégé (€)
- La couleur de l'étape est un accent subtil (border-top de la colonne)
- Les cards sont compactes : titre, entreprise, montant, avatar assigné
- La barre de probabilité en bas de chaque card (height: 2px, % de largeur)
- Le drag & drop a un feedback visuel : card en opacity 0.5 + placeholder
- Le drop crée un optimistic update immédiat

---

## PARTIE 4 — LES COMPOSANTS ET LEURS RÈGLES

### Tables (DataGrid)

```
ALIGNEMENT :
- Texte → à gauche
- Chiffres → à droite
- Dates → à gauche
- Statuts (badges) → à gauche
- Actions (menu) → centrées ou à droite, dernière colonne

LIGNES :
- Horizontal lines uniquement (pas de grille complète)
  SAUF table très dense (type financier) → grille complète acceptable
- Row hover : background 1 step plus clair
- Row sélectionnée : background accent à 5-10% opacity
- Alternating rows : optionnel, seulement si > 15 colonnes

HEADER :
- font-size : 12px (plus petit que le contenu)
- font-weight : 500 (medium, pas bold)
- text-transform : uppercase (optionnel, pour les tables denses)
- couleur : text-muted
- sticky au scroll vertical

CELL CONTENT :
- Texte principal : 13px, text-primary
- Texte secondaire (subtext) : 12px, text-muted, sous le texte principal
  Ex: "Jean Dupont" / "jean@acme.com"
  Combine 2 colonnes en 1, économise de l'espace
- Avatar + nom : avatar 24px + texte, gap 8px
- Badge statut : dot 6px + texte 12px
- Montant : tabular-nums, aligné à droite, font-medium si important
```

### Formulaires

```
CHAMPS :
- Label au-dessus de l'input (jamais à côté)
- Label : 13px, font-medium, text-primary
- Input : 32px height, 13px font-size, padding 8px 12px
- Placeholder : text-muted
- Focus : border-accent, ring 2px accent/20%
- Erreur : border-destructive, message 12px destructive sous l'input
- Description d'aide : 12px, text-muted, sous l'input (avant l'erreur)

LAYOUT :
- Gap entre champs : 16px vertical, 16px horizontal
- Grid de champs : 1, 2 ou 3 colonnes selon le nombre de champs
- Champs longs (textarea, adresse) : pleine largeur

BOUTONS :
- Footer sticky : background blur, border-top, padding 12px 24px
- Bouton principal : à droite ("Sauvegarder")
- Bouton secondaire : à gauche ("Annuler")
- Espacement entre boutons : 8px
```

### Cards KPI (StatsGrid)

```
STRUCTURE D'UNE CARD :
┌──────────────────────┐
│ Label           Icon │   ← Caption (11px, muted), icône 16px muted
│                      │
│ €1.2M               │   ← Display (24px, semibold, primary) — LE POINT FOCAL
│ ▲ 8%   ░░░████      │   ← Trend (13px, success/destructive) + sparkline
└──────────────────────┘

RÈGLES :
- La valeur est 2-3x plus grande que tout le reste de la card
- Le trend ▲/▼ est coloré (vert positif, rouge négatif)
- Le sparkline est subtil (40px height, même couleur que trend)
- L'icône en haut à droite est contextuelle et en text-muted
- Pas plus de 4 cards par ligne
```

### Graphiques (ChartCard)

```
PRINCIPES TUFTE APPLIQUÉS :
- Pas de grille verticale
- Lignes horizontales subtiles (opacity 5-10%) uniquement comme repères
- Pas de légende si < 3 séries (utiliser des labels directs sur les courbes)
- Le titre du graphique est court et descriptif ("CA mensuel"), pas analytique
  ("Évolution du chiffre d'affaires sur les 12 derniers mois")
- Tooltip au hover avec les valeurs exactes
- Couleurs des séries : accent pour la principale, muted pour les secondaires/comparaisons

TYPES DE GRAPHIQUES :
- Comparaison de catégories → Bar chart (horizontal si > 5 catégories)
- Évolution temporelle → Line chart
- Proportions → PAS de pie chart. Utiliser un bar chart horizontal
  (les humains comparent mal les angles, bien les longueurs)
- Funnel → Bar chart horizontal décroissant avec % de conversion
- Distribution → Histogram ou heatmap
```

### Empty States

```
STRUCTURE :
┌──────────────────────────────────┐
│                                  │
│           [Icône 48px]           │
│                                  │
│     "Aucune entreprise"          │   ← 16px, font-medium, text-primary
│  "Créez votre première entrée"   │   ← 13px, text-muted
│                                  │
│        [+ Ajouter]               │   ← Bouton primary
│                                  │
└──────────────────────────────────┘

RÈGLES :
- Deux types : "no data" (jamais eu de données) vs "no results" (filtres trop restrictifs)
- "No data" : icône + titre + description + CTA pour créer
- "No results" : icône différente + "Aucun résultat pour ces filtres" + lien "Réinitialiser"
- Jamais d'espace vide sans explication
- L'icône est en text-muted, jamais en accent
```

---

## PARTIE 5 — ANTI-PATTERNS

### ❌ Le "mur de données"
Tout au même niveau visuel. Pas de hiérarchie, pas de groupes.
→ SOLUTION : grouper par proximité, créer 3 niveaux de contraste.

### ❌ Le "SaaS vide"
90% d'espace blanc, 3 chiffres par page.
→ SOLUTION : densifier. row-height 40px, font-size 13px. Montrer plus.

### ❌ Le "cirque de couleurs"
Chaque élément a une couleur différente "pour distinguer".
→ SOLUTION : max 1 accent + 4 sémantiques. Le reste est neutre.

### ❌ Le "shadow festival"
Box-shadow partout : cards, boutons, inputs, headers.
→ SOLUTION : borders subtils. Shadow uniquement pour l'élévation (dropdowns, modals).

### ❌ Le "border overkill"
Chaque section, chaque groupe, chaque élément a un border.
→ SOLUTION : utiliser l'espacement pour séparer. Borders en dernier recours.

### ❌ Le "action overload"
5 boutons et 3 liens dans chaque row de table.
→ SOLUTION : 1 action primaire visible, le reste dans un menu ⋯ au hover.

### ❌ Le "form-novel"
Tous les champs du formulaire sur une seule page sans structure.
→ SOLUTION : FormSections collapsibles ou MultiStepForm.

### ❌ Le "decoration trap"
Icônes décoratives, illustrations, gradients qui n'informent pas.
→ SOLUTION : chaque élément visuel transmet une info. Sinon, supprime.

### ❌ Le "font soup"
3 polices différentes, 7 tailles de texte, du bold partout.
→ SOLUTION : 1 police (Inter). Max 3 tailles par section. Bold uniquement pour le niveau 1.

### ❌ Le "inconsistency"
Les mêmes éléments ont un aspect différent selon la page.
→ SOLUTION : composants réutilisables. Un Badge est UN composant, pas du CSS ad hoc.

---

## PARTIE 6 — CHECKLIST DE VALIDATION

Avant de livrer une page, vérifie chaque point :

### Espacement
- [ ] Tous les espacements sont des multiples de 4px
- [ ] L'espace entre les groupes > l'espace dans les groupes
- [ ] Les sections sont séparées par 24-32px
- [ ] Les éléments d'un même groupe sont séparés par 8px

### Hiérarchie
- [ ] Maximum 3 niveaux de contraste par section
- [ ] Un seul point focal (bouton primary, chiffre clé) par zone
- [ ] Les labels sont visuellement plus légers que les valeurs

### Typographie
- [ ] Les chiffres utilisent tabular-nums
- [ ] Les montants sont formatés avec séparateur de milliers
- [ ] Les dates sont relatives (< 7j) ou absolues (> 7j)
- [ ] Les valeurs manquantes affichent "—"
- [ ] Le texte tronqué a un tooltip

### Couleurs
- [ ] Chaque couleur transmet une information (pas décoratif)
- [ ] Les statuts utilisent le format dot + texte
- [ ] Pas d'information transmise uniquement par la couleur
- [ ] Maximum 1 couleur d'accent par zone

### Densité
- [ ] Les tables utilisent 13px, row-height 40px
- [ ] Les inputs font 32px de height
- [ ] La page montre suffisamment d'information sans scroller
- [ ] La progressive disclosure est utilisée pour le secondaire

### États
- [ ] Loading = Skeleton qui reproduit la structure
- [ ] Empty = Illustration + message + CTA
- [ ] Error = Message + retry
- [ ] Success = Le contenu normal

### Interactions
- [ ] Toutes les transitions sont 150ms ease-out
- [ ] Les hover states sont subtils (1 step de changement)
- [ ] Les focus rings sont visibles (2px solid accent)
- [ ] Les actions destructives ont un ConfirmDialog

### Alignement
- [ ] Les colonnes de texte sont alignées à gauche
- [ ] Les colonnes de chiffres sont alignées à droite
- [ ] Les éléments d'une même grille sont alignés sur les mêmes axes
- [ ] Le contenu de la page est centré avec un max-width

---

## Sources

Ce design skill est basé sur :
- **Edward Tufte** — The Visual Display of Quantitative Information (1983) : data-ink ratio, chartjunk, small multiples
- **Gestalt Psychology** (Wertheimer, Koffka, Kohler, 1920s) : proximité, similarité, enclosure, continuité, figure/fond, point focal
- **Nielsen Norman Group** — Visual hierarchy, F-pattern, spacing principles
- **Paul Wallas** — Designing for Data Density (enterprise-specific spacing and density)
- **Pencil & Paper** — Data Table Design UX Patterns, Dashboard Design Patterns
- **Salesforce Lightning Design System** — Enterprise component density and consistency
- **Microsoft Fluent 2** — Visual hierarchy et réduction de la fatigue cognitive
- **Linear, Vercel, Airtable** — Références visuelles pour la densité maîtrisée
