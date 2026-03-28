# Composants disponibles

## Primitives (`@/components/ui/`)

Basées sur shadcn/ui, étendues pour le contexte pro.

- **Button** — Variants: primary, secondary, ghost, destructive, outline. Props: size, loading, icon, disabled.
- **Input** — Text input avec label, error, helper text intégrés.
- **Select** — Select natif ou combobox searchable. Props: options[], searchable, multi.
- **Checkbox** / **Radio** / **Switch** — Form controls standards.
- **Badge** — Status indicator. Variants: default, success, warning, error, info.
- **Avatar** — User avatar avec fallback initiales.
- **Tooltip** — Info au hover.
- **Dialog** — Modal. Sizes: sm (default), md, lg, xl, full. `DialogHeader` a `separator` (default true) pour border-bottom. Utiliser `ConfirmDialog` pour les actions destructives.
- **ConfirmDialog** — Modal de confirmation avec message + actions confirm/cancel.
- **Sheet** — Side panel coulissant (détail rapide, filtres avancés).
- **Popover** — Contenu flottant ancré à un élément.
- **Tabs** — Navigation par onglets dans une page.
- **Skeleton** — Placeholder loading. Toujours matcher la forme du contenu réel.
- **Toast** — Notification temporaire. Via `useToast()`. Variants: success, error, info.
- **EmptyState** — État vide. Props: icon, title, description, action (CTA).
- **ErrorState** — État erreur. Props: title, description, onRetry.

### Layout Primitives

OBLIGATOIRES pour tout layout. Jamais de `<div>` nu avec des classes flex/grid Tailwind.

- **BlockStack** — Empilement vertical (flex-col + gap). Props: gap (SpaceScale), align, inlineAlign, as, reverseOrder. Import: `@blazz/ui/components/ui/block-stack`
- **InlineStack** — Alignement horizontal (flex-row + gap). Props: gap, align, blockAlign, direction, wrap. Import: `@blazz/ui/components/ui/inline-stack`
- **Grid** — Grille responsive 12 colonnes. Sous-composant `Grid.Cell` avec `columnSpan` par breakpoint (xs/sm/md/lg/xl). Import: `@blazz/ui/components/ui/grid`
- **InlineGrid** — Grille simple à colonnes égales (CSS grid). Props: columns (number | "oneThird" | "oneHalf" | "twoThirds"), gap, alignItems. Import: `@blazz/ui/components/ui/inline-grid`
- **Box** — Conteneur visuel polymorphe (background, border, padding, shadow, borderRadius). Props: as (ElementType, default "div"), padding ("0" | "2" | "4" | "inset" | "6" | "8", default "inset"), background ("transparent" | "app" | "surface" | "raised" | "overlay" | "accent"), border ("none" | "default"), borderRadius ("none" | "sm" | "md" | "lg" | "xl"), shadow ("none" | "sm" | "md" | "lg" | "card" | "card-elevated"). Import: `@blazz/ui/components/ui/box`
- **Bleed** — Marge négative contrôlée pour déborder du padding parent. Props: marginInline, marginBlock, marginBlockStart/End, marginInlineStart/End (SpaceScale). Import: `@blazz/ui/components/ui/bleed`
- **Divider** — Séparateur horizontal (`<hr>`). Props: borderColor (default | secondary | inverse | transparent), borderWidth (025 | 050 | 100). Import: `@blazz/ui/components/ui/divider`

**SpaceScale** : "0" | "050" | "100" | "150" | "200" | "300" | "400" | "500" | "600" | "800" | "1000" | "1200" | "1600"

## Blocks Data (`@/components/blocks/`)

### DataGrid
Le composant central du kit. Table avancée pour données paginées.
```tsx
<DataGrid
  columns={columns}           // ColumnDef[] — définition des colonnes
  data={data}                 // T[] — données de la page courante
  totalCount={totalCount}     // number — total pour pagination
  pageSize={pageSize}         // number — taille de page (défaut: 25)
  currentPage={currentPage}   // number
  onPageChange={fn}           // (page: number) => void
  onSort={fn}                 // (field: string, direction: 'asc' | 'desc') => void
  sortField={sortField}       // string | undefined
  sortDirection={sortDir}     // 'asc' | 'desc' | undefined
  selectable                  // boolean — active la sélection multiple
  onSelectionChange={fn}      // (ids: string[]) => void
  actions={rowActions}        // RowAction[] — actions par ligne (edit, delete, etc.)
  bulkActions={bulkActions}   // BulkAction[] — actions sur sélection multiple
  loading                     // boolean
  emptyState={<EmptyState />} // ReactNode
/>
```

