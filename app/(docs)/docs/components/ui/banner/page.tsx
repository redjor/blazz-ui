import { Banner } from "@/components/ui/banner"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { Info } from "lucide-react"
import {
	InfoBannerDemo,
	SuccessBannerDemo,
	WarningBannerDemo,
	CriticalBannerDemo,
	WithActionsBannerDemo,
	AsyncActionBannerDemo,
} from "./banner-demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "banner-props", title: "Banner Props" },
	{ id: "action-props", title: "Action Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const bannerProps: DocProp[] = [
	{
		name: "tone",
		type: '"info" | "success" | "warning" | "critical"',
		default: '"info"',
		description: "The visual style and semantic meaning of the banner.",
	},
	{
		name: "title",
		type: "string",
		description: "The title of the banner message.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The body content of the banner.",
	},
	{
		name: "icon",
		type: "React.ReactNode",
		description: "Custom icon to display. Defaults to tone-specific icons if not provided.",
	},
	{
		name: "hideIcon",
		type: "boolean",
		default: "false",
		description: "Hide the icon completely.",
	},
	{
		name: "action",
		type: "BannerAction",
		description: "Primary action button configuration.",
	},
	{
		name: "secondaryAction",
		type: "BannerAction",
		description: "Secondary action button configuration.",
	},
	{
		name: "onDismiss",
		type: "() => void",
		description: "Callback when the banner is dismissed.",
	},
]

const bannerActionProps: DocProp[] = [
	{
		name: "content",
		type: "string",
		description: "The text content of the action button.",
	},
	{
		name: "url",
		type: "string",
		description: "Optional URL for the action. Makes the button a link.",
	},
	{
		name: "onAction",
		type: "() => void | Promise<void>",
		description: "Callback when the action is clicked.",
	},
	{
		name: "loading",
		type: "boolean",
		default: "false",
		description: "Show loading state on the button.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Disable the action button.",
	},
]

export default function BannerPage() {
	return (
		<DocPage
			title="Banner"
			subtitle="Display important page-level messages and notifications."
			toc={toc}
		>
			<DocHero>
				<Banner tone="info" title="Update Available" className="w-full max-w-lg">
					A new version of the app is available. Update to get the latest features.
				</Banner>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Info Banner"
					description="Use for informational messages that don't require immediate action."
					code={`<Banner
  tone="info"
  title="Update Available"
  onDismiss={() => setShowInfo(false)}
>
  A new version of the app is available. Update to get the latest features.
</Banner>`}
				>
					<InfoBannerDemo />
				</DocExample>

				<DocExample
					title="Success Banner"
					description="Use to confirm successful operations."
					code={`<Banner
  tone="success"
  title="Changes Saved"
  onDismiss={() => setShowSuccess(false)}
>
  Your settings have been saved successfully.
</Banner>`}
				>
					<SuccessBannerDemo />
				</DocExample>

				<DocExample
					title="Warning Banner"
					description="Use for warnings that need attention but aren't critical."
					code={`<Banner
  tone="warning"
  title="Limited Functionality"
  onDismiss={() => setShowWarning(false)}
>
  Some features are temporarily unavailable due to maintenance.
</Banner>`}
				>
					<WarningBannerDemo />
				</DocExample>

				<DocExample
					title="Critical Banner"
					description="Use for errors or critical issues requiring immediate attention."
					code={`<Banner
  tone="critical"
  title="Payment Failed"
  onDismiss={() => setShowCritical(false)}
>
  Your payment could not be processed. Please update your payment method.
</Banner>`}
				>
					<CriticalBannerDemo />
				</DocExample>

				<DocExample
					title="With Actions"
					description="Add primary and secondary actions to the banner."
					code={`<Banner
  tone="info"
  title="New Features Available"
  action={{
    content: "Learn More",
    url: "/features"
  }}
  secondaryAction={{
    content: "Dismiss",
    onAction: () => console.log("Dismissed")
  }}
>
  Check out the latest features added to your dashboard.
</Banner>`}
				>
					<WithActionsBannerDemo />
				</DocExample>

				<DocExample
					title="Async Action"
					description="Show loading state during async operations."
					code={`const [loading, setLoading] = React.useState(false)

const handleAsyncAction = async () => {
  setLoading(true)
  await new Promise(resolve => setTimeout(resolve, 2000))
  setLoading(false)
}

<Banner
  tone="warning"
  title="Confirm Action"
  action={{
    content: "Confirm",
    onAction: handleAsyncAction,
    loading: loading
  }}
>
  This action requires confirmation. Click confirm to proceed.
</Banner>`}
				>
					<AsyncActionBannerDemo />
				</DocExample>

				<DocExample
					title="Without Icon"
					description="Hide the icon for simpler presentation."
					code={`<Banner
  tone="info"
  title="System Notification"
  hideIcon
>
  This banner appears without an icon for a cleaner look.
</Banner>`}
				>
					<Banner
						tone="info"
						title="System Notification"
						hideIcon
					>
						This banner appears without an icon for a cleaner look.
					</Banner>
				</DocExample>

				<DocExample
					title="Custom Icon"
					description="Provide a custom icon instead of the default."
					code={`<Banner
  tone="info"
  title="Special Offer"
  icon={<Info className="h-5 w-5" />}
>
  Get 20% off your next purchase with code SPECIAL20.
</Banner>`}
				>
					<Banner
						tone="info"
						title="Special Offer"
						icon={Info}
					>
						Get 20% off your next purchase with code SPECIAL20.
					</Banner>
				</DocExample>
			</DocSection>

			<DocSection id="banner-props" title="Banner Props">
				<DocPropsTable props={bannerProps} />
			</DocSection>

			<DocSection id="action-props" title="BannerAction Props">
				<DocPropsTable props={bannerActionProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Banner uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-inform</code> - Info banner background
					</li>
					<li>
						<code className="text-xs">text-inform</code> - Info banner text
					</li>
					<li>
						<code className="text-xs">border-inform</code> - Info banner border
					</li>
					<li>
						<code className="text-xs">bg-positive</code> - Success banner background
					</li>
					<li>
						<code className="text-xs">bg-caution</code> - Warning banner background
					</li>
					<li>
						<code className="text-xs">bg-negative</code> - Critical banner background
					</li>
					<li>
						<code className="text-xs">rounded-lg</code> - Border radius (0.5rem)
					</li>
					<li>
						<code className="text-xs">p-4</code> - Internal padding (1rem)
					</li>
					<li>
						<code className="text-xs">gap-3</code> - Gap between elements (0.75rem)
					</li>
				</ul>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-disc list-inside space-y-2 text-sm text-fg-muted">
					<li>Use banners for page-level messages, not inline feedback</li>
					<li>Place banners at the top of the page or section</li>
					<li>Keep banner content concise and actionable</li>
					<li>Use critical tone sparingly - only for serious errors</li>
					<li>Provide dismiss functionality for non-critical banners</li>
					<li>Include relevant actions when the user needs to take steps</li>
					<li>Don't stack multiple banners - prioritize the most important message</li>
					<li>Consider auto-dismissing success banners after a few seconds</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Alert",
							href: "/docs/components/ui/alert",
							description: "Inline feedback within sections.",
						},
						{
							title: "Dialog",
							href: "/docs/components/ui/dialog",
							description: "Modal confirmations and forms.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
