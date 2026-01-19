# Skeleton

A placeholder component that displays a loading state while content is being fetched.

## Import

```tsx
import { Skeleton } from '@/components/ui/skeleton'
```

## Usage

### Basic Skeleton

```tsx
<Skeleton className="h-4 w-full" />
```

### Multiple Lines

```tsx
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-4/5" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

### Card Skeleton

```tsx
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-4 w-2/3 mt-2" />
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </CardContent>
</Card>
```

### Avatar Skeleton

```tsx
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[150px]" />
  </div>
</div>
```

## API Reference

### Skeleton

Extends `React.ComponentProps<"div">`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes for custom sizing and shape |

## Styling

### Data Slot

- `data-slot="skeleton"` - Main skeleton element

### Default Classes

```css
bg-muted
rounded-md
animate-pulse
```

### Custom Shapes

```tsx
{/* Rectangle (default) */}
<Skeleton className="h-32 w-full" />

{/* Circle */}
<Skeleton className="h-16 w-16 rounded-full" />

{/* Square */}
<Skeleton className="h-16 w-16" />

{/* Pill */}
<Skeleton className="h-8 w-24 rounded-full" />
```

## Examples

### List Loading State

```tsx
<div className="space-y-4">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  ))}
</div>
```

### Profile Loading State

```tsx
<div className="space-y-6">
  {/* Header */}
  <div className="flex items-start space-x-4">
    <Skeleton className="h-24 w-24 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    ))}
  </div>

  {/* Content */}
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
  </div>
</div>
```

### Table Loading State

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead><Skeleton className="h-4 w-24" /></TableHead>
      <TableHead><Skeleton className="h-4 w-32" /></TableHead>
      <TableHead><Skeleton className="h-4 w-20" /></TableHead>
      <TableHead><Skeleton className="h-4 w-16" /></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Dashboard Loading State

```tsx
<div className="space-y-6">
  {/* Stats Cards */}
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>

  {/* Chart */}
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[350px] w-full" />
    </CardContent>
  </Card>
</div>
```

### Blog Post Loading State

```tsx
<article className="space-y-4">
  {/* Hero image */}
  <Skeleton className="h-64 w-full rounded-lg" />

  {/* Title and meta */}
  <div className="space-y-2">
    <Skeleton className="h-8 w-3/4" />
    <div className="flex items-center gap-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>

  {/* Content */}
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    ))}
  </div>
</article>
```

### Form Loading State

```tsx
<form className="space-y-6">
  {Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  ))}

  <div className="flex gap-4">
    <Skeleton className="h-10 w-24" />
    <Skeleton className="h-10 w-24" />
  </div>
</form>
```

## Common Patterns

### Conditional Loading

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser(userId).then((data) => {
      setUser(data)
      setLoading(false)
    })
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={user.avatar} />
      </Avatar>
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )
}
```

### Reusable Skeleton Component

```tsx
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  )
}

// Usage
<div className="grid gap-4 md:grid-cols-3">
  {loading ? (
    Array.from({ length: 3 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))
  ) : (
    data.map((item) => (
      <Card key={item.id}>
        {/* Card content */}
      </Card>
    ))
  )}
</div>
```

### Skeleton with Suspense (React 18+)

```tsx
import { Suspense } from 'react'

function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  )
}

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails />
    </Suspense>
  )
}
```

## Best Practices

### Do's

- ✅ Match skeleton shape to actual content layout
- ✅ Use similar sizing to real content
- ✅ Group skeletons to represent logical content sections
- ✅ Maintain proper spacing between skeleton elements
- ✅ Use rounded corners for circular elements (avatars)
- ✅ Keep animation subtle (pulse is default)

### Don'ts

- ❌ Don't make skeletons too different from real content
- ❌ Don't overuse - sometimes a simple spinner is better
- ❌ Don't animate individual skeletons differently
- ❌ Don't forget to remove skeletons after loading
- ❌ Don't use for very short loading times (< 200ms)
- ❌ Don't block user interaction if some content is already available

## Accessibility

- Skeleton states are purely visual
- No ARIA attributes needed (not interactive)
- Content should be hidden from screen readers during skeleton state
- Announce actual content when it loads

### With aria-live

```tsx
<div aria-live="polite" aria-busy={loading}>
  {loading ? (
    <Skeleton className="h-4 w-full" />
  ) : (
    <p>{content}</p>
  )}
</div>
```

## Performance Considerations

### Avoid Too Many Skeletons

```tsx
{/* Bad: Too many individual skeletons */}
{Array.from({ length: 100 }).map((_, i) => (
  <Skeleton key={i} />
))}

{/* Good: Show fewer skeletons for long lists */}
{Array.from({ length: 10 }).map((_, i) => (
  <Skeleton key={i} />
))}
{data.length > 10 && <p>Loading more...</p>}
```

## Related Components

- [Spinner](./SPINNER.README.md) - For inline loading indicators
- [Card](./CARD.README.md) - Often contains skeleton states
- [Avatar](./AVATAR.README.md) - Skeleton often matches avatar shape

## Notes

- Uses CSS `animate-pulse` for smooth pulsing animation
- Background color uses `muted` from theme (works in dark mode)
- Rounded by default with `rounded-md`
- Pure div element with styling - no complex logic
- Works with all Tailwind utility classes for sizing
- Animation is performant (CSS-only, no JavaScript)
