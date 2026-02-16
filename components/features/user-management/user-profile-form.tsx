"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CopyIcon, CheckIcon, PlusIcon, MoreVerticalIcon } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types/user-management"
import { toast } from "sonner"

interface UserProfileFormProps {
	user: User
}

export function UserProfileForm({ user }: UserProfileFormProps) {
	const [firstName, setFirstName] = useState(user.firstName || "")
	const [lastName, setLastName] = useState(user.lastName || "")
	const [username, setUsername] = useState(user.username)
	const [copiedField, setCopiedField] = useState<string | null>(null)

	const copyToClipboard = (text: string, field: string) => {
		navigator.clipboard.writeText(text)
		setCopiedField(field)
		setTimeout(() => setCopiedField(null), 2000)
	}

	const handleSaveProfile = () => {
		toast.success("Profile updated", {
			description: "User profile has been updated successfully.",
		})
	}

	const handleSaveUsername = () => {
		toast.success("Username updated", {
			description: "Username has been updated successfully.",
		})
	}

	const handleUploadImage = () => {
		toast.info("Upload image", {
			description: "Image upload functionality would be implemented here.",
		})
	}

	const handleAddEmail = () => {
		toast.info("Add email", {
			description: "Add email functionality would be implemented here.",
		})
	}

	const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
	const primaryEmail = user.emailAddresses.find((email) => email.isPrimary)

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
			{/* Main Content */}
			<div className="lg:col-span-2 space-y-6">
				{/* Personal Information */}
				<Card className="p-6">
					<h2 className="text-lg font-semibold mb-4">Personal information</h2>

					<div className="space-y-6">
						{/* Avatar */}
						<div className="flex items-center gap-4">
							<Avatar size="lg">
								<AvatarFallback>{initials}</AvatarFallback>
							</Avatar>
							<Button variant="outline" size="sm" onClick={handleUploadImage}>
								Upload image
							</Button>
						</div>

						{/* First and Last Name */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First name</Label>
								<Input
									id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last name</Label>
								<Input
									id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</div>
						</div>

						<Button onClick={handleSaveProfile}>Save changes</Button>
					</div>
				</Card>

				{/* Email Addresses */}
				<Card className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold">Email addresses</h2>
						<Button variant="outline" size="sm" onClick={handleAddEmail}>
							<PlusIcon className="h-4 w-4 mr-2" />
							Add email
						</Button>
					</div>

					<div className="space-y-3">
						{user.emailAddresses.map((emailAddress) => (
							<div
								key={emailAddress.id}
								className="flex items-center justify-between p-3 border rounded-lg"
							>
								<div className="flex items-center gap-3">
									<div>
										<p className="text-sm font-medium">{emailAddress.email}</p>
										<div className="flex items-center gap-2 mt-1">
											{emailAddress.isPrimary && (
												<Badge variant="outline" className="text-xs">
													Primary
												</Badge>
											)}
											<Badge
												variant={emailAddress.isVerified ? "default" : "secondary"}
												className={
													emailAddress.isVerified
														? "bg-green-100 text-green-800 border-green-200 text-xs"
														: "text-xs"
												}
											>
												{emailAddress.isVerified ? "Verified" : "Unverified"}
											</Badge>
										</div>
									</div>
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon-sm">
											<MoreVerticalIcon className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{!emailAddress.isPrimary && (
											<DropdownMenuItem
												onClick={() =>
													toast.success("Primary email set", {
														description: `${emailAddress.email} is now the primary email.`,
													})
												}
											>
												Set as primary
											</DropdownMenuItem>
										)}
										{!emailAddress.isVerified && (
											<DropdownMenuItem
												onClick={() =>
													toast.success("Verification email sent", {
														description: `Verification email sent to ${emailAddress.email}.`,
													})
												}
											>
												Send verification
											</DropdownMenuItem>
										)}
										{!emailAddress.isPrimary && (
											<DropdownMenuItem
												className="text-negative"
												onClick={() =>
													toast.success("Email removed", {
														description: `${emailAddress.email} has been removed.`,
													})
												}
											>
												Remove
											</DropdownMenuItem>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						))}
					</div>
				</Card>

				{/* Username */}
				<Card className="p-6">
					<h2 className="text-lg font-semibold mb-4">Username</h2>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<div className="flex items-center gap-2">
								<span className="text-fg-muted text-sm">@</span>
								<Input
									id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
						</div>

						<Button onClick={handleSaveUsername}>Update username</Button>
					</div>
				</Card>
			</div>

			{/* Sidebar */}
			<div className="space-y-4">
				{/* User ID */}
				<Card className="p-4">
					<Label className="text-xs text-fg-muted">User ID</Label>
					<div className="flex items-center justify-between mt-2">
						<p className="text-sm font-mono">{user.id}</p>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => copyToClipboard(user.id, "userId")}
						>
							{copiedField === "userId" ? (
								<CheckIcon className="h-4 w-4 text-green-600" />
							) : (
								<CopyIcon className="h-4 w-4" />
							)}
						</Button>
					</div>
				</Card>

				{/* Primary Email */}
				{primaryEmail && (
					<Card className="p-4">
						<Label className="text-xs text-fg-muted">Primary email</Label>
						<div className="flex items-center justify-between mt-2">
							<p className="text-sm truncate">{primaryEmail.email}</p>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => copyToClipboard(primaryEmail.email, "email")}
							>
								{copiedField === "email" ? (
									<CheckIcon className="h-4 w-4 text-green-600" />
								) : (
									<CopyIcon className="h-4 w-4" />
								)}
							</Button>
						</div>
					</Card>
				)}

				{/* Username */}
				<Card className="p-4">
					<Label className="text-xs text-fg-muted">Username</Label>
					<div className="flex items-center justify-between mt-2">
						<p className="text-sm font-mono">@{user.username}</p>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => copyToClipboard(user.username, "username")}
						>
							{copiedField === "username" ? (
								<CheckIcon className="h-4 w-4 text-green-600" />
							) : (
								<CopyIcon className="h-4 w-4" />
							)}
						</Button>
					</div>
				</Card>

				{/* User Since */}
				<Card className="p-4">
					<Label className="text-xs text-fg-muted">User since</Label>
					<p className="text-sm mt-2">
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</p>
				</Card>

				{/* Profile Updated */}
				<Card className="p-4">
					<Label className="text-xs text-fg-muted">Profile updated</Label>
					<p className="text-sm mt-2">
						{new Date(user.updatedAt).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</p>
				</Card>
			</div>
		</div>
	)
}
