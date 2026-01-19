# Page

A container component for page-level layout inspired by Shopify Polaris. Provides consistent structure with title, actions, breadcrumbs, and flexible width options.

## Import

```tsx
import { Page, PageSection } from '@/components/ui/page'
```

## Usage

### Basic Page

```tsx
<Page title="Products">
  <p>Page content here</p>
</Page>
```

### With Subtitle

```tsx
<Page
  title="Product Details"
  subtitle="Manage your product information"
>
  <p>Page content here</p>
</Page>
```

### With Actions

```tsx
<Page
  title="Product Details"
  primaryAction={<Button>Save</Button>}
  secondaryActions={
    <>
      <Button variant="outline">Preview</Button>
      <Button variant="ghost">Delete</Button>
    </>
  }
>
  <p>Page content here</p>
</Page>
```

### With Breadcrumbs

```tsx
<Page
  title="Product Details"
  breadcrumbs={
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
          <BreadcrumbPage>Details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
>
  <p>Page content here</p>
</Page>
```

### Full Width

```tsx
<Page title="Dashboard" fullWidth>
  <p>Full width content for dashboards</p>
</Page>
```

### Narrow Width

```tsx
<Page title="Settings" narrowWidth>
  <p>Narrow content for forms and settings</p>
</Page>
```

### With Additional Metadata

```tsx
<Page
  title="Order #1234"
  subtitle="Placed on January 15, 2024"
  additionalMetadata={
    <div className="flex items-center gap-4">
      <Badge variant="secondary">Pending</Badge>
      <span className="text-sm text-muted-foreground">
        Last updated 2 hours ago
      </span>
    </div>
  }
>
  <p>Order details here</p>
</Page>
```

### With Page Sections

```tsx
<Page title="Settings">
  <PageSection
    title="Profile"
    description="Manage your account information"
  >
    <Card>
      <CardContent className="pt-6">
        {/* Profile form */}
      </CardContent>
    </Card>
  </PageSection>

  <PageSection
    title="Security"
    description="Update your password and security preferences"
  >
    <Card>
      <CardContent className="pt-6">
        {/* Security settings */}
      </CardContent>
    </Card>
  </PageSection>
</Page>
```

## API Reference

### Page

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | - | Main page title |
| `subtitle` | `ReactNode` | - | Subtitle or description below title |
| `primaryAction` | `ReactNode` | - | Primary action button(s) in header |
| `secondaryActions` | `ReactNode` | - | Secondary action button(s) in header |
| `breadcrumbs` | `ReactNode` | - | Breadcrumb navigation above title |
| `additionalMetadata` | `ReactNode` | - | Additional content in header (tabs, metadata) |
| `fullWidth` | `boolean` | `false` | Removes max-width constraint |
| `narrowWidth` | `boolean` | `false` | Uses narrower max-width (max-w-5xl) |
| `divider` | `boolean` | `true` | Shows divider between header and content |
| `className` | `string` | - | Additional CSS classes for container |
| `headerClassName` | `string` | - | Additional CSS classes for header |
| `contentClassName` | `string` | - | Additional CSS classes for content |

### PageSection

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Section title |
| `description` | `string` | Section description |
| `className` | `string` | Additional CSS classes |
| `children` | `ReactNode` | Section content |

## Examples

### Product Detail Page

```tsx
import { Save, Eye, Trash2 } from 'lucide-react'

<Page
  title="Summer Collection T-Shirt"
  subtitle="SKU: TSHIRT-001"
  breadcrumbs={
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Summer Collection T-Shirt</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
  primaryAction={
    <Button>
      <Save className="mr-2 h-4 w-4" />
      Save
    </Button>
  }
  secondaryActions={
    <>
      <Button variant="outline">
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </Button>
      <Button variant="ghost">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </>
  }
  additionalMetadata={
    <div className="flex items-center gap-4">
      <Badge variant="secondary">Active</Badge>
      <span className="text-sm text-muted-foreground">
        Last modified by John Doe, 2 hours ago
      </span>
    </div>
  }
>
  <div className="grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Product form */}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Pricing form */}
      </CardContent>
    </Card>
  </div>
</Page>
```

### Dashboard Page

```tsx
<Page title="Dashboard" fullWidth>
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$45,231</div>
        <p className="text-xs text-muted-foreground">
          +20.1% from last month
        </p>
      </CardContent>
    </Card>

    {/* More metric cards */}
  </div>
</Page>
```

### Settings Page

```tsx
<Page title="Settings" narrowWidth>
  <PageSection
    title="Account"
    description="Manage your account settings and preferences"
  >
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your account profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  </PageSection>

  <PageSection
    title="Security"
    description="Manage your security settings"
  >
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Password change form */}
      </CardContent>
    </Card>
  </PageSection>
</Page>
```

### List Page with Actions

```tsx
'use client'

import { Plus, Download } from 'lucide-react'

export default function CustomersPage() {
  return (
    <Page
      title="Customers"
      subtitle="Manage your customer database"
      primaryAction={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      }
      secondaryActions={
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      }
    >
      <Card>
        <CardContent className="pt-6">
          {/* DataTable here */}
        </CardContent>
      </Card>
    </Page>
  )
}
```

