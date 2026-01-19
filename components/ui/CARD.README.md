# Card

A flexible container for grouping related content and actions.

## Import

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card'
```

## Usage

### Basic Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### With Footer

```tsx
<Card>
  <CardHeader>
    <CardTitle>Complete Example</CardTitle>
    <CardDescription>A card with all sections</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content area</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### With Action Button

```tsx
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
    <CardDescription>Manage your preferences</CardDescription>
    <CardAction>
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p>Settings content</p>
  </CardContent>
</Card>
```

### Small Size

```tsx
<Card size="sm">
  <CardHeader>
    <CardTitle>Small Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Compact spacing</p>
  </CardContent>
</Card>
```

### With Image

```tsx
<Card>
  <img
    src="/hero.jpg"
    alt="Hero"
    className="w-full h-48 object-cover"
  />
  <CardHeader>
    <CardTitle>Image Card</CardTitle>
    <CardDescription>Card with hero image</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content below image</p>
  </CardContent>
</Card>
```

## API Reference

### Card (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"default" \| "sm"` | `"default"` | Card size variant |
| `className` | `string` | - | Additional CSS classes |

### CardHeader

Container for card title, description, and optional action.

### CardTitle

The main heading of the card.

### CardDescription

Supporting text below the title.

### CardAction

Optional action button in the header (positioned top-right).

### CardContent

Main content area of the card.

### CardFooter

Footer section with muted background, typically for actions.

## Styling

### Data Slots

- `data-slot="card"` - Root container
- `data-slot="card-header"` - Header section
- `data-slot="card-title"` - Title text
- `data-slot="card-description"` - Description text
- `data-slot="card-action"` - Action button
- `data-slot="card-content"` - Content area
- `data-slot="card-footer"` - Footer section

### Size Variants

```tsx
{/* Default size */}
<Card>...</Card>

{/* Small/compact size */}
<Card size="sm">...</Card>
```

## Examples

### Stats Card

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle>Total Revenue</CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$45,231.89</div>
    <p className="text-xs text-muted-foreground">
      +20.1% from last month
    </p>
  </CardContent>
</Card>
```

### User Profile Card

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>John Doe</CardTitle>
        <CardDescription>john@example.com</CardDescription>
      </div>
    </div>
    <CardAction>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">
      Software engineer with 5 years of experience
    </p>
  </CardContent>
  <CardFooter>
    <Button className="w-full">View Profile</Button>
  </CardFooter>
</Card>
```

### Product Card

```tsx
<Card>
  <img
    src="/product.jpg"
    alt="Product"
    className="w-full h-48 object-cover"
  />
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>Brief product description</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold">$99.99</span>
      <Badge variant="secondary">In Stock</Badge>
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Add to Cart</Button>
  </CardFooter>
</Card>
```

### Form Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Create Account</CardTitle>
    <CardDescription>
      Enter your information to create an account
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <Field name="name" label="Name">
        <Input placeholder="John Doe" />
      </Field>
      <Field name="email" label="Email">
        <Input type="email" placeholder="john@example.com" />
      </Field>
      <Field name="password" label="Password">
        <Input type="password" />
      </Field>
    </form>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Create</Button>
  </CardFooter>
</Card>
```

### Notification Card

```tsx
<Card>
  <CardHeader>
    <div className="flex items-start gap-4">
      <Bell className="h-5 w-5 text-primary" />
      <div className="flex-1">
        <CardTitle>New notification</CardTitle>
        <CardDescription>2 minutes ago</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-sm">
      You have a new message from John Doe
    </p>
  </CardContent>
  <CardFooter>
    <Button variant="outline" size="sm">
      Dismiss
    </Button>
    <Button size="sm">View</Button>
  </CardFooter>
</Card>
```

### Dashboard Grid

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
      <Users className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">2,350</div>
      <p className="text-xs text-muted-foreground">
        +180 from last month
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Revenue</CardTitle>
      <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">$45,231</div>
      <p className="text-xs text-muted-foreground">
        +20.1% from last month
      </p>
    </CardContent>
  </Card>

  {/* More cards... */}
</div>
```

### Loading State

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

## Common Patterns

### Interactive Card

```tsx
<Card className="cursor-pointer hover:bg-muted/50 transition-colors">
  <CardHeader>
    <CardTitle>Clickable Card</CardTitle>
    <CardDescription>Click anywhere on this card</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### Card with Tabs

```tsx
<Card>
  <CardHeader>
    <CardTitle>Account Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        {/* Profile settings */}
      </TabsContent>
      <TabsContent value="security">
        {/* Security settings */}
      </TabsContent>
    </Tabs>
  </CardContent>
</Card>
```

## Best Practices

### Do's
- ✅ Use cards to group related content
- ✅ Keep card content focused and scannable
- ✅ Use consistent card patterns across your app
- ✅ Provide clear visual hierarchy
- ✅ Use CardFooter for primary actions

### Don'ts
- ❌ Don't nest cards too deeply
- ❌ Don't overload cards with too much content
- ❌ Don't use cards for every small piece of content
- ❌ Don't forget to provide proper spacing
- ❌ Don't make cards too wide (reduces readability)

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy with CardTitle
- Color contrast compliant
- Keyboard navigable when interactive
- Screen reader friendly

## Related Components

- [Badge](./BADGE.README.md) - For status indicators
- [Button](./BUTTON.README.md) - For card actions
- [Separator](./SEPARATOR.README.md) - For dividing card sections
- [Skeleton](./SKELETON.README.md) - For loading states

## Notes

- Images as first/last child get automatic rounded corners
- Footer has muted background by default
- CardAction auto-positions to top-right
- Uses container queries for responsive header layout
- Works seamlessly with dark mode
- Subtle ring border for depth
