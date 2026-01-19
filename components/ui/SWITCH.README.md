# Switch

A toggle switch for binary on/off states with smooth animations and accessibility support.

## Import

```tsx
import { Switch } from '@/components/ui/switch'
```

## Usage

### Basic Switch

```tsx
<Switch />
```

### With Label

```tsx
<div className="flex items-center gap-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>
```

### Controlled Switch

```tsx
'use client'

import { useState } from 'react'

export default function ControlledSwitch() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Switch checked={enabled} onCheckedChange={setEnabled} />
      <Label>Notifications {enabled ? 'Enabled' : 'Disabled'}</Label>
    </div>
  )
}
```

### Sizes

```tsx
{/* Small */}
<Switch size="sm" />

{/* Default */}
<Switch />
```

### Disabled State

```tsx
<Switch disabled />
<Switch checked disabled />
```

### With Description

```tsx
<div className="flex items-center justify-between">
  <div className="space-y-0.5">
    <Label htmlFor="marketing">Marketing Emails</Label>
    <p className="text-sm text-muted-foreground">
      Receive emails about new products and features
    </p>
  </div>
  <Switch id="marketing" />
</div>
```

## API Reference

### Switch

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Default checked state (uncontrolled) |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when state changes |
| `disabled` | `boolean` | `false` | Whether the switch is disabled |
| `required` | `boolean` | `false` | Whether the switch is required |
| `name` | `string` | - | Name for form submission |
| `value` | `string` | `"on"` | Value for form submission when checked |
| `size` | `"sm" \| "default"` | `"default"` | Size variant |
| `className` | `string` | - | Additional CSS classes |

## Styling

### Data Slots

- `data-slot="switch"` - Root container
- `data-slot="switch-thumb"` - Moving thumb element

### Data Attributes

```css
/* Checked state */
[data-slot="switch"][data-checked] { }

/* Disabled state */
[data-slot="switch"][data-disabled] { }

/* Size variants */
[data-slot="switch"][data-size="sm"] { }
[data-slot="switch"][data-size="default"] { }
```

## Examples

### Settings Panel

```tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <div>
      <Label htmlFor="push">Push Notifications</Label>
      <p className="text-sm text-muted-foreground">
        Send notifications to your device
      </p>
    </div>
    <Switch id="push" defaultChecked />
  </div>

  <div className="flex items-center justify-between">
    <div>
      <Label htmlFor="email">Email Notifications</Label>
      <p className="text-sm text-muted-foreground">
        Receive email updates
      </p>
    </div>
    <Switch id="email" />
  </div>

  <div className="flex items-center justify-between">
    <div>
      <Label htmlFor="sms">SMS Notifications</Label>
      <p className="text-sm text-muted-foreground">
        Get updates via text message
      </p>
    </div>
    <Switch id="sms" />
  </div>
</div>
```

### Feature Flags

```tsx
'use client'

import { useState } from 'react'

export default function FeatureFlags() {
  const [features, setFeatures] = useState({
    darkMode: false,
    analytics: true,
    betaFeatures: false,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Dark Mode</Label>
        <Switch
          checked={features.darkMode}
          onCheckedChange={(checked) =>
            setFeatures({ ...features, darkMode: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Analytics</Label>
        <Switch
          checked={features.analytics}
          onCheckedChange={(checked) =>
            setFeatures({ ...features, analytics: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Beta Features</Label>
        <Switch
          checked={features.betaFeatures}
          onCheckedChange={(checked) =>
            setFeatures({ ...features, betaFeatures: checked })
          }
        />
      </div>
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
  marketingEmails: z.boolean(),
  securityEmails: z.boolean(),
})

export default function NotificationForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketingEmails: false,
      securityEmails: true,
    },
  })

  return (
    <form onSubmit={form.handleSubmit((data) => console.log(data))}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="marketing">Marketing Emails</Label>
          <Switch
            id="marketing"
            checked={form.watch('marketingEmails')}
            onCheckedChange={(checked) =>
              form.setValue('marketingEmails', checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="security">Security Alerts</Label>
          <Switch
            id="security"
            checked={form.watch('securityEmails')}
            onCheckedChange={(checked) =>
              form.setValue('securityEmails', checked)
            }
          />
        </div>

        <Button type="submit">Save Preferences</Button>
      </div>
    </form>
  )
}
```

### Privacy Settings

