import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { DocDoDont } from "@/components/features/docs/doc-do-dont"
import {
	CalloutCardDefaultDemo,
	CalloutCardSecondaryActionDemo,
	CalloutCardDismissDemo,
	CalloutCardIllustrationDemo,
} from "./callout-card-demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const calloutCardProps: DocProp[] = [
	{
		name: "title",
		type: "React.ReactNode",
		required: true,
		description: "The title of the card.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content to display inside the callout card.",
	},
	{
		name: "illustration",
		type: "string",
		description: "URL to the card illustration.",
	},
	{
		name: "primaryAction",
		type: "{ content: string; url?: string; onAction?: () => void }",
		required: true,
		description: "Primary action for the card.",
	},
	{
		name: "secondaryAction",
		type: '{ content: string; url?: string; onAction?: () => void; variant?: ButtonVariant }',
		description: "Secondary action for the card.",
	},
	{
		name: "onDismiss",
		type: "() => void",
		description: "Callback when the card is dismissed. Shows a dismiss button when provided.",
	},
]

export default function CalloutCardPage() {
	return (
		<DocPage
			title="Callout Card"
			subtitle="Callout cards are used to encourage users to take an action related to a new feature or opportunity."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="Use to let users know about a feature or opportunity where there is a clear, single action they need to take."
					code={`<CalloutCard
  title="Customize the style of your checkout"
  primaryAction={{
    content: "Customize checkout",
    url: "/settings/checkout"
  }}
>
  Upload your store's logo, change colors and fonts, and more.
</CalloutCard>`}
				>
					<CalloutCardDefaultDemo />
				</DocExample>

				<DocExample
					title="With Secondary Action"
					description="Use when there's a secondary action that's less important than the primary action."
					code={`<CalloutCard
  title="Set up two-step authentication"
  primaryAction={{
    content: "Enable",
    onAction: () => {}
  }}
  secondaryAction={{
    content: "Learn more",
    variant: "ghost",
    onAction: () => {}
  }}
>
  Add an extra layer of security to your account.
</CalloutCard>`}
				>
					<CalloutCardSecondaryActionDemo />
				</DocExample>

				<DocExample
					title="Dismissable"
					description="Allow users to dismiss the callout card when they're not interested."
					code={`<CalloutCard
  title="Try the new inventory management"
  primaryAction={{
    content: "Get started",
    onAction: () => {}
  }}
  onDismiss={() => setDismissed(true)}
>
  Track your inventory across multiple locations.
</CalloutCard>`}
				>
					<CalloutCardDismissDemo />
				</DocExample>

				<DocExample
					title="With Illustration"
					description="Add an illustration to make the callout card more visually appealing."
					code={`<CalloutCard
  title="Start selling on Facebook and Instagram"
  illustration="/images/social-selling.svg"
  primaryAction={{
    content: "Connect accounts",
    url: "/channels/social"
  }}
  secondaryAction={{
    content: "Learn more",
    variant: "link"
  }}
>
  Reach millions of shoppers and grow your business.
</CalloutCard>`}
				>
					<CalloutCardIllustrationDemo />
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={calloutCardProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<DocDoDont
					doExample={
						<div className="text-sm">
							<p className="font-medium">Customize the style of your checkout</p>
							<p className="text-fg-muted">Upload your store's logo, change colors and fonts.</p>
						</div>
					}
					doText="Clearly articulate the benefit of the feature and provide a single call to action."
					dontExample={
						<div className="text-sm">
							<p className="font-medium">New feature!</p>
							<p className="text-fg-muted">Check it out now.</p>
						</div>
					}
					dontText="Don't use vague titles or descriptions that don't explain the value."
				/>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Card",
							href: "/docs/components/layout/card",
							description: "Group similar concepts and tasks together.",
						},
						{
							title: "Banner",
							href: "/docs/components/ui/banner",
							description: "Display important page-level messages and notifications.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
