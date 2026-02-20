# Notification Center Block — Design

## Context

Existing `components/layout/notification-sheet.tsx` is a hardcoded CRM notification panel with mock data and non-token colors. We need a reusable, generic block in `components/blocks/` with full documentation.

## Approach: Compound Components

4 composable sub-components that the consumer assembles freely.

## Data Model

```ts
interface NotificationAction {
  label: string
  onClick: () => void
  variant?: "default" | "primary" // primary = always visible, default = in "…" menu
}

interface Notification {
  id: string
  icon: LucideIcon
  iconVariant?: "info" | "success" | "warning" | "critical"
  title: string
  description?: string
  time: string | Date
  read?: boolean
  actions?: NotificationAction[]
}
```

`iconVariant` maps to design tokens. No hardcoded colors.

## Components

| Component | Role |
|---|---|
| `NotificationCenter` | Container. Handles 4 states (loading/empty/error/success). Props: `loading`, `error`, `onRetry`, `onMarkAllRead`, `unreadCount`, `className` |
| `NotificationList` | Scrollable wrapper (`flex-1 overflow-y-auto`). Consumer structures content freely |
| `NotificationGroup` | Optional group header with label ("Today", "This week"). Separator line with text |
| `NotificationItem` | Individual item. Receives `notification: Notification`. Displays colored icon badge, title, description, time, unread dot, actions |

## Usage

### With groups
```tsx
<NotificationCenter onMarkAllRead={markAllRead} unreadCount={3}>
  <NotificationList>
    <NotificationGroup label="Today">
      <NotificationItem notification={notif1} />
      <NotificationItem notification={notif2} />
    </NotificationGroup>
    <NotificationGroup label="Yesterday">
      <NotificationItem notification={notif3} />
    </NotificationGroup>
  </NotificationList>
</NotificationCenter>
```

### Simple flat list
```tsx
<NotificationCenter onMarkAllRead={markAllRead} unreadCount={unread}>
  <NotificationList>
    {notifications.map(n => (
      <NotificationItem key={n.id} notification={n} />
    ))}
  </NotificationList>
</NotificationCenter>
```

### Loading state
```tsx
<NotificationCenter loading>
  {/* Children ignored, skeleton displayed */}
</NotificationCenter>
```

## Visual Design

### NotificationCenter
- `flex flex-col h-full`
- Header: title "Notifications" + Badge unread count + "Mark all read" button
- Children zone below

### NotificationItem
```
┌─────────────────────────────────────────┐
│ [icon]  Title              · 2 min  […] │
│         Description text                 │
│         [View deal]                      │
└─────────────────────────────────────────┘
```
- Icon in colored badge `size-8 rounded-lg`
- Blue unread dot next to title
- Primary actions (`variant: "primary"`) = small link buttons below description
- Secondary actions = "…" dropdown menu on hover (top-right)
- Hover → `bg-raised`

### NotificationGroup
```
── Today ──────────────────────────────────
```
`text-xs text-fg-muted uppercase` with horizontal line.

### Icon variant colors
- `info` → `bg-blue-500/15 text-blue-500`
- `success` → `bg-emerald-500/15 text-emerald-500`
- `warning` → `bg-amber-500/15 text-amber-400`
- `critical` → `bg-red-500/15 text-red-400`
- default → `bg-fg/5 text-fg-muted`

## File Structure

- `components/blocks/notification-center.tsx` — all 4 components + types
- `components/blocks/index.ts` — re-export
- `app/(docs)/docs/components/ui/notification-center/page.tsx` — doc page with examples

## Integration

Refactor `components/layout/notification-sheet.tsx` to use the new block as a thin wrapper with Sheet + SheetHeader/SheetFooter.

## States

| State | Behavior |
|---|---|
| Loading | Skeleton items (3-5 placeholder rows) |
| Empty | EmptyState block with Bell icon, "No notifications" |
| Error | ErrorState block with onRetry |
| Success | Normal notification list |
