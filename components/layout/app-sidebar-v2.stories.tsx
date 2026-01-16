import type { Meta, StoryObj } from "@storybook/react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { sidebarConfig } from "@/config/navigation"
import { AppSidebarV2 } from "./app-sidebar-v2"

const meta = {
	title: "Layout/AppSidebar V2",
	component: AppSidebarV2,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<SidebarProvider defaultOpen>
				<div className="flex h-screen w-full">
					<Story />
					<SidebarInset>
						<div className="flex flex-1 flex-col gap-4 p-4">
							<div className="flex h-12 items-center gap-2 rounded-lg border px-4">
								<h1 className="text-lg font-semibold">Main Content Area</h1>
							</div>
							<div className="flex-1 rounded-lg border p-4">
								<h2 className="mb-4 text-xl font-semibold">AppSidebar V2 Features</h2>
								<ul className="space-y-2 text-sm">
									<li>✅ Integrated search functionality</li>
									<li>✅ Multi-level navigation (recursive)</li>
									<li>✅ Collapsible sections</li>
									<li>✅ Badge variants (default, destructive, outline, secondary)</li>
									<li>✅ User profile menu in footer</li>
									<li>✅ Logo support</li>
									<li>✅ Active state highlighting</li>
									<li>✅ Icon support</li>
									<li>✅ Responsive design</li>
									<li>✅ Keyboard shortcuts (Cmd/Ctrl + B)</li>
									<li>✅ Shopify Polaris-inspired design</li>
								</ul>
							</div>
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		),
	],
} satisfies Meta<typeof AppSidebarV2>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Full featured sidebar with all options enabled
 */
export const Complete: Story = {
	args: {
		config: sidebarConfig,
	},
}

/**
 * Sidebar without search
 */
export const WithoutSearch: Story = {
	args: {
		config: {
			...sidebarConfig,
			searchEnabled: false,
		},
	},
}

/**
 * Sidebar without user menu
 */
export const WithoutUser: Story = {
	args: {
		config: {
			...sidebarConfig,
			user: undefined,
		},
	},
}

/**
 * Minimal sidebar with only navigation
 */
export const Minimal: Story = {
	args: {
		config: {
			navigation: [
				{
					title: "Navigation",
					items: [
						{
							title: "Dashboard",
							url: "/dashboard",
						},
						{
							title: "Settings",
							url: "/settings",
						},
					],
				},
			],
		},
	},
}

/**
 * Sidebar with badges showcase
 */
export const BadgesShowcase: Story = {
	args: {
		config: {
			...sidebarConfig,
			navigation: [
				{
					title: "Badge Variants",
					items: [
						{
							title: "Default Badge",
							url: "/default",
							badge: 5,
						},
						{
							title: "Destructive Badge",
							url: "/destructive",
							badge: 3,
							badgeVariant: "destructive",
						},
						{
							title: "Secondary Badge",
							url: "/secondary",
							badge: 10,
							badgeVariant: "secondary",
						},
						{
							title: "Outline Badge",
							url: "/outline",
							badge: 2,
							badgeVariant: "outline",
						},
					],
				},
			],
		},
	},
}
