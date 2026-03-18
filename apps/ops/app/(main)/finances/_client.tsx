"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Card, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useAction, useQuery } from "convex/react"
import {
	Banknote,
	Building2,
	Clock,
	FileCheck,
	FileText,
	TrendingUp,
	Wallet,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
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

interface Transaction {
	id: string
	amount: number
	amountCents: number
	currency: string
	side: string
	label: string
	settledAt: string
	status: string
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
	const listTransactions = useAction(api.qonto.listTransactions)
	const forecast = useQuery(api.finances.forecast)
	const [org, setOrg] = useState<Organization | null>(null)
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useAppTopBar([{ label: "Finances" }])

	const fetchData = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await getOrganization()
			setOrg(data)
			if (data.bankAccounts.length > 0) {
				const txns = await listTransactions({ bankAccountSlug: data.bankAccounts[0].slug })
				setTransactions(txns)
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erreur lors du chargement")
		} finally {
			setLoading(false)
		}
	}, [getOrganization, listTransactions])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const mainAccount = org?.bankAccounts[0] ?? null
	const balanceCents = mainAccount ? Math.round(mainAccount.balance * 100) : 0
	const projectedCents = balanceCents + (forecast?.totalCents ?? 0)

	return (
		<BlockStack gap="600" className="p-4">
			<PageHeader title="Finances" subtitle="Trésorerie & projection CA" />

			<StatsGrid
				columns={3}
				loading={loading || forecast === undefined}
				stats={[
					{
						label: "Solde Qonto",
						value: mainAccount
							? formatAmount(mainAccount.balance, mainAccount.currency)
							: "—",
						icon: Banknote,
					},
					{
						label: "Total à encaisser",
						value: forecast
							? formatAmount(forecast.totalCents / 100)
							: "—",
						description: forecast
							? `${forecast.readyToInvoiceCount + forecast.unpaidCount} éléments`
							: undefined,
						icon: TrendingUp,
					},
					{
						label: "Trésorerie projetée",
						value:
							mainAccount && forecast
								? formatAmount(projectedCents / 100)
								: "—",
						description: "Solde + à encaisser",
						icon: Wallet,
					},
				]}
			/>

			<StatsGrid
				columns={3}
				loading={loading || forecast === undefined}
				stats={[
					{
						label: "Brouillon",
						value: forecast
							? formatAmount(forecast.draftCents / 100)
							: "—",
						description: forecast
							? `${forecast.draftCount} entrées`
							: undefined,
						icon: Clock,
					},
					{
						label: "Prêt à facturer",
						value: forecast
							? formatAmount(forecast.readyToInvoiceCents / 100)
							: "—",
						description: forecast
							? `${forecast.readyToInvoiceCount} entrées`
							: undefined,
						icon: FileCheck,
					},
					{
						label: "Facturé · non payé",
						value: forecast
							? formatAmount(forecast.unpaidCents / 100)
							: "—",
						description: forecast
							? `${forecast.unpaidCount} factures`
							: undefined,
						icon: FileText,
					},
				]}
			/>

			{!loading && transactions.length > 0 && (
				<BlockStack gap="400">
					<h2 className="text-sm font-medium text-fg-muted">
						Dernières transactions
					</h2>
					<Card>
						<div className="divide-y divide-separator">
							{transactions.map((tx) => (
								<div key={tx.id} className="flex items-center justify-between px-inset py-3">
									<div className="flex flex-col gap-0.5">
										<span className="text-sm text-fg">{tx.label || "—"}</span>
										<span className="text-xs text-fg-muted">
											{new Date(tx.settledAt).toLocaleDateString("fr-FR")}
										</span>
									</div>
									<span
										className={`text-sm font-medium tabular-nums ${
											tx.side === "credit" ? "text-success" : "text-destructive"
										}`}
									>
										{tx.side === "credit" ? "+" : "−"}
										{formatAmount(tx.amount, tx.currency)}
									</span>
								</div>
							))}
						</div>
					</Card>
				</BlockStack>
			)}

			{error && (
				<Card>
					<div className="px-inset py-6 text-sm text-destructive">{error}</div>
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
