# react-dirty-guard

Protect users from losing unsaved form changes.

## Features

- **Headless hook** --- bring your own UI
- **Optional styled bar** (Tailwind) --- drop-in notification bar with save/discard buttons
- **Works with any form library** --- React Hook Form adapter included
- **Blocks tab close/reload** --- `beforeunload` interception
- **Blocks browser back/forward** --- `popstate` interception (opt-in, enabled by default)
- **Zero dependencies** --- only `react` as a peer dependency
- **TypeScript-first** --- full type inference, exported interfaces

## Install

```bash
npm i react-dirty-guard
```

## Quick Start: Headless

Use `useDirtyGuard` with your own UI --- no styles, no opinions.

```tsx
import { useState } from "react"
import { useDirtyGuard } from "react-dirty-guard"

function MyForm() {
  const [isDirty, setIsDirty] = useState(false)

  const guard = useDirtyGuard({
    isDirty,
    onSave: () => saveData(),
    onDiscard: () => setIsDirty(false),
  })

  return (
    <form>
      {guard.isBlocking && (
        <div>
          <span>You have unsaved changes</span>
          <button onClick={guard.save}>Save</button>
          <button onClick={guard.discard}>Discard</button>
        </div>
      )}
      {/* your form fields */}
    </form>
  )
}
```

## Quick Start: Styled Bar

`DirtyGuardBar` is a fixed-position notification bar with save/discard buttons, a shake animation on blocked navigation, and dark mode support.

```tsx
import { useDirtyGuard } from "react-dirty-guard"
import { DirtyGuardBar } from "react-dirty-guard/bar"

function MyForm() {
  const guard = useDirtyGuard({
    isDirty: form.formState.isDirty,
    onSave: form.handleSubmit(onSubmit),
    onDiscard: () => form.reset(),
  })

  return (
    <>
      <DirtyGuardBar {...guard} position="bottom" />
      <form>{/* ... */}</form>
    </>
  )
}
```

> **Tailwind users:** add the package to your `content` config so Tailwind picks up the bar's classes:
>
> ```js
> // tailwind.config.js
> content: [
>   // ...
>   "./node_modules/react-dirty-guard/dist/**/*.js",
> ]
> ```

## React Hook Form Adapter

`useDirtyGuardRHF` reads `isDirty`, `isSubmitting`, and `reset()` directly from the form instance.

```tsx
import { useForm } from "react-hook-form"
import { useDirtyGuardRHF } from "react-dirty-guard/adapters/react-hook-form"
import { DirtyGuardBar } from "react-dirty-guard/bar"

function MyForm() {
  const form = useForm({ defaultValues: { name: "" } })
  const guard = useDirtyGuardRHF({
    form,
    onSave: form.handleSubmit(onSubmit),
  })

  return (
    <>
      <DirtyGuardBar {...guard} />
      <form>{/* ... */}</form>
    </>
  )
}
```

## Custom Adapter

Write your own adapter in a few lines. Here is a Formik example:

```ts
import { useDirtyGuard } from "react-dirty-guard"

function useDirtyGuardFormik(formik) {
  return useDirtyGuard({
    isDirty: formik.dirty,
    isSaving: formik.isSubmitting,
    onSave: () => formik.submitForm(),
    onDiscard: () => formik.resetForm(),
  })
}
```

## `useIsDirty`

A minimal dirty-tracking hook for forms without a form library.

```tsx
import { useIsDirty, useDirtyGuard } from "react-dirty-guard"

function MyForm() {
  const { isDirty, markDirty, markClean } = useIsDirty()
  const guard = useDirtyGuard({ isDirty, onSave: save, onDiscard: markClean })

  return (
    <form>
      <input onChange={() => markDirty()} />
      {/* ... */}
    </form>
  )
}
```

## API Reference

### `DirtyGuardOptions`

Options passed to `useDirtyGuard`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `isDirty` | `boolean` | *required* | Whether the form has unsaved changes |
| `isSaving` | `boolean` | `false` | Whether a save is in progress |
| `onSave` | `() => void \| Promise<void>` | --- | Called when user clicks Save. If it returns a rejecting Promise, the guard stays active |
| `onDiscard` | `() => void` | --- | Called when user clicks Discard |
| `blockRouteNavigation` | `boolean` | `true` | Block in-page navigation via popstate interception |
| `disabled` | `boolean` | `false` | Disable all blocking (useful for conditional opt-out) |

### `DirtyGuardState`

Returned by `useDirtyGuard` and `useDirtyGuardRHF`.

| Property | Type | Description |
| --- | --- | --- |
| `isBlocking` | `boolean` | Whether the guard UI should be visible (`isDirty && !isSaving && !disabled`) |
| `isShaking` | `boolean` | `true` briefly (~500ms) when the user tries to navigate away |
| `isSaving` | `boolean` | Whether a save is in progress |
| `save` | `() => void` | Trigger save |
| `discard` | `() => void` | Trigger discard and unlock navigation |
| `allowNextNavigation` | `() => void` | One-shot bypass for the next navigation event (call after save, before redirect) |

### `DirtyGuardBarProps`

Props for the `DirtyGuardBar` component. Extends `DirtyGuardState`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `"top" \| "bottom"` | `"top"` | Fixed position of the bar |
| `saveLabel` | `string` | `"Save changes"` | Label for the save button |
| `discardLabel` | `string` | `"Discard"` | Label for the discard button |
| `message` | `string` | `"You have unsaved changes"` | Message displayed in the bar |
| `className` | `string` | `""` | Additional Tailwind classes on the outer container |

### `DirtyGuardRHFOptions`

Options passed to `useDirtyGuardRHF`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `form` | `UseFormReturn<any>` | *required* | React Hook Form instance |
| `onSave` | `() => void \| Promise<void>` | *required* | Called when user clicks Save |
| `onDiscard` | `() => void` | `form.reset()` | Called when user clicks Discard |
| `blockRouteNavigation` | `boolean` | `true` | Block in-page navigation via popstate |
| `disabled` | `boolean` | `false` | Disable all blocking |

## Known Limitations

- **Phantom history entry** --- `popstate` blocking works by pushing a phantom entry to `history`. This can conflict with SPA routers that also manipulate history.
- **Double-tap back** --- Rapidly pressing back twice may slip through the guard.
- **Mobile Safari swipe-back** --- The swipe-back gesture on iOS is inconsistent with `popstate` interception.
- **`beforeunload` message** --- Modern browsers ignore custom messages in `beforeunload` dialogs and show a generic prompt instead.
- **Recommendation** --- Set `blockRouteNavigation: false` if you experience conflicts with your router. Tab close/reload blocking (`beforeunload`) works independently and is always reliable.

## License

MIT
