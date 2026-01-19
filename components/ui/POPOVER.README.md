# Popover

A floating content container that appears when triggered, perfect for displaying rich content, forms, or additional information.

## Import

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from '@/components/ui/popover'
```

## Usage

### Basic Popover

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>This is a popover content</p>
  </PopoverContent>
</Popover>
```

### With Header

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button>Show Details</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Account Details</PopoverTitle>
      <PopoverDescription>
        View and manage your account information
      </PopoverDescription>
    </PopoverHeader>
    <div className="space-y-2">
      <p className="text-sm">Email: user@example.com</p>
      <p className="text-sm">Status: Active</p>
    </div>
  </PopoverContent>
</Popover>
```

### Different Sides

```tsx
{/* Top */}
<Popover>
  <PopoverTrigger>Top</PopoverTrigger>
  <PopoverContent side="top">
    Content appears above
  </PopoverContent>
</Popover>

{/* Right */}
<Popover>
  <PopoverTrigger>Right</PopoverTrigger>
  <PopoverContent side="right">
    Content appears to the right
  </PopoverContent>
</Popover>

{/* Bottom (default) */}
<Popover>
  <PopoverTrigger>Bottom</PopoverTrigger>
  <PopoverContent side="bottom">
    Content appears below
  </PopoverContent>
</Popover>

{/* Left */}
<Popover>
  <PopoverTrigger>Left</PopoverTrigger>
  <PopoverContent side="left">
    Content appears to the left
  </PopoverContent>
</Popover>
```

### Controlled Popover

```tsx
'use client'

import { useState } from 'react'

export default function ControlledPopover() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Toggle ({open ? 'Open' : 'Closed'})</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Controlled popover content</p>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </PopoverContent>
    </Popover>
  )
}
```

## API Reference

### Popover (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |

### PopoverTrigger

| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Compose with child element |

### PopoverContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side |
| `sideOffset` | `number` | `4` | Distance from trigger (px) |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment relative to trigger |
| `alignOffset` | `number` | `0` | Offset along alignment axis |

### PopoverHeader

Optional container for title and description.

### PopoverTitle

The popover heading.

### PopoverDescription

Supporting text below the title.

## Examples

### User Info Card

```tsx
<Popover>
  <PopoverTrigger asChild>
    <button className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <span>John Doe</span>
    </button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="flex gap-4">
      <Avatar size="lg">
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="font-semibold">John Doe</h4>
        <p className="text-sm text-muted-foreground">
          @johndoe
        </p>
        <p className="text-sm">
          Software engineer passionate about web development
        </p>
      </div>
    </div>
    <Separator className="my-4" />
    <div className="flex gap-4 text-sm">
      <div>
        <span className="font-semibold">1,234</span>
        <span className="text-muted-foreground"> Following</span>
      </div>
      <div>
        <span className="font-semibold">5,678</span>
        <span className="text-muted-foreground"> Followers</span>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

### Quick Actions Menu

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-48 p-0">
    <div className="py-1">
      <button className="w-full px-3 py-2 text-sm text-left hover:bg-muted">
        Edit
      </button>
      <button className="w-full px-3 py-2 text-sm text-left hover:bg-muted">
        Duplicate
      </button>
      <button className="w-full px-3 py-2 text-sm text-left hover:bg-muted">
        Archive
      </button>
      <Separator className="my-1" />
      <button className="w-full px-3 py-2 text-sm text-left text-destructive hover:bg-muted">
        Delete
      </button>
    </div>
  </PopoverContent>
</Popover>
```

### Date Picker

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <Calendar className="mr-2 h-4 w-4" />
      {date ? format(date, 'PPP') : 'Pick a date'}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  </PopoverContent>
</Popover>
```

