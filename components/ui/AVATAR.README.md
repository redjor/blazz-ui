# Avatar

Displays a user's profile image with fallback support for initials or icons.

## Import

```tsx
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar'
```

## Usage

### Basic Avatar

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Sizes

```tsx
{/* Small */}
<Avatar size="sm">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

{/* Default */}
<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

{/* Large */}
<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### With Status Badge

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge className="bg-green-500" />
</Avatar>
```

### With Icon Badge

```tsx
import { Check } from 'lucide-react'

<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge>
    <Check className="text-white" />
  </AvatarBadge>
</Avatar>
```

### Avatar Group

```tsx
<AvatarGroup>
  <Avatar>
    <AvatarImage src="/user1.jpg" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage src="/user2.jpg" />
    <AvatarFallback>AB</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage src="/user3.jpg" />
    <AvatarFallback>CD</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>+5</AvatarGroupCount>
</AvatarGroup>
```

## API Reference

### Avatar (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Avatar size |
| `className` | `string` | - | Additional CSS classes |

### AvatarImage

| Prop | Type | Description |
|------|------|-------------|
| `src` | `string` | Image source URL |
| `alt` | `string` | Alternative text |

### AvatarFallback

Displayed when image fails to load or while loading.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Fallback content (initials, icon, etc.) |

### AvatarBadge

Small badge indicator on the avatar (for status, verification, etc.).

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Custom styling (colors, size) |

### AvatarGroup

Container for multiple avatars with overlap.

### AvatarGroupCount

Displays count of additional avatars not shown.

## Styling

### Data Slots

- `data-slot="avatar"` - Root container
- `data-slot="avatar-image"` - Image element
- `data-slot="avatar-fallback"` - Fallback content
- `data-slot="avatar-badge"` - Status badge
- `data-slot="avatar-group"` - Group container
- `data-slot="avatar-group-count"` - Count indicator

### Size Classes

```css
/* Small */
data-[size=sm]: size-6

/* Default */
size-8

/* Large */
data-[size=lg]: size-10
```

## Examples

### User Profile

```tsx
<div className="flex items-center gap-4">
  <Avatar size="lg">
    <AvatarImage src="/avatar.jpg" alt="John Doe" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <div>
    <h3 className="font-semibold">John Doe</h3>
    <p className="text-sm text-muted-foreground">john@example.com</p>
  </div>
</div>
```

### Online Status

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge className="bg-green-500" title="Online" />
</Avatar>
```

### Different Status Colors

```tsx
<div className="flex gap-4">
  {/* Online */}
  <Avatar>
    <AvatarImage src="/user1.jpg" />
    <AvatarFallback>JD</AvatarFallback>
    <AvatarBadge className="bg-green-500" />
  </Avatar>

  {/* Away */}
  <Avatar>
    <AvatarImage src="/user2.jpg" />
    <AvatarFallback>AB</AvatarFallback>
    <AvatarBadge className="bg-yellow-500" />
  </Avatar>

  {/* Busy */}
  <Avatar>
    <AvatarImage src="/user3.jpg" />
    <AvatarFallback>CD</AvatarFallback>
    <AvatarBadge className="bg-red-500" />
  </Avatar>

  {/* Offline */}
  <Avatar>
    <AvatarImage src="/user4.jpg" />
    <AvatarFallback>EF</AvatarFallback>
    <AvatarBadge className="bg-gray-500" />
  </Avatar>
</div>
```

### Verified Badge

```tsx
import { Check } from 'lucide-react'

<Avatar size="lg">
  <AvatarImage src="/verified-user.jpg" />
  <AvatarFallback>VU</AvatarFallback>
  <AvatarBadge className="bg-blue-500">
    <Check className="h-2 w-2 text-white" />
  </AvatarBadge>
</Avatar>
```

### Fallback with Icon

```tsx
import { User } from 'lucide-react'

