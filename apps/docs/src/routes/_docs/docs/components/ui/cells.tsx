import {
	CellAvatarGroup,
	CellBoolean,
	CellColorDot,
	CellDuration,
	CellImage,
	CellKeyValue,
	CellLink,
	CellProgress,
	CellRating,
	CellRelativeDate,
	CellSparkline,
	CellTags,
	CellTwoLines,
	CellUser,
	CellValidation,
} from "@blazz/pro/components/blocks/data-table"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const mockTeam = [
	{ name: "Alice Martin", avatar: "https://i.pravatar.cc/80?u=alice" },
	{ name: "Bob Chen", avatar: "https://i.pravatar.cc/80?u=bob" },
	{ name: "Carla Ruiz", avatar: "https://i.pravatar.cc/80?u=carla" },
	{ name: "David Kim" },
	{ name: "Eva Dupont", avatar: "https://i.pravatar.cc/80?u=eva" },
]

const sparkData = [12, 18, 14, 22, 28, 25, 32, 30, 35, 40]

const examples = [
	{
		key: "tags",
		code: `col.tags("labels", {
  colorMap: { bug: "critical", feature: "info", docs: "success" },
  max: 3,
})`,
	},
	{
		key: "validation",
		code: `col.validation("status", {
  rules: (row) => {
    if (!row.email) return { level: "error", message: "Email required" }
    return { level: "success", message: "All good" }
  },
})`,
	},
	{
		key: "progress",
		code: `col.progress("completion", {
  showLabel: true,
  colorThresholds: { warn: 50, danger: 25 },
})`,
	},
	{
		key: "rating",
		code: `col.rating("score")
col.rating("priority", { variant: "dot", max: 3 })`,
	},
	{
		key: "link",
		code: `col.link("website", { type: "url" })
col.link("email", { type: "email" })
col.link("phone", { type: "tel" })`,
	},
	{
		key: "boolean",
		code: `col.boolean("active", { variant: "badge", labels: { true: "Active", false: "Inactive" } })`,
	},
	{
		key: "avatar-group",
		code: `col.avatarGroup("members", { max: 3, size: "sm" })`,
	},
	{
		key: "relative-date",
		code: `col.relativeDate("updatedAt")`,
	},
	{
		key: "user",
		code: `col.user("owner", {
  avatarAccessor: "ownerAvatar",
  subtitleAccessor: "ownerRole",
})`,
	},
	{
		key: "duration",
		code: `col.duration("timeSpent", { unit: "minutes" })`,
	},
	{
		key: "color-dot",
		code: `col.colorDot("priority", {
  colorMap: { High: "bg-red-500", Medium: "bg-amber-500", Low: "bg-green-500" },
})`,
	},
	{
		key: "image",
		code: `col.image("thumbnail", { size: 48, rounded: "md" })`,
	},
	{
		key: "sparkline",
		code: `col.sparkline("trend", { type: "line" })
col.sparkline("revenue", { type: "bar", width: 100 })`,
	},
	{
		key: "two-lines",
		code: `col.twoLines("contact", {
  subAccessor: "contactEmail",
})`,
	},
	{
		key: "key-value",
		code: `col.keyValue("metadata", {
  labelAccessor: "metaKey",
})`,
	},
	{
		key: "full-example",
		code: `import { col } from "@blazz/pro/components/blocks/data-table"

const columns = [
  col.selection(),
  col.imageText("name", {
    imageAccessor: "avatar",
    showInlineFilter: true,
  }),
  col.tags("labels", {
    colorMap: { bug: "critical", feature: "info" },
    max: 3,
  }),
  col.progress("completion", { showLabel: true }),
  col.rating("priority", { variant: "dot", max: 3 }),
  col.avatarGroup("team", { max: 3 }),
  col.relativeDate("updatedAt"),
  col.sparkline("trend"),
  col.boolean("active", { variant: "badge" }),
  col.link("website"),
  col.currency("revenue"),
]

<DataTable columns={columns} data={projects} />`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/cells")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: CellTypesPage,
})

