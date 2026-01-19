# Menu

A navigation menu component with support for nested submenus, radio groups, and checkbox items.

## Import

```tsx
import {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuCheckboxItem,
} from '@/components/ui/menu'
```

## Usage

### Basic Menu

```tsx
<Menu>
  <MenuTrigger asChild>
    <Button>Menu</Button>
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner>
      <MenuPopup>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>
```

### With Icons

```tsx
import { User, Settings, LogOut } from 'lucide-react'

<Menu>
  <MenuTrigger asChild>
    <Button>Menu</Button>
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner>
      <MenuPopup>
        <MenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </MenuItem>
        <MenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </MenuItem>
        <MenuSeparator />
        <MenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </MenuItem>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>
```

### With Groups

```tsx
<Menu>
  <MenuTrigger asChild>
    <Button>View</Button>
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>Panel</MenuGroupLabel>
          <MenuItem>Sidebar</MenuItem>
          <MenuItem>Activity Bar</MenuItem>
          <MenuItem>Status Bar</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Editor</MenuGroupLabel>
          <MenuItem>Line Numbers</MenuItem>
          <MenuItem>Minimap</MenuItem>
        </MenuGroup>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>
```

### With Checkbox Items

```tsx
'use client'

import { useState } from 'react'

export default function CheckboxMenu() {
  const [showPanel, setShowPanel] = useState(true)
  const [showMinimap, setShowMinimap] = useState(false)

  return (
    <Menu>
      <MenuTrigger asChild>
        <Button>View</Button>
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner>
          <MenuPopup>
            <MenuGroup>
              <MenuGroupLabel>Appearance</MenuGroupLabel>
              <MenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                Side Panel
              </MenuCheckboxItem>
              <MenuCheckboxItem
                checked={showMinimap}
                onCheckedChange={setShowMinimap}
              >
                Minimap
              </MenuCheckboxItem>
            </MenuGroup>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  )
}
```

### With Radio Items

```tsx
'use client'

import { useState } from 'react'

export default function RadioMenu() {
  const [position, setPosition] = useState('bottom')

  return (
    <Menu>
      <MenuTrigger asChild>
        <Button>Position</Button>
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner>
          <MenuPopup>
            <MenuGroup>
              <MenuGroupLabel>Panel Position</MenuGroupLabel>
              <MenuRadioGroup value={position} onValueChange={setPosition}>
                <MenuRadioItem value="top">Top</MenuRadioItem>
                <MenuRadioItem value="bottom">Bottom</MenuRadioItem>
                <MenuRadioItem value="left">Left</MenuRadioItem>
                <MenuRadioItem value="right">Right</MenuRadioItem>
              </MenuRadioGroup>
            </MenuGroup>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  )
}
```

### Disabled Items

```tsx
<Menu>
  <MenuTrigger asChild>
    <Button>Menu</Button>
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner>
      <MenuPopup>
        <MenuItem>Available Action</MenuItem>
        <MenuItem disabled>Disabled Action</MenuItem>
        <MenuItem>Another Action</MenuItem>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>
```

## API Reference

### Menu (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |

### MenuTrigger

| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Compose with child element |

### MenuPortal

Portal component for rendering menu in document body.

### MenuPositioner

Handles menu positioning relative to trigger.

### MenuPopup

Container for menu content.

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |

### MenuItem

| Prop | Type | Description |
|------|------|-------------|
| `disabled` | `boolean` | Whether item is disabled |
| `onSelect` | `(event: Event) => void` | Callback when selected |

### MenuCheckboxItem

| Prop | Type | Description |
|------|------|-------------|
| `checked` | `boolean \| "indeterminate"` | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | Callback when checked changes |

### MenuRadioGroup

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Selected value |
| `onValueChange` | `(value: string) => void` | Callback when selection changes |

### MenuRadioItem

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Radio item value (required) |

### MenuGroupLabel

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Label text |

### MenuSeparator

Visual separator between menu items or groups.

## Examples

### Navigation Menu

```tsx
import { Home, Users, Settings, HelpCircle } from 'lucide-react'

<Menu>
  <MenuTrigger asChild>
    <Button variant="ghost">Navigation</Button>
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner>
      <MenuPopup>
        <MenuItem>
          <Home className="mr-2 h-4 w-4" />
          Home
        </MenuItem>
        <MenuItem>
          <Users className="mr-2 h-4 w-4" />
          Team
        </MenuItem>
        <MenuSeparator />
        <MenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </MenuItem>
        <MenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </MenuItem>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>
```

