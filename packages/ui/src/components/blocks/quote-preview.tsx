"use client"

import { cn } from "../../lib/utils"
import { withProGuard } from "../../lib/with-pro-guard"

export interface QuoteLineItem {
	product: string
	description?: string
	quantity: number
	unitPrice: number
}

export interface QuotePreviewProps {
	reference: string
	date: string
	validUntil: string
	company: {
		name: string
		address?: string
		city?: string
		country?: string
	}
	contact?: {
		name: string
		email?: string
	}
	lines: QuoteLineItem[]
	notes?: string
	currency?: string
	className?: string
}

function formatAmount(amount: number, currency: string) {
	return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount)
}

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	})
}

function QuotePreviewBase({
	reference,
	date,
	validUntil,
	company,
	contact,
	lines,
	notes,
	currency = "EUR",
	className,
}: QuotePreviewProps) {
	const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0)
	const tax = subtotal * 0.2
	const total = subtotal + tax

	return (
		<div
			className={cn(
				"mx-auto max-w-[800px] rounded-lg border bg-surface p-8 shadow-sm print:border-0 print:shadow-none",
				className
			)}
		>
			{/* Header */}
			<div className="flex items-start justify-between border-b pb-6">
				<div>
					<h1 className="text-xl font-bold text-fg">Forge CRM</h1>
					<p className="mt-1 text-sm text-fg-muted">
						123 Avenue des Champs-Élysées
						<br />
						75008 Paris, France
					</p>
				</div>
				<div className="text-right">
					<h2 className="text-lg font-semibold text-fg">DEVIS</h2>
					<p className="mt-1 text-sm text-fg-muted">{reference}</p>
				</div>
			</div>

			{/* Dates + Client */}
			<div className="mt-6 grid grid-cols-2 gap-8">
				<div>
					<h3 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Client</h3>
					<div className="mt-2 text-sm">
						<p className="font-medium">{company.name}</p>
						{company.address && <p className="text-fg-muted">{company.address}</p>}
						{company.city && (
							<p className="text-fg-muted">
								{company.city}
								{company.country ? `, ${company.country}` : ""}
							</p>
						)}
						{contact && (
							<div className="mt-2">
								<p>{contact.name}</p>
								{contact.email && <p className="text-fg-muted">{contact.email}</p>}
							</div>
						)}
					</div>
				</div>
				<div className="text-right">
					<div className="space-y-1 text-sm">
						<p>
							<span className="text-fg-muted">Date : </span>
							<span className="font-medium">{formatDate(date)}</span>
						</p>
						<p>
							<span className="text-fg-muted">Valide jusqu&apos;au : </span>
							<span className="font-medium">{formatDate(validUntil)}</span>
						</p>
					</div>
				</div>
			</div>

			{/* Line items */}
			<div className="mt-8">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b">
							<th className="pb-2 text-left font-semibold">Description</th>
							<th className="pb-2 text-right font-semibold">Qté</th>
							<th className="pb-2 text-right font-semibold">Prix unit.</th>
							<th className="pb-2 text-right font-semibold">Total</th>
						</tr>
					</thead>
					<tbody>
						{lines.map((line, i) => (
							<tr key={i} className="border-b last:border-0">
								<td className="py-3">
									<p className="font-medium">{line.product}</p>
									{line.description && <p className="text-fg-muted">{line.description}</p>}
								</td>
								<td className="py-3 text-right tabular-nums">{line.quantity}</td>
								<td className="py-3 text-right tabular-nums">
									{formatAmount(line.unitPrice, currency)}
								</td>
								<td className="py-3 text-right font-medium tabular-nums">
									{formatAmount(line.quantity * line.unitPrice, currency)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Totals */}
			<div className="mt-4 flex justify-end">
				<div className="w-64 space-y-1 text-sm">
					<div className="flex justify-between">
						<span className="text-fg-muted">Sous-total HT</span>
						<span className="tabular-nums">{formatAmount(subtotal, currency)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-fg-muted">TVA (20%)</span>
						<span className="tabular-nums">{formatAmount(tax, currency)}</span>
					</div>
					<div className="flex justify-between border-t pt-1 font-semibold">
						<span>Total TTC</span>
						<span className="tabular-nums">{formatAmount(total, currency)}</span>
					</div>
				</div>
			</div>

			{/* Notes */}
			{notes && (
				<div className="mt-8 rounded-md bg-raised/50 p-4">
					<h3 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
						Conditions
					</h3>
					<p className="mt-1 text-sm text-fg-muted">{notes}</p>
				</div>
			)}
		</div>
	)
}

export const QuotePreview = withProGuard(QuotePreviewBase, "QuotePreview")
