# Confirmation Dialog

A reusable confirmation dialog component for critical actions. Provides consistent UI for user confirmations with customizable messaging and destructive variant support.

## Import

```tsx
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
```

## Usage

### Basic Confirmation

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function BasicConfirmation() {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    console.log('Action confirmed')
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Confirmation
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Are you sure?"
        description="This action will proceed. Do you want to continue?"
        onConfirm={handleConfirm}
      />
    </>
  )
}
```

### Destructive Action

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function DeleteConfirmation() {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    console.log('Item deleted')
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Item
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}
```

### Custom Labels

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function CustomLabels() {
  const [open, setOpen] = useState(false)

  const handlePublish = () => {
    console.log('Article published')
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Publish Article
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Publish Article"
        description="Once published, this article will be visible to all users. Are you ready to publish?"
        confirmLabel="Publish Now"
        cancelLabel="Not Yet"
        onConfirm={handlePublish}
      />
    </>
  )
}
```

### Async Action

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function AsyncConfirmation() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await fetch('/api/items/123', { method: 'DELETE' })
      console.log('Item deleted successfully')
    } catch (error) {
      console.error('Failed to delete item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={loading}>
        Delete Item
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Item"
        description="Are you sure? This action cannot be undone."
        confirmLabel={loading ? 'Deleting...' : 'Delete'}
        variant="destructive"
        onConfirm={handleConfirm}
      />
    </>
  )
}
```

## API Reference

### ConfirmationDialog

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state (required) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes (required) |
| `title` | `string` | `"Are you sure?"` | Dialog title |
| `description` | `string` | - | Dialog description (required) |
| `confirmLabel` | `string` | `"Continue"` | Confirm button label |
| `cancelLabel` | `string` | `"Cancel"` | Cancel button label |
| `onConfirm` | `() => void \| Promise<void>` | - | Callback when confirmed (required) |
| `variant` | `"default" \| "destructive"` | `"default"` | Visual variant for confirm button |

## Examples

### Delete User Account

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserX } from 'lucide-react'

export default function DeleteAccount() {
  const [open, setOpen] = useState(false)

  const handleDeleteAccount = async () => {
    await fetch('/api/account', { method: 'DELETE' })
    // Redirect to login
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
      >
        <UserX className="mr-2 h-4 w-4" />
        Delete Account
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Account"
        description="This will permanently delete your account and all associated data. This action cannot be undone and you will lose access immediately."
        confirmLabel="Delete My Account"
        cancelLabel="Keep My Account"
        variant="destructive"
        onConfirm={handleDeleteAccount}
      />
    </>
  )
}
```

### Discard Changes

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function DiscardChanges() {
  const [open, setOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(true)
  const router = useRouter()

  const handleDiscard = () => {
    router.push('/dashboard')
  }

  const handleCancel = () => {
    if (hasChanges) {
      setOpen(true)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={handleCancel} variant="outline">
          Cancel
        </Button>
        <Button>Save Changes</Button>
      </div>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Discard Changes"
        description="You have unsaved changes. Are you sure you want to leave? All changes will be lost."
        confirmLabel="Discard Changes"
        cancelLabel="Keep Editing"
        variant="destructive"
        onConfirm={handleDiscard}
      />
    </>
  )
}
```

### Bulk Delete

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function BulkDelete() {
  const [open, setOpen] = useState(false)
  const [selectedItems] = useState([1, 2, 3])

  const handleBulkDelete = async () => {
    await Promise.all(
      selectedItems.map((id) =>
        fetch(`/api/items/${id}`, { method: 'DELETE' })
      )
    )
    console.log('Items deleted')
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        disabled={selectedItems.length === 0}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete {selectedItems.length} Items
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Multiple Items"
        description={`Are you sure you want to delete ${selectedItems.length} selected items? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedItems.length} Items`}
        variant="destructive"
        onConfirm={handleBulkDelete}
      />
    </>
  )
}
```

### Sign Out

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function SignOut() {
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Sign Out"
        description="Are you sure you want to sign out? You'll need to sign in again to access your account."
        confirmLabel="Sign Out"
        cancelLabel="Stay Signed In"
        onConfirm={handleSignOut}
      />
    </>
  )
}
```