### Color Picker

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-full justify-start">
      <div
        className="h-4 w-4 rounded mr-2"
        style={{ backgroundColor: color }}
      />
      {color}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-64">
    <PopoverHeader>
      <PopoverTitle>Pick a color</PopoverTitle>
    </PopoverHeader>
    <div className="grid grid-cols-6 gap-2">
      {colors.map((c) => (
        <button
          key={c}
          className="h-8 w-8 rounded hover:scale-110 transition-transform"
          style={{ backgroundColor: c }}
          onClick={() => setColor(c)}
        />
      ))}
    </div>
  </PopoverContent>
</Popover>
```

### Form in Popover

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button>Add Task</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <PopoverHeader>
      <PopoverTitle>Add New Task</PopoverTitle>
      <PopoverDescription>
        Create a new task for your project
      </PopoverDescription>
    </PopoverHeader>
    <form className="space-y-4">
      <Field name="title" label="Title">
        <Input placeholder="Task title" />
      </Field>
      <Field name="description" label="Description">
        <Textarea placeholder="Task description" />
      </Field>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Create
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  </PopoverContent>
</Popover>
```

### Share Dialog

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <PopoverHeader>
      <PopoverTitle>Share this document</PopoverTitle>
      <PopoverDescription>
        Anyone with the link can view this document
      </PopoverDescription>
    </PopoverHeader>
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value="https://example.com/doc/123" readOnly />
        <Button size="sm">Copy</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <MessageCircle className="mr-2 h-4 w-4" />
          Slack
        </Button>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

### Settings Panel

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="sm">
      <Settings className="h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-72">
    <PopoverHeader>
      <PopoverTitle>Display Settings</PopoverTitle>
    </PopoverHeader>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Dark Mode</Label>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <Label>Notifications</Label>
        <Switch defaultChecked />
      </div>
      <Separator />
      <div className="space-y-2">
        <Label>Font Size</Label>
        <Slider defaultValue={[14]} min={12} max={20} step={1} />
      </div>
    </div>
  </PopoverContent>
</Popover>
```

## Common Patterns

### Close on Action

```tsx
'use client'

import { useState } from 'react'

export default function ActionPopover() {
  const [open, setOpen] = useState(false)

  const handleAction = () => {
    // Perform action
    console.log('Action performed')
    // Close popover
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        <Button onClick={handleAction}>
          Confirm Action
        </Button>
      </PopoverContent>
    </Popover>
  )
}
```

### Multiple Popovers

```tsx
<div className="flex gap-2">
  <Popover>
    <PopoverTrigger>Popover 1</PopoverTrigger>
    <PopoverContent>Content 1</PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger>Popover 2</PopoverTrigger>
    <PopoverContent>Content 2</PopoverContent>
  </Popover>
</div>
```

## Best Practices

### Do's
- ✅ Use for rich, interactive content
- ✅ Keep content focused and scannable
- ✅ Provide clear close mechanisms
- ✅ Use appropriate positioning
- ✅ Make trigger clearly clickable

### Don'ts
- ❌ Don't use for critical information (use Dialog)
- ❌ Don't nest popovers
- ❌ Don't make content too wide/tall
- ❌ Don't use for simple text (use Tooltip)
- ❌ Don't forget focus management

## Popover vs Tooltip vs Dialog

### Use Popover When:
- Rich, interactive content
- Forms or actions needed
- Content needs to be read/interacted with
- Multiple interactive elements
- User needs to maintain context

### Use Tooltip When:
- Simple text labels
- Non-interactive content
- Brief explanations
- Hover-only content

### Use Dialog When:
- Critical information
- Must complete before continuing
- Complex multi-step flows
- Requires full user attention

## Accessibility

- Keyboard accessible (Escape to close)
- Focus trapped within popover
- Proper ARIA attributes
- Screen reader support
- Focus returns to trigger on close

## Related Components

- [Tooltip](./TOOLTIP.README.md) - For simple hover text
- [Dialog](./DIALOG.README.md) - For modal interactions
- [Dropdown Menu](./DROPDOWN-MENU.README.md) - For action menus

## Notes

- Automatically positions to stay in viewport
- Smooth fade and zoom animations
- Click outside to close
- Works with keyboard (Escape closes)
- Default width: 288px (w-72)
- Built on Base UI primitives
