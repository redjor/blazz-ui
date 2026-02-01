"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import type { User } from "@/types/user-management"

const createUserSchema = z.object({
	email: z.string().email("Invalid email address"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, hyphens and underscores"),
	role: z.string().min(1, "Role is required"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	sendVerificationEmail: z.boolean(),
})

type CreateUserFormData = z.infer<typeof createUserSchema>

interface CreateUserDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (user: User) => void
}

export function CreateUserDialog({ open, onOpenChange, onSubmit }: CreateUserDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		setValue,
	} = useForm<CreateUserFormData>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			username: "",
			role: "user",
			password: "",
			sendVerificationEmail: true,
		},
	})

	const role = watch("role")
	const sendVerificationEmail = watch("sendVerificationEmail")

	const onSubmitForm = async (data: CreateUserFormData) => {
		setIsSubmitting(true)

		// Create user object
		const newUser: User = {
			id: `usr_${crypto.randomUUID()}`,
			email: data.email,
			name: `${data.firstName} ${data.lastName}`,
			firstName: data.firstName,
			lastName: data.lastName,
			username: data.username,
			role: data.role,
			status: "never_active",
			emailAddresses: [
				{
					id: `email_${crypto.randomUUID()}`,
					email: data.email,
					isPrimary: true,
					isVerified: false,
					createdAt: new Date().toISOString(),
				},
			],
			metadata: {
				public: {},
				private: {},
				unsafe: {},
			},
			permissions: {
				canDeleteAccount: true,
				bypassClientTrust: false,
			},
			lastSignedIn: undefined,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			devices: [],
		}

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500))

		onSubmit(newUser)
		reset()
		setIsSubmitting(false)
	}

	const handleClose = () => {
		reset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Create user</DialogTitle>
					<DialogDescription>
						Create a new user account with the details below.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email address *</Label>
						<Input
							id="email"
							type="email"
							placeholder="user@example.com"
							{...register("email")}
							autoFocus
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First name *</Label>
							<Input id="firstName" placeholder="John" {...register("firstName")} />
							{errors.firstName && (
								<p className="text-sm text-destructive">{errors.firstName.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="lastName">Last name *</Label>
							<Input id="lastName" placeholder="Doe" {...register("lastName")} />
							{errors.lastName && (
								<p className="text-sm text-destructive">{errors.lastName.message}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="username">Username *</Label>
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground text-sm">@</span>
							<Input id="username" placeholder="johndoe" {...register("username")} />
						</div>
						{errors.username && (
							<p className="text-sm text-destructive">{errors.username.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="role">Role *</Label>
						<Select value={role} onValueChange={(value) => setValue("role", value)}>
							<SelectTrigger id="role">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="admin">Admin</SelectItem>
								<SelectItem value="moderator">Moderator</SelectItem>
								<SelectItem value="user">User</SelectItem>
							</SelectContent>
						</Select>
						{errors.role && (
							<p className="text-sm text-destructive">{errors.role.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password *</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-sm text-destructive">{errors.password.message}</p>
						)}
					</div>

					<div className="flex items-center gap-2">
						<Checkbox
							id="sendVerificationEmail"
							checked={sendVerificationEmail}
							onCheckedChange={(checked) => setValue("sendVerificationEmail", !!checked)}
						/>
						<Label htmlFor="sendVerificationEmail" className="text-sm font-normal cursor-pointer">
							Send verification email
						</Label>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-violet-600 hover:bg-violet-700 text-white"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Creating..." : "Create user"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