### FilterBar
Barre de filtres combinés, persistés dans l'URL.
```tsx
<FilterBar
  filters={filterConfig}      // FilterConfig[] — définition des filtres
  values={currentFilters}     // Record<string, any> — valeurs actives
  onChange={fn}                // (filters: Record<string, any>) => void
  onReset={fn}                // () => void — reset tous les filtres
  savedViews={views}          // SavedView[] — vues sauvegardées (optionnel)
/>
```

### StatsGrid
Grille de KPI cards pour dashboards.
```tsx
<StatsGrid
  stats={[
    { label: "Total clients", value: 1234, trend: +5.2, icon: Users },
    { label: "CA mensuel", value: "€45.2K", trend: +12.1, icon: TrendingUp },
    // ...
  ]}
  columns={4}                 // 2 | 3 | 4 — nombre de colonnes
  loading                     // boolean — affiche skeletons
/>
```

### DetailPanel
Vue détail d'une ressource avec sections.
```tsx
<DetailPanel>
  <DetailPanel.Header
    title={resource.name}
    subtitle={resource.reference}
    status={<Badge variant={statusVariant}>{resource.status}</Badge>}
    actions={[
      { label: "Modifier", onClick: fn, icon: Edit },
      { label: "Supprimer", onClick: fn, icon: Trash, variant: "destructive" },
    ]}
  />
  <DetailPanel.Section title="Informations générales">
    <FieldGrid>
      <Field label="Nom" value={resource.name} />
      <Field label="Email" value={resource.email} />
      {/* ... */}
    </FieldGrid>
  </DetailPanel.Section>
  <DetailPanel.Section title="Historique">
    <ActivityTimeline events={resource.history} />
  </DetailPanel.Section>
</DetailPanel>
```

### FormSection
Section de formulaire collapsible avec validation.
```tsx
<FormSection title="Coordonnées" description="Informations de contact" defaultOpen>
  <FieldGrid columns={2}>
    <FormField name="firstName" label="Prénom" control={form.control} />
    <FormField name="lastName" label="Nom" control={form.control} />
    <FormField name="email" label="Email" control={form.control} span={2} />
  </FieldGrid>
</FormSection>
```

### MultiStepForm
Formulaire multi-étapes avec navigation et sauvegarde intermédiaire.
```tsx
<MultiStepForm
  steps={[
    { id: "info", title: "Informations", schema: infoSchema, component: InfoStep },
    { id: "address", title: "Adresse", schema: addressSchema, component: AddressStep },
    { id: "review", title: "Récapitulatif", component: ReviewStep },
  ]}
  onSubmit={handleSubmit}
  onSaveDraft={handleDraft}   // Optionnel — sauvegarde brouillon
/>
```

### ActivityTimeline
Timeline d'événements / audit log.
```tsx
<ActivityTimeline
  events={[
    { date: "2025-01-15", user: "Jean D.", action: "Statut modifié", detail: "En cours → Validé" },
    { date: "2025-01-14", user: "Marie L.", action: "Commentaire ajouté", detail: "RAS" },
  ]}
  loading                     // boolean
/>
```

### StatusFlow
Visualisation d'un workflow de statuts avec transitions.
```tsx
<StatusFlow
  currentStatus="review"
  statuses={[
    { id: "draft", label: "Brouillon", color: "gray" },
    { id: "review", label: "En revue", color: "blue" },
    { id: "approved", label: "Validé", color: "green" },
    { id: "rejected", label: "Rejeté", color: "red" },
  ]}
  transitions={[
    { from: "draft", to: "review", action: "Soumettre", role: "author" },
    { from: "review", to: "approved", action: "Valider", role: "manager" },
    { from: "review", to: "rejected", action: "Rejeter", role: "manager" },
  ]}
  onTransition={fn}           // (from, to) => Promise<void>
/>
```

