"use client"

import { Page } from "@/components/ui/page"
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarBadge,
} from "@/components/ui/avatar"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const avatarProps: PropDefinition[] = [
	{
		name: "size",
		type: '"sm" | "default" | "lg"',
		default: '"default"',
		description: "The size of the avatar.",
	},
]

const avatarImageProps: PropDefinition[] = [
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
		<Page
			title="Avatar"
			subtitle="Display user profile images with fallback support for initials or icons."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Avatar Props</h2>
					<PropsTable props={avatarProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">AvatarImage Props</h2>
					<PropsTable props={avatarImageProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Avatar uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-muted</code> - Fallback background color
						</li>
						<li>
							<code className="text-xs">text-muted-foreground</code> - Fallback text color
						</li>
						<li>
							<code className="text-xs">rounded-full</code> - Circular shape
						</li>
						<li>
							<code className="text-xs">size-8</code> - Small avatar (2rem)
						</li>
						<li>
							<code className="text-xs">size-10</code> - Default avatar (2.5rem)
						</li>
						<li>
							<code className="text-xs">size-12</code> - Large avatar (3rem)
						</li>
						<li>
							<code className="text-xs">bg-green-500</code> - Badge status indicator
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Always provide a fallback for when images fail to load</li>
						<li>Use meaningful initials (first + last name) for fallbacks</li>
						<li>Keep avatar groups to 4-5 visible avatars max</li>
						<li>Use consistent sizes throughout your application</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
