# Ops Command Palette (CMD+K) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a global CMD+K command palette to the ops app with navigation, entity creation dialogs, and theme toggle.

**Architecture:** A single `OpsCommandPalette` component using `CommandDialog` from `@blazz/ui`. It manages its own CMD+K listener, renders the command list, and hosts creation dialogs internally. Mounted once in the main layout.

**Tech Stack:** `@blazz/ui` Command components (cmdk), next-themes, convex mutations, next/navigation

---

### Task 1: Create OpsCommandPalette component

**Files:**
- Create: `apps/ops/components/ops-command-palette.tsx`

**Step 1: Create the component with CMD+K listener, navigation commands, create commands, and theme toggle**

```tsx
"use client"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@blazz/ui/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { useQuery } from "convex/react"
import {
  Banknote,
  Bookmark,
  CheckSquare,
  Clock,
  FileText,
  FolderOpen,
  Key,
  LayoutDashboard,
  MessageSquare,
  Moon,
  Package,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { ClientForm } from "@/components/client-form"
import { api } from "@/convex/_generated/api"

type CreateDialog = "client" | "todo" | null

const NAV_ITEMS = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, keywords: ["home", "accueil"] },
  { title: "Aujourd'hui", url: "/today", icon: Sun, keywords: ["today", "jour"] },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Projets", url: "/projects", icon: FolderOpen, keywords: ["projects"] },
  { title: "Suivi de temps", url: "/time", icon: Clock, keywords: ["time", "tracking", "temps"] },
  { title: "Récapitulatif", url: "/recap", icon: Clock, keywords: ["recap", "summary"] },
  { title: "Finances", url: "/finances", icon: Banknote, keywords: ["money", "argent"] },
  { title: "Todos", url: "/todos", icon: CheckSquare, keywords: ["tasks", "tâches"] },
  { title: "Notes", url: "/notes", icon: FileText },
  { title: "Bookmarks", url: "/bookmarks", icon: Bookmark, keywords: ["favoris", "liens"] },
  { title: "Chat", url: "/chat", icon: MessageSquare, keywords: ["ai", "assistant"] },
  { title: "Packages", url: "/packages", icon: Package, keywords: ["npm"] },
  { title: "Licences", url: "/licenses", icon: Key },
  { title: "Paramètres", url: "/settings", icon: Settings, keywords: ["config", "préférences"] },
]

export function OpsCommandPalette() {
  const [open, setOpen] = useState(false)
  const [createDialog, setCreateDialog] = useState<CreateDialog>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // CMD+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleNav = useCallback(
    (url: string) => {
      router.push(url)
      setOpen(false)
    },
    [router]
  )

  const handleCreate = useCallback((dialog: CreateDialog) => {
    setOpen(false)
    // Small delay so command dialog closes before creation dialog opens
    setTimeout(() => setCreateDialog(dialog), 150)
  }, [])

  const handleToggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
    setOpen(false)
  }, [theme, setTheme])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Commande ou recherche…" />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4">
              <Search className="h-10 w-10 text-fg-muted/40" />
              <p className="text-sm text-fg-muted">Aucun résultat</p>
            </div>
          </CommandEmpty>

          <CommandGroup heading="Créer">
            <CommandItem onSelect={() => handleCreate("client")} keywords={["nouveau", "new", "ajouter"]}>
              <Plus className="mr-2 size-4 text-fg-muted" />
              Nouveau client
            </CommandItem>
            <CommandItem onSelect={() => handleCreate("todo")} keywords={["nouveau", "new", "tâche", "task"]}>
              <Plus className="mr-2 size-4 text-fg-muted" />
              Nouveau todo
            </CommandItem>
            <CommandItem onSelect={() => handleNav("/notes")} keywords={["nouveau", "new", "créer"]}>
              <Plus className="mr-2 size-4 text-fg-muted" />
              Nouvelle note
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigation">
            {NAV_ITEMS.map((item) => (
              <CommandItem key={item.url} onSelect={() => handleNav(item.url)} keywords={item.keywords}>
                <item.icon className="mr-2 size-4 text-fg-muted" />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Apparence">
            <CommandItem onSelect={handleToggleTheme} keywords={["theme", "dark", "light", "sombre", "clair"]}>
              {theme === "dark" ? (
                <Sun className="mr-2 size-4 text-fg-muted" />
              ) : (
                <Moon className="mr-2 size-4 text-fg-muted" />
              )}
              {theme === "dark" ? "Mode clair" : "Mode sombre"}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Client creation dialog */}
      <Dialog open={createDialog === "client"} onOpenChange={(v) => !v && setCreateDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau client</DialogTitle>
          </DialogHeader>
          <ClientForm
            onSuccess={() => setCreateDialog(null)}
            onCancel={() => setCreateDialog(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Todo creation dialog — inline with convex mutation */}
      <CreateTodoDialog
        open={createDialog === "todo"}
        onOpenChange={(v) => !v && setCreateDialog(null)}
      />
    </>
  )
}
```

The `CreateTodoDialog` is a self-contained component in the same file that handles todo creation with minimal fields (title + optional priority). It uses `api.todos.create` directly, avoiding the complexity of the full `AddTodoDialog` which needs projects/categories data already loaded.

```tsx
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { DialogFooter } from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"

function CreateTodoDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const create = useMutation(api.todos.create)
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function reset() {
    setText("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setIsSubmitting(true)
    try {
      await create({
        text: text.trim(),
        status: "todo",
        source: "app",
        priority: "normal",
      })
      toast.success("Todo créé")
      reset()
      onOpenChange(false)
    } catch {
      toast.error("Erreur lors de la création")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <BlockStack gap="400">
            <Input
              autoFocus
              placeholder="Que dois-tu faire ?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={!text.trim() || isSubmitting}>
                {isSubmitting ? "…" : "Créer"}
              </Button>
            </DialogFooter>
          </BlockStack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

All imports should be consolidated at the top of the file. The code snippets above are split for readability.

**Step 2: Commit**

```bash
git add apps/ops/components/ops-command-palette.tsx
git commit -m "feat(ops): add command palette component with CMD+K"
```

---

### Task 2: Mount in main layout

**Files:**
- Modify: `apps/ops/app/(main)/layout.tsx`

**Step 1: Add OpsCommandPalette to the layout**

```tsx
import { OpsCommandPalette } from "@/components/ops-command-palette"
import { OpsFrame } from "@/components/ops-frame"
import { RouteGuard } from "@/components/route-guard"
import { AuthGuard } from "./auth-guard"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OpsFrame>
        <RouteGuard>{children}</RouteGuard>
      </OpsFrame>
      <OpsCommandPalette />
    </AuthGuard>
  )
}
```

**Step 2: Commit**

```bash
git add apps/ops/app/(main)/layout.tsx
git commit -m "feat(ops): mount command palette in main layout"
```

---

### Task 3: Verify manually

**Step 1: Start dev server and test**

```bash
pnpm dev:ops
```

Test checklist:
- [ ] CMD+K opens the palette
- [ ] Typing filters commands
- [ ] Clicking a nav item navigates
- [ ] "Nouveau client" opens the client form dialog
- [ ] "Nouveau todo" opens the todo creation dialog
- [ ] Theme toggle switches dark/light
- [ ] ESC closes the palette
- [ ] CMD+K again closes if already open
