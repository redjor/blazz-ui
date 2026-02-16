import type { Meta, StoryObj } from "@storybook/react"
import { ChevronRight, Download, Plus, Trash } from "lucide-react"
import { Button, buttonVariants } from "./button"

// Extract variant options from CVA
const variantOptions = Object.keys(buttonVariants.variants?.variant || {})
const sizeOptions = Object.keys(buttonVariants.variants?.size || {})

const meta = {
	title: "UI/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: variantOptions,
			description: "Visual style variant of the button",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "default" },
			},
		},
		size: {
			control: "select",
			options: sizeOptions,
			description: "Size of the button",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "default" },
			},
		},
		disabled: {
			control: "boolean",
			description: "Disables the button and prevents interaction",
		},
		children: {
			control: "text",
			description: "Button content (text, icons, or elements)",
		},
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default button with interactive controls. Use the controls panel to experiment with different props.
 */
export const Default: Story = {
	args: {
		children: "Button",
		variant: "default",
		size: "default",
	},
}

/**
 * All available button variants displayed side-by-side for easy comparison.
 */
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Button variant="default">Default</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="link">Link</Button>
		</div>
	),
}

/**
 * All available button sizes including regular and icon-only variants.
 */
export const AllSizes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-sm font-semibold mb-2">Text Buttons</h3>
				<div className="flex items-end gap-4">
					<Button size="xs">Extra Small</Button>
					<Button size="sm">Small</Button>
					<Button size="default">Default</Button>
					<Button size="lg">Large</Button>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Icon Buttons</h3>
				<div className="flex items-end gap-4">
					<Button size="icon-xs">
						<Plus />
					</Button>
					<Button size="icon-sm">
						<Plus />
					</Button>
					<Button size="icon">
						<Plus />
					</Button>
					<Button size="icon-lg">
						<Plus />
					</Button>
				</div>
			</div>
		</div>
	),
}

/**
 * Different button states including default, hover, focus, and disabled.
 * Hover over buttons to see their hover states.
 */
export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-sm font-semibold mb-2">Default State</h3>
				<Button>Normal Button</Button>
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Disabled State</h3>
				<Button disabled>Disabled Button</Button>
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">With aria-expanded</h3>
				<Button aria-expanded={true}>Expanded Button</Button>
			</div>
		</div>
	),
}

/**
 * Buttons with icons positioned before or after text content.
 */
export const WithIcons: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div>
				<h3 className="text-sm font-semibold mb-2">Icon Start</h3>
				<div className="flex gap-4">
					<Button>
						<Plus />
						Create New
					</Button>
					<Button variant="outline">
						<Download />
						Download
					</Button>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Icon End</h3>
				<div className="flex gap-4">
					<Button>
						Next
						<ChevronRight />
					</Button>
					<Button variant="secondary">
						Continue
						<ChevronRight />
					</Button>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Icon Only</h3>
				<div className="flex gap-4">
					<Button size="icon">
						<Plus />
					</Button>
					<Button size="icon" variant="outline">
						<Download />
					</Button>
					<Button size="icon" variant="destructive">
						<Trash />
					</Button>
				</div>
			</div>
		</div>
	),
}

/**
 * Real-world button compositions and common use cases.
 */
export const Composition: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-sm font-semibold mb-2">Form Actions</h3>
				<div className="flex gap-2">
					<Button variant="outline">Cancel</Button>
					<Button>Save Changes</Button>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Toolbar</h3>
				<div className="flex gap-1 rounded-lg border p-1">
					<Button size="sm" variant="ghost">
						<Plus />
						New
					</Button>
					<Button size="sm" variant="ghost">
						<Download />
						Export
					</Button>
					<Button size="sm" variant="ghost">
						<Trash />
						Delete
					</Button>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Call to Action</h3>
				<div className="flex flex-col gap-2 rounded-lg border p-4">
					<h4 className="font-semibold">Ready to get started?</h4>
					<p className="text-sm text-fg-muted">
						Join thousands of users already using our platform.
					</p>
					<div className="flex gap-2 mt-2">
						<Button>
							<Plus />
							Sign Up Free
						</Button>
						<Button variant="outline">Learn More</Button>
					</div>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Destructive Actions</h3>
				<div className="flex flex-col gap-2 rounded-lg border border-destructive/20 p-4">
					<h4 className="font-semibold">Delete Account</h4>
					<p className="text-sm text-fg-muted">
						This action cannot be undone. This will permanently delete your account.
					</p>
					<div className="flex gap-2 mt-2">
						<Button variant="destructive">
							<Trash />
							Delete Account
						</Button>
						<Button variant="outline">Cancel</Button>
					</div>
				</div>
			</div>
		</div>
	),
}

/**
 * Button variants in dark mode. Toggle the background in the toolbar to see the dark theme.
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
		<div className="flex flex-wrap gap-4">
			<Button variant="default">Default</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="link">Link</Button>
		</div>
	),
}
