"use client"

import { useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ─── Filter Config ─── */

export interface FilterConfigBase {
	id: string
	label?: string
}

export interface SearchFilterConfig extends FilterConfigBase {
	type: "search"
	placeholder?: string
}

export interface SelectFilterConfig extends FilterConfigBase {
	type: "select"
	options: { value: string; label: string }[]
	placeholder?: string
}

export interface DateFilterConfig extends FilterConfigBase {
	type: "date"
	placeholder?: string
}

export type FilterConfig = SearchFilterConfig | SelectFilterConfig | DateFilterConfig

/* ─── Props ─── */

export interface FilterBarProps {
	filters: FilterConfig[]
	values?: Record<string, string>
	onReset?: () => void
	className?: string
}

/* ─── Component ─── */

export function FilterBar({
	filters,
	values = {},
	className,
}: FilterBarProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const updateParam = useCallback(
		(key: string, value: string | undefined) => {
			const params = new URLSearchParams(searchParams.toString())
			if (value === undefined || value === "") {
				params.delete(key)
			} else {
				params.set(key, value)
			}
			// Reset to page 1 when filters change
			params.delete("page")
			router.push(`${pathname}?${params.toString()}`)
		},
		[router, pathname, searchParams]
	)

	const handleReset = useCallback(() => {
		router.push(pathname)
	}, [router, pathname])

	const hasActiveFilters = filters.some(
		(f) => values[f.id] !== undefined && values[f.id] !== ""
	)

	return (
		<div className={cn("flex flex-wrap items-center gap-3 pb-4", className)}>
			{filters.map((filter) => {
				switch (filter.type) {
					case "search":
						return (
							<div key={filter.id} className="relative">
								<Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
								<Input
									type="search"
									placeholder={filter.placeholder || "Rechercher..."}
									className="h-8 w-[200px] pl-8 text-sm lg:w-[280px]"
									defaultValue={values[filter.id] || ""}
									onChange={(e) => {
										const val = (e.target as HTMLInputElement).value
										// Debounce would be nice but keeping it simple
										updateParam(filter.id, val || undefined)
									}}
								/>
							</div>
						)
					case "select":
						return (
							<select
								key={filter.id}
								className={cn(
									"flex h-8 rounded-md border border-field bg-surface px-3 text-sm",
									"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand",
									!values[filter.id] && "text-fg-muted"
								)}
								value={values[filter.id] || ""}
								onChange={(e) =>
									updateParam(
										filter.id,
										e.target.value || undefined
									)
								}
							>
								<option value="">
									{filter.placeholder || filter.label || "Tous"}
								</option>
								{filter.options.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						)
					case "date":
						return (
							<Input
								key={filter.id}
								type="date"
								className="h-8 w-[160px] text-sm"
								value={values[filter.id] || ""}
								onChange={(e) =>
									updateParam(
										filter.id,
										(e.target as HTMLInputElement).value || undefined
									)
								}
							/>
						)
					default:
						return null
				}
			})}

			{hasActiveFilters && (
				<Button variant="ghost" size="sm" onClick={handleReset}>
					<X className="size-4" data-icon="inline-start" />
					Réinitialiser
				</Button>
			)}
		</div>
	)
}
