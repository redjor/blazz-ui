"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"
import type { User } from "@/types/user-management"
import { UserMetadataEditor } from "./user-metadata-editor"
import { toast } from "sonner"

interface UserSettingsFormProps {
	user: User
}

export function UserSettingsForm({ user }: UserSettingsFormProps) {
	const [canDeleteAccount, setCanDeleteAccount] = useState(user.permissions.canDeleteAccount)
	const [bypassClientTrust, setBypassClientTrust] = useState(user.permissions.bypassClientTrust)

	const handleSavePermissions = () => {
		toast.success("Permissions updated", {
			description: "User permissions have been updated successfully.",
		})
	}

	const handleMetadataSave = (type: "public" | "private" | "unsafe", data: Record<string, any>) => {
		// In a real app, this would update the user data
		console.log(`Saving ${type} metadata:`, data)
	}

	return (
		<div className="space-y-6 mt-6">
			{/* Username (readonly) */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Username</h2>
				<div className="space-y-2">
					<Label>Username</Label>
					<div className="flex items-center gap-2">
						<span className="text-fg-muted text-sm">@</span>
						<div className="flex-1 px-3 py-2 bg-raised/50 rounded-md text-sm">
							{user.username}
						</div>
					</div>
					<p className="text-xs text-fg-muted">
						Username can be modified in the Profile tab.
					</p>
				</div>
			</Card>

			{/* Password */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Password</h2>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-sm">••••••••••••</span>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<MoreVerticalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() =>
									toast.success("Password reset link sent", {
										description: `A password reset link has been sent to ${user.email}.`,
									})
								}
							>
								Send reset password email
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									toast.info("Change password", {
										description: "Change password functionality would be implemented here.",
									})
								}
							>
								Change password
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</Card>

			{/* Devices */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Devices</h2>
				{user.devices.length === 0 ? (
					<div className="text-center py-8 text-fg-muted">
						<p className="text-sm">None</p>
					</div>
				) : (
					<div className="space-y-3">
						{user.devices.map((device) => (
							<div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
								<div>
									<p className="text-sm font-medium">{device.name}</p>
									<p className="text-xs text-fg-muted">
										Last used: {new Date(device.lastUsed).toLocaleDateString()}
									</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										toast.success("Device removed", {
											description: `${device.name} has been removed.`,
										})
									}
								>
									Remove
								</Button>
							</div>
						))}
					</div>
				)}
			</Card>

			{/* Metadata */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Metadata</h2>
				<div className="space-y-6">
					<UserMetadataEditor
						metadata={user.metadata.public}
						onSave={(data) => handleMetadataSave("public", data)}
						label="Public metadata"
					/>

					<UserMetadataEditor
						metadata={user.metadata.private}
						onSave={(data) => handleMetadataSave("private", data)}
						label="Private metadata"
					/>

					<UserMetadataEditor
						metadata={user.metadata.unsafe}
						onSave={(data) => handleMetadataSave("unsafe", data)}
						label="Unsafe metadata"
					/>
				</div>
			</Card>

			{/* User Permissions */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">User permissions</h2>
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<Checkbox
							id="canDeleteAccount"
							checked={canDeleteAccount}
							onCheckedChange={(checked) => setCanDeleteAccount(!!checked)}
						/>
						<div className="flex-1">
							<Label htmlFor="canDeleteAccount" className="font-normal cursor-pointer">
								Allow user to delete their account
							</Label>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<Checkbox
							id="bypassClientTrust"
							checked={bypassClientTrust}
							onCheckedChange={(checked) => setBypassClientTrust(!!checked)}
						/>
						<div className="flex-1">
							<Label htmlFor="bypassClientTrust" className="font-normal cursor-pointer">
								Bypass Client Trust
							</Label>
							<p className="text-xs text-fg-muted mt-1">
								Allow this user to bypass client trust checks when signing in from new devices.
							</p>
						</div>
					</div>

					<Button onClick={handleSavePermissions}>Save permissions</Button>
				</div>
			</Card>

			{/* Disabled Settings */}
			<Card className="p-6 bg-raised/30">
				<h2 className="text-lg font-semibold mb-4">Disabled settings</h2>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<Label className="font-normal">Organizations</Label>
							<p className="text-xs text-fg-muted mt-1">
								Organization management is currently disabled for this workspace.
							</p>
						</div>
						<Button variant="outline" size="sm" disabled>
							Enable organizations
						</Button>
					</div>
				</div>
			</Card>
		</div>
	)
}
