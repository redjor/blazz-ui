# Textarea

A multi-line text input control that auto-resizes based on content.

## Import

```tsx
import { Textarea } from '@/components/ui/textarea'
```

## Usage

### Basic Textarea

```tsx
<Textarea placeholder="Enter your message..." />
```

### With Label

```tsx
<Field name="bio" label="Bio">
  <Textarea placeholder="Tell us about yourself" />
</Field>
```

### Controlled

```tsx
'use client'

import { useState } from 'react'

export default function ControlledTextarea() {
  const [value, setValue] = useState('')

  return (
    <div>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Character count: {value.length}
      </p>
    </div>
  )
}
```

### With Max Length

```tsx
<Textarea
  placeholder="Max 500 characters"
  maxLength={500}
/>
```

### Disabled State

```tsx
<Textarea
  placeholder="This field is disabled"
  disabled
/>
```

### Read-only

```tsx
<Textarea
  value="This content cannot be edited"
  readOnly
/>
```

### With Error State

```tsx
<Field name="description" label="Description" error="Description is required">
  <Textarea
    placeholder="Enter description"
    aria-invalid="true"
  />
</Field>
```

## API Reference

### Textarea

Extends native HTML `<textarea>` element props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Controlled value |
| `defaultValue` | `string` | - | Default value (uncontrolled) |
| `onChange` | `(e: ChangeEvent<HTMLTextAreaElement>) => void` | - | Change handler |
| `disabled` | `boolean` | `false` | Whether the textarea is disabled |
| `readOnly` | `boolean` | `false` | Whether the textarea is read-only |
| `required` | `boolean` | `false` | Whether the field is required |
| `maxLength` | `number` | - | Maximum character length |
| `rows` | `number` | - | Initial number of rows |
| `className` | `string` | - | Additional CSS classes |

## Styling

### Data Slot

- `data-slot="textarea"` - Main textarea element

### States

- **Focus**: Focus ring with ring color
- **Invalid**: Red border and ring when `aria-invalid="true"`
- **Disabled**: Reduced opacity and cursor not-allowed

### Default Classes

```css
/* Base styles */
border-input bg-transparent
rounded-lg border
px-2.5 py-2
text-base md:text-sm

/* Focus state */
focus-visible:border-ring
focus-visible:ring-ring/50
focus-visible:ring-[3px]

/* Invalid state */
aria-invalid:border-destructive
aria-invalid:ring-destructive/20
aria-invalid:ring-[3px]

/* Disabled state */
disabled:bg-input/50
disabled:cursor-not-allowed
disabled:opacity-50

/* Auto-resize */
field-sizing-content
min-h-16
```

### Custom Styling

```tsx
{/* Custom height */}
<Textarea className="min-h-32" />

{/* Fixed size (no auto-resize) */}
<Textarea className="field-sizing-fixed h-24 resize-none" />

{/* Allow manual resize */}
<Textarea className="resize-vertical" />
```

## Features

### Auto-Resize

The textarea uses the `field-sizing-content` property to automatically grow as content is added:

```tsx
<Textarea
  placeholder="This textarea grows with content..."
  className="min-h-16 max-h-64"
/>
```

### Character Counter

```tsx
'use client'

import { useState } from 'react'

export default function TextareaWithCounter() {
  const [value, setValue] = useState('')
  const maxLength = 500

  return (
    <div>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        placeholder="Enter your message..."
      />
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <span>{value.length} / {maxLength} characters</span>
        <span>{maxLength - value.length} remaining</span>
      </div>
    </div>
  )
}
```

## Accessibility

### Keyboard Navigation

- `Tab` - Moves focus to/from textarea
- `Shift+Tab` - Moves focus backwards
- `Enter` - Inserts new line
- Native textarea keyboard behavior

### ARIA Attributes

```tsx
<Textarea
  aria-label="Message"
  aria-describedby="message-description"
  aria-required="true"
  aria-invalid={hasError}
/>
```

### Screen Reader Support

- Announces "multi-line text field" or "text area"
- Announces placeholder text
- Announces invalid state
- Announces required state

## Examples

### Comment Form

```tsx
<form className="space-y-4">
  <Field name="comment" label="Your Comment" required>
    <Textarea
      placeholder="What are your thoughts?"
      className="min-h-24"
      required
    />
  </Field>
  <Button type="submit">Post Comment</Button>
</form>
```

