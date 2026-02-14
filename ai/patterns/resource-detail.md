# Pattern : Resource Detail

> Page de détail d'une ressource avec sections, actions, historique.
> Exemples : fiche client, détail d'intervention, dossier, commande.

## Structure

```
PageHeader              — titre dynamique, breadcrumbs, actions (Modifier, Supprimer)
StatusFlow (optionnel)  — workflow de statuts si la ressource a un cycle de vie
Tabs                    — onglets si beaucoup d'informations
  └─ Tab "Général"
       DetailPanel
         └─ Section "Informations"    → FieldGrid en lecture
         └─ Section "Coordonnées"     → FieldGrid en lecture
         └─ Section "Notes"           → Texte libre
  └─ Tab "Historique"
       ActivityTimeline              → Audit log / événements
  └─ Tab "Documents" (optionnel)
       DataGrid (mini)               → Liste de fichiers associés
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
import { Edit, Trash, Download } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { Tabs } from "@/components/ui/tabs"
import { StatusFlow } from "@/components/blocks/status-flow"
import { getClient, getClientHistory } from "@/lib/actions/clients"
import { GeneralTab } from "./_components/general-tab"
import { HistoryTab } from "./_components/history-tab"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClient(id)

  if (!client) notFound()

  const history = await getClientHistory(id)

  return (
    <>
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Clients", href: "/clients" },
          { label: `${client.firstName} ${client.lastName}` },
        ]}
        actions={[
          { label: "Modifier", href: `/clients/${id}/edit`, icon: Edit },
          {
            label: "Supprimer",
            onClick: () => deleteClient(id),
            icon: Trash,
            variant: "destructive",
            confirm: {
              title: "Supprimer ce client ?",
              description: `Le client ${client.firstName} ${client.lastName} sera supprimé définitivement.`,
            },
          },
        ]}
      />

      {/* StatusFlow si la ressource a un cycle de vie */}
      <StatusFlow
        currentStatus={client.status}
        statuses={clientStatuses}
        transitions={clientTransitions}
        onTransition={async (from, to) => {
          "use server"
          await updateClientStatus(id, to)
        }}
      />

      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Trigger value="general">Informations</Tabs.Trigger>
          <Tabs.Trigger value="history">
            Historique ({history.length})
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="general">
          <GeneralTab client={client} />
        </Tabs.Content>

        <Tabs.Content value="history">
          <HistoryTab events={history} />
        </Tabs.Content>
      </Tabs>
    </>
  )
}
```

### Onglet Général (`_components/general-tab.tsx`)

```tsx
import { DetailPanel } from "@/components/blocks/detail-panel"
import { FieldGrid, Field } from "@/components/blocks/field-grid"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { type Client } from "@/lib/schemas/client"

export function GeneralTab({ client }: { client: Client }) {
  return (
    <DetailPanel>
      <DetailPanel.Section title="Informations générales">
        <FieldGrid columns={3}>
          <Field label="Nom" value={client.lastName} />
          <Field label="Prénom" value={client.firstName} />
          <Field label="Statut" value={<Badge>{client.status}</Badge>} />
          <Field label="Email" value={client.email} />
          <Field label="Entreprise" value={client.company ?? "—"} />
          <Field label="Téléphone" value={client.phone ?? "—"} />
        </FieldGrid>
      </DetailPanel.Section>

      <DetailPanel.Section title="Adresse">
        <FieldGrid columns={2}>
          <Field label="Adresse" value={client.address ?? "—"} span={2} />
          <Field label="Code postal" value={client.zipCode ?? "—"} />
          <Field label="Ville" value={client.city ?? "—"} />
        </FieldGrid>
      </DetailPanel.Section>

      <DetailPanel.Section title="Métadonnées">
        <FieldGrid columns={3}>
          <Field label="Créé le" value={formatDate(client.createdAt)} />
          <Field label="Modifié le" value={formatDate(client.updatedAt)} />
          <Field label="Créé par" value={client.createdBy ?? "Système"} />
        </FieldGrid>
      </DetailPanel.Section>
    </DetailPanel>
  )
}
```

### Onglet Historique (`_components/history-tab.tsx`)

```tsx
import { ActivityTimeline } from "@/components/blocks/activity-timeline"
import { EmptyState } from "@/components/ui/empty-state"
import { type HistoryEvent } from "@/lib/schemas/client"

export function HistoryTab({ events }: { events: HistoryEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="Aucun historique"
        description="Les modifications apportées à ce client apparaîtront ici."
      />
    )
  }

  return <ActivityTimeline events={events} />
}
```

## Checklist avant de livrer

- [ ] `notFound()` si la ressource n'existe pas ✓
- [ ] Breadcrumbs avec lien retour vers la liste ✓
- [ ] Actions Modifier / Supprimer (avec confirmation) ✓
- [ ] StatusFlow si workflow applicable ✓
- [ ] Tabs si plus de 2 sections de contenu ✓
- [ ] FieldGrid pour les champs en lecture (pas un formulaire) ✓
- [ ] Valeurs manquantes affichées comme "—" (jamais vide) ✓
- [ ] Historique / audit log ✓
- [ ] Empty state sur l'historique ✓
- [ ] Métadonnées (créé le, modifié le, par qui) ✓
