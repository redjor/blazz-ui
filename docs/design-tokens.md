# Polaris Design Tokens

This document describes the Polaris design system implementation in our application. We've adopted Shopify Polaris's comprehensive token architecture while maintaining Tailwind CSS integration.

## Overview

The design system provides:
- **Comprehensive design tokens** for spacing, typography, colors, shadows, and motion
- **Custom dark mode** with inverted color hierarchies
- **Component patterns** matching Polaris's visual styling
- **Tailwind utilities** with `p-` prefix for all Polaris tokens

## Token Categories

### Spacing

Polaris uses a consistent spacing scale from `0` to `3200` (8rem). Use the `p-{size}` utilities:

```tsx
// Padding examples
<div className="p-p-4">         {/* 1rem padding */}
<div className="px-p-2 py-p-1">  {/* 0.5rem horizontal, 0.25rem vertical */}

// Margin examples
<div className="m-p-3">          {/* 0.75rem margin */}
<div className="gap-p-4">        {/* 1rem gap in flex/grid */}

// Common spacing values
p-1    = 0.25rem   (4px)
p-2    = 0.5rem    (8px)
p-3    = 0.75rem   (12px)
p-4    = 1rem      (16px) ← Card padding default
p-5    = 1.25rem   (20px)
p-6    = 1.5rem    (24px)
p-8    = 2rem      (32px)
```

**Component-specific spacing:**
- Card padding: `p-p-4` (1rem)
- Card gap: `gap-p-4` (1rem)

### Colors

#### Background Colors

```tsx
// Surface colors (for cards, modals, panels)
bg-p-bg-surface              {/* White in light, #303030 in dark */}
bg-p-bg-surface-hover        {/* Hover state */}
bg-p-bg-surface-secondary    {/* Secondary surfaces */}

// Fill colors (for buttons, badges)
bg-p-fill-brand              {/* Black in light, white in dark */}
bg-p-fill-brand-hover        {/* Hover state */}
```

#### Text Colors

```tsx
text-p-text                  {/* Primary text */}
text-p-text-secondary        {/* Secondary/muted text */}
text-p-text-disabled         {/* Disabled state */}
text-p-text-brand            {/* Brand color text */}
text-p-text-on-fill          {/* Text on brand backgrounds */}
```

#### Border Colors

```tsx
border-p-border              {/* Default borders */}
border-p-border-hover        {/* Hover state */}
border-p-border-focus        {/* Focus state (blue) */}
```

#### Semantic Colors

Polaris provides five semantic color families for different message types:

```tsx
// Info (blue) - Informational messages
bg-p-info-surface            {/* Light blue background */}
text-p-info-text             {/* Dark blue text */}
border-p-info-border         {/* Blue border */}

// Success (green) - Success states
bg-p-success-surface
text-p-success-text
border-p-success-border

// Warning (orange) - Warning messages
bg-p-warning-surface
text-p-warning-text
border-p-warning-border

// Caution (yellow) - Caution messages
bg-p-caution-surface
text-p-caution-text
border-p-caution-border

// Critical (red) - Error/destructive actions
bg-p-critical-surface
text-p-critical-text
border-p-critical-border
```

**Usage example:**

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="critical">Failed</Badge>
```

### Typography

#### Font Sizes

Polaris uses a type scale from `275` (0.6875rem) to `1000` (2.5rem):

```tsx
text-p-xs       {/* 0.6875rem - 11px */}
text-p-sm       {/* 0.75rem - 12px */}
text-p-base     {/* 0.8125rem - 13px - Default */}
text-p-md       {/* 0.875rem - 14px */}
text-p-lg       {/* 1rem - 16px */}
text-p-xl       {/* 1.25rem - 20px */}
text-p-2xl      {/* 1.5rem - 24px */}
text-p-3xl      {/* 1.875rem - 30px */}
text-p-4xl      {/* 2.25rem - 36px */}
```

#### Font Weights

Polaris uses non-standard weights optimized for Inter font:

```tsx
font-p-regular    {/* 450 - Body text */}
font-p-medium     {/* 550 - Emphasized text */}
font-p-semibold   {/* 650 - Headings, buttons */}
font-p-bold       {/* 700 - Strong emphasis */}
```

**Typography presets:**

```tsx
// Heading presets (use semantic HTML with these classes)
<h1 className="text-p-4xl font-p-bold">    {/* Heading 3XL */}
<h2 className="text-p-3xl font-p-bold">    {/* Heading 2XL */}
<h3 className="text-p-2xl font-p-bold">    {/* Heading XL */}
<h4 className="text-p-xl font-p-semibold"> {/* Heading LG */}
<h5 className="text-p-md font-p-semibold"> {/* Heading MD */}
<h6 className="text-p-sm font-p-semibold"> {/* Heading SM */}

