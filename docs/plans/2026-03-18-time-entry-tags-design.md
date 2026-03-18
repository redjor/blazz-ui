# Time Entry Tags — Design

**Date:** 2026-03-18
**Scope:** apps/ops/ only

## Problem

Time entries have no way to categorize or tag work beyond the project association and free-text description. User wants free-form tags for lightweight categorization.

## Decision

Approach A — inline `tags: string[]` on timeEntries (no separate table).

## Data Model

- New field on `timeEntries`: `tags: v.optional(v.array(v.string()))`
- New query `distinctTags`: collects all unique tags for the current user (for autocomplete)
- Mutations `create` and `update` accept `tags?: string[]`
- Tags normalized server-side: lowercase, trimmed, deduplicated

## UI — Input

- New field in `time-entry-form.tsx` and `quick-time-entry-modal.tsx`
- Text input with autocomplete from existing tags (distinctTags query)
- Enter or comma validates a tag
- Tags displayed as small pills with × to remove
- Positioned after description, before billable checkbox

## UI — Display

- **Today page** (`today/_client.tsx`): compact pills under each entry's description
- **Time list** (`time/_client.tsx`): new "Tags" column in DataTable, after Description

## Out of Scope

- No colors/icons on tags
- No tag management in settings
- No display in recap/export
- No filter by tag (future)
