# Tags Input

A tag management component with keyboard navigation, suggestions dropdown, and customizable styling. Allows users to add, remove, and manage tags efficiently.

## Import

```tsx
import { TagsInput } from '@/components/ui/tags-input'
```

## Usage

### Basic Tags Input

```tsx
'use client'

import { useState } from 'react'

export default function BasicTagsInput() {
  const [tags, setTags] = useState<string[]>([])

  return (
    <TagsInput
      tags={tags}
      onTagsChange={setTags}
      placeholder="Add a tag..."
    />
  )
}
```

### With Initial Tags

```tsx
'use client'

import { useState } from 'react'

export default function WithInitialTags() {
  const [tags, setTags] = useState<string[]>(['React', 'Next.js', 'TypeScript'])

  return (
    <TagsInput
      tags={tags}
      onTagsChange={setTags}
      placeholder="Add more tags..."
    />
  )
}
```

### With Suggestions

```tsx
'use client'

import { useState } from 'react'

export default function WithSuggestions() {
  const [tags, setTags] = useState<string[]>([])

  const suggestions = [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Tailwind CSS',
    'Node.js',
    'Vue',
    'Angular',
    'Svelte',
  ]

  return (
    <TagsInput
      tags={tags}
      onTagsChange={setTags}
      suggestions={suggestions}
      placeholder="Type to see suggestions..."
    />
  )
}
```

### With Max Tags

```tsx
'use client'

import { useState } from 'react'

export default function WithMaxTags() {
  const [tags, setTags] = useState<string[]>([])

  return (
    <div className="space-y-2">
      <TagsInput
        tags={tags}
        onTagsChange={setTags}
        maxTags={5}
        placeholder="Add up to 5 tags..."
      />
      <p className="text-sm text-muted-foreground">
        {tags.length} / 5 tags
      </p>
    </div>
  )
}
```

### With Label

```tsx
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'

export default function WithLabel() {
  const [tags, setTags] = useState<string[]>([])

  return (
    <div className="space-y-2">
      <Label>Skills</Label>
      <TagsInput
        tags={tags}
        onTagsChange={setTags}
        placeholder="Add skills..."
      />
    </div>
  )
}
```

### In Form

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function InForm() {
  const [name, setName] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ name, tags })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Technologies</Label>
        <TagsInput
          tags={tags}
          onTagsChange={setTags}
          placeholder="Add technologies..."
        />
      </div>

      <Button type="submit">Create Project</Button>
    </form>
  )
}
```

## API Reference

### TagsInput

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tags` | `string[]` | - | Array of current tags (required) |
| `onTagsChange` | `(tags: string[]) => void` | - | Callback when tags change (required) |
| `suggestions` | `string[]` | `[]` | Array of suggested tags |
| `placeholder` | `string` | `"Add a tag..."` | Input placeholder text |
| `className` | `string` | - | Additional CSS classes |
| `maxTags` | `number` | - | Maximum number of tags allowed |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Add current input as tag |
| `Backspace` | Remove last tag (when input is empty) |
| `Escape` | Close suggestions dropdown |

## Examples

### Product Tags

```tsx
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function ProductTags() {
  const [tags, setTags] = useState<string[]>(['Featured', 'New Arrival'])

  const suggestions = [
    'Featured',
    'New Arrival',
    'Best Seller',
    'On Sale',
    'Limited Edition',
    'Trending',
    'Popular',
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <TagsInput
          tags={tags}
          onTagsChange={setTags}
          suggestions={suggestions}
          placeholder="Add product tags..."
        />
      </CardContent>
    </Card>
  )
}
```

### Article Keywords

```tsx
'use client'

import { useState } from 'react'

export default function ArticleKeywords() {
  const [keywords, setKeywords] = useState<string[]>([])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">SEO Keywords</label>
      <TagsInput
        tags={keywords}
        onTagsChange={setKeywords}
        maxTags={10}
        placeholder="Add keywords for SEO..."
      />
      <p className="text-xs text-muted-foreground">
        Add up to 10 relevant keywords for better SEO
      </p>
    </div>
  )
}
```

### Email Recipients

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function EmailComposer() {
  const [recipients, setRecipients] = useState<string[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const suggestions = [
    'john@example.com',
    'jane@example.com',
    'team@example.com',
    'support@example.com',
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">To</label>
        <TagsInput
          tags={recipients}
          onTagsChange={setRecipients}
          suggestions={suggestions}
          placeholder="Add email addresses..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Subject</label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />
      </div>

      <Button>Send Email</Button>
    </div>
  )
}
```

### Skills Selector

```tsx
'use client'

import { useState } from 'react'

export default function SkillsSelector() {
  const [skills, setSkills] = useState<string[]>([])

  const suggestions = [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Vue',
    'Angular',
    'Node.js',
    'Python',
    'Java',
    'Go',
    'Rust',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'GCP',
  ]

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your Skills</label>
      <TagsInput
        tags={skills}
        onTagsChange={setSkills}
        suggestions={suggestions}
        maxTags={15}
        placeholder="Add your skills..."
      />
      <p className="text-xs text-muted-foreground">
        {skills.length === 0 && 'Start typing to see suggestions'}
        {skills.length > 0 && `${skills.length} skill${skills.length > 1 ? 's' : ''} selected`}
      </p>
    </div>
  )
}
```

### Category Selector with Validation

```tsx
'use client'