const toc = [
	{ id: "tier-1", title: "Tier 1 — Core Business" },
	{ id: "tier-2", title: "Tier 2 — Rich Content" },
	{ id: "tier-3", title: "Tier 3 — Composites" },
	{ id: "col-usage", title: "Usage with col.*" },
	{ id: "props", title: "Props Reference" },
	{ id: "related", title: "Related" },
]

const tagsProps: DocProp[] = [
	{ name: "items", type: "string[]", description: "List of tag strings to display." },
	{
		name: "colorMap",
		type: "Record<string, string>",
		description: "Map tag values to Badge variant names.",
	},
	{
		name: "max",
		type: "number",
		default: "3",
		description: "Maximum visible tags before +N overflow.",
	},
	{ name: "variant", type: '"badge" | "dot"', default: '"badge"', description: "Display style." },
]

const validationProps: DocProp[] = [
	{
		name: "level",
		type: '"success" | "warning" | "error" | "info"',
		description: "Validation severity level.",
	},
	{ name: "message", type: "string", description: "Message displayed in the tooltip." },
]

const progressProps: DocProp[] = [
	{ name: "value", type: "number", description: "Progress value between 0 and 100." },
	{
		name: "showLabel",
		type: "boolean",
		default: "false",
		description: "Show percentage label to the right.",
	},
	{
		name: "colorThresholds",
		type: "{ warn: number; danger: number }",
		description: "Thresholds that change the bar color.",
	},
]

const ratingProps: DocProp[] = [
	{ name: "value", type: "number", description: "Current rating value." },
	{ name: "max", type: "number", default: "5", description: "Maximum rating." },
	{ name: "variant", type: '"star" | "dot"', default: '"star"', description: "Display style." },
]

const linkProps: DocProp[] = [
	{ name: "value", type: "string", description: "The link value (URL, email, or phone number)." },
	{
		name: "type",
		type: '"url" | "email" | "tel"',
		default: '"url"',
		description: "Link type determines prefix and icon.",
	},
	{
		name: "showIcon",
		type: "boolean",
		default: "true",
		description: "Show an icon next to the link.",
	},
	{
		name: "maxWidth",
		type: "number",
		description: "Maximum width in pixels — triggers truncation.",
	},
]

const booleanProps: DocProp[] = [
	{ name: "value", type: "boolean", description: "The boolean value to render." },
	{
		name: "variant",
		type: '"checkbox" | "badge" | "icon"',
		default: '"icon"',
		description: "Display style.",
	},
	{
		name: "labels",
		type: "{ true: string; false: string }",
		description: "Custom labels for true/false states.",
	},
]

const avatarGroupProps: DocProp[] = [
	{
		name: "items",
		type: "AvatarItem[]",
		description: "List of people to display ({ name, avatar? }).",
	},
	{
		name: "max",
		type: "number",
		default: "4",
		description: "Maximum visible avatars before overflow.",
	},
	{ name: "size", type: '"sm" | "md"', default: '"sm"', description: "Avatar size." },
]

const relativeDateProps: DocProp[] = [
	{ name: "value", type: "string | Date", description: "Date value as string or Date object." },
	{ name: "locale", type: "string", default: '"fr-FR"', description: "Locale for formatting." },
]

const userProps: DocProp[] = [
	{ name: "name", type: "string", description: "User display name." },
	{ name: "avatar", type: "string", description: "URL of the avatar image." },
	{ name: "subtitle", type: "string", description: "Gray subtitle below the name (email, role)." },
	{ name: "size", type: '"sm" | "md"', default: '"sm"', description: "Avatar size." },
]

const durationProps: DocProp[] = [
	{ name: "value", type: "number", description: "Duration value in the specified unit." },
	{
		name: "unit",
		type: '"seconds" | "minutes" | "hours"',
		default: '"minutes"',
		description: "Input unit.",
	},
]

const colorDotProps: DocProp[] = [
	{ name: "value", type: "string", description: "The value/label to display." },
	{
		name: "colorMap",
		type: "Record<string, string>",
		description: "Map of value to Tailwind bg class.",
	},
]

