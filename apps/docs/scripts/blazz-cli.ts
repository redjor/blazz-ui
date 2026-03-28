#!/usr/bin/env tsx

/**
 * Blazz UI CLI Tool
 *
 * Command-line interface for generating pages and components
 *
 * Usage:
 *   npx tsx scripts/blazz-cli.ts create page <name>
 *   npx tsx scripts/blazz-cli.ts create component <name>
 *   npx tsx scripts/blazz-cli.ts create crud <entity>
 *   npx tsx scripts/blazz-cli.ts theme preview
 */

import * as fs from "node:fs"
import * as path from "node:path"
import * as readline from "node:readline"

// =============================================================================
// Types
// =============================================================================

interface PageTemplate {
	name: string
	description: string
	template: string
	targetPath: (name: string) => string
}

// =============================================================================
// Colors
// =============================================================================

const colors = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	dim: "\x1b[2m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
}

function log(message: string, color = colors.reset) {
	console.log(`${color}${message}${colors.reset}`)
}

function success(message: string) {
	log(`✓ ${message}`, colors.green)
}

function error(message: string) {
	log(`✗ ${message}`, colors.red)
}

function info(message: string) {
	log(`ℹ ${message}`, colors.cyan)
}

function warn(message: string) {
	log(`⚠ ${message}`, colors.yellow)
}

// =============================================================================
// Helpers
// =============================================================================

function toPascalCase(str: string): string {
	return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^(.)/, (c) => c.toUpperCase())
}

function toKebabCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase()
}

function ensureDir(dirPath: string) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
}

function fileExists(filePath: string): boolean {
	return fs.existsSync(filePath)
}

async function promptConfirm(question: string): Promise<boolean> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	return new Promise((resolve) => {
		rl.question(`${question} (y/N): `, (answer) => {
			rl.close()
			resolve(answer.toLowerCase() === "y")
		})
	})
}

// =============================================================================
// Page Templates
// =============================================================================

const pageTemplates: Record<string, PageTemplate> = {
	simple: {
		name: "Simple List",
		description: "List page with cards",
		template: "templates/pages/simple-list.tsx",
		targetPath: (name) => `app/(frame)/${toKebabCase(name)}/page.tsx`,
	},
	crud: {
		name: "CRUD with DataTable",
		description: "Full CRUD page with DataTable",
		template: "templates/pages/data-table-page.tsx",
		targetPath: (name) => `app/(frame)/${toKebabCase(name)}/page.tsx`,
	},
	form: {
		name: "Multi-Step Form",
		description: "Form with multiple steps",
		template: "templates/pages/form-page.tsx",
		targetPath: (name) => `app/(frame)/${toKebabCase(name)}/page.tsx`,
	},
	dashboard: {
		name: "Dashboard",
		description: "Dashboard with metrics",
		template: "templates/pages/dashboard-page.tsx",
		targetPath: (name) => `app/(frame)/${toKebabCase(name)}/page.tsx`,
	},
	settings: {
		name: "Settings",
		description: "Settings page with tabs",
		template: "templates/pages/settings-page.tsx",
		targetPath: (name) => `app/(frame)/${toKebabCase(name)}/page.tsx`,
	},
}

// =============================================================================
// Component Templates
// =============================================================================

const componentTemplate = `/**
 * {{NAME}} Component
 *
 * TODO: Add component description
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const {{CAMEL_NAME}}Variants = cva(
  'transition-colors outline-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-muted',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface {{NAME}}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof {{CAMEL_NAME}}Variants> {
  // Add your props here
}

export const {{NAME}} = React.forwardRef<HTMLDivElement, {{NAME}}Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn({{CAMEL_NAME}}Variants({ variant, size, className }))}
        data-slot="{{KEBAB_NAME}}"
        {...props}
      />
    )
  }
)

{{NAME}}.displayName = '{{NAME}}'
`

// =============================================================================
// Commands
// =============================================================================

async function createPage(name: string, template: string = "simple") {
	log("", colors.magenta)
	log("Creating new page...", colors.bold)
	log("", colors.reset)

	if (!name) {
		error("Page name is required")
		info("Usage: npx tsx scripts/blazz-cli.ts create page <name> [template]")
		process.exit(1)
	}

	const templateConfig = pageTemplates[template]

	if (!templateConfig) {
		error(`Template "${template}" not found`)
		info(`Available templates: ${Object.keys(pageTemplates).join(", ")}`)
		process.exit(1)
	}

	const targetPath = templateConfig.targetPath(name)
	const templatePath = templateConfig.template

	// Check if template exists
	if (!fileExists(templatePath)) {
		error(`Template file not found: ${templatePath}`)
		process.exit(1)
	}

	// Check if target already exists
	if (fileExists(targetPath)) {
		warn(`File already exists: ${targetPath}`)
		const shouldOverwrite = await promptConfirm("Overwrite?")
		if (!shouldOverwrite) {
			info("Cancelled")
			process.exit(0)
		}
	}

	// Create target directory
	const targetDir = path.dirname(targetPath)
	ensureDir(targetDir)

	// Copy template
	const templateContent = fs.readFileSync(templatePath, "utf-8")
	fs.writeFileSync(targetPath, templateContent)

	success(`Created page: ${targetPath}`)
	info(`Template used: ${templateConfig.name}`)
	log("")
	info("Next steps:")
	info("  1. Replace TODO comments with your data")
	info("  2. Update types and schemas")
	info("  3. Test the page")
}

