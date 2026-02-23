# DateSelector — Design

## Context

No date picker exists in the project. We need a Calendar primitive and a DateSelector composition (Popover + Calendar) with a grouped variant for start/end date pairs.

## Components

| Component | File | Role |
|-----------|------|------|
| `Calendar` | `components/ui/calendar.tsx` | Styled wrapper of react-day-picker, inline usage |
| `DateSelector` | `components/ui/date-selector.tsx` | Popover + Calendar, single date |
| `DateRangeSelector` | `components/ui/date-selector.tsx` | Two grouped DateSelectors (from/to) |

## Dependencies

- `react-day-picker` v9
- `date-fns` (formatting)

## API

### Calendar (primitive)

```tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border"
/>
```

Accepts all react-day-picker props, styled with project design tokens.

### DateSelector (single)

```tsx
<DateSelector
  value={date}
  onValueChange={setDate}
  placeholder="Pick a date"
  disabled={false}
/>
```

### DateRangeSelector (grouped from/to)

```tsx
<DateRangeSelector
  from={startDate}
  to={endDate}
  onFromChange={setStartDate}
  onToChange={setEndDate}
  fromPlaceholder="Start date"
  toPlaceholder="End date"
/>
```

Two triggers grouped visually: left has rounded-l, right has rounded-r, divider between them. Each opens its own popover with a single Calendar.

## Styling

- **Trigger**: same style as Select trigger (`border-edge`, `bg-transparent`, `h-8`, `text-sm`)
- **Calendar nav**: `text-fg-muted` chevrons, `font-medium text-fg` month label
- **Day cells**: `text-fg`, hover `bg-raised`, selected `bg-brand text-brand-fg`, today `underline`
- **Outside days**: `text-fg-muted opacity-50`
- **Popover**: uses existing project Popover component

## Scope exclusions

- No presets (today, last 7 days, etc.)
- No time picker
- No doc page (will come after visual validation)