### Cancel Subscription

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function CancelSubscription() {
  const [open, setOpen] = useState(false)

  const handleCancel = async () => {
    await fetch('/api/subscription/cancel', { method: 'POST' })
    console.log('Subscription cancelled')
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Cancel Subscription
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel Subscription"
        description="Your subscription will be cancelled immediately and you'll lose access to premium features. You can resubscribe anytime."
        confirmLabel="Cancel Subscription"
        cancelLabel="Keep Subscription"
        variant="destructive"
        onConfirm={handleCancel}
      />
    </>
  )
}
```

### Leave Page

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LeavePage() {
  const [open, setOpen] = useState(false)
  const [nextPath, setNextPath] = useState('')
  const [hasChanges, setHasChanges] = useState(true)
  const router = useRouter()

  const handleLeave = () => {
    setHasChanges(false)
    router.push(nextPath)
  }

  // Prevent navigation if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={setOpen}
      title="Leave Page"
      description="You have unsaved changes. If you leave now, all changes will be lost."
      confirmLabel="Leave Page"
      cancelLabel="Stay on Page"
      variant="destructive"
      onConfirm={handleLeave}
    />
  )
}
```

### Archive Item

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Archive } from 'lucide-react'

export default function ArchiveItem() {
  const [open, setOpen] = useState(false)

  const handleArchive = async () => {
    await fetch('/api/items/123/archive', { method: 'POST' })
    console.log('Item archived')
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Archive className="mr-2 h-4 w-4" />
        Archive
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Archive Item"
        description="This item will be moved to the archive. You can restore it later from the archive section."
        confirmLabel="Archive"
        onConfirm={handleArchive}
      />
    </>
  )
}
```

### Reset Settings

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

export default function ResetSettings() {
  const [open, setOpen] = useState(false)

  const handleReset = () => {
    // Reset all settings to defaults
    console.log('Settings reset to defaults')
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset to Defaults
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Reset Settings"
        description="This will reset all settings to their default values. Your custom configurations will be lost."
        confirmLabel="Reset Settings"
        variant="destructive"
        onConfirm={handleReset}
      />
    </>
  )
}
```

## Common Patterns

### With Loading State

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function WithLoading() {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsDeleting(false)
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={(open) => !isDeleting && setOpen(open)}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}
```

### Conditional Confirmation

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ConditionalConfirmation() {
  const [open, setOpen] = useState(false)
  const hasImportantData = true

  const handleAction = () => {
    if (hasImportantData) {
      setOpen(true)
    } else {
      // Execute directly without confirmation
      executeAction()
    }
  }

  const executeAction = () => {
    console.log('Action executed')
  }

  return (
    <>
      <Button onClick={handleAction}>Perform Action</Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Important Data Detected"
        description="This action will affect important data. Please confirm you want to proceed."
        onConfirm={executeAction}
      />
    </>
  )
}
```

## Best Practices

### Do's
- ✅ Use for destructive or irreversible actions
- ✅ Provide clear, specific descriptions
- ✅ Use destructive variant for dangerous actions
- ✅ Customize button labels to match action
- ✅ Handle async operations properly
- ✅ Close dialog after confirmation

### Don'ts
- ❌ Don't overuse for trivial actions
- ❌ Don't use vague descriptions
- ❌ Don't forget to handle loading states
- ❌ Don't allow confirmation while loading
- ❌ Don't use default labels for critical actions
- ❌ Don't nest confirmation dialogs

## Accessibility

- Keyboard accessible (Enter, Escape)
- Focus trapped within dialog
- Focus returns to trigger on close
- Screen reader support with ARIA
- Clear action buttons with labels
- Proper semantic structure
- Visual indicators for destructive actions

## Related Components

- [Dialog](./DIALOG.README.md) - Base dialog component
- [Button](./BUTTON.README.md) - Action buttons
- [Alert](./ALERT.README.md) - Non-modal warnings

## Notes

- Client component (requires state management)
- Built on Dialog component
- Closes automatically after confirmation
- Supports sync and async confirmations
- No close button in header (intentional)
- Destructive variant uses red styling
- Default variant uses primary styling
- Cannot be dismissed while loading
- Works seamlessly in dark mode
- Keyboard shortcuts (Enter to confirm, Escape to cancel)
- Focus management handled automatically
