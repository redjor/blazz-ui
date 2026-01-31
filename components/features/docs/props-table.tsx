import { cn } from "@/lib/utils"

export interface PropDefinition {
	name: string
	type: string
	default?: string
	description: string
	required?: boolean
}

interface PropsTableProps {
	props: PropDefinition[]
	className?: string
}

export function PropsTable({ props, className }: PropsTableProps) {
	return (
		<div className={cn("overflow-x-auto", className)}>
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b">
						<th className="py-3 pr-4 text-left font-medium">Prop</th>
						<th className="py-3 pr-4 text-left font-medium">Type</th>
						<th className="py-3 pr-4 text-left font-medium">Default</th>
						<th className="py-3 text-left font-medium">Description</th>
					</tr>
				</thead>
				<tbody>
					{props.map((prop) => (
						<tr key={prop.name} className="border-b last:border-0">
							<td className="py-3 pr-4">
								<code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
									{prop.name}
									{prop.required && <span className="text-destructive">*</span>}
								</code>
							</td>
							<td className="py-3 pr-4">
								<code className="text-xs text-muted-foreground">{prop.type}</code>
							</td>
							<td className="py-3 pr-4">
								{prop.default ? (
									<code className="rounded bg-muted px-1.5 py-0.5 text-xs">
										{prop.default}
									</code>
								) : (
									<span className="text-muted-foreground">-</span>
								)}
							</td>
							<td className="py-3 text-muted-foreground">{prop.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
