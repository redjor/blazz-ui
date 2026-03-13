# Bulk Actions on Time Entries

**Date:** 2026-03-13
**App:** apps/ops
**Scope:** Project detail page — time entries list

## Problem

No way to select multiple time entries and apply actions in batch. Each entry must be edited individually.

## Design

### Selection

- Checkbox at the start of each row (only on editable entries — not invoiced/paid)
- "Select all" checkbox in the list header (selects only editable entries in the active filter)
- State: `Set<Id<"timeEntries">>` managed locally in the page component

### Floating Toolbar (sticky bottom)

Appears when `selection.size > 0`. Layout:

```
[ X Désélectionner ] "3 sélectionnée(s)" | [Brouillon] [Prêt à facturer] | [Billable] [Non-billable] | [Supprimer]
```

- **Status buttons**: intersection of `getAllowedTransitions()` across all selected entries. If intersection is empty → no status buttons shown.
- **Billable toggle**: if all selected are billable → show "Non-billable". If all non-billable → show "Billable". If mixed → show both.
- **Delete**: always visible, triggers confirmation dialog.
- **Deselect (X)**: clears selection.

### Mutations

| Action | Mutation | Status |
|--------|----------|--------|
| Change status | `timeEntries.setStatus` (ids[], status) | Exists |
| Delete | `timeEntries.remove` → extend to accept `ids[]` | Modify |
| Toggle billable | `timeEntries.setBillable` (ids[], billable: boolean) | New |

### Post-action behavior

- Clear selection after successful bulk action
- Toast confirmation: e.g. "3 entrées passées à Prêt à facturer"
- Entries with status invoiced/paid are never selectable
