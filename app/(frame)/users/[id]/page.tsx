"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Page } from "@/components/ui/page"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react"
import { mockUsers } from "@/lib/mock-data/users"
import { UserProfileForm } from "@/components/features/user-management/user-profile-form"
import { UserSettingsForm } from "@/components/features/user-management/user-settings-form"
import { toast } from "sonner"

export default function UserDetailPage() {
	const router = useRouter()
	const params = useParams()
	const userId = params.id as string

	const [showJson, setShowJson] = useState(false)
	const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile")

	// Find user
	const user = mockUsers.find((u) => u.id === userId)

	if (!user) {
		return (
			<Page title="User not found" fullWidth>
				<Card className="p-8 text-center">
					<p className="text-muted-foreground">The user you are looking for does not exist.</p>
					<Button className="mt-4" onClick={() => router.push("/users")}>
						Back to Users
					</Button>
				</Card>
			</Page>
		)
	}

	const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()

	// Status badge config
	const statusConfig = {
		active: {
			className: "bg-green-100 text-green-800 border-green-200",
			label: "Active",
		},
		inactive: {
			className: "bg-gray-100 text-gray-800 border-gray-200",
			label: "Inactive",
		},
		suspended: {
			className: "bg-red-100 text-red-800 border-red-200",
			label: "Suspended",
		},
		never_active: {
			className: "bg-blue-100 text-blue-800 border-blue-200",
			label: "Never Active",
		},
	}

	const currentStatus = statusConfig[user.status]

	return (
		<Page
			fullWidth
			breadcrumbs={
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.push("/users")}
					className="flex items-center gap-2"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Back
				</Button>
			}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-6">
				<div className="flex items-center gap-4">
					<Avatar size="lg">
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="text-2xl font-semibold">{user.name}</h1>
						<Badge className={currentStatus.className}>{currentStatus.label}</Badge>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => setShowJson(!showJson)}>
						{showJson ? "Hide" : "Show"} JSON
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								Actions
								<MoreVerticalIcon className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									toast.success("User suspended", {
										description: `${user.name} has been suspended.`,
									})
								}}
							>
								Suspend user
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									toast.success("Password reset link sent", {
										description: `A password reset link has been sent to ${user.email}.`,
									})
								}}
							>
								Reset password
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive"
								onClick={() => {
									if (confirm(`Are you sure you want to delete ${user.name}?`)) {
										toast.success("User deleted", {
											description: `${user.name} has been deleted.`,
										})
										router.push("/users")
									}
								}}
							>
								Delete user
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "profile" | "settings")}>
				<TabsList variant="line">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<UserProfileForm user={user} />
				</TabsContent>

				<TabsContent value="settings">
					<UserSettingsForm user={user} />
				</TabsContent>
			</Tabs>

			{/* JSON Display */}
			{showJson && (
				<Card className="mt-6 p-4">
					<h3 className="text-sm font-semibold mb-2">User JSON</h3>
					<pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-96">
						{JSON.stringify(user, null, 2)}
					</pre>
				</Card>
			)}
		</Page>
	)
}
