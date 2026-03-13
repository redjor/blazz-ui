import type { FormStep, StepComponentProps } from "@blazz/ui/components/blocks/multi-step-form"
import { MultiStepForm } from "@blazz/ui/components/blocks/multi-step-form"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "multi-step-form-props", title: "MultiStepForm Props" },
	{ id: "form-step-type", title: "FormStep Type" },
	{ id: "step-component-props-type", title: "StepComponentProps Type" },
	{ id: "related", title: "Related" },
]

const multiStepFormProps: DocProp[] = [
	{
		name: "steps",
		type: "FormStep[]",
		description: "Array of step definitions with id, title, optional schema, and component.",
	},
	{
		name: "onSubmit",
		type: "(data: Record<string, unknown>) => void | Promise<void>",
		description: "Callback fired when the last step is validated and submitted.",
	},
	{
		name: "onSaveDraft",
		type: "(data: Record<string, unknown>) => void | Promise<void>",
		description:
			"Optional callback to save form data as draft. Shows a 'Sauvegarder le brouillon' button when provided.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the form wrapper.",
	},
]

const formStepProps: DocProp[] = [
	{
		name: "id",
		type: "string",
		description: "Unique step identifier.",
	},
	{
		name: "title",
		type: "string",
		description: "Display title shown in the step indicator.",
	},
	{
		name: "schema",
		type: "ZodSchema",
		description: "Optional Zod schema for step validation. If omitted, the step is always valid.",
	},
	{
		name: "component",
		type: "ComponentType<StepComponentProps>",
		description: "React component rendered for this step.",
	},
]

const stepComponentPropsProps: DocProp[] = [
	{
		name: "data",
		type: "Record<string, unknown>",
		description: "Current accumulated form data across all steps.",
	},
	{
		name: "onChange",
		type: "(updates: Record<string, unknown>) => void",
		description: "Merge updates into form data. Pass partial objects.",
	},
	{
		name: "errors",
		type: "Record<string, string>",
		description: "Validation errors keyed by field path, populated when schema validation fails.",
	},
]

/* ─── Step Components ─── */

function InformationsStep({ data, onChange, errors }: StepComponentProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-1.5">
				<Label htmlFor="companyName">Nom de l'entreprise</Label>
				<Input
					id="companyName"
					value={(data.companyName as string) ?? ""}
					onChange={(e) => onChange({ companyName: e.target.value })}
					placeholder="Acme Corporation"
				/>
				{errors?.companyName && <p className="text-xs text-negative">{errors.companyName}</p>}
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="siret">SIRET</Label>
				<Input
					id="siret"
					value={(data.siret as string) ?? ""}
					onChange={(e) => onChange({ siret: e.target.value })}
					placeholder="123 456 789 00001"
				/>
				{errors?.siret && <p className="text-xs text-negative">{errors.siret}</p>}
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="sector">Secteur d'activite</Label>
				<Input
					id="sector"
					value={(data.sector as string) ?? ""}
					onChange={(e) => onChange({ sector: e.target.value })}
					placeholder="Technologie"
				/>
			</div>
		</div>
	)
}

function DetailsStep({ data, onChange, errors }: StepComponentProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-1.5">
				<Label htmlFor="address">Adresse</Label>
				<Input
					id="address"
					value={(data.address as string) ?? ""}
					onChange={(e) => onChange({ address: e.target.value })}
					placeholder="123 Avenue des Champs-Elysees"
				/>
				{errors?.address && <p className="text-xs text-negative">{errors.address}</p>}
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label htmlFor="city">Ville</Label>
					<Input
						id="city"
						value={(data.city as string) ?? ""}
						onChange={(e) => onChange({ city: e.target.value })}
						placeholder="Paris"
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="postalCode">Code postal</Label>
					<Input
						id="postalCode"
						value={(data.postalCode as string) ?? ""}
						onChange={(e) => onChange({ postalCode: e.target.value })}
						placeholder="75008"
					/>
				</div>
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="contactEmail">Email de contact</Label>
				<Input
					id="contactEmail"
					type="email"
					value={(data.contactEmail as string) ?? ""}
					onChange={(e) => onChange({ contactEmail: e.target.value })}
					placeholder="contact@acme.fr"
				/>
			</div>
		</div>
	)
}

