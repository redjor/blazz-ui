# Combobox

A searchable select component combining a text input with a dropdown list, perfect for long lists with autocomplete and filtering.

## Import

```tsx
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
```

## Usage

### Basic Combobox

```tsx
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
]

<Combobox options={options} placeholder="Select fruit..." />
```

### With Label

```tsx
<div className="space-y-2">
  <Label htmlFor="country">Country</Label>
  <Combobox
    options={countries}
    placeholder="Search countries..."
    searchPlaceholder="Type to search..."
  />
</div>
```

### Controlled Combobox

```tsx
'use client'

import { useState } from 'react'

export default function ControlledCombobox() {
  const [value, setValue] = useState('')

  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ]

  return (
    <Combobox
      value={value}
      onValueChange={setValue}
      options={options}
      placeholder="Select framework..."
    />
  )
}
```

### With Icons

```tsx
import { Globe, Mail, Phone } from 'lucide-react'

const options = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'web', label: 'Website' },
]

<Combobox
  options={options}
  placeholder="Contact method..."
  icon={<Globe className="h-4 w-4" />}
/>
```

### Custom Empty Message

```tsx
<Combobox
  options={options}
  placeholder="Search..."
  searchPlaceholder="Type to search..."
  emptyMessage="No matches found. Try a different search."
/>
```

## API Reference

### Combobox

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled selected value |
| `onValueChange` | `(value: string) => void` | - | Callback when selection changes |
| `options` | `ComboboxOption[]` | `[]` | Array of options (required) |
| `placeholder` | `string` | `"Select..."` | Trigger placeholder |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `emptyMessage` | `string` | `"No results found."` | Message when no matches |
| `className` | `string` | - | Additional CSS classes |
| `icon` | `ReactNode` | - | Optional icon before value |

### ComboboxOption

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Option value (required) |
| `label` | `string` | Display label (required) |
| `suggested` | `boolean` | Mark as suggested option |

## Examples

### Country Selector

```tsx
'use client'

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  // ... more countries
]

export default function CountrySelector() {
  const [country, setCountry] = useState('')

  return (
    <div className="space-y-2">
      <Label>Country</Label>
      <Combobox
        value={country}
        onValueChange={setCountry}
        options={countries}
        placeholder="Select country..."
        searchPlaceholder="Search countries..."
      />
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
  language: z.string().min(1, 'Please select a language'),
})

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
]

export default function ComboboxForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: '',
    },
  })

  return (
    <form onSubmit={form.handleSubmit((data) => console.log(data))}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Preferred Language</Label>
          <Combobox
            value={form.watch('language')}
            onValueChange={(value) => form.setValue('language', value)}
            options={languages}
            placeholder="Select language..."
            searchPlaceholder="Search languages..."
          />
          {form.formState.errors.language && (
            <p className="text-sm text-destructive">
              {form.formState.errors.language.message}
            </p>
          )}
        </div>

        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
```

### Timezone Selector

```tsx
const timezones = [
  { value: 'pst', label: 'Pacific Standard Time (PST)' },
  { value: 'mst', label: 'Mountain Standard Time (MST)' },
  { value: 'cst', label: 'Central Standard Time (CST)' },
  { value: 'est', label: 'Eastern Standard Time (EST)' },
  { value: 'utc', label: 'Coordinated Universal Time (UTC)' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
  { value: 'cet', label: 'Central European Time (CET)' },
  { value: 'jst', label: 'Japan Standard Time (JST)' },
]

<Combobox
  options={timezones}
  placeholder="Select timezone..."
  searchPlaceholder="Search timezones..."
  icon={<Clock className="h-4 w-4" />}
/>
```

### With Suggested Options

```tsx
const frameworks = [
  { value: 'react', label: 'React', suggested: true },
  { value: 'vue', label: 'Vue', suggested: true },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'preact', label: 'Preact' },
]

<Combobox
  options={frameworks}
  placeholder="Select framework..."
  searchPlaceholder="Search frameworks..."
/>
```

### User Selector

```tsx
'use client'

const users = [
  { value: 'john', label: 'John Doe' },
  { value: 'jane', label: 'Jane Smith' },
  { value: 'bob', label: 'Bob Johnson' },
  { value: 'alice', label: 'Alice Williams' },
  { value: 'charlie', label: 'Charlie Brown' },
]

export default function AssignUser() {
  const [assignee, setAssignee] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Task</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Assignee</Label>
          <Combobox
            value={assignee}
            onValueChange={setAssignee}
            options={users}
            placeholder="Select user..."
            searchPlaceholder="Search users..."
            icon={<User className="h-4 w-4" />}
          />
        </div>
      </CardContent>
    </Card>
  )
}
```

