# Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Import

```tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
```

## Usage

### Basic Tooltip

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>This is a tooltip</p>
  </TooltipContent>
</Tooltip>
```

### With Icon

```tsx
import { Info } from 'lucide-react'

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="sm">
      <Info className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Additional information</p>
  </TooltipContent>
</Tooltip>
```

### Different Sides

```tsx
{/* Top (default) */}
<Tooltip>
  <TooltipTrigger>Top</TooltipTrigger>
  <TooltipContent side="top">
    Tooltip on top
  </TooltipContent>
</Tooltip>

{/* Bottom */}
<Tooltip>
  <TooltipTrigger>Bottom</TooltipTrigger>
  <TooltipContent side="bottom">
    Tooltip on bottom
  </TooltipContent>
</Tooltip>

{/* Left */}
<Tooltip>
  <TooltipTrigger>Left</TooltipTrigger>
  <TooltipContent side="left">
    Tooltip on left
  </TooltipContent>
</Tooltip>

{/* Right */}
<Tooltip>
  <TooltipTrigger>Right</TooltipTrigger>
  <TooltipContent side="right">
    Tooltip on right
  </TooltipContent>
</Tooltip>
```

### With Custom Delay

```tsx
<TooltipProvider delay={500}>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      Appears after 500ms delay
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Alignment

```tsx
{/* Start alignment */}
<Tooltip>
  <TooltipTrigger>Start aligned</TooltipTrigger>
  <TooltipContent align="start">
    Aligned to start
  </TooltipContent>
</Tooltip>

{/* Center (default) */}
<Tooltip>
  <TooltipTrigger>Center aligned</TooltipTrigger>
  <TooltipContent align="center">
    Aligned to center
  </TooltipContent>
</Tooltip>

{/* End alignment */}
<Tooltip>
  <TooltipTrigger>End aligned</TooltipTrigger>
  <TooltipContent align="end">
    Aligned to end
  </TooltipContent>
</Tooltip>
```

## API Reference

### Tooltip (Root)

Automatically wraps with TooltipProvider. For custom delay, use TooltipProvider manually.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |

### TooltipProvider

Optional wrapper to configure multiple tooltips.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delay` | `number` | `0` | Delay in ms before tooltip appears |

### TooltipTrigger

Element that triggers the tooltip.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props with child element |

### TooltipContent

The tooltip content that appears.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Preferred side of the trigger |
| `sideOffset` | `number` | `4` | Distance in pixels from the trigger |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment relative to trigger |
| `alignOffset` | `number` | `0` | Offset in pixels along alignment axis |
| `className` | `string` | - | Additional CSS classes |

## Styling

### Data Slots

- `data-slot="tooltip"` - Root tooltip
- `data-slot="tooltip-trigger"` - Trigger element
- `data-slot="tooltip-content"` - Content popup
- `data-slot="tooltip-provider"` - Provider wrapper

### States

- `data-open` - Present when tooltip is open
- `data-closed` - Present when tooltip is closed
- `data-[side=...]` - Indicates which side the tooltip appears on

### Custom Styling

```tsx
<TooltipContent className="bg-primary text-primary-foreground">
  Custom styled tooltip
</TooltipContent>
```

## Accessibility

### Keyboard Navigation

- `Tab` - Focuses the trigger element
- Tooltip appears on focus automatically
- `Escape` - Dismisses the tooltip
- Tooltip dismissed when focus moves away

### ARIA Attributes

The component automatically handles:
- `role="tooltip"` on the content
- `aria-describedby` linking trigger to content
- Proper focus management
- Screen reader announcements

### Best Practices for Accessibility

- Don't hide critical information in tooltips
- Keep tooltip text concise
- Don't use tooltips on disabled elements (they don't receive focus)
- Ensure tooltip text is readable at all zoom levels

## Examples

### Icon Buttons with Tooltips

```tsx
import { Copy, Download, Share, Trash } from 'lucide-react'

<div className="flex gap-2">
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="sm">
        <Copy className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Copy</TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="sm">
        <Download className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Download</TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="sm">
        <Share className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Share</TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="sm">
        <Trash className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Delete</TooltipContent>
  </Tooltip>
</div>
```

### Truncated Text with Tooltip

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <p className="max-w-[200px] truncate cursor-help">
      This is a very long text that will be truncated
    </p>
  </TooltipTrigger>
  <TooltipContent>
    <p className="max-w-xs">
      This is a very long text that will be truncated
    </p>
  </TooltipContent>
</Tooltip>
```

### Form Field Help

