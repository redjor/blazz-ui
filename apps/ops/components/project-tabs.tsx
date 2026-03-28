"use client"

import type { NavTab } from "@blazz/ui/components/patterns/nav-tabs"
import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"
import { useMemo } from "react"
import { useFeatureFlags } from "@/lib/feature-flags-context"

const allTabs: (NavTab & { flag?: string })[] = [
	{ label: "Vue d'ensemble", href: "" },
	{ label: "Temps", href: "/time" },
	{ label: "Todos", href: "/todos" },
	{ label: "Factures", href: "/invoices", flag: "invoicing" },
	{ label: "Notes", href: "/notes" },
	{ label: "Contrats", href: "/contracts" },
]

export function ProjectTabs({ basePath }: { basePath: string }) {
	const { isEnabled } = useFeatureFlags()

	const tabs = useMemo(() => allTabs.filter((t) => !t.flag || isEnabled(t.flag)), [isEnabled])

	return <NavTabs tabs={tabs} basePath={basePath} />
}
