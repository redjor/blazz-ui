import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
	plugins: [react()],
	test: {
		name: 'blazz-ui',
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		include: ['**/*.{test,spec}.{ts,tsx}'],
		exclude: ['node_modules', 'dist', '.next', 'out'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'tests/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/mockData',
				'dist/',
				'.next/',
				'out/',
			],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './'),
		},
	},
})
