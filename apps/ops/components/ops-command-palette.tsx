"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@blazz/ui/components/ui/command"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Kbd } from "@blazz/ui/components/ui/kbd"
import { useMutation } from "convex/react"
import { Banknote, Bookmark, CheckSquare, Clock, FileText, FolderOpen, Key, LayoutDashboard, MessageSquare, Moon, Package, Plus, Search, Settings, Sun, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { ClientForm } from "@/components/client-form"
import { api } from "@/convex/_generated/api"

// ---------------------------------------------------------------------------
// Inline CreateTodoDialog
// ---------------------------------------------------------------------------

function CreateTodoDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
	const [title, setTitle] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const createTodo = useMutation(api.todos.create)

	const handleSubmit = async () => {
		if (!title.trim()) return
		setSubmitting(true)
		try {
			await createTodo({
				text: title.trim(),
				status: "todo",
				source: "app",
				priority: "normal",
			})
			toast.success("Todo créé")
			setTitle("")
			onOpenChange(false)
		} catch {
			toast.error("Erreur lors de la création du todo")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent size="sm">
				<DialogHeader>
					<DialogTitle>Nouveau todo</DialogTitle>
				</DialogHeader>
				<BlockStack gap="300">
					<Input
						placeholder="Titre du todo..."
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !submitting) {
								e.preventDefault()
								handleSubmit()
							}
						}}
						autoFocus
					/>
				</BlockStack>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
						Annuler
					</Button>
					<Button onClick={handleSubmit} disabled={!title.trim() || submitting}>
						Créer
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

// ---------------------------------------------------------------------------
// Navigation items
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
	{
		label: "Dashboard",
		href: "/",
		icon: LayoutDashboard,
		keywords: ["home", "accueil"],
		shortcut: "D",
	},
	{ label: "Aujourd'hui", href: "/today", icon: Sun, keywords: ["today", "jour"], shortcut: "A" },
	{
		label: "Clients",
		href: "/clients",
		icon: Users,
		keywords: ["client", "customer"],
		shortcut: "C",
	},
	{
		label: "Projets",
		href: "/projects",
		icon: FolderOpen,
		keywords: ["project", "projet"],
		shortcut: "P",
	},
	{
		label: "Suivi de temps",
		href: "/time",
		icon: Clock,
		keywords: ["temps", "time", "tracking"],
		shortcut: "T",
	},
	{ label: "Récapitulatif", href: "/recap", icon: FileText, keywords: ["recap", "summary", "csv"] },
	{
		label: "Finances",
		href: "/finances",
		icon: Banknote,
		keywords: ["finance", "argent", "money"],
		shortcut: "F",
	},
	{ label: "Todos", href: "/todos", icon: CheckSquare, keywords: ["todo", "tache", "task"] },
	{ label: "Notes", href: "/notes", icon: FileText, keywords: ["note", "markdown"], shortcut: "N" },
	{
		label: "Bookmarks",
		href: "/bookmarks",
		icon: Bookmark,
		keywords: ["bookmark", "lien", "link"],
		shortcut: "B",
	},
	{ label: "Chat", href: "/chat", icon: MessageSquare, keywords: ["chat", "message", "ai"] },
	{ label: "Packages", href: "/packages", icon: Package, keywords: ["package", "npm"] },
	{ label: "Licences", href: "/licenses", icon: Key, keywords: ["licence", "license", "key"] },
	{
		label: "Paramètres",
		href: "/settings",
		icon: Settings,
		keywords: ["settings", "config", "param"],
		shortcut: "S",
	},
] as const

// Build shortcut map for keyboard handling
const SHORTCUT_MAP = Object.fromEntries(NAV_ITEMS.filter((item) => "shortcut" in item && item.shortcut).map((item) => [item.shortcut!.toLowerCase(), item.href])) as Record<string, string>

// ---------------------------------------------------------------------------
// OpsCommandPalette
// ---------------------------------------------------------------------------

export function OpsCommandPalette() {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [clientDialogOpen, setClientDialogOpen] = useState(false)
	const [todoDialogOpen, setTodoDialogOpen] = useState(false)
	const router = useRouter()
	const { theme, setTheme } = useTheme()

	// Reset search when palette closes
	useEffect(() => {
		if (!open) setSearch("")
	}, [open])

	// CMD+K listener + shortcut keys when palette is open and search is empty
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((prev) => !prev)
				return
			}

			// Handle single-key shortcuts only when palette is open AND search is empty
			if (!open || search) return
			if (e.metaKey || e.ctrlKey || e.altKey) return

			const href = SHORTCUT_MAP[e.key.toLowerCase()]
			if (href) {
				e.preventDefault()
				setOpen(false)
				router.push(href)
			}
		}
		document.addEventListener("keydown", handler)
		return () => document.removeEventListener("keydown", handler)
	}, [open, search, router])

	const closeAndRun = useCallback((fn: () => void) => {
		setOpen(false)
		setTimeout(fn, 150)
	}, [])

	const handleNavigation = useCallback(
		(href: string) => {
			setOpen(false)
			router.push(href)
		},
		[router]
	)

	return (
		<>
			{/* Command palette */}
			<CommandDialog open={open} onOpenChange={setOpen} size="lg">
				<CommandInput placeholder="Rechercher une commande..." value={search} onValueChange={setSearch} />
				<CommandList>
					<CommandEmpty>
						<BlockStack gap="200" inlineAlign="center" align="center">
							<Search className="size-5 text-fg-muted" />
							<span className="text-fg-muted">Aucun résultat</span>
						</BlockStack>
					</CommandEmpty>

					{/* Créer */}
					<CommandGroup heading="Créer">
						<CommandItem onSelect={() => closeAndRun(() => setClientDialogOpen(true))}>
							<Plus className="mr-2 size-4" />
							Nouveau client
						</CommandItem>
						<CommandItem onSelect={() => closeAndRun(() => setTodoDialogOpen(true))}>
							<Plus className="mr-2 size-4" />
							Nouveau todo
						</CommandItem>
						<CommandItem onSelect={() => handleNavigation("/notes")}>
							<Plus className="mr-2 size-4" />
							Nouvelle note
						</CommandItem>
					</CommandGroup>

					<CommandSeparator />

					{/* Navigation */}
					<CommandGroup heading="Navigation">
						{NAV_ITEMS.map((item) => (
							<CommandItem key={item.href} onSelect={() => handleNavigation(item.href)} keywords={[...item.keywords]}>
								<item.icon className="mr-2 size-4" />
								{item.label}
								{"shortcut" in item && item.shortcut && <Kbd className="ml-auto">{item.shortcut}</Kbd>}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />

					{/* Apparence */}
					<CommandGroup heading="Apparence">
						<CommandItem
							onSelect={() => {
								setTheme(theme === "dark" ? "light" : "dark")
								setOpen(false)
							}}
						>
							{theme === "dark" ? (
								<>
									<Sun className="mr-2 size-4" />
									Mode clair
								</>
							) : (
								<>
									<Moon className="mr-2 size-4" />
									Mode sombre
								</>
							)}
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>

			{/* Client creation dialog (outside CommandDialog) */}
			<Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
				<DialogContent size="md">
					<DialogHeader>
						<DialogTitle>Nouveau client</DialogTitle>
					</DialogHeader>
					<ClientForm onSuccess={() => setClientDialogOpen(false)} onCancel={() => setClientDialogOpen(false)} />
				</DialogContent>
			</Dialog>

			{/* Todo creation dialog (outside CommandDialog) */}
			<CreateTodoDialog open={todoDialogOpen} onOpenChange={setTodoDialogOpen} />
		</>
	)
}
