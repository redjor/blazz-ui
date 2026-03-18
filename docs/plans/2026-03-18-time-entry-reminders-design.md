# Time Entry Reminders — Missing Days Detection

**Date:** 2026-03-18
**Status:** Approved

## Problem

When freelancing across multiple projects, it's easy to forget to log time for certain workdays. Without a reminder, these gaps are only visible by manually scanning the week grid.

## Solution

Show a reminder section on the **Today page** listing workdays with no billable time entry logged, covering the current week and previous week.

## Detection Logic

- **Workdays** = Monday to Friday (hardcoded, no custom config)
- **Scope** = current week (Monday → today) + previous week (Mon → Fri)
- **Day is "covered"** = at least 1 billable time entry exists for that day
- **Future days excluded** — only up to today (inclusive)
- Computed client-side from existing time entries data (no new Convex query)

## UI

- **Position**: between daily stats and "Entrées du jour" list on the Today page
- **Visibility**: only rendered when >= 1 missing day detected
- **Format**: subtle warning banner
  - Icon: `AlertTriangle`
  - Title: "X jours sans saisie"
  - Body: clickable date chips ("Lun 16 mars", "Jeu 12 mars"...)
  - Click on chip → opens `QuickTimeEntryModal` with `date` pre-filled
- **Reactivity**: disappears automatically when all days are covered (Convex live query)

## Out of Scope

- Push/email notifications
- Configurable hour threshold
- Weekend/holiday detection
- "Dismiss" / "Ignore" persistence