### Empty State Page

```tsx
import { PackageOpen } from 'lucide-react'

<Page title="Products">
  <div className="flex flex-col items-center justify-center py-12">
    <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold mb-2">No products yet</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Get started by creating your first product
    </p>
    <Button>Create Product</Button>
  </div>
</Page>
```

### Tabbed Page

```tsx
<Page
  title="Product Settings"
  subtitle="Configure product display and behavior"
  additionalMetadata={
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
      </TabsList>
    </Tabs>
  }
>
  <TabsContent value="general">
    <Card>
      <CardContent className="pt-6">
        {/* General settings */}
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="seo">
    <Card>
      <CardContent className="pt-6">
        {/* SEO settings */}
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="shipping">
    <Card>
      <CardContent className="pt-6">
        {/* Shipping settings */}
      </CardContent>
    </Card>
  </TabsContent>
</Page>
```

### Page without Title (Actions Only)

```tsx
<Page
  breadcrumbs={
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
  primaryAction={<Button>Create New</Button>}
  secondaryActions={<Button variant="outline">Import</Button>}
>
  <div className="grid gap-6">
    {/* Content */}
  </div>
</Page>
```

## Common Patterns

### Width Options

```tsx
// Standard width (max-w-7xl) - default
<Page title="Standard Width">
  <p>Content at standard width</p>
</Page>

// Narrow width (max-w-5xl) - for forms, settings
<Page title="Narrow Width" narrowWidth>
  <p>Content at narrow width</p>
</Page>

// Full width - for dashboards, data tables
<Page title="Full Width" fullWidth>
  <p>Content at full viewport width</p>
</Page>
```

### Layout Patterns

```tsx
// Two-column layout
<Page title="User Profile">
  <div className="grid gap-6 md:grid-cols-3">
    <div className="md:col-span-1">
      <Card>
        <CardContent className="pt-6">
          {/* Sidebar */}
        </CardContent>
      </Card>
    </div>
    <div className="md:col-span-2">
      <Card>
        <CardContent className="pt-6">
          {/* Main content */}
        </CardContent>
      </Card>
    </div>
  </div>
</Page>

// Three-column grid
<Page title="Dashboard" fullWidth>
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>{/* Card 1 */}</Card>
    <Card>{/* Card 2 */}</Card>
    <Card>{/* Card 3 */}</Card>
  </div>
</Page>
```

### Conditional Actions

```tsx
'use client'

function ProductPage() {
  const hasChanges = true

  return (
    <Page
      title="Product Details"
      primaryAction={
        hasChanges ? <Button>Save Changes</Button> : null
      }
      secondaryActions={
        <>
          <Button variant="outline">Cancel</Button>
          <Button variant="ghost">Reset</Button>
        </>
      }
    >
      {/* Content */}
    </Page>
  )
}
```

## Best Practices

### Do's
- ✅ Use Page as the root container for all pages
- ✅ Keep page titles concise and descriptive
- ✅ Use narrowWidth for forms and settings pages
- ✅ Use fullWidth for dashboards and data-heavy pages
- ✅ Place primary actions on the right
- ✅ Use PageSection for logical content grouping

### Don'ts
- ❌ Don't nest Page components
- ❌ Don't use Page for modal dialogs
- ❌ Don't put too many actions (max 3-4)
- ❌ Don't use fullWidth for text-heavy content
- ❌ Don't forget responsive layout considerations
- ❌ Don't mix multiple page layouts in one app

## Page vs Box vs Card

### Use Page When:
- Top-level page container
- Need page title and actions
- Want consistent page header
- Building full page layouts
- Need breadcrumb navigation

### Use Box When:
- Need simple layout container
- Quick prototyping
- Custom styling required
- Polymorphic element needed

### Use Card When:
- Content grouping within a page
- Displaying information cards
- Creating visual separation
- Standard card pattern needed

## Accessibility

- Semantic HTML structure (`<h1>` for title, `<section>` for PageSection)
- Proper heading hierarchy
- Responsive layout with flexbox/grid
- Touch-friendly action buttons
- Screen reader friendly content
- Focus management for interactive elements
- ARIA attributes where needed

## Related Components

- [Breadcrumb](./BREADCRUMB.README.md) - Navigation breadcrumbs
- [Card](./CARD.README.md) - Content cards within pages
- [Button](./BUTTON.README.md) - Action buttons
- [Badge](./BADGE.README.md) - Status indicators
- [Tabs](./TABS.README.md) - Tabbed navigation

## Notes

- Inspired by Shopify Polaris Page component
- Uses forwardRef for ref support
- Flexible width options (standard, narrow, full)
- Responsive layout with mobile-first approach
- Automatic header/content spacing
- Optional divider between header and content
- Supports complex header layouts
- PageSection for consistent section styling
- Works seamlessly in dark mode
- No JavaScript required (except for dynamic actions)
- Compatible with all Next.js layouts