function ConfirmationStep({ data }: StepComponentProps) {
	return (
		<div className="space-y-4">
			<p className="text-sm text-fg-muted">Verifiez les informations avant de valider.</p>
			<div className="rounded-lg border border-edge bg-raised/50 p-4 space-y-3">
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div>
						<span className="text-fg-muted">Entreprise</span>
						<p className="font-medium text-fg">{(data.companyName as string) || "—"}</p>
					</div>
					<div>
						<span className="text-fg-muted">SIRET</span>
						<p className="font-medium text-fg">{(data.siret as string) || "—"}</p>
					</div>
					<div>
						<span className="text-fg-muted">Secteur</span>
						<p className="font-medium text-fg">{(data.sector as string) || "—"}</p>
					</div>
					<div>
						<span className="text-fg-muted">Ville</span>
						<p className="font-medium text-fg">{(data.city as string) || "—"}</p>
					</div>
					<div className="col-span-2">
						<span className="text-fg-muted">Adresse</span>
						<p className="font-medium text-fg">
							{(data.address as string) || "—"}
							{(data.postalCode as string) ? `, ${data.postalCode}` : ""}
						</p>
					</div>
					<div>
						<span className="text-fg-muted">Email</span>
						<p className="font-medium text-fg">{(data.contactEmail as string) || "—"}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

const heroSteps: FormStep[] = [
	{ id: "info", title: "Informations", component: InformationsStep },
	{ id: "details", title: "Details", component: DetailsStep },
	{ id: "confirm", title: "Confirmation", component: ConfirmationStep },
]

const examples = [
	{
		key: "basic",
		code: `import { MultiStepForm } from "@blazz/ui/components/blocks/multi-step-form"
import type { FormStep, StepComponentProps } from "@blazz/ui/components/blocks/multi-step-form"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"

function InfoStep({ data, onChange, errors }: StepComponentProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="companyName">Nom de l'entreprise</Label>
        <Input
          id="companyName"
          value={(data.companyName as string) ?? ""}
          onChange={(e) => onChange({ companyName: e.target.value })}
          placeholder="Acme Corporation"
        />
        {errors?.companyName && (
          <p className="text-xs text-negative">{errors.companyName}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="siret">SIRET</Label>
        <Input
          id="siret"
          value={(data.siret as string) ?? ""}
          onChange={(e) => onChange({ siret: e.target.value })}
          placeholder="123 456 789 00001"
        />
      </div>
    </div>
  )
}

function DetailsStep({ data, onChange }: StepComponentProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={(data.address as string) ?? ""}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="123 Avenue des Champs-Elysees"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={(data.city as string) ?? ""}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="Paris"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postalCode">Code postal</Label>
          <Input
            id="postalCode"
            value={(data.postalCode as string) ?? ""}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            placeholder="75008"
          />
        </div>
      </div>
    </div>
  )
}

function ConfirmStep({ data }: StepComponentProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-muted">Verifiez les informations.</p>
      <div className="rounded-lg border bg-raised/50 p-4 text-sm space-y-2">
        <p><span className="text-fg-muted">Entreprise:</span> {(data.companyName as string) || "—"}</p>
        <p><span className="text-fg-muted">SIRET:</span> {(data.siret as string) || "—"}</p>
        <p><span className="text-fg-muted">Adresse:</span> {(data.address as string) || "—"}</p>
        <p><span className="text-fg-muted">Ville:</span> {(data.city as string) || "—"}</p>
      </div>
    </div>
  )
}

const steps: FormStep[] = [
  { id: "info", title: "Informations", component: InfoStep },
  { id: "details", title: "Details", component: DetailsStep },
  { id: "confirm", title: "Confirmation", component: ConfirmStep },
]

function BasicMultiStep() {
  return (
    <MultiStepForm
      steps={steps}
      onSubmit={(data) => {
        console.log("Submitted:", data)
        alert("Entreprise creee avec succes !")
      }}
    />
  )
}`,
	},
	{
		key: "with-draft",
		code: `import { MultiStepForm } from "@blazz/ui/components/blocks/multi-step-form"
import type { FormStep, StepComponentProps } from "@blazz/ui/components/blocks/multi-step-form"

// Re-use the same step components from the basic example

const steps: FormStep[] = [
  { id: "info", title: "Informations", component: InfoStep },
  { id: "details", title: "Details", component: DetailsStep },
  { id: "confirm", title: "Confirmation", component: ConfirmStep },
]

function WithDraftSave() {
  return (
    <MultiStepForm
      steps={steps}
      onSubmit={(data) => {
        console.log("Submitted:", data)
      }}
      onSaveDraft={(data) => {
        console.log("Draft saved:", data)
        alert("Brouillon sauvegarde !")
      }}
    />
  )
}`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/blocks/multi-step-form")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: MultiStepFormPage,
})

function HeroDemo() {
	const [submitted, setSubmitted] = useState(false)

	if (submitted) {
		return (
			<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
				<div className="flex flex-col items-center justify-center py-8 space-y-3">
					<div className="flex size-12 items-center justify-center rounded-full bg-positive/10 text-positive">
						<svg
							className="size-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<p className="text-sm font-medium text-fg">Entreprise creee avec succes !</p>
					<button
						type="button"
						onClick={() => setSubmitted(false)}
						className="text-xs text-brand hover:underline"
					>
						Recommencer
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<MultiStepForm steps={heroSteps} onSubmit={() => setSubmitted(true)} />
		</div>
	)
}

function BasicDemo() {
	return (
		<MultiStepForm
			steps={heroSteps}
			onSubmit={(data) => {
				console.log("Submitted:", data)
				alert("Entreprise creee avec succes !")
			}}
		/>
	)
}

function WithDraftDemo() {
	return (
		<MultiStepForm
			steps={heroSteps}
			onSubmit={(data) => {
				console.log("Submitted:", data)
				alert("Entreprise creee avec succes !")
			}}
			onSaveDraft={(data) => {
				console.log("Draft saved:", data)
				alert("Brouillon sauvegarde !")
			}}
		/>
	)
}

function MultiStepFormPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="MultiStepForm"
			subtitle="Multi-step wizard with step indicator, validation, navigation, and optional draft saving. Each step is a standalone component receiving shared form data."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<HeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic (3 Steps)"
					description="A company creation form with Informations, Details, and Confirmation steps. Navigate with Suivant/Precedent."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<BasicDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Draft Save"
					description="Pass onSaveDraft to show a 'Sauvegarder le brouillon' button, letting users save progress without completing the form."
					code={examples[1].code}
					highlightedCode={html("with-draft")}
				>
					<WithDraftDemo />
				</DocExampleClient>
			</DocSection>

			{/* MultiStepForm Props */}
			<DocSection id="multi-step-form-props" title="MultiStepForm Props">
				<DocPropsTable props={multiStepFormProps} />
			</DocSection>

			{/* FormStep Type */}
			<DocSection id="form-step-type" title="FormStep Type">
				<DocPropsTable props={formStepProps} />
			</DocSection>

			{/* StepComponentProps Type */}
			<DocSection id="step-component-props-type" title="StepComponentProps Type">
				<DocPropsTable props={stepComponentPropsProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Deal Lines Editor",
							href: "/docs/blocks/deal-lines-editor",
							description: "Editable line items, often embedded in a multi-step flow.",
						},
						{
							title: "Status Flow",
							href: "/docs/blocks/status-flow",
							description: "Visual progress indicator for workflow stages.",
						},
						{
							title: "Inline Edit",
							href: "/docs/blocks/inline-edit",
							description: "Click-to-edit fields for quick edits within form steps.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
