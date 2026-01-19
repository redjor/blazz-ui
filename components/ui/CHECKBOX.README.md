# Checkbox

A checkbox input for boolean or multiple selection with accessible design and animations.

## Import

```tsx
import { Checkbox } from '@/components/ui/checkbox'
```

## Usage

### Basic Checkbox

```tsx
<Checkbox />
```

### With Label

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

### Controlled Checkbox

```tsx
'use client'

import { useState } from 'react'

export default function ControlledCheckbox() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} onCheckedChange={setChecked} />
      <Label>
        {checked ? 'Checked' : 'Unchecked'}
      </Label>
    </div>
  )
}
```

### Disabled State

```tsx
<Checkbox disabled />
<Checkbox checked disabled />
```

### Indeterminate State

```tsx
<Checkbox checked="indeterminate" />
```

### With Description

```tsx
<div className="flex items-start gap-2">
  <Checkbox id="marketing" className="mt-0.5" />
  <div className="space-y-1">
    <Label htmlFor="marketing">Marketing emails</Label>
    <p className="text-sm text-muted-foreground">
      Receive emails about new products, features, and more.
    </p>
  </div>
</div>
```

## API Reference

### Checkbox

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| "indeterminate"` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Default checked state (uncontrolled) |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | - | Callback when state changes |
| `disabled` | `boolean` | `false` | Whether the checkbox is disabled |
| `required` | `boolean` | `false` | Whether the checkbox is required |
| `name` | `string` | - | Name for form submission |
| `value` | `string` | `"on"` | Value for form submission when checked |
| `className` | `string` | - | Additional CSS classes |

## Styling

### Data Slots

- `data-slot="checkbox"` - Root container
- `data-slot="checkbox-indicator"` - Check icon container

### Data Attributes

```css
/* Checked state */
[data-slot="checkbox"][data-checked] { }

/* Disabled state */
[data-slot="checkbox"][data-disabled] { }

/* Invalid state */
[data-slot="checkbox"][aria-invalid] { }
```

## Examples

### Multiple Selection

```tsx
'use client'

import { useState } from 'react'

export default function MultipleSelection() {
  const [selected, setSelected] = useState({
    apple: false,
    banana: false,
    orange: false,
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          id="apple"
          checked={selected.apple}
          onCheckedChange={(checked) =>
            setSelected({ ...selected, apple: !!checked })
          }
        />
        <Label htmlFor="apple">Apple</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="banana"
          checked={selected.banana}
          onCheckedChange={(checked) =>
            setSelected({ ...selected, banana: !!checked })
          }
        />
        <Label htmlFor="banana">Banana</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="orange"
          checked={selected.orange}
          onCheckedChange={(checked) =>
            setSelected({ ...selected, orange: !!checked })
          }
        />
        <Label htmlFor="orange">Orange</Label>
      </div>
    </div>
  )
}
```

### Select All Pattern

```tsx
'use client'

import { useState, useEffect } from 'react'

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

export default function SelectAll() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAllState, setSelectAllState] = useState<
    boolean | 'indeterminate'
  >(false)

  useEffect(() => {
    if (selectedItems.length === 0) {
      setSelectAllState(false)
    } else if (selectedItems.length === items.length) {
      setSelectAllState(true)
    } else {
      setSelectAllState('indeterminate')
    }
  }, [selectedItems])

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedItems(items)
    } else {
      setSelectedItems([])
    }
  }

  const handleItemToggle = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Checkbox
          checked={selectAllState}
          onCheckedChange={handleSelectAll}
        />
        <Label>Select All</Label>
      </div>

      {items.map((item) => (
        <div key={item} className="flex items-center gap-2">
          <Checkbox
            checked={selectedItems.includes(item)}
            onCheckedChange={() => handleItemToggle(item)}
          />
          <Label>{item}</Label>
        </div>
      ))}

      <p className="text-sm text-muted-foreground mt-2">
        {selectedItems.length} of {items.length} selected
      </p>
    </div>
  )
}
```

### Form Integration

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  newsletter: z.boolean(),
  marketing: z.boolean(),
})

export default function CheckboxForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acceptTerms: false,
      newsletter: false,
      marketing: false,
    },
  })

  return (
    <form onSubmit={form.handleSubmit((data) => console.log(data))}>
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={form.watch('acceptTerms')}
            onCheckedChange={(checked) =>
              form.setValue('acceptTerms', !!checked)
            }
            aria-invalid={!!form.formState.errors.acceptTerms}
          />
          <div className="space-y-1">
            <Label htmlFor="terms">Accept terms and conditions *</Label>
            {form.formState.errors.acceptTerms && (
              <p className="text-sm text-destructive">
                {form.formState.errors.acceptTerms.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="newsletter"
            checked={form.watch('newsletter')}
            onCheckedChange={(checked) =>
              form.setValue('newsletter', !!checked)
            }
          />
          <Label htmlFor="newsletter">Subscribe to newsletter</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="marketing"
            checked={form.watch('marketing')}
            onCheckedChange={(checked) =>
              form.setValue('marketing', !!checked)
            }
          />
          <Label htmlFor="marketing">Receive marketing emails</Label>
        </div>

        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}
```

### Nested Checkboxes

