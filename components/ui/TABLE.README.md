# Table

A semantic HTML table component with consistent styling for displaying tabular data. Includes all standard table elements with automatic overflow handling.

## Import

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table'
```

## Usage

### Basic Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Jane Smith</TableCell>
      <TableCell>jane@example.com</TableCell>
      <TableCell>User</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### With Caption

```tsx
<Table>
  <TableCaption>A list of your recent invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### With Footer

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Product</TableHead>
      <TableHead>Quantity</TableHead>
      <TableHead className="text-right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Widget A</TableCell>
      <TableCell>10</TableCell>
      <TableCell className="text-right">$100.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Widget B</TableCell>
      <TableCell>5</TableCell>
      <TableCell className="text-right">$75.00</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>Total</TableCell>
      <TableCell className="text-right">$175.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### With Right-Aligned Column

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Date</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Payment</TableCell>
      <TableCell>Jan 15, 2024</TableCell>
      <TableCell className="text-right">$1,234.56</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### With Selection (Checkbox)

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-12">
        <Checkbox />
      </TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>Jane Smith</TableCell>
      <TableCell>jane@example.com</TableCell>
      <TableCell>Inactive</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## API Reference

### Table

Root table component with automatic overflow handling.

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `children` | `ReactNode` | Table content |

### TableHeader

Table header section (`<thead>`).

### TableBody

Table body section (`<tbody>`).

### TableFooter

Table footer section (`<tfoot>`) with emphasized styling.

### TableRow

Table row (`<tr>`) with hover effects and selection state.

| Data Attribute | Description |
|----------------|-------------|
| `data-state="selected"` | Apply selected styling |

### TableHead

Table header cell (`<th>`) with default left alignment.

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |

### TableCell

Table data cell (`<td>`) with consistent padding.

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `colSpan` | `number` | Number of columns to span |
| `rowSpan` | `number` | Number of rows to span |

### TableCaption

Table caption displayed below the table.

## Styling

### Data Slots

- `data-slot="table"` - Table element
- `data-slot="table-header"` - Header section
- `data-slot="table-body"` - Body section
- `data-slot="table-footer"` - Footer section
- `data-slot="table-row"` - Table row
- `data-slot="table-head"` - Header cell
- `data-slot="table-cell"` - Data cell
- `data-slot="table-caption"` - Table caption

### Classes

```css
/* Table */
.w-full /* Full width */
.caption-bottom /* Caption below table */
.text-xs /* Small text */

/* TableHeader */
.bg-muted/50 /* Light background */

/* TableRow */
.border-b /* Bottom border */
.transition-colors /* Smooth transitions */
.hover:bg-muted/50 /* Hover background */
.data-[state=selected]:bg-primary/5 /* Selected background */

/* TableHead */
.h-8 /* Fixed height */
.px-3 /* Horizontal padding */
.text-left /* Left aligned */
.font-medium /* Medium weight */
.text-muted-foreground /* Muted color */

/* TableCell */
.px-1.5 /* Horizontal padding */
.align-middle /* Vertical align */

/* TableFooter */
.border-t /* Top border */
.bg-muted/50 /* Light background */
.font-medium /* Medium weight */
```

## Examples

### Users List

```tsx
<Table>
  <TableCaption>A list of users in your workspace</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
      <TableCell>
        <Badge variant="secondary">Active</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm">Edit</Button>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-medium">Jane Smith</TableCell>
      <TableCell>jane@example.com</TableCell>
      <TableCell>Member</TableCell>
      <TableCell>
        <Badge variant="outline">Invited</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm">Edit</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Invoices with Total

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Client</TableHead>
      <TableHead>Date</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV-001</TableCell>
      <TableCell>Acme Corp</TableCell>
      <TableCell>Jan 15, 2024</TableCell>
      <TableCell className="text-right">$1,250.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-medium">INV-002</TableCell>
      <TableCell>Globex Inc</TableCell>
      <TableCell>Jan 18, 2024</TableCell>
      <TableCell className="text-right">$3,450.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-medium">INV-003</TableCell>
      <TableCell>Wayne Enterprises</TableCell>
      <TableCell>Jan 22, 2024</TableCell>
      <TableCell className="text-right">$890.00</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right font-bold">$5,590.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### Products with Images

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-12"></TableHead>
      <TableHead>Product</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Stock</TableHead>
      <TableHead className="text-right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <img
          src="/product1.jpg"
          alt="Product 1"
          className="h-10 w-10 rounded-md object-cover"
        />
      </TableCell>
      <TableCell className="font-medium">Wireless Mouse</TableCell>
      <TableCell>Electronics</TableCell>
      <TableCell>
        <Badge variant="secondary">In Stock</Badge>
      </TableCell>
      <TableCell className="text-right">$29.99</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <img
          src="/product2.jpg"
          alt="Product 2"
          className="h-10 w-10 rounded-md object-cover"
        />
      </TableCell>
      <TableCell className="font-medium">Mechanical Keyboard</TableCell>
      <TableCell>Electronics</TableCell>
      <TableCell>
        <Badge variant="destructive">Out of Stock</Badge>
      </TableCell>
      <TableCell className="text-right">$119.99</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### With Row Actions

```tsx
import { MoreHorizontal } from 'lucide-react'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="w-12"></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>
        <Badge variant="secondary">Active</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Selectable Rows