// Body presets
<p className="text-p-md font-p-regular">   {/* Body LG */}
<p className="text-p-base font-p-regular"> {/* Body MD (default) */}
<p className="text-p-sm font-p-regular">   {/* Body SM */}
<p className="text-p-xs font-p-regular">   {/* Body XS */}
```

### Shadows

Polaris provides a comprehensive shadow system for elevation and depth:

#### Elevation Shadows

```tsx
shadow-p-none   {/* No shadow */}
shadow-p-sm     {/* Subtle elevation */}
shadow-p        {/* Default elevation */}
shadow-p-md     {/* Medium elevation - Cards */}
shadow-p-lg     {/* High elevation */}
shadow-p-xl     {/* Maximum elevation - Modals */}
```

#### Special Effect Shadows

```tsx
shadow-p-bevel       {/* Bevel effect for buttons */}
shadow-p-inset       {/* Inset shadow for inputs */}
shadow-p-inset-lg    {/* Larger inset shadow */}
```

#### Button-Specific Shadows

Polaris buttons use complex shadow patterns to create depth:

```tsx
// Default/outline buttons
shadow-p-button              {/* Default state */}
shadow-p-button-hover        {/* Hover state */}
shadow-p-button-active       {/* Active/pressed state */}

// Primary buttons
shadow-p-button-primary              {/* Default state */}
shadow-p-button-primary-hover        {/* Hover state */}
shadow-p-button-primary-active       {/* Active/pressed state */}
```

These are automatically applied in the Button component variants.

### Border Radius

Polaris uses a geometric progression for border radius:

```tsx
rounded-p-none   {/* 0 */}
rounded-p-sm     {/* 0.125rem - 2px */}
rounded-p        {/* 0.25rem - 4px */}
rounded-p-md     {/* 0.375rem - 6px */}
rounded-p-lg     {/* 0.5rem - 8px - Buttons, inputs */}
rounded-p-xl     {/* 0.75rem - 12px - Cards */}
rounded-p-2xl    {/* 1rem - 16px */}
rounded-p-3xl    {/* 1.25rem - 20px */}
rounded-p-4xl    {/* 1.875rem - 30px */}
rounded-p-full   {/* 624.9375rem - Circular */}
```

**Common usage:**

```tsx
<Button className="rounded-p-lg">     {/* Buttons */}
<Input className="rounded-p-lg">      {/* Inputs */}
<Card className="rounded-p-xl">       {/* Cards */}
<Badge className="rounded-p-full">    {/* Badges */}
```

### Motion

#### Duration

```tsx
duration-p-0      {/* 0ms - Instant */}
duration-p-50     {/* 50ms - Very fast */}
duration-p-100    {/* 100ms - Fast */}
duration-p-150    {/* 150ms - Default */}
duration-p-200    {/* 200ms */}
duration-p-250    {/* 250ms */}
duration-p-300    {/* 300ms */}
```

#### Easing Functions

```tsx
ease-p-ease       {/* Default - cubic-bezier(0.25, 0.1, 0.25, 1) */}
ease-p-ease-in    {/* Deceleration - cubic-bezier(0.42, 0, 1, 1) */}
ease-p-ease-out   {/* Acceleration - cubic-bezier(0.19, 0.91, 0.38, 1) */}
ease-p-ease-in-out {/* Both - cubic-bezier(0.42, 0, 0.58, 1) */}
```

**Usage example:**

```tsx
<div className="transition-all duration-p-150 ease-p-ease">
  {/* Smooth transitions matching Polaris */}
</div>
```

## Component Patterns

### Button

Buttons use Polaris's signature shadow and gradient system:

```tsx
// Primary button (brand color with gradient overlay)
<Button variant="default">Save</Button>

// Outline button
<Button variant="outline">Cancel</Button>

// Secondary button
<Button variant="secondary">View details</Button>

// Ghost button (minimal)
<Button variant="ghost">Learn more</Button>

// Destructive/critical button
<Button variant="destructive">Delete</Button>
```

**Sizes:**

```tsx
<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

