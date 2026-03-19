export const TAG_COLORS = [
	{
		key: "gray",
		label: "Gris",
		dot: "bg-zinc-400",
		bg: "bg-zinc-500/10",
		text: "text-zinc-600 dark:text-zinc-400",
	},
	{
		key: "blue",
		label: "Bleu",
		dot: "bg-blue-500",
		bg: "bg-blue-500/10",
		text: "text-blue-600 dark:text-blue-400",
	},
	{
		key: "teal",
		label: "Teal",
		dot: "bg-teal-500",
		bg: "bg-teal-500/10",
		text: "text-teal-600 dark:text-teal-400",
	},
	{
		key: "green",
		label: "Vert",
		dot: "bg-green-500",
		bg: "bg-green-500/10",
		text: "text-green-600 dark:text-green-400",
	},
	{
		key: "yellow",
		label: "Jaune",
		dot: "bg-yellow-500",
		bg: "bg-yellow-500/10",
		text: "text-yellow-600 dark:text-yellow-400",
	},
	{
		key: "orange",
		label: "Orange",
		dot: "bg-orange-500",
		bg: "bg-orange-500/10",
		text: "text-orange-600 dark:text-orange-400",
	},
	{
		key: "pink",
		label: "Rose",
		dot: "bg-pink-500",
		bg: "bg-pink-500/10",
		text: "text-pink-600 dark:text-pink-400",
	},
	{
		key: "red",
		label: "Rouge",
		dot: "bg-red-500",
		bg: "bg-red-500/10",
		text: "text-red-600 dark:text-red-400",
	},
	{
		key: "purple",
		label: "Violet",
		dot: "bg-purple-500",
		bg: "bg-purple-500/10",
		text: "text-purple-600 dark:text-purple-400",
	},
] as const

export type TagColorKey = (typeof TAG_COLORS)[number]["key"]

const TAG_COLOR_MAP = new Map<string, (typeof TAG_COLORS)[number]>(TAG_COLORS.map((c) => [c.key, c]))

export function getTagColor(key: string) {
	return TAG_COLOR_MAP.get(key) ?? TAG_COLORS[0]
}
