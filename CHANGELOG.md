# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Additional component documentation
- More page templates
- Theme builder UI
- Visual regression testing
- CI/CD pipeline templates

## [1.0.0] - 2026-01-19

### Added

#### Core Components (45+ UI Components)
- **Button**: Multiple variants (default, destructive, outline, secondary, ghost, link) and sizes
- **Input**: Text input with validation support
- **Label**: Form labels with proper associations
- **Field**: Form field wrapper with error handling
- **Form**: Form components with react-hook-form integration
- **Card**: Card components with header, content, footer sections
- **Dialog**: Modal dialogs with accessibility support
- **Sheet**: Slide-out panels from all directions
- **Popover**: Floating content containers
- **Dropdown Menu**: Context menus and dropdown actions
- **Select**: Select inputs with search and grouping
- **Checkbox**: Checkbox inputs with indeterminate state
- **Switch**: Toggle switches
- **Radio Group**: Radio button groups
- **Combobox**: Searchable select with autocomplete
- **Alert**: Alert messages with variants (default, destructive)
- **Badge**: Status badges with variants
- **Avatar**: User avatars with fallbacks
- **Separator**: Visual separators
- **Tabs**: Tabbed interfaces
- **Accordion**: Collapsible content sections
- **Alert Dialog**: Confirmation dialogs
- **Context Menu**: Right-click context menus
- **Hover Card**: Hover-triggered content cards
- **Menubar**: Application menubars
- **Navigation Menu**: Complex navigation menus
- **Progress**: Progress indicators
- **Scroll Area**: Custom scrollable areas
- **Skeleton**: Loading skeletons
- **Slider**: Range sliders
- **Sonner**: Toast notifications
- **Table**: Data tables
- **Textarea**: Multi-line text inputs
- **Toast**: Toast notifications
- **Toggle**: Toggle buttons
- **Toggle Group**: Toggle button groups
- **Tooltip**: Hover tooltips
- **Breadcrumb**: Navigation breadcrumbs
- **Calendar**: Date picker calendars
- **Carousel**: Image/content carousels
- **Collapsible**: Collapsible content
- **Command**: Command palette/search
- **Drawer**: Bottom drawer component
- **Input OTP**: One-time password inputs
- **Pagination**: Pagination controls
- **Resizable**: Resizable panels

#### Feature Components
- **DataTable**: Enterprise-grade data table with:
  - Column sorting and filtering
  - Global search
  - Pagination with customizable page sizes
  - Row selection (single and multi)
  - Bulk actions
  - Column visibility toggle
  - Saved views management
  - Custom cell renderers
  - Keyboard navigation
  - Responsive design
  - Export functionality
  - Loading states
- **Command Palette**: Cmd+K searchable command interface
- **Image Upload**: Drag-and-drop image upload with preview
- **Multi Upload**: Multiple file upload component

#### Layout Components
- **Frame**: Application frame layout
- **DashboardLayout**: Complete dashboard layout with sidebar
- **Sidebar**: Collapsible navigation sidebar with:
  - Multi-level navigation
  - Active state management
  - User section
  - Footer section
  - Keyboard shortcuts
- **Navbar**: Top navigation bar
- **Topbar**: Alternative top bar layout
- **Page**: Page component with header and actions

#### Developer Tools
- **CLI Tool** (`scripts/blazz-cli.ts`):
  - `create page <name>` - Generate pages from templates
  - `create component <name>` - Scaffold new components
  - `create crud <entity>` - Generate complete CRUD pages
  - `theme preview` - Display color variables
- **Setup Script** (`scripts/init-project.sh`):
  - Interactive project configuration wizard
  - Automatic .env setup
  - Package.json updates
  - App configuration generation
  - Dependency installation

#### Testing Infrastructure
- **Vitest** configuration with jsdom environment
- **Testing Library** integration for React components
- **Test utilities** (`tests/utils.tsx`):
  - `renderWithProviders()` - Custom render with providers
  - `mockApiResponse()` - Mock API calls
  - `mockApiError()` - Mock API errors
  - `createMockData()` - Generate mock data
- **Global test setup** (`tests/setup.ts`):
  - Browser API mocks (matchMedia, ResizeObserver, IntersectionObserver)
  - localStorage/sessionStorage mocks
  - Automatic cleanup after each test
- **Example test suites**:
  - Button component tests (rendering, interactions, accessibility)
  - Input component tests (validation, controlled/uncontrolled states)

#### Templates
- **Page Templates** (`templates/pages/`):
  - `simple-list.tsx` - Simple list view with cards
  - `data-table-page.tsx` - Complete CRUD page with DataTable
  - `form-page.tsx` - Multi-step form page
  - `dashboard-page.tsx` - Dashboard with metrics and charts
  - `settings-page.tsx` - Settings page with tabs
  - `auth-login.tsx` - Authentication login page
- **Component Patterns** (`templates/components/`):
  - `crud-dialog.tsx` - Reusable create/edit dialog
  - `bulk-actions-bar.tsx` - Bulk actions toolbar
  - `stats-card.tsx` - Statistics card component
  - `filters-panel.tsx` - Reusable filters panel

