import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Check, X } from "lucide-react"
import { Footer } from "~/components/landing/footer"
import { Navbar } from "~/components/landing/navbar"

const tiers = [
	{
		name: "Starter",
		price: "0",
		badge: "MIT",
		description: "Open source primitives for evaluation, prototypes, and production use under MIT.",
	},
	{
		name: "Pro",
		price: "249",
		badge: "One-time purchase",
		description: "Full enterprise UI package with commercial usage, unlimited projects, and code ownership.",
	},
	{
		name: "Enterprise",
		price: "Custom",
		badge: "Custom terms",
		description: "For teams that need onboarding, SLAs, custom theming, or negotiated licensing terms.",
	},
]

const allowed = [
	"Use Blazz UI Pro in unlimited internal and client projects.",
	"Copy, modify, and adapt the source code to fit your product and brand.",
	"Use the package in commercial products without per-seat fees.",
	"Keep the code in your repository and ship it as part of your application.",
]

const restricted = [
	"Do not resell Blazz UI as a competing UI kit, template pack, or component library.",
	"Do not redistribute the source as a standalone commercial product.",
	"Do not share paid source files publicly or with teams that did not purchase access.",
]

export default function LicensePage() {
	return (
		<div className="min-h-screen bg-app">
			<Navbar />

			<main className="px-6 py-8 md:py-10">
				<div className="mx-auto flex max-w-6xl flex-col gap-4">
					<Badge variant="outline" className="w-fit">
						Licensing
					</Badge>
					<div className="max-w-3xl">
						<h1 className="text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl">Simple licensing for serious product teams.</h1>
						<p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
							Blazz UI is sold as a one-time product license. Buy it once, use it across unlimited projects, and keep full control of the code you ship.
						</p>
					</div>
				</div>

				<section className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
					{tiers.map((tier) => (
						<div key={tier.name} className="rounded-xl border border-container bg-card p-6 shadow-sm">
							<div className="flex items-start justify-between gap-3">
								<div>
									<h2 className="text-lg font-semibold text-fg">{tier.name}</h2>
									<p className="mt-1 text-2xl font-semibold tracking-tight text-fg">{tier.price}</p>
								</div>
								<Badge variant="outline" size="xs">
									{tier.badge}
								</Badge>
							</div>
							<p className="mt-4 text-sm leading-relaxed text-fg-muted">{tier.description}</p>
						</div>
					))}
				</section>

				<section className="mx-auto mt-6 grid max-w-6xl gap-4 lg:grid-cols-2">
					<div className="rounded-xl border border-container bg-card p-6">
						<h2 className="text-lg font-semibold text-fg">What you can do</h2>
						<ul className="mt-5 space-y-3">
							{allowed.map((item) => (
								<li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted">
									<Check className="mt-0.5 size-4 shrink-0 text-positive" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="rounded-xl border border-container bg-card p-6">
						<h2 className="text-lg font-semibold text-fg">What you cannot do</h2>
						<ul className="mt-5 space-y-3">
							{restricted.map((item) => (
								<li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted">
									<X className="mt-0.5 size-4 shrink-0 text-negative" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				</section>

				<section className="mx-auto mt-6 grid max-w-6xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="rounded-xl border border-container bg-card p-6">
						<h2 className="text-lg font-semibold text-fg">Plain-English summary</h2>
						<div className="mt-5 space-y-4 text-sm leading-relaxed text-fg-muted">
							<p>Starter is free and MIT licensed. It covers the open source primitive layer.</p>
							<p>
								Pro is the paid package. It is a one-time purchase for the full Blazz UI system, including blocks, patterns, and premium components. You can use it in unlimited internal and client
								projects.
							</p>
							<p>Enterprise is for teams that need additional commercial terms, onboarding, or customization beyond the standard Pro package.</p>
							<p>This page is a practical summary for buyers. If you need procurement-friendly terms, reseller permissions, or custom licensing, contact us for an enterprise agreement.</p>
						</div>
					</div>

					<div className="rounded-xl border border-container bg-card p-6">
						<h2 className="text-lg font-semibold text-fg">Common answers</h2>
						<div className="mt-5 space-y-4 text-sm leading-relaxed text-fg-muted">
							<div>
								<p className="font-medium text-fg">Can I use Pro for client work?</p>
								<p className="mt-1">Yes. Pro covers unlimited client and internal projects.</p>
							</div>
							<div>
								<p className="font-medium text-fg">Do I own the code?</p>
								<p className="mt-1">Yes. You keep the source in your repository and modify it freely.</p>
							</div>
							<div>
								<p className="font-medium text-fg">Is there any per-seat pricing?</p>
								<p className="mt-1">No. The standard Pro license is not priced per seat.</p>
							</div>
							<div>
								<p className="font-medium text-fg">Can I redistribute it as my own kit?</p>
								<p className="mt-1">No. The paid package cannot be repackaged or resold as a competing UI product.</p>
							</div>
						</div>
					</div>
				</section>

				<section className="mx-auto mt-6 max-w-6xl rounded-xl border border-container bg-card p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="max-w-2xl">
							<h2 className="text-lg font-semibold text-fg">Need custom terms?</h2>
							<p className="mt-2 text-sm leading-relaxed text-fg-muted">
								If your team needs SLAs, procurement review, onboarding, or negotiated licensing terms, the enterprise tier is the right path.
							</p>
						</div>
						<div className="flex gap-3">
							<a href="/#pricing">
								<Button variant="outline">See pricing</Button>
							</a>
							<a href="https://github.com/redjor/blazz-ui/issues/new">
								<Button>Contact us</Button>
							</a>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}
