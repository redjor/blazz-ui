"use client"

import { useState, useCallback } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface DealLine {
	id: string
	product: string
	description: string
	quantity: number
	unitPrice: number
}

export interface DealLinesEditorProps {
	lines: DealLine[]
	onChange: (lines: DealLine[]) => void
	currency?: string
	readOnly?: boolean
	className?: string
}

function formatAmount(amount: number, currency: string) {
	return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount)
}

let lineCounter = 0
function nextLineId() {
	return `line-${++lineCounter}-${Date.now()}`
}

export function DealLinesEditor({
	lines,
	onChange,
	currency = "EUR",
	readOnly = false,
	className,
}: DealLinesEditorProps) {
	const updateLine = useCallback(
		(id: string, field: keyof DealLine, value: string | number) => {
			onChange(
				lines.map((line) =>
					line.id === id ? { ...line, [field]: value } : line
				)
			)
		},
		[lines, onChange]
	)

	const addLine = useCallback(() => {
		onChange([
			...lines,
			{
				id: nextLineId(),
				product: "",
				description: "",
				quantity: 1,
				unitPrice: 0,
			},
		])
	}, [lines, onChange])

	const removeLine = useCallback(
		(id: string) => {
			onChange(lines.filter((l) => l.id !== id))
		},
		[lines, onChange]
	)

	const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0)

	return (
		<div className={cn("space-y-3", className)}>
			<div className="overflow-x-auto rounded-lg border">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b bg-muted/50">
							<th className="px-3 py-2 text-left font-medium">Produit</th>
							<th className="px-3 py-2 text-left font-medium">Description</th>
							<th className="w-24 px-3 py-2 text-right font-medium">Qté</th>
							<th className="w-32 px-3 py-2 text-right font-medium">Prix unit.</th>
							<th className="w-32 px-3 py-2 text-right font-medium">Total</th>
							{!readOnly && <th className="w-10 px-2 py-2" />}
						</tr>
					</thead>
					<tbody>
						{lines.map((line) => (
							<tr key={line.id} className="border-b last:border-0">
								<td className="px-3 py-1.5">
									{readOnly ? (
										<span>{line.product}</span>
									) : (
										<Input
											value={line.product}
											onChange={(e) => updateLine(line.id, "product", e.target.value)}
											placeholder="Nom du produit"
											className="h-7 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
										/>
									)}
								</td>
								<td className="px-3 py-1.5">
									{readOnly ? (
										<span className="text-muted-foreground">{line.description}</span>
									) : (
										<Input
											value={line.description}
											onChange={(e) => updateLine(line.id, "description", e.target.value)}
											placeholder="Description"
											className="h-7 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
										/>
									)}
								</td>
								<td className="px-3 py-1.5">
									{readOnly ? (
										<span className="block text-right">{line.quantity}</span>
									) : (
										<Input
											type="number"
											min={1}
											value={line.quantity}
											onChange={(e) => updateLine(line.id, "quantity", Number(e.target.value))}
											className="h-7 border-0 bg-transparent px-0 text-right shadow-none focus-visible:ring-0"
										/>
									)}
								</td>
								<td className="px-3 py-1.5">
									{readOnly ? (
										<span className="block text-right">{formatAmount(line.unitPrice, currency)}</span>
									) : (
										<Input
											type="number"
											min={0}
											step={0.01}
											value={line.unitPrice}
											onChange={(e) => updateLine(line.id, "unitPrice", Number(e.target.value))}
											className="h-7 border-0 bg-transparent px-0 text-right shadow-none focus-visible:ring-0"
										/>
									)}
								</td>
								<td className="px-3 py-1.5 text-right font-medium">
									{formatAmount(line.quantity * line.unitPrice, currency)}
								</td>
								{!readOnly && (
									<td className="px-2 py-1.5">
										<button
											type="button"
											onClick={() => removeLine(line.id)}
											className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-destructive"
										>
											<Trash2 className="size-3.5" />
										</button>
									</td>
								)}
							</tr>
						))}
						{lines.length === 0 && (
							<tr>
								<td colSpan={readOnly ? 5 : 6} className="px-3 py-6 text-center text-muted-foreground">
									Aucune ligne. Cliquez sur &quot;Ajouter&quot; pour commencer.
								</td>
							</tr>
						)}
					</tbody>
					<tfoot>
						<tr className="border-t bg-muted/30">
							<td colSpan={readOnly ? 4 : 4} className="px-3 py-2 text-right text-sm font-semibold">
								Sous-total
							</td>
							<td className="px-3 py-2 text-right text-sm font-semibold">
								{formatAmount(subtotal, currency)}
							</td>
							{!readOnly && <td />}
						</tr>
					</tfoot>
				</table>
			</div>

			{!readOnly && (
				<Button type="button" variant="outline" size="sm" onClick={addLine}>
					<Plus className="size-4" data-icon="inline-start" />
					Ajouter une ligne
				</Button>
			)}
		</div>
	)
}
