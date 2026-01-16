import type { Meta, StoryObj } from "@storybook/react"
import { Search, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Input } from "./input"
import { Label } from "./label"
import { Button } from "./button"

const meta = {
	title: "UI/Input",
	component: Input,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: [
				"text",
				"email",
				"password",
				"number",
				"tel",
				"url",
				"search",
				"date",
				"time",
				"file",
			],
			description: "HTML input type",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text displayed when input is empty",
		},
		disabled: {
			control: "boolean",
			description: "Disables the input and prevents interaction",
		},
		required: {
			control: "boolean",
			description: "Makes the input required in forms",
		},
	},
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default text input with interactive controls.
 */
export const Default: Story = {
	args: {
		type: "text",
		placeholder: "Enter text...",
	},
}

/**
 * All common input types displayed for comparison.
 */
export const AllTypes: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-[400px]">
			<div>
				<Label htmlFor="text">Text</Label>
				<Input id="text" type="text" placeholder="Enter text..." />
			</div>
			<div>
				<Label htmlFor="email">Email</Label>
				<Input id="email" type="email" placeholder="name@example.com" />
			</div>
			<div>
				<Label htmlFor="password">Password</Label>
				<Input id="password" type="password" placeholder="Enter password..." />
			</div>
			<div>
				<Label htmlFor="number">Number</Label>
				<Input id="number" type="number" placeholder="0" />
			</div>
			<div>
				<Label htmlFor="tel">Telephone</Label>
				<Input id="tel" type="tel" placeholder="+1 (555) 000-0000" />
			</div>
			<div>
				<Label htmlFor="url">URL</Label>
				<Input id="url" type="url" placeholder="https://example.com" />
			</div>
			<div>
				<Label htmlFor="search">Search</Label>
				<Input id="search" type="search" placeholder="Search..." />
			</div>
			<div>
				<Label htmlFor="date">Date</Label>
				<Input id="date" type="date" />
			</div>
			<div>
				<Label htmlFor="time">Time</Label>
				<Input id="time" type="time" />
			</div>
			<div>
				<Label htmlFor="file">File</Label>
				<Input id="file" type="file" />
			</div>
		</div>
	),
}

/**
 * Different input states including default, disabled, and invalid.
 */
export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-[400px]">
			<div>
				<h3 className="text-sm font-semibold mb-2">Default</h3>
				<Input placeholder="Normal input" />
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">With Value</h3>
				<Input defaultValue="Filled input" />
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Focused (click to focus)</h3>
				<Input placeholder="Click to see focus state" />
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Disabled</h3>
				<Input placeholder="Disabled input" disabled />
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Disabled with Value</h3>
				<Input defaultValue="Cannot edit" disabled />
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Invalid (aria-invalid)</h3>
				<Input placeholder="Invalid input" aria-invalid />
			</div>
			<div>
				<h3 className="text-sm font-semibold mb-2">Required</h3>
				<Input placeholder="Required field" required />
			</div>
		</div>
	),
}

/**
 * Inputs with icons for enhanced visual communication.
 */
export const WithIcons: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-[400px]">
			<div>
				<Label htmlFor="search-icon">Search with icon</Label>
				<div className="relative">
					<Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
					<Input id="search-icon" placeholder="Search..." className="pl-9" />
				</div>
			</div>
			<div>
				<Label htmlFor="email-icon">Email with icon</Label>
				<div className="relative">
					<Mail className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
					<Input id="email-icon" type="email" placeholder="name@example.com" className="pl-9" />
				</div>
			</div>
			<div>
				<Label htmlFor="password-icon">Password with toggle</Label>
				<PasswordToggle />
			</div>
		</div>
	),
}

/**
 * Input sizes and widths for different use cases.
 */
export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-sm font-semibold mb-2">Width Variants</h3>
				<div className="flex flex-col gap-2">
					<Input placeholder="Full width (w-full)" className="w-full" />
					<Input placeholder="Large (w-96)" className="w-96" />
					<Input placeholder="Medium (w-64)" className="w-64" />
					<Input placeholder="Small (w-48)" className="w-48" />
				</div>
			</div>
		</div>
	),
}

/**
 * Common form patterns and compositions with inputs.
 */
export const Composition: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Login Form</h3>
				<form className="flex flex-col gap-4">
					<div>
						<Label htmlFor="login-email">Email</Label>
						<Input id="login-email" type="email" placeholder="name@example.com" required />
					</div>
					<div>
						<Label htmlFor="login-password">Password</Label>
						<Input id="login-password" type="password" placeholder="••••••••" required />
					</div>
					<Button type="submit">Sign In</Button>
				</form>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Search Bar</h3>
				<div className="relative">
					<Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Search for anything..." className="pl-9" />
				</div>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Form with Validation</h3>
				<form className="flex flex-col gap-4">
					<div>
						<Label htmlFor="valid-email">Email (valid)</Label>
						<Input
							id="valid-email"
							type="email"
							defaultValue="user@example.com"
							className="border-green-500"
						/>
						<p className="text-xs text-green-600 mt-1">Email is valid</p>
					</div>
					<div>
						<Label htmlFor="invalid-email">Email (invalid)</Label>
						<Input
							id="invalid-email"
							type="email"
							defaultValue="invalid-email"
							aria-invalid
						/>
						<p className="text-xs text-destructive mt-1">Please enter a valid email</p>
					</div>
				</form>
			</div>

			<div className="w-[400px]">
				<h3 className="text-sm font-semibold mb-4">Input Group</h3>
				<div className="flex gap-2">
					<Input placeholder="Enter amount" className="flex-1" />
					<Button variant="outline">USD</Button>
				</div>
			</div>
		</div>
	),
}

/**
 * Input in dark mode.
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
			<Input placeholder="Text input" />
			<Input type="email" placeholder="name@example.com" />
			<Input type="password" placeholder="••••••••" />
			<Input placeholder="Disabled" disabled />
			<Input placeholder="Invalid" aria-invalid />
		</div>
	),
}

// Helper component for password toggle
function PasswordToggle() {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className="relative">
			<Lock className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
			<Input
				type={showPassword ? "text" : "password"}
				placeholder="••••••••"
				className="pl-9 pr-9"
			/>
			<button
				type="button"
				onClick={() => setShowPassword(!showPassword)}
				className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
			>
				{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
			</button>
		</div>
	)
}
