# Sidebar

A comprehensive collapsible sidebar component with mobile support, keyboard shortcuts, state persistence, and extensive customization options. Perfect for dashboard layouts and navigation systems.

## Import

```tsx
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar'
```

## Usage

### Basic Sidebar

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>
      <h2 className="text-lg font-semibold">My App</h2>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Home</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <p className="text-xs text-muted-foreground">© 2024 My App</p>
    </SidebarFooter>
  </Sidebar>

  <SidebarInset>
    <header className="flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <h1>Page Content</h1>
    </header>
    <main className="p-4">
      {/* Your page content */}
    </main>
  </SidebarInset>
</SidebarProvider>
```

### With Icons

```tsx
import { Home, Settings, Users, FileText } from 'lucide-react'

<Sidebar>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Home />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>
              <Users />
              <span>Users</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <FileText />
              <span>Documents</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>
```

### With Tooltips (Collapsed State)

```tsx
<SidebarMenuItem>
  <SidebarMenuButton tooltip="Dashboard">
    <LayoutDashboard />
    <span>Dashboard</span>
  </SidebarMenuButton>
</SidebarMenuItem>
```

### With Next.js Link

```tsx
import Link from 'next/link'

<SidebarMenuItem>
  <SidebarMenuButton asChild>
    <Link href="/dashboard">
      <LayoutDashboard />
      <span>Dashboard</span>
    </Link>
  </SidebarMenuButton>
</SidebarMenuItem>
```

### Collapsible Group

```tsx
import { ChevronDown } from 'lucide-react'

<SidebarCollapsible>
  <SidebarGroupCollapsibleTrigger>
    <Folder />
    <span>Projects</span>
    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
  </SidebarGroupCollapsibleTrigger>
  <SidebarCollapsibleContent>
    <SidebarMenuSub>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton>Project A</SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton>Project B</SidebarMenuSubButton>
      </SidebarMenuSubItem>
    </SidebarMenuSub>
  </SidebarCollapsibleContent>
</SidebarCollapsible>
```

## API Reference

### SidebarProvider

Root provider that manages sidebar state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `true` | Default open state |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |

**CSS Variables**:
- `--sidebar-width`: `240px` - Sidebar width when expanded
- `--sidebar-width-mobile`: `18rem` - Mobile sidebar width
- `--sidebar-width-icon`: `3rem` - Width when collapsed to icons

### Sidebar

Main sidebar container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"left" \| "right"` | `"left"` | Sidebar position |
| `variant` | `"sidebar" \| "floating" \| "inset"` | `"sidebar"` | Visual variant |
| `collapsible` | `"offcanvas" \| "icon" \| "none"` | `"offcanvas"` | Collapse behavior |

**Variants**:
- `sidebar`: Standard sidebar with border
- `floating`: Floating sidebar with rounded corners and shadow
- `inset`: Inset sidebar with padding

**Collapsible Modes**:
- `offcanvas`: Slides completely out of view
- `icon`: Collapses to icon-only view
- `none`: Non-collapsible sidebar

### SidebarTrigger

Button to toggle sidebar open/closed.

| Prop | Type | Description |
|------|------|-------------|
| All Button props | - | Extends Button component |

**Keyboard Shortcut**: `Cmd+B` (Mac) / `Ctrl+B` (Windows/Linux)

### SidebarInset

Main content area that adjusts based on sidebar state.

### SidebarHeader / SidebarFooter

Fixed header and footer sections within sidebar.

### SidebarContent

Scrollable content area of the sidebar.

### SidebarSeparator

Visual separator between sections.

### SidebarGroup

Container for grouping related menu items.

### SidebarGroupLabel

Label for a sidebar group.

| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Render as child element |

### SidebarGroupAction

Action button within a group header.

| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Render as child element |

### SidebarMenu

Container for menu items.

### SidebarMenuItem

Individual menu item container.

### SidebarMenuButton

Button for menu items with variants and tooltips.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render as child element |
| `isActive` | `boolean` | `false` | Active state |
| `variant` | `"default" \| "outline"` | `"default"` | Visual variant |
| `size` | `"default" \| "sm" \| "lg"` | `"default"` | Button size |
| `tooltip` | `string \| object` | - | Tooltip content (shown when collapsed) |

### SidebarMenuAction

Action button within menu item (e.g., more options).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render as child element |
| `showOnHover` | `boolean` | `false` | Only show on hover |

### SidebarMenuBadge

Badge/counter within menu item.

### SidebarMenuSub / SidebarMenuSubItem / SidebarMenuSubButton

Components for nested submenu items.

### useSidebar Hook

Hook to access sidebar state and controls.

```tsx
const {
  state, // 'expanded' | 'collapsed'
  open, // boolean
  setOpen, // (open: boolean) => void
  toggleSidebar, // () => void
  isMobile, // boolean
  openMobile, // boolean
  setOpenMobile, // (open: boolean) => void
} = useSidebar()
```

## Examples

