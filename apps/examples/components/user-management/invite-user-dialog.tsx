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
} from "@blazz/ui/components/ui/dialog"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Checkbox } from "@blazz/ui/components/ui/checkbox"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import type { Invitation } from "@/types/user-management"

const inviteUserSchema = z.object({
	email: z.string().email("Invalid email address"),
	role: z.string().min(1, "Role is required"),
	sendEmail: z.boolean(),
})

type InviteUserFormData = z.infer<typeof inviteUserSchema>

interface InviteUserDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (invitation: Invitation) => void
}

export function InviteUserDialog({ open, onOpenChange, onSubmit }: InviteUserDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		setValue,
	} = useForm<InviteUserFormData>({
		resolver: zodResolver(inviteUserSchema),
		defaultValues: {
			email: "",
			role: "user",
			sendEmail: true,
		},
	})

	const role = watch("role")
	const sendEmail = watch("sendEmail")

	const onSubmitForm = async (data: InviteUserFormData) => {
		setIsSubmitting(true)

		// Create invitation object
		const newInvitation: Invitation = {
			id: `inv_${crypto.randomUUID()}`,
			email: data.email,
			role: data.role,
			status: "pending",
			invitedAt: new Date().toISOString(),
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
			invitedBy: "Current User",
		}

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500))

		onSubmit(newInvitation)
		reset()
		setIsSubmitting(false)
	}

	const handleClose = () => {
		reset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Invite user</DialogTitle>
					<DialogDescription>
						Send an invitation to a new user to join your organization.
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
							<p className="text-sm text-negative">{errors.email.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="role">Role *</Label>
						<Select value={role} onValueChange={(value) => setValue("role", value)} items={[{ value: "admin", label: "Admin" }, { value: "moderator", label: "Moderator" }, { value: "user", label: "User" }]}>
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
							<p className="text-sm text-negative">{errors.role.message}</p>
						)}
					</div>

					<div className="flex items-center gap-2">
						<Checkbox
							id="sendEmail"
							checked={sendEmail}
							onCheckedChange={(checked) => setValue("sendEmail", !!checked)}
						/>
						<Label htmlFor="sendEmail" className="text-sm font-normal cursor-pointer">
							Send invitation email
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
							{isSubmitting ? "Sending..." : "Send invitation"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
