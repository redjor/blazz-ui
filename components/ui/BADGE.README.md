# Badge

Small status indicators and labels to highlight information with various visual styles.

## Import

```tsx
import { Badge } from '@/components/ui/badge'
```

## Usage

### Basic Badge

```tsx
<Badge>Default</Badge>
```

### Variants

```tsx
{/* Primary/Default */}
<Badge variant="default">Default</Badge>

{/* Secondary */}
<Badge variant="secondary">Secondary</Badge>

{/* Destructive/Error */}
<Badge variant="destructive">Error</Badge>

{/* Outline */}
<Badge variant="outline">Outline</Badge>

{/* Ghost */}
<Badge variant="ghost">Ghost</Badge>

{/* Link */}
<Badge variant="link">Link</Badge>
```

### With Icons

```tsx
import { Check, X, AlertCircle } from 'lucide-react'

<Badge>
  <Check className="h-3 w-3" />
  Success
</Badge>

<Badge variant="destructive">
  <X className="h-3 w-3" />
  Error
</Badge>

<Badge variant="outline">
  <AlertCircle className="h-3 w-3" />
  Warning
</Badge>
```

### As Link

```tsx
<Badge variant="link" render={<a href="/settings" />}>
  Settings
</Badge>
```

### Interactive Badge

```tsx
<Badge render={<button onClick={() => console.log('clicked')} />}>
  Clickable
</Badge>
```

## API Reference

### Badge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` | Visual style variant |
| `render` | `React.ComponentPropsWithRef<T>` | - | Render as different element (button, a, etc.) |
| `className` | `string` | - | Additional CSS classes |

## Styling

### Data Slots

- `data-slot="badge"` - Root container

### Variant Classes

```css
/* Default */
.bg-primary .text-primary-foreground

/* Secondary */
.bg-secondary .text-secondary-foreground

/* Destructive */
.bg-destructive/10 .text-destructive

/* Outline */
.border-border .text-foreground

/* Ghost */
.hover:bg-muted .hover:text-muted-foreground

/* Link */
.text-primary .underline-offset-4
```

## Examples

### Status Badges

```tsx
<div className="flex gap-2">
  <Badge variant="default">Active</Badge>
  <Badge variant="secondary">Pending</Badge>
  <Badge variant="outline">Draft</Badge>
  <Badge variant="destructive">Failed</Badge>
</div>
```

### With Custom Colors

```tsx
<div className="flex gap-2">
  <Badge className="bg-green-500 text-white">Success</Badge>
  <Badge className="bg-yellow-500 text-black">Warning</Badge>
  <Badge className="bg-blue-500 text-white">Info</Badge>
</div>
```

### User Role Badges

```tsx
<div className="flex items-center gap-2">
  <Avatar>
    <AvatarImage src="/user.jpg" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <div>
    <p className="font-medium">John Doe</p>
    <div className="flex gap-2 mt-1">
      <Badge variant="secondary">Admin</Badge>
      <Badge variant="outline">Pro</Badge>
    </div>
  </div>
</div>
```

### Table Status Column

```tsx
<Table>
  <TableBody>
    <TableRow>
      <TableCell>Task #1</TableCell>
      <TableCell>
        <Badge variant="default">Completed</Badge>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Task #2</TableCell>
      <TableCell>
        <Badge variant="secondary">In Progress</Badge>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Task #3</TableCell>
      <TableCell>
        <Badge variant="destructive">Failed</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Notification Badge

```tsx
import { Bell } from 'lucide-react'

<div className="relative inline-block">
  <Button variant="ghost" size="sm">
    <Bell className="h-4 w-4" />
  </Button>
  <Badge
    variant="destructive"
    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
  >
    3
  </Badge>
</div>
```

### Feature Tags

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Premium Plan</CardTitle>
      <Badge>Popular</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge variant="outline">Unlimited Storage</Badge>
      <Badge variant="outline">Priority Support</Badge>
      <Badge variant="outline">Advanced Analytics</Badge>
    </div>
  </CardContent>
</Card>
```

### Removable Tags

```tsx
'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

export default function RemovableTags() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind'])

  return (
    <div className="flex gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
          <button
            onClick={() => setTags(tags.filter((t) => t !== tag))}
            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}
```

