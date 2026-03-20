"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Target } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { GoalsConfigDialog } from "./_config-dialog"

export default function GoalsPageClient() {
	const year = new Date().getFullYear()
	const data = useQuery(api.goals.dashboard, { year })
	const plan = useQuery(api.goals.get, { year })
	const [configOpen, setConfigOpen] = useState(false)

	useAppTopBar([{ label: "Objectifs" }])

	// Loading
	if (data === undefined || plan === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title={`Objectifs ${year}`} />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-64 w-full" />
			</BlockStack>
		)
	}

	// Empty state
	if (data === null) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title={`Objectifs ${year}`} />
				<Box padding="8" className="text-center">
					<BlockStack gap="300" className="items-center">
						<Target className="size-12 text-fg-muted" />
						<span className="text-base font-medium">Pas encore d'objectifs</span>
						<span className="text-sm text-fg-muted">
							Définissez vos cibles pour {year}
						</span>
						<Button onClick={() => setConfigOpen(true)} className="mt-2">
							Définir mes objectifs
						</Button>
					</BlockStack>
				</Box>
				<GoalsConfigDialog
					open={configOpen}
					onOpenChange={setConfigOpen}
					year={year}
					plan={plan}
				/>
			</BlockStack>
		)
	}

	// Success state (charts + table will be added in Task 9)
	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader
				title={`Objectifs ${year}`}
				actions={
					<Button variant="outline" onClick={() => setConfigOpen(true)}>
						Modifier les cibles
					</Button>
				}
			/>
			{/* StatsGrid + Charts + Table → Task 9 */}
			<GoalsConfigDialog
				open={configOpen}
				onOpenChange={setConfigOpen}
				year={year}
				plan={plan}
			/>
		</BlockStack>
	)
}
