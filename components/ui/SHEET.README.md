# Sheet

A modal dialog that slides in from the edge of the screen, commonly used for navigation menus, filters, or secondary content.

## Import

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetOverlay,
  SheetPortal,
} from '@/components/ui/sheet'
```

## Usage

### Basic Sheet

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <h2 className="text-lg font-semibold">Sheet Title</h2>
    <p className="mt-2 text-sm text-muted-foreground">
      Sheet content goes here.
    </p>
  </SheetContent>
</Sheet>
```

### Sheet Sides

```tsx
{/* Slide from right (default) */}
<Sheet>
  <SheetTrigger>Open from Right</SheetTrigger>
  <SheetContent side="right">
    Content from right
  </SheetContent>
</Sheet>

{/* Slide from left */}
<Sheet>
  <SheetTrigger>Open from Left</SheetTrigger>
  <SheetContent side="left">
    Content from left
  </SheetContent>
</Sheet>

{/* Slide from top */}
<Sheet>
  <SheetTrigger>Open from Top</SheetTrigger>
  <SheetContent side="top">
    Content from top
  </SheetContent>
</Sheet>

{/* Slide from bottom */}
<Sheet>
  <SheetTrigger>Open from Bottom</SheetTrigger>
  <SheetContent side="bottom">
    Content from bottom
  </SheetContent>
</Sheet>
```

### Navigation Menu

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="sm">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <nav className="flex flex-col space-y-4">
      <a href="/" className="text-lg font-semibold">
        Home
      </a>
      <a href="/products" className="text-lg">
        Products
      </a>
      <a href="/about" className="text-lg">
        About
      </a>
      <a href="/contact" className="text-lg">
        Contact
      </a>
    </nav>
  </SheetContent>
</Sheet>
```

### Filters Panel

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">
      <Filter className="mr-2 h-4 w-4" />
      Filters
    </Button>
  </SheetTrigger>
  <SheetContent side="right">
    <h2 className="text-lg font-semibold mb-4">Filters</h2>

    <div className="space-y-6">
      <div>
        <Label>Category</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="books">Books</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Price Range</Label>
        <Slider defaultValue={[0, 100]} max={100} step={1} />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Reset
        </Button>
        <Button className="flex-1">Apply</Button>
      </div>
    </div>
  </SheetContent>
</Sheet>
```

### Controlled Sheet

```tsx
'use client'

import { useState } from 'react'

export default function ControlledSheet() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <h2>Controlled Sheet</h2>
          <p>This sheet's state is controlled by React state.</p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </SheetContent>
      </Sheet>
    </>
  )
}
```

### With Top Offset (Below Fixed Header)

```tsx
<Sheet>
  <SheetTrigger>Open Sheet</SheetTrigger>
  <SheetContent side="left" topOffset="64px">
    {/* Sheet appears below a 64px fixed header */}
    <nav className="space-y-4">
      <a href="/dashboard">Dashboard</a>
      <a href="/settings">Settings</a>
    </nav>
  </SheetContent>
</Sheet>
```

## API Reference

### Sheet (Root)

Main container for the sheet component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |

### SheetTrigger

Button that triggers the sheet to open.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props with child element |
| `className` | `string` | - | Additional CSS classes |

### SheetContent

The content container that slides in.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"left" \| "right" \| "top" \| "bottom"` | `"left"` | Side from which sheet slides in |
| `topOffset` | `string` | - | Top offset (e.g., "64px") to avoid fixed headers |
| `className` | `string` | - | Additional CSS classes |

### SheetOverlay

The backdrop overlay behind the sheet.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `topOffset` | `string` | - | Top offset for the overlay |
| `className` | `string` | - | Additional CSS classes |

### SheetClose

Button to close the sheet.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props with child element |

## Styling

### Data Slots

- `data-open` - Present when sheet is open
- `data-closed` - Present when sheet is closed

### Animation

The sheet animates in/out with slide and fade transitions:
- Slide direction matches the `side` prop
- 300ms duration with ease-in-out easing
- Overlay fades in/out simultaneously

### Side-Specific Styles

```css
/* Left */
inset-y-0 left-0 w-[300px]

/* Right */
inset-y-0 right-0 w-[300px]

/* Top */
inset-x-0 top-0 h-[300px]

/* Bottom */
inset-x-0 bottom-0 h-[300px]
```

## Accessibility

### Keyboard Navigation

- `Escape` - Close the sheet
- `Tab` - Cycle through interactive elements
- Focus is trapped within the sheet when open
- Focus returns to trigger on close

### ARIA Attributes

The component automatically handles:
- `role="dialog"` on the sheet content
- `aria-modal="true"` to indicate modal behavior
- Focus management and keyboard trapping
- Proper focus restoration on close

### Screen Reader Support

- Announces "dialog" when sheet opens
- Announces content to screen readers
- Supports `aria-label` and `aria-describedby` for context

## Examples

### Mobile Navigation

```tsx
'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] p-0">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <SheetClose asChild>
            <Button variant="ghost" size="sm">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>

        <nav className="flex flex-col p-4 space-y-4">
          <a href="/" onClick={() => setOpen(false)}>
            Home
          </a>
          <a href="/products" onClick={() => setOpen(false)}>
            Products
          </a>
          <a href="/about" onClick={() => setOpen(false)}>
            About
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

