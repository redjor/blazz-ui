# Field

Form field wrapper component that integrates with react-hook-form, providing automatic error handling, accessibility, and form state management.

## Import

```tsx
import {
  Field,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFieldContext,
} from '@/components/ui/field'
```

## Usage

### Basic Field

```tsx
'use client'

import { useForm } from 'react-hook-form'

export default function BasicField() {
  const form = useForm()

  return (
    <Form {...form}>
      <form>
        <Field
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

### With Validation

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export default function ValidatedField() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <Field
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### With Description

```tsx
<Field
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription>
        This is your public display name.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Multiple Fields

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

export default function MultipleFields() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <div className="space-y-4">
          <Field
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Field
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Field
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
```

## API Reference

### Field (Controller)

Wraps react-hook-form's Controller component. See [react-hook-form Controller docs](https://react-hook-form.com/docs/usecontroller/controller) for all props.

| Prop | Type | Description |
|------|------|-------------|
| `control` | `Control` | Form control from useForm |
| `name` | `string` | Field name (required) |
| `render` | `({ field }) => ReactNode` | Render function (required) |
| `defaultValue` | `any` | Default field value |
| `rules` | `ValidationRules` | Validation rules |

### Form (FormProvider)

Wraps react-hook-form's FormProvider. Provides form context to child fields.

### FormItem

Container for a form field with automatic spacing.

### FormLabel

Label component that automatically links to the field and shows error state.

### FormControl

Wrapper for the actual input element. Handles accessibility attributes.

### FormDescription

Helper text displayed below the input.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Description text |
| `className` | `string` | Additional CSS classes |

### FormMessage

Error message display. Automatically shows validation errors.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Custom message (optional) |
| `className` | `string` | Additional CSS classes |

### useFieldContext

Hook to access field context (id, name, error state, etc.).

```tsx
const { id, name, error, formItemId, formDescriptionId, formMessageId } = useFieldContext()
```

## Examples

### With Select

```tsx
<Field
  control={form.control}
  name="country"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Country</FormLabel>
      <FormControl>
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### With Textarea

```tsx
<Field
  control={form.control}
  name="bio"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Bio</FormLabel>
      <FormControl>
        <Textarea {...field} rows={4} />
      </FormControl>
      <FormDescription>
        Tell us a little about yourself (max 500 characters)
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### With Checkbox

```tsx
<Field
  control={form.control}
  name="acceptTerms"
  render={({ field }) => (
    <FormItem className="flex items-start gap-2">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1">
        <FormLabel>Accept terms and conditions</FormLabel>
        <FormDescription>
          You agree to our Terms of Service and Privacy Policy.
        </FormDescription>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
```

### With Switch

```tsx
<Field
  control={form.control}
  name="notifications"
  render={({ field }) => (
    <FormItem className="flex items-center justify-between">
      <div>
        <FormLabel>Notifications</FormLabel>
        <FormDescription>
          Receive email notifications
        </FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
    </FormItem>
  )}
/>
```

### With Radio Group

```tsx
<Field
  control={form.control}
  name="plan"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Plan</FormLabel>
      <FormControl>
        <RadioGroup value={field.value} onValueChange={field.onChange}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free">Free</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="pro" id="pro" />
            <Label htmlFor="pro">Pro</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="enterprise" id="enterprise" />
            <Label htmlFor="enterprise">Enterprise</Label>
          </div>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### With Combobox

```tsx
<Field
  control={form.control}
  name="language"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Language</FormLabel>
      <FormControl>
        <Combobox
          value={field.value}
          onValueChange={field.onChange}
          options={languages}
          placeholder="Select language..."
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Grid Layout

```tsx
<Form {...form}>
  <form>
    <div className="grid grid-cols-2 gap-4">
      <Field
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Field
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </form>
</Form>
```

### Complex Validation

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export default function PasswordForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <div className="space-y-4">
          <Field
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters with uppercase and numbers
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Field
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create Account</Button>
        </div>
      </form>
    </Form>
  )
}
```

### With Custom Error Handling

```tsx
'use client'

import { useForm } from 'react-hook-form'

export default function CustomErrorField() {
  const form = useForm()

  return (
    <Form {...form}>
      <form>
        <Field
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.username && (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {form.formState.errors.username.message}
                  </span>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

## Common Patterns

### Sign Up Form

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms',
  }),
})

export default function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Field
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Field
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Field
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Accept terms and conditions</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
```

## Best Practices

### Do's
- ✅ Use Zod for type-safe validation
- ✅ Provide clear error messages
- ✅ Include FormDescription for complex fields
- ✅ Use FormMessage for all validated fields
- ✅ Group related fields logically

### Don'ts
- ❌ Don't forget FormControl wrapper
- ❌ Don't skip error handling
- ❌ Don't use inline validation without schema
- ❌ Don't forget required field indicators
- ❌ Don't make error messages too technical

## Accessibility

- Automatic ARIA attributes (aria-invalid, aria-describedby)
- Proper label association
- Error messages announced to screen readers
- Description text linked to input
- Focus management
- Keyboard accessible
- Required field indication

## Related Components

- [Label](./LABEL.README.md) - Standalone label
- [Input](./INPUT.README.md) - Text input
- [Textarea](./TEXTAREA.README.md) - Multi-line input
- [Select](./SELECT.README.md) - Dropdown selection
- [Checkbox](./CHECKBOX.README.md) - Checkbox input
- [Switch](./SWITCH.README.md) - Toggle switch

## Notes

- Built on react-hook-form
- Integrates with Zod for validation
- Automatic error state management
- Unique IDs generated automatically
- Error messages styled automatically
- Description text properly linked
- Works seamlessly in dark mode
- Full TypeScript support
- Composable with any input component
- FormProvider context for nested fields