### Feedback Form

```tsx
'use client'

import { useState } from 'react'

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('')
  const minLength = 20

  return (
    <div className="space-y-4">
      <Field
        name="feedback"
        label="Your Feedback"
        description="Please provide detailed feedback (minimum 20 characters)"
      >
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you think..."
          className="min-h-32"
        />
      </Field>

      {feedback.length > 0 && feedback.length < minLength && (
        <p className="text-sm text-destructive">
          Please write at least {minLength - feedback.length} more characters
        </p>
      )}

      <Button
        type="submit"
        disabled={feedback.length < minLength}
      >
        Submit Feedback
      </Button>
    </div>
  )
}
```

### Note Taking

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function NoteTaker() {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  // Auto-save on change
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('note', note)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [note])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Quick Note</Label>
        {saved && (
          <span className="text-sm text-green-600">
            ✓ Saved
          </span>
        )}
      </div>
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot down your thoughts..."
        className="min-h-48"
      />
    </div>
  )
}
```

### Multi-Field Form

```tsx
<form className="space-y-6">
  <Field name="title" label="Title" required>
    <Input placeholder="Enter a title" />
  </Field>

  <Field name="summary" label="Summary" required>
    <Textarea
      placeholder="Brief summary (2-3 sentences)"
      className="min-h-20"
      maxLength={200}
    />
  </Field>

  <Field name="content" label="Content" required>
    <Textarea
      placeholder="Full content..."
      className="min-h-48"
    />
  </Field>

  <div className="flex gap-2">
    <Button variant="outline">Save Draft</Button>
    <Button type="submit">Publish</Button>
  </div>
</form>
```

### Code Snippet Input

```tsx
<Field name="code" label="Code Snippet">
  <Textarea
    placeholder="Paste your code here..."
    className="min-h-48 font-mono text-sm field-sizing-fixed resize-y"
    spellCheck={false}
  />
</Field>
```

## Common Patterns

### Markdown Editor

```tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('')

  return (
    <Tabs defaultValue="write">
      <TabsList>
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="write">
        <Textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="# Start writing..."
          className="min-h-64 font-mono"
        />
      </TabsContent>

      <TabsContent value="preview">
        <div className="min-h-64 p-4 border rounded-lg">
          {/* Render markdown preview */}
          <div dangerouslySetInnerHTML={{ __html: markdown }} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
```

### Template Selection

```tsx
const templates = [
  { name: 'Bug Report', content: '## Bug Description\n\n...' },
  { name: 'Feature Request', content: '## Feature Proposal\n\n...' },
]

export default function TemplateTextarea() {
  const [content, setContent] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {templates.map((template) => (
          <Button
            key={template.name}
            variant="outline"
            size="sm"
            onClick={() => setContent(template.content)}
          >
            {template.name}
          </Button>
        ))}
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Or write from scratch..."
        className="min-h-48"
      />
    </div>
  )
}
```

## Best Practices

### Do's

- ✅ Use for multi-line text input
- ✅ Provide clear placeholder text
- ✅ Show character count for limited fields
- ✅ Auto-save drafts for long-form content
- ✅ Provide adequate height for expected content
- ✅ Use with Field component for proper labeling

### Don'ts

- ❌ Don't use for single-line input (use Input instead)
- ❌ Don't make too small (min 3-4 rows visible)
- ❌ Don't forget to handle overflow for very long content
- ❌ Don't disable resize if users might need more space
- ❌ Don't use for structured data (use form fields)

## Textarea vs Input

### Use Textarea When:
- Input is expected to be multi-line
- Content length is > 100 characters
- Line breaks are meaningful
- Writing messages, descriptions, comments
- Code snippets or formatted text

### Use Input When:
- Single-line input only
- Short values (name, email, title)
- Structured data (dates, numbers)
- Search queries

## Related Components

- [Input](./INPUT.README.md) - For single-line text input
- [Field](./FIELD.README.md) - Form field wrapper with label and error
- [Form](./FORM.README.md) - Form component with validation

## Notes

- Uses `field-sizing-content` for automatic height adjustment
- Minimum height set to `4rem` (16 in Tailwind)
- Automatically handles dark mode styling
- Focus ring uses `ring-ring` color with 50% opacity
- Invalid state uses `destructive` color scheme
- Supports all native textarea attributes
- Works with form libraries like react-hook-form
- Inherits text color from parent
