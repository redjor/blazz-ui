# Select

A dropdown select component for choosing a single option from a list with keyboard navigation and search support.

## Import

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select'
```

## Usage

### Basic Select

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### With Label

```tsx
<div className="space-y-2">
  <Label htmlFor="country">Country</Label>
  <Select>
    <SelectTrigger id="country">
      <SelectValue placeholder="Select a country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="ca">Canada</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
      <SelectItem value="au">Australia</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Controlled Select

```tsx
'use client'

import { useState } from 'react'

export default function ControlledSelect() {
  const [value, setValue] = useState('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### Sizes

```tsx
{/* Small */}
<Select>
  <SelectTrigger size="sm">
    <SelectValue placeholder="Small" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>

{/* Default */}
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Default" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### With Groups

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectGroup>

    <SelectSeparator />

    <SelectGroup>
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="broccoli">Broccoli</SelectItem>
      <SelectItem value="spinach">Spinach</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### Disabled State

```tsx
<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Disabled" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### Disabled Items

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Available</SelectItem>
    <SelectItem value="2" disabled>
      Unavailable
    </SelectItem>
    <SelectItem value="3">Available</SelectItem>
  </SelectContent>
</Select>
```

## API Reference

### Select (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled selected value |
| `defaultValue` | `string` | - | Default value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Callback when selection changes |
| `disabled` | `boolean` | `false` | Whether the select is disabled |
| `name` | `string` | - | Name for form submission |
| `required` | `boolean` | `false` | Whether selection is required |

### SelectTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "default"` | `"default"` | Size variant |
| `className` | `string` | - | Additional CSS classes |

### SelectValue

| Prop | Type | Description |
|------|------|-------------|
| `placeholder` | `string` | Placeholder when no value selected |

### SelectContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side |
| `sideOffset` | `number` | `4` | Distance from trigger (px) |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment |
| `alignOffset` | `number` | `0` | Offset along alignment axis |
| `alignItemWithTrigger` | `boolean` | `true` | Align selected item with trigger |

### SelectItem

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Item value (required) |
| `disabled` | `boolean` | Whether item is disabled |
| `children` | `ReactNode` | Item content |

### SelectLabel

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Label text |

### SelectGroup

Container for grouped items.

### SelectSeparator

Visual separator between groups or items.

## Styling

### Data Slots

- `data-slot="select-trigger"` - Trigger button
- `data-slot="select-value"` - Selected value display
- `data-slot="select-content"` - Dropdown content
- `data-slot="select-item"` - Individual item
- `data-slot="select-label"` - Group label
- `data-slot="select-group"` - Item group
- `data-slot="select-separator"` - Separator

### Data Attributes

```css
/* Size variants */
[data-slot="select-trigger"][data-size="sm"] { }
[data-slot="select-trigger"][data-size="default"] { }

/* Selected item */
[data-slot="select-item"][data-selected] { }

/* Disabled items */
[data-slot="select-item"][data-disabled] { }
```

## Examples

### Form Integration

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  country: z.string().min(1, 'Please select a country'),
  language: z.string().min(1, 'Please select a language'),
})

