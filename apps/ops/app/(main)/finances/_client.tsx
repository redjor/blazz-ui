"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Card, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useAction } from "convex/react"
import { Banknote, Building2, CreditCard, Landmark } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useOpsTopBar } from "@/components/ops-frame"
import { api } from "@/convex/_generated/api"

interface BankAccount {
	slug: string
	iban: string
	bic: string
	currency: string
	balance: number
	balanceCents: number
	authorizedBalance: number
	authorizedBalanceCents: number
}

interface Organization {
	slug: string
	bankAccounts: BankAccount[]
}

function formatIban(iban: string) {
	return iban.replace(/(.{4})/g, "$1 ").trim()
}

function formatAmount(amount: number, currency = "EUR") {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency,
	}).format(amount)
}

export default function FinancesPageClient() {
	const getOrganization = useAction(api.qonto.getOrganization)
	const [org, setOrg] = useState<Organization | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useOpsTopBar([{ label: "Finances" }])

	const fetchData = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await getOrganization()
			setOrg(data)
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erreur lors du chargement")
		} finally {
			setLoading(false)
		}
	}, [getOrganization])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const mainAccount = org?.bankAccounts[0] ?? null

	return (
		<BlockStack gap="600" className="p-4">
			<PageHeader title="Finances" subtitle="Compte Qonto" />

			<StatsGrid
				columns={3}
				loading={loading}
				stats={[
					{
						label: "Solde",
						value: mainAccount ? formatAmount(mainAccount.balance, mainAccount.currency) : "—",
						icon: Banknote,
					},
					{
						label: "Solde autorisé",
						value: mainAccount
							? formatAmount(mainAccount.authorizedBalance, mainAccount.currency)
							: "—",
						icon: CreditCard,
					},
					{
						label: "Devise",
						value: mainAccount?.currency ?? "—",
						icon: Landmark,
					},
				]}
			/>

			{error && (
				<Card>
					<div className="px-inset py-6 text-sm text-danger">{error}</div>
				</Card>
			)}

			{!loading && org && (
				<BlockStack gap="400">
					<h2 className="text-sm font-medium text-fg-muted">
						{org.bankAccounts.length === 1
							? "Compte bancaire"
							: `${org.bankAccounts.length} comptes bancaires`}
					</h2>

					{org.bankAccounts.map((account) => (
						<Card key={account.slug}>
							<CardHeader>
								<InlineStack gap="200" blockAlign="center">
									<Building2 className="size-4 text-fg-muted" />
									<CardTitle>{account.slug}</CardTitle>
								</InlineStack>
							</CardHeader>
							<div className="divide-y divide-separator">
								<AccountRow label="IBAN" value={formatIban(account.iban)} mono />
								<AccountRow label="BIC" value={account.bic} mono />
								<AccountRow
									label="Solde"
									value={formatAmount(account.balance, account.currency)}
									highlight
								/>
								<AccountRow
									label="Solde autorisé"
									value={formatAmount(account.authorizedBalance, account.currency)}
								/>
								<AccountRow label="Devise" value={account.currency} />
							</div>
						</Card>
					))}
				</BlockStack>
			)}

			{!loading && !org && !error && (
				<Card>
					<div className="px-inset py-10 text-center text-sm text-fg-muted">
						Aucune donnée disponible. Vérifiez la configuration de l'API Qonto.
					</div>
				</Card>
			)}
		</BlockStack>
	)
}

function AccountRow({
	label,
	value,
	mono,
	highlight,
}: {
	label: string
	value: string
	mono?: boolean
	highlight?: boolean
}) {
	return (
		<div className="flex items-center justify-between px-inset py-3">
			<span className="text-sm text-fg-muted">{label}</span>
			<span
				className={`text-sm ${highlight ? "font-semibold text-fg" : "text-fg"} ${mono ? "font-mono" : ""}`}
			>
				{value}
			</span>
		</div>
	)
}
