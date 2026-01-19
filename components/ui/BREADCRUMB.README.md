# Breadcrumb

Displays the path to the current resource using a hierarchy of links.

## Import

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb'
```

## Usage

### Basic Breadcrumb

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Product Name</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Next.js Link

```tsx
import Link from 'next/link'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/">Home</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Ellipsis (Collapsed Items)

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Details</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Custom Separator

```tsx
import { Slash } from 'lucide-react'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <Slash />
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbPage>Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Dropdown Menu

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1">
          <BreadcrumbEllipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>
            <Link href="/docs">Documentation</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/components">Components</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/examples">Examples</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## API Reference

### Breadcrumb (Root)

Container for the breadcrumb navigation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `separator` | `ReactNode` | - | Custom separator element |

### BreadcrumbList

Ordered list container for breadcrumb items.

### BreadcrumbItem

Individual breadcrumb item container.

### BreadcrumbLink

Link for navigable breadcrumb items.

| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Compose with child element (for Next.js Link) |
| `href` | `string` | Link destination |

### BreadcrumbPage

Current page indicator (non-clickable).

| Prop | Type | Description |
|------|------|-------------|
| `aria-current` | `"page"` | Automatically set to indicate current page |

### BreadcrumbSeparator

Visual separator between breadcrumb items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `<ChevronRight />` | Custom separator icon |

### BreadcrumbEllipsis

Ellipsis indicator for collapsed items.

## Examples

### Responsive Breadcrumb

```tsx
'use client'

import { useMediaQuery } from '@/hooks/use-media-query'

export default function ResponsiveBreadcrumb() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {!isDesktop && (
          <>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {isDesktop && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products/category">Category</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage>Product Name</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

### Dynamic Breadcrumb from URL

```tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function DynamicBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          const label = segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

## Accessibility

- Uses semantic `<nav>` element with `aria-label="breadcrumb"`
- Current page marked with `aria-current="page"`
- Separators hidden from screen readers with `aria-hidden="true"`
- Keyboard navigable links
- Maintains logical tab order

## Best Practices

### Do's
- ✅ Always include Home/root as first item
- ✅ Current page should not be a link
- ✅ Use concise, clear labels
- ✅ Collapse middle items on mobile
- ✅ Maintain hierarchy (parent > child > grandchild)

### Don'ts
- ❌ Don't use for flat navigation
- ❌ Don't make current page clickable
- ❌ Don't use more than 7 levels
- ❌ Don't use as primary navigation

## Related Components

- [Separator](./SEPARATOR.README.md) - For visual dividers
- [Pagination](./PAGINATION.README.md) - For paginated navigation

## Notes

- Default separator is ChevronRight icon
- Current page is bold and not clickable
- Responsive and wraps on small screens
- Works with all routing libraries
