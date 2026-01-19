# Contributing to Blazz UI

Thank you for your interest in contributing to Blazz UI! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Component Guidelines](#component-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Commit Messages](#commit-messages)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

### Our Standards

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 10.0 or later (or yarn/pnpm equivalent)
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/blazz-ui-app.git
cd blazz-ui-app
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/blazz-ui-app.git
```

### Installation

```bash
# Install dependencies
npm install

# Create a .env file (copy from .env.example)
cp .env.example .env

# Run the development server
npm run dev
```

### Verify Your Setup

```bash
# Run linting
npm run lint

# Run tests
npm test

# Build the project
npm run build

# Run Storybook
npm run storybook
```

## Development Workflow

### 1. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed
- Test your changes thoroughly

### 3. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new feature"
```

See [Commit Messages](#commit-messages) for guidelines.

### 4. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Project Structure

```
/blazz-ui-app
├── .claude/                    # LLM configuration
├── .github/                    # GitHub templates
├── app/                        # Next.js App Router
├── components/
│   ├── ui/                    # UI components (45+)
│   ├── features/              # Feature components
│   └── layout/                # Layout components
├── config/                     # Configuration files
├── docs/                       # Documentation
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
├── templates/                  # Code templates
├── tests/                      # Test utilities
└── types/                      # TypeScript types
```

### Key Directories

- **`/components/ui/`**: Primitive UI components (buttons, inputs, etc.)
- **`/components/features/`**: Complex feature components (DataTable, etc.)
- **`/components/layout/`**: Layout components (Frame, Sidebar, etc.)
- **`/hooks/`**: Reusable React hooks
- **`/lib/`**: Utility functions and helpers
- **`/templates/`**: Code templates for pages and components

## Component Guidelines

### Creating a New Component

Use the CLI tool for consistency:

```bash
npm run blazz create component YourComponent
```

Or manually follow these steps:

#### 1. Component Structure

```
/components/ui/your-component/
├── your-component.tsx          # Main component
├── your-component.stories.tsx  # Storybook stories
├── your-component.test.tsx     # Tests
└── YOUR_COMPONENT.README.md    # Documentation
```

#### 2. Component Template

```typescript
/**
 * YourComponent Component
 *
 * Brief description of what this component does
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const yourComponentVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-styles',
        secondary: 'secondary-styles',
      },
      size: {
        sm: 'small-styles',
        md: 'medium-styles',
        lg: 'large-styles',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface YourComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof yourComponentVariants> {
  // Additional props
}

export const YourComponent = React.forwardRef<
  HTMLDivElement,
  YourComponentProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(yourComponentVariants({ variant, size, className }))}
      data-slot="your-component"
      {...props}
    />
  )
})

YourComponent.displayName = 'YourComponent'
```

#### 3. Component Requirements

**Must Have:**
- TypeScript with proper types
- `forwardRef` for ref forwarding
- CVA for variant management
- `data-slot` attribute for styling
- Proper ARIA attributes
- Dark mode support
- Tests
- Storybook story
- README documentation

**Accessibility:**
- Keyboard navigation support
- Screen reader friendly
- ARIA labels/descriptions
- Focus management
- Color contrast compliance

### Component Checklist

- [ ] TypeScript types defined
- [ ] Uses `forwardRef`
- [ ] CVA variants implemented
- [ ] `data-slot` attribute present
- [ ] ARIA attributes correct
- [ ] Dark mode works
- [ ] Tests written and passing
- [ ] Storybook story created
- [ ] README documentation complete
- [ ] Keyboard accessible
- [ ] Screen reader tested

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define proper types for all props
- Avoid `any` type
- Use type inference when possible
- Export types that might be reused

### React

- Use functional components
- Use hooks (no class components)
- Use `forwardRef` for components that receive refs
- Keep components focused and small
- Extract complex logic into hooks

### Styling

- Use Tailwind CSS utility classes
- Use CVA for variant management
- Use CSS variables for theming
- Follow existing color system (OKLCh)
- Ensure dark mode support

### File Naming

- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Tests: `*.test.tsx` or `*.spec.tsx`
- Stories: `*.stories.tsx`
- README: `COMPONENT_NAME.README.md` (uppercase)

### Code Organization

- One component per file
- Group related utilities
- Keep files under 300 lines
- Extract complex logic into separate files

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test button.test.tsx
```

### Writing Tests

Use the testing utilities provided:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { screen, userEvent } from '@/tests/utils'
import { renderWithProviders } from '@/tests/utils'
import { YourComponent } from './your-component'

describe('YourComponent', () => {
  describe('Rendering', () => {
    it('renders correctly', () => {
      renderWithProviders(<YourComponent>Content</YourComponent>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      renderWithProviders(
        <YourComponent onClick={handleClick}>Click me</YourComponent>
      )

      await user.click(screen.getByText('Click me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('is keyboard accessible', () => {
      renderWithProviders(<YourComponent />)
      const element = screen.getByRole('...')

      element.focus()
      expect(element).toHaveFocus()
    })
  })
})
```

### Test Coverage

Aim for:
- Component rendering tests
- Interaction tests (clicks, keyboard, etc.)
- Accessibility tests
- Edge case tests
- Minimum 80% coverage for new components

## Documentation

### Component README

Each component must have a README with:

1. **Description**: What the component does
2. **Usage**: Basic usage example
3. **API**: Props with types and descriptions
4. **Examples**: 3-5 usage examples
5. **Accessibility**: Keyboard navigation, ARIA attributes
6. **Styling**: Customization options

### Code Comments

- Comment complex logic
- Explain non-obvious decisions
- Add JSDoc comments for exported functions
- Keep comments up to date

### Storybook

- Create stories for all variants
- Include interactive controls
- Document props in stories
- Show different states

## Pull Request Process

### Before Submitting

1. **Test your changes**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

2. **Update documentation**:
   - Component README
   - Storybook stories
   - CHANGELOG.md

3. **Create/update tests**:
   - Unit tests pass
   - Coverage maintained or improved

4. **Self-review your code**:
   - Remove console.logs
   - Clean up commented code
   - Check for typos

### PR Description

Use the PR template and include:
- Clear description of changes
- Type of change
- Related issues
- Screenshots (for UI changes)
- Testing notes
- Breaking changes (if any)

### Review Process

1. Automated checks must pass (CI)
2. At least one maintainer approval required
3. All review comments addressed
4. Documentation updated
5. Tests passing

### After Approval

- Maintainers will merge your PR
- Your changes will appear in the next release
- You'll be credited in the CHANGELOG

## Commit Messages

Follow the Conventional Commits specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(button): add loading state

Add a new loading prop to Button component that shows a spinner
and disables interaction while loading.

Closes #123
```

```bash
fix(input): correct focus ring in dark mode

The focus ring was not visible in dark mode due to incorrect
contrast. Updated the ring color to use the correct CSS variable.
```

```bash
docs(datatable): add filtering examples

Add comprehensive examples showing how to implement custom
filtering logic with the DataTable component.
```

### Scope

Use the component or area name:
- `button`, `input`, `dialog`
- `datatable`, `command-palette`
- `docs`, `tests`, `storybook`
- `cli`, `config`

## Community

### Getting Help

- Check existing documentation
- Search existing issues
- Ask in Discussions
- Review closed issues

### Reporting Bugs

Use the bug report template and include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/videos

### Suggesting Features

Use the feature request template and include:
- Problem statement
- Proposed solution
- Use cases
- Examples

### Asking Questions

- Check documentation first
- Use GitHub Discussions
- Be specific and provide context
- Include code examples

## License

By contributing to Blazz UI, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to Blazz UI! Your efforts help make this project better for everyone.