export default function SelectForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: '',
      language: '',
    },
  })

  return (
    <form onSubmit={form.handleSubmit((data) => console.log(data))}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={form.watch('country')}
            onValueChange={(value) => form.setValue('country', value)}
          >
            <SelectTrigger
              aria-invalid={!!form.formState.errors.country}
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.country && (
            <p className="text-sm text-destructive">
              {form.formState.errors.country.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={form.watch('language')}
            onValueChange={(value) => form.setValue('language', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}
```

### With Icons

```tsx
import { Globe, Mail, Phone, MessageSquare } from 'lucide-react'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Contact method" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="email">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Email
      </div>
    </SelectItem>
    <SelectItem value="phone">
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4" />
        Phone
      </div>
    </SelectItem>
    <SelectItem value="sms">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        SMS
      </div>
    </SelectItem>
  </SelectContent>
</Select>
```

### Multi-Column Layout

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="pst">
        <div className="flex justify-between gap-8">
          <span>Pacific Time</span>
          <span className="text-muted-foreground">PST</span>
        </div>
      </SelectItem>
      <SelectItem value="mst">
        <div className="flex justify-between gap-8">
          <span>Mountain Time</span>
          <span className="text-muted-foreground">MST</span>
        </div>
      </SelectItem>
      <SelectItem value="cst">
        <div className="flex justify-between gap-8">
          <span>Central Time</span>
          <span className="text-muted-foreground">CST</span>
        </div>
      </SelectItem>
      <SelectItem value="est">
        <div className="flex justify-between gap-8">
          <span>Eastern Time</span>
          <span className="text-muted-foreground">EST</span>
        </div>
      </SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### With Avatars

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Assign to..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="john">
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src="/john.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        John Doe
      </div>
    </SelectItem>
    <SelectItem value="jane">
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src="/jane.jpg" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        Jane Smith
      </div>
    </SelectItem>
  </SelectContent>
</Select>
```

### Dependent Selects

```tsx
'use client'

import { useState } from 'react'

const countries = {
  us: { name: 'United States', states: ['California', 'Texas', 'New York'] },
  ca: { name: 'Canada', states: ['Ontario', 'Quebec', 'BC'] },
}

export default function DependentSelects() {
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')

  const handleCountryChange = (value: string) => {
    setCountry(value)
    setState('') // Reset state when country changes
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Country</Label>
        <Select value={country} onValueChange={handleCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>State/Province</Label>
        <Select value={state} onValueChange={setState} disabled={!country}>
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {country &&
              countries[country as keyof typeof countries].states.map(
                (stateName) => (
                  <SelectItem key={stateName} value={stateName}>
                    {stateName}
                  </SelectItem>
                )
              )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
```

### With Badges

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">
      <div className="flex items-center gap-2">
        <Badge variant="success">Active</Badge>
      </div>
    </SelectItem>
    <SelectItem value="pending">
      <div className="flex items-center gap-2">
        <Badge variant="warning">Pending</Badge>
      </div>
    </SelectItem>
    <SelectItem value="inactive">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">Inactive</Badge>
      </div>
    </SelectItem>
  </SelectContent>
</Select>
```

### Loading State

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function LoadingSelect() {
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState([])

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOptions([
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
        <SelectContent />
      </Select>
    )
  }

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### Priority Selection

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select priority" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="urgent">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        Urgent
      </div>
    </SelectItem>
    <SelectItem value="high">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-500" />
        High
      </div>
    </SelectItem>
    <SelectItem value="normal">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-blue-500" />
        Normal
      </div>
    </SelectItem>
    <SelectItem value="low">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-gray-500" />
        Low
      </div>
    </SelectItem>
  </SelectContent>
</Select>
```

## Common Patterns

### Dynamic Options

```tsx
'use client'

const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books' },
]

export default function DynamicSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### Filter Reset Button

```tsx
'use client'

import { useState } from 'react'

export default function FilterableSelect() {
  const [value, setValue] = useState('')

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Filter by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
      {value && (
        <Button variant="ghost" onClick={() => setValue('')}>
          Reset
        </Button>
      )}
    </div>
  )
}
```

## Best Practices

### Do's
- ✅ Use for single selection from list
- ✅ Provide clear placeholder text
- ✅ Group related options
- ✅ Use disabled state for unavailable options
- ✅ Show validation errors clearly

### Don'ts
- ❌ Don't use for long lists (use Combobox with search)
- ❌ Don't use for multiple selection (use Checkbox or Multi-Select)
- ❌ Don't make options too long
- ❌ Don't forget to handle empty state
- ❌ Don't overuse separators

## Select vs Combobox vs Radio Group

### Use Select When:
- 5-20 options
- Single selection
- No search needed
- Space-constrained UI
- Standard dropdown behavior

### Use Combobox When:
- Many options (20+)
- Search/filter needed
- Autocomplete behavior
- Custom option creation

### Use Radio Group When:
- 2-5 options
- Options always visible
- Single selection
- Important decision
- No space constraints

## Accessibility

- Keyboard navigable (Arrow keys, Enter, Escape)
- Screen reader support with ARIA
- Focus management
- Type-ahead search
- Proper labeling
- Disabled state conveyed
- Selected item highlighted
- Scroll into view for selected item

## Related Components

- [Combobox](./COMBOBOX.README.md) - For searchable selection
- [Radio Group](./RADIO-GROUP.README.md) - For visible options
- [Dropdown Menu](./DROPDOWN-MENU.README.md) - For actions
- [Label](./LABEL.README.md) - For labeling

## Notes

- Built on Base UI Select primitive
- Automatically positions to stay in viewport
- Smooth animations
- Keyboard type-ahead search
- Scroll arrows for long lists
- Works seamlessly in dark mode
- Aligns selected item with trigger by default
- Focus ring for keyboard navigation
- Invalid state with red border/ring
