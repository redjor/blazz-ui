# Alert

Displays a callout for user attention with optional title, description, and action button.

## Import

```tsx
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from '@/components/ui/alert'
```

## Usage

### Basic Alert

```tsx
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>
```

### With Icon

```tsx
import { Info } from 'lucide-react'

<Alert>
  <Info />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This is an informational message with an icon.
  </AlertDescription>
</Alert>
```

### Destructive Variant

```tsx
import { AlertCircle } from 'lucide-react'

<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

### With Action Button

```tsx
<Alert>
  <Info />
  <AlertTitle>Update Available</AlertTitle>
  <AlertDescription>
    A new version of the app is available.
  </AlertDescription>
  <AlertAction>
    <Button size="sm">Update Now</Button>
  </AlertAction>
</Alert>
```

### With Links

```tsx
<Alert>
  <AlertTitle>Account Verification</AlertTitle>
  <AlertDescription>
    Please verify your email address. Didn't receive the email?{' '}
    <a href="/resend">Resend verification</a>
  </AlertDescription>
</Alert>
```

## API Reference

### Alert (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive"` | `"default"` | Visual style variant |
| `className` | `string` | - | Additional CSS classes |

### AlertTitle

The alert heading.

### AlertDescription

The alert body text. Supports links and basic formatting.

### AlertAction

Optional action button positioned in top-right corner.

## Styling

### Data Slots

- `data-slot="alert"` - Root container
- `data-slot="alert-title"` - Title text
- `data-slot="alert-description"` - Description text
- `data-slot="alert-action"` - Action button

### Variants

```tsx
{/* Default/info style */}
<Alert variant="default">...</Alert>

{/* Error/warning style */}
<Alert variant="destructive">...</Alert>
```

## Examples

### Success Message

```tsx
import { CheckCircle2 } from 'lucide-react'

<Alert className="border-green-500/50 text-green-700 dark:text-green-400">
  <CheckCircle2 />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your changes have been saved successfully.
  </AlertDescription>
</Alert>
```

### Warning Message

```tsx
import { AlertTriangle } from 'lucide-react'

<Alert className="border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
  <AlertTriangle />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    This action cannot be undone. Please proceed with caution.
  </AlertDescription>
</Alert>
```

### Dismissible Alert

```tsx
'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

export default function DismissibleAlert() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <Alert>
      <Info />
      <AlertTitle>Notification</AlertTitle>
      <AlertDescription>
        This is a dismissible alert message.
      </AlertDescription>
      <AlertAction>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertAction>
    </Alert>
  )
}
```

### Multi-paragraph Alert

```tsx
<Alert>
  <AlertTriangle />
  <AlertTitle>Important Update</AlertTitle>
  <AlertDescription>
    <p>
      We're updating our terms of service. These changes will take
      effect on January 1, 2026.
    </p>
    <p>
      Please review the new terms carefully. Continued use of our
      service constitutes acceptance of these terms.
    </p>
    <p>
      <a href="/terms">Read the full terms</a>
    </p>
  </AlertDescription>
</Alert>
```

### Form Validation Alert

```tsx
<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Validation Error</AlertTitle>
  <AlertDescription>
    <ul className="list-disc list-inside space-y-1">
      <li>Email is required</li>
      <li>Password must be at least 8 characters</li>
      <li>Passwords do not match</li>
    </ul>
  </AlertDescription>
</Alert>
```

### API Error Alert

```tsx
<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Connection Error</AlertTitle>
  <AlertDescription>
    Unable to connect to the server. Please check your internet
    connection and try again.
  </AlertDescription>
  <AlertAction>
    <Button size="sm" variant="outline" onClick={retry}>
      Retry
    </Button>
  </AlertAction>
</Alert>
```

### Maintenance Notice

```tsx
<Alert>
  <Wrench />
  <AlertTitle>Scheduled Maintenance</AlertTitle>
  <AlertDescription>
    We'll be performing maintenance on Saturday, Jan 20 from 2:00 AM
    to 4:00 AM EST. Some features may be temporarily unavailable.
  </AlertDescription>
</Alert>
```

### Feature Announcement

```tsx
<Alert className="border-blue-500/50">
  <Sparkles />
  <AlertTitle>New Feature Available!</AlertTitle>
  <AlertDescription>
    Check out our new dark mode. You can toggle it from the settings
    menu.
  </AlertDescription>
  <AlertAction>
    <Button size="sm">Try It Now</Button>
  </AlertAction>
</Alert>
```

## Common Patterns

### Alert with Progress

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function ProgressAlert() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 10))
    }, 500)
    return () => clearInterval(timer)
  }, [])

  return (
    <Alert>
      <Download />
      <AlertTitle>Downloading Update</AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          <p>{progress}% complete</p>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
```

### Conditional Alert

```tsx
{error && (
  <Alert variant="destructive">
    <AlertCircle />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)}
```

### Alert Stack

```tsx
<div className="space-y-4">
  <Alert>
    <Info />
    <AlertTitle>Info</AlertTitle>
    <AlertDescription>Informational message</AlertDescription>
  </Alert>

  <Alert variant="destructive">
    <AlertCircle />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>Error message</AlertDescription>
  </Alert>
</div>
```

## Best Practices

### Do's
- ✅ Use for important system messages
- ✅ Keep messages concise and actionable
- ✅ Use appropriate icons for context
- ✅ Provide clear next steps
- ✅ Use destructive variant for errors

### Don'ts
- ❌ Don't overuse alerts (causes alert fatigue)
- ❌ Don't use for every small message (use Toast)
- ❌ Don't nest alerts
- ❌ Don't make alerts too long
- ❌ Don't forget icons for visual context

## Alert vs Toast

### Use Alert When:
- Message is critical/persistent
- User must acknowledge before continuing
- Context-specific to page content
- Multiple pieces of information
- Permanent placement on page

### Use Toast When:
- Temporary notification
- Operation feedback (success/error)
- Non-blocking message
- Auto-dismiss appropriate
- Global notifications

## Accessibility

- Uses `role="alert"` for screen readers
- Icon included in alert reading
- Links properly announced
- Color is not sole indicator (icon + text)
- Keyboard accessible actions

## Related Components

- [Toast](./TOAST.README.md) - For temporary notifications
- [Badge](./BADGE.README.md) - For inline status indicators
- [Dialog](./DIALOG.README.md) - For modal confirmations

## Notes

- Icons automatically size to 16px (h-4 w-4)
- Icons span both title and description rows
- Links in description automatically styled
- Action button absolutely positioned
- Supports multi-paragraph content
- Works seamlessly in dark mode
