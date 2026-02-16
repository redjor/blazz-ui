import { Page } from "@/components/ui/page"
import { ComponentSection } from "@/components/features/docs/component-card"
import { User, Table, Table2, Grid3X3 } from "lucide-react"

const dataDisplayComponents = [
	{
		title: "Avatar",
		href: "/docs/components/ui/avatar",
		description: "Display user profile images with fallback support for initials or icons in various sizes.",
		icon: User,
	},
	{
		title: "Cell Types",
		href: "/docs/components/ui/cells",
		description: "15 specialized cell renderers for DataTable: tags, progress, rating, sparkline, avatar group, and more.",
		icon: Grid3X3,
	},
	{
		title: "Data Table",
		href: "/docs/components/ui/data-table",
		description: "Enterprise-grade data table with advanced filtering, sorting, pagination, and bulk actions.",
		icon: Table2,
	},
	{
		title: "Table",
		href: "/docs/components/ui/table",
		description: "Display data in rows and columns with semantic HTML table elements for simple tabular layouts.",
		icon: Table,
	},
]

export default function DataDisplayPage() {
	return (
		<Page
			title="Data Display"
			subtitle="Data display components help users understand and interact with information. They present data in structured, scannable formats that make patterns and relationships clear."
		>
			<ComponentSection components={dataDisplayComponents} />
		</Page>
	)
}
