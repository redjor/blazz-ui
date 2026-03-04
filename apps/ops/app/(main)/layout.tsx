import { OpsFrame } from "@/components/ops-frame"
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server"
import { redirect } from "next/navigation"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
	const authenticated = await isAuthenticatedNextjs()
	if (!authenticated) {
		redirect("/login")
	}
	return <OpsFrame>{children}</OpsFrame>
}
