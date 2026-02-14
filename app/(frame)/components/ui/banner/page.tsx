"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"
import { Banner } from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"

const bannerProps: PropDefinition[] = [
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

const bannerActionProps: PropDefinition[] = [
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
	const [showInfo, setShowInfo] = React.useState(true)
	const [showSuccess, setShowSuccess] = React.useState(true)
	const [showWarning, setShowWarning] = React.useState(true)
	const [showCritical, setShowCritical] = React.useState(true)
	const [loading, setLoading] = React.useState(false)

	const handleAsyncAction = async () => {
		setLoading(true)
		await new Promise(resolve => setTimeout(resolve, 2000))
		setLoading(false)
	}

	return (
		<Page
			title="Banner"
			subtitle="Display important page-level messages and notifications."
		>
			<div className="space-y-12">
				{/* Info Banner */}
				<ComponentExample
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
					{showInfo && (
						<Banner
							tone="info"
							title="Update Available"
							onDismiss={() => setShowInfo(false)}
						>
							A new version of the app is available. Update to get the latest features.
						</Banner>
					)}
					{!showInfo && (
						<Button variant="outline" onClick={() => setShowInfo(true)}>
							Show Info Banner
						</Button>
					)}
				</ComponentExample>

				{/* Success Banner */}
				<ComponentExample
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
					{showSuccess && (
						<Banner
							tone="success"
							title="Changes Saved"
							onDismiss={() => setShowSuccess(false)}
						>
							Your settings have been saved successfully.
						</Banner>
					)}
					{!showSuccess && (
						<Button variant="outline" onClick={() => setShowSuccess(true)}>
							Show Success Banner
						</Button>
					)}
				</ComponentExample>

				{/* Warning Banner */}
				<ComponentExample
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
					{showWarning && (
						<Banner
							tone="warning"
							title="Limited Functionality"
							onDismiss={() => setShowWarning(false)}
						>
							Some features are temporarily unavailable due to maintenance.
						</Banner>
					)}
					{!showWarning && (
						<Button variant="outline" onClick={() => setShowWarning(true)}>
							Show Warning Banner
						</Button>
					)}
				</ComponentExample>

				{/* Critical Banner */}
				<ComponentExample
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
					{showCritical && (
						<Banner
							tone="critical"
							title="Payment Failed"
							onDismiss={() => setShowCritical(false)}
						>
							Your payment could not be processed. Please update your payment method.
						</Banner>
					)}
					{!showCritical && (
						<Button variant="outline" onClick={() => setShowCritical(true)}>
							Show Critical Banner
						</Button>
					)}
				</ComponentExample>

				{/* With Actions */}
				<ComponentExample
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
					<Banner
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
					</Banner>
				</ComponentExample>

				{/* Async Action */}
				<ComponentExample
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
					</Banner>
				</ComponentExample>

				{/* Without Icon */}
				<ComponentExample
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
				</ComponentExample>

				{/* Custom Icon */}
				<ComponentExample
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
				</ComponentExample>

				{/* Props Tables */}
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Banner Props</h2>
					<PropsTable props={bannerProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">BannerAction Props</h2>
					<PropsTable props={bannerActionProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Banner uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-p-info-surface</code> - Info banner background
						</li>
						<li>
							<code className="text-xs">text-p-info-text</code> - Info banner text
						</li>
						<li>
							<code className="text-xs">border-p-info-border</code> - Info banner border
						</li>
						<li>
							<code className="text-xs">bg-p-success-surface</code> - Success banner background
						</li>
						<li>
							<code className="text-xs">bg-p-warning-surface</code> - Warning banner background
						</li>
						<li>
							<code className="text-xs">bg-p-critical-surface</code> - Critical banner background
						</li>
						<li>
							<code className="text-xs">rounded-p-lg</code> - Border radius (0.5rem)
						</li>
						<li>
							<code className="text-xs">p-p-4</code> - Internal padding (1rem)
						</li>
						<li>
							<code className="text-xs">gap-p-3</code> - Gap between elements (0.75rem)
						</li>
					</ul>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use banners for page-level messages, not inline feedback</li>
						<li>Place banners at the top of the page or section</li>
						<li>Keep banner content concise and actionable</li>
						<li>Use critical tone sparingly - only for serious errors</li>
						<li>Provide dismiss functionality for non-critical banners</li>
						<li>Include relevant actions when the user needs to take steps</li>
						<li>Don't stack multiple banners - prioritize the most important message</li>
						<li>Consider auto-dismissing success banners after a few seconds</li>
					</ul>
				</section>

				{/* When to Use */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">When to Use</h2>
					<div className="space-y-4">
						<div>
							<h3 className="font-semibold text-sm mb-2">Use Banner when:</h3>
							<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
								<li>Communicating page-level status or information</li>
								<li>Showing system-wide announcements</li>
								<li>Displaying persistent warnings or errors</li>
								<li>Providing important context for the entire page</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-sm mb-2">Use Alert instead when:</h3>
							<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
								<li>Displaying inline feedback within a section</li>
								<li>Showing validation messages in forms</li>
								<li>Providing contextual information for specific components</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-sm mb-2">Use Toast instead when:</h3>
							<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
								<li>Showing temporary feedback that auto-dismisses</li>
								<li>Confirming user actions (saved, deleted, etc.)</li>
								<li>Displaying non-critical notifications</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Accessibility */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Accessibility</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Uses role="alert" for critical banners (announced immediately)</li>
						<li>Uses role="status" for info/success/warning (polite announcement)</li>
						<li>aria-live attribute controls screen reader announcements</li>
						<li>Dismiss button includes aria-label for screen readers</li>
						<li>Proper color contrast maintained for all tones</li>
						<li>Icons include semantic meaning through context</li>
						<li>Keyboard navigable with focus management</li>
						<li>Action buttons follow standard button accessibility</li>
					</ul>
				</section>

				{/* Related Components */}
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>For inline feedback within sections, use the Alert component</li>
						<li>For temporary notifications, use the Toast component</li>
						<li>For modal confirmations, use the Dialog component</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
