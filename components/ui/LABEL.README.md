# Label

Form label component for associating text with form controls, providing accessible labeling for inputs.

## Import

```tsx
import { Label } from '@/components/ui/label'
```

## Usage

### Basic Label

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

### With Input

```tsx
<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input id="username" placeholder="Enter username" />
</div>
```

### With Required Indicator

```tsx
<Label htmlFor="password">
  Password <span className="text-destructive">*</span>
</Label>
<Input id="password" type="password" required />
```

### With Icon

```tsx
import { User } from 'lucide-react'

<Label htmlFor="name">
  <User className="h-4 w-4" />
  Full Name
</Label>
<Input id="name" />
```

### Disabled Label

```tsx
<Label htmlFor="disabled-input" className="opacity-50">
  Disabled Field
</Label>
<Input id="disabled-input" disabled />
```

## API Reference

### Label

| Prop | Type | Description |
|------|------|-------------|
| `htmlFor` | `string` | ID of the associated form control |
| `className` | `string` | Additional CSS classes |
| `children` | `ReactNode` | Label content |

## Styling

### Data Slots

- `data-slot="label"` - Label element

### Classes

```css
/* Base styles */
.text-sm
.leading-none
.font-medium
.flex
.items-center
.gap-2
.select-none

/* Disabled state (via group or peer) */
.group-data-[disabled=true]:opacity-50
.peer-disabled:opacity-50
.peer-disabled:cursor-not-allowed
```

## Examples

### Form Field

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
  />
  <p className="text-sm text-muted-foreground">
    We'll never share your email.
  </p>
</div>
```

### With Description

```tsx
<div className="space-y-2">
  <Label htmlFor="username">
    Username
    <span className="text-muted-foreground font-normal ml-2">
      (at least 3 characters)
    </span>
  </Label>
  <Input id="username" />
</div>
```

### With Tooltip

```tsx
import { Info } from 'lucide-react'

<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Label htmlFor="api-key">API Key</Label>
    <Tooltip>
      <TooltipTrigger>
        <Info className="h-4 w-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        Your secret API key for authentication
      </TooltipContent>
    </Tooltip>
  </div>
  <Input id="api-key" type="password" />
</div>
```

### Multiple Inputs

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="first-name">First Name</Label>
    <Input id="first-name" />
  </div>

  <div className="space-y-2">
    <Label htmlFor="last-name">Last Name</Label>
    <Input id="last-name" />
  </div>
</div>
```

### With Checkbox

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">
    I agree to the{' '}
    <a href="/terms" className="underline">
      terms and conditions
    </a>
  </Label>
</div>
```

### With Switch

```tsx
<div className="flex items-center justify-between">
  <Label htmlFor="notifications">Push Notifications</Label>
  <Switch id="notifications" />
</div>
```

### With Radio Group

```tsx
<div className="space-y-2">
  <Label>Payment Method</Label>
  <RadioGroup defaultValue="card">
    <div className="flex items-center gap-2">
      <RadioGroupItem value="card" id="card" />
      <Label htmlFor="card">Credit Card</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="paypal" id="paypal" />
      <Label htmlFor="paypal">PayPal</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="bank" id="bank" />
      <Label htmlFor="bank">Bank Transfer</Label>
    </div>
  </RadioGroup>
</div>
```

### With Select

```tsx
<div className="space-y-2">
  <Label htmlFor="country">Country</Label>
  <Select>
    <SelectTrigger id="country">
      <SelectValue placeholder="Select country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
      <SelectItem value="ca">Canada</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### With Textarea

```tsx
<div className="space-y-2">
  <Label htmlFor="bio">Bio</Label>
  <Textarea
    id="bio"
    placeholder="Tell us about yourself"
    rows={4}
  />
</div>
```

### Grid Layout

```tsx
<div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="city">City</Label>
    <Input id="city" />
  </div>

  <div className="space-y-2">
    <Label htmlFor="zip">ZIP Code</Label>
    <Input id="zip" />
  </div>
</div>
```

### Optional Field Indicator

```tsx
<Label htmlFor="phone">
  Phone Number
  <span className="text-muted-foreground font-normal ml-2">
    (optional)
  </span>
</Label>
<Input id="phone" type="tel" />
```

### With Error State

```tsx
'use client'

import { useState } from 'react'

export default function LabelWithError() {
  const [error, setError] = useState('Email is required')

  return (
    <div className="space-y-2">
      <Label htmlFor="email" className={error ? 'text-destructive' : ''}>
        Email
      </Label>
      <Input
        id="email"
        type="email"
        aria-invalid={!!error}
        aria-describedby="email-error"
      />
      {error && (
        <p id="email-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
```

### Inline Label

```tsx
<div className="flex items-center gap-2">
  <Label htmlFor="remember">Remember me</Label>
  <Checkbox id="remember" />
</div>
```

### Label with Badge

```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Label htmlFor="plan">Plan</Label>
    <Badge variant="secondary">Pro</Badge>
  </div>
  <Select>
    <SelectTrigger id="plan">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="free">Free</SelectItem>
      <SelectItem value="pro">Pro</SelectItem>
      <SelectItem value="enterprise">Enterprise</SelectItem>
    </SelectContent>
  </Select>
</div>
```

## Common Patterns

### Form Section

```tsx
<div className="space-y-6">
  <div>
    <h3 className="text-lg font-medium">Personal Information</h3>
    <p className="text-sm text-muted-foreground">
      Update your personal details.
    </p>
  </div>

  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="name">Full Name</Label>
      <Input id="name" />
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
    </div>
  </div>
</div>
```

### Two Column Form

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="first-name">First Name</Label>
    <Input id="first-name" />
  </div>

  <div className="space-y-2">
    <Label htmlFor="last-name">Last Name</Label>
    <Input id="last-name" />
  </div>

  <div className="space-y-2 col-span-full">
    <Label htmlFor="address">Address</Label>
    <Input id="address" />
  </div>
</div>
```

## Best Practices

### Do's
- ✅ Always associate labels with inputs using htmlFor
- ✅ Use meaningful, descriptive text
- ✅ Indicate required fields clearly
- ✅ Keep labels short and clear
- ✅ Use consistent capitalization

### Don'ts
- ❌ Don't use placeholder as label replacement
- ❌ Don't make labels too long
- ❌ Don't forget htmlFor attribute
- ❌ Don't hide labels (use sr-only if needed)
- ❌ Don't use ambiguous labels

## Accessibility

- Associates with form controls via htmlFor
- Screen reader accessible
- Clickable to focus input
- Disabled state conveyed visually
- Works with all form elements
- Proper semantic HTML
- Clear focus indication

## Related Components

- [Input](./INPUT.README.md) - Text input
- [Textarea](./TEXTAREA.README.md) - Multi-line input
- [Select](./SELECT.README.md) - Dropdown selection
- [Checkbox](./CHECKBOX.README.md) - Checkbox input
- [Switch](./SWITCH.README.md) - Toggle switch
- [Field](./FIELD.README.md) - Form field wrapper with react-hook-form

## Notes

- Uses semantic `<label>` element
- Small font size (text-sm)
- Medium font weight
- Flex layout for icon support
- Gap-2 for spacing
- Select-none for non-selectable text
- Automatic disabled styling via peer/group
- Works seamlessly in dark mode
- No JavaScript required
- Composable with any form control
