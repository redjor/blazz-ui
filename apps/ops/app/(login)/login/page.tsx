import type { Metadata } from "next"
import LoginPageClient from "./_client"

export const metadata: Metadata = {
	title: "Connexion",
}

export default function LoginPage() {
	return <LoginPageClient />
}
