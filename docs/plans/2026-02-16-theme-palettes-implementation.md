# Theme Palettes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Corporate and Warm theme palettes with a dropdown switcher in the top bar.

**Architecture:** CSS `data-theme` attribute on `<html>` overrides the 25 design tokens. A React context manages the palette selection independently from next-themes light/dark mode. A dropdown in the top bar lets users switch palettes.

**Tech Stack:** CSS custom properties, React context, next-themes, Lucide icons, Base UI Popover/Menu.

---

### Task 1: Add Corporate and Warm CSS theme blocks

**Files:**
- Modify: `app/globals.css` (append before `@layer base`)

**Step 1: Add Corporate theme (light + dark)**

Insert before the Shiki dual-theme comment block:

```css
/* =============================================
   THEME: Corporate — Navy accent, pure neutral
   ============================================= */

html[data-theme="corporate"] {
	--accent: oklch(0.40 0.18 250);
	--accent-hover: oklch(0.35 0.18 250);
	--accent-foreground: oklch(0.985 0 0);
	--bg-app: oklch(0.965 0 0);
	--bg-surface: oklch(1 0 0);
	--bg-raised: oklch(0.945 0 0);
	--bg-overlay: oklch(1 0 0);
	--border-default: oklch(0.88 0 0);
	--border-subtle: oklch(0.93 0 0);
	--text-primary: oklch(0.15 0 0);
	--text-secondary: oklch(0.40 0 0);
	--text-muted: oklch(0.55 0 0);
}

html[data-theme="corporate"].dark {
	--accent: oklch(0.55 0.18 250);
	--accent-hover: oklch(0.48 0.18 250);
	--accent-foreground: oklch(0.985 0 0);
	--bg-app: oklch(0.145 0 0);
	--bg-surface: oklch(0.178 0 0);
	--bg-raised: oklch(0.215 0 0);
	--bg-overlay: oklch(0.25 0 0);
	--border-default: oklch(0.35 0 0 / 0.6);
	--border-subtle: oklch(0.35 0 0 / 0.3);
	--text-primary: oklch(0.985 0 0);
	--text-secondary: oklch(0.65 0 0);
	--text-muted: oklch(0.50 0 0);
}
```

**Step 2: Add Warm theme (light + dark)**

```css
/* =============================================
   THEME: Warm — Amber accent, cream surfaces
   ============================================= */

html[data-theme="warm"] {
	--accent: oklch(0.55 0.17 70);
	--accent-hover: oklch(0.48 0.17 70);
	--accent-foreground: oklch(0.985 0 0);
	--bg-app: oklch(0.96 0.01 75);
	--bg-surface: oklch(0.995 0.005 75);
	--bg-raised: oklch(0.935 0.01 75);
	--bg-overlay: oklch(0.995 0.005 75);
	--border-default: oklch(0.86 0.01 75);
	--border-subtle: oklch(0.91 0.008 75);
	--text-primary: oklch(0.18 0.01 60);
	--text-secondary: oklch(0.42 0.02 60);
	--text-muted: oklch(0.55 0.015 60);
}

html[data-theme="warm"].dark {
	--accent: oklch(0.70 0.15 70);
	--accent-hover: oklch(0.63 0.15 70);
	--accent-foreground: oklch(0.15 0 0);
	--bg-app: oklch(0.155 0.01 60);
	--bg-surface: oklch(0.19 0.01 60);
	--bg-raised: oklch(0.225 0.01 60);
	--bg-overlay: oklch(0.26 0.01 60);
	--border-default: oklch(0.35 0.01 60 / 0.6);
	--border-subtle: oklch(0.35 0.01 60 / 0.3);
	--text-primary: oklch(0.97 0.01 75);
	--text-secondary: oklch(0.65 0.015 60);
	--text-muted: oklch(0.50 0.01 60);
}
```

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(themes): add Corporate and Warm CSS theme palettes"
```

---

### Task 2: Create theme palette context

**Files:**
- Create: `lib/theme-context.tsx`

**Step 1: Implement the context and provider**

```tsx
"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useTheme } from "next-themes"

export type ThemePalette = "slate" | "corporate" | "warm"

const RECOMMENDED_MODE: Record<ThemePalette, string> = {
	slate: "dark",
	corporate: "light",
	warm: "light",
}

const ThemePaletteContext = createContext<{
	palette: ThemePalette
	setPalette: (palette: ThemePalette) => void
}>({
	palette: "slate",
	setPalette: () => {},
})