### Settings Menu

```tsx
'use client'

import { useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

export default function SettingsMenu() {
  const [theme, setTheme] = useState('system')

  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="outline">Theme</Button>
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner>
          <MenuPopup>
            <MenuGroup>
              <MenuGroupLabel>Theme</MenuGroupLabel>
              <MenuRadioGroup value={theme} onValueChange={setTheme}>
                <MenuRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </MenuRadioItem>
                <MenuRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </MenuRadioItem>
                <MenuRadioItem value="system">
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </MenuRadioItem>
              </MenuRadioGroup>
            </MenuGroup>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  )
}
```

### User Account Menu

```tsx
import { User, CreditCard, Settings, LogOut } from 'lucide-react'

<Menu>
  <MenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <Avatar size="sm">
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </Button>
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>My Account</MenuGroupLabel>
          <MenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </MenuItem>
          <MenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </MenuItem>
          <MenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </MenuItem>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>
```

### Filter Menu

```tsx
'use client'

import { useState } from 'react'

export default function FilterMenu() {
  const [filters, setFilters] = useState({
    active: true,
    pending: false,
    completed: false,
  })

  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="outline">Filter</Button>
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner>
          <MenuPopup>
            <MenuGroup>
              <MenuGroupLabel>Status</MenuGroupLabel>
              <MenuCheckboxItem
                checked={filters.active}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, active: checked })
                }
              >
                Active
              </MenuCheckboxItem>
              <MenuCheckboxItem
                checked={filters.pending}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, pending: checked })
                }
              >
                Pending
              </MenuCheckboxItem>
              <MenuCheckboxItem
                checked={filters.completed}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, completed: checked })
                }
              >
                Completed
              </MenuCheckboxItem>
            </MenuGroup>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  )
}
```

## Common Patterns

### Navbar Menu

```tsx
<nav className="flex items-center gap-4">
  <Menu>
    <MenuTrigger asChild>
      <Button variant="ghost">Products</Button>
    </MenuTrigger>
    <MenuPortal>
      <MenuPositioner>
        <MenuPopup>
          <MenuItem>Product A</MenuItem>
          <MenuItem>Product B</MenuItem>
          <MenuItem>Product C</MenuItem>
        </MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  </Menu>

  <Menu>
    <MenuTrigger asChild>
      <Button variant="ghost">Solutions</Button>
    </MenuTrigger>
    <MenuPortal>
      <MenuPositioner>
        <MenuPopup>
          <MenuItem>Solution 1</MenuItem>
          <MenuItem>Solution 2</MenuItem>
        </MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  </Menu>
</nav>
```

## Best Practices

### Do's
- ✅ Use for navigation menus
- ✅ Group related items
- ✅ Add icons for clarity
- ✅ Use separators between groups
- ✅ Handle disabled states

### Don'ts
- ❌ Don't use for actions (use Dropdown Menu)
- ❌ Don't nest too deeply
- ❌ Don't make menus too long
- ❌ Don't forget disabled items
- ❌ Don't overuse separators

## Menu vs Dropdown Menu

### Use Menu When:
- Navigation menus
- Persistent menu bars
- App navigation
- Hierarchical navigation
- Multi-level menus

### Use Dropdown Menu When:
- Context actions
- User-triggered options
- Quick actions
- Settings toggles
- Right-click alternatives

## Accessibility

- Keyboard navigable (Arrow keys, Enter, Escape)
- Screen reader support with ARIA menu role
- Focus management
- Proper labeling
- Disabled items conveyed
- Checkboxes and radios accessible
- Hover and focus states

## Related Components

- [Dropdown Menu](./DROPDOWN-MENU.README.md) - For actions
- [Command](./COMMAND.README.md) - For command palette
- [Navigation](./NAVIGATION.README.md) - For sidebar navigation

## Notes

- Built on Base UI Menu primitive
- Automatically positions to stay in viewport
- Smooth animations
- Keyboard navigation
- Works seamlessly in dark mode
- Portal rendering
- Focus returns to trigger on close
- Hover and click support
