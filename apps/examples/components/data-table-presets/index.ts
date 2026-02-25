/**
 * DataTable Presets
 *
 * Pre-configured domain-specific table configurations for common use cases.
 * Each preset includes columns, views, actions, and optimized settings.
 *
 * @module presets
 */

// CRM Deals Editable preset - Inline-editable deals table
export * from './crm-deals-editable';

// Order Management preset - Order tracking and fulfillment
export * from './orders';

// User Management preset - User and invitation management
export * from './users';
export * from './invitations';

// CRM Forge presets - Domain-specific table configurations for Forge CRM
export * from './crm-companies';
export * from './crm-contacts';
export * from './crm-deals';
export * from './crm-quotes';
export * from './crm-products';

// TalentFlow ATS presets
export * from './talentflow-candidates';
export * from './talentflow-jobs';

// StockBase Inventory presets
export * from './stockbase-inventory';
export * from './stockbase-movements';

// Linear Issues preset - Linear-style issue tracker
export * from './linear-issues';

// Spreadsheet preset - Generic Airtable-style editable table
export * from './spreadsheet';
