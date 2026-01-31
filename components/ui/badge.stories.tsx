import type { Meta, StoryObj } from "@storybook/react"
import { Check, X, AlertCircle, Star, Zap, Crown } from "lucide-react"
import { Badge, badgeVariants } from "./badge"

// Extract variant options from CVA
const variantOptions = Object.keys(badgeVariants.variants?.variant || {})

const meta = {
	title: "UI/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: variantOptions,
			description: "Visual style variant of the badge",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "default" },
			},
		},
		children: {
			control: "text",
			description: "Badge content (text, numbers, or icons)",
		},
	},
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default badge with interactive controls.
 */
export const Default: Story = {
	args: {
		children: "Badge",
		variant: "default",
	},
}

/**
 * All available badge variants displayed side-by-side for comparison.
 */
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Badge variant="default">Default</Badge>
			<Badge variant="info">Secondary</Badge>
			<Badge variant="critical">Destructive</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="ghost">Ghost</Badge>
			<Badge variant="link">Link</Badge>
		</div>
	),
}

/**
 * Badges with icons to enhance meaning and visual appeal.
 */
export const WithIcons: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-sm font-semibold mb-2">Icon Before Text</h3>
				<div className="flex flex-wrap gap-4">
					<Badge variant="default">
						<Check />
						Verified
					</Badge>
					<Badge variant="info">
						<Star />
						Featured
					</Badge>
					<Badge variant="critical">
						<X />
						Error
					</Badge>
					<Badge variant="outline">
						<AlertCircle />
						Warning
					</Badge>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-2">Icon After Text</h3>
				<div className="flex flex-wrap gap-4">
					<Badge variant="default">
						Premium
						<Crown />
					</Badge>
					<Badge variant="info">
						Fast
						<Zap />
					</Badge>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-2">Icon Only</h3>
				<div className="flex flex-wrap gap-4">
					<Badge variant="default">
						<Check />
					</Badge>
					<Badge variant="info">
						<Star />
					</Badge>
					<Badge variant="critical">
						<X />
					</Badge>
					<Badge variant="outline">
						<AlertCircle />
					</Badge>
				</div>
			</div>
		</div>
	),
}

/**
 * Badges displaying numeric values and counts.
 */
export const WithNumbers: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-sm font-semibold mb-2">Notification Counts</h3>
				<div className="flex flex-wrap gap-4">
					<Badge variant="default">3</Badge>
					<Badge variant="critical">99+</Badge>
					<Badge variant="info">12</Badge>
					<Badge variant="outline">5</Badge>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-2">Stats</h3>
				<div className="flex flex-wrap gap-4">
					<Badge variant="default">+12.5%</Badge>
					<Badge variant="critical">-3.2%</Badge>
					<Badge variant="info">42 items</Badge>
					<Badge variant="outline">$99.00</Badge>
				</div>
			</div>
		</div>
	),
}

/**
 * Common badge use cases and compositions.
 */
export const Composition: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			<div>
				<h3 className="text-sm font-semibold mb-4">Status Indicators</h3>
				<div className="flex flex-wrap gap-4">
					<Badge variant="default">
						<Check />
						Active
					</Badge>
					<Badge variant="info">Pending</Badge>
					<Badge variant="critical">
						<X />
						Failed
					</Badge>
					<Badge variant="outline">Draft</Badge>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">Product Tags</h3>
				<div className="flex flex-wrap gap-2">
					<Badge variant="info">Electronics</Badge>
					<Badge variant="info">Sale</Badge>
					<Badge variant="default">
						<Star />
						New
					</Badge>
					<Badge variant="outline">Limited Edition</Badge>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">User Roles</h3>
				<div className="flex flex-wrap gap-2">
					<Badge variant="default">
						<Crown />
						Admin
					</Badge>
					<Badge variant="info">Moderator</Badge>
					<Badge variant="outline">Member</Badge>
					<Badge variant="ghost">Guest</Badge>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">In Context (Card Header)</h3>
				<div className="rounded-lg border p-4 w-[400px]">
					<div className="flex items-center justify-between mb-2">
						<h4 className="font-semibold">Project Dashboard</h4>
						<Badge variant="default">
							<Check />
							Live
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">
						Your project is live and accepting users
					</p>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">With Button</h3>
				<div className="flex gap-4">
					<button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted">
						<span>Notifications</span>
						<Badge variant="critical">5</Badge>
					</button>
					<button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted">
						<span>Messages</span>
						<Badge variant="default">12</Badge>
					</button>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-4">Table Cell</h3>
				<div className="rounded-lg border">
					<table className="w-full">
						<thead className="border-b bg-muted/50">
							<tr>
								<th className="p-2 text-left text-sm font-medium">Name</th>
								<th className="p-2 text-left text-sm font-medium">Status</th>
								<th className="p-2 text-left text-sm font-medium">Role</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b">
								<td className="p-2 text-sm">John Doe</td>
								<td className="p-2">
									<Badge variant="default">
										<Check />
										Active
									</Badge>
								</td>
								<td className="p-2">
									<Badge variant="info">Admin</Badge>
								</td>
							</tr>
							<tr className="border-b">
								<td className="p-2 text-sm">Jane Smith</td>
								<td className="p-2">
									<Badge variant="info">Pending</Badge>
								</td>
								<td className="p-2">
									<Badge variant="outline">Member</Badge>
								</td>
							</tr>
							<tr>
								<td className="p-2 text-sm">Bob Johnson</td>
								<td className="p-2">
									<Badge variant="critical">
										<X />
										Suspended
									</Badge>
								</td>
								<td className="p-2">
									<Badge variant="outline">Member</Badge>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	),
}

/**
 * Badge variants in dark mode.
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
			<Badge variant="default">Default</Badge>
			<Badge variant="info">Secondary</Badge>
			<Badge variant="critical">Destructive</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="ghost">Ghost</Badge>
			<Badge variant="link">Link</Badge>
		</div>
	),
}