<Avatar>
  <AvatarImage src="/broken-link.jpg" />
  <AvatarFallback>
    <User className="h-4 w-4" />
  </AvatarFallback>
</Avatar>
```

### Comment Thread

```tsx
<div className="space-y-4">
  {comments.map((comment) => (
    <div key={comment.id} className="flex gap-3">
      <Avatar>
        <AvatarImage src={comment.avatar} />
        <AvatarFallback>{comment.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{comment.author}</span>
          <span className="text-xs text-muted-foreground">
            {comment.time}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{comment.text}</p>
      </div>
    </div>
  ))}
</div>
```

### Team Members

```tsx
<div className="space-y-2">
  <h3 className="font-semibold">Team Members</h3>
  <AvatarGroup>
    <Avatar>
      <AvatarImage src="/member1.jpg" />
      <AvatarFallback>JD</AvatarFallback>
      <AvatarBadge className="bg-green-500" />
    </Avatar>
    <Avatar>
      <AvatarImage src="/member2.jpg" />
      <AvatarFallback>AB</AvatarFallback>
      <AvatarBadge className="bg-green-500" />
    </Avatar>
    <Avatar>
      <AvatarImage src="/member3.jpg" />
      <AvatarFallback>CD</AvatarFallback>
      <AvatarBadge className="bg-yellow-500" />
    </Avatar>
    <AvatarGroupCount>+12</AvatarGroupCount>
  </AvatarGroup>
</div>
```

### With Tooltip

```tsx
<Tooltip>
  <TooltipTrigger>
    <Avatar>
      <AvatarImage src="/avatar.jpg" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  </TooltipTrigger>
  <TooltipContent>
    <p>John Doe</p>
    <p className="text-xs text-muted-foreground">Online</p>
  </TooltipContent>
</Tooltip>
```

### List with Avatars

```tsx
<ul className="divide-y">
  {users.map((user) => (
    <li key={user.id} className="flex items-center gap-3 py-3">
      <Avatar>
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.initials}</AvatarFallback>
        {user.online && <AvatarBadge className="bg-green-500" />}
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.role}</p>
      </div>
      <Button variant="outline" size="sm">
        View
      </Button>
    </li>
  ))}
</ul>
```

## Common Patterns

### Generate Initials

```tsx
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

<Avatar>
  <AvatarImage src={user.avatar} />
  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

### Colored Fallbacks

```tsx
function getColorFromName(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

<Avatar>
  <AvatarImage src={user.avatar} />
  <AvatarFallback className={getColorFromName(user.name)}>
    {getInitials(user.name)}
  </AvatarFallback>
</Avatar>
```

### Clickable Avatar

```tsx
<button onClick={() => viewProfile(user.id)}>
  <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
    <AvatarImage src={user.avatar} />
    <AvatarFallback>{user.initials}</AvatarFallback>
  </Avatar>
</button>
```

## Best Practices

### Do's
- ✅ Always provide fallback content
- ✅ Use meaningful alt text for images
- ✅ Use 2 initials for fallback
- ✅ Provide visual status indicators
- ✅ Keep avatar groups to 5-6 visible

### Don'ts
- ❌ Don't use low-resolution images
- ❌ Don't forget fallback for broken images
- ❌ Don't make badges too large
- ❌ Don't stack too many avatars in groups
- ❌ Don't use avatars for non-person entities

## Accessibility

- Alt text required for images
- Fallback ensures content always visible
- Badge titles provide status context
- Works with keyboard navigation
- Screen reader announces initials/names

## Related Components

- [Badge](./BADGE.README.md) - For additional status indicators
- [Tooltip](./TOOLTIP.README.md) - For showing full user info
- [Card](./CARD.README.md) - Often contains avatars in headers

## Notes

- Automatically handles image loading states
- Fallback shown during image load
- Rounded border via ::after pseudo-element
- Badge positioned in bottom-right
- Group avatars have white ring separation
- Supports all Base UI Avatar features
- Works seamlessly in dark mode
