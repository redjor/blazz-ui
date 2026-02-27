import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import {
	Frame,
	FramePanel,
	FrameHeader,
	FrameTitle,
	FrameDescription,
	FrameFooter,
} from "@blazz/ui/components/ui/frame-panel"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "default",
		code: `<Frame>
  <FrameHeader>
    <FrameTitle>Account Settings</FrameTitle>
    <FrameDescription>Manage your account preferences.</FrameDescription>
  </FrameHeader>
  <FramePanel>
    <p>Content goes here.</p>
  </FramePanel>
</Frame>`,
	},
	{
		key: "multiple-panels",
		code: `<Frame>
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
</Frame>`,
	},
	{
		key: "stacked",
		code: `<Frame stacked>
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
</Frame>`,
	},
	{
		key: "with-footer",
		code: `<Frame>
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
</Frame>`,
	},
	{
		key: "spacing",
		code: `<Frame spacing="xs">...</Frame>
<Frame spacing="sm">...</Frame>
<Frame spacing="default">...</Frame>
<Frame spacing="lg">...</Frame>`,
	},
	{
		key: "ghost",
		code: `<Frame variant="ghost">
  <FrameHeader>
    <FrameTitle>Floating Panel</FrameTitle>
    <FrameDescription>No frame border, just the panel.</FrameDescription>
  </FrameHeader>
  <FramePanel>
    <div>Panel content here.</div>
  </FramePanel>
</Frame>`,
	},
	{
		key: "dense",
		code: `<Frame dense stacked>
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
</Frame>`,
	},
	{
		key: "custom-radius",
		code: `<Frame className="[--frame-radius:var(--radius-sm)]">
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
</Frame>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/frame-panel")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: FramePanelPage,
})

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

function FramePanelPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Frame"
			subtitle="A container that groups related panels with consistent spacing, borders, and visual hierarchy. Use it for settings pages, forms, and sectioned content."
			toc={toc}
		>
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

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					previewClassName="bg-raised"
					title="Default"
					description="A frame with a header and a panel. The header sits outside the panel."
					code={examples[0].code}
					highlightedCode={html("default")}
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
				</DocExampleClient>

				<DocExampleClient
					previewClassName="bg-raised"
					title="Multiple Panels"
					description="Multiple content panels sharing a header inside a single frame."
					code={examples[1].code}
					highlightedCode={html("multiple-panels")}
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
				</DocExampleClient>

				<DocExampleClient
					previewClassName="bg-raised"
					title="Stacked"
					description="Panels merge together with shared borders for a compact, continuous layout."
					code={examples[2].code}
					highlightedCode={html("stacked")}
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
				</DocExampleClient>

				<DocExampleClient
					previewClassName="bg-raised"
					title="With Footer"
					description="A header outside the panel, with content and a footer inside."
					code={examples[3].code}
					highlightedCode={html("with-footer")}
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
				</DocExampleClient>

				<DocExampleClient
					previewClassName="bg-raised"
					title="Spacing Variants"
					description="Control inner padding with the spacing prop."
					code={examples[4].code}
					highlightedCode={html("spacing")}
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
				</DocExampleClient>

				<DocExampleClient
					previewClassName="bg-raised"
					title="Ghost Variant"
					description="No outer border or background — panels float freely."
					code={examples[5].code}
					highlightedCode={html("ghost")}
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
				</DocExampleClient>

				<DocExampleClient
					previewClassName="bg-raised"
					title="Dense"
					description="Removes outer padding so panels sit flush against the frame border."
					code={examples[6].code}
					highlightedCode={html("dense")}
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
				</DocExampleClient>

				<DocExampleClient
					previewClassName="bg-raised"
					title="Custom Radius"
					description="Override the border radius via the --frame-radius CSS variable."
					code={examples[7].code}
					highlightedCode={html("custom-radius")}
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
				</DocExampleClient>
			</DocSection>

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
