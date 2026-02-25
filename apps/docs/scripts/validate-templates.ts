#!/usr/bin/env tsx

/**
 * Script de validation des templates
 *
 * Vérifie que tous les templates:
 * - Compilent sans erreurs TypeScript
 * - Utilisent les imports corrects (@/ alias)
 * - Utilisent des composants UI existants
 * - Suivent les conventions du projet
 */

import { execSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

interface ValidationResult {
	file: string
	valid: boolean
	errors: string[]
	warnings: string[]
}

const results: ValidationResult[] = []

// Colors for terminal output
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	bold: '\x1b[1m',
}

function log(message: string, color?: keyof typeof colors) {
	const colorCode = color ? colors[color] : ''
	console.log(`${colorCode}${message}${colors.reset}`)
}

function validateFile(filePath: string): ValidationResult {
	const result: ValidationResult = {
		file: filePath,
		valid: true,
		errors: [],
		warnings: [],
	}

	try {
		const content = readFileSync(filePath, 'utf-8')

		// 1. Vérifier les imports avec alias @/
		const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g
		let match: RegExpExecArray | null

		while ((match = importRegex.exec(content)) !== null) {
			const importPath = match[1]

			// Vérifier les imports relatifs (devrait utiliser @/)
			if (importPath.startsWith('../') || importPath.startsWith('./')) {
				if (!importPath.startsWith('./') || importPath.includes('../')) {
					result.warnings.push(
						`Import relatif détecté: "${importPath}" - Préférez l'alias @/`
					)
				}
			}

			// Vérifier que les composants UI existent
			if (importPath.startsWith('@blazz/ui/components/ui/')) {
				const componentName = importPath.replace('@blazz/ui/components/ui/', '').split('/')[0]
				// Liste des composants UI documentés
				const uiComponents = [
					'button',
					'input',
					'card',
					'dialog',
					'form',
					'field',
					'label',
					'select',
					'checkbox',
					'switch',
					'tabs',
					'badge',
					'avatar',
					'alert',
					'popover',
					'tooltip',
					'dropdown-menu',
					'menu',
					'command',
					'combobox',
					'separator',
					'skeleton',
					'scroll-area',
					'sheet',
					'breadcrumb',
					'collapsible',
					'textarea',
					'table',
					'sidebar',
					'page',
					'box',
					'tags-input',
					'confirmation-dialog',
				]

				if (!uiComponents.includes(componentName)) {
					result.errors.push(`Composant UI inconnu: "${componentName}"`)
					result.valid = false
				}
			}
		}

		// 2. Vérifier 'use client' pour les composants interactifs
		const hasUseClient = content.includes("'use client'") || content.includes('"use client"')
		const hasInteractiveFeatures =
			content.includes('useState') ||
			content.includes('useEffect') ||
			content.includes('onClick') ||
			content.includes('onChange')

		if (hasInteractiveFeatures && !hasUseClient) {
			result.warnings.push(
				"Composant interactif sans 'use client' - Ajoutez 'use client' en haut du fichier"
			)
		}

		// 3. Vérifier l'export default
		if (!content.includes('export default')) {
			result.errors.push('Aucun export default trouvé')
			result.valid = false
		}

		// 4. Vérifier les types TypeScript
		if (
			content.includes(': any') ||
			content.includes('as any') ||
			content.includes('// @ts-ignore')
		) {
			result.warnings.push('Types TypeScript faibles détectés (any, @ts-ignore)')
		}

		// 5. Vérifier TypeScript compile
		try {
			execSync(`npx tsc --noEmit ${filePath}`, {
				stdio: 'pipe',
				encoding: 'utf-8',
			})
		} catch (error) {
			// TypeScript errors
			if (error instanceof Error && 'stdout' in error) {
				const tsError = (error as any).stdout || (error as any).stderr
				result.errors.push(`Erreur TypeScript: ${tsError}`)
				result.valid = false
			}
		}
	} catch (error) {
		result.errors.push(
			`Erreur de lecture du fichier: ${error instanceof Error ? error.message : String(error)}`
		)
		result.valid = false
	}

	return result
}

function getTemplateFiles(dir: string): string[] {
	const files: string[] = []

	function traverse(currentDir: string) {
		const items = readdirSync(currentDir, { withFileTypes: true })

		for (const item of items) {
			const fullPath = join(currentDir, item.name)

			if (item.isDirectory()) {
				traverse(fullPath)
			} else if (item.name.endsWith('.tsx') && !item.name.includes('.test.')) {
				files.push(fullPath)
			}
		}
	}

	traverse(dir)
	return files
}

// Main execution
function main() {
	log('\n🔍 Validation des templates...\n', 'blue')

	const templatesDir = join(process.cwd(), 'templates')
	const templateFiles = getTemplateFiles(templatesDir)

	if (templateFiles.length === 0) {
		log('❌ Aucun template trouvé', 'red')
		process.exit(1)
	}

	log(`📁 ${templateFiles.length} templates trouvés\n`, 'blue')

	// Valider chaque fichier
	for (const file of templateFiles) {
		const relativePath = file.replace(process.cwd() + '/', '')
		process.stdout.write(`Validation de ${relativePath}... `)

		const result = validateFile(file)
		results.push(result)

		if (result.valid && result.warnings.length === 0) {
			log('✅', 'green')
		} else if (result.valid && result.warnings.length > 0) {
			log('⚠️', 'yellow')
		} else {
			log('❌', 'red')
		}
	}

	// Afficher le résumé
	log('\n' + '='.repeat(60), 'blue')
	log('📊 RÉSUMÉ', 'bold')
	log('='.repeat(60), 'blue')

	const validCount = results.filter((r) => r.valid).length
	const warningCount = results.filter((r) => r.warnings.length > 0).length
	const errorCount = results.filter((r) => !r.valid).length

	log(`\n✅ Valides: ${validCount}/${results.length}`, validCount === results.length ? 'green' : 'yellow')
	if (warningCount > 0) {
		log(`⚠️  Warnings: ${warningCount}`, 'yellow')
	}
	if (errorCount > 0) {
		log(`❌ Erreurs: ${errorCount}`, 'red')
	}

	// Afficher les détails des erreurs et warnings
	for (const result of results) {
		if (result.errors.length > 0 || result.warnings.length > 0) {
			log(`\n📄 ${result.file.replace(process.cwd() + '/', '')}`, 'bold')

			if (result.errors.length > 0) {
				log('\n  Erreurs:', 'red')
				for (const error of result.errors) {
					log(`    ❌ ${error}`, 'red')
				}
			}

			if (result.warnings.length > 0) {
				log('\n  Warnings:', 'yellow')
				for (const warning of result.warnings) {
					log(`    ⚠️  ${warning}`, 'yellow')
				}
			}
		}
	}

	log('\n' + '='.repeat(60) + '\n', 'blue')

	// Exit code
	if (errorCount > 0) {
		log('❌ Validation échouée', 'red')
		process.exit(1)
	} else if (warningCount > 0) {
		log('⚠️  Validation réussie avec warnings', 'yellow')
		process.exit(0)
	} else {
		log('✅ Tous les templates sont valides!', 'green')
		process.exit(0)
	}
}

main()