async function createComponent(name: string) {
	log("", colors.magenta)
	log("Creating new component...", colors.bold)
	log("", colors.reset)

	if (!name) {
		error("Component name is required")
		info("Usage: npx tsx scripts/blazz-cli.ts create component <name>")
		process.exit(1)
	}

	const pascalName = toPascalCase(name)
	const kebabName = toKebabCase(name)
	const camelName = pascalName.charAt(0).toLowerCase() + pascalName.slice(1)

	const targetPath = `components/ui/${kebabName}.tsx`

	// Check if exists
	if (fileExists(targetPath)) {
		warn(`Component already exists: ${targetPath}`)
		const shouldOverwrite = await promptConfirm("Overwrite?")
		if (!shouldOverwrite) {
			info("Cancelled")
			process.exit(0)
		}
	}

	// Generate component code
	const componentCode = componentTemplate
		.replace(/{{NAME}}/g, pascalName)
		.replace(/{{CAMEL_NAME}}/g, camelName)
		.replace(/{{KEBAB_NAME}}/g, kebabName)

	// Write file
	fs.writeFileSync(targetPath, componentCode)

	success(`Created component: ${targetPath}`)
	log("")
	info("Next steps:")
	info("  1. Customize the component implementation")
	info("  2. Add props and variants as needed")
	info("  3. Create Storybook story (optional)")
	info("  4. Add tests (optional)")
	log("")
	info("Import in your code:")
	log(`  import { ${pascalName} } from '@blazz/ui/components/ui/${kebabName}'`, colors.cyan)
}

async function createCrud(entity: string) {
	log("", colors.magenta)
	log("Creating CRUD pages...", colors.bold)
	log("", colors.reset)

	if (!entity) {
		error("Entity name is required")
		info("Usage: npx tsx scripts/blazz-cli.ts create crud <entity>")
		process.exit(1)
	}

	const pascalName = toPascalCase(entity)
	const kebabName = toKebabCase(entity)

	info(`Generating CRUD for entity: ${pascalName}`)
	log("")

	// Create page
	await createPage(kebabName, "crud")

	log("")
	success("CRUD scaffolding complete!")
	log("")
	info("Files created:")
	info(`  - app/(frame)/${kebabName}/page.tsx`)
	log("")
	info("Next steps:")
	info("  1. Define your entity types and schema")
	info("  2. Configure DataTable columns")
	info("  3. Implement API calls")
	info("  4. Add filters and bulk actions")
}

function themePreview() {
	log("", colors.magenta)
	log("Theme Color Preview", colors.bold)
	log("", colors.reset)

	const cssVarsPath = "app/globals.css"

	if (!fileExists(cssVarsPath)) {
		error("globals.css not found")
		process.exit(1)
	}

	const cssContent = fs.readFileSync(cssVarsPath, "utf-8")

	// Extract color variables
	const colorRegex = /--([a-z-]+):\s*([^;]+);/g
	const cssColors: Record<string, string> = {}

	let match: RegExpExecArray | null = colorRegex.exec(cssContent)
	while (match !== null) {
		cssColors[match[1]] = match[2].trim()
		match = colorRegex.exec(cssContent)
	}

	// Display colors
	log("Color Variables:", colors.cyan)
	log("", colors.reset)

	Object.entries(cssColors).forEach(([name, value]) => {
		log(`  --${name}: ${value}`)
	})

	log("")
	info("To modify colors, edit: app/globals.css")
}

function showHelp() {
	log("", colors.magenta)
	log("Blazz UI CLI", colors.bold)
	log("", colors.reset)

	log("Usage:", colors.cyan)
	log("  npx tsx scripts/blazz-cli.ts <command> [options]")
	log("")

	log("Commands:", colors.cyan)
	log("")

	log("  create page <name> [template]", colors.yellow)
	log("    Create a new page from template")
	log(`    Templates: ${Object.keys(pageTemplates).join(", ")}`)
	log("    Example: npx tsx scripts/blazz-cli.ts create page products crud")
	log("")

	log("  create component <name>", colors.yellow)
	log("    Create a new UI component")
	log("    Example: npx tsx scripts/blazz-cli.ts create component status-badge")
	log("")

	log("  create crud <entity>", colors.yellow)
	log("    Generate complete CRUD pages")
	log("    Example: npx tsx scripts/blazz-cli.ts create crud user")
	log("")

	log("  theme preview", colors.yellow)
	log("    Preview current theme colors")
	log("    Example: npx tsx scripts/blazz-cli.ts theme preview")
	log("")

	log("  help", colors.yellow)
	log("    Show this help message")
	log("")
}

// =============================================================================
// Main
// =============================================================================

async function main() {
	const args = process.argv.slice(2)

	if (args.length === 0) {
		showHelp()
		process.exit(0)
	}

	const [command, subcommand, ...rest] = args

	try {
		if (command === "create") {
			if (subcommand === "page") {
				const [name, template = "simple"] = rest
				await createPage(name, template)
			} else if (subcommand === "component") {
				const [name] = rest
				await createComponent(name)
			} else if (subcommand === "crud") {
				const [entity] = rest
				await createCrud(entity)
			} else {
				error(`Unknown subcommand: ${subcommand}`)
				showHelp()
				process.exit(1)
			}
		} else if (command === "theme") {
			if (subcommand === "preview") {
				themePreview()
			} else {
				error(`Unknown subcommand: ${subcommand}`)
				showHelp()
				process.exit(1)
			}
		} else if (command === "help" || command === "--help" || command === "-h") {
			showHelp()
		} else {
			error(`Unknown command: ${command}`)
			showHelp()
			process.exit(1)
		}
	} catch (err) {
		error(`Error: ${err instanceof Error ? err.message : String(err)}`)
		process.exit(1)
	}
}

main()