export function ThemePaletteProvider({ children }: { children: React.ReactNode }) {
	const [palette, setPaletteState] = useState<ThemePalette>("slate")
	const [mounted, setMounted] = useState(false)
	const { setTheme } = useTheme()

	useEffect(() => {
		const stored = localStorage.getItem("theme-palette") as ThemePalette | null
		if (stored && stored in RECOMMENDED_MODE) {
			setPaletteState(stored)
			if (stored === "slate") {
				document.documentElement.removeAttribute("data-theme")
			} else {
				document.documentElement.setAttribute("data-theme", stored)
			}
		}
		setMounted(true)
	}, [])

	const setPalette = useCallback(
		(next: ThemePalette) => {
			setPaletteState(next)
			localStorage.setItem("theme-palette", next)
			if (next === "slate") {
				document.documentElement.removeAttribute("data-theme")
			} else {
				document.documentElement.setAttribute("data-theme", next)
			}
			setTheme(RECOMMENDED_MODE[next])
		},
		[setTheme]
	)

	if (!mounted) return <>{children}</>

	return (
		<ThemePaletteContext.Provider value={{ palette, setPalette }}>
			{children}
		</ThemePaletteContext.Provider>
	)
}

export function useThemePalette() {
	return useContext(ThemePaletteContext)
}
```

**Step 2: Commit**

```bash
git add lib/theme-context.tsx
git commit -m "feat(themes): add theme palette context and provider"
```

---

### Task 3: Create palette switcher dropdown

**Files:**
- Create: `components/layout/theme-palette-switcher.tsx`

**Context:** Use Base UI Menu for the dropdown (already used in the codebase). Lucide `Paintbrush` icon for the trigger. Each item shows a colored dot + label + checkmark if active.

**Step 1: Implement the switcher**

```tsx
"use client"

import { Paintbrush, Check } from "lucide-react"
import { useThemePalette, type ThemePalette } from "@/lib/theme-context"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const palettes: { id: ThemePalette; label: string; color: string }[] = [
	{ id: "slate", label: "Slate", color: "oklch(0.585 0.22 275)" },
	{ id: "corporate", label: "Corporate", color: "oklch(0.40 0.18 250)" },
	{ id: "warm", label: "Warm", color: "oklch(0.55 0.17 70)" },
]

export function ThemePaletteSwitcher() {
	const { palette, setPalette } = useThemePalette()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						className="rounded-lg p-2 transition-colors hover:bg-gray-800"
						aria-label="Changer le thème"
					>
						<Paintbrush className="h-4 w-4 text-gray-300" />
					</button>
				}
			/>
			<DropdownMenuContent align="end" sideOffset={8}>
				{palettes.map((p) => (
					<DropdownMenuItem key={p.id} onClick={() => setPalette(p.id)}>
						<span
							className="h-3 w-3 rounded-full shrink-0"
							style={{ backgroundColor: p.color }}
						/>
						<span className="flex-1">{p.label}</span>
						{palette === p.id && <Check className="h-3.5 w-3.5 text-fg-muted" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
```

**Step 2: Commit**

```bash
git add components/layout/theme-palette-switcher.tsx
git commit -m "feat(themes): add palette switcher dropdown component"
```

---

### Task 4: Wire provider into layout and switcher into top bar

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/layout/app-top-bar.tsx`

**Step 1: Add ThemePaletteProvider to layout**

In `app/layout.tsx`, wrap children with the provider INSIDE `ThemeProvider` (so it can access `useTheme`):

```tsx
import { ThemePaletteProvider } from "@/lib/theme-context"

// In the JSX, wrap children:
<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
	<ThemePaletteProvider>
		{children}
	</ThemePaletteProvider>
</ThemeProvider>
```

**Step 2: Add palette switcher to top bar**

In `components/layout/app-top-bar.tsx`, import and add `ThemePaletteSwitcher` next to `ThemeToggle`:

```tsx
import { ThemePaletteSwitcher } from "./theme-palette-switcher"

// In the right section, before ThemeToggle:
<div className="flex items-center gap-2 shrink-0 justify-end">
	<ThemePaletteSwitcher />
	<ThemeToggle />
	{!minimal && (
		<>
			<NotificationSheet />
			<UserMenu user={user} />
		</>
	)}
</div>
```

**Step 3: Commit**

```bash
git add app/layout.tsx components/layout/app-top-bar.tsx
git commit -m "feat(themes): wire palette provider and switcher into app"
```

---

### Task 5: Verify build and push

**Step 1: Run build**

```bash
npx next build
```

Expected: Build passes with no errors.

**Step 2: Push all commits**

```bash
git push
```