### Shopping Cart

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" className="relative">
      <ShoppingCart className="h-5 w-5" />
      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
        3
      </Badge>
    </Button>
  </SheetTrigger>

  <SheetContent side="right" className="w-[400px]">
    <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>

    <div className="space-y-4">
      {/* Cart items */}
      <div className="flex gap-4 border-b pb-4">
        <img src="/product1.jpg" alt="Product" className="h-16 w-16 rounded" />
        <div className="flex-1">
          <h3 className="font-medium">Product Name</h3>
          <p className="text-sm text-muted-foreground">$29.99</p>
        </div>
        <Button variant="ghost" size="sm">
          Remove
        </Button>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 border-t p-4 bg-background">
      <div className="flex justify-between mb-4">
        <span className="font-semibold">Total:</span>
        <span className="font-semibold">$89.97</span>
      </div>
      <Button className="w-full">Checkout</Button>
    </div>
  </SheetContent>
</Sheet>
```

### User Profile

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
      <Avatar>
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </Button>
  </SheetTrigger>

  <SheetContent side="right">
    <div className="flex items-center gap-4 mb-6">
      <Avatar className="h-16 w-16">
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-semibold">John Doe</h2>
        <p className="text-sm text-muted-foreground">john@example.com</p>
      </div>
    </div>

    <Separator className="my-4" />

    <nav className="flex flex-col space-y-2">
      <Button variant="ghost" className="justify-start">
        <User className="mr-2 h-4 w-4" />
        Profile
      </Button>
      <Button variant="ghost" className="justify-start">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
      <Button variant="ghost" className="justify-start">
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>
    </nav>
  </SheetContent>
</Sheet>
```

### Search Panel

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">
      <Search className="mr-2 h-4 w-4" />
      Search
    </Button>
  </SheetTrigger>

  <SheetContent side="top" className="h-[500px]">
    <div className="mx-auto max-w-2xl">
      <Input
        type="search"
        placeholder="Search..."
        className="mb-6"
        autoFocus
      />

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Recent Searches
        </h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Clock className="mr-2 h-4 w-4" />
            Previous search term
          </Button>
        </div>
      </div>
    </div>
  </SheetContent>
</Sheet>
```

## Common Patterns

### Confirmation Before Close

```tsx
'use client'

import { useState } from 'react'

export default function SheetWithConfirmation() {
  const [open, setOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasChanges) {
      const confirm = window.confirm('You have unsaved changes. Close anyway?')
      if (!confirm) return
    }
    setOpen(newOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {/* Content */}
    </Sheet>
  )
}
```

### Nested Scrolling

```tsx
<SheetContent>
  <div className="flex flex-col h-full">
    {/* Fixed header */}
    <div className="border-b p-4">
      <h2 className="text-lg font-semibold">Title</h2>
    </div>

    {/* Scrollable content */}
    <ScrollArea className="flex-1 p-4">
      {/* Long content */}
    </ScrollArea>

    {/* Fixed footer */}
    <div className="border-t p-4">
      <Button className="w-full">Action</Button>
    </div>
  </div>
</SheetContent>
```

## Best Practices

### Do's

- ✅ Use for supplementary content and actions
- ✅ Provide a close button (X icon) for explicit closing
- ✅ Keep content focused and scannable
- ✅ Use appropriate side based on user flow (left for navigation, right for details)
- ✅ Consider mobile UX - sheets work great on small screens
- ✅ Close sheet automatically after completing an action

### Don'ts

- ❌ Don't use for critical information (use Dialog instead)
- ❌ Don't nest sheets within sheets
- ❌ Don't overload with too much content (consider pagination or Dialog)
- ❌ Don't forget to handle escape key and overlay clicks
- ❌ Don't use for multi-step forms (use Dialog or separate pages)

## Sheet vs Dialog

### Use Sheet When:
- Content is supplementary or secondary
- Navigation or filtering UI
- Mobile-friendly slide-in panels
- Shopping carts, notifications, user profiles
- Content doesn't require user's full attention

### Use Dialog When:
- Critical information or confirmations
- User must complete an action
- Multi-step workflows
- Forms requiring full attention
- Content is the primary focus

## Related Components

- [Dialog](./DIALOG.README.md) - For modal dialogs with centered content
- [Popover](./POPOVER.README.md) - For lightweight popovers
- [Dropdown Menu](./DROPDOWN-MENU.README.md) - For action menus
- [Sidebar](./SIDEBAR.README.md) - For persistent navigation

## Notes

- Built on top of Dialog primitive from Base UI
- Automatically handles focus trapping and restoration
- Overlay backdrop with blur effect
- Smooth slide animations (300ms ease-in-out)
- Works seamlessly with dark mode
- `topOffset` prop useful for apps with fixed headers
- Supports all dialog accessibility features
- Can be controlled or uncontrolled
