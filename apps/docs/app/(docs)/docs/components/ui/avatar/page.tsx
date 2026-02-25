import {
	Avatar,
	AvatarImage,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarBadge,
} from "@blazz/ui/components/ui/avatar"
import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExample } from "@/components/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Tokens" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const avatarProps: DocProp[] = [
	{
		name: "size",
		type: '"sm" | "default" | "lg"',
		default: '"default"',
		description: "The size of the avatar.",
	},
]

const avatarImageProps: DocProp[] = [
	{
		name: "src",
		type: "string",
		description: "The image source URL.",
	},
	{
		name: "alt",
		type: "string",
		description: "Alternative text for the image.",
	},
]

export default function AvatarPage() {
	return (
		<DocPage
			title="Avatar"
			subtitle="Display user profile images with fallback support for initials or icons."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<Avatar>
						<AvatarFallback>JD</AvatarFallback>
					</Avatar>
					<Avatar>
						<AvatarFallback>AB</AvatarFallback>
						<AvatarBadge />
					</Avatar>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="With Image"
					description="Display a user's profile picture."
					code={`<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`}
				>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</DocExample>

				<DocExample
					title="Fallback"
					description="Show initials when image is unavailable."
					code={`<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`}
				>
					<div className="flex gap-2">
						<Avatar>
							<AvatarFallback>JD</AvatarFallback>
						</Avatar>
						<Avatar>
							<AvatarFallback>AB</AvatarFallback>
						</Avatar>
						<Avatar>
							<AvatarFallback>XY</AvatarFallback>
						</Avatar>
					</div>
				</DocExample>

				<DocExample
					title="Sizes"
					description="Available avatar sizes."
					code={`<Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
<Avatar size="default"><AvatarFallback>MD</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>`}
				>
					<div className="flex items-center gap-2">
						<Avatar size="sm">
							<AvatarFallback>SM</AvatarFallback>
						</Avatar>
						<Avatar size="default">
							<AvatarFallback>MD</AvatarFallback>
						</Avatar>
						<Avatar size="lg">
							<AvatarFallback>LG</AvatarFallback>
						</Avatar>
					</div>
				</DocExample>

				<DocExample
					title="With Badge"
					description="Add a status indicator badge to the avatar."
					code={`<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge />
</Avatar>`}
				>
					<div className="flex items-center gap-4">
						<Avatar size="sm">
							<AvatarFallback>JD</AvatarFallback>
							<AvatarBadge />
						</Avatar>
						<Avatar>
							<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
							<AvatarFallback>CN</AvatarFallback>
							<AvatarBadge />
						</Avatar>
						<Avatar size="lg">
							<AvatarFallback>AB</AvatarFallback>
							<AvatarBadge />
						</Avatar>
					</div>
				</DocExample>

				<DocExample
					title="Avatar Group"
					description="Display multiple avatars in a stacked group."
					code={`<AvatarGroup>
  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
  <AvatarGroupCount>+5</AvatarGroupCount>
</AvatarGroup>`}
				>
					<AvatarGroup>
						<Avatar>
							<AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
							<AvatarFallback>U1</AvatarFallback>
						</Avatar>
						<Avatar>
							<AvatarFallback>U2</AvatarFallback>
						</Avatar>
						<Avatar>
							<AvatarFallback>U3</AvatarFallback>
						</Avatar>
						<Avatar>
							<AvatarFallback>U4</AvatarFallback>
						</Avatar>
						<AvatarGroupCount>+5</AvatarGroupCount>
					</AvatarGroup>
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable
					groups={[
						{ title: "Avatar", props: avatarProps },
						{ title: "AvatarImage", props: avatarImageProps },
					]}
				/>
			</DocSection>

			{/* Tokens */}
			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Avatar uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li><code className="text-xs">bg-raised</code> - Fallback background color</li>
					<li><code className="text-xs">text-fg-muted</code> - Fallback text color</li>
					<li><code className="text-xs">rounded-full</code> - Circular shape</li>
					<li><code className="text-xs">size-8</code> - Small avatar (2rem)</li>
					<li><code className="text-xs">size-10</code> - Default avatar (2.5rem)</li>
					<li><code className="text-xs">size-12</code> - Large avatar (3rem)</li>
					<li><code className="text-xs">bg-green-500</code> - Badge status indicator</li>
				</ul>
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Always provide a fallback for when images fail to load</li>
					<li>Use meaningful initials (first + last name) for fallbacks</li>
					<li>Keep avatar groups to 4-5 visible avatars max</li>
					<li>Use consistent sizes throughout your application</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Badge",
							href: "/docs/components/ui/badge",
							description: "Status indicators that pair well with avatars.",
						},
						{
							title: "Tooltip",
							href: "/docs/components/ui/tooltip",
							description: "Show user names on avatar hover.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
