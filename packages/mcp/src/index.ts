import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import {
	listPatterns,
	loadComponents,
	loadDesignPrinciples,
	loadPattern,
	loadRules,
	loadTokens,
} from "./content/loader.js"
import {
	extractComponentSection,
	parseComponentList,
} from "./content/parse-components.js"

const server = new Server(
	{ name: "@blazz/mcp", version: "0.1.0" },
	{ capabilities: { tools: {} } },
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: [
		{
			name: "list_components",
			description:
				"List all available UI components with name, category, and description",
			inputSchema: { type: "object" as const, properties: {} },
		},
		{
			name: "get_component",
			description:
				"Get full API documentation, props, and usage example for a specific component",
			inputSchema: {
				type: "object" as const,
				properties: {
					name: {
						type: "string",
						description:
							"Component name (e.g. DataGrid, Button, PageHeader)",
					},
				},
				required: ["name"],
			},
		},
		{
			name: "get_pattern",
			description:
				"Get a full page pattern with file structure, code examples, and conventions. Available: resource-list, resource-detail, resource-create-edit, resource-import, dashboard, pipeline-kanban, reporting",
			inputSchema: {
				type: "object" as const,
				properties: {
					name: {
						type: "string",
						description:
							"Pattern name (e.g. resource-list, dashboard, pipeline-kanban)",
					},
				},
				required: ["name"],
			},
		},
		{
			name: "get_rules",
			description:
				"Get the non-negotiable coding rules and conventions (architecture, forms, data fetching, states, accessibility)",
			inputSchema: { type: "object" as const, properties: {} },
		},
		{
			name: "get_design_principles",
			description:
				"Get the design system principles: Tufte data-ink ratio, Gestalt laws, density patterns, spacing, typography, color usage",
			inputSchema: { type: "object" as const, properties: {} },
		},
		{
			name: "get_tokens",
			description:
				"Get the CSS design tokens (surfaces, borders, text, accent, semantic colors, density, layout) for all 3 themes",
			inputSchema: { type: "object" as const, properties: {} },
		},
	],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params

	switch (name) {
		case "list_components": {
			const markdown = loadComponents()
			const components = parseComponentList(markdown)
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(components, null, 2) },
				],
			}
		}

		case "get_component": {
			const componentName = (args?.name as string) ?? ""
			const markdown = loadComponents()
			const section = extractComponentSection(markdown, componentName)
			if (!section) {
				return {
					content: [
						{
							type: "text" as const,
							text: `Component "${componentName}" not found. Use list_components to see available components.`,
						},
					],
					isError: true,
				}
			}
			return { content: [{ type: "text" as const, text: section }] }
		}

		case "get_pattern": {
			const patternName = (args?.name as string) ?? ""
			const available = listPatterns()
			if (!available.includes(patternName)) {
				return {
					content: [
						{
							type: "text" as const,
							text: `Pattern "${patternName}" not found. Available: ${available.join(", ")}`,
						},
					],
					isError: true,
				}
			}
			const content = loadPattern(patternName)
			return { content: [{ type: "text" as const, text: content }] }
		}

		case "get_rules": {
			return {
				content: [{ type: "text" as const, text: loadRules() }],
			}
		}

		case "get_design_principles": {
			return {
				content: [{ type: "text" as const, text: loadDesignPrinciples() }],
			}
		}

		case "get_tokens": {
			return {
				content: [{ type: "text" as const, text: loadTokens() }],
			}
		}

		default:
			return {
				content: [
					{ type: "text" as const, text: `Unknown tool: ${name}` },
				],
				isError: true,
			}
	}
})

const transport = new StdioServerTransport()
await server.connect(transport)
console.error("@blazz/mcp server running")
