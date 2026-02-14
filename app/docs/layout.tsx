import type { ReactNode } from "react"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { source } from "@/lib/source"
import { LayoutGrid, Briefcase } from "lucide-react"

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout
			tree={source.pageTree}
			nav={{
				title: "Pro UI Kit",
				url: "/docs",
			}}
			links={[
				{
					type: "main",
					text: "Showcase",
					url: "/showcase-products",
					icon: <LayoutGrid className="size-4" />,
				},
				{
					type: "main",
					text: "CRM Demo",
					url: "/dashboard",
					icon: <Briefcase className="size-4" />,
				},
			]}
		>
			{children}
		</DocsLayout>
	)
}
