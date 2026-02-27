# Règles du kit

Ces règles sont obligatoires. Pas de dérogation sauf demande explicite de l'utilisateur.

## 1. Architecture

- **Server Components par défaut.** Client Components uniquement pour : formulaires, interactions (click, hover, drag), état local (tabs, modals, toggles), données temps réel.
- **Un fichier = une responsabilité.** Pas de page de 500 lignes. Extraire les sections en composants.
- **Pas de logique métier dans les composants UI.** La logique va dans des hooks, server actions, ou lib/.

## 2. Routing & Layouts

| Route pattern | Layout |
|---|---|
| `/(dashboard)/**` | `DashboardLayout` |
| `/(auth)/**` | `AuthLayout` |
| `/print/**` | `PrintLayout` |

## 3. Data Fetching

- **Listes paginées** : fetch serveur avec `searchParams`. Jamais de `useEffect` + `fetch` pour les données initiales.
- **Filtres et tri** : toujours dans l'URL via searchParams. Ça permet le partage de lien et le back/forward.
- **Mutations** : Server Actions (preferred) ou API routes. Toast de feedback après chaque mutation.
- **Optimistic updates** : uniquement pour les actions triviales (toggle, like). Pas pour les formulaires complexes.

## 4. Formulaires

- **Toujours** : `react-hook-form` + `zod`
- **Schema partagé** : le même schema zod est utilisé côté client et serveur
- **Structure** :
  ```tsx
  const schema = z.object({ ... })
  type FormValues = z.infer<typeof schema>
  
  function MyForm({ defaultValues }: { defaultValues?: FormValues }) {
    const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues,
    })
    // ...
  }
  ```
- **Submit** : bouton disabled pendant la soumission, texte change en "Enregistrement..."
- **Erreurs serveur** : affichées dans le formulaire via `form.setError("root", { message })`

## 5. Tables & Listes

- **Pagination serveur** : obligatoire. Taille de page par défaut : 25.
- **Tri serveur** : obligatoire sur les colonnes pertinentes.
- **Filtres** : `FilterBar` au-dessus du `DataGrid`. Valeurs dans l'URL.
- **Sélection multiple** : si des actions batch existent, activer `selectable` + `BulkActionBar`.
- **Export** : au minimum CSV. Excel si le client le demande.
- **Empty state** : toujours un `EmptyState` avec une action ("Créer le premier...", "Modifier les filtres").

## 6. États obligatoires

Tout composant qui dépend de données DOIT implémenter :

| État | Implémentation |
|---|---|
| Loading | `<Skeleton />` qui matche la forme du contenu |
| Empty | `<EmptyState />` avec message et action |
| Error | `<ErrorState />` avec message et bouton retry |
| Success | Le contenu normal |

## 7. Actions destructives

- **Toujours** une `ConfirmDialog` avant suppression
- Le message de confirmation doit être explicite : "Supprimer le client Jean Dupont ? Cette action est irréversible."
- Le bouton de confirmation est `variant="destructive"` et répète l'action : "Supprimer"

## 8. Permissions

- Vérifier les permissions CÔTÉ SERVEUR avant toute mutation
- Côté client : masquer les actions non autorisées (pas les désactiver)
- Pattern :
  ```tsx
  {can("clients.edit") && (
    <Button onClick={handleEdit}>Modifier</Button>
  )}
  ```

## 9. Responsive

- Les apps pro sont desktop-first. Le responsive est secondaire.
- **DataGrid** : scroll horizontal sur mobile, pas de layout alternatif
- **Formulaires** : 2-3 colonnes desktop → 1 colonne mobile via `FieldGrid`
- **Sidebar** : collapsible en overlay sur mobile

## 10. Imports & structure

```tsx
// Ordre des imports — toujours respecter
import { ... } from "react"                       // 1. React
import { ... } from "next/..."                     // 2. Next.js
import { ... } from "@/components/ui/..."           // 3. UI primitives
import { ... } from "@/components/blocks/..."       // 4. Blocks
import { ... } from "@/hooks/..."                   // 5. Hooks
import { ... } from "@/lib/..."                     // 6. Lib
import { type ... } from "@/types/..."              // 7. Types
```

## 11. Nommage

- **Fichiers composants** : kebab-case (`data-grid.tsx`, `filter-bar.tsx`)
- **Composants** : PascalCase (`DataGrid`, `FilterBar`)
- **Hooks** : camelCase préfixé `use` (`useClients`, `usePermissions`)
- **Server Actions** : camelCase préfixé par le verbe (`createClient`, `updateClient`, `deleteClient`)
- **Schemas zod** : camelCase suffixé `Schema` (`clientSchema`, `createClientSchema`)

## 12. Radius concentrique

Quand un parent arrondi contient un enfant arrondi avec un gap (padding) entre les deux : `inner_radius = outer_radius - gap`. Si le gap est 0, les radius sont identiques. Toujours définir une CSS variable `--inner-radius` calculée sur le parent pour que les enfants la référencent.

## 13. Spacing dans les composants composés

Les composants composés (Card, Frame, Dialog...) ont des sous-composants imbriqués (Header, Content, Footer). Le padding doit suivre ces règles :

### Source unique de padding

Un seul niveau contrôle le padding horizontal à un instant donné. Si le parent a `p-4`, un enfant à l'intérieur ne doit **pas** recevoir `px-4` en plus — sinon le contenu est doublement indenté.

### Pattern Footer "bleed"

Quand un Footer (ou Header) est **à l'intérieur** d'un conteneur paddé, il doit utiliser des marges négatives pour annuler le padding parent et réappliquer son propre padding :

```css
/* Le conteneur a p-4 */
.footer {
  -mx-4 -mb-4    /* annule le padding parent */
  mt-4            /* espace au-dessus */
  px-4 py-3       /* propre padding → contenu aligné avec le reste */
  border-t        /* séparation visuelle */
}
```

Résultat : le contenu du footer est à 16px du bord (= aligné avec le contenu au-dessus), pas 32px.

### Sélecteurs descendants et profondeur

Les sélecteurs `[&_[data-slot=...]]` matchent à **n'importe quel niveau de profondeur**. Quand un slot est imbriqué dans un autre slot qui reçoit déjà du padding, il faut compenser avec des marges négatives. Toujours vérifier la chaîne de padding complète : parent padding + enfant padding ≠ double padding.

## 14. Pages — Structure standard

```tsx
// app/(dashboard)/clients/page.tsx — PAGE LISTE
import { PageHeader } from "@/components/blocks/page-header"
import { FilterBar } from "@/components/blocks/filter-bar"
import { DataGrid } from "@/components/blocks/data-grid"
import { getClients } from "@/lib/actions/clients"

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const { data, totalCount } = await getClients(params)

  return (
    <>
      <PageHeader
        title="Clients"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Clients" }]}
        actions={[{ label: "Nouveau client", href: "/clients/new", icon: Plus }]}
      />
      <FilterBar filters={clientFilters} values={params} />
      <DataGrid columns={clientColumns} data={data} totalCount={totalCount} /* ... */ />
    </>
  )
}
```
