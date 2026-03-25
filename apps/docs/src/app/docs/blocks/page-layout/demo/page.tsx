"use client"

import { Page, PageSection, PageWrapper } from "@blazz/pro/components/blocks/page"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Avatar, AvatarFallback } from "@blazz/ui/components/ui/avatar"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@blazz/ui/components/ui/breadcrumb"
import { Button } from "@blazz/ui/components/ui/button"
import { Divider } from "@blazz/ui/components/ui/divider"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"
import {
	ArrowLeft,
	Building2,
	Calendar,
	Clock,
	Copy,
	Download,
	Euro,
	FileText,
	Mail,
	MoreHorizontal,
	Phone,
	Send,
	User,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Fake data                                                          */
/* ------------------------------------------------------------------ */

const invoice = {
	id: "INV-2026-0042",
	client: "Acme Corporation",
	clientEmail: "billing@acme.co",
	clientPhone: "+33 1 42 68 53 00",
	status: "unpaid" as const,
	amount: 12450.0,
	tax: 2490.0,
	total: 14940.0,
	issueDate: "12 mars 2026",
	dueDate: "12 avril 2026",
	lines: [
		{ desc: "Développement feature auth SSO", qty: 5, unit: 850, total: 4250 },
		{ desc: "Intégration API partenaire v2", qty: 3, unit: 850, total: 2550 },
		{ desc: "Refactoring module facturation", qty: 4, unit: 850, total: 3400 },
		{ desc: "Code review & QA", qty: 1.5, unit: 850, total: 1275 },
		{ desc: "Déploiement staging + prod", qty: 1, unit: 975, total: 975 },
	],
}

const fmt = (n: number) =>
	new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)

/* ------------------------------------------------------------------ */
/*  Field helper                                                       */
/* ------------------------------------------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<dt className="text-xs font-medium text-fg-muted">{label}</dt>
			<dd className="mt-0.5 text-sm text-fg">{children}</dd>
		</div>
	)
}

/* ------------------------------------------------------------------ */
/*  Demo page                                                          */
/* ------------------------------------------------------------------ */

