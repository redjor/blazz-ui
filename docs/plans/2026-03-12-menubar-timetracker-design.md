# BlazzTime — macOS Menu Bar Time Tracker

**Date:** 2026-03-12
**Status:** Validated
**Approach:** SwiftUI native (Approach A — MenuBarExtra)

## Context

Blazz Ops (`apps/ops/`) is a fully functional freelance ops tool with time tracking,
invoicing, and contract management. Backend is Convex. The web app has a
`QuickTimeEntryModal` for fast entry, but opening a browser tab adds friction.

**Goal:** A native macOS menu bar app for logging time entries in under 5 seconds,
without leaving the current context.

## Scope — V1

- Quick time entry: project + duration + optional note
- Today's entries visible in popover
- Convex HTTP API (no intermediary server)
- Auth v1: manually provisioned token (Keychain)
- Offline buffer with auto-sync

### Explicitly out of scope (V1)
- Live timer / stopwatch
- Date picker (logs today only)
- OAuth native flow (deferred to V2)
- Editing / deleting entries from the popover
- Settings UI

## Architecture

```
apps/ops/BlazzTime/
├── BlazzTime.xcodeproj
├── BlazzTime/
│   ├── BlazzTimeApp.swift       ← Entry point, MenuBarExtra
│   ├── QuickEntryView.swift     ← Popover UI
│   ├── ConvexClient.swift       ← HTTP calls (URLSession)
│   ├── AuthManager.swift        ← Keychain token storage
│   ├── OfflineBuffer.swift      ← Pending entries queue
│   ├── Models.swift             ← Project, TimeEntry structs
│   └── Assets.xcassets          ← Menu bar icon
├── BlazzTime.entitlements
└── Info.plist
```

- SwiftUI pure, deployment target macOS 14 (Sonoma)
- Zero external dependencies
- No dock icon, no window — menu bar only

## UI — Popover

```
┌─────────────────────────────┐
│  ⏱ Blazz Time              │
│                             │
│  Projet    [▾ Client > Proj]│
│  Durée     [  1.5  ] h     │
│  Note      [ réunion cli… ] │
│                             │
│  [     Enregistrer     ]    │
│                             │
│  Aujourd'hui : 6h30 · 520€ │
│  ─────────────────────────  │
│  1h30  Acme > Refonte   ✓  │
│  2h00  Foo > API        ✓  │
│  3h00  Acme > Refonte   ✓  │
└─────────────────────────────┘
```

- **Project dropdown:** active projects grouped by client. From `projects:listActive`.
- **Duration:** numeric field, step 0.25 (15 min increments). Default: `1.0`.
- **Note:** optional single-line text field. Maps to `description`.
- **Submit button:** calls `timeEntries:create` with `date = today`, `billable = true`.
- **Today summary:** total hours + estimated revenue.
- **Entry list:** each line = duration + client > project name.
- **Popover size:** ~300x280px.

### States
- **Not authenticated** → "Se connecter" button with instructions
- **Loading** → native `ProgressView` spinner
- **Ready** → form + today summary
- **Success** → green check + sound (`NSSound("Tink")`) + summary refreshed
- **Error** → red label, form stays filled for retry
- **Offline pending** → orange dot on menu bar icon

## Convex API

### Existing endpoints used

| Call | Path | Args | When |
|------|------|------|------|
| List active projects | `projects:listActive` | `{}` | Popover open |
| Create time entry | `timeEntries:create` | `{ projectId, date, minutes, hourlyRate, billable: true, description }` | Submit |

### New query required

`timeEntries:listByDate` — new query in `convex/timeEntries.ts`:
- Args: `{ date: string }` (format "YYYY-MM-DD")
- Returns: all time entries for that date, all projects
- Used: popover open + after submit

### Data mapping
- `minutes` = duration input × 60 (e.g. 1.5h → 90)
- `hourlyRate` = project.tjm / project.hoursPerDay (snapshot at creation, same as web)
- `date` = today formatted as "YYYY-MM-DD"
- Header: `Authorization: Bearer <convex_token>`
- Transport: `URLSession.shared` with `async/await`

## Authentication

### V1 — Manual token
1. User logs into Blazz Ops web app
2. A new Convex HTTP endpoint (`GET /api/auth/token`) returns the session token
3. User copies token into BlazzTime (first-launch prompt or Settings)
4. Token stored in macOS Keychain (`kSecClassGenericPassword`)
5. On 401 response, app clears Keychain and shows "Se connecter" again

### V2 (future) — Native OAuth
- `ASWebAuthenticationSession` with `blazztime://auth` callback
- Requires investigation of Convex Auth token exchange from native clients
- Deferred: risk too high for V1, manual token is sufficient for single user

## Offline Buffer

- If network unavailable at submit time, entry saved to `~/Library/Application Support/BlazzTime/pending.json`
- On next successful submit or popover open, pending entries are flushed automatically
- Orange dot on menu bar icon while entries are pending
- Entries stored with full payload (ready to send as-is)

## UX Behavior

- **Launch at login:** via `SMAppService` (opt-in)
- **No dock icon, no window** — menu bar only (`LSUIElement = true`)
- **Global shortcut:** `⌥T` (Option+T) to toggle popover via `NSEvent.addGlobalMonitorForEvents`
- **Popover dismissal:** auto-close on click outside
- **Project list:** cached in memory, refreshed each popover open
- **Sound:** `NSSound(named: "Tink")` on successful submit

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Convex Auth token flow unclear for native clients | Blocks auth entirely | V1 uses manual token; investigate OAuth for V2 |
| `timeEntries:list` lacks date-only filter | Can't show today's entries | Add `listByDate` query (small change) |
| macOS 14+ requirement | Excludes older Macs | Acceptable — MenuBarExtra requires Sonoma |
| No offline = unusable without network | Lost entries | Offline buffer with auto-sync |
