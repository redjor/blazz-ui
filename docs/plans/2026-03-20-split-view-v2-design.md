# SplitView v2 — Design

## Context

Le SplitView actuel est un composant basique avec des props `master`/`detail`.
Il utilise des mouse events (pas de touch), un handle visible en permanence,
et pas de responsive. L'API ne suit pas le pattern compound components
standard de shadcn.

## Decision

Refonte en compound components (`SplitView`, `SplitView.Master`, `SplitView.Detail`)
avec handle invisible, pointer events, et stack vertical sur mobile.
Clean break — pas de rétro-compatibilité.

## API

```tsx
<SplitView defaultRatio={0.35} minRatio={0.2} maxRatio={0.5}>
  <SplitView.Master>
    <ContactList />
  </SplitView.Master>
  <SplitView.Detail>
    {selected ? <ContactDetail /> : <EmptyState />}
  </SplitView.Detail>
</SplitView>
```

## Composants

| Composant | Rôle |
|---|---|
| `SplitView` | Container flex, state ratio, resize logic, breakpoint responsive |
| `SplitView.Master` | Panel gauche, `width: ratio * 100%` desktop, full-width mobile |
| `SplitView.Detail` | Panel droit, `flex-1` desktop, full-width mobile |

Le handle est rendu internement par `SplitView` entre Master et Detail.

## Comportement resize

- Pointer events (`pointermove`/`pointerup`) — touch support gratuit
- Handle invisible : zone de hit 8px transparente, curseur `col-resize` au hover
- Au hover : ligne 1px `bg-border` au centre (150ms ease-out)
- Pendant le drag : ligne passe en `bg-fg-muted`

## Responsive

- Desktop (>=768px) : layout horizontal, handle actif
- Mobile (<768px) : `flex-col`, handle masqué, panels stackent full-width
- Le consumer prévoit le contenu mobile-ready pour les deux panels

## Props

```ts
interface SplitViewProps {
  defaultRatio?: number    // 0.4
  minRatio?: number        // 0.25
  maxRatio?: number        // 0.6
  className?: string
  children: React.ReactNode
}

interface SplitViewPanelProps {
  className?: string
  children: React.ReactNode
}
```

## Hors scope

- Pas de collapse toggle
- Pas de keyboard resize
- Pas d'orientation verticale
- Pas de persist du ratio
- Pas de snap points