export default function PageDemoPage() {
	return (
		<Page
			top={
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/docs/blocks/page-layout">Accueil</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/docs/blocks/page-layout/demo">Factures</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{invoice.id}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			}
			header={
				<PageHeader
					title={invoice.id}
					afterTitle={
						<Badge variant="warning" fill="subtle">
							En attente
						</Badge>
					}
					actions={
						<>
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="size-4" />
							</Button>
							<Button variant="outline" size="sm">
								<Copy className="size-3.5" data-icon="inline-start" />
								Dupliquer
							</Button>
							<Button variant="outline" size="sm">
								<Download className="size-3.5" data-icon="inline-start" />
								PDF
							</Button>
							<Button size="sm">
								<Send className="size-3.5" data-icon="inline-start" />
								Envoyer
							</Button>
						</>
					}
				/>
			}
			nav={
				<NavTabs
					basePath="/docs/blocks/page-layout/demo"
					tabs={[
						{ label: "Détails", href: "" },
						{ label: "Historique", href: "/history" },
						{ label: "Paiements", href: "/payments" },
					]}
				/>
			}
		>
			<PageWrapper size="lg">
				{/* ---- Two-column: main + sidebar ---- */}
				<div className="flex gap-6 items-start">
					{/* Main content */}
					<div className="flex-1 min-w-0">
					<BlockStack gap="600">
						{/* Lines table */}
						<PageSection title="Lignes">
							<div className="overflow-hidden rounded-lg border border-edge">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-edge bg-muted/50">
											<th className="px-3 py-2 text-left text-xs font-medium text-fg-muted">
												Description
											</th>
											<th className="px-3 py-2 text-right text-xs font-medium text-fg-muted w-20">
												Qté
											</th>
											<th className="px-3 py-2 text-right text-xs font-medium text-fg-muted w-28">
												Prix unit.
											</th>
											<th className="px-3 py-2 text-right text-xs font-medium text-fg-muted w-28">
												Total
											</th>
										</tr>
									</thead>
									<tbody>
										{invoice.lines.map((line) => (
											<tr key={line.desc} className="border-b border-edge last:border-0">
												<td className="px-3 py-2.5 text-fg">{line.desc}</td>
												<td className="px-3 py-2.5 text-right tabular-nums text-fg-muted">
													{line.qty}j
												</td>
												<td className="px-3 py-2.5 text-right tabular-nums text-fg-muted">
													{fmt(line.unit)}
												</td>
												<td className="px-3 py-2.5 text-right tabular-nums font-medium text-fg">
													{fmt(line.total)}
												</td>
											</tr>
										))}
									</tbody>
								</table>

								{/* Totals */}
								<div className="border-t border-edge bg-muted/30 px-3 py-3">
									<div className="ml-auto w-56 space-y-1.5">
										<InlineStack align="space-between">
											<span className="text-xs text-fg-muted">Sous-total HT</span>
											<span className="text-sm tabular-nums text-fg">
												{fmt(invoice.amount)}
											</span>
										</InlineStack>
										<InlineStack align="space-between">
											<span className="text-xs text-fg-muted">TVA 20%</span>
											<span className="text-sm tabular-nums text-fg-muted">
												{fmt(invoice.tax)}
											</span>
										</InlineStack>
										<Divider />
										<InlineStack align="space-between">
											<span className="text-sm font-semibold text-fg">Total TTC</span>
											<span className="text-sm font-semibold tabular-nums text-fg">
												{fmt(invoice.total)}
											</span>
										</InlineStack>
									</div>
								</div>
							</div>
						</PageSection>

						{/* Notes */}
						<PageSection title="Notes">
							<p className="text-sm text-fg-muted leading-relaxed">
								Mission de développement mars 2026. Facturation au forfait jour.
								Conditions de paiement : 30 jours date de facture. Pénalités de
								retard : 3x le taux d'intérêt légal.
							</p>
						</PageSection>
					</BlockStack>
				</div>

				{/* Sidebar */}
				<div className="w-72 shrink-0 space-y-5">
					{/* Client card */}
					<div className="rounded-lg border border-edge bg-surface p-4">
						<div className="mb-3 flex items-center gap-2.5">
							<Avatar className="size-8">
								<AvatarFallback className="bg-brand/10 text-brand text-xs">
									AC
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0">
								<p className="text-sm font-medium text-fg truncate">{invoice.client}</p>
								<p className="text-xs text-fg-muted">Client</p>
							</div>
						</div>
						<Divider />
						<dl className="mt-3 space-y-2.5">
							<Field label="Email">
								<InlineStack gap="100" blockAlign="center">
									<Mail className="size-3 text-fg-muted" />
									{invoice.clientEmail}
								</InlineStack>
							</Field>
							<Field label="Téléphone">
								<InlineStack gap="100" blockAlign="center">
									<Phone className="size-3 text-fg-muted" />
									{invoice.clientPhone}
								</InlineStack>
							</Field>
						</dl>
					</div>

					{/* Details card */}
					<div className="rounded-lg border border-edge bg-surface p-4">
						<p className="mb-3 text-xs font-medium uppercase tracking-wider text-fg-muted">
							Détails
						</p>
						<dl className="space-y-2.5">
							<Field label="Statut">
								<Badge variant="warning" fill="ghost-dot">
									En attente de paiement
								</Badge>
							</Field>
							<Field label="Montant">
								<InlineStack gap="100" blockAlign="center">
									<Euro className="size-3 text-fg-muted" />
									<span className="tabular-nums font-medium">{fmt(invoice.total)}</span>
								</InlineStack>
							</Field>
							<Field label="Émise le">
								<InlineStack gap="100" blockAlign="center">
									<Calendar className="size-3 text-fg-muted" />
									{invoice.issueDate}
								</InlineStack>
							</Field>
							<Field label="Échéance">
								<InlineStack gap="100" blockAlign="center">
									<Clock className="size-3 text-fg-muted" />
									{invoice.dueDate}
								</InlineStack>
							</Field>
						</dl>
					</div>
				</div>
				</div>
			</PageWrapper>
		</Page>
	)
}
