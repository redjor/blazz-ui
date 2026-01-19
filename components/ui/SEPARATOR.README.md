# Separator

A visual separator that divides content sections with a horizontal or vertical line.

## Import

```tsx
import { Separator } from '@/components/ui/separator'
```

## Usage

### Basic Horizontal Separator

```tsx
<div>
  <div className="space-y-1">
    <h4 className="text-sm font-medium">Section Title</h4>
    <p className="text-sm text-muted-foreground">
      Section description goes here.
    </p>
  </div>
  <Separator className="my-4" />
  <div className="space-y-1">
    <h4 className="text-sm font-medium">Another Section</h4>
    <p className="text-sm text-muted-foreground">
      More content here.
    </p>
  </div>
</div>
```

### Vertical Separator

```tsx
<div className="flex h-5 items-center space-x-4 text-sm">
  <div>First item</div>
  <Separator orientation="vertical" />
  <div>Second item</div>
  <Separator orientation="vertical" />
  <div>Third item</div>
</div>
```

### In Navigation

```tsx
<nav className="flex items-center space-x-4">
  <a href="/">Home</a>
  <Separator orientation="vertical" className="h-4" />
  <a href="/about">About</a>
  <Separator orientation="vertical" className="h-4" />
  <a href="/contact">Contact</a>
</nav>
```

### In Card Footer

```tsx
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Your settings content</p>
  </CardContent>
  <Separator />
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Custom Styling

```tsx
{/* Thicker separator */}
<Separator className="my-4 h-[2px]" />

{/* Colored separator */}
<Separator className="my-4 bg-primary" />

{/* Dashed separator */}
<Separator className="my-4 border-dashed border-t" />

{/* With gradient */}
<Separator className="my-4 bg-gradient-to-r from-transparent via-border to-transparent" />
```

## API Reference

### Separator

Extends `@base-ui/react/separator` props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | The orientation of the separator |
| `className` | `string` | - | Additional CSS classes |

## Styling

The separator uses the `data-slot="separator"` attribute for targeted styling.

### CSS Variables Used

- `--border` - Default separator color

### Default Classes

```css
/* Base styles */
bg-border shrink-0

/* Horizontal (default) */
data-[orientation=horizontal]:h-px
data-[orientation=horizontal]:w-full

/* Vertical */
data-[orientation=vertical]:w-px
data-[orientation=vertical]:self-stretch
```

## Accessibility

The Separator component automatically handles ARIA attributes:

- Uses `role="separator"` (provided by Base UI)
- Sets `aria-orientation` based on orientation prop
- Properly announces to screen readers as a content divider

### Semantic HTML

The separator is a semantic element that helps screen readers understand content structure. It's preferable to purely decorative borders.

## Examples

### Form Section Dividers

```tsx
<form>
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Personal Information</h3>
    <Input label="Name" />
    <Input label="Email" />
  </div>

  <Separator className="my-6" />

  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Address</h3>
    <Input label="Street" />
    <Input label="City" />
  </div>
</form>
```

### Sidebar Navigation

```tsx
<aside className="w-64 border-r">
  <nav className="space-y-2 p-4">
    <a href="/dashboard">Dashboard</a>
    <a href="/projects">Projects</a>
    <a href="/tasks">Tasks</a>
  </nav>

  <Separator />

  <nav className="space-y-2 p-4">
    <a href="/settings">Settings</a>
    <a href="/help">Help</a>
  </nav>
</aside>
```

### Breadcrumb Dividers

```tsx
<nav className="flex items-center space-x-2 text-sm">
  <a href="/">Home</a>
  <Separator orientation="vertical" className="h-4" />
  <a href="/products">Products</a>
  <Separator orientation="vertical" className="h-4" />
  <span className="text-muted-foreground">Details</span>
</nav>
```

### Stats Cards

```tsx
<div className="grid gap-4 md:grid-cols-3">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
    </CardHeader>
    <Separator />
    <CardContent className="pt-4">
      <div className="text-2xl font-bold">$45,231</div>
    </CardContent>
  </Card>

  {/* More cards... */}
</div>
```

## Common Patterns

### List Group Separators

```tsx
<ul className="space-y-0">
  <li className="p-4">Item 1</li>
  <Separator />
  <li className="p-4">Item 2</li>
  <Separator />
  <li className="p-4">Item 3</li>
</ul>
```

### Toolbar Dividers

```tsx
<div className="flex items-center space-x-2">
  <Button variant="ghost" size="sm">
    <Bold className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm">
    <Italic className="h-4 w-4" />
  </Button>

  <Separator orientation="vertical" className="h-6" />

  <Button variant="ghost" size="sm">
    <Link className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm">
    <Image className="h-4 w-4" />
  </Button>
</div>
```

## Best Practices

### Do's

- ✅ Use semantic separators instead of decorative borders for accessibility
- ✅ Provide adequate spacing (margin) around separators
- ✅ Use vertical separators in horizontal layouts (flex rows)
- ✅ Use horizontal separators in vertical layouts (stacked content)
- ✅ Keep separator styling subtle and consistent with your design system

### Don'ts

- ❌ Don't use separators for every small grouping (can become cluttered)
- ❌ Don't make separators too thick or prominent unless intentional
- ❌ Don't use separators as clickable elements (not interactive)
- ❌ Don't mix separator orientations inconsistently

## Related Components

- [Card](./CARD.README.md) - Often used with separators in headers/footers
- [Breadcrumb](./BREADCRUMB.README.md) - Uses separators between navigation items
- [Sidebar](./SIDEBAR.README.md) - Uses separators to divide navigation sections

## Notes

- The Separator is purely presentational and not interactive
- It uses Base UI primitives for proper semantic HTML and accessibility
- Automatically adapts to dark mode through the `border` CSS variable
- Can be styled with any Tailwind utility classes
- Self-stretches in flex containers when orientation is vertical
