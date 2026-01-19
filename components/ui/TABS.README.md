# Tabs

A set of layered sections of content—known as tab panels—that are displayed one at a time, with tabs to switch between them.

## Import

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
```

## Usage

### Basic Tabs

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>

  <TabsContent value="account">
    <p>Account settings content</p>
  </TabsContent>

  <TabsContent value="password">
    <p>Password settings content</p>
  </TabsContent>

  <TabsContent value="notifications">
    <p>Notification settings content</p>
  </TabsContent>
</Tabs>
```

### Line Variant

```tsx
<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
  <TabsContent value="reports">Reports content</TabsContent>
</Tabs>
```

### Vertical Orientation

```tsx
<Tabs defaultValue="profile" orientation="vertical">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>

  <TabsContent value="profile">Profile settings</TabsContent>
  <TabsContent value="security">Security settings</TabsContent>
  <TabsContent value="billing">Billing information</TabsContent>
</Tabs>
```

### With Icons

```tsx
import { User, Lock, Bell } from 'lucide-react'

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">
      <User className="mr-2 h-4 w-4" />
      Account
    </TabsTrigger>
    <TabsTrigger value="password">
      <Lock className="mr-2 h-4 w-4" />
      Password
    </TabsTrigger>
    <TabsTrigger value="notifications">
      <Bell className="mr-2 h-4 w-4" />
      Notifications
    </TabsTrigger>
  </TabsList>

  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
  <TabsContent value="notifications">Notifications content</TabsContent>
</Tabs>
```

### Controlled Tabs

```tsx
'use client'

import { useState } from 'react'

export default function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('account')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <p>Current tab: {activeTab}</p>
        <Button onClick={() => setActiveTab('password')}>
          Go to Password
        </Button>
      </TabsContent>

      <TabsContent value="password">
        <p>Password settings</p>
      </TabsContent>
    </Tabs>
  )
}
```

## API Reference

### Tabs (Root)

Main container for the tabs component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | - | The default active tab value (uncontrolled) |
| `value` | `string` | - | The controlled active tab value |
| `onValueChange` | `(value: string) => void` | - | Callback when active tab changes |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Tab orientation |
| `className` | `string` | - | Additional CSS classes |

### TabsList

Container for the tab triggers.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "line"` | `"default"` | Visual style variant |
| `className` | `string` | - | Additional CSS classes |

### TabsTrigger

Individual tab button/trigger.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Required.** Unique value for the tab |
| `disabled` | `boolean` | `false` | Whether the tab is disabled |
| `className` | `string` | - | Additional CSS classes |

### TabsContent

Content panel for each tab.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Required.** Value matching a TabsTrigger |
| `className` | `string` | - | Additional CSS classes |

## Styling

### Data Slots

- `data-slot="tabs"` - Root tabs container
- `data-slot="tabs-list"` - Tabs list container
- `data-slot="tabs-trigger"` - Individual tab trigger
- `data-slot="tabs-content"` - Tab content panel

### Variants

#### Default Variant
```tsx
<TabsList variant="default">
  {/* Tabs appear in a muted background container */}
</TabsList>
```

#### Line Variant
```tsx
<TabsList variant="line">
  {/* Tabs have underline indicator on active state */}
</TabsList>
```

### States

- **Active**: `data-active` attribute indicates the currently selected tab
- **Disabled**: `disabled` attribute for non-interactive tabs
- **Focus**: Focus ring on keyboard navigation

## Accessibility

### Keyboard Navigation

- `Tab` / `Shift+Tab` - Move focus between tabs and content
- `Arrow Left/Right` - Navigate between horizontal tabs
- `Arrow Up/Down` - Navigate between vertical tabs
- `Home` - Focus first tab
- `End` - Focus last tab
- `Space` / `Enter` - Activate focused tab

### ARIA Attributes

The component automatically handles:
- `role="tablist"` on TabsList
- `role="tab"` on TabsTrigger
- `role="tabpanel"` on TabsContent
- `aria-selected` on active tab
- `aria-controls` linking triggers to panels
- `aria-labelledby` linking panels to triggers
- `aria-orientation` for vertical tabs

### Screen Reader Support

- Announces "tab list" when entering the tabs
- Announces current tab position (e.g., "1 of 3")
- Announces active state changes
- Properly associates panels with triggers

## Examples

### Settings Page

```tsx
<Tabs defaultValue="profile" className="w-full">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="appearance">Appearance</TabsTrigger>
  </TabsList>

  <TabsContent value="profile" className="space-y-4">
    <h2 className="text-2xl font-bold">Profile Settings</h2>
    <form className="space-y-4">
      <Field name="name" label="Display Name">
        <Input placeholder="John Doe" />
      </Field>
      <Field name="bio" label="Bio">
        <Textarea placeholder="Tell us about yourself" />
      </Field>
      <Button>Save Changes</Button>
    </form>
  </TabsContent>

  <TabsContent value="account">
    <h2 className="text-2xl font-bold">Account Settings</h2>
    {/* Account settings form */}
  </TabsContent>

  <TabsContent value="appearance">
    <h2 className="text-2xl font-bold">Appearance Settings</h2>
    {/* Appearance settings */}
  </TabsContent>
