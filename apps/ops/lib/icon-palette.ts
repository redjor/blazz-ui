import {
	Briefcase,
	Building2,
	Calculator,
	Calendar,
	Clock,
	Code,
	CreditCard,
	FileText,
	FolderOpen,
	Globe,
	Hash,
	Heart,
	Home,
	Layers,
	type LucideIcon,
	Mail,
	MessageSquare,
	Package,
	Receipt,
	Settings,
	ShoppingCart,
	Star,
	Tag,
	Users,
	Wallet,
	Zap,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Palette — 8 couleurs soft, utilisées par les catégories et les projets
// ---------------------------------------------------------------------------

export interface IconColorDef {
	id: string
	label: string
	/** Classes Tailwind pour le background de la tuile (light + dark) */
	bg: string
	/** Classes Tailwind pour la couleur du texte/icon sur la tuile */
	text: string
	/** Classe bg-* pour les dots inline */
	dot: string
	/** Classe text-* pour les icons inline */
	iconText: string
}

export const ICON_COLORS: IconColorDef[] = [
	{ id: "indigo", label: "Indigo", bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400", dot: "bg-indigo-500", iconText: "text-indigo-500" },
	{ id: "violet", label: "Violet", bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400", dot: "bg-violet-500", iconText: "text-violet-500" },
	{ id: "rose", label: "Rose", bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400", dot: "bg-rose-500", iconText: "text-rose-500" },
	{ id: "orange", label: "Orange", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500", iconText: "text-orange-500" },
	{ id: "amber", label: "Ambre", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500", iconText: "text-amber-500" },
	{ id: "emerald", label: "Émeraude", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", iconText: "text-emerald-500" },
	{ id: "sky", label: "Ciel", bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-400", dot: "bg-sky-500", iconText: "text-sky-500" },
	{ id: "zinc", label: "Zinc", bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-700 dark:text-zinc-300", dot: "bg-zinc-400", iconText: "text-zinc-400" },
]

export function getIconColorClasses(color?: string): IconColorDef {
	return ICON_COLORS.find((c) => c.id === color) ?? ICON_COLORS.find((c) => c.id === "zinc")!
}

// ---------------------------------------------------------------------------
// Icon set — 25 lucide icons curated pour freelance / project management
// ---------------------------------------------------------------------------

export interface IconDef {
	id: string
	label: string
	icon: LucideIcon
}

export const ICON_SET: IconDef[] = [
	{ id: "folder", label: "Dossier", icon: FolderOpen },
	{ id: "briefcase", label: "Travail", icon: Briefcase },
	{ id: "users", label: "Personnes", icon: Users },
	{ id: "building", label: "Entreprise", icon: Building2 },
	{ id: "receipt", label: "Facture", icon: Receipt },
	{ id: "wallet", label: "Finances", icon: Wallet },
	{ id: "credit-card", label: "Paiement", icon: CreditCard },
	{ id: "calculator", label: "Calcul", icon: Calculator },
	{ id: "calendar", label: "Calendrier", icon: Calendar },
	{ id: "clock", label: "Temps", icon: Clock },
	{ id: "file-text", label: "Document", icon: FileText },
	{ id: "mail", label: "Email", icon: Mail },
	{ id: "message", label: "Message", icon: MessageSquare },
	{ id: "code", label: "Code", icon: Code },
	{ id: "globe", label: "Web", icon: Globe },
	{ id: "package", label: "Package", icon: Package },
	{ id: "layers", label: "Couches", icon: Layers },
	{ id: "tag", label: "Label", icon: Tag },
	{ id: "hash", label: "Hash", icon: Hash },
	{ id: "star", label: "Favori", icon: Star },
	{ id: "heart", label: "Important", icon: Heart },
	{ id: "zap", label: "Urgent", icon: Zap },
	{ id: "shopping-cart", label: "Achat", icon: ShoppingCart },
	{ id: "home", label: "Maison", icon: Home },
	{ id: "settings", label: "Config", icon: Settings },
]

export function getIcon(iconId?: string): LucideIcon | null {
	if (!iconId) return null
	return ICON_SET.find((i) => i.id === iconId)?.icon ?? null
}

// ---------------------------------------------------------------------------
// Dot / text color maps (used for inline dot + icon rendering without tile)
// ---------------------------------------------------------------------------

export const DOT_COLOR_MAP: Record<string, string> = Object.fromEntries(ICON_COLORS.map((c) => [c.id, c.dot]))

export const ICON_COLOR_MAP: Record<string, string> = Object.fromEntries(ICON_COLORS.map((c) => [c.id, c.iconText]))
