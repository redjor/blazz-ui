# Today View Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter une page `/today` dans Blazz Ops — daily planner affichant les stats du jour, les projets actifs avec quick-log, les entrées de temps du jour, et les todos actifs.

**Architecture:** Nouvelle route `apps/ops/app/today/page.tsx`, `"use client"`, pattern `useOpsTopBar`. Extraction de `EditTodoDialog` vers un composant partagé pour réutilisation. Toutes les queries Convex existantes sont réutilisées sans modification.

**Tech Stack:** Next.js 15, Convex, `@blazz/ui` (StatsGrid, PageHeader, Button, Dialog), date-fns, lucide-react

---

### Task 1: Ajouter "Aujourd'hui" dans la sidebar

**Files:**
- Modify: `apps/ops/components/ops-frame.tsx:6-7` (imports) et `:16-25` (nav items)

**Step 1: Ajouter l'import de `Sun` et la nav item**

Dans `apps/ops/components/ops-frame.tsx`, modifier la ligne d'import lucide et le tableau `navigation` :

```tsx
// Ligne 6 — ajouter Sun
import { LayoutDashboard, Sun, Users, Clock, CheckSquare } from "lucide-react"

// Dans opsSidebarConfig.navigation[0].items, après Dashboard :
{ title: "Dashboard", url: "/", icon: LayoutDashboard },
{ title: "Aujourd'hui", url: "/today", icon: Sun },
{ title: "Clients", url: "/clients", icon: Users },
// ... reste inchangé
```

**Step 2: Vérifier visuellement**

Lancer `pnpm dev:ops` et ouvrir `http://localhost:3120`. L'item "Aujourd'hui" doit apparaître dans la sidebar entre Dashboard et Clients.

**Step 3: Commit**

```bash
git add apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add Aujourd'hui nav item to sidebar"
```

---

### Task 2: Extraire EditTodoDialog vers un composant partagé

**Files:**
- Create: `apps/ops/components/edit-todo-dialog.tsx`
- Modify: `apps/ops/app/todos/page.tsx`

**Step 1: Créer `apps/ops/components/edit-todo-dialog.tsx`**

Copier le composant `EditTodoDialog` (lignes 44–187 de `todos/page.tsx`) dans le nouveau fichier. Il faut aussi déplacer les imports nécessaires et les types dépendants (`Category`, `PriorityIcon`, `PRIORITY_ICON`, `ProjectBadge`).

Contenu complet du fichier :

