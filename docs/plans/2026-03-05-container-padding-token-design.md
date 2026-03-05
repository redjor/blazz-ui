# Container Padding Token — Design

## Problem

All container padding in `packages/ui/` is hardcoded (`p-4`, `p-2.5`, etc.). There is no centralized way to adjust the density of container components. Making the interface more condensed requires touching every component individually.

## Solution

A single CSS custom property `--inset` in `tokens.css` with Tailwind utility classes, applied to "flat container" components (Card, Dialog, Sheet, Popover, HoverCard, Alert).

## Token

```css
/* tokens.css — Density section */
:root {
  --inset: 1rem; /* 16px — matches current p-4 default */
}
```

Same value for light and dark themes.

## Utility Classes

```css
.p-inset  { padding: var(--inset); }
.px-inset { padding-inline: var(--inset); }
.py-inset { padding-block: var(--inset); }
```

## Components Affected

| Component | Before | After |
|-----------|--------|-------|
| CardContent | `p-4` | `p-inset` |
| CardHeader | `px-4 pt-4` | `px-inset pt-[var(--inset)]` |
| CardFooter | `p-4` | `p-inset` |
| DialogContent | `p-4` | `p-inset` |
| DialogHeader | `-mx-4 -mt-4 p-4` | `margin: calc(-1 * var(--inset))` + `p-inset` |
| DialogFooter | `-mx-4 -mb-4 p-4` | same bleed pattern with calc |
| SheetHeader | `px-4 pt-4 pb-3` | `px-inset` + relative calc for vertical |
| SheetFooter | `px-4 py-3` | `px-inset` + `py-[calc(var(--inset)*0.75)]` |
| PopoverContent | `p-2.5` | `p-inset` (unified to 16px) |
| HoverCardContent | `p-2.5` | `p-inset` (unified to 16px) |
| Alert | `px-2.5 py-2` | `px-inset` + `py-[calc(var(--inset)*0.5)]` |

## Components NOT Affected

- DropdownMenu, ContextMenu, Select, Command — tight menu padding stays hardcoded
- Tooltip — small inline element, own padding logic
- Sidebar, Table, Accordion — own spacing systems

## Override Usage

```css
/* Dense section */
.section-dense {
  --inset: 0.5rem; /* 8px */
}

/* Spacious section */
.section-spacious {
  --inset: 1.5rem; /* 24px */
}
```

## Bleed Pattern (Dialog/Sheet Headers)

Headers and footers that use negative margins to bleed content to container edges will use `calc()` with the token so they scale together:

```css
/* Dialog header */
margin: calc(-1 * var(--inset))
        calc(-1 * var(--inset))
        0;
padding: var(--inset);
```

## Asymmetric Patterns

Some components have slightly less vertical padding than horizontal. These use relative calc:

```css
/* Sheet footer — 75% of container-padding vertically */
padding: calc(var(--inset) * 0.75) var(--inset);
```

## Decision Log

- **Scope:** Flat containers only (Card, Dialog, Sheet, Popover, HoverCard, Alert)
- **Naming:** `--inset` (explicit, matches existing token naming)
- **Approach:** CSS variable + Tailwind utility classes (.p-inset, .px-inset, .py-inset). Short, elegant naming inspired by Apple HIG
- **Asymmetry:** Token defines the base; relative adjustments via `calc()` so everything scales together
- **Popover/HoverCard:** Unified with the same token (from p-2.5 to p-4 by default — more consistent)
