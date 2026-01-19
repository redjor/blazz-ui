# Command

A command palette/menu component for quick access to actions and navigation with keyboard-first interaction and fuzzy search.

## Import

```tsx
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
```

## Usage

### Basic Command

```tsx
<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### Command Dialog (Cmd+K)

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function CommandMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

### With Icons

```tsx
import { Calendar, Smile, Calculator } from 'lucide-react'

<Command>
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem>
        <Calendar className="mr-2 h-4 w-4" />
        <span>Calendar</span>
      </CommandItem>
      <CommandItem>
        <Smile className="mr-2 h-4 w-4" />
        <span>Search Emoji</span>
      </CommandItem>
      <CommandItem>
        <Calculator className="mr-2 h-4 w-4" />
        <span>Calculator</span>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### With Keyboard Shortcuts

```tsx
<Command>
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandGroup heading="Actions">
      <CommandItem>
        New File
        <CommandShortcut>⌘N</CommandShortcut>
      </CommandItem>
      <CommandItem>
        Open
        <CommandShortcut>⌘O</CommandShortcut>
      </CommandItem>
      <CommandItem>
        Save
        <CommandShortcut>⌘S</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### With Multiple Groups

```tsx
<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Actions">
      <CommandItem>New File</CommandItem>
      <CommandItem>Open File</CommandItem>
      <CommandItem>Save</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Navigation">
      <CommandItem>Go to Dashboard</CommandItem>
      <CommandItem>Go to Settings</CommandItem>
      <CommandItem>Go to Profile</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### With Action Handlers

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function ActionCommand() {
  const router = useRouter()

  return (
    <Command>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => router.push('/dashboard')}>
            Go to Dashboard
          </CommandItem>
          <CommandItem onSelect={() => router.push('/settings')}>
            Go to Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

## API Reference

### Command (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `shouldFilter` | `boolean` | `true` | Enable/disable built-in filtering |
| `filter` | `(value: string, search: string) => number` | - | Custom filter function |
| `value` | `string` | - | Controlled selected value |
| `onValueChange` | `(value: string) => void` | - | Callback when selection changes |

### CommandDialog

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `children` | `ReactNode` | - | Command content |

### CommandInput

| Prop | Type | Description |
|------|------|-------------|
| `placeholder` | `string` | Input placeholder text |
| `value` | `string` | Controlled input value |
| `onValueChange` | `(value: string) => void` | Callback when input changes |

### CommandList

Container for command items with scrolling.

### CommandEmpty

Displayed when no matching results found.

### CommandGroup

| Prop | Type | Description |
|------|------|-------------|
| `heading` | `string` | Group heading text |
| `children` | `ReactNode` | Group items |

### CommandItem

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Item value for filtering/selection |
| `onSelect` | `(value: string) => void` | Callback when item selected |
| `disabled` | `boolean` | Whether item is disabled |

### CommandSeparator

Visual separator between groups.

### CommandShortcut

Container for keyboard shortcut hint.

## Examples

### Navigation Menu

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Settings, User, LogOut } from 'lucide-react'

