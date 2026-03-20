import { Page } from "@blazz/ui/components/ui/page"
import { Columns3, GitBranch, ListOrdered } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

const workflowComponents = [
	{
		title: "Kanban Board",
		href: "/docs/blocks/kanban-board",
		description: "Tableau kanban avec drag & drop pour visualiser et gérer un pipeline d'étapes.",
		icon: Columns3,
		thumbnail: "kanban-board",
	},
	{
		title: "Status Flow",
		href: "/docs/blocks/status-flow",
		description: "Visualisation de pipeline de statuts avec étapes, progression et transitions.",
		icon: GitBranch,
		thumbnail: "status-flow",
	},
	{
		title: "Multi Step Form",
		href: "/docs/blocks/multi-step-form",
		description:
			"Formulaire multi-étapes avec stepper, validation par étape et navigation avant/arrière.",
		icon: ListOrdered,
		thumbnail: "multi-step-form",
	},
]

export default function WorkflowPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Workflow"
				description="Pipelines, kanban et formulaires multi-étapes. Composants pour gérer des processus, des statuts et des flux de travail séquentiels."
			/>
			<ComponentSection components={workflowComponents} />
		</Page>
	)
}
