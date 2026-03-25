# Pattern : Resource Detail

> Page de détail d'une ressource avec sections, actions, historique.
> Exemples : fiche client, détail d'intervention, dossier, commande.

## Structure

```
Page
  top                        — Breadcrumb (lien retour vers la liste)
  header                     — PageHeader (titre dynamique, afterTitle badge, actions)
  nav (optionnel)            — NavTabs si sous-routes (général, historique, documents)
  children
    └─ PageWrapper size="lg"
         └─ Main + Sidebar layout
              Main:
                PageSection "Informations"   → FieldGrid en lecture
                PageSection "Coordonnées"    → FieldGrid en lecture
                PageSection "Notes"          → Texte libre
              Sidebar:
                Card client / statut / metadata
```

## Fichiers à créer

```
app/(dashboard)/[resources]/[id]/
  page.tsx                     ← Server Component
  _components/
    general-tab.tsx            ← Onglet informations
    history-tab.tsx            ← Onglet historique
    documents-tab.tsx          ← Onglet documents (si applicable)
    status-actions.tsx         ← Actions de transition de statut
```

## Code complet

### Page (`app/(dashboard)/clients/[id]/page.tsx`)

```tsx
import { notFound } from "next/navigation"
import { Edit, Trash } from "lucide-react"
import { Page, PageWrapper, PageSection } from "@blazz/pro/components/blocks/page"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@blazz/ui/components/ui/breadcrumb"
import { Button } from "@blazz/ui/components/ui/button"
import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"
import { getClient } from "@/lib/actions/clients"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClient(id)

  if (!client) notFound()

  return (
    <Page
      top={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{client.firstName} {client.lastName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={
        <PageHeader
          title={`${client.firstName} ${client.lastName}`}
          afterTitle={<Badge variant="success" fill="subtle">{client.status}</Badge>}
          actions={
            <>
              <Button variant="outline" size="sm">
                <Edit className="size-3.5" data-icon="inline-start" />
                Modifier
              </Button>
              <Button variant="destructive" size="sm">
                <Trash className="size-3.5" data-icon="inline-start" />
                Supprimer
              </Button>
            </>
          }
        />
      }
      nav={
        <NavTabs
          basePath={`/clients/${id}`}
          tabs={[
            { label: "Informations", href: "" },
            { label: "Historique", href: "/history" },
            { label: "Documents", href: "/documents" },
          ]}
        />
      }
    >
      <PageWrapper size="lg">
        <GeneralTab client={client} />
      </PageWrapper>
    </Page>
  )
}
```

### Onglet Général (`_components/general-tab.tsx`)

```tsx
import { PageSection } from "@blazz/pro/components/blocks/page"
import { DetailPanel } from "@blazz/pro/components/blocks/detail-panel"
import { FieldGrid, Field } from "@blazz/ui/components/patterns/field-grid"
import { Badge } from "@blazz/ui/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { type Client } from "@/lib/schemas/client"

export function GeneralTab({ client }: { client: Client }) {
  return (
    <div className="space-y-8">
      <PageSection title="Informations générales">
        <FieldGrid columns={3}>
          <Field label="Nom" value={client.lastName} />
          <Field label="Prénom" value={client.firstName} />
          <Field label="Statut" value={<Badge>{client.status}</Badge>} />
          <Field label="Email" value={client.email} />
          <Field label="Entreprise" value={client.company ?? "—"} />
          <Field label="Téléphone" value={client.phone ?? "—"} />
        </FieldGrid>
      </PageSection>

      <PageSection title="Adresse">
        <FieldGrid columns={2}>
          <Field label="Adresse" value={client.address ?? "—"} span={2} />
          <Field label="Code postal" value={client.zipCode ?? "—"} />
          <Field label="Ville" value={client.city ?? "—"} />
        </FieldGrid>
      </PageSection>

      <PageSection title="Métadonnées">
        <FieldGrid columns={3}>
          <Field label="Créé le" value={formatDate(client.createdAt)} />
          <Field label="Modifié le" value={formatDate(client.updatedAt)} />
          <Field label="Créé par" value={client.createdBy ?? "Système"} />
        </FieldGrid>
      </PageSection>
    </div>
  )
}
```

### Onglet Historique (`_components/history-tab.tsx`)

```tsx
import { ActivityTimeline } from "@blazz/pro/components/blocks/activity-timeline"
import { Empty } from "@blazz/ui/components/ui/empty"
import { type HistoryEvent } from "@/lib/schemas/client"

export function HistoryTab({ events }: { events: HistoryEvent[] }) {
  if (events.length === 0) {
    return (
      <Empty
        title="Aucun historique"
        description="Les modifications apportées à ce client apparaîtront ici."
      />
    )
  }

  return <ActivityTimeline events={events} />
}
```

## Checklist avant de livrer

- [ ] `notFound()` si la ressource n'existe pas
- [ ] Page.top avec Breadcrumb et lien retour vers la liste
- [ ] PageHeader avec afterTitle (badge statut) et actions (Modifier, Supprimer)
- [ ] NavTabs si plus de 2 sections de contenu
- [ ] PageWrapper pour centrer le contenu
- [ ] PageSection pour grouper les champs par thème
- [ ] FieldGrid pour les champs en lecture (pas un formulaire)
- [ ] Valeurs manquantes affichées comme "—" (jamais vide)
- [ ] Historique / audit log avec empty state
- [ ] Métadonnées (créé le, modifié le, par qui)
