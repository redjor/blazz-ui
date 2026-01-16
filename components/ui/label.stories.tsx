import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "./label"
import { Input } from "./input"
import { Checkbox } from "./checkbox"
import { Switch } from "./switch"

const meta = {
	title: "UI/Label",
	component: Label,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		htmlFor: {
			control: "text",
			description: "ID of the form element this label is associated with",
		},
		children: {
			control: "text",
			description: "Label text content",
		},
	},
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default label with interactive controls.
 */
export const Default: Story = {
	args: {
		children: "Label Text",
	},
}

/**
 * Labels paired with different form controls they typically accompany.
 */
export const WithFormControls: Story = {
	render: () => (
		<div className="flex flex-col gap-6 w-[400px]">
			<div>
				<h3 className="text-sm font-semibold mb-4">With Input</h3>
				<div className="flex flex-col gap-2">
					<Label htmlFor="username">Username</Label>
					<Input id="username" placeholder="Enter your username" />
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">With Checkbox</h3>
				<div className="flex items-center gap-2">
					<Checkbox id="terms" />
					<Label htmlFor="terms">Accept terms and conditions</Label>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">With Switch</h3>
				<div className="flex items-center gap-2">
					<Switch id="notifications" />
					<Label htmlFor="notifications">Enable notifications</Label>
				</div>
			</div>
		</div>
	),
}

/**
 * Different label states including default and disabled.
 */
export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-6 w-[400px]">
			<div>
				<h3 className="text-sm font-semibold mb-4">Default</h3>
				<div className="flex flex-col gap-2">
					<Label htmlFor="normal">Normal Label</Label>
					<Input id="normal" placeholder="Normal input" />
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">Disabled (with peer)</h3>
				<div className="flex flex-col gap-2">
					<Label htmlFor="disabled">Disabled Label</Label>
					<Input id="disabled" placeholder="Disabled input" disabled />
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">With Required Indicator</h3>
				<div className="flex flex-col gap-2">
					<Label htmlFor="required">
						Email <span className="text-destructive">*</span>
					</Label>
					<Input id="required" type="email" placeholder="name@example.com" required />
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">With Help Text</h3>
				<div className="flex flex-col gap-2">
					<Label htmlFor="help">Password</Label>
					<Input id="help" type="password" placeholder="••••••••" />
					<p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
				</div>
			</div>
		</div>
	),
}

/**
 * Common label compositions and form patterns.
 */
export const Composition: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Form Fields</h3>
				<form className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="name">
							Full Name <span className="text-destructive">*</span>
						</Label>
						<Input id="name" placeholder="John Doe" required />
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="email">
							Email <span className="text-destructive">*</span>
						</Label>
						<Input id="email" type="email" placeholder="john@example.com" required />
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="bio">Bio</Label>
						<Input id="bio" placeholder="Tell us about yourself" />
						<p className="text-xs text-muted-foreground">Optional field</p>
					</div>
				</form>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Inline Labels</h3>
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Checkbox id="option1" />
						<Label htmlFor="option1">Option 1</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="option2" />
						<Label htmlFor="option2">Option 2</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="option3" />
						<Label htmlFor="option3">Option 3</Label>
					</div>
				</div>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Label with Description</h3>
				<div className="flex flex-col gap-2">
					<div>
						<Label htmlFor="api-key">API Key</Label>
						<p className="text-xs text-muted-foreground mt-1">
							Your API key is used to authenticate requests
						</p>
					</div>
					<Input id="api-key" type="password" placeholder="sk_..." />
				</div>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Settings Toggle</h3>
				<div className="flex items-center justify-between rounded-lg border p-4">
					<div className="flex flex-col gap-1">
						<Label htmlFor="marketing">Marketing emails</Label>
						<p className="text-xs text-muted-foreground">
							Receive emails about new products and features
						</p>
					</div>
					<Switch id="marketing" />
				</div>
			</div>
		</div>
	),
}

/**
 * Label in dark mode.
 */
export const DarkMode: Story = {
	parameters: {
		backgrounds: { default: "dark" },
	},
	decorators: [
		(Story) => (
			<div className="dark">
				<Story />
			</div>
		),
	],
	render: () => (
		<div className="flex flex-col gap-4 w-[400px]">
			<div className="flex flex-col gap-2">
				<Label htmlFor="dark-name">Name</Label>
				<Input id="dark-name" placeholder="Enter your name" />
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="dark-email">Email</Label>
				<Input id="dark-email" type="email" placeholder="name@example.com" />
			</div>
			<div className="flex items-center gap-2">
				<Checkbox id="dark-terms" />
				<Label htmlFor="dark-terms">I agree to the terms</Label>
			</div>
		</div>
	),
}