### Complete Dashboard Sidebar

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react'

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                MA
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">My App</span>
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/dashboard'}
                    tooltip="Dashboard"
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/users'}
                    tooltip="Users"
                  >
                    <Link href="/users">
                      <Users />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/documents'}
                    tooltip="Documents"
                  >
                    <Link href="/documents">
                      <FileText />
                      <span>Documents</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/settings'}
                    tooltip="Settings"
                  >
                    <Link href="/settings">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sign Out">
                <LogOut />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="p-4">
          {/* Content */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### With Nested Navigation

```tsx
import { ChevronDown, Folder, File } from 'lucide-react'

<SidebarContent>
  <SidebarGroup>
    <SidebarGroupLabel>Projects</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarCollapsible>
            <SidebarGroupCollapsibleTrigger>
              <Folder />
              <span>Website Redesign</span>
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarGroupCollapsibleTrigger>
            <SidebarCollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/projects/website/homepage">
                      <File />
                      <span>Homepage</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/projects/website/about">
                      <File />
                      <span>About Page</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarCollapsibleContent>
          </SidebarCollapsible>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</SidebarContent>
```

### With Actions

```tsx
import { MoreHorizontal, Plus } from 'lucide-react'

<SidebarGroup>
  <div className="relative flex items-center">
    <SidebarGroupLabel>Projects</SidebarGroupLabel>
    <SidebarGroupAction asChild>
      <Button variant="ghost" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </SidebarGroupAction>
  </div>
  <SidebarGroupContent>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <Folder />
          <span>Project Alpha</span>
        </SidebarMenuButton>
        <SidebarMenuAction showOnHover asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </SidebarMenuAction>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>
```

### With Badges

```tsx
<SidebarMenuItem>
  <SidebarMenuButton>
    <Inbox />
    <span>Inbox</span>
  </SidebarMenuButton>
  <SidebarMenuBadge>12</SidebarMenuBadge>
</SidebarMenuItem>
```

### Floating Variant

```tsx
<SidebarProvider>
  <Sidebar variant="floating">
    {/* Sidebar content */}
  </Sidebar>
  <SidebarInset>
    {/* Page content */}
  </SidebarInset>
</SidebarProvider>
```

### Icon-Only Collapse

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon">
    {/* Sidebar content */}
  </Sidebar>
  <SidebarInset>
    {/* Page content */}
  </SidebarInset>
</SidebarProvider>
```

### Right-Side Sidebar

```tsx
<SidebarProvider>
  <SidebarInset>
    {/* Main content */}
  </SidebarInset>
  <Sidebar side="right">
    {/* Sidebar content */}
  </Sidebar>
</SidebarProvider>
```

### Controlled State

```tsx
'use client'

import { useState } from 'react'

export default function ControlledSidebar() {
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        {/* Sidebar content */}
      </Sidebar>
      <SidebarInset>
        <header>
          <SidebarTrigger />
          <Button onClick={() => setOpen(!open)}>
            Toggle Sidebar
          </Button>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### With User Profile

```tsx
<SidebarFooter>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">John Doe</span>
              <span className="text-xs text-muted-foreground">
                john@example.com
              </span>
            </div>
            <ChevronUp className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width]"
          align="start"
          side="top"
        >
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarFooter>
```

### Loading State

```tsx
<SidebarContent>
  <SidebarGroup>
    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</SidebarContent>
```

## Common Patterns

### Access Sidebar State in Components

```tsx
'use client'

import { useSidebar } from '@/components/ui/sidebar'

export function MyComponent() {
  const { state, toggleSidebar } = useSidebar()

  return (
    <div>
      <p>Sidebar is {state}</p>
      <Button onClick={toggleSidebar}>Toggle</Button>
    </div>
  )
}
```

### Persistent State

The sidebar automatically saves its state to a cookie (`sidebar:state`) that persists for 7 days.

### Mobile Behavior

On mobile devices (< 768px), the sidebar:
- Displays as an overlay
- Has a backdrop that closes the sidebar
- Uses mobile-specific width
- Automatically handles touch interactions

## Best Practices

### Do's
- ✅ Use SidebarProvider at the root
- ✅ Provide tooltips for icon-only state
- ✅ Use semantic HTML with asChild
- ✅ Group related items logically
- ✅ Add keyboard shortcuts hint
- ✅ Handle mobile responsiveness

### Don'ts
- ❌ Don't nest SidebarProvider
- ❌ Don't forget mobile testing
- ❌ Don't overload with too many items
- ❌ Don't forget active states
- ❌ Don't hide important actions when collapsed
- ❌ Don't forget accessibility

## Keyboard Shortcuts

- `Cmd+B` (Mac) / `Ctrl+B` (Windows/Linux): Toggle sidebar
- `Tab`: Navigate through menu items
- `Enter` / `Space`: Activate menu button
- `Escape`: Close mobile sidebar

## Accessibility

- Keyboard navigation support
- Focus management
- ARIA labels on trigger button
- Screen reader announcements
- Semantic HTML structure
- Tooltip support for collapsed state
- Mobile overlay with backdrop
- Touch-friendly hit areas

## Related Components

- [Button](./BUTTON.README.md) - Trigger and menu buttons
- [Tooltip](./TOOLTIP.README.md) - Collapsed state tooltips
- [Collapsible](./COLLAPSIBLE.README.md) - Collapsible groups
- [Separator](./SEPARATOR.README.md) - Visual separators
- [Badge](./BADGE.README.md) - Menu item badges

## Notes

- Client component (uses React state and effects)
- State persisted in cookies (7-day expiry)
- Responsive with mobile overlay
- Keyboard shortcut: `Cmd+B` / `Ctrl+B`
- Automatic width transition animations
- Three collapsible modes (offcanvas, icon, none)
- Three visual variants (sidebar, floating, inset)
- Support for left or right positioning
- Tooltip integration when collapsed
- Mobile detection with media queries
- Works seamlessly in dark mode
- CSS variables for customization
- TooltipProvider included in SidebarProvider
- Data attributes for targeted styling
- forwardRef support on all components
