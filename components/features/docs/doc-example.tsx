import { highlight } from "@/lib/shiki"
import { DocExampleClient } from "./doc-example-client"

interface DocExampleProps {
	title?: string
	description?: string
	code: string
	children: React.ReactNode
	className?: string
	defaultExpanded?: boolean
}

export async function DocExample({
	title,
	description,
	code,
	children,
	className,
	defaultExpanded,
}: DocExampleProps) {
	const highlightedCode = await highlight(code, "tsx")

	return (
		<DocExampleClient
			title={title}
			description={description}
			code={code}
			highlightedCode={highlightedCode}
			className={className}
			defaultExpanded={defaultExpanded}
		>
			{children}
		</DocExampleClient>
	)
}