export default function NavigationCommand() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Where do you want to go?" />
      <CommandList>
        <CommandEmpty>No pages found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => router.push('/')}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </CommandItem>
          <CommandItem onSelect={() => router.push('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
          <CommandItem onSelect={() => router.push('/profile')}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem onSelect={() => console.log('logout')}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

### File Operations

```tsx
import { FileText, Folder, Image, File } from 'lucide-react'

<Command>
  <CommandInput placeholder="Search files..." />
  <CommandList>
    <CommandEmpty>No files found.</CommandEmpty>
    <CommandGroup heading="Recent Files">
      <CommandItem>
        <FileText className="mr-2 h-4 w-4" />
        document.pdf
        <CommandShortcut>⌘1</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <Image className="mr-2 h-4 w-4" />
        photo.jpg
        <CommandShortcut>⌘2</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <File className="mr-2 h-4 w-4" />
        data.csv
        <CommandShortcut>⌘3</CommandShortcut>
      </CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Quick Actions">
      <CommandItem>
        <Folder className="mr-2 h-4 w-4" />
        New Folder
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### Search with API

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

export default function ApiSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const search = async () => {
      setLoading(true)
      const response = await fetch(`/api/search?q=${query}`)
      const data = await response.json()
      setResults(data)
      setLoading(false)
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query])

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder="Search..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && <CommandEmpty>Searching...</CommandEmpty>}
        {!loading && results.length === 0 && query.length >= 2 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((result: any) => (
              <CommandItem key={result.id} value={result.id}>
                <Search className="mr-2 h-4 w-4" />
                {result.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}
```

### Theme Switcher

```tsx
'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeCommand() {
  const { setTheme } = useTheme()

  return (
    <Command>
      <CommandInput placeholder="Choose theme..." />
      <CommandList>
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => setTheme('light')}>
            <Sun className="mr-2 h-4 w-4" />
            Light
          </CommandItem>
          <CommandItem onSelect={() => setTheme('dark')}>
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </CommandItem>
          <CommandItem onSelect={() => setTheme('system')}>
            <Monitor className="mr-2 h-4 w-4" />
            System
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

### User Search

```tsx
'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: '/john.jpg' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: '/jane.jpg' },
  // more users...
]

export default function UserSearch() {
  const [open, setOpen] = useState(false)

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search users..." />
      <CommandList>
        <CommandEmpty>No users found.</CommandEmpty>
        <CommandGroup heading="Users">
          {users.map((user) => (
            <CommandItem key={user.id} value={user.name}>
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

### Command Palette with Sections

```tsx
'use client'

import { FileText, Settings, User, Search, Plus } from 'lucide-react'

export default function FullCommandPalette() {
  return (
    <CommandDialog>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem>
            <Plus className="mr-2 h-4 w-4" />
            Create New
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Search className="mr-2 h-4 w-4" />
            Search
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Pages">
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

## Common Patterns

### Global Command Palette

```tsx
'use client'

// In layout.tsx or root component
import { useEffect, useState } from 'react'

export default function RootLayout({ children }) {
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      {children}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        {/* Command content */}
      </CommandDialog>
    </>
  )
}
```

### Trigger Button

```tsx
<Button
  variant="outline"
  onClick={() => setOpen(true)}
  className="text-muted-foreground"
>
  <Search className="mr-2 h-4 w-4" />
  Search...
  <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
    <span className="text-xs">⌘</span>K
  </kbd>
</Button>
```

## Best Practices

### Do's
- ✅ Use Cmd+K or Ctrl+K for keyboard shortcut
- ✅ Provide clear search placeholder
- ✅ Group related items
- ✅ Show keyboard shortcuts
- ✅ Handle loading and empty states

### Don'ts
- ❌ Don't make commands too nested
- ❌ Don't forget to handle keyboard navigation
- ❌ Don't overload with too many items
- ❌ Don't forget empty state message
- ❌ Don't use for simple dropdowns (use Select)

## Command vs Combobox vs Select

### Use Command When:
- Quick actions/shortcuts
- Global search
- Navigation menu
- File/command palette
- Keyboard-first interaction

### Use Combobox When:
- Form field selection
- Searchable dropdown
- Single value selection
- Autocomplete needed

### Use Select When:
- Simple dropdown
- Form fields
- No search needed
- Standard selection

## Accessibility

- Keyboard navigable (Arrow keys, Enter, Escape)
- Screen reader support
- Search input properly labeled
- Focus management
- ARIA attributes
- Disabled items conveyed
- Groups properly announced

## Related Components

- [Dialog](./DIALOG.README.md) - For CommandDialog
- [Combobox](./COMBOBOX.README.md) - For searchable select
- [Dropdown Menu](./DROPDOWN-MENU.README.md) - For actions

## Notes

- Built on cmdk library
- Fuzzy search built-in
- Keyboard shortcuts support
- Fast and responsive
- Works seamlessly in dark mode
- Smooth animations
- Automatically filters results
- Scroll handling for long lists
- Custom filtering possible