#### Documentation
- **Component Documentation**: README for each component with:
  - API reference (props, types)
  - Usage examples (3-5 per component)
  - Accessibility notes
  - Styling customization
  - Common patterns
- **Project Documentation** (`docs/`):
  - `ARCHITECTURE.md` - Project architecture and patterns
  - `LLM_GUIDE.md` - Guide for using with Claude Code
  - `MIGRATION_GUIDE.md` - Migration from other UI libraries
  - `COMPONENTS.md` - Component catalog
- **GitHub Templates** (`.github/`):
  - Pull request template with comprehensive checklist
  - Bug report issue template
  - Feature request issue template
  - Documentation improvement template
  - `CONTRIBUTING.md` - Contribution guidelines
- **Main README.md**: Complete project overview with:
  - Quick start guide
  - Installation instructions
  - Project structure
  - Available commands
  - Customization guide

#### LLM Integration
- **Agent**: `blazz-ui-assistant` - Specialized agent for Blazz UI
- **Skills**:
  - `blazz-new-page` - Create new pages
  - `blazz-new-component` - Generate components
  - `blazz-crud-page` - Scaffold CRUD pages
- **LLM Guide**: Complete guide for AI-assisted development

#### Design System
- **Color System**: OKLCh color space for better perceptual uniformity
- **CSS Variables**: Comprehensive design tokens in `globals.css`
- **Dark Mode**: Full dark mode support across all components
- **Typography**: Inter font family with optimized loading
- **Spacing**: Consistent spacing scale using Tailwind
- **Border Radius**: Customizable border radius system
- **Shadows**: Elevation system with CSS variables

#### Configuration
- **App Configuration** (`config/app.config.ts`):
  - Centralized app metadata
  - Navigation configuration
  - Theme settings
  - Feature flags
- **Environment Variables**: `.env.example` template with all variables
- **TypeScript**: Strict mode configuration
- **Path Aliases**: `@/` alias for clean imports

#### Development Tools
- **Storybook 10**: Component development and documentation
- **Biome**: Unified linting and formatting
- **Turbopack**: Fast development server
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **CVA**: Class variance authority for variants
- **TanStack Table**: Powerful table functionality
- **Radix UI**: Accessible component primitives

### Changed

- Updated Next.js to 16.1.1 (canary)
- Updated React to 19.2.3 (RC)
- Upgraded Tailwind CSS to v4
- Moved from ESLint to Biome for better performance
- Restructured components into `/ui`, `/features`, and `/layout` directories
- Improved TypeScript strict mode compliance
- Enhanced accessibility across all components

### Technical Stack

#### Core
- **Next.js**: 16.1.1 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x (strict mode)
- **Tailwind CSS**: 4.0

#### UI & Styling
- **Radix UI**: Accessible component primitives
- **CVA**: Class Variance Authority for variants
- **tailwind-merge**: Utility for merging Tailwind classes
- **Lucide React**: Icon library
- **Recharts**: Charts library

#### Forms & Validation
- **React Hook Form**: 7.54.2
- **Zod**: Schema validation

#### Data Tables
- **TanStack Table**: 8.20.6

#### Development
- **Storybook**: 10.0
- **Vitest**: Testing framework
- **Testing Library**: React testing utilities
- **Biome**: Linting and formatting
- **Turbopack**: Dev server

### Performance

- Optimized bundle size
- Lazy loading for heavy components
- Image optimization with Next.js Image
- CSS variable-based theming for instant theme switching
- Tree-shakable component exports

### Accessibility

- WCAG 2.1 AA compliance across all components
- Keyboard navigation support
- Screen reader friendly
- Focus management
- ARIA attributes
- Color contrast compliance
- Reduced motion support

### Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## [0.1.0] - 2026-01-15

### Added

- Initial project setup
- Basic component structure
- Tailwind CSS configuration
- Next.js App Router setup

## Versioning Strategy

### Version Format: MAJOR.MINOR.PATCH

#### MAJOR (1.x.x)
Breaking changes that require migration:
- Component API changes
- Removed features
- Major architectural changes
- Breaking configuration changes

#### MINOR (x.1.x)
New features and non-breaking changes:
- New components
- New component variants
- New features
- Deprecations (with warnings)

#### PATCH (x.x.1)
Bug fixes and minor improvements:
- Bug fixes
- Documentation updates
- Performance improvements
- Minor style adjustments

### Release Process

1. Update CHANGELOG.md with changes
2. Update version in package.json
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release with changelog

### Deprecation Policy

- Features will be marked as deprecated for at least one minor version
- Deprecation warnings will be logged to console
- Migration guide will be provided
- Breaking changes will only occur in major versions

## Links

- [Repository](https://github.com/your-username/blazz-ui-app)
- [Documentation](https://github.com/your-username/blazz-ui-app/tree/main/docs)
- [Storybook](https://your-storybook-url.com)
- [Issues](https://github.com/your-username/blazz-ui-app/issues)

[Unreleased]: https://github.com/your-username/blazz-ui-app/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-username/blazz-ui-app/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/your-username/blazz-ui-app/releases/tag/v0.1.0
