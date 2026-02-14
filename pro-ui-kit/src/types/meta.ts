// =============================================================================
// PRO UI KIT — Component Meta Types
// Keep this lean. The goal is discoverability, not taxonomy.
// =============================================================================

/**
 * Context where a component makes sense.
 * Limited set — if you need more than these, you're overcomplicating it.
 */
export type UIContext =
  | "data-management" // CRUD, tables, lists, detail views
  | "dashboard" // KPIs, charts, monitoring
  | "form" // Data entry, multi-step, bulk edit
  | "workflow" // Status flows, validation circuits, steppers
  | "navigation" // Sidebars, breadcrumbs, command palette
  | "layout" // Page structure, split panes, panels
  | "feedback"; // Alerts, toasts, empty states, loading

/**
 * Data complexity level — helps AI understand what patterns to use.
 */
export type DataComplexity = "static" | "simple" | "paginated" | "realtime";

/**
 * Component metadata. Exported as `__meta` from each component file.
 *
 * RULES:
 * - description: 1 sentence max. If you need more, your component does too much.
 * - context: 1-2 values. If it fits everywhere, it's probably a primitive, not a block.
 * - dataShape: TypeScript-like pseudo type. AI uses this to wire data fetching.
 * - requires: other components this one depends on (imports).
 * - example_usage: a SHORT code snippet showing the most common usage.
 */
export interface BlockMeta {
  name: string;
  description: string;
  context: UIContext[];
  dataComplexity: DataComplexity;

  /** Props shape as a readable pseudo-TS type for AI consumption */
  dataShape?: string;

  /** Components this block imports/requires */
  requires?: string[];

  /** Components this block is typically used alongside in a page */
  pairs_with?: string[];

  /** Short code snippet — THE most important field for AI generation */
  example_usage: string;
}

/**
 * Page pattern metadata.
 * Describes a full page archetype that AI can replicate.
 */
export interface PagePatternMeta {
  name: string;
  description: string;
  route_pattern: string;
  layout: string;
  contexts: UIContext[];

  /** Ordered list of sections/blocks that compose this page */
  structure: {
    slot: string;
    component: string;
    required: boolean;
    notes?: string;
  }[];

  /** Data fetching strategy */
  data_strategy: "server-only" | "hybrid" | "client-only";

  /** Must-have features for this page type */
  must_have: string[];

  /** Common mistakes AI makes on this page type */
  ai_pitfalls: string[];
}

/**
 * Layout metadata.
 */
export interface LayoutMeta {
  name: string;
  description: string;
  slots: string[];
  route_pattern: string;
}