```tsx
'use client'

import { useState } from 'react'

export default function NestedCheckboxes() {
  const [parent, setParent] = useState(false)
  const [children, setChildren] = useState({
    child1: false,
    child2: false,
    child3: false,
  })

  const allChildrenChecked = Object.values(children).every((v) => v)
  const someChildrenChecked = Object.values(children).some((v) => v)

  const parentState = allChildrenChecked
    ? true
    : someChildrenChecked
      ? 'indeterminate'
      : false

  const handleParentChange = (checked: boolean | 'indeterminate') => {
    const newValue = checked === true
    setParent(newValue)
    setChildren({
      child1: newValue,
      child2: newValue,
      child3: newValue,
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox checked={parentState} onCheckedChange={handleParentChange} />
        <Label>Parent Item</Label>
      </div>

      <div className="pl-6 space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={children.child1}
            onCheckedChange={(checked) =>
              setChildren({ ...children, child1: !!checked })
            }
          />
          <Label>Child Item 1</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={children.child2}
            onCheckedChange={(checked) =>
              setChildren({ ...children, child2: !!checked })
            }
          />
          <Label>Child Item 2</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={children.child3}
            onCheckedChange={(checked) =>
              setChildren({ ...children, child3: !!checked })
            }
          />
          <Label>Child Item 3</Label>
        </div>
      </div>
    </div>
  )
}
```

### With Icons

```tsx
import { Star } from 'lucide-react'

<div className="flex items-center gap-2">
  <Checkbox id="favorite" />
  <Label htmlFor="favorite" className="flex items-center gap-2">
    <Star className="h-4 w-4" />
    Mark as favorite
  </Label>
</div>
```

### Table Row Selection

```tsx
'use client'

import { useState } from 'react'

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
]

export default function TableSelection() {
  const [selected, setSelected] = useState<number[]>([])

  const isSelected = (id: number) => selected.includes(id)
  const allSelected = selected.length === users.length
  const someSelected = selected.length > 0 && selected.length < users.length

  const toggleAll = () => {
    if (allSelected) {
      setSelected([])
    } else {
      setSelected(users.map((u) => u.id))
    }
  }

  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 w-12">
              <Checkbox
                checked={someSelected ? 'indeterminate' : allSelected}
                onCheckedChange={toggleAll}
              />
            </th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0">
              <td className="p-2">
                <Checkbox
                  checked={isSelected(user.id)}
                  onCheckedChange={() => toggleRow(user.id)}
                />
              </td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected.length > 0 && (
        <div className="p-2 bg-muted text-sm">
          {selected.length} row(s) selected
        </div>
      )}
    </div>
  )
}
```

## Common Patterns

### Checkbox List

```tsx
const options = [
  { id: 'option1', label: 'Option 1', description: 'First option' },
  { id: 'option2', label: 'Option 2', description: 'Second option' },
  { id: 'option3', label: 'Option 3', description: 'Third option' },
]

export default function CheckboxList() {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option.id} className="flex items-start gap-2">
          <Checkbox id={option.id} className="mt-0.5" />
          <div className="space-y-0.5">
            <Label htmlFor={option.id}>{option.label}</Label>
            <p className="text-sm text-muted-foreground">
              {option.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Agreement Checkbox

```tsx
<Card>
  <CardContent className="pt-6">
    <div className="flex items-start gap-2">
      <Checkbox id="agreement" className="mt-1" />
      <Label htmlFor="agreement" className="text-sm leading-relaxed">
        I agree to the{' '}
        <a href="/terms" className="underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
      </Label>
    </div>
  </CardContent>
</Card>
```

## Best Practices

### Do's
- ✅ Use for multiple selections
- ✅ Provide clear labels
- ✅ Use indeterminate for partial selection
- ✅ Group related checkboxes
- ✅ Show validation errors clearly

### Don'ts
- ❌ Don't use for binary on/off states (use Switch)
- ❌ Don't use for single selection (use Radio Group)
- ❌ Don't make labels too long
- ❌ Don't forget required field indicators
- ❌ Don't hide important information in checkboxes

## Checkbox vs Switch vs Radio

### Use Checkbox When:
- Multiple selections allowed
- Part of form submission
- List of independent options
- Requires explicit save/submit
- Agreement/consent scenarios

### Use Switch When:
- Binary on/off state
- Immediate effect
- Settings and preferences
- Real-time changes

### Use Radio When:
- Single selection only
- Mutually exclusive options
- Must select exactly one option

## Accessibility

- Implements proper ARIA checkbox role
- Keyboard accessible (Space to toggle)
- Focus visible with ring
- Disabled state properly conveyed
- Works with screen readers
- Proper label association with htmlFor
- State announced to assistive technologies
- Indeterminate state conveyed

## Related Components

- [Switch](./SWITCH.README.md) - For binary toggles
- [Radio Group](./RADIO-GROUP.README.md) - For single selection
- [Select](./SELECT.README.md) - For dropdown selection
- [Label](./LABEL.README.md) - For labeling form elements

## Notes

- Built on Base UI Checkbox primitive
- Smooth check animation
- Supports controlled and uncontrolled usage
- Indeterminate state for partial selection
- Works seamlessly in dark mode
- Check icon animates on toggle
- Focus ring for keyboard navigation
- Disabled state with reduced opacity
- Invalid state with red border/ring
- Works in forms with proper name/value
