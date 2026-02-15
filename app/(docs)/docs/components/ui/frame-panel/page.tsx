import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Frame,
	FramePanel,
	FrameHeader,
	FrameTitle,
	FrameDescription,
	FrameFooter,
} from "@/components/ui/frame-panel"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
]

const frameProps: DocProp[] = [
	{
		name: "variant",
		type: '"default" | "ghost"',
		default: '"default"',
		description: "Visual style. Default has border and background, ghost is transparent.",
	},
	{
		name: "spacing",
		type: '"xs" | "sm" | "default" | "lg"',
		default: '"default"',
		description: "Inner padding for panels, headers, and footers.",
	},
	{
		name: "stacked",
		type: "boolean",
		default: "false",
		description: "Remove gaps between panels and merge borders for a continuous look.",
	},
	{
		name: "dense",
		type: "boolean",
		default: "false",
		description: "Remove outer padding for flush panel edges.",
	},
]

const panelProps: DocProp[] = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "Panel content. Use FrameHeader, FrameFooter for structured layouts.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
]

export default function FramePanelPage() {
	return (
		<DocPage
			title="Frame"
			subtitle="A container that groups related panels with consistent spacing, borders, and visual hierarchy. Use it for settings pages, forms, and sectioned content."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<Frame>
					<FramePanel>
						<FrameHeader>
							<FrameTitle>Account Settings</FrameTitle>
							<FrameDescription>Manage your account preferences.</FrameDescription>
						</FrameHeader>
						<div className="text-sm text-fg-muted">Content goes here.</div>
					</FramePanel>
				</Frame>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A frame with a single panel containing a header and content."
					code={`<Frame>
  <FramePanel>
    <FrameHeader>
      <FrameTitle>Account Settings</FrameTitle>
      <FrameDescription>Manage your account preferences.</FrameDescription>
    </FrameHeader>
    <p>Content goes here.</p>
  </FramePanel>
</Frame>`}
				>
					<Frame>
						<FramePanel>
							<FrameHeader>
								<FrameTitle>Account Settings</FrameTitle>
								<FrameDescription>Manage your account preferences.</FrameDescription>
							</FrameHeader>
							<div className="text-sm text-fg-muted">Content goes here.</div>
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					title="Multiple Panels"
					description="Multiple panels inside a frame with automatic gap."
					code={`<Frame>
  <FramePanel>
    <FrameHeader>
      <FrameTitle>Profile</FrameTitle>
    </FrameHeader>
    <Input placeholder="Full name" />
  </FramePanel>
  <FramePanel>
    <FrameHeader>
      <FrameTitle>Email</FrameTitle>
    </FrameHeader>
    <Input placeholder="email@example.com" />
  </FramePanel>
</Frame>`}
				>
					<Frame>
						<FramePanel>
							<FrameHeader>
								<FrameTitle>Profile</FrameTitle>
							</FrameHeader>
							<Input placeholder="Full name" />
						</FramePanel>
						<FramePanel>
							<FrameHeader>
								<FrameTitle>Email</FrameTitle>
							</FrameHeader>
							<Input placeholder="email@example.com" />
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					title="Stacked"
					description="Panels merge together with shared borders for a compact, continuous layout."
					code={`<Frame stacked>
  <FramePanel>
    <FrameHeader>
      <FrameTitle>General</FrameTitle>
      <FrameDescription>Basic application settings.</FrameDescription>
    </FrameHeader>
  </FramePanel>
  <FramePanel>
    <FrameHeader>
      <FrameTitle>Notifications</FrameTitle>
      <FrameDescription>Configure email and push notifications.</FrameDescription>
    </FrameHeader>
  </FramePanel>
  <FramePanel>
    <FrameHeader>
      <FrameTitle>Danger Zone</FrameTitle>
      <FrameDescription>Irreversible actions.</FrameDescription>
    </FrameHeader>
  </FramePanel>
</Frame>`}
				>
					<Frame stacked>
						<FramePanel>
							<FrameHeader>
								<FrameTitle>General</FrameTitle>
								<FrameDescription>Basic application settings.</FrameDescription>
							</FrameHeader>
						</FramePanel>
						<FramePanel>
							<FrameHeader>
								<FrameTitle>Notifications</FrameTitle>
								<FrameDescription>Configure email and push notifications.</FrameDescription>
							</FrameHeader>
						</FramePanel>
						<FramePanel>
							<FrameHeader>
								<FrameTitle>Danger Zone</FrameTitle>
								<FrameDescription>Irreversible actions.</FrameDescription>
							</FrameHeader>
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					title="With Footer"
					description="Panels with a footer for actions."
					code={`<Frame>
  <FramePanel>
    <FrameHeader>
      <FrameTitle>Display Name</FrameTitle>
      <FrameDescription>This is your public display name.</FrameDescription>
    </FrameHeader>
    <Input defaultValue="Jean Dupont" />
    <FrameFooter>
      <Button className="self-end">Save</Button>
    </FrameFooter>
  </FramePanel>
</Frame>`}
				>
					<Frame>
						<FramePanel>
							<FrameHeader>
								<FrameTitle>Display Name</FrameTitle>
								<FrameDescription>This is your public display name.</FrameDescription>
							</FrameHeader>
							<Input defaultValue="Jean Dupont" />
							<FrameFooter>
								<Button className="self-end">Save</Button>
							</FrameFooter>
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					title="Spacing Variants"
					description="Control inner padding with the spacing prop."
					code={`<Frame spacing="xs">...</Frame>
<Frame spacing="sm">...</Frame>
<Frame spacing="default">...</Frame>
<Frame spacing="lg">...</Frame>`}
				>
					<div className="grid gap-4 sm:grid-cols-2">
						{(["xs", "sm", "default", "lg"] as const).map((size) => (
							<Frame key={size} spacing={size}>
								<FramePanel>
									<FrameHeader>
										<FrameTitle>spacing=&quot;{size}&quot;</FrameTitle>
										<FrameDescription>Content padding scales with spacing.</FrameDescription>
									</FrameHeader>
								</FramePanel>
							</Frame>
						))}
					</div>
				</DocExample>

				<DocExample
					title="Ghost Variant"
					description="No outer border or background — panels float freely."
					code={`<Frame variant="ghost">
  <FramePanel>
    <FrameHeader>
      <FrameTitle>Floating Panel</FrameTitle>
    </FrameHeader>
  </FramePanel>
</Frame>`}
				>
					<Frame variant="ghost">
						<FramePanel>
							<FrameHeader>
								<FrameTitle>Floating Panel</FrameTitle>
								<FrameDescription>No frame border, just the panel.</FrameDescription>
							</FrameHeader>
						</FramePanel>
					</Frame>
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable
					groups={[
						{ title: "Frame", props: frameProps },
						{ title: "FramePanel", props: panelProps },
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
