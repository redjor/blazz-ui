import type { Meta, StoryObj } from "@storybook/react"
import { Skeleton } from "./skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card"

const meta = {
	title: "UI/Skeleton",
	component: Skeleton,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		className: {
			control: "text",
			description: "Additional CSS classes for custom sizing and styling",
		},
	},
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default skeleton with basic sizing.
 */
export const Default: Story = {
	render: () => <Skeleton className="h-12 w-[250px]" />,
}

/**
 * Different skeleton shapes and sizes for various use cases.
 */
export const Shapes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-sm font-semibold mb-2">Lines (Text)</h3>
				<div className="flex flex-col gap-2 w-[400px]">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-[90%]" />
					<Skeleton className="h-4 w-[80%]" />
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-2">Blocks</h3>
				<div className="flex flex-wrap gap-4">
					<Skeleton className="h-12 w-12" />
					<Skeleton className="h-16 w-16" />
					<Skeleton className="h-24 w-24" />
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-2">Circles (Avatars)</h3>
				<div className="flex gap-4">
					<Skeleton className="h-8 w-8 rounded-full" />
					<Skeleton className="h-10 w-10 rounded-full" />
					<Skeleton className="h-12 w-12 rounded-full" />
					<Skeleton className="h-16 w-16 rounded-full" />
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-2">Buttons</h3>
				<div className="flex gap-4">
					<Skeleton className="h-8 w-20 rounded-lg" />
					<Skeleton className="h-8 w-24 rounded-lg" />
					<Skeleton className="h-9 w-32 rounded-lg" />
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-2">Images</h3>
				<div className="flex gap-4">
					<Skeleton className="h-32 w-32 rounded-lg" />
					<Skeleton className="h-48 w-64 rounded-lg" />
				</div>
			</div>
		</div>
	),
}

/**
 * Complete skeleton layouts for common UI patterns.
 */
export const Compositions: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Card Loading</h3>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-[200px] mb-2" />
						<Skeleton className="h-4 w-[300px]" />
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-[90%]" />
							<Skeleton className="h-4 w-[80%]" />
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">User Profile Loading</h3>
				<div className="flex items-start gap-4 rounded-lg border p-4">
					<Skeleton className="h-12 w-12 rounded-full shrink-0" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-[150px]" />
						<Skeleton className="h-3 w-[200px]" />
						<Skeleton className="h-3 w-[100px]" />
					</div>
				</div>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">List Loading</h3>
				<div className="flex flex-col gap-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-center gap-4 rounded-lg border p-3">
							<Skeleton className="h-10 w-10 rounded-full shrink-0" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-[60%]" />
								<Skeleton className="h-3 w-[40%]" />
							</div>
							<Skeleton className="h-8 w-8 rounded" />
						</div>
					))}
				</div>
			</div>

			<div className="w-[600px]">
				<h3 className="text-sm font-semibold mb-4">Table Loading</h3>
				<div className="rounded-lg border">
					<div className="border-b bg-raised/50 p-3">
						<div className="flex gap-4">
							<Skeleton className="h-4 w-[30%]" />
							<Skeleton className="h-4 w-[25%]" />
							<Skeleton className="h-4 w-[20%]" />
							<Skeleton className="h-4 w-[15%]" />
						</div>
					</div>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="border-b last:border-0 p-3">
							<div className="flex gap-4">
								<Skeleton className="h-4 w-[30%]" />
								<Skeleton className="h-4 w-[25%]" />
								<Skeleton className="h-4 w-[20%]" />
								<Skeleton className="h-4 w-[15%]" />
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Form Loading</h3>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-[80px]" />
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-[120px]" />
						<Skeleton className="h-24 w-full rounded-lg" />
					</div>
					<Skeleton className="h-10 w-[120px] rounded-lg" />
				</div>
			</div>

			<div className="w-[600px]">
				<h3 className="text-sm font-semibold mb-4">Product Grid Loading</h3>
				<div className="grid grid-cols-3 gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="rounded-lg border overflow-hidden">
							<Skeleton className="h-32 w-full rounded-none" />
							<div className="p-3 space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-3 w-[60%]" />
								<Skeleton className="h-6 w-[40%]" />
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Article Loading</h3>
				<div className="flex flex-col gap-4">
					<Skeleton className="h-48 w-full rounded-lg" />
					<Skeleton className="h-8 w-[80%]" />
					<div className="flex items-center gap-2">
						<Skeleton className="h-6 w-6 rounded-full" />
						<Skeleton className="h-4 w-[120px]" />
						<Skeleton className="h-4 w-[80px]" />
					</div>
					<div className="space-y-2 mt-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-[90%]" />
						<Skeleton className="h-4 w-[95%]" />
					</div>
				</div>
			</div>
		</div>
	),
}

/**
 * Skeleton in dark mode.
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
			<Skeleton className="h-12 w-12 rounded-full" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-[90%]" />
			<Skeleton className="h-4 w-[80%]" />
			<div className="flex gap-2">
				<Skeleton className="h-8 w-20 rounded-lg" />
				<Skeleton className="h-8 w-24 rounded-lg" />
			</div>
		</div>
	),
}
