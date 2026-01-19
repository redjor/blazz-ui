# Scroll Area

A customizable scrollable area with styled scrollbars that work consistently across browsers.

## Import

```tsx
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
```

## Usage

### Basic Scroll Area

```tsx
<ScrollArea className="h-72 w-48 rounded-md border p-4">
  <div className="space-y-2">
    {Array.from({ length: 50 }).map((_, i) => (
      <div key={i} className="text-sm">
        Item {i + 1}
      </div>
    ))}
  </div>
</ScrollArea>
```

### Horizontal Scrolling

```tsx
<ScrollArea className="w-96 whitespace-nowrap rounded-md border">
  <div className="flex w-max space-x-4 p-4">
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={i} className="h-24 w-24 shrink-0 rounded-md border" />
    ))}
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

### Both Directions

```tsx
<ScrollArea className="h-72 w-96 rounded-md border">
  <div className="p-4" style={{ width: '800px', height: '600px' }}>
    {/* Large content */}
  </div>
  <ScrollBar orientation="vertical" />
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

### Image Gallery

```tsx
<ScrollArea className="w-96 whitespace-nowrap rounded-md border">
  <div className="flex w-max space-x-4 p-4">
    {images.map((img) => (
      <img
        key={img.id}
        src={img.url}
        alt={img.alt}
        className="h-48 w-auto rounded-md"
      />
    ))}
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

## API Reference

### ScrollArea

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `children` | `ReactNode` | Scrollable content |

### ScrollBar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Scrollbar orientation |

## Styling

- `data-slot="scroll-area"` - Root container
- `data-slot="scroll-area-viewport"` - Scrollable viewport
- `data-slot="scroll-area-scrollbar"` - Scrollbar track
- `data-slot="scroll-area-thumb"` - Scrollbar thumb

## Examples

### Code Block

```tsx
<ScrollArea className="h-96 rounded-lg border bg-muted/50">
  <pre className="p-4">
    <code>{longCodeSnippet}</code>
  </pre>
</ScrollArea>
```

### Sidebar Navigation

```tsx
<ScrollArea className="h-[calc(100vh-4rem)]">
  <nav className="space-y-2 p-4">
    {navItems.map((item) => (
      <a key={item.href} href={item.href} className="block p-2">
        {item.label}
      </a>
    ))}
  </nav>
</ScrollArea>
```

### Chat Messages

```tsx
<ScrollArea className="h-96 rounded-md border p-4">
  <div className="space-y-4">
    {messages.map((msg) => (
      <div key={msg.id} className="flex gap-3">
        <Avatar>
          <AvatarImage src={msg.avatar} />
        </Avatar>
        <div>
          <p className="font-medium">{msg.author}</p>
          <p className="text-sm text-muted-foreground">{msg.text}</p>
        </div>
      </div>
    ))}
  </div>
</ScrollArea>
```

## Accessibility

- Keyboard navigable (arrow keys, page up/down)
- Focus visible on viewport
- Native scrolling behavior
- Screen reader accessible

## Best Practices

### Do's
- ✅ Set explicit height/width
- ✅ Use for constrained content areas
- ✅ Show ScrollBar for horizontal scroll
- ✅ Test with keyboard navigation

### Don'ts
- ❌ Don't nest scroll areas
- ❌ Don't use for page-level scrolling
- ❌ Don't forget to set container dimensions

## Related Components

- [Sheet](./SHEET.README.md) - Often contains scroll areas
- [Dialog](./DIALOG.README.md) - May need scroll areas for long content

## Notes

- Custom scrollbars work across all browsers
- Automatically hides scrollbars when not needed
- Smooth scrolling behavior
- Works with touch devices
