"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/features/data-table"
import { createUserManagementPreset } from "@/components/features/data-table/presets/users"
import { createInvitationPreset } from "@/components/features/data-table/presets/invitations"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Page } from "@/components/ui/page"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useDataTableViews } from "@/hooks/use-data-table-views"
import { mockUsers as initialUsers, mockInvitations as initialInvitations } from "@/lib/mock-data/users"
import type { User, Invitation } from "@/types/user-management"
import { InviteUserDialog } from "@/components/features/user-management/invite-user-dialog"
import { CreateUserDialog } from "@/components/features/user-management/create-user-dialog"
import { toast } from "sonner"

export default function UsersPage() {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState<"users" | "invitations">("users")
	const [users, setUsers] = useState<User[]>(initialUsers)
	const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations)
	const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
	const [isInviteUserOpen, setIsInviteUserOpen] = useState(false)

	// Create user management preset
	const userPreset = useMemo(
		() =>
			createUserManagementPreset({
				onView: (user) => {
					router.push(`/users/${user.id}`)
				},
				onEdit: (user) => {
					router.push(`/users/${user.id}`)
				},
				onSuspend: async (user) => {
					setUsers((prev) =>
						prev.map((u) => (u.id === user.id ? { ...u, status: "suspended" } : u))
					)
					toast.success("User suspended", {
						description: `${user.name} has been suspended.`,
					})
				},
				onDelete: async (user) => {
					setUsers((prev) => prev.filter((u) => u.id !== user.id))
					toast.success("User deleted", {
						description: `${user.name} has been deleted.`,
					})
				},
				onBulkSuspend: async (selectedUsers) => {
					const ids = selectedUsers.map((u) => u.id)
					setUsers((prev) =>
						prev.map((u) => (ids.includes(u.id) ? { ...u, status: "suspended" } : u))
					)
					toast.success("Users suspended", {
						description: `${selectedUsers.length} user(s) have been suspended.`,
					})
				},
				onBulkDelete: async (selectedUsers) => {
					const ids = selectedUsers.map((u) => u.id)
					setUsers((prev) => prev.filter((u) => !ids.includes(u.id)))
					toast.success("Users deleted", {
						description: `${selectedUsers.length} user(s) have been deleted.`,
					})
				},
			}),
		[router]
	)

	// Create invitation preset
	const invitationPreset = useMemo(
		() =>
			createInvitationPreset({
				onResend: async (invitation) => {
					toast.success("Invitation resent", {
						description: `Invitation has been resent to ${invitation.email}.`,
					})
				},
				onRevoke: async (invitation) => {
					setInvitations((prev) =>
						prev.map((inv) => (inv.id === invitation.id ? { ...inv, status: "revoked" } : inv))
					)
					toast.success("Invitation revoked", {
						description: `Invitation for ${invitation.email} has been revoked.`,
					})
				},
				onBulkRevoke: async (selectedInvitations) => {
					const ids = selectedInvitations.map((inv) => inv.id)
					setInvitations((prev) =>
						prev.map((inv) => (ids.includes(inv.id) ? { ...inv, status: "revoked" } : inv))
					)
					toast.success("Invitations revoked", {
						description: `${selectedInvitations.length} invitation(s) have been revoked.`,
					})
				},
			}),
		[]
	)

	// Separate view management for each tab
	const {
		views: userViews,
		activeView: activeUserView,
		setActiveView: setActiveUserView,
		addView: addUserView,
		updateView: updateUserView,
		deleteView: deleteUserView,
	} = useDataTableViews({
		storageKey: "users-table",
		defaultViews: userPreset.views,
	})

	const {
		views: invitationViews,
		activeView: activeInvitationView,
		setActiveView: setActiveInvitationView,
		addView: addInvitationView,
		updateView: updateInvitationView,
		deleteView: deleteInvitationView,
	} = useDataTableViews({
		storageKey: "invitations-table",
		defaultViews: invitationPreset.views,
	})

	// Handlers for creating new users and invitations
	const handleCreateUser = (newUser: User) => {
		setUsers([...users, newUser])
		setIsCreateUserOpen(false)
		toast.success("User created", {
			description: `${newUser.name} has been created successfully.`,
		})
	}

	const handleInviteUser = (newInvitation: Invitation) => {
		setInvitations([...invitations, newInvitation])
		setIsInviteUserOpen(false)
		toast.success("Invitation sent", {
			description: `Invitation has been sent to ${newInvitation.email}.`,
		})
	}

	return (
		<Page
			title="Users"
			fullWidth
			primaryAction={
				<Button
					className="bg-violet-600 hover:bg-violet-700 text-white"
					onClick={() => {
						if (activeTab === "users") {
							setIsCreateUserOpen(true)
						} else {
							setIsInviteUserOpen(true)
						}
					}}
				>
					{activeTab === "users" ? "Create user" : "Invite user"}
				</Button>
			}
		>
			<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "users" | "invitations")}>
				<TabsList variant="line">
					<TabsTrigger value="users">All</TabsTrigger>
					<TabsTrigger value="invitations">Invitations</TabsTrigger>
				</TabsList>

				<TabsContent value="users">
					<Card className="p-0">
						<DataTable
							data={users}
							columns={userPreset.columns}
							views={userViews}
							activeView={activeUserView}
							onViewChange={(view) => setActiveUserView(view.id)}
							onViewSave={addUserView}
							onViewUpdate={updateUserView}
							onViewDelete={deleteUserView}
							rowActions={userPreset.rowActions}
							bulkActions={userPreset.bulkActions}
							onRowClick={(user) => router.push(`/users/${user.id}`)}
							enableSorting
							enablePagination
							enableRowSelection
							enableGlobalSearch
							enableAdvancedFilters
							enableCustomViews
							searchPlaceholder="Search users..."
							pagination={{
								pageSize: 25,
								pageSizeOptions: [10, 25, 50, 100],
							}}
							variant="lined"
							density="default"
						/>
					</Card>
				</TabsContent>

				<TabsContent value="invitations">
					<Card className="p-0">
						<DataTable
							data={invitations}
							columns={invitationPreset.columns}
							views={invitationViews}
							activeView={activeInvitationView}
							onViewChange={(view) => setActiveInvitationView(view.id)}
							onViewSave={addInvitationView}
							onViewUpdate={updateInvitationView}
							onViewDelete={deleteInvitationView}
							rowActions={invitationPreset.rowActions}
							bulkActions={invitationPreset.bulkActions}
							enableSorting
							enablePagination
							enableRowSelection
							enableGlobalSearch
							enableAdvancedFilters
							enableCustomViews
							searchPlaceholder="Search invitations..."
							pagination={{
								pageSize: 25,
								pageSizeOptions: [10, 25, 50, 100],
							}}
							variant="lined"
							density="default"
						/>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Create User Dialog */}
			<CreateUserDialog
				open={isCreateUserOpen}
				onOpenChange={setIsCreateUserOpen}
				onSubmit={handleCreateUser}
			/>

			{/* Invite User Dialog */}
			<InviteUserDialog
				open={isInviteUserOpen}
				onOpenChange={setIsInviteUserOpen}
				onSubmit={handleInviteUser}
			/>
		</Page>
	)
}
