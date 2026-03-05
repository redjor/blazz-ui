# Container Padding Token — Design

## Problem

All container padding in `packages/ui/` is hardcoded (`p-4`, `p-2.5`, etc.). There is no centralized way to adjust the density of container components. Making the interface more condensed requires touching every component individually.

## Solution

A single CSS custom property `--container-padding` in `tokens.css` with Tailwind utility classes, applied to "flat container" components (Card, Dialog, Sheet, Popover, HoverCard, Alert).

## Token

```css
/* tokens.css — Density section */
:root {
  --container-padding: 1rem; /* 16px — matches current p-4 default */
}
```

Same value for light and dark themes.

## Utility Classes

```css
.p-container  { padding: var(--container-padding); }
.px-container { padding-inline: var(--container-padding); }
.py-container { padding-block: var(--container-padding); }
```

## Components Affected

| Component | Before | After |
|-----------|--------|-------|
| CardContent | `p-4` | `p-container` |
| CardHeader | `px-4 pt-4` | `px-container pt-[var(--container-padding)]` |
| CardFooter | `p-4` | `p-container` |
| DialogContent | `p-4` | `p-container` |
| DialogHeader | `-mx-4 -mt-4 p-4` | `margin: calc(-1 * var(--container-padding))` + `p-container` |
| DialogFooter | `-mx-4 -mb-4 p-4` | same bleed pattern with calc |
| SheetHeader | `px-4 pt-4 pb-3` | `px-container` + relative calc for vertical |
| SheetFooter | `px-4 py-3` | `px-container` + `py-[calc(var(--container-padding)*0.75)]` |
| PopoverContent | `p-2.5` | `p-container` (unified to 16px) |
| HoverCardContent | `p-2.5` | `p-container` (unified to 16px) |
| Alert | `px-2.5 py-2` | `px-container` + `py-[calc(var(--container-padding)*0.5)]` |

## Components NOT Affected

- DropdownMenu, ContextMenu, Select, Command — tight menu padding stays hardcoded
- Tooltip — small inline element, own padding logic
- Sidebar, Table, Accordion — own spacing systems

## Override Usage

```css
/* Dense section */
.section-dense {
  --container-padding: 0.5rem; /* 8px */
}

/* Spacious section */
.section-spacious {
  --container-padding: 1.5rem; /* 24px */
}
```

## Bleed Pattern (Dialog/Sheet Headers)

Headers and footers that use negative margins to bleed content to container edges will use `calc()` with the token so they scale together:

```css
/* Dialog header */
margin: calc(-1 * var(--container-padding))
        calc(-1 * var(--container-padding))
        0;
padding: var(--container-padding);
```

## Asymmetric Patterns

Some components have slightly less vertical padding than horizontal. These use relative calc:

```css
/* Sheet footer — 75% of container-padding vertically */
padding: calc(var(--container-padding) * 0.75) var(--container-padding);
```

## Decision Log

- **Scope:** Flat containers only (Card, Dialog, Sheet, Popover, HoverCard, Alert)
- **Naming:** `--container-padding` (explicit, matches existing token naming)
- **Approach:** CSS variable + Tailwind utility classes (.p-container, .px-container, .py-container)
- **Asymmetry:** Token defines the base; relative adjustments via `calc()` so everything scales together
- **Popover/HoverCard:** Unified with the same token (from p-2.5 to p-4 by default — more consistent)