```tsx
<Card>
  <CardHeader>
    <CardTitle>Privacy Settings</CardTitle>
    <CardDescription>
      Manage your privacy and data sharing preferences
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="public-profile">Public Profile</Label>
        <p className="text-sm text-muted-foreground">
          Make your profile visible to everyone
        </p>
      </div>
      <Switch id="public-profile" />
    </div>

    <Separator />

    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="show-activity">Show Activity</Label>
        <p className="text-sm text-muted-foreground">
          Let others see when you're active
        </p>
      </div>
      <Switch id="show-activity" defaultChecked />
    </div>

    <Separator />

    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="data-sharing">Data Sharing</Label>
        <p className="text-sm text-muted-foreground">
          Share anonymous usage data to help improve the app
        </p>
      </div>
      <Switch id="data-sharing" />
    </div>
  </CardContent>
</Card>
```

### With Loading State

```tsx
'use client'

import { useState } from 'react'

export default function LoadingSwitch() {
  const [loading, setLoading] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const handleChange = async (checked: boolean) => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setEnabled(checked)
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={enabled}
        onCheckedChange={handleChange}
        disabled={loading}
      />
      <Label>
        {loading ? 'Updating...' : enabled ? 'Enabled' : 'Disabled'}
      </Label>
    </div>
  )
}
```

### Confirmation on Change

```tsx
'use client'

import { useState } from 'react'

export default function ConfirmSwitch() {
  const [enabled, setEnabled] = useState(false)

  const handleChange = (checked: boolean) => {
    if (checked) {
      const confirmed = window.confirm(
        'Are you sure you want to enable this feature?'
      )
      if (confirmed) {
        setEnabled(true)
      }
    } else {
      setEnabled(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={enabled} onCheckedChange={handleChange} />
      <Label>Dangerous Feature</Label>
    </div>
  )
}
```

## Common Patterns

### Settings List

```tsx
const settings = [
  {
    id: 'notifications',
    label: 'Push Notifications',
    description: 'Receive push notifications on your device',
    defaultChecked: true,
  },
  {
    id: 'email',
    label: 'Email Updates',
    description: 'Get weekly email updates',
    defaultChecked: false,
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    description: 'Subscribe to our monthly newsletter',
    defaultChecked: false,
  },
]

export default function SettingsList() {
  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <div key={setting.id} className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor={setting.id}>{setting.label}</Label>
            <p className="text-sm text-muted-foreground">
              {setting.description}
            </p>
          </div>
          <Switch id={setting.id} defaultChecked={setting.defaultChecked} />
        </div>
      ))}
    </div>
  )
}
```

### Grouped Switches

```tsx
<div className="space-y-6">
  <div>
    <h3 className="text-lg font-medium mb-4">Communication</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Email</Label>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <Label>SMS</Label>
        <Switch />
      </div>
    </div>
  </div>

  <Separator />

  <div>
    <h3 className="text-lg font-medium mb-4">Privacy</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Public Profile</Label>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <Label>Show Activity</Label>
        <Switch defaultChecked />
      </div>
    </div>
  </div>
</div>
```

## Best Practices

### Do's
- ✅ Use for binary on/off states
- ✅ Include descriptive labels
- ✅ Provide clear visual feedback
- ✅ Use for settings and preferences
- ✅ Place label to the left of switch

### Don'ts
- ❌ Don't use for multiple choice (use Radio Group)
- ❌ Don't use for single selection from list (use Select)
- ❌ Don't forget to disable during loading
- ❌ Don't use for actions (use Button)
- ❌ Don't hide important information in switches

## Switch vs Checkbox

### Use Switch When:
- Binary state (on/off, enabled/disabled)
- Immediate effect when toggled
- Settings and preferences
- Feature toggles
- Real-time changes

### Use Checkbox When:
- Multiple selections possible
- Part of a form submission
- Requires explicit save/submit
- Agreement/consent scenarios
- List of independent options

## Accessibility

- Implements proper ARIA switch role
- Keyboard accessible (Space/Enter to toggle)
- Focus visible with ring
- Disabled state properly conveyed
- Works with screen readers
- Proper label association with htmlFor
- State announced to assistive technologies

## Related Components

- [Checkbox](./CHECKBOX.README.md) - For multiple selections
- [Radio Group](./RADIO-GROUP.README.md) - For single selection
- [Select](./SELECT.README.md) - For dropdown selection
- [Label](./LABEL.README.md) - For labeling form elements

## Notes

- Built on Base UI Switch primitive
- Smooth transition animations
- Supports both controlled and uncontrolled usage
- Two size variants (sm, default)
- Works seamlessly in dark mode
- Thumb moves smoothly on toggle
- Focus ring for keyboard navigation
- Disabled state with reduced opacity
- Invalid state with red border/ring
