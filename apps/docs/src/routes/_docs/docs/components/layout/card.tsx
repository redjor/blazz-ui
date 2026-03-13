import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@blazz/ui/components/ui/card"
import { Progress } from "@blazz/ui/components/ui/progress"
import { cn } from "@blazz/ui/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { ArrowRightIcon, BellIcon, ChevronDownIcon, SparklesIcon } from "lucide-react"
import { useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "default",
		code: `<Card>
  <CardContent>
    <p>Content inside a card</p>
  </CardContent>
</Card>`,
	},
	{
		key: "with-header",
		code: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>
      Card description goes here
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>`,
	},
	{
		key: "header-action",
		code: `<Card>
  <CardHeader>
    <CardTitle>Orders</CardTitle>
    <CardDescription>
      Recent orders from your store
    </CardDescription>
    <CardAction>
      <Button variant="outline" size="sm">
        View all
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p>Order list goes here</p>
  </CardContent>
</Card>`,
	},
	{
		key: "small-size",
		code: `<Card size="sm">
  <CardHeader>
    <CardTitle>Compact Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Smaller padding for dense UIs</p>
  </CardContent>
</Card>`,
	},
	{
		key: "with-footer",
		code: `<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
    <CardDescription>
      Manage your account settings
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Settings form goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Save changes</Button>
  </CardFooter>
</Card>`,
	},
	{
		key: "with-image",
		code: `import Image from "next/image"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { ArrowRightIcon, BellIcon, SparklesIcon } from "lucide-react"

<Card className="w-full max-w-xs">
  <CardContent className="flex flex-col gap-4">
    <div className="relative h-48 w-full overflow-hidden rounded-md">
      <Image
        src="https://picsum.photos/1000/800?grayscale&random=18"
        alt="16:9"
        fill
        className="object-cover"
      />
    </div>

    <div className="flex items-center justify-between gap-5">
      <Badge variant="outline">
        <BellIcon aria-hidden="true" />
        Trending
      </Badge>
      <div className="flex items-center gap-1">
        <SparklesIcon aria-hidden="true" />
        <span className="text-secondary-foreground text-xs font-medium">
          Featured
        </span>
      </div>
    </div>

    <p className="text-foreground text-sm">
      Simplifying your workflow from day one. Manage your tasks, projects,
      and team in one place.
    </p>

    <Button>
      Get Started
      <ArrowRightIcon aria-hidden="true" />
    </Button>
  </CardContent>
</Card>`,
	},
	{
		key: "collapsible-billing",
		code: `"use client"

import { useState } from "react"
import { cn } from "@blazz/ui/lib/utils"
import { Button } from "@blazz/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@blazz/ui/components/ui/card"
import { Progress } from "@blazz/ui/components/ui/progress"
import { ChevronDownIcon } from "lucide-react"

export function Pattern() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="relative w-full max-w-md gap-6 overflow-visible pb-1">
      <CardHeader>
        <CardTitle>3 days remaining in cycle</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm">
            Billing
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent
        className={cn(
          "relative space-y-5 overflow-hidden transition-all duration-500 ease-in-out",
          isOpen ? "max-h-[500px]" : "max-h-48"
        )}
      >
        <div className="bg-muted/60 rounded-md space-y-3 p-4">
          <div className="text-muted-foreground flex justify-between text-xs font-medium">
            <span>Included Credit</span>
            <span>On-Demand Charges</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>$18.08 / $20</span>
            <span>$0</span>
          </div>
          <Progress value={90} className="h-2" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Requests</span>
            <span className="text-muted-foreground">$210.84</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Active CPU</span>
            <span className="text-muted-foreground">$21.95</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Events</span>
            <span className="text-muted-foreground">$21.20</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Storage Usage</span>
            <span className="text-muted-foreground">$20.45</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Bandwidth</span>
            <span className="text-muted-foreground">$0.00</span>
          </div>
        </div>

        <div
          className={cn(
            "from-background pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-lg bg-linear-to-t to-transparent transition-opacity duration-300",
            isOpen ? "opacity-0" : "opacity-100"
          )}
        />
      </CardContent>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
        <Button
          variant="outline"
          size="icon-sm"
          className="bg-background hover:bg-background rounded-full shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDownIcon
            aria-hidden="true"
            className={cn("transition-transform duration-300", isOpen && "rotate-180")}
          />
          <span className="sr-only">Toggle card</span>
        </Button>
      </div>
    </Card>
  )
}`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/layout/card")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: CardPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "best-practices", title: "Best Practices" },
]

const cardProps: DocProp[] = [
	{
		name: "size",
		type: '"default" | "sm"',
		default: '"default"',
		description: "The size of the card. Affects padding and spacing.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes to apply to the card.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content to display inside the card.",
	},
]

function CardBillingExample() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Card className="relative w-full max-w-md gap-6 overflow-visible pb-1">
			<CardHeader>
				<CardTitle>3 days remaining in cycle</CardTitle>
				<CardAction>
					<Button variant="outline" size="sm">
						Billing
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent
				className={cn(
					"relative space-y-5 overflow-hidden transition-all duration-500 ease-in-out",
					isOpen ? "max-h-[500px]" : "max-h-48"
				)}
			>
				<div className="bg-muted/60 space-y-3 rounded-md p-4">
					<div className="text-muted-foreground flex justify-between text-xs font-medium">
						<span>Included Credit</span>
						<span>On-Demand Charges</span>
					</div>
					<div className="flex justify-between text-lg font-bold">
						<span>$18.08 / $20</span>
						<span>$0</span>
					</div>
					<Progress value={90} className="h-2" />
				</div>

				<div className="flex flex-col gap-4">
					<div className="flex justify-between text-sm">
						<span className="text-foreground font-medium">Requests</span>
						<span className="text-muted-foreground">$210.84</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-foreground font-medium">Active CPU</span>
						<span className="text-muted-foreground">$21.95</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-foreground font-medium">Events</span>
						<span className="text-muted-foreground">$21.20</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-foreground font-medium">Storage Usage</span>
						<span className="text-muted-foreground">$20.45</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-foreground font-medium">Bandwidth</span>
						<span className="text-muted-foreground">$0.00</span>
					</div>
				</div>

				<div
					className={cn(
						"from-background pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-lg bg-linear-to-t to-transparent transition-opacity duration-300",
						isOpen ? "opacity-0" : "opacity-100"
					)}
				/>
			</CardContent>

			<div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
				<Button
					variant="outline"
					size="icon-sm"
					className="bg-background hover:bg-background rounded-full shadow-sm"
					onClick={() => setIsOpen(!isOpen)}
				>
					<ChevronDownIcon
						aria-hidden="true"
						className={cn("transition-transform duration-300", isOpen && "rotate-180")}
					/>
					<span className="sr-only">Toggle card</span>
				</Button>
			</div>
		</Card>
	)
}

function CardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Card"
			subtitle="Cards are used to group similar concepts and tasks together for users to scan, read, and get things done more easily."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic card with content."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Card>
						<CardContent>
							<p className="text-sm text-fg-muted">Content inside a card</p>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="With Header"
					description="A card with a header section including title and description."
					code={examples[1].code}
					highlightedCode={html("with-header")}
				>
					<Card>
						<CardHeader>
							<CardTitle>Card Title</CardTitle>
							<CardDescription>Card description goes here</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-fg-muted">Card content</p>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="With Header Action"
					description="A card with an action button in the header."
					code={examples[2].code}
					highlightedCode={html("header-action")}
				>
					<Card>
						<CardHeader>
							<CardTitle>Orders</CardTitle>
							<CardDescription>Recent orders from your store</CardDescription>
							<CardAction>
								<Button variant="outline" size="sm">
									View all
								</Button>
							</CardAction>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-fg-muted">Order list goes here</p>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="Small Size"
					description="A compact card with reduced padding."
					code={examples[3].code}
					highlightedCode={html("small-size")}
				>
					<Card size="sm">
						<CardHeader>
							<CardTitle>Compact Card</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-fg-muted">Smaller padding for dense UIs</p>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="With Footer"
					description="A card with a footer for actions."
					code={examples[4].code}
					highlightedCode={html("with-footer")}
				>
					<Card>
						<CardHeader>
							<CardTitle>Settings</CardTitle>
							<CardDescription>Manage your account settings</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-fg-muted">Settings form goes here</p>
						</CardContent>
						<CardFooter>
							<Button>Save changes</Button>
						</CardFooter>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="With Image"
					description="A card combining an image, badges, and a call-to-action button."
					code={examples[5].code}
					highlightedCode={html("with-image")}
				>
					<Card className="w-full max-w-xs">
						<CardContent className="flex flex-col gap-4">
							<div className="relative h-48 w-full overflow-hidden rounded-md">
								<img
									src="https://picsum.photos/1000/800?grayscale&random=18"
									alt="16:9"
									className="h-full w-full object-cover"
								/>
							</div>

							<div className="flex items-center justify-between gap-5">
								<Badge variant="outline">
									<BellIcon aria-hidden="true" />
									Trending
								</Badge>
								<div className="flex items-center gap-1">
									<SparklesIcon className="size-3.5" aria-hidden="true" />
									<span className="text-secondary-foreground text-xs font-medium">Featured</span>
								</div>
							</div>

							<p className="text-foreground text-sm">
								Simplifying your workflow from day one. Manage your tasks, projects, and team in one
								place.
							</p>

							<Button>
								Get Started
								<ArrowRightIcon aria-hidden="true" />
							</Button>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="Collapsible Billing"
					description="A card with a collapsible section and a toggle button."
					code={examples[6].code}
					highlightedCode={html("collapsible-billing")}
				>
					<CardBillingExample />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={cardProps} />
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Group related information together</li>
					<li>Display information in a way that prioritizes what the user needs to know first</li>
					<li>Use headings that set clear expectations about the card's purpose</li>
					<li>Stick to single user flows or break more complicated flows into multiple sections</li>
					<li>
						Avoid too many call-to-action buttons and only one primary call to action per card
					</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
