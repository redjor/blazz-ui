/**
 * Button Component Tests
 *
 * Example tests for Button component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen, userEvent } from '@/tests/utils'
import { renderWithProviders } from '@/tests/utils'
import { Button } from './button'

describe('Button', () => {
	describe('Rendering', () => {
		it('renders with children', () => {
			renderWithProviders(<Button>Click me</Button>)
			expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
		})

		it('renders with different variants', () => {
			const { rerender } = renderWithProviders(<Button variant="default">Default</Button>)
			expect(screen.getByRole('button')).toHaveClass('bg-primary')

			rerender(<Button variant="outline">Outline</Button>)
			expect(screen.getByRole('button')).toHaveClass('border-input')

			rerender(<Button variant="ghost">Ghost</Button>)
			expect(screen.getByRole('button')).toHaveClass('hover:bg-muted')
		})

		it('renders with different sizes', () => {
			const { rerender } = renderWithProviders(<Button size="default">Default</Button>)
			expect(screen.getByRole('button')).toHaveClass('h-10')

			rerender(<Button size="sm">Small</Button>)
			expect(screen.getByRole('button')).toHaveClass('h-8')

			rerender(<Button size="lg">Large</Button>)
			expect(screen.getByRole('button')).toHaveClass('h-12')
		})

		it('renders as disabled', () => {
			renderWithProviders(<Button disabled>Disabled</Button>)
			expect(screen.getByRole('button')).toBeDisabled()
			expect(screen.getByRole('button')).toHaveClass('disabled:pointer-events-none')
		})
	})

	describe('Interactions', () => {
		it('calls onClick when clicked', async () => {
			const handleClick = vi.fn()
			const user = userEvent.setup()

			renderWithProviders(<Button onClick={handleClick}>Click me</Button>)

			await user.click(screen.getByRole('button'))
			expect(handleClick).toHaveBeenCalledTimes(1)
		})

		it('does not call onClick when disabled', async () => {
			const handleClick = vi.fn()
			const user = userEvent.setup()

			renderWithProviders(
				<Button onClick={handleClick} disabled>
					Click me
				</Button>
			)

			await user.click(screen.getByRole('button'))
			expect(handleClick).not.toHaveBeenCalled()
		})

		it('has proper keyboard navigation', async () => {
			const handleClick = vi.fn()
			const user = userEvent.setup()

			renderWithProviders(<Button onClick={handleClick}>Click me</Button>)

			const button = screen.getByRole('button')
			button.focus()
			expect(button).toHaveFocus()

			await user.keyboard('{Enter}')
			expect(handleClick).toHaveBeenCalledTimes(1)

			await user.keyboard(' ')
			expect(handleClick).toHaveBeenCalledTimes(2)
		})
	})

	describe('Accessibility', () => {
		it('has proper role', () => {
			renderWithProviders(<Button>Button</Button>)
			expect(screen.getByRole('button')).toBeInTheDocument()
		})

		it('supports aria-label', () => {
			renderWithProviders(<Button aria-label="Custom label">Icon</Button>)
			expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
		})

		it('is keyboard accessible', () => {
			renderWithProviders(<Button>Button</Button>)
			const button = screen.getByRole('button')

			button.focus()
			expect(button).toHaveFocus()
		})

		it('has proper disabled state', () => {
			renderWithProviders(<Button disabled>Disabled</Button>)
			expect(screen.getByRole('button')).toHaveAttribute('disabled')
		})
	})

	describe('Custom Props', () => {
		it('accepts custom className', () => {
			renderWithProviders(<Button className="custom-class">Button</Button>)
			expect(screen.getByRole('button')).toHaveClass('custom-class')
		})

		it('forwards ref', () => {
			const ref = vi.fn()
			renderWithProviders(<Button ref={ref}>Button</Button>)
			expect(ref).toHaveBeenCalled()
		})

		it('accepts data attributes', () => {
			renderWithProviders(<Button data-testid="custom-button">Button</Button>)
			expect(screen.getByTestId('custom-button')).toBeInTheDocument()
		})
	})
})
