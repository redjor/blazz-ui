/**
 * Test Utilities
 *
 * Helper functions for testing React components
 */

import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement } from 'react'

/**
 * Custom render function with providers
 *
 * Wraps components with necessary providers for testing
 */
export function renderWithProviders(
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>
) {
	// Add providers here if needed (ThemeProvider, etc.)
	function Wrapper({ children }: { children: React.ReactNode }) {
		return <>{children}</>
	}

	return render(ui, { wrapper: Wrapper, ...options })
}

/**
 * Wait for a specific condition
 */
export function waitFor(
	condition: () => boolean,
	timeout = 1000
): Promise<void> {
	return new Promise((resolve, reject) => {
		const startTime = Date.now()

		const check = () => {
			if (condition()) {
				resolve()
			} else if (Date.now() - startTime > timeout) {
				reject(new Error('Timeout waiting for condition'))
			} else {
				setTimeout(check, 50)
			}
		}

		check()
	})
}

/**
 * Mock API response
 */
export function mockApiResponse<T>(data: T, delay = 0): Promise<T> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(data), delay)
	})
}

/**
 * Mock API error
 */
export function mockApiError(message: string, delay = 0): Promise<never> {
	return new Promise((_, reject) => {
		setTimeout(() => reject(new Error(message)), delay)
	})
}

/**
 * Create mock data
 */
export function createMockData<T>(
	template: Partial<T>,
	count: number
): Array<T & { id: string }> {
	return Array.from({ length: count }, (_, index) => ({
		...template,
		id: `mock-${index + 1}`,
	})) as Array<T & { id: string }>
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
