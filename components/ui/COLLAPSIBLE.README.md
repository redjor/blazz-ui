# Collapsible

An interactive component that can be expanded and collapsed to show or hide content.

## Import

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
```

## Usage

### Basic Collapsible

```tsx
<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">Toggle</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="space-y-2 p-4">
      <p>This content can be collapsed</p>
    </div>
  </CollapsibleContent>
</Collapsible>
```

### With Icon Indicator

```tsx
'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function CollapsibleWithIcon() {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <span>Show details</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4">Content here</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

### FAQ Item

```tsx
<Collapsible className="border-b">
  <CollapsibleTrigger className="flex w-full items-center justify-between py-4 text-left">
    <h3 className="font-medium">What is Blazz UI?</h3>
    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="pb-4 text-sm text-muted-foreground">
      Blazz UI is a production-ready React component library built with Next.js and Tailwind CSS.
    </div>
  </CollapsibleContent>
</Collapsible>
```

### Multiple Collapsibles (Controlled)

```tsx
'use client'

import { useState } from 'react'

export default function MultipleCollapsibles() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const items = [
    { title: 'Section 1', content: 'Content 1' },
    { title: 'Section 2', content: 'Content 2' },
    { title: 'Section 3', content: 'Content 3' },
  ]

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <Collapsible
          key={index}
          open={openIndex === index}
          onOpenChange={(open) => setOpenIndex(open ? index : null)}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {item.title}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 border-x border-b rounded-b-lg">
              {item.content}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
```

## API Reference

### Collapsible (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `disabled` | `boolean` | `false` | Whether collapsible is disabled |

### CollapsibleTrigger

Button that toggles the collapsible.

| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Compose with child element |

### CollapsibleContent

The content that expands and collapses.

## Examples

### Sidebar Section

```tsx
<div className="space-y-2">
  <Collapsible defaultOpen>
    <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted rounded-md">
      <span className="font-medium">Projects</span>
      <ChevronDown className="h-4 w-4" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="pl-4 space-y-1">
        <a href="/project-1" className="block p-2 text-sm hover:bg-muted rounded-md">
          Project 1
        </a>
        <a href="/project-2" className="block p-2 text-sm hover:bg-muted rounded-md">
          Project 2
        </a>
      </div>
    </CollapsibleContent>
  </Collapsible>
</div>
```

### Settings Panel

```tsx
<Card>
  <CardHeader>
    <CardTitle>Advanced Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          Show advanced options
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4 pt-4">
          <Field name="option1" label="Option 1">
            <Input />
          </Field>
          <Field name="option2" label="Option 2">
            <Switch />
          </Field>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </CardContent>
</Card>
```

## Accessibility

- Uses semantic HTML
- Keyboard accessible (Space/Enter to toggle)
- Proper ARIA attributes automatically applied
- Focus management
- Smooth animations

## Best Practices

### Do's
- ✅ Use for progressive disclosure
- ✅ Provide clear trigger labels
- ✅ Add visual indicators (icons)
- ✅ Keep content related to trigger

### Don'ts
- ❌ Don't nest too deeply
- ❌ Don't hide critical information
- ❌ Don't use for navigation
- ❌ Don't make triggers unclear

## Collapsible vs Accordion

- **Collapsible**: Independent expand/collapse
- **Accordion**: Only one item open at a time

## Related Components

- [Accordion](./ACCORDION.README.md) - For mutually exclusive sections
- [Tabs](./TABS.README.md) - For switching between views

## Notes

- Smooth expand/collapse animations
- Can be controlled or uncontrolled
- Works with any trigger element via asChild
- Built on Base UI primitives