### CommandPalette
Cmd+K search globale.
```tsx
<CommandPalette
  groups={[
    { label: "Navigation", items: navigationItems },
    { label: "Actions", items: actionItems },
    { label: "Recherche", items: searchResults, loading: isSearching },
  ]}
  onSelect={fn}
  placeholder="Rechercher..."
/>
```

### Page (pro)
Layout full-width avec 4 zones : top, header, nav, content.
```tsx
import { Page, PageWrapper, PageSection } from "@blazz/pro/components/blocks/page"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"

<Page
  top={<Breadcrumb>...</Breadcrumb>}
  header={
    <PageHeader
      title="INV0012"
      afterTitle={<Badge variant="critical">Impayée</Badge>}
      actions={<Button>Envoyer</Button>}
    />
  }
  nav={<NavTabs basePath="/invoices" tabs={[...]} />}
>
  <PageWrapper size="sm" card>
    <PageSection title="Détails">
      {/* contenu */}
    </PageSection>
  </PageWrapper>
</Page>
```

**Zones :**
- `top` — breadcrumbs, back link (px-4 py-2, border-b)
- `header` — PageHeader (px-4 py-3, border-b si separator=true)
- `nav` — NavTabs full-width (border-b)
- `children` — contenu (p-4), utiliser PageWrapper pour centrer/constraindre

**PageWrapper** — centré (mx-auto), size: sm|md|lg|full, card: boolean
**PageSection** — sous-section titrée (h2 + description)

### PageHeader (pro)
Header composable avec 4 slots. Se pose dans le slot `header` de Page.
```tsx
import { PageHeader } from "@blazz/pro/components/blocks/page-header"

<PageHeader
  title="Clients"
  top={<Breadcrumb>...</Breadcrumb>}       // au-dessus du titre (si pas de Page.top)
  afterTitle={<Badge>42</Badge>}            // inline après le titre
  actions={<><Button variant="outline">Export</Button><Button>Nouveau</Button></>}
  bottom={<p className="text-sm text-fg-muted">Description</p>}
/>
```

### BulkActionBar
Barre d'actions flottante qui apparaît quand des lignes sont sélectionnées.
```tsx
<BulkActionBar
  selectedCount={selectedIds.length}
  actions={[
    { label: "Exporter", onClick: () => exportSelected(selectedIds), icon: Download },
    { label: "Changer statut", onClick: () => openStatusDialog(selectedIds), icon: RefreshCw },
    { label: "Supprimer", onClick: () => confirmDelete(selectedIds), icon: Trash, variant: "destructive" },
  ]}
  onClearSelection={fn}
/>
```

### SplitView
Layout master/detail avec panneau redimensionnable.
```tsx
<SplitView
  defaultRatio={0.4}          // 40% liste, 60% détail
  minRatio={0.25}
  maxRatio={0.6}
  master={<ResourceList />}
  detail={<ResourceDetail />}
  emptyDetail={<EmptyState title="Sélectionnez un élément" />}
/>
```

### FieldGrid
Grille responsive pour afficher des champs en lecture ou en formulaire.
```tsx
<FieldGrid columns={3}>
  <Field label="Nom" value="Dupont" />
  <Field label="Prénom" value="Jean" />
  <Field label="Email" value="jean@example.com" span={2} />
  <Field label="Adresse" value="12 rue de la Paix, Paris" span={3} />
</FieldGrid>
```

## Layouts (`@/components/layouts/`)

### DashboardLayout
Layout principal pour les pages authentifiées.
- Sidebar collapsible avec navigation arborescente
- Header avec user menu, notifications, command palette trigger
- Breadcrumb automatique
- Zone de contenu avec max-width et padding standardisés

### AuthLayout
Layout pour login, register, forgot password.
- Centré, minimaliste, branding.

### PrintLayout
Layout pour les pages imprimables (rapports, exports PDF).
- Pas de sidebar, pas de navigation.
- Styles d'impression optimisés.
