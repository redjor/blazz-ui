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
		description: "Panel content. Use FrameFooter for actions at the bottom.",
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
					<FrameHeader>
						<FrameTitle>Account Settings</FrameTitle>
						<FrameDescription>Manage your account preferences.</FrameDescription>
					</FrameHeader>
					<FramePanel>
						<div className="text-sm text-fg-muted">Content goes here.</div>
					</FramePanel>
				</Frame>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					previewClassName="bg-raised"
					title="Default"
					description="A frame with a header and a panel. The header sits outside the panel."
					code={`<Frame>
  <FrameHeader>
    <FrameTitle>Account Settings</FrameTitle>
    <FrameDescription>Manage your account preferences.</FrameDescription>
  </FrameHeader>
  <FramePanel>
    <p>Content goes here.</p>
  </FramePanel>
</Frame>`}
				>
					<Frame>
						<FrameHeader>
							<FrameTitle>Account Settings</FrameTitle>
							<FrameDescription>Manage your account preferences.</FrameDescription>
						</FrameHeader>
						<FramePanel>
							<div className="text-sm text-fg-muted">Content goes here.</div>
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					previewClassName="bg-raised"
					title="Multiple Panels"
					description="Multiple content panels sharing a header inside a single frame."
					code={`<Frame>
  <FrameHeader>
    <FrameTitle>Profile</FrameTitle>
    <FrameDescription>Your personal information.</FrameDescription>
  </FrameHeader>
  <FramePanel>
    <Input placeholder="Full name" />
  </FramePanel>
  <FramePanel>
    <Input placeholder="email@example.com" />
  </FramePanel>
</Frame>`}
				>
					<Frame>
						<FrameHeader>
							<FrameTitle>Profile</FrameTitle>
							<FrameDescription>Your personal information.</FrameDescription>
						</FrameHeader>
						<FramePanel>
							<Input placeholder="Full name" />
						</FramePanel>
						<FramePanel>
							<Input placeholder="email@example.com" />
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					previewClassName="bg-raised"
					title="Stacked"
					description="Panels merge together with shared borders for a compact, continuous layout."
					code={`<Frame stacked>
  <FramePanel>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">General</div>
        <div className="text-sm text-fg-muted">Basic application settings.</div>
      </div>
    </div>
  </FramePanel>
  <FramePanel>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">Notifications</div>
        <div className="text-sm text-fg-muted">Configure email and push notifications.</div>
      </div>
    </div>
  </FramePanel>
  <FramePanel>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">Danger Zone</div>
        <div className="text-sm text-fg-muted">Irreversible actions.</div>
      </div>
    </div>
  </FramePanel>
</Frame>`}
				>
					<Frame stacked>
						<FramePanel>
							<div className="flex items-center justify-between">
								<div>
									<div className="text-sm font-medium">General</div>
									<div className="text-sm text-fg-muted">Basic application settings.</div>
								</div>
							</div>
						</FramePanel>
						<FramePanel>
							<div className="flex items-center justify-between">
								<div>
									<div className="text-sm font-medium">Notifications</div>
									<div className="text-sm text-fg-muted">Configure email and push notifications.</div>
								</div>
							</div>
						</FramePanel>
						<FramePanel>
							<div className="flex items-center justify-between">
								<div>
									<div className="text-sm font-medium">Danger Zone</div>
									<div className="text-sm text-fg-muted">Irreversible actions.</div>
								</div>
							</div>
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					previewClassName="bg-raised"
					title="With Footer"
					description="A header outside the panel, with content and a footer inside."
					code={`<Frame>
  <FrameHeader>
    <FrameTitle>Display Name</FrameTitle>
    <FrameDescription>This is your public display name.</FrameDescription>
  </FrameHeader>
  <FramePanel>
    <Input defaultValue="Jean Dupont" />
    <FrameFooter>
      <Button className="self-end">Save</Button>
    </FrameFooter>
  </FramePanel>
</Frame>`}
				>
					<Frame>
						<FrameHeader>
							<FrameTitle>Display Name</FrameTitle>
							<FrameDescription>This is your public display name.</FrameDescription>
						</FrameHeader>
						<FramePanel>
							<Input defaultValue="Jean Dupont" />
							<FrameFooter>
								<Button className="self-end">Save</Button>
							</FrameFooter>
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					previewClassName="bg-raised"
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
								<FrameHeader>
									<FrameTitle>spacing=&quot;{size}&quot;</FrameTitle>
									<FrameDescription>Content padding scales with spacing.</FrameDescription>
								</FrameHeader>
								<FramePanel>
									<div className="text-sm text-fg-muted">Panel content.</div>
								</FramePanel>
							</Frame>
						))}
					</div>
				</DocExample>

				<DocExample
					previewClassName="bg-raised"
					title="Ghost Variant"
					description="No outer border or background — panels float freely."
					code={`<Frame variant="ghost">
  <FrameHeader>
    <FrameTitle>Floating Panel</FrameTitle>
    <FrameDescription>No frame border, just the panel.</FrameDescription>
  </FrameHeader>
  <FramePanel>
    <div>Panel content here.</div>
  </FramePanel>
</Frame>`}
				>
					<Frame variant="ghost">
						<FrameHeader>
							<FrameTitle>Floating Panel</FrameTitle>
							<FrameDescription>No frame border, just the panel.</FrameDescription>
						</FrameHeader>
						<FramePanel>
							<div className="text-sm text-fg-muted">Panel content here.</div>
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					previewClassName="bg-raised"
					title="Dense"
					description="Removes outer padding so panels sit flush against the frame border."
					code={`<Frame dense stacked>
  <FramePanel>
    <div className="space-y-1.5">
      <label className="text-sm font-medium">Display Name</label>
      <Input defaultValue="Jean Dupont" />
    </div>
    <FrameFooter>
      <Button className="self-end">Save</Button>
    </FrameFooter>
  </FramePanel>
  <FramePanel>
    <div className="space-y-1.5">
      <label className="text-sm font-medium">Email Address</label>
      <Input defaultValue="jean@example.com" />
    </div>
    <FrameFooter>
      <Button className="self-end">Save</Button>
    </FrameFooter>
  </FramePanel>
</Frame>`}
				>
					<Frame dense stacked>
						<FramePanel>
							<div className="space-y-1.5">
								<label className="text-sm font-medium">Display Name</label>
								<Input defaultValue="Jean Dupont" />
							</div>
							<FrameFooter>
								<Button className="self-end">Save</Button>
							</FrameFooter>
						</FramePanel>
						<FramePanel>
							<div className="space-y-1.5">
								<label className="text-sm font-medium">Email Address</label>
								<Input defaultValue="jean@example.com" />
							</div>
							<FrameFooter>
								<Button className="self-end">Save</Button>
							</FrameFooter>
						</FramePanel>
					</Frame>
				</DocExample>

				<DocExample
					previewClassName="bg-raised"
					title="Custom Radius"
					description="Override the border radius via the --frame-radius CSS variable."
					code={`<Frame className="[--frame-radius:var(--radius-sm)]">
  <FrameHeader>
    <FrameTitle>Small Radius</FrameTitle>
  </FrameHeader>
  <FramePanel>
    <div>Panel content.</div>
  </FramePanel>
</Frame>

<Frame className="[--frame-radius:var(--radius-2xl)]">
  <FrameHeader>
    <FrameTitle>Large Radius</FrameTitle>
  </FrameHeader>
  <FramePanel>
    <div>Panel content.</div>
  </FramePanel>
</Frame>`}
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<Frame className="[--frame-radius:var(--radius-sm)]">
							<FrameHeader>
								<FrameTitle>Small Radius</FrameTitle>
								<FrameDescription>--frame-radius: var(--radius-sm)</FrameDescription>
							</FrameHeader>
							<FramePanel>
								<div className="text-sm text-fg-muted">Panel content.</div>
							</FramePanel>
						</Frame>
						<Frame className="[--frame-radius:var(--radius-2xl)]">
							<FrameHeader>
								<FrameTitle>Large Radius</FrameTitle>
								<FrameDescription>--frame-radius: var(--radius-2xl)</FrameDescription>
							</FrameHeader>
							<FramePanel>
								<div className="text-sm text-fg-muted">Panel content.</div>
							</FramePanel>
						</Frame>
					</div>
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
