"use client"

import { use } from "react"
import { DetailPanel } from "@blazz/pro/components/blocks/detail-panel"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `import { DetailPanel } from "@blazz/pro/components/blocks/detail-panel"

<DetailPanel>
  <DetailPanel.Header
    title="Nextera Solutions"
    subtitle="Client depuis janvier 2024"
  />
  <DetailPanel.Section title="Informations générales">
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <span className="text-fg-muted">Secteur</span>
      <span className="text-fg">Technologie</span>
      <span className="text-fg-muted">SIRET</span>
      <span className="text-fg">842 156 739 00012</span>
      <span className="text-fg-muted">Effectif</span>
      <span className="text-fg">45 employés</span>
    </div>
  </DetailPanel.Section>
  <DetailPanel.Section title="Contact principal">
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <span className="text-fg-muted">Nom</span>
      <span className="text-fg">Marie Lefèvre</span>
      <span className="text-fg-muted">Email</span>
      <span className="text-fg">m.lefevre@nextera.fr</span>
    </div>
  </DetailPanel.Section>
</DetailPanel>`,
	},
	{
		key: "actions",
		code: `import { DetailPanel } from "@blazz/pro/components/blocks/detail-panel"
import { Pencil, Trash2 } from "lucide-react"

<DetailPanel>
  <DetailPanel.Header
    title="Proposition commerciale #PC-2026-018"
    subtitle="Créée le 8 mars 2026 par Sophie Martin"
    actions={[
      {
        label: "Modifier",
        onClick: () => console.log("edit"),
        icon: Pencil,
        variant: "outline",
      },
      {
        label: "Supprimer",
        onClick: () => console.log("delete"),
        icon: Trash2,
        variant: "destructive",
      },
    ]}
  />
  <DetailPanel.Section title="Lignes de devis">
    <p className="text-sm text-fg-muted">3 lignes — Total : 24 800 € HT</p>
  </DetailPanel.Section>
</DetailPanel>`,
	},
	{
		key: "status",
		code: `import { DetailPanel } from "@blazz/pro/components/blocks/detail-panel"
import { Badge } from "@blazz/ui/components/ui/badge"

<DetailPanel>
  <DetailPanel.Header
    title="Deal — Refonte SI Logistique"
    subtitle="Pipeline : Qualification"
    status={<Badge variant="success">Gagné</Badge>}
  />
  <DetailPanel.Section title="Montant & échéance">
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <span className="text-fg-muted">Montant</span>
      <span className="text-fg font-medium">86 000 €</span>
      <span className="text-fg-muted">Probabilité</span>
      <span className="text-fg">90 %</span>
      <span className="text-fg-muted">Date de clôture</span>
      <span className="text-fg">30 avril 2026</span>
    </div>
  </DetailPanel.Section>
  <DetailPanel.Section
    title="Notes"
    description="Informations complémentaires sur le deal"
  >
    <p className="text-sm text-fg">
      Le client a validé le POC. Signature prévue fin avril
      après validation du comité de direction.
    </p>
  </DetailPanel.Section>
</DetailPanel>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const detailPanelProps: DocProp[] = [
	{
		name: "children",
		type: "ReactNode",
		description: "Content — typically DetailPanel.Header and DetailPanel.Section components.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the root container.",
	},
]

const detailPanelHeaderProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		description: "Main heading text.",
	},
	{
		name: "subtitle",
		type: "string",
		description: "Secondary text below the title.",
	},
	{
		name: "status",
		type: "ReactNode",
		description: "Status indicator rendered next to the title (e.g. a Badge).",
	},
	{
		name: "actions",
		type: "DetailPanelAction[]",
		description: "Array of action buttons rendered on the right side of the header.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
]

const detailPanelSectionProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		description: "Section heading.",
	},
	{
		name: "description",
		type: "string",
		description: "Optional description text below the section title.",
	},
	{
		name: "children",
		type: "ReactNode",
		description: "Section content.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
]

const detailPanelActionProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "Button text.",
	},
	{
		name: "onClick",
		type: "() => void | Promise<void>",
		description: "Click handler for the action button.",
	},
	{
		name: "icon",
		type: "LucideIcon",
		description: "Optional icon displayed before the label.",
	},
	{
		name: "variant",
		type: '"default" | "outline" | "ghost" | "destructive"',
		default: '"outline"',
		description: "Button variant style.",
	},
]

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "detail-panel-props", title: "DetailPanel Props" },
	{ id: "detail-panel-header-props", title: "DetailPanel.Header Props" },
	{ id: "detail-panel-section-props", title: "DetailPanel.Section Props" },
	{ id: "detail-panel-action-type", title: "DetailPanelAction Type" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Hero demo
// ---------------------------------------------------------------------------

function DetailPanelHeroDemo() {
	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-card overflow-hidden p-6">
			<DetailPanel>
				<DetailPanel.Header
					title="Nextera Solutions"
					subtitle="Client depuis janvier 2024"
					status={<Badge variant="default">Actif</Badge>}
					actions={[
						{
							label: "Modifier",
							onClick: () => {},
							icon: Pencil,
							variant: "outline",
						},
					]}
				/>
				<DetailPanel.Section title="Informations générales">
					<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
						<span className="text-fg-muted">Secteur</span>
						<span className="text-fg">Technologie</span>
						<span className="text-fg-muted">SIRET</span>
						<span className="text-fg">842 156 739 00012</span>
						<span className="text-fg-muted">Effectif</span>
						<span className="text-fg">45 employés</span>
						<span className="text-fg-muted">CA annuel</span>
						<span className="text-fg">3,2 M€</span>
					</div>
				</DetailPanel.Section>
				<DetailPanel.Section title="Contact principal">
					<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
						<span className="text-fg-muted">Nom</span>
						<span className="text-fg">Marie Lefèvre</span>
						<span className="text-fg-muted">Poste</span>
						<span className="text-fg">Directrice des Achats</span>
						<span className="text-fg-muted">Email</span>
						<span className="text-fg">m.lefevre@nextera.fr</span>
						<span className="text-fg-muted">Téléphone</span>
						<span className="text-fg">+33 6 12 34 56 78</span>
					</div>
				</DetailPanel.Section>
			</DetailPanel>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DetailPanelPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Detail Panel"
			subtitle="A compound component for structured detail views with header, status badges, action buttons, and content sections."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<DetailPanelHeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A detail panel with a header and two content sections displaying field-value pairs in a grid layout."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-card overflow-hidden p-6">
						<DetailPanel>
							<DetailPanel.Header title="Nextera Solutions" subtitle="Client depuis janvier 2024" />
							<DetailPanel.Section title="Informations générales">
								<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
									<span className="text-fg-muted">Secteur</span>
									<span className="text-fg">Technologie</span>
									<span className="text-fg-muted">SIRET</span>
									<span className="text-fg">842 156 739 00012</span>
									<span className="text-fg-muted">Effectif</span>
									<span className="text-fg">45 employés</span>
								</div>
							</DetailPanel.Section>
							<DetailPanel.Section title="Contact principal">
								<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
									<span className="text-fg-muted">Nom</span>
									<span className="text-fg">Marie Lefèvre</span>
									<span className="text-fg-muted">Email</span>
									<span className="text-fg">m.lefevre@nextera.fr</span>
								</div>
							</DetailPanel.Section>
						</DetailPanel>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Actions"
					description="The header accepts an actions array that renders action buttons on the right side. Each action can have an icon and a variant."
					code={examples[1].code}
					highlightedCode={html("actions")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-card overflow-hidden p-6">
						<DetailPanel>
							<DetailPanel.Header
								title="Proposition commerciale #PC-2026-018"
								subtitle="Créée le 8 mars 2026 par Sophie Martin"
								actions={[
									{
										label: "Modifier",
										onClick: () => {},
										icon: Pencil,
										variant: "outline",
									},
									{
										label: "Supprimer",
										onClick: () => {},
										icon: Trash2,
										variant: "destructive",
									},
								]}
							/>
							<DetailPanel.Section title="Lignes de devis">
								<p className="text-sm text-fg-muted">3 lignes — Total : 24 800 € HT</p>
							</DetailPanel.Section>
						</DetailPanel>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Status Badge"
					description="Pass any ReactNode as the status prop to display a badge or indicator next to the title."
					code={examples[2].code}
					highlightedCode={html("status")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-card overflow-hidden p-6">
						<DetailPanel>
							<DetailPanel.Header
								title="Deal — Refonte SI Logistique"
								subtitle="Pipeline : Qualification"
								status={<Badge variant="success">Gagné</Badge>}
							/>
							<DetailPanel.Section title="Montant & échéance">
								<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
									<span className="text-fg-muted">Montant</span>
									<span className="text-fg font-medium">86 000 €</span>
									<span className="text-fg-muted">Probabilité</span>
									<span className="text-fg">90 %</span>
									<span className="text-fg-muted">Date de clôture</span>
									<span className="text-fg">30 avril 2026</span>
								</div>
							</DetailPanel.Section>
							<DetailPanel.Section
								title="Notes"
								description="Informations complémentaires sur le deal"
							>
								<p className="text-sm text-fg">
									Le client a validé le POC. Signature prévue fin avril après validation du comité
									de direction.
								</p>
							</DetailPanel.Section>
						</DetailPanel>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* DetailPanel Props */}
			<DocSection id="detail-panel-props" title="DetailPanel Props">
				<DocPropsTable props={detailPanelProps} />
			</DocSection>

			{/* DetailPanel.Header Props */}
			<DocSection id="detail-panel-header-props" title="DetailPanel.Header Props">
				<DocPropsTable props={detailPanelHeaderProps} />
			</DocSection>

			{/* DetailPanel.Section Props */}
			<DocSection id="detail-panel-section-props" title="DetailPanel.Section Props">
				<DocPropsTable props={detailPanelSectionProps} />
			</DocSection>

			{/* DetailPanelAction Type */}
			<DocSection id="detail-panel-action-type" title="DetailPanelAction Type">
				<DocPropsTable props={detailPanelActionProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Split View",
							href: "/docs/blocks/split-view",
							description: "Two-pane master-detail layout.",
						},
						{
							title: "Property Card",
							href: "/docs/blocks/property-card",
							description: "Compact card for displaying key-value properties.",
						},
						{
							title: "Inline Edit",
							href: "/docs/blocks/inline-edit",
							description: "Click-to-edit fields for inline data modification.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
