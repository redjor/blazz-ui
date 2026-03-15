import * as React from "react"

export interface UseDataTableSearchOptions {
	debounceMs: number
	onSearchChange?: (search: string) => void
}

export interface UseDataTableSearchReturn {
	searchOpen: boolean
	setSearchOpen: (open: boolean) => void
	searchValue: string
	setSearchValue: (value: string) => void
	globalFilter: string
	setGlobalFilter: (filter: string) => void
}

export function useDataTableSearch({
	debounceMs,
	onSearchChange,
}: UseDataTableSearchOptions): UseDataTableSearchReturn {
	const [searchOpen, setSearchOpen] = React.useState(false)
	const [searchValue, setSearchValue] = React.useState("")
	const [globalFilter, setGlobalFilter] = React.useState("")

	// Debounce search value to globalFilter or server-side callback
	React.useEffect(() => {
		const timeout = setTimeout(() => {
			if (onSearchChange) {
				onSearchChange(searchValue)
			} else {
				setGlobalFilter(searchValue)
			}
		}, debounceMs)

		return () => clearTimeout(timeout)
	}, [searchValue, debounceMs, onSearchChange])

	return {
		searchOpen,
		setSearchOpen,
		searchValue,
		setSearchValue,
		globalFilter,
		setGlobalFilter,
	}
}