```tsx
"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { Badge } from "@blazz/ui/components/ui/badge"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { useMutation } from "convex/react"
import { Flag, Trash2 } from "lucide-react"
import { useState } from "react"
import { CategoryBadge } from "@/components/manage-categories-sheet"
import { TagInput } from "@/components/tag-input"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

export type Category = { _id: string; name: string; color?: string }

const PRIORITY_ICON: Record<string, { color: string }> = {
	urgent: { color: "text-destructive" },
	high: { color: "text-orange-500" },
	low: { color: "text-fg-muted" },
}

export function PriorityIcon({ priority }: { priority?: string }) {
	if (!priority || priority === "normal") return null
	const config = PRIORITY_ICON[priority]
	if (!config) return null
	return <Flag className={`size-3 shrink-0 ${config.color}`} />
}

export function ProjectBadge({
	projectId,
	projects,
}: {
	projectId?: Id<"projects">
	projects: Doc<"projects">[]
}) {
	if (!projectId) return null
	const proj = projects.find((p) => p._id === projectId)
	if (!proj) return null
	return (
		<Badge variant="secondary" fill="subtle" size="sm" className="max-w-[100px] truncate">
			{proj.name}
		</Badge>
	)
}

export function EditTodoDialog({
	todo,
	open,
	onOpenChange,
	projects,
	categories,
	allTags,
}: {
	todo: Doc<"todos">
	open: boolean
	onOpenChange: (v: boolean) => void
	projects: Doc<"projects">[]
	categories: Category[]
	allTags: string[]
}) {
	const updateTodo = useMutation(api.todos.update)
	const remove = useMutation(api.todos.remove)
	const [text, setText] = useState(todo.text)
	const [description, setDescription] = useState(todo.description ?? "")
	const [priority, setPriority] = useState(todo.priority ?? "normal")
	const [projectId, setProjectId] = useState(todo.projectId ?? "")
	const [categoryId, setCategoryId] = useState(todo.categoryId ?? "")
	const [tags, setTags] = useState<string[]>(todo.tags ?? [])

	function resetToTodo() {
		setText(todo.text)
		setDescription(todo.description ?? "")
		setPriority(todo.priority ?? "normal")
		setProjectId(todo.projectId ?? "")
		setCategoryId(todo.categoryId ?? "")
		setTags(todo.tags ?? [])
	}

	const unchanged =
		text.trim() === todo.text &&
		description.trim() === (todo.description ?? "") &&
		priority === (todo.priority ?? "normal") &&
		(projectId || undefined) === todo.projectId &&
		(categoryId || undefined) === todo.categoryId &&
		JSON.stringify(tags) === JSON.stringify(todo.tags ?? [])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!text.trim()) return
		await updateTodo({
			id: todo._id,
			text: text.trim(),
			description: description.trim() || undefined,
			priority: priority as "urgent" | "high" | "normal" | "low",
			projectId: (projectId || undefined) as Id<"projects"> | undefined,
			categoryId: (categoryId || undefined) as Id<"categories"> | undefined,
			tags: tags.length > 0 ? tags : undefined,
		})
		onOpenChange(false)
	}

	async function handleDelete() {
		await remove({ id: todo._id })
		onOpenChange(false)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (!v) resetToTodo()
				onOpenChange(v)
			}}
		>
			<DialogContent size="lg">
				<DialogHeader>
					<DialogTitle>Modifier le todo</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						autoFocus
						placeholder="Titre"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<Textarea
						placeholder="Description (optionnelle)"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={3}
					/>
					<div className="flex gap-2">
						<Select value={priority} onValueChange={setPriority}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Priorité" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="urgent">Urgent</SelectItem>
								<SelectItem value="high">High</SelectItem>
								<SelectItem value="normal">Normal</SelectItem>
								<SelectItem value="low">Low</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={projectId}
							onValueChange={setProjectId}
							items={[
								{ value: "", label: "Aucun" },
								...projects.map((p) => ({ value: p._id, label: p.name })),
							]}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Projet (optionnel)" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">Aucun</SelectItem>
								{projects.map((p) => (
									<SelectItem key={p._id} value={p._id}>
										{p.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Select
						value={categoryId}
						onValueChange={setCategoryId}
						items={[
							{ value: "", label: "Aucune" },
							...categories.map((c) => ({ value: c._id, label: c.name })),
						]}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Catégorie (optionnel)" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Aucune</SelectItem>
							{categories.map((c) => (
								<SelectItem key={c._id} value={c._id}>
									<CategoryBadge name={c.name} color={c.color} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<TagInput value={tags} onChange={setTags} suggestions={allTags} />
					<div className="flex justify-between gap-2">
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={handleDelete}
							aria-label="Supprimer"
							className="text-fg-muted hover:text-destructive"
						>
							<Trash2 className="size-4" />
						</Button>
						<div className="flex gap-2">
							<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
								Annuler
							</Button>
							<Button type="submit" disabled={!text.trim() || unchanged}>
								Sauvegarder
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
```

**Step 2: Mettre à jour `todos/page.tsx`**

- Supprimer les définitions inline de `EditTodoDialog`, `Category`, `PriorityIcon`, `PRIORITY_ICON`, `ProjectBadge`
- Ajouter l'import depuis le nouveau fichier :

```tsx
import { EditTodoDialog, PriorityIcon, ProjectBadge } from "@/components/edit-todo-dialog"
import type { Category } from "@/components/edit-todo-dialog"
```

**Step 3: Vérifier que la page Todos fonctionne toujours**

Naviguer vers `http://localhost:3120/todos`, vérifier kanban + édition de todo.

**Step 4: Commit**

```bash
git add apps/ops/components/edit-todo-dialog.tsx apps/ops/app/todos/page.tsx
git commit -m "refactor(ops): extract EditTodoDialog to shared component"
```

---