const imageProps: DocProp[] = [
	{ name: "src", type: "string", description: "Image source URL." },
	{ name: "alt", type: "string", description: "Alt text for the image." },
	{ name: "size", type: "number", default: "40", description: "Image size in pixels." },
	{
		name: "rounded",
		type: '"sm" | "md" | "full"',
		default: '"sm"',
		description: "Border radius style.",
	},
]

const sparklineProps: DocProp[] = [
	{ name: "values", type: "number[]", description: "Array of numeric data points." },
	{ name: "type", type: '"line" | "bar"', default: '"line"', description: "Chart type." },
	{
		name: "color",
		type: "string",
		default: '"oklch(0.585 0.22 275)"',
		description: "Stroke/fill color.",
	},
	{ name: "height", type: "number", default: "24", description: "SVG height in pixels." },
	{ name: "width", type: "number", default: "80", description: "SVG width in pixels." },
]

const twoLinesProps: DocProp[] = [
	{ name: "main", type: "string", description: "Primary text (top line)." },
	{ name: "sub", type: "string", description: "Secondary text (bottom line)." },
]

const keyValueProps: DocProp[] = [
	{ name: "label", type: "string", description: "The label/key displayed in muted text." },
	{ name: "value", type: "string", description: "The value displayed in normal text." },
]

function CellTypesPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Cell Types"
			subtitle="15 specialized cell renderers for the DataTable. Each provides a visual representation optimized for its data type, with consistent empty-state handling and composability."
			toc={toc}
		>
			<DocHero>
				<div className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3">
					<div className="flex flex-col gap-1">
						<span className="text-xs text-fg-muted">Tags</span>
						<CellTags
							items={["React", "TypeScript", "Tailwind", "Next.js"]}
							colorMap={{ React: "info", TypeScript: "default", Tailwind: "success" }}
							max={3}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-xs text-fg-muted">Progress</span>
						<CellProgress value={72} showLabel colorThresholds={{ warn: 50, danger: 25 }} />
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-xs text-fg-muted">Rating</span>
						<CellRating value={4} />
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-xs text-fg-muted">Avatar Group</span>
						<CellAvatarGroup items={mockTeam} max={3} />
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-xs text-fg-muted">Sparkline</span>
						<CellSparkline values={sparkData} />
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-xs text-fg-muted">User</span>
						<CellUser
							name="Alice Martin"
							avatar="https://i.pravatar.cc/80?u=alice"
							subtitle="Design Lead"
						/>
					</div>
				</div>
			</DocHero>

			<DocSection id="tier-1" title="Tier 1 — Core Business">
				<DocExampleClient
					title="Tags"
					description="Renders an array of strings as colored badges with +N overflow popover."
					code={examples[0].code}
					highlightedCode={html("tags")}
				>
					<div className="flex flex-col gap-4">
						<CellTags
							items={["bug", "feature", "docs", "performance", "a11y"]}
							colorMap={{ bug: "critical", feature: "info", docs: "success" }}
							max={3}
						/>
						<CellTags items={["React", "Vue"]} variant="dot" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Validation"
					description="Status icon (check, warning, error, info) with a tooltip message."
					code={examples[1].code}
					highlightedCode={html("validation")}
				>
					<div className="flex items-center gap-6">
						<CellValidation level="success" message="All fields complete" />
						<CellValidation level="warning" message="Missing phone number" />
						<CellValidation level="error" message="Email required" />
						<CellValidation level="info" message="New contact" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Progress"
					description="Mini progress bar with optional percentage label and color thresholds."
					code={examples[2].code}
					highlightedCode={html("progress")}
				>
					<div className="flex w-64 flex-col gap-3">
						<CellProgress value={85} showLabel />
						<CellProgress value={45} showLabel colorThresholds={{ warn: 50, danger: 25 }} />
						<CellProgress value={15} showLabel colorThresholds={{ warn: 50, danger: 25 }} />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Rating"
					description="Stars or dots for visual scoring (1-5)."
					code={examples[3].code}
					highlightedCode={html("rating")}
				>
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<span className="w-16 text-xs text-fg-muted">Stars</span>
							<CellRating value={4} />
						</div>
						<div className="flex items-center gap-3">
							<span className="w-16 text-xs text-fg-muted">Dots</span>
							<CellRating value={2} variant="dot" max={3} />
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Link"
					description="Clickable link with automatic icon for URL, email, or phone."
					code={examples[4].code}
					highlightedCode={html("link")}
				>
					<div className="flex flex-col gap-2">
						<CellLink value="https://blazz-ui.dev" type="url" />
						<CellLink value="contact@blazz-ui.dev" type="email" />
						<CellLink value="+33 1 23 45 67 89" type="tel" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Boolean"
					description="Checkbox, badge, or icon for boolean values."
					code={examples[5].code}
					highlightedCode={html("boolean")}
				>
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-6">
							<span className="w-20 text-xs text-fg-muted">Icon</span>
							<CellBoolean value={true} variant="icon" />
							<CellBoolean value={false} variant="icon" />
						</div>
						<div className="flex items-center gap-6">
							<span className="w-20 text-xs text-fg-muted">Badge</span>
							<CellBoolean
								value={true}
								variant="badge"
								labels={{ true: "Active", false: "Inactive" }}
							/>
							<CellBoolean
								value={false}
								variant="badge"
								labels={{ true: "Active", false: "Inactive" }}
							/>
						</div>
						<div className="flex items-center gap-6">
							<span className="w-20 text-xs text-fg-muted">Checkbox</span>
							<CellBoolean value={true} variant="checkbox" />
							<CellBoolean value={false} variant="checkbox" />
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Avatar Group"
					description="Overlapping circular avatars with +N overflow and tooltip on each."
					code={examples[6].code}
					highlightedCode={html("avatar-group")}
				>
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-4">
							<span className="w-10 text-xs text-fg-muted">sm</span>
							<CellAvatarGroup items={mockTeam} max={3} size="sm" />
						</div>
						<div className="flex items-center gap-4">
							<span className="w-10 text-xs text-fg-muted">md</span>
							<CellAvatarGroup items={mockTeam} max={3} size="md" />
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="tier-2" title="Tier 2 — Rich Content">
				<DocExampleClient
					title="Relative Date"
					description="Human-readable relative time with exact date tooltip."
					code={examples[7].code}
					highlightedCode={html("relative-date")}
				>
					<div className="flex flex-col gap-2">
						<CellRelativeDate value={new Date(Date.now() - 3 * 60 * 60 * 1000)} />
						<CellRelativeDate value={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)} />
						<CellRelativeDate value={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)} />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="User"
					description="Avatar + name with optional subtitle."
					code={examples[8].code}
					highlightedCode={html("user")}
				>
					<div className="flex flex-col gap-3">
						<CellUser
							name="Alice Martin"
							avatar="https://i.pravatar.cc/80?u=alice"
							subtitle="Design Lead"
						/>
						<CellUser name="Bob Chen" subtitle="Engineer" />
						<CellUser name="Carla Ruiz" avatar="https://i.pravatar.cc/80?u=carla" size="md" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Duration"
					description="Smart format: 45s, 12m 30s, 2h 30m, 3d 2h."
					code={examples[9].code}
					highlightedCode={html("duration")}
				>
					<div className="flex items-center gap-6">
						<CellDuration value={45} unit="seconds" />
						<CellDuration value={150} unit="minutes" />
						<CellDuration value={8.5} unit="hours" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Color Dot"
					description="Colored dot + label for visual categorization."
					code={examples[10].code}
					highlightedCode={html("color-dot")}
				>
					<div className="flex flex-col gap-2">
						<CellColorDot value="High" colorMap={{ High: "bg-red-500" }} />
						<CellColorDot value="Medium" colorMap={{ Medium: "bg-amber-500" }} />
						<CellColorDot value="Low" colorMap={{ Low: "bg-green-500" }} />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Image"
					description="Clickable thumbnail with configurable size and border radius."
					code={examples[11].code}
					highlightedCode={html("image")}
				>
					<div className="flex items-center gap-4">
						<CellImage
							src="https://i.pravatar.cc/80?u=prod1"
							alt="Product"
							size={40}
							rounded="sm"
						/>
						<CellImage
							src="https://i.pravatar.cc/80?u=prod2"
							alt="Product"
							size={48}
							rounded="md"
						/>
						<CellImage src="https://i.pravatar.cc/80?u=prod3" alt="User" size={40} rounded="full" />
						<CellImage src="" alt="Empty" size={40} rounded="sm" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Sparkline"
					description="Inline SVG chart (line or bar) — no external library needed."
					code={examples[12].code}
					highlightedCode={html("sparkline")}
				>
					<div className="flex items-center gap-8">
						<div className="flex flex-col items-center gap-1">
							<span className="text-xs text-fg-muted">Line</span>
							<CellSparkline values={sparkData} type="line" />
						</div>
						<div className="flex flex-col items-center gap-1">
							<span className="text-xs text-fg-muted">Bar</span>
							<CellSparkline values={sparkData} type="bar" width={100} />
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="tier-3" title="Tier 3 — Composites">
				<DocExampleClient
					title="Two Lines"
					description="Primary text + muted subtitle stacked vertically."
					code={examples[13].code}
					highlightedCode={html("two-lines")}
				>
					<div className="flex flex-col gap-3">
						<CellTwoLines main="Alice Martin" sub="alice@example.com" />
						<CellTwoLines main="Enterprise Plan" sub="$299/month" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Key Value"
					description="Inline label: value pair for compact metadata display."
					code={examples[14].code}
					highlightedCode={html("key-value")}
				>
					<div className="flex flex-col gap-2">
						<CellKeyValue label="Industry" value="SaaS" />
						<CellKeyValue label="Size" value="50-200 employees" />
						<CellKeyValue label="Region" value="Europe" />
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="col-usage" title="Usage with col.*">
				<p className="text-sm text-fg-muted mb-4">
					All cell types are available as shorthand methods on the{" "}
					<code className="text-xs bg-surface-3 px-1.5 py-0.5 rounded">col</code> namespace. The
					accessor key is the first argument, options are the second. Title is auto-derived from the
					key.
				</p>
				<DocExampleClient
					title="Full Example"
					description="A complete table definition using various cell types."
					code={examples[15].code}
					highlightedCode={html("full-example")}
				>
					<div className="rounded-lg border border-edge-subtle bg-surface-3/50 p-6">
						<p className="text-sm text-fg-muted text-center">
							Each <code className="text-xs bg-surface-3 px-1.5 py-0.5 rounded">col.*</code> method
							returns a fully typed column definition ready to pass to{" "}
							<code className="text-xs bg-surface-3 px-1.5 py-0.5 rounded">DataTable</code>.
						</p>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props Reference">
				<div className="space-y-8">
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellTags</h3>
						<DocPropsTable props={tagsProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellValidation</h3>
						<DocPropsTable props={validationProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellProgress</h3>
						<DocPropsTable props={progressProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellRating</h3>
						<DocPropsTable props={ratingProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellLink</h3>
						<DocPropsTable props={linkProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellBoolean</h3>
						<DocPropsTable props={booleanProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellAvatarGroup</h3>
						<DocPropsTable props={avatarGroupProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellRelativeDate</h3>
						<DocPropsTable props={relativeDateProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellUser</h3>
						<DocPropsTable props={userProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellDuration</h3>
						<DocPropsTable props={durationProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellColorDot</h3>
						<DocPropsTable props={colorDotProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellImage</h3>
						<DocPropsTable props={imageProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellSparkline</h3>
						<DocPropsTable props={sparklineProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellTwoLines</h3>
						<DocPropsTable props={twoLinesProps} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-fg mb-3">CellKeyValue</h3>
						<DocPropsTable props={keyValueProps} />
					</div>
				</div>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Data Table",
							href: "/docs/components/ui/data-table",
							description:
								"The full DataTable component that uses these cell types via the col.* namespace.",
						},
						{
							title: "Badge",
							href: "/docs/components/ui/badge",
							description: "The Badge primitive used by CellTags, CellBoolean, and CellValidation.",
						},
						{
							title: "Avatar",
							href: "/docs/components/ui/avatar",
							description: "The Avatar primitive used by CellUser and CellAvatarGroup.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
