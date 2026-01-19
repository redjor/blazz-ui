# Dialog

A modal dialog that overlays the page, interrupting the user to request information or an action.

## Import

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
```

## Usage

### Basic Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        This is a dialog description explaining what's happening.
      </DialogDescription>
    </DialogHeader>
    <p>Dialog content goes here.</p>
  </DialogContent>
</Dialog>
```

### With Footer

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to proceed with this action?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Without Close Button

```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>Important Message</DialogTitle>
      <DialogDescription>
        You must acknowledge this message.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button>I Understand</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Controlled Dialog

```tsx
'use client'

import { useState } from 'react'

export default function ControlledDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Dialog</DialogTitle>
            <DialogDescription>
              This dialog's state is controlled by React.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

## API Reference

### Dialog (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |

### DialogTrigger

| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Compose with child element |

### DialogContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showCloseButton` | `boolean` | `true` | Show X button in top-right |
| `className` | `string` | - | Additional CSS classes |

### DialogHeader

Container for title and description.

### DialogTitle

The dialog heading (required for accessibility).

### DialogDescription

Supporting text below the title.

### DialogFooter

Footer section for action buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showCloseButton` | `boolean` | `false` | Show Close button in footer |

### DialogClose

Closes the dialog when clicked.

## Styling

### Data Slots

- `data-slot="dialog"` - Root
- `data-slot="dialog-trigger"` - Trigger button
- `data-slot="dialog-content"` - Main content
- `data-slot="dialog-overlay"` - Backdrop
- `data-slot="dialog-header"` - Header section
- `data-slot="dialog-title"` - Title text
- `data-slot="dialog-description"` - Description text
- `data-slot="dialog-footer"` - Footer section
- `data-slot="dialog-close"` - Close button

### Custom Width

```tsx
<DialogContent className="sm:max-w-md">
  {/* Content */}
</DialogContent>

<DialogContent className="sm:max-w-lg">
  {/* Wider content */}
</DialogContent>

<DialogContent className="sm:max-w-2xl">
  {/* Even wider */}
</DialogContent>
```

## Examples

### Confirmation Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete
        your data from our servers.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Create User</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Create New User</DialogTitle>
      <DialogDescription>
        Add a new user to your team
      </DialogDescription>
    </DialogHeader>
    <form className="space-y-4">
      <Field name="name" label="Name" required>
        <Input placeholder="John Doe" />
      </Field>
      <Field name="email" label="Email" required>
        <Input type="email" placeholder="john@example.com" />
      </Field>
      <Field name="role" label="Role">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </form>
    <DialogFooter>
      <Button type="submit">Create User</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Info Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">
      <Info className="mr-2 h-4 w-4" />
      Learn More
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>About This Feature</DialogTitle>
      <DialogDescription>
        Learn how to use this powerful feature
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4 text-sm">
      <p>
        This feature allows you to manage your settings with ease.
        Here's how it works:
      </p>
      <ol className="list-decimal list-inside space-y-2">
        <li>First, configure your preferences</li>
        <li>Then, save your changes</li>
        <li>Finally, apply them across your account</li>
      </ol>
      <p className="text-muted-foreground">
        Need help? Check our <a href="/docs">documentation</a>.
      </p>
    </div>
  </DialogContent>
</Dialog>
```

### Multi-Step Dialog

```tsx
'use client'

import { useState } from 'react'

export default function MultiStepDialog() {
  const [step, setStep] = useState(1)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Start Setup</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup - Step {step} of 3</DialogTitle>
          <DialogDescription>
            Complete the setup process
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <p>Step 1 content</p>
            <Field name="name" label="Your Name">
              <Input />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p>Step 2 content</p>
            <Field name="email" label="Email">
              <Input type="email" />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p>Step 3 - Review and confirm</p>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button>Finish</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Loading Dialog

```tsx
<Dialog open={isLoading} onOpenChange={setIsLoading}>
  <DialogContent showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>Processing...</DialogTitle>
      <DialogDescription>
        Please wait while we process your request
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  </DialogContent>
</Dialog>
```

### Image Preview Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <button>
      <img
        src="/thumb.jpg"
        alt="Preview"
        className="h-24 w-24 object-cover rounded"
      />
    </button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-3xl">
    <img
      src="/full.jpg"
      alt="Full size"
      className="w-full h-auto"
    />
  </DialogContent>
</Dialog>
```

### Terms & Conditions

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="link">Read Terms</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-2xl">
    <DialogHeader>
      <DialogTitle>Terms and Conditions</DialogTitle>
      <DialogDescription>
        Last updated: January 2026
      </DialogDescription>
    </DialogHeader>
    <ScrollArea className="h-96">
      <div className="space-y-4 text-sm">
        <h3 className="font-semibold">1. Agreement to Terms</h3>
        <p>By accessing our service, you agree to these terms...</p>
        {/* More terms */}
      </div>
    </ScrollArea>
    <DialogFooter>
      <DialogClose asChild>
        <Button>I Agree</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Common Patterns

### Async Action with Loading

```tsx
'use client'

import { useState } from 'react'

export default function AsyncDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await performAction()
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Prevent Accidental Close

```tsx
'use client'

import { useState } from 'react'

export default function PreventCloseDialog() {
  const [hasChanges, setHasChanges] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open && hasChanges) {
      const confirm = window.confirm('You have unsaved changes. Close anyway?')
      if (!confirm) return
    }
    setOpen(open)
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      {/* Content */}
    </Dialog>
  )
}
```

## Best Practices

### Do's
- ✅ Use for critical information/actions
- ✅ Keep content focused and clear
- ✅ Provide clear action buttons
- ✅ Include title and description
- ✅ Disable backdrop click when important

### Don'ts
- ❌ Don't nest dialogs
- ❌ Don't use for non-critical info (use Popover)
- ❌ Don't make dialogs too large
- ❌ Don't forget escape/close mechanisms
- ❌ Don't overuse (causes dialog fatigue)

## Dialog vs Sheet vs Popover

### Use Dialog When:
- Critical information
- Must complete action
- User attention required
- Decision needed
- Blocking interaction

### Use Sheet When:
- Supplementary content
- Filters or settings
- Mobile-friendly
- Non-blocking
- Contextual information

### Use Popover When:
- Rich tooltips
- Small forms
- Quick actions
- Non-critical
- Lightweight content

## Accessibility

- Focus trapped within dialog
- Escape key closes dialog
- Focus returns to trigger on close
- Proper ARIA attributes
- Title required for screen readers
- Backdrop prevents interaction
- Keyboard accessible

## Related Components

- [Sheet](./SHEET.README.md) - For slide-in panels
- [Popover](./POPOVER.README.md) - For lightweight content
- [Alert](./ALERT.README.md) - For inline messages

## Notes

- Centered on screen
- Blurred backdrop overlay
- Smooth fade + zoom animations
- Click overlay or press Escape to close
- Default max-width: 448px (sm:max-w-sm)
- Close button in top-right by default
- Footer has muted background
- Built on Base UI Dialog primitive
- Works seamlessly in dark mode
