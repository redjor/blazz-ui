/**
 * DataTable Factories
 *
 * Factory functions for creating reusable column definitions, views, and actions.
 * These factories eliminate boilerplate and provide consistent patterns across tables.
 *
 * @module factories
 */

// Action builders - Create row and bulk actions
export * from "./action-builders"
// Col namespace - Shorthand column builder facade
export { col } from "./col"
// Column builders - Create column definitions with automatic filtering and styling
export * from "./column-builders"
// Editable column builders - Create inline-editable column definitions
export * from "./editable-column-builders"
// Preset builder - Create typed preset configurations
export { definePreset } from "./preset-builder"
// View builders - Create predefined views with filters
export * from "./view-builders"
