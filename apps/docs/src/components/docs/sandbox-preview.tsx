'use client'
// 'use client' justifié: useState pour onglet actif et checkbox eligibility

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Checkbox, CheckboxGroup } from "@blazz/ui/components/ui/checkbox"
import { RadioGroup } from "@blazz/ui/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"

const tabs = [
	{ id: "monthly", label: "Monthly Fee" },
	{ id: "onetime", label: "One-time Fee" },
	{ id: "nofee", label: "No Fee" },
]

export function SandboxPreview() {
	const [activeTab, setActiveTab] = useState("monthly")
	const [prerequisiteChecked, setPrerequisiteChecked] = useState(false)

	return (
		<div className="flex items-start justify-center p-8">
			<div className="w-[400px] bg-surface rounded-xl border border-container shadow-lg flex flex-col">
				{/* Header */}
				<div className="flex items-start justify-between px-6 pt-6 pb-4">
					<div>
						<h2 className="text-base font-semibold text-fg">Service Fee</h2>
						<p className="text-sm text-fg-muted">Configure your service pricing and terms</p>
					</div>
					<button
						type="button"
						className="rounded-md p-1 text-fg-muted hover:text-fg hover:bg-raised transition-colors"
						aria-label="Fermer"
					>
						<X className="size-4" />
					</button>
				</div>

				{/* Tabs */}
				<div className="border-b border-container px-6">
					<div className="flex -mb-px">
						{tabs.map((t) => (
							<button
								key={t.id}
								type="button"
								onClick={() => setActiveTab(t.id)}
								className={`pb-3 pr-5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
									activeTab === t.id
										? "border-brand text-fg"
										: "border-transparent text-fg-muted hover:text-fg"
								}`}
							>
								{t.label}
							</button>
						))}
					</div>
				</div>

				{/* Body */}
				<div className="flex flex-col">
					{/* Amount */}
					<div className="px-6 py-5 flex flex-col gap-2">
						<Label className="text-sm font-medium text-fg">Amount</Label>
						<div className="flex gap-2">
							<div className="relative flex-1">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted text-sm pointer-events-none">
									€
								</span>
								<Input type="number" defaultValue="0.00" step="0.01" min="0" className="pl-7" />
							</div>
							<Select defaultValue="eur" items={[{ value: "eur", label: "🇪🇺 EUR" }, { value: "usd", label: "🇺🇸 USD" }, { value: "gbp", label: "🇬🇧 GBP" }]}>
								<SelectTrigger className="w-28">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="eur">🇪🇺 EUR</SelectItem>
									<SelectItem value="usd">🇺🇸 USD</SelectItem>
									<SelectItem value="gbp">🇬🇧 GBP</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Eligibility Criteria */}
					<div>
						<div className="px-6 py-2 bg-raised">
							<span className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
								Eligibility Criteria
							</span>
						</div>
						<div className="px-6 py-4 flex flex-col gap-3">
							<Select items={[{ value: "none", label: "None" }, { value: "existing", label: "Existing Account" }, { value: "verified", label: "Verified User" }]}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Prerequisites" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">None</SelectItem>
									<SelectItem value="existing">Existing Account</SelectItem>
									<SelectItem value="verified">Verified User</SelectItem>
								</SelectContent>
							</Select>
							<div className="flex items-center gap-2">
								<Checkbox
									id="existing-account"
									checked={prerequisiteChecked}
									onCheckedChange={(checked) => setPrerequisiteChecked(checked === true)}
								/>
								<Label htmlFor="existing-account" className="text-sm text-fg cursor-pointer">
									Client must have an existing account
								</Label>
							</div>
						</div>
					</div>

					{/* Payment Methods */}
					<div>
						<div className="px-6 py-2 bg-raised">
							<span className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
								Payment Methods
							</span>
						</div>
						<div className="px-6 py-4">
							<CheckboxGroup
								defaultValue={["bank", "wallet"]}
								options={[
									{
										value: "bank",
										label: "Bank Transfer (1-3 business days)",
										description: "Direct bank to bank transfers",
									},
									{
										value: "card",
										label: "Credit Card (Instant)",
										description: "All major cards accepted",
									},
									{
										value: "wallet",
										label: "Digital Wallet (Instant)",
										description: "Popular digital payment methods",
									},
								]}
							/>
						</div>
					</div>

					{/* Service Availability */}
					<div>
						<div className="px-6 py-2 bg-raised">
							<span className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
								Service Availability
							</span>
						</div>
						<div className="px-6 py-4">
							<RadioGroup
								defaultValue="public"
								options={[
									{
										value: "public",
										label: "Public Service (Recommended)",
										description: "Visible to all users in the marketplace",
									},
									{
										value: "private",
										label: "Private Service",
										description: "Limited visibility for select clients",
									},
								]}
							/>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex gap-2 px-6 py-5 border-t border-container">
					<Button variant="outline" className="flex-1">
						Cancel
					</Button>
					<Button variant="default" className="flex-1">
						Continue
					</Button>
				</div>
			</div>
		</div>
	)
}