### Priority Indicators

```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Badge className="bg-red-500 text-white">Urgent</Badge>
    <span>Critical bug in production</span>
  </div>
  <div className="flex items-center gap-2">
    <Badge className="bg-orange-500 text-white">High</Badge>
    <span>Feature request from client</span>
  </div>
  <div className="flex items-center gap-2">
    <Badge className="bg-blue-500 text-white">Normal</Badge>
    <span>Regular task</span>
  </div>
  <div className="flex items-center gap-2">
    <Badge className="bg-gray-500 text-white">Low</Badge>
    <span>Nice to have feature</span>
  </div>
</div>
```

### Category Labels

```tsx
<div className="grid gap-4">
  {posts.map((post) => (
    <Card key={post.id}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{post.category}</Badge>
          <Badge variant="ghost">{post.readTime} min read</Badge>
        </div>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
    </Card>
  ))}
</div>
```

### Metric Badges

```tsx
<div className="grid grid-cols-3 gap-4">
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total Users</span>
        <Badge variant="default">+12%</Badge>
      </div>
      <p className="text-2xl font-bold mt-2">2,543</p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Revenue</span>
        <Badge variant="default">+8%</Badge>
      </div>
      <p className="text-2xl font-bold mt-2">$45,231</p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Conversion</span>
        <Badge variant="destructive">-2%</Badge>
      </div>
      <p className="text-2xl font-bold mt-2">3.2%</p>
    </CardContent>
  </Card>
</div>
```

### Version Badges

```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <span className="font-medium">API Version</span>
    <Badge variant="outline">v2.0.1</Badge>
    <Badge variant="default">Latest</Badge>
  </div>
  <div className="flex items-center gap-2">
    <span className="font-medium">Legacy API</span>
    <Badge variant="outline">v1.5.0</Badge>
    <Badge variant="destructive">Deprecated</Badge>
  </div>
</div>
```

## Common Patterns

### Badge List

```tsx
const badges = ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']

<div className="flex flex-wrap gap-2">
  {badges.map((badge) => (
    <Badge key={badge} variant="secondary">
      {badge}
    </Badge>
  ))}
</div>
```

### Conditional Badge

```tsx
{status === 'active' && <Badge variant="default">Active</Badge>}
{status === 'pending' && <Badge variant="secondary">Pending</Badge>}
{status === 'failed' && <Badge variant="destructive">Failed</Badge>}
```

### Badge with Dot Indicator

```tsx
<Badge variant="outline">
  <div className="h-2 w-2 rounded-full bg-green-500 mr-1" />
  Online
</Badge>
```

## Best Practices

### Do's
- ✅ Use for status indicators
- ✅ Keep text short (1-3 words)
- ✅ Use consistent colors for status
- ✅ Group related badges
- ✅ Make clickable badges obvious

### Don'ts
- ❌ Don't use for long text (use Chip)
- ❌ Don't overuse badges
- ❌ Don't use too many colors
- ❌ Don't make all badges clickable
- ❌ Don't rely solely on color

## Badge vs Chip vs Label

### Use Badge When:
- Status indicators
- Small labels
- Count indicators
- Category tags
- Feature flags

### Use Chip When:
- Removable tags
- Filter selections
- Multi-select items
- User selections

### Use Label When:
- Form field labels
- Longer descriptive text
- Required field indicators
- Persistent labels

## Accessibility

- Use semantic HTML (span by default)
- Include descriptive text
- Don't rely solely on color
- Use ARIA labels when needed
- Keyboard accessible if interactive
- Focus visible for clickable badges
- Screen reader friendly

## Related Components

- [Alert](./ALERT.README.md) - For larger messages
- [Avatar](./AVATAR.README.md) - Often used with badges
- [Button](./BUTTON.README.md) - For actionable items
- [Chip](./CHIP.README.md) - For removable tags

## Notes

- Uses CVA for variants
- Supports icons with auto-sizing
- Can render as any element (button, link, etc.)
- Works seamlessly in dark mode
- Responsive sizing
- Inline-flex layout
- Minimal height (h-5)
- Rounded corners (rounded-4xl)
- Focus ring for interactive badges
- Smooth transitions
