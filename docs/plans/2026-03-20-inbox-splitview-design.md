# Inbox + SplitView Integration — Design

## Context

L'Inbox a son propre layout master-detail (InboxSidebar + InboxDetail) en parallèle du SplitView.
On supprime les wrappers layout de l'Inbox pour que le consumer compose avec SplitView directement.
Le handle SplitView redevient visible avec un grip central.

## Decisions

### SplitView — handle visible avec grip

- Barre `w-1` (4px) avec `bg-transparent` par défaut
- Grip central : `h-8 w-0.5 rounded-full bg-border`
- Au hover : `bg-surface-3` sur la barre
- Au drag : `bg-surface-3` sur la barre
- Sert de séparation visuelle — pas besoin de `border-r` supplémentaire

### Inbox — suppression des wrappers layout

**Supprimés :**
- `Inbox` (wrapper div + withProGuard)
- `InboxSidebar` (remplacé par SplitView.Master)
- `InboxDetail` (remplacé par SplitView.Detail)
- Types associés : `InboxProps`, `InboxSidebarProps`, `InboxDetailProps`

**Conservés :**
- `InboxHeader`, `InboxPanel`, `InboxList`, `InboxItem`
- `InboxDetailEmpty`, `InboxDetailCard`
- `filterInboxItems`
- Tous les types de données (InboxNotification, InboxFilters, etc.)

### apps/ops — migration

```tsx
<SplitView defaultRatio={0.35}>
  <SplitView.Master>
    <InboxHeader ... />
    <InboxPanel>
      <InboxList>...</InboxList>
    </InboxPanel>
  </SplitView.Master>
  <SplitView.Detail>
    {selected ? <NotificationDetail /> : <InboxDetailEmpty />}
  </SplitView.Detail>
</SplitView>
```

## Hors scope

- Pas de modification des sous-composants Inbox
- Pas de nouvelle fonctionnalité SplitView
