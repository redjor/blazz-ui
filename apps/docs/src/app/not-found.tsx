import Link from "next/link"

export default function NotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
			<h1 className="text-2xl font-semibold">404</h1>
			<p className="text-fg-muted">Page introuvable</p>
			<Link href="/" className="text-sm text-brand hover:underline">
				Retour a l'accueil
			</Link>
		</div>
	)
}
