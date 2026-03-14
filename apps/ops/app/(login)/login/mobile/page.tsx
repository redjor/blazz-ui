import type { Metadata } from "next"
import MobileLoginPageClient from "./_client"

export const metadata: Metadata = {
	title: "Connexion mobile",
}

export default function MobileLoginPage() {
	return <MobileLoginPageClient />
}
