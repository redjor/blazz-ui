import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
} from "@blazz/ui/components/ui/table"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Checkbox } from "@blazz/ui/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "design-tokens", title: "Design Tokens" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "accessibility", title: "Accessibility" },
	{ id: "related", title: "Related" },
]

const invoices = [
	{ id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
	{ id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
	{ id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
	{ id: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
	{ id: "INV005", status: "Paid", method: "PayPal", amount: "$550.00" },
]

const examples = [
	{
		key: "basic",
		code: `<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
    ...
  </TableBody>
</Table>`,
	},
	{
		key: "with-footer",
		code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    ...
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>Total</TableCell>
      <TableCell className="text-right">$1,750.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>`,
	},
	{
		key: "with-badges",
		code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>
        <Badge variant="success">Paid</Badge>
      </TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>INV002</TableCell>
      <TableCell>
        <Badge variant="warning">Pending</Badge>
      </TableCell>
      <TableCell>$150.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
	},
	{
		key: "with-selection",
		code: `const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-12">
        <Checkbox
          checked={selectedRows.size === data.length}
          onCheckedChange={toggleAll}
        />
      </TableHead>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow
        key={row.id}
        data-state={selectedRows.has(row.id) ? "selected" : undefined}
      >
        <TableCell>
          <Checkbox
            checked={selectedRows.has(row.id)}
            onCheckedChange={() => toggleRow(row.id)}
          />
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{row.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
	},
	{
		key: "with-actions",
		code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>$250.00</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/table")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: TablePage,
})

function TableWithSelectionDemo() {
	const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

	const toggleRow = (id: string) => {
		const newSelected = new Set(selectedRows)
		if (newSelected.has(id)) {
			newSelected.delete(id)
		} else {
			newSelected.add(id)
		}
		setSelectedRows(newSelected)
	}

	const toggleAll = () => {
		if (selectedRows.size === invoices.length) {
			setSelectedRows(new Set())
		} else {
			setSelectedRows(new Set(invoices.map(inv => inv.id)))
		}
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-12">
						<Checkbox
							checked={selectedRows.size === invoices.length}
							onCheckedChange={toggleAll}
						/>
					</TableHead>
					<TableHead>Invoice</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{invoices.map((invoice) => (
					<TableRow
						key={invoice.id}
						data-state={selectedRows.has(invoice.id) ? "selected" : undefined}
					>
						<TableCell>
							<Checkbox
								checked={selectedRows.has(invoice.id)}
								onCheckedChange={() => toggleRow(invoice.id)}
							/>
						</TableCell>
						<TableCell className="font-medium">{invoice.id}</TableCell>
						<TableCell>{invoice.status}</TableCell>
						<TableCell>{invoice.amount}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

function TablePage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Table"
			subtitle="Display data in rows and columns with semantic HTML table elements."
			toc={toc}
		>
			<DocHero>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Invoice</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Method</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.slice(0, 3).map((invoice) => (
							<TableRow key={invoice.id}>
								<TableCell className="font-medium">{invoice.id}</TableCell>
								<TableCell>{invoice.status}</TableCell>
								<TableCell>{invoice.method}</TableCell>
								<TableCell className="text-right">{invoice.amount}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Table"
					description="A simple table with header and body rows."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<Table>
						<TableCaption>A list of your recent invoices.</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>Invoice</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Method</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.map((invoice) => (
								<TableRow key={invoice.id}>
									<TableCell className="font-medium">{invoice.id}</TableCell>
									<TableCell>{invoice.status}</TableCell>
									<TableCell>{invoice.method}</TableCell>
									<TableCell className="text-right">{invoice.amount}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</DocExampleClient>

				<DocExampleClient
					title="With Footer"
					description="Add a footer row for totals or summaries."
					code={examples[1].code}
					highlightedCode={html("with-footer")}
				>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Invoice</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.map((invoice) => (
								<TableRow key={invoice.id}>
									<TableCell className="font-medium">{invoice.id}</TableCell>
									<TableCell>{invoice.status}</TableCell>
									<TableCell className="text-right">{invoice.amount}</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={2}>Total</TableCell>
								<TableCell className="text-right">$1,750.00</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</DocExampleClient>

				<DocExampleClient
					title="With Status Badges"
					description="Use badges to highlight status or categories."
					code={examples[2].code}
					highlightedCode={html("with-badges")}
				>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Invoice</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.map((invoice) => (
								<TableRow key={invoice.id}>
									<TableCell className="font-medium">{invoice.id}</TableCell>
									<TableCell>
										<Badge
											variant={
												invoice.status === "Paid" ? "success" :
												invoice.status === "Pending" ? "warning" : "critical"
											}
										>
											{invoice.status}
										</Badge>
									</TableCell>
									<TableCell>{invoice.amount}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</DocExampleClient>

				<DocExampleClient
					title="With Row Selection"
					description="Add checkboxes for row selection."
					code={examples[3].code}
					highlightedCode={html("with-selection")}
				>
					<TableWithSelectionDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Row Actions"
					description="Add action buttons to table rows."
					code={examples[4].code}
					highlightedCode={html("with-actions")}
				>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Invoice</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.slice(0, 3).map((invoice) => (
								<TableRow key={invoice.id}>
									<TableCell className="font-medium">{invoice.id}</TableCell>
									<TableCell>{invoice.status}</TableCell>
									<TableCell>{invoice.amount}</TableCell>
									<TableCell className="text-right">
										<Button variant="ghost" size="icon-sm">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</DocExampleClient>
			</DocSection>

			<DocSection id="design-tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Table uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-raised/50</code> - Header and footer background
					</li>
					<li>
						<code className="text-xs">text-fg-muted</code> - Header text color
					</li>
					<li>
						<code className="text-xs">border-edge</code> - Row borders
					</li>
					<li>
						<code className="text-xs">hover:bg-raised/50</code> - Row hover state
					</li>
					<li>
						<code className="text-xs">data-[state=selected]:bg-brand/5</code> - Selected row
					</li>
					<li>
						<code className="text-xs">text-xs</code> - Table text size
					</li>
					<li>
						<code className="text-xs">px-3 py-1</code> - Cell padding
					</li>
				</ul>
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use TableCaption for accessibility and context</li>
					<li>Align numerical data to the right for easier scanning</li>
					<li>Keep tables responsive - consider horizontal scrolling for mobile</li>
					<li>Use consistent column widths for better readability</li>
					<li>Highlight important data with font-medium or badges</li>
					<li>Provide sorting and filtering for large datasets</li>
					<li>Use sticky headers for long tables</li>
					<li>Consider DataTable component for advanced features</li>
				</ul>
			</DocSection>

			<DocSection id="accessibility" title="Accessibility">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Uses semantic HTML table elements</li>
					<li>TableCaption provides context for screen readers</li>
					<li>Proper heading scope with TableHead elements</li>
					<li>Keyboard navigable with proper focus states</li>
					<li>Selection state announced with data-state attribute</li>
					<li>Consider adding aria-label for complex tables</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Data Table",
							href: "/docs/components/ui/data-table",
							description: "Advanced table with sorting, filtering, pagination, and more.",
						},
						{
							title: "Badge",
							href: "/docs/components/ui/badge",
							description: "Status indicators commonly used in table cells.",
						},
						{
							title: "Checkbox",
							href: "/docs/components/ui/checkbox",
							description: "Checkbox component for row selection patterns.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
