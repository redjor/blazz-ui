import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			p: ["p-inset"],
			px: ["px-inset"],
			py: ["py-inset"],
			pt: ["pt-inset"],
			pr: ["pr-inset"],
			pb: ["pb-inset"],
			pl: ["pl-inset"],
		},
	},
})

/**
 * Utility for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
