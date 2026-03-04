# UserMenu Design

**Date:** 2026-03-04
**Status:** Approved

## Problem

`packages/ui/src/components/patterns/user-menu.tsx` exists but:
- Uses `useRouter` from `next/navigation` (hardcoded routes to `/examples/crm/settings`)
- Logout logic hardcoded via `fetch /api/auth/logout`
- Cannot be rendered in the docs app (Vite/TanStack Router)
- No documentation page exists

## Solution: Approach B — Refactor + Document

### 1. Refactor `packages/ui/src/components/patterns/user-menu.tsx`

Replace internal router/fetch logic with optional callbacks. Pattern mirrors `blocks/org-menu.tsx`.

**New interface:**

```tsx
interface UserMenuUser {
  name: string
  email?: string
  avatar?: string
  role?: string
}

interface UserMenuProps {
  user?: UserMenuUser
  onProfile?: () => void
  onSettings?: () => void
  onLogout?: () => void
  className?: string
}
```

- Remove `useRouter` import and all `next/navigation` deps
- Remove hardcoded routes
- If `onProfile` not provided → Profil item hidden
- If `onSettings` not provided → Paramètres item hidden
- If `onLogout` not provided → Déconnecter item hidden (or always shown but no-op)
- Keep Badge "Pro" (cosmetic, hardcoded for now)
- Keep initials calculation
- Keep existing visual design

### 2. Create Doc Page

**File:** `apps/docs/src/routes/_docs/docs/components/patterns/user-menu.tsx`

**Sections:**

| Section | Content |
|---------|---------|
| Hero | Live demo — UserMenu with mock user, all callbacks as `console.log` |
| Examples | Basic (all callbacks), Profile only, With avatar URL |
| Props | UserMenuProps table + UserMenuUser type table |
| Best Practices | Placement, destructive action separation |
| Related | DropdownMenu, Avatar, OrgMenu, SidebarUserMenu |

### 3. Navigation Config

Add to `pat-utilities` in `apps/docs/src/config/navigation.ts`:

```ts
{
  title: "User Menu",
  url: "/docs/components/patterns/user-menu",
  keywords: ["user", "account", "profile", "logout", "avatar menu"],
}
```

## Files Modified

- `packages/ui/src/components/patterns/user-menu.tsx` — refactor (remove next/navigation, add callbacks)
- `apps/docs/src/routes/_docs/docs/components/patterns/user-menu.tsx` — new doc page
- `apps/docs/src/config/navigation.ts` — add nav entry

## Out of Scope

- Moving to `blocks/` (future: Approach C)
- `sidebar-user.tsx` refactor (separate task)
- Auth integration patterns (consumer responsibility)