import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function CategorySelector() {
  const [categories, setCategories] = useState<string[]>([])
  const [error, setError] = useState('')

  const suggestions = [
    'Technology',
    'Design',
    'Business',
    'Marketing',
    'Finance',
    'Health',
    'Education',
  ]

  const handleChange = (newCategories: string[]) => {
    setCategories(newCategories)
    if (newCategories.length === 0) {
      setError('Please select at least one category')
    } else if (newCategories.length > 3) {
      setError('Maximum 3 categories allowed')
    } else {
      setError('')
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Categories <span className="text-destructive">*</span>
      </label>
      <TagsInput
        tags={categories}
        onTagsChange={handleChange}
        suggestions={suggestions}
        maxTags={3}
        placeholder="Select categories..."
      />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
```

### Filter Tags

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export default function FilterTags() {
  const [filters, setFilters] = useState<string[]>([])

  const suggestions = [
    'Active',
    'Pending',
    'Completed',
    'Urgent',
    'High Priority',
    'Low Priority',
  ]

  const clearFilters = () => setFilters([])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Filters</label>
        {filters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>
      <TagsInput
        tags={filters}
        onTagsChange={setFilters}
        suggestions={suggestions}
        placeholder="Add filters..."
      />
    </div>
  )
}
```

### Controlled with External Actions

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ControlledTags() {
  const [tags, setTags] = useState<string[]>(['React'])

  const addPreset = (preset: string[]) => {
    setTags((prev) => [...new Set([...prev, ...preset])])
  }

  const frontendPreset = ['React', 'Vue', 'Angular']
  const backendPreset = ['Node.js', 'Python', 'Java']

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addPreset(frontendPreset)}
        >
          Add Frontend Stack
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addPreset(backendPreset)}
        >
          Add Backend Stack
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTags([])}
        >
          Clear All
        </Button>
      </div>

      <TagsInput
        tags={tags}
        onTagsChange={setTags}
        placeholder="Add technologies..."
      />
    </div>
  )
}
```

## Common Patterns

### With Character Limit

```tsx
'use client'

import { useState } from 'react'

export default function WithCharLimit() {
  const [tags, setTags] = useState<string[]>([])

  const handleChange = (newTags: string[]) => {
    // Filter tags to max 20 characters
    const validTags = newTags.filter((tag) => tag.length <= 20)
    setTags(validTags)
  }

  return (
    <div className="space-y-2">
      <TagsInput
        tags={tags}
        onTagsChange={handleChange}
        placeholder="Add tags (max 20 characters)..."
      />
      <p className="text-xs text-muted-foreground">
        Each tag can be up to 20 characters
      </p>
    </div>
  )
}
```

### With Loading State

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function WithLoading() {
  const [tags, setTags] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSuggestions(['React', 'Vue', 'Angular'])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Loading suggestions...
        </span>
      </div>
    )
  }

  return (
    <TagsInput
      tags={tags}
      onTagsChange={setTags}
      suggestions={suggestions}
      placeholder="Add tags..."
    />
  )
}
```

## Best Practices

### Do's
- ✅ Provide relevant suggestions for better UX
- ✅ Set maxTags to prevent excessive tags
- ✅ Use clear placeholder text
- ✅ Show character count when limited
- ✅ Validate tag format (email, URL, etc.)
- ✅ Allow keyboard navigation

### Don'ts
- ❌ Don't allow duplicate tags
- ❌ Don't accept empty tags
- ❌ Don't forget to trim whitespace
- ❌ Don't use for very long lists (use Select)
- ❌ Don't hide the input when max reached
- ❌ Don't allow special characters if not needed

## Accessibility

- Keyboard navigation (Enter to add, Backspace to remove)
- Focus management on input and tag removal buttons
- Clear visual feedback for focused elements
- Screen reader friendly labels
- ARIA attributes for suggestions dropdown
- Touch-friendly remove buttons
- Visible focus indicators

## Related Components

- [Badge](./BADGE.README.md) - Tag display styling
- [Input](./INPUT.README.md) - Base input component
- [Combobox](./COMBOBOX.README.md) - For single selection with search
- [Select](./SELECT.README.md) - For structured options

## Notes

- Client component (uses React state)
- Prevents duplicate tags automatically
- Trims whitespace from tags
- Suggestions filtered by input value
- Dropdown closes on tag selection
- Backspace removes last tag when input is empty
- Disabled when maxTags reached
- Uses Badge component for tag styling
- lucide-react X icon for remove buttons
- Works seamlessly in dark mode
- Responsive layout
- Focus management for accessibility
