/**
 * Input Component Tests
 *
 * Example tests for Input component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen, userEvent } from '@/tests/utils'
import { renderWithProviders } from '@/tests/utils'
import { Input } from './input'
import { Label } from './label'

describe('Input', () => {
	describe('Rendering', () => {
		it('renders an input element', () => {
			renderWithProviders(<Input />)
			expect(screen.getByRole('textbox')).toBeInTheDocument()
		})

		it('renders with placeholder', () => {
			renderWithProviders(<Input placeholder="Enter text..." />)
			expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument()
		})

		it('renders with different types', () => {
			const { rerender } = renderWithProviders(<Input type="text" />)
			expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')

			rerender(<Input type="email" />)
			expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

			rerender(<Input type="password" />)
			const passwordInput = document.querySelector('input[type="password"]')
			expect(passwordInput).toBeInTheDocument()
		})

		it('renders as disabled', () => {
			renderWithProviders(<Input disabled />)
			expect(screen.getByRole('textbox')).toBeDisabled()
		})

		it('renders as readonly', () => {
			renderWithProviders(<Input readOnly />)
			expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
		})
	})

	describe('Interactions', () => {
		it('accepts user input', async () => {
			const user = userEvent.setup()
			renderWithProviders(<Input />)

			const input = screen.getByRole('textbox')
			await user.type(input, 'Hello World')

			expect(input).toHaveValue('Hello World')
		})

		it('calls onChange when value changes', async () => {
			const handleChange = vi.fn()
			const user = userEvent.setup()

			renderWithProviders(<Input onChange={handleChange} />)

			await user.type(screen.getByRole('textbox'), 'a')

			expect(handleChange).toHaveBeenCalled()
			expect(handleChange.mock.calls[0][0].target.value).toBe('a')
		})

		it('works with controlled value', async () => {
			const handleChange = vi.fn()
			const user = userEvent.setup()

			const { rerender } = renderWithProviders(
				<Input value="initial" onChange={handleChange} />
			)
			expect(screen.getByRole('textbox')).toHaveValue('initial')

			rerender(<Input value="updated" onChange={handleChange} />)
			expect(screen.getByRole('textbox')).toHaveValue('updated')
		})

		it('does not accept input when disabled', async () => {
			const user = userEvent.setup()
			renderWithProviders(<Input disabled />)

			const input = screen.getByRole('textbox')
			await user.type(input, 'test')

			expect(input).toHaveValue('')
		})

		it('does not accept input when readonly', async () => {
			const user = userEvent.setup()
			renderWithProviders(<Input readOnly value="readonly" />)

			const input = screen.getByRole('textbox')
			await user.type(input, 'test')

			expect(input).toHaveValue('readonly')
		})
	})

	describe('Accessibility', () => {
		it('associates with label via htmlFor', () => {
			renderWithProviders(
				<>
					<Label htmlFor="test-input">Label Text</Label>
					<Input id="test-input" />
				</>
			)

			const input = screen.getByLabelText('Label Text')
			expect(input).toBeInTheDocument()
		})

		it('supports aria-label', () => {
			renderWithProviders(<Input aria-label="Custom label" />)
			expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
		})

		it('supports aria-describedby for error messages', () => {
			renderWithProviders(
				<>
					<Input aria-describedby="error-message" aria-invalid="true" />
					<span id="error-message">Error: Invalid input</span>
				</>
			)

			const input = screen.getByRole('textbox')
			expect(input).toHaveAttribute('aria-invalid', 'true')
			expect(input).toHaveAttribute('aria-describedby', 'error-message')
		})

		it('supports required attribute', () => {
			renderWithProviders(<Input required />)
			expect(screen.getByRole('textbox')).toBeRequired()
		})

		it('is keyboard accessible', () => {
			renderWithProviders(<Input />)
			const input = screen.getByRole('textbox')

			input.focus()
			expect(input).toHaveFocus()
		})
	})

	describe('Validation', () => {
		it('accepts maxLength', async () => {
			const user = userEvent.setup()
			renderWithProviders(<Input maxLength={5} />)

			const input = screen.getByRole('textbox')
			await user.type(input, '123456789')

			expect(input).toHaveValue('12345')
		})

		it('supports pattern validation', () => {
			renderWithProviders(<Input pattern="[0-9]+" />)
			const input = screen.getByRole('textbox')
			expect(input).toHaveAttribute('pattern', '[0-9]+')
		})

		it('supports min/max for number inputs', () => {
			renderWithProviders(<Input type="number" min={0} max={100} />)
			const input = screen.getByRole('spinbutton')
			expect(input).toHaveAttribute('min', '0')
			expect(input).toHaveAttribute('max', '100')
		})
	})

	describe('Custom Props', () => {
		it('accepts custom className', () => {
			renderWithProviders(<Input className="custom-class" />)
			expect(screen.getByRole('textbox')).toHaveClass('custom-class')
		})

		it('forwards ref', () => {
			const ref = vi.fn()
			renderWithProviders(<Input ref={ref} />)
			expect(ref).toHaveBeenCalled()
		})

		it('accepts data attributes', () => {
			renderWithProviders(<Input data-testid="custom-input" />)
			expect(screen.getByTestId('custom-input')).toBeInTheDocument()
		})
	})
})