```tsx
'use client'

import { useState } from 'react'

export default function SelectableTable() {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const items = [
    { id: 1, name: 'Item 1', status: 'Active' },
    { id: 2, name: 'Item 2', status: 'Inactive' },
    { id: 3, name: 'Item 3', status: 'Active' },
  ]

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(items.map((item) => item.id)))
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selected.size === items.length}
              onCheckedChange={toggleSelectAll}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item.id}
            data-state={selected.has(item.id) ? 'selected' : undefined}
          >
            <TableCell>
              <Checkbox
                checked={selected.has(item.id)}
                onCheckedChange={() => toggleSelect(item.id)}
              />
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### Empty State

```tsx
import { Inbox } from 'lucide-react'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell colSpan={3} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Inbox className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No results found</p>
        </div>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### With Sorting Indicator

```tsx
import { ArrowUpDown } from 'lucide-react'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>
        <Button variant="ghost" size="sm" className="-ml-3">
          Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      </TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Alice Johnson</TableCell>
      <TableCell>alice@example.com</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Bob Smith</TableCell>
      <TableCell>bob@example.com</TableCell>
      <TableCell>Inactive</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Common Patterns

### Responsive Table (Scroll)

```tsx
<div className="w-full overflow-auto">
  <Table>
    {/* Table content */}
  </Table>
</div>
```

Note: The Table component includes automatic overflow handling by default.

### Table in Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Recent Orders</CardTitle>
    <CardDescription>Your latest customer orders</CardDescription>
  </CardHeader>
  <CardContent className="p-0">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Table rows */}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

### Alternating Row Colors

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Value</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item, index) => (
      <TableRow
        key={item.id}
        className={index % 2 === 0 ? 'bg-muted/50' : ''}
      >
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.value}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Best Practices

### Do's
- ✅ Use semantic table structure
- ✅ Include TableCaption for accessibility
- ✅ Right-align numeric columns
- ✅ Use consistent cell padding
- ✅ Add hover states for rows
- ✅ Include TableFooter for totals

### Don'ts
- ❌ Don't use tables for layout
- ❌ Don't forget responsive handling
- ❌ Don't make columns too narrow
- ❌ Don't hide important data on mobile
- ❌ Don't forget empty states
- ❌ Don't use too many nested elements

## Table vs DataTable

### Use Table When:
- Simple tabular data display
- No sorting/filtering needed
- Static data
- Custom table structure needed
- Lightweight component required

### Use DataTable When:
- Complex data operations
- Sorting and filtering required
- Pagination needed
- Column visibility controls
- Bulk actions needed
- Enterprise-grade features

## Accessibility

- Semantic HTML `<table>` element
- Proper table structure (thead, tbody, tfoot)
- Caption for screen readers
- Keyboard navigable (if interactive)
- Clear visual hierarchy
- Row hover states
- Focus indicators for interactive elements
- ARIA attributes where needed

## Related Components

- [DataTable](../features/data-table/DATATABLE.README.md) - Advanced table with features
- [Card](./CARD.README.md) - For table containers
- [Badge](./BADGE.README.md) - For status indicators
- [Button](./BUTTON.README.md) - For row actions
- [Checkbox](./CHECKBOX.README.md) - For row selection

## Notes

- Wraps in overflow container automatically
- Small text size (text-xs) by default
- Hover effects on rows
- Selection state support via data-state
- Muted header and footer backgrounds
- Automatic responsive overflow
- Works seamlessly in dark mode
- Minimal abstraction over HTML tables
- Data slots for targeted styling
- forwardRef support on all components
