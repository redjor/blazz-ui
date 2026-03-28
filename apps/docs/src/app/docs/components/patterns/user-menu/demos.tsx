"use client"

import { UserMenu } from "@blazz/ui/components/patterns/user-menu"

const mockUser = {
	name: "Sophie Martin",
	email: "sophie@acme.com",
	role: "Administratrice",
}

const mockUserWithAvatar = {
	name: "Alex Dupont",
	email: "alex@acme.com",
	role: "Manager",
	avatar: "https://i.pravatar.cc/150?u=alex",
}

export function BasicDemo() {
	return <UserMenu user={mockUser} badge="Pro" onProfile={() => {}} onSettings={() => {}} onLogout={() => {}} />
}

export function ProfileOnlyDemo() {
	return <UserMenu user={{ name: "Sophie Martin", role: "Viewer" }} onProfile={() => {}} />
}

export function WithAvatarDemo() {
	return <UserMenu user={mockUserWithAvatar} badge="Pro" onProfile={() => {}} onSettings={() => {}} onLogout={() => {}} />
}

export function MinimalDemo() {
	return <UserMenu user={mockUser} />
}
