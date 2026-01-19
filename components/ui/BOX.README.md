# Box

A polymorphic layout primitive component with utility variants for padding, background, borders, and shadows.

## Import

```tsx
import { Box } from '@/components/ui/box'
```

## Usage

### Basic Box

```tsx
<Box>Content</Box>
```

### With Padding

```tsx
<Box padding="4">Content with padding</Box>
<Box padding="6">More padding</Box>
<Box padding="8">Even more padding</Box>
```

### With Background

```tsx
<Box background="white">White background</Box>
<Box background="muted">Muted background</Box>
<Box background="accent">Accent background</Box>
```

### With Border

```tsx
<Box border="default" borderRadius="md" padding="4">
  Box with border
</Box>
```

### With Shadow

```tsx
<Box shadow="sm" padding="4">
  Box with small shadow
</Box>
<Box shadow="md" padding="4">
  Box with medium shadow
</Box>
<Box shadow="lg" padding="4">
  Box with large shadow
</Box>
```

### As Different Element

```tsx
{/* As section */}
<Box as="section" padding="4">
  Section content
</Box>

{/* As article */}
<Box as="article" padding="4">
  Article content
</Box>

{/* As button */}
<Box
  as="button"
  padding="4"
  onClick={() => console.log('clicked')}
>
  Clickable box
</Box>
```

### Combined Variants

```tsx
<Box
  padding="6"
  background="white"
  border="default"
  borderRadius="lg"
  shadow="md"
>
  Styled box with multiple variants
</Box>
```

## API Reference

### Box

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `"div"` | Element type to render |
| `padding` | `"0" \| "2" \| "4" \| "6" \| "8"` | `"0"` | Padding size |
| `background` | `"transparent" \| "white" \| "muted" \| "accent"` | `"transparent"` | Background color |
| `border` | `"none" \| "default"` | `"none"` | Border style |
| `borderRadius` | `"none" \| "sm" \| "md" \| "lg" \| "xl"` | `"none"` | Border radius size |
| `shadow` | `"none" \| "sm" \| "md" \| "lg"` | `"none"` | Box shadow size |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Box content |

## Examples

### Card Alternative

```tsx
<Box
  padding="6"
  background="white"
  border="default"
  borderRadius="lg"
  shadow="sm"
>
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-muted-foreground">Card description text</p>
</Box>
```

### Section Container

```tsx
<Box
  as="section"
  padding="8"
  background="muted"
  borderRadius="xl"
>
  <h2 className="text-2xl font-bold mb-4">Section Title</h2>
  <p>Section content goes here</p>
</Box>
```

### Sidebar Panel

```tsx
<Box
  as="aside"
  padding="4"
  background="white"
  border="default"
  shadow="md"
  className="h-full"
>
  <nav>
    <ul>
      <li>Menu Item 1</li>
      <li>Menu Item 2</li>
    </ul>
  </nav>
</Box>
```

### Message Box

```tsx
<Box
  padding="4"
  background="accent"
  borderRadius="md"
  className="flex items-center gap-2"
>
  <Info className="h-4 w-4" />
  <p>This is an informational message</p>
</Box>
```

### Grid Item

```tsx
<div className="grid grid-cols-3 gap-4">
  <Box padding="4" background="white" border="default" borderRadius="md">
    Item 1
  </Box>
  <Box padding="4" background="white" border="default" borderRadius="md">
    Item 2
  </Box>
  <Box padding="4" background="white" border="default" borderRadius="md">
    Item 3
  </Box>
</div>
```

### Hero Section

```tsx
<Box
  as="section"
  padding="8"
  background="accent"
  borderRadius="xl"
  className="text-center"
>
  <h1 className="text-4xl font-bold mb-4">Welcome</h1>
  <p className="text-lg text-muted-foreground">Get started with our platform</p>
  <Button className="mt-6">Get Started</Button>
</Box>
```

### Feature Box