</Tabs>
```

### Dashboard Sections

```tsx
<Card>
  <CardHeader>
    <CardTitle>Analytics Dashboard</CardTitle>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="overview" variant="line">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 py-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$45,231</p>
            </CardContent>
          </Card>
          {/* More stat cards */}
        </div>
      </TabsContent>

      <TabsContent value="revenue">
        {/* Revenue charts */}
      </TabsContent>

      <TabsContent value="users">
        {/* User analytics */}
      </TabsContent>
    </Tabs>
  </CardContent>
</Card>
```

### Sidebar Navigation Tabs

```tsx
<div className="flex h-screen">
  <Tabs defaultValue="projects" orientation="vertical" className="flex flex-1">
    <TabsList className="h-full w-48 border-r">
      <TabsTrigger value="projects">Projects</TabsTrigger>
      <TabsTrigger value="tasks">Tasks</TabsTrigger>
      <TabsTrigger value="calendar">Calendar</TabsTrigger>
      <TabsTrigger value="team">Team</TabsTrigger>
    </TabsList>

    <div className="flex-1 p-6">
      <TabsContent value="projects">
        <h1 className="text-3xl font-bold">Projects</h1>
        {/* Projects content */}
      </TabsContent>

      <TabsContent value="tasks">
        <h1 className="text-3xl font-bold">Tasks</h1>
        {/* Tasks content */}
      </TabsContent>

      {/* Other tab contents */}
    </div>
  </Tabs>
</div>
```

### With Badges

```tsx
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">
      All
      <Badge variant="secondary" className="ml-2">
        128
      </Badge>
    </TabsTrigger>
    <TabsTrigger value="active">
      Active
      <Badge variant="secondary" className="ml-2">
        45
      </Badge>
    </TabsTrigger>
    <TabsTrigger value="completed">
      Completed
      <Badge variant="secondary" className="ml-2">
        83
      </Badge>
    </TabsTrigger>
  </TabsList>

  <TabsContent value="all">{/* All items */}</TabsContent>
  <TabsContent value="active">{/* Active items */}</TabsContent>
  <TabsContent value="completed">{/* Completed items */}</TabsContent>
</Tabs>
```

## Common Patterns

### Lazy Loading Content

```tsx
'use client'

import { useState } from 'react'

export default function LazyTabs() {
  const [loadedTabs, setLoadedTabs] = useState(new Set(['overview']))

  const handleTabChange = (value: string) => {
    setLoadedTabs((prev) => new Set([...prev, value]))
  }

  return (
    <Tabs defaultValue="overview" onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">Overview content</TabsContent>

      <TabsContent value="details">
        {loadedTabs.has('details') ? (
          <ExpensiveComponent />
        ) : (
          <Skeleton className="h-32 w-full" />
        )}
      </TabsContent>

      <TabsContent value="history">
        {loadedTabs.has('history') ? (
          <HistoryData />
        ) : (
          <Skeleton className="h-32 w-full" />
        )}
      </TabsContent>
    </Tabs>
  )
}
```

### URL Sync (Next.js)

```tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function URLSyncTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'account'

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', value)
    router.push(`?${params.toString()}`)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <TabsContent value="account">Account settings</TabsContent>
      <TabsContent value="password">Password settings</TabsContent>
    </Tabs>
  )
}
```

## Best Practices

### Do's

- ✅ Use tabs for related content that doesn't need to be seen simultaneously
- ✅ Keep tab labels short and descriptive (1-2 words ideal)
- ✅ Use consistent tab ordering across similar interfaces
- ✅ Indicate loading state when tab content is being fetched
- ✅ Provide visual feedback for the active tab
- ✅ Use icons to supplement text labels when helpful

### Don'ts

- ❌ Don't use tabs for navigation between different pages
- ❌ Don't nest tabs within tabs (creates confusing navigation)
- ❌ Don't use too many tabs (more than 6-7 becomes hard to scan)
- ❌ Don't hide critical actions inside tabs
- ❌ Don't make users switch tabs to complete a single task
- ❌ Don't use tabs when content needs to be compared side-by-side

## When to Use Tabs vs Alternatives

### Use Tabs When:
- Content is related but mutually exclusive
- Users only need to see one section at a time
- Space is limited
- Content groups are of similar importance

### Use Alternative Patterns When:
- **Accordion**: Content needs to be scannable without switching
- **Navigation**: Moving between different pages/routes
- **Step Wizard**: Linear progression through steps
- **Split View**: Users need to compare content side-by-side

## Related Components

- [Card](./CARD.README.md) - Often used as containers for tab content
- [Sheet](./SHEET.README.md) - Alternative for mobile navigation
- [Select](./SELECT.README.md) - Alternative for many options on mobile
- [Breadcrumb](./BREADCRUMB.README.md) - Page-level navigation

## Notes

- Tabs automatically handle keyboard navigation and focus management
- The line variant uses an animated underline indicator
- Vertical tabs are useful for sidebar-style navigation
- Content is rendered but hidden (not unmounted) by default
- Icons within tabs automatically size to h-4 w-4 unless overridden
- Works seamlessly in dark mode
