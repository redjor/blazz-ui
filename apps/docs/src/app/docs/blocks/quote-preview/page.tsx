"use client"

import type { QuoteLineItem } from "@blazz/pro/components/blocks/quote-preview"
import { QuotePreview } from "@blazz/pro/components/blocks/quote-preview"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "quote-preview-props", title: "QuotePreview Props" },
	{ id: "quote-line-item", title: "QuoteLineItem Type" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const heroLines: QuoteLineItem[] = [
	{
		product: "Audit technique",
		description: "Revue de l'architecture existante et recommandations",
		quantity: 3,
		unitPrice: 950,
	},
	{
		product: "Développement frontend",
		description: "Intégration maquettes Figma en React + Tailwind",
		quantity: 15,
		unitPrice: 750,
	},
	{
		product: "Développement backend",
		description: "API REST Node.js + PostgreSQL",
		quantity: 10,
		unitPrice: 800,
	},
	{
		product: "Recette & déploiement",
		description: "Tests E2E, CI/CD, mise en production",
		quantity: 4,
		unitPrice: 700,
	},
]

const basicLines: QuoteLineItem[] = [
	{
		product: "Consulting stratégique",
		description: "Cadrage projet et feuille de route technique",
		quantity: 5,
		unitPrice: 1200,
	},
	{
		product: "Design UX/UI",
		description: "Wireframes, maquettes et prototype interactif",
		quantity: 8,
		unitPrice: 850,
	},
	{
		product: "Développement web",
		description: "Application Next.js full-stack",
		quantity: 20,
		unitPrice: 750,
	},
]

const withNotesLines: QuoteLineItem[] = [
	{
		product: "Migration infrastructure",
		description: "Migration serveurs on-premise vers AWS",
		quantity: 12,
		unitPrice: 900,
	},
	{
		product: "Formation équipe",
		description: "Workshop DevOps (CI/CD, Docker, Kubernetes)",
		quantity: 3,
		unitPrice: 1500,
	},
]

const usdLines: QuoteLineItem[] = [
	{
		product: "SaaS Platform License",
		description: "Enterprise tier, 50 seats, annual",
		quantity: 1,
		unitPrice: 24000,
	},
	{
		product: "Custom Integration",
		description: "Salesforce + HubSpot connectors",
		quantity: 1,
		unitPrice: 8500,
	},
	{
		product: "Onboarding & Training",
		description: "3 remote sessions, documentation",
		quantity: 3,
		unitPrice: 2000,
	},
]

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const quotePreviewProps: DocProp[] = [
	{
		name: "reference",
		type: "string",
		description: "Quote reference number (e.g. DEV-2026-042).",
	},
	{
		name: "date",
		type: "string",
		description: "Quote creation date in ISO format (YYYY-MM-DD).",
	},
	{
		name: "validUntil",
		type: "string",
		description: "Expiration date in ISO format (YYYY-MM-DD).",
	},
	{
		name: "company",
		type: "{ name: string; address?: string; city?: string; country?: string }",
		description: "Client company information displayed in the header.",
	},
	{
		name: "contact",
		type: "{ name: string; email?: string }",
		description: "Optional client contact person.",
	},
	{
		name: "lines",
		type: "QuoteLineItem[]",
		description: "Array of line items. Subtotal, VAT (20%), and total are auto-calculated.",
	},
	{
		name: "notes",
		type: "string",
		description: "Optional notes or conditions displayed at the bottom of the quote.",
	},
	{
		name: "currency",
		type: "string",
		default: '"EUR"',
		description: "ISO 4217 currency code. Used by Intl.NumberFormat for formatting.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the outer container.",
	},
]

const quoteLineItemProps: DocProp[] = [
	{
		name: "product",
		type: "string",
		description: "Product or service name.",
	},
	{
		name: "description",
		type: "string",
		description: "Optional description displayed below the product name.",
	},
	{
		name: "quantity",
		type: "number",
		description: "Number of units.",
	},
	{
		name: "unitPrice",
		type: "number",
		description: "Price per unit. Line total = quantity * unitPrice.",
	},
]

// ---------------------------------------------------------------------------
// Examples (code strings)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `<QuotePreview
  reference="DEV-2026-042"
  date="2026-03-01"
  validUntil="2026-03-31"
  company={{
    name: "Nextera Solutions",
    address: "45 Rue de Rivoli",
    city: "75001 Paris",
    country: "France",
  }}
  contact={{ name: "Claire Martin", email: "c.martin@nextera.fr" }}
  lines={[
    { product: "Consulting stratégique", description: "Cadrage projet et feuille de route technique", quantity: 5, unitPrice: 1200 },
    { product: "Design UX/UI", description: "Wireframes, maquettes et prototype interactif", quantity: 8, unitPrice: 850 },
    { product: "Développement web", description: "Application Next.js full-stack", quantity: 20, unitPrice: 750 },
  ]}
/>`,
	},
	{
		key: "with-notes",
		code: `<QuotePreview
  reference="INF-2026-018"
  date="2026-02-15"
  validUntil="2026-04-15"
  company={{
    name: "Groupe Artémis",
    address: "12 Boulevard Haussmann",
    city: "75009 Paris",
    country: "France",
  }}
  lines={[
    { product: "Migration infrastructure", description: "Migration serveurs on-premise vers AWS", quantity: 12, unitPrice: 900 },
    { product: "Formation équipe", description: "Workshop DevOps (CI/CD, Docker, Kubernetes)", quantity: 3, unitPrice: 1500 },
  ]}
  notes="Paiement à 30 jours fin de mois. Acompte de 30% à la signature. TVA non applicable, art. 293 B du CGI."
/>`,
	},
	{
		key: "usd",
		code: `<QuotePreview
  reference="US-2026-007"
  date="2026-03-10"
  validUntil="2026-04-10"
  company={{
    name: "TechVentures Inc.",
    address: "350 5th Avenue",
    city: "New York, NY 10118",
    country: "United States",
  }}
  contact={{ name: "James Carter", email: "j.carter@techventures.com" }}
  lines={[
    { product: "SaaS Platform License", description: "Enterprise tier, 50 seats, annual", quantity: 1, unitPrice: 24000 },
    { product: "Custom Integration", description: "Salesforce + HubSpot connectors", quantity: 1, unitPrice: 8500 },
    { product: "Onboarding & Training", description: "3 remote sessions, documentation", quantity: 3, unitPrice: 2000 },
  ]}
  currency="USD"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function QuotePreviewPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="QuotePreview"
			subtitle="A print-friendly quote document with automatic subtotal, VAT (20%), and total calculation. French formatting by default with customizable currency."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="w-full max-w-3xl">
					<QuotePreview
						reference="DEV-2026-055"
						date="2026-03-11"
						validUntil="2026-04-11"
						company={{
							name: "Atelier Numérique",
							address: "8 Rue de la Paix",
							city: "75002 Paris",
							country: "France",
						}}
						contact={{ name: "Sophie Lemaire", email: "s.lemaire@atelier-numerique.fr" }}
						lines={heroLines}
					/>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Quote"
					description="A standard quote with company info, contact, and three line items. Subtotal, TVA, and total are auto-calculated."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<QuotePreview
						reference="DEV-2026-042"
						date="2026-03-01"
						validUntil="2026-03-31"
						company={{
							name: "Nextera Solutions",
							address: "45 Rue de Rivoli",
							city: "75001 Paris",
							country: "France",
						}}
						contact={{ name: "Claire Martin", email: "c.martin@nextera.fr" }}
						lines={basicLines}
					/>
				</DocExampleClient>

				<DocExampleClient
					title="With Notes"
					description="Add payment terms or conditions with the notes prop. Displayed in a muted section at the bottom."
					code={examples[1].code}
					highlightedCode={html("with-notes")}
				>
					<QuotePreview
						reference="INF-2026-018"
						date="2026-02-15"
						validUntil="2026-04-15"
						company={{
							name: "Groupe Artémis",
							address: "12 Boulevard Haussmann",
							city: "75009 Paris",
							country: "France",
						}}
						lines={withNotesLines}
						notes="Paiement à 30 jours fin de mois. Acompte de 30% à la signature. TVA non applicable, art. 293 B du CGI."
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Custom Currency (USD)"
					description="Pass any ISO 4217 currency code. Formatting adapts automatically via Intl.NumberFormat."
					code={examples[2].code}
					highlightedCode={html("usd")}
				>
					<QuotePreview
						reference="US-2026-007"
						date="2026-03-10"
						validUntil="2026-04-10"
						company={{
							name: "TechVentures Inc.",
							address: "350 5th Avenue",
							city: "New York, NY 10118",
							country: "United States",
						}}
						contact={{ name: "James Carter", email: "j.carter@techventures.com" }}
						lines={usdLines}
						currency="USD"
					/>
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="quote-preview-props" title="QuotePreview Props">
				<DocPropsTable props={quotePreviewProps} />
			</DocSection>

			<DocSection id="quote-line-item" title="QuoteLineItem Type">
				<DocPropsTable props={quoteLineItemProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Deal Lines Editor",
							href: "/docs/blocks/deal-lines-editor",
							description: "Editable table for managing deal line items with inline editing.",
						},
						{
							title: "StatsStrip",
							href: "/docs/blocks/stats-strip",
							description: "Compact KPI bar with optional sparklines.",
						},
						{
							title: "Multi Step Form",
							href: "/docs/blocks/multi-step-form",
							description: "Wizard-style form with step navigation and validation.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