{/* Icon buttons */}
<Button size="icon"><Icon /></Button>
<Button size="icon-sm"><Icon /></Button>
```

### Badge

Badges use semantic colors and a fixed height for consistency:

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="critical">Critical</Badge>
<Badge variant="outline">Outline</Badge>
```

All badges have:
- Fixed height: `20px` (h-5)
- Pill shape: `rounded-p-full`
- Consistent padding: `px-p-2`
- Font: `text-p-xs font-p-medium`

### Input

Inputs use Polaris's input-specific surface and border tokens:

```tsx
<Input
  type="text"
  placeholder="Enter text..."
  className="..." // Additional classes
/>
```

Features:
- Input-specific background: `bg-p-input-bg-surface`
- Input-specific borders: `border-p-input-border`
- Inset shadow on focus: `focus:shadow-p-inset`
- Focus ring: `focus:ring-[3px] focus:ring-p-border-focus/20`

### Card

Cards use elevation shadows and surface colors:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
```

Features:
- Surface background: `bg-p-bg-surface`
- Medium elevation: `shadow-p-md`
- Rounded corners: `rounded-p-xl`
- Consistent padding: `p-p-4`
- Proper spacing: `gap-p-4`

## Dark Mode

Dark mode uses inverted color hierarchies for proper visual contrast:

### Background Hierarchy

```tsx
// Light mode:
--p-color-bg: #f1f1f1 (page background)
--p-color-bg-surface: #ffffff (cards, white)
--p-color-bg-fill-brand: #303030 (buttons, black)

// Dark mode (inverted):
--p-color-bg: #1a1a1a (page background)
--p-color-bg-surface: #303030 (cards, dark gray)
--p-color-bg-fill-brand: #ffffff (buttons, white)
```

### Shadow Adaptations

In dark mode, shadows become subtle borders and highlights:

```tsx
// Light mode: Drop shadows
shadow-p-button: /* Complex multi-layer inset shadows */

// Dark mode: Subtle highlights
shadow-p-button: /* Single subtle border */
```

### Implementation

Dark mode is enabled via the `.dark` class:

```tsx
<html className="dark">
  {/* All Polaris colors automatically adapt */}
</html>
```

## Migration Guide

### Replace Existing Classes

```tsx
// Old shadcn/ui → New Polaris
bg-primary           → bg-p-fill-brand
text-foreground      → text-p-text
text-muted-foreground → text-p-text-secondary
border-border        → border-p-border
rounded-lg           → rounded-p-lg
shadow-md            → shadow-p-md
p-4                  → p-p-4
gap-4                → gap-p-4
```

### Badge Variants

```tsx
// Old → New
variant="secondary"   → variant="info"
variant="destructive" → variant="critical"
```

### Button Shadows

No migration needed - shadows are automatically applied via the component variants.

## Best Practices

1. **Use semantic tokens** - Prefer `bg-p-bg-surface` over direct color values
2. **Maintain spacing scale** - Use `p-{size}` utilities, not arbitrary values
3. **Follow typography presets** - Use recommended font size/weight combinations
4. **Respect elevation levels** - Cards use `shadow-p-md`, modals use `shadow-p-xl`
5. **Test in both themes** - Always verify components in light and dark modes
6. **Use semantic colors** - Info (blue), Success (green), Warning (orange), Critical (red)

## CSS Variables Reference

All Polaris tokens are available as CSS variables:

```css
/* Spacing */
var(--p-space-400)  /* 1rem */

/* Colors */
var(--p-color-bg-surface)
var(--p-color-text)
var(--p-color-border)

/* Typography */
var(--p-font-size-350)
var(--p-font-weight-semibold)

/* Shadows */
var(--p-shadow-300)

/* Border Radius */
var(--p-border-radius-200)

/* Motion */
var(--p-motion-duration-150)
var(--p-motion-ease)
```

Use CSS variables when Tailwind utilities don't cover your use case:

```tsx
<div style={{ padding: 'var(--p-space-400)' }}>
  Custom padding using Polaris token
</div>
```

## Resources

- [Shopify Polaris Design System](https://polaris.shopify.com/)
- [Polaris Tokens Documentation](https://polaris.shopify.com/tokens/colors)
- [Inter Font Family](https://rsms.me/inter/) - Polaris's default font

## Support

For questions or issues with the design system implementation, please:
1. Check this documentation first
2. Review Polaris's official documentation
3. Open an issue in the project repository
