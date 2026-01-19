# Dropdown Menu

A contextual menu that appears when triggered, perfect for actions, options, and navigation with support for checkboxes, radio groups, and keyboard shortcuts.

## Import

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
```

## Usage

### Basic Dropdown

```tsx
import { MoreVertical } from 'lucide-react'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem>Archive</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### With Icons

```tsx
import { Edit, Copy, Archive, Trash2 } from 'lucide-react'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Copy className="mr-2 h-4 w-4" />
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Archive className="mr-2 h-4 w-4" />
      Archive
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### With Labels

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### With Keyboard Shortcuts

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>File</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
      New File
      <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Open
      <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Save
      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Close
      <DropdownMenuShortcut>⌘W</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### With Checkboxes

```tsx
'use client'

import { useState } from 'react'

export default function CheckboxMenu() {
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [showActivityBar, setShowActivityBar] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
        >
          Activity Bar
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### With Radio Group

```tsx
'use client'

import { useState } from 'react'

export default function RadioMenu() {
  const [position, setPosition] = useState('bottom')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Position</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### With Submenu

```tsx
import { ChevronRight } from 'lucide-react'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>More Tools</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>Developer Tools</DropdownMenuItem>
        <DropdownMenuItem>Task Manager</DropdownMenuItem>
        <DropdownMenuItem>Extensions</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

## API Reference

### DropdownMenu (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |

### DropdownMenuTrigger

| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Compose with child element |

### DropdownMenuContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side |
| `sideOffset` | `number` | `4` | Distance from trigger (px) |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment |
| `alignOffset` | `number` | `0` | Offset along alignment axis |

### DropdownMenuItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive"` | `"default"` | Visual variant |
| `inset` | `boolean` | `false` | Add left padding for alignment |
| `disabled` | `boolean` | `false` | Whether item is disabled |
| `onSelect` | `(event: Event) => void` | - | Callback when item selected |

### DropdownMenuCheckboxItem

| Prop | Type | Description |
|------|------|-------------|
| `checked` | `boolean \| "indeterminate"` | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | Callback when checked changes |

### DropdownMenuRadioGroup

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Selected value |
| `onValueChange` | `(value: string) => void` | Callback when selection changes |

### DropdownMenuRadioItem

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Radio item value (required) |

### DropdownMenuLabel

| Prop | Type | Description |
|------|------|-------------|
| `inset` | `boolean` | Add left padding for alignment |

### DropdownMenuSeparator

Visual separator between menu items.

### DropdownMenuShortcut

Container for keyboard shortcut hint.

### DropdownMenuGroup

Groups related menu items.

### DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent

Components for creating nested submenus.

## Styling

### Data Slots

- `data-slot="dropdown-menu"` - Root container
- `data-slot="dropdown-menu-trigger"` - Trigger button
- `data-slot="dropdown-menu-content"` - Menu content
- `data-slot="dropdown-menu-item"` - Menu item
- `data-slot="dropdown-menu-label"` - Label
- `data-slot="dropdown-menu-separator"` - Separator
- `data-slot="dropdown-menu-checkbox-item"` - Checkbox item
- `data-slot="dropdown-menu-radio-item"` - Radio item
- `data-slot="dropdown-menu-shortcut"` - Shortcut hint

### Data Attributes

```css
/* Variants */
[data-slot="dropdown-menu-item"][data-variant="destructive"] { }

/* States */
[data-slot="dropdown-menu-item"][data-disabled] { }
[data-slot="dropdown-menu-checkbox-item"][data-checked] { }

/* Inset */
[data-slot="dropdown-menu-item"][data-inset] { }
[data-slot="dropdown-menu-label"][data-inset] { }
```

## Examples

### User Menu

```tsx
import { User, Settings, LogOut } from 'lucide-react'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <Avatar size="sm">
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Table Row Actions

```tsx
import { MoreHorizontal, Edit, Copy, Trash } from 'lucide-react'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">Open menu</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Copy className="mr-2 h-4 w-4" />
      Make a copy
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Filter Menu

```tsx
'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'

export default function FilterMenu() {
  const [status, setStatus] = useState<string[]>([])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={status.includes('active')}
          onCheckedChange={(checked) =>
            setStatus(
              checked
                ? [...status, 'active']
                : status.filter((s) => s !== 'active')
            )
          }
        >
          Active
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={status.includes('pending')}
          onCheckedChange={(checked) =>
            setStatus(
              checked
                ? [...status, 'pending']
                : status.filter((s) => s !== 'pending')
            )
          }
        >
          Pending
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={status.includes('inactive')}
          onCheckedChange={(checked) =>
            setStatus(
              checked
                ? [...status, 'inactive']
                : status.filter((s) => s !== 'inactive')
            )
          }
        >
          Inactive
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Sort Menu

```tsx
'use client'

import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'

export default function SortMenu() {
  const [sortBy, setSortBy] = useState('name')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Context Menu Alternative

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <div className="p-4 border rounded-lg cursor-pointer">
      Right-click me (or click for menu)
    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Cut</DropdownMenuItem>
    <DropdownMenuItem>Copy</DropdownMenuItem>
    <DropdownMenuItem>Paste</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Select All</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Theme Switcher

```tsx
'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useState } from 'react'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('system')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="mr-2 h-4 w-4" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Export Menu

```tsx
import { Download, FileText, File, Image } from 'lucide-react'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Export as</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <FileText className="mr-2 h-4 w-4" />
      PDF
    </DropdownMenuItem>
    <DropdownMenuItem>
      <File className="mr-2 h-4 w-4" />
      CSV
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Image className="mr-2 h-4 w-4" />
      PNG
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Notification Settings

```tsx
'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={settings.email}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, email: checked })
          }
        >
          Email Notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={settings.push}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, push: checked })
          }
        >
          Push Notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={settings.sms}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, sms: checked })
          }
        >
          SMS Notifications
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Common Patterns

### Confirmation before Action

```tsx
'use client'

import { Trash } from 'lucide-react'

const handleDelete = () => {
  if (window.confirm('Are you sure you want to delete this item?')) {
    // Delete logic
  }
}

<DropdownMenuItem variant="destructive" onSelect={handleDelete}>
  <Trash className="mr-2 h-4 w-4" />
  Delete
</DropdownMenuItem>
```

### Disabled Items

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Available Action</DropdownMenuItem>
    <DropdownMenuItem disabled>Unavailable Action</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Best Practices

### Do's
- ✅ Use for actions and options
- ✅ Group related items with separators
- ✅ Use destructive variant for dangerous actions
- ✅ Include keyboard shortcuts for common actions
- ✅ Add icons for better scannability

### Don'ts
- ❌ Don't use for navigation (use Menu or Tabs)
- ❌ Don't nest too many submenus (max 2 levels)
- ❌ Don't make menus too long (group or split)
- ❌ Don't forget disabled states
- ❌ Don't hide critical actions

## Dropdown Menu vs Popover vs Select

### Use Dropdown Menu When:
- Context actions
- User-triggered options
- Settings toggles
- Quick actions
- Right-click alternatives

### Use Popover When:
- Rich content display
- Forms and inputs
- Information panels
- Non-action content
- User needs to read/interact

### Use Select When:
- Form field selection
- Single choice from list
- Value assignment
- Search/filter needed

## Accessibility

- Keyboard navigable (Arrow keys, Enter, Escape)
- Screen reader support with ARIA menu role
- Focus management
- Proper labeling
- Disabled items conveyed
- Checkboxes and radios accessible
- Submenu navigation
- Keyboard shortcuts visible

## Related Components

- [Menu](./MENU.README.md) - For navigation menus
- [Popover](./POPOVER.README.md) - For content display
- [Select](./SELECT.README.md) - For form selection
- [Command](./COMMAND.README.md) - For command palette

## Notes

- Built on Base UI Menu primitive
- Automatically positions to stay in viewport
- Smooth animations
- Keyboard navigation
- Supports nested submenus
- Works seamlessly in dark mode
- Click outside to close
- Focus returns to trigger
- Scroll handling for long menus