### Task 3: Créer la page Today

**Files:**
- Create: `apps/ops/app/today/page.tsx`

**Step 1: Créer `apps/ops/app/today/page.tsx`**

```tsx
"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { StatsGrid } from "@blazz/ui/components/blocks/stats-grid"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Banknote, Clock, Plus } from "lucide-react"
import { useState } from "react"
import { EditTodoDialog } from "@/components/edit-todo-dialog"
import { useOpsTopBar } from "@/components/ops-frame"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { TimeEntryForm } from "@/components/time-entry-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { formatCurrency, formatMinutes } from "@/lib/format"
import { computeHourlyRate } from "@/lib/rate"

export default function TodayPage() {
	const today = format(new Date(), "yyyy-MM-dd")

	const todayEntries = useQuery(api.timeEntries.list, { from: today, to: today })
	const activeProjects = useQuery(api.projects.listActive)
	const todos = useQuery(api.todos.list, {})
	const categories = useQuery(api.categories.list, {})
	const allTags = useQuery(api.todos.listAllTags, {})

	const isLoading = todayEntries === undefined || activeProjects === undefined

	const billableEntries = todayEntries?.filter((e) => e.billable) ?? []
	const totalMinutesToday = billableEntries.reduce((s, e) => s + e.minutes, 0)
	const totalAmountToday = billableEntries.reduce(
		(s, e) => s + (e.minutes / 60) * e.hourlyRate,
		0
	)

	const activeTodos = todos?.filter((t) => t.status !== "done") ?? []
	const projectList = activeProjects ?? []
	const categoryList = categories ?? []
	const allTagsList = allTags ?? []

	const [addOpen, setAddOpen] = useState(false)
	const [editingEntry, setEditingEntry] = useState<Doc<"timeEntries"> | null>(null)
	const [editingTodo, setEditingTodo] = useState<Doc<"todos"> | null>(null)
	const [quickModal, setQuickModal] = useState<{
		open: boolean
		projectId: Id<"projects"> | null
		projectName: string | null
		hourlyRate: number | null
	}>({ open: false, projectId: null, projectName: null, hourlyRate: null })

	useOpsTopBar([{ label: "Aujourd'hui" }])

	const dateTitle = format(new Date(), "EEEE d MMMM yyyy", { locale: fr }).replace(
		/^\w/,
		(c) => c.toUpperCase()
	)

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={dateTitle}
				description="Votre journée en un coup d'œil"
				actions={[{ label: "Nouvelle entrée", onClick: () => setAddOpen(true) }]}
			/>

			<StatsGrid
				columns={2}
				loading={isLoading}
				stats={[
					{
						label: "Heures aujourd'hui",
						value: formatMinutes(totalMinutesToday),
						icon: Clock,
					},
					{
						label: "Facturable aujourd'hui",
						value: formatCurrency(totalAmountToday),
						icon: Banknote,
					},
				]}
			/>

			{/* Projets actifs */}
			<div className="space-y-3">
				<h2 className="text-sm font-medium text-fg">Projets actifs</h2>
				{projectList.length === 0 ? (
					<p className="text-sm text-fg-muted">Aucun projet actif.</p>
				) : (
					<div className="space-y-1">
						{projectList.map((project) => (
							<div
								key={project._id}
								className="flex items-center justify-between py-2 border-b border-edge last:border-0"
							>
								<div>
									<p className="text-sm font-medium text-fg">{project.name}</p>
									<p className="text-xs text-fg-muted tabular-nums">
										{project.tjm}€/j · {project.hoursPerDay}h/j
									</p>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="h-7 px-3 text-xs gap-1.5"
									onClick={() =>
										setQuickModal({
											open: true,
											projectId: project._id,
											projectName: project.name,
											hourlyRate: computeHourlyRate(project.tjm, project.hoursPerDay),
										})
									}
								>
									<Plus className="size-3" />
									Log
								</Button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Entrées d'aujourd'hui */}
			<div className="space-y-3">
				<h2 className="text-sm font-medium text-fg">Entrées d'aujourd'hui</h2>
				{todayEntries === undefined ? null : todayEntries.length === 0 ? (
					<p className="text-sm text-fg-muted">Aucune entrée pour aujourd'hui.</p>
				) : (
					<div className="space-y-0">
						{todayEntries.map((entry) => {
							const project = projectList.find((p) => p._id === entry.projectId)
							return (
								<button
									key={entry._id}
									type="button"
									className="w-full flex items-center justify-between py-2.5 border-b border-edge last:border-0 hover:bg-raised/50 transition-colors text-left"
									onClick={() => setEditingEntry(entry)}
								>
									<div className="flex items-center gap-3">
										<span className="text-xs text-fg-muted w-28 shrink-0 truncate">
											{project?.name ?? "—"}
										</span>
										<span className="text-sm text-fg">{entry.description ?? "—"}</span>
									</div>
									<span className="text-sm font-mono text-fg-muted tabular-nums">
										{formatMinutes(entry.minutes)}
									</span>
								</button>
							)
						})}
					</div>
				)}
			</div>

			{/* Todos actifs */}
			<div className="space-y-3">
				<h2 className="text-sm font-medium text-fg">Todos actifs</h2>
				{todos === undefined ? null : activeTodos.length === 0 ? (
					<p className="text-sm text-fg-muted">Aucun todo actif.</p>
				) : (
					<div className="space-y-0">
						{activeTodos.map((todo) => (
							<button
								key={todo._id}
								type="button"
								className="w-full flex items-center justify-between py-2.5 border-b border-edge last:border-0 hover:bg-raised/50 transition-colors text-left"
								onClick={() => setEditingTodo(todo)}
							>
								<span className="text-sm text-fg">{todo.text}</span>
								<span className="text-xs text-fg-muted capitalize">{todo.status}</span>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Dialog nouvelle entrée */}
			<Dialog open={addOpen} onOpenChange={setAddOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nouvelle entrée</DialogTitle>
					</DialogHeader>
					<TimeEntryForm onSuccess={() => setAddOpen(false)} onCancel={() => setAddOpen(false)} />
				</DialogContent>
			</Dialog>

			{/* Dialog édition entrée */}
			<Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier l'entrée</DialogTitle>
					</DialogHeader>
					{editingEntry && (
						<TimeEntryForm
							defaultValues={{
								id: editingEntry._id,
								projectId: editingEntry.projectId,
								date: editingEntry.date,
								minutes: editingEntry.minutes,
								description: editingEntry.description,
								billable: editingEntry.billable,
								status: editingEntry.status,
							}}
							onSuccess={() => setEditingEntry(null)}
							onCancel={() => setEditingEntry(null)}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Quick log modal */}
			<QuickTimeEntryModal
				open={quickModal.open}
				onOpenChange={(open) => setQuickModal((s) => ({ ...s, open }))}
				projectId={quickModal.projectId}
				projectName={quickModal.projectName}
				hourlyRate={quickModal.hourlyRate}
				date={today}
			/>

			{/* Dialog édition todo */}
			{editingTodo && (
				<EditTodoDialog
					key={editingTodo._id}
					todo={editingTodo}
					open={true}
					onOpenChange={(v) => !v && setEditingTodo(null)}
					projects={projectList}
					categories={categoryList}
					allTags={allTagsList}
				/>
			)}
		</div>
	)
}
```

**Step 2: Vérifier la page**

Naviguer vers `http://localhost:3120/today`. Vérifier :
- La date d'aujourd'hui s'affiche dans le titre
- Les stats du jour (0h / €0 si pas d'entrées)
- La liste des projets actifs avec bouton "Log"
- Cliquer sur "+ Log" → QuickTimeEntryModal s'ouvre avec le bon projet et la date d'aujourd'hui
- Bouton "Nouvelle entrée" → dialog TimeEntryForm s'ouvre
- Les todos actifs (non-done) s'affichent

**Step 3: Commit**

```bash
git add apps/ops/app/today/page.tsx
git commit -m "feat(ops): add Today page with daily planner"
```

---

## Récapitulatif des commits

1. `feat(ops): add Aujourd'hui nav item to sidebar`
2. `refactor(ops): extract EditTodoDialog to shared component`
3. `feat(ops): add Today page with daily planner`