```tsx
<Field name="email" label="Email">
  <div className="flex items-center gap-2">
    <Input type="email" />
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" type="button">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>We'll never share your email with anyone else.</p>
      </TooltipContent>
    </Tooltip>
  </div>
</Field>
```

### Status Indicators

```tsx
<div className="flex items-center gap-2">
  <span>Server Status:</span>
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="h-3 w-3 rounded-full bg-green-500 cursor-help" />
    </TooltipTrigger>
    <TooltipContent>
      <p>All systems operational</p>
      <p className="text-xs text-muted-foreground mt-1">
        Last checked: 2 minutes ago
      </p>
    </TooltipContent>
  </Tooltip>
</div>
```

### DataTable Column Headers

```tsx
<th>
  <div className="flex items-center gap-2">
    <span>Revenue</span>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        Total revenue calculated from completed orders,
        excluding refunds and discounts.
      </TooltipContent>
    </Tooltip>
  </div>
</th>
```

### Keyboard Shortcuts

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost">
      Save
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <div className="flex items-center gap-2">
      <span>Save changes</span>
      <kbd className="px-2 py-1 text-xs rounded bg-muted">⌘S</kbd>
    </div>
  </TooltipContent>
</Tooltip>
```

### Multi-line Content

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Badge variant="secondary">Beta</Badge>
  </TooltipTrigger>
  <TooltipContent className="max-w-xs">
    <p className="font-semibold mb-1">Beta Feature</p>
    <p className="text-xs">
      This feature is currently in beta. We're still working on
      improvements and gathering feedback.
    </p>
    <p className="text-xs mt-2">
      <a href="/feedback" className="underline">
        Send feedback
      </a>
    </p>
  </TooltipContent>
</Tooltip>
```

## Common Patterns

### Conditional Tooltip

Only show tooltip when needed:

```tsx
function ConditionalTooltip({ text, maxLength = 20 }) {
  const isTruncated = text.length > maxLength
  const displayText = isTruncated ? text.slice(0, maxLength) + '...' : text

  if (!isTruncated) {
    return <span>{text}</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{displayText}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
```

### Multiple Tooltips with Shared Delay

```tsx
<TooltipProvider delay={200}>
  <div className="flex gap-2">
    <Tooltip>
      <TooltipTrigger>Button 1</TooltipTrigger>
      <TooltipContent>Tooltip 1</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Button 2</TooltipTrigger>
      <TooltipContent>Tooltip 2</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Button 3</TooltipTrigger>
      <TooltipContent>Tooltip 3</TooltipContent>
    </Tooltip>
  </div>
</TooltipProvider>
```

## Best Practices

### Do's

- ✅ Use for supplementary information and labels
- ✅ Keep content brief (1-2 sentences max)
- ✅ Use on icon-only buttons to provide labels
- ✅ Show full text for truncated content
- ✅ Position to avoid covering related content
- ✅ Use consistent delay across the application

### Don'ts

- ❌ Don't use for critical information (use visible labels)
- ❌ Don't put interactive elements inside tooltips
- ❌ Don't use on disabled elements (they can't receive focus)
- ❌ Don't hide essential instructions in tooltips
- ❌ Don't use for long-form content (use Popover or Dialog)
- ❌ Don't rely solely on tooltips for mobile (no hover state)

## Tooltip vs Popover

### Use Tooltip When:
- Displaying supplementary information
- Labeling icon-only buttons
- Showing full text for truncated content
- Content is purely informational
- Content is 1-2 short sentences

### Use Popover When:
- Content needs to be interactive
- Displaying rich content (formatted text, images)
- Content is more than 2-3 sentences
- User needs to copy content
- Need explicit open/close behavior

## Mobile Considerations

Tooltips rely on hover, which doesn't exist on touch devices:

- On icon buttons: Consider adding visible labels or using a different pattern
- For truncated text: Consider using a tap-to-expand or dialog pattern
- For help text: Consider always-visible help text or info buttons that open popovers

## Related Components

- [Popover](./POPOVER.README.md) - For interactive floating content
- [Button](./BUTTON.README.md) - Often used as tooltip triggers
- [Dialog](./DIALOG.README.md) - For important information requiring user attention

## Notes

- Tooltips automatically appear on hover (mouse) and focus (keyboard)
- Arrow pointer automatically adjusts based on position
- Tooltip repositions automatically to stay in viewport
- Smooth fade and zoom animations
- Works seamlessly in dark mode
- Built on Base UI primitives for robust accessibility
- Maximum width: 320px (can be customized with className)
- Default background: `foreground` color with inverted text
