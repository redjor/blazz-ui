import { Page } from "@/components/ui/page"
import { DocToc, type TocItem } from "./doc-toc"

interface DocPageProps {
	title: string
	subtitle: string
	toc?: TocItem[]
	children: React.ReactNode
}

export function DocPage({ title, subtitle, toc, children }: DocPageProps) {
	return (
		<Page title={title} subtitle={subtitle}>
			<div className="flex gap-10">
				<div className="min-w-0 flex-1 space-y-12">{children}</div>
				{toc && toc.length > 0 && (
					<div className="hidden w-48 shrink-0 lg:block">
						<DocToc items={toc} />
					</div>
				)}
			</div>
		</Page>
	)
}