```tsx
<Box
  padding="6"
  background="white"
  border="default"
  borderRadius="lg"
  shadow="sm"
  className="hover:shadow-md transition-shadow"
>
  <div className="flex items-center gap-4">
    <div className="p-3 bg-primary rounded-lg">
      <Star className="h-6 w-6 text-primary-foreground" />
    </div>
    <div>
      <h3 className="font-semibold">Feature Title</h3>
      <p className="text-sm text-muted-foreground">Feature description</p>
    </div>
  </div>
</Box>
```

### Alert Box

```tsx
<Box
  padding="4"
  background="white"
  border="default"
  borderRadius="md"
  className="border-l-4 border-l-yellow-500"
>
  <div className="flex gap-3">
    <AlertTriangle className="h-5 w-5 text-yellow-500" />
    <div>
      <h4 className="font-semibold">Warning</h4>
      <p className="text-sm text-muted-foreground">
        Please review this information carefully
      </p>
    </div>
  </div>
</Box>
```

### Stat Card

```tsx
<Box
  padding="6"
  background="white"
  border="default"
  borderRadius="lg"
  shadow="sm"
>
  <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
  <p className="text-3xl font-bold">$45,231</p>
  <p className="text-sm text-green-600 mt-2">+12% from last month</p>
</Box>
```

### Interactive Box (Button-like)

```tsx
<Box
  as="button"
  padding="4"
  background="white"
  border="default"
  borderRadius="md"
  shadow="sm"
  className="hover:shadow-md hover:border-primary transition-all cursor-pointer w-full text-left"
  onClick={() => console.log('clicked')}
>
  <h4 className="font-semibold">Click me</h4>
  <p className="text-sm text-muted-foreground">This box is clickable</p>
</Box>
```

### Dashboard Widget

```tsx
<Box
  padding="6"
  background="white"
  border="default"
  borderRadius="lg"
  shadow="md"
>
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold">Active Users</h3>
    <Badge>Live</Badge>
  </div>
  <p className="text-4xl font-bold mb-2">1,234</p>
  <p className="text-sm text-muted-foreground">+18% from yesterday</p>
</Box>
```

## Common Patterns

### Responsive Padding

```tsx
<Box padding="4" className="md:p-6 lg:p-8">
  Responsive padding using className
</Box>
```

### Conditional Background

```tsx
<Box
  padding="4"
  background={isActive ? 'accent' : 'white'}
  border="default"
  borderRadius="md"
>
  Conditional background
</Box>
```

### Link Box

```tsx
<Box
  as="a"
  href="/page"
  padding="4"
  background="white"
  border="default"
  borderRadius="md"
  className="hover:shadow-md transition-shadow block"
>
  <h4 className="font-semibold">Link to page</h4>
  <p className="text-sm text-muted-foreground">Click to navigate</p>
</Box>
```

## Best Practices

### Do's
- ✅ Use Box for layout and spacing
- ✅ Compose with other components
- ✅ Use `as` prop for semantic HTML
- ✅ Combine variants for complex styling
- ✅ Extend with className when needed

### Don'ts
- ❌ Don't use for everything (overuse)
- ❌ Don't replace semantic components
- ❌ Don't forget accessibility with `as` prop
- ❌ Don't overload with too many variants
- ❌ Don't use when Card/Alert is more appropriate

## Box vs Card vs Alert

### Use Box When:
- Simple layout container
- Need polymorphic element
- Custom styling needed
- Quick prototyping
- Utility-first approach

### Use Card When:
- Structured content
- Predefined sections (header, content, footer)
- Standard card pattern
- Semantic card meaning

### Use Alert When:
- User notifications
- Status messages
- Warnings/errors
- Specific alert semantics

## Accessibility

- Use semantic HTML with `as` prop
- Ensure proper heading hierarchy
- Add ARIA labels when needed
- Keyboard accessible if interactive
- Focus visible for buttons/links
- Screen reader friendly content

## Related Components

- [Card](./CARD.README.md) - Structured card component
- [Alert](./ALERT.README.md) - Notification component
- [Page](./PAGE.README.md) - Page layout component

## Notes

- Polymorphic component (can render as any HTML element)
- Uses CVA for variant management
- Composable with Tailwind classes
- Type-safe with TypeScript
- Forwardable ref support
- Works seamlessly in dark mode
- Utility-first approach
- Minimal abstraction
- Flexible and extensible