### Tags Selector

```tsx
const tags = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'enhancement', label: 'Enhancement' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'question', label: 'Question' },
  { value: 'help-wanted', label: 'Help Wanted' },
  { value: 'good-first-issue', label: 'Good First Issue' },
]

<div className="space-y-2">
  <Label>Tag</Label>
  <Combobox
    options={tags}
    placeholder="Add tag..."
    searchPlaceholder="Search tags..."
    icon={<Tag className="h-4 w-4" />}
  />
</div>
```

### API Autocomplete

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function ApiAutocomplete() {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setOptions([])
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${query}`)
        const data = await response.json()
        setOptions(
          data.map((item: any) => ({
            value: item.id,
            label: item.name,
          }))
        )
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(debounce)
  }, [query])

  return (
    <Combobox
      options={options}
      placeholder={loading ? 'Searching...' : 'Search...'}
      searchPlaceholder="Type to search..."
      emptyMessage={
        query.length < 2
          ? 'Type at least 2 characters'
          : 'No results found'
      }
    />
  )
}
```

### Multi-Step Filter

```tsx
'use client'

export default function MultiStepFilter() {
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
  ]

  const subcategories = {
    electronics: [
      { value: 'phones', label: 'Phones' },
      { value: 'laptops', label: 'Laptops' },
    ],
    clothing: [
      { value: 'shirts', label: 'Shirts' },
      { value: 'pants', label: 'Pants' },
    ],
    books: [
      { value: 'fiction', label: 'Fiction' },
      { value: 'non-fiction', label: 'Non-Fiction' },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Category</Label>
        <Combobox
          value={category}
          onValueChange={(value) => {
            setCategory(value)
            setSubcategory('')
          }}
          options={categories}
          placeholder="Select category..."
        />
      </div>

      {category && (
        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Combobox
            value={subcategory}
            onValueChange={setSubcategory}
            options={subcategories[category as keyof typeof subcategories]}
            placeholder="Select subcategory..."
          />
        </div>
      )}
    </div>
  )
}
```

## Common Patterns

### With Clear Button

```tsx
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function ClearableCombobox() {
  const [value, setValue] = useState('')

  return (
    <div className="relative">
      <Combobox
        value={value}
        onValueChange={setValue}
        options={options}
        placeholder="Select..."
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => setValue('')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
```

### Loading State

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function LoadingCombobox() {
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState([])

  useEffect(() => {
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
      <div className="flex items-center gap-2 h-8 px-2.5 border rounded-lg">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return <Combobox options={options} placeholder="Select..." />
}
```

## Best Practices

### Do's
- ✅ Use for long lists (20+ options)
- ✅ Provide search functionality
- ✅ Show loading states for async data
- ✅ Clear search when closing
- ✅ Highlight matching text

### Don'ts
- ❌ Don't use for short lists (use Select)
- ❌ Don't forget placeholder text
- ❌ Don't show too many options at once
- ❌ Don't make search case-sensitive
- ❌ Don't forget empty state message

## Combobox vs Select vs Autocomplete

### Use Combobox When:
- Many options (20+)
- Search/filter required
- User knows what they're looking for
- Need autocomplete behavior
- Custom option creation needed

### Use Select When:
- Few options (5-20)
- No search needed
- All options should be browsable
- Standard dropdown behavior

### Use Autocomplete When:
- Free-text input with suggestions
- Multiple valid formats
- User creates new entries
- Suggestions are optional

## Accessibility

- Keyboard navigable (Arrow keys, Enter, Escape)
- Screen reader support with ARIA combobox role
- Focus management between input and list
- Type-ahead search
- Proper labeling
- Search input clearly identified
- Selected option announced
- List open/close state conveyed

## Related Components

- [Select](./SELECT.README.md) - For simpler dropdowns
- [Command](./COMMAND.README.md) - For command palette
- [Input](./INPUT.README.md) - For text input
- [Popover](./POPOVER.README.md) - Underlying popover

## Notes

- Built on Command + Popover components
- Combines input and list selection
- Fuzzy search built-in
- Keyboard shortcuts support
- Automatically closes on selection
- Works seamlessly in dark mode
- Responsive positioning
- Smooth animations
- Handles long option lists efficiently
