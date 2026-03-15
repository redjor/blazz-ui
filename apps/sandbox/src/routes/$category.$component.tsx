import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { getComponent } from "~/lib/registry"
import { SandboxShell } from "~/components/sandbox-shell"
import { addRecent } from "~/lib/recents"

export const Route = createFileRoute("/$category/$component")({
	component: ComponentPage,
})

function ComponentPage() {
	const { component } = Route.useParams()
	const entry = getComponent(component)

	useEffect(() => {
		if (entry) addRecent(entry.slug)
	}, [entry])

	if (!entry) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-fg-muted">Component not found.</p>
			</div>
		)
	}

	return <SandboxShell key={entry.slug} entry={entry} />
}
