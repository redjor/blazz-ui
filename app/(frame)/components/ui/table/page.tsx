"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

export default function TablePage() {
	const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

	const invoices = [
		{ id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
		{ id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
		{ id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
		{ id: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
		{ id: "INV005", status: "Paid", method: "PayPal", amount: "$550.00" },
	]

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
		<Page
			title="Table"
			subtitle="Display data in rows and columns with semantic HTML table elements."
		>
			<div className="space-y-12">
				{/* Basic Example */}
				<ComponentExample
					title="Basic Table"
					description="A simple table with header and body rows."
					code={`<Table>
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
</Table>`}
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
				</ComponentExample>

				{/* With Footer */}
				<ComponentExample
					title="With Footer"
					description="Add a footer row for totals or summaries."
					code={`<Table>
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
</Table>`}
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
				</ComponentExample>

				{/* With Status Badges */}
				<ComponentExample
					title="With Status Badges"
					description="Use badges to highlight status or categories."
					code={`<Table>
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
</Table>`}
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
				</ComponentExample>

				{/* With Selection */}
				<ComponentExample
					title="With Row Selection"
					description="Add checkboxes for row selection."
					code={`const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

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
</Table>`}
				>
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
				</ComponentExample>

				{/* With Actions */}
				<ComponentExample
					title="With Row Actions"
					description="Add action buttons to table rows."
					code={`<Table>
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
</Table>`}
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
				</ComponentExample>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Table uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-muted/50</code> - Header and footer background
						</li>
						<li>
							<code className="text-xs">text-muted-foreground</code> - Header text color
						</li>
						<li>
							<code className="text-xs">border-border</code> - Row borders
						</li>
						<li>
							<code className="text-xs">hover:bg-muted/50</code> - Row hover state
						</li>
						<li>
							<code className="text-xs">data-[state=selected]:bg-primary/5</code> - Selected row
						</li>
						<li>
							<code className="text-xs">text-xs</code> - Table text size
						</li>
						<li>
							<code className="text-xs">px-3 py-1</code> - Cell padding
						</li>
					</ul>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use TableCaption for accessibility and context</li>
						<li>Align numerical data to the right for easier scanning</li>
						<li>Keep tables responsive - consider horizontal scrolling for mobile</li>
						<li>Use consistent column widths for better readability</li>
						<li>Highlight important data with font-medium or badges</li>
						<li>Provide sorting and filtering for large datasets</li>
						<li>Use sticky headers for long tables</li>
						<li>Consider DataTable component for advanced features</li>
					</ul>
				</section>

				{/* Accessibility */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Accessibility</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Uses semantic HTML table elements</li>
						<li>TableCaption provides context for screen readers</li>
						<li>Proper heading scope with TableHead elements</li>
						<li>Keyboard navigable with proper focus states</li>
						<li>Selection state announced with data-state attribute</li>
						<li>Consider adding aria-label for complex tables</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
