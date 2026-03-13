import { Badge } from "@blazz/ui/components/ui/badge"
import { cn } from "@blazz/ui/lib/utils"
import * as React from "react"

export interface DocProp {
	name: string
	type: string
	default?: string
	description: string
	required?: boolean
}

export interface DocPropGroup {
	title: string
	props: DocProp[]
}

interface DocPropsTableProps {
	props?: DocProp[]
	groups?: DocPropGroup[]
	className?: string
}

function PropsRows({ props }: { props: DocProp[] }) {
	return (
		<>
			{props.map((prop) => (
				<tr key={prop.name} className="border-b border-separator last:border-0">
					<td className="py-2.5 pr-4 align-top">
						<div className="flex items-center gap-2">
							<code className="text-[13px] font-semibold text-fg">{prop.name}</code>
							{prop.required && (
								<Badge variant="warning" fill="subtle" size="xs">
									required
								</Badge>
							)}
						</div>
					</td>
					<td className="py-2.5 pr-4 align-top">
						<code className="font-mono text-xs text-fg-muted">{prop.type}</code>
					</td>
					<td className="py-2.5 pr-4 align-top">
						{prop.default ? (
							<code className="rounded bg-raised px-1.5 py-0.5 font-mono text-xs text-fg-muted">
								{prop.default}
							</code>
						) : (
							<span className="text-xs text-fg-subtle">&mdash;</span>
						)}
					</td>
					<td className="py-2.5 align-top text-[13px] text-fg-muted">{prop.description}</td>
				</tr>
			))}
		</>
	)
}

export function DocPropsTable({ props, groups, className }: DocPropsTableProps) {
	return (
		<div className={cn("overflow-x-auto", className)}>
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-separator">
						<th className="py-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
							Prop
						</th>
						<th className="py-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
							Type
						</th>
						<th className="py-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
							Default
						</th>
						<th className="py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
							Description
						</th>
					</tr>
				</thead>
				<tbody>
					{props && <PropsRows props={props} />}
					{groups?.map((group) => (
						<React.Fragment key={group.title}>
							<tr>
								<td colSpan={4} className="pt-6 pb-2">
									<span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
										{group.title}
									</span>
								</td>
							</tr>
							<PropsRows props={group.props} />
						</React.Fragment>
					))}
				</tbody>
			</table>
		</div>
	)
}
