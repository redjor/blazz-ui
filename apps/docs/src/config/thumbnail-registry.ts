export type ThumbnailCategory = "ui" | "blocks" | "ai"

export type ThumbnailEntry = {
  slug: string
  category: ThumbnailCategory
  label: string
}

export const thumbnailRegistry: ThumbnailEntry[] = [
  // ---------------------------------------------------------------------------
  // UI Primitives (37)
  // ---------------------------------------------------------------------------
  { slug: "alert", category: "ui", label: "Alert" },
  { slug: "avatar", category: "ui", label: "Avatar" },
  { slug: "badge", category: "ui", label: "Badge" },
  { slug: "banner", category: "ui", label: "Banner" },
  { slug: "breadcrumb", category: "ui", label: "Breadcrumb" },
  { slug: "button", category: "ui", label: "Button" },
  { slug: "button-group", category: "ui", label: "Button Group" },
  { slug: "calendar", category: "ui", label: "Calendar" },
  { slug: "cells", category: "ui", label: "Cells" },
  { slug: "checkbox", category: "ui", label: "Checkbox" },
  { slug: "command", category: "ui", label: "Command" },
  { slug: "confirmation-dialog", category: "ui", label: "Confirmation Dialog" },
  { slug: "data-table", category: "ui", label: "Data Table" },
  { slug: "date-selector", category: "ui", label: "Date Selector" },
  { slug: "dialog", category: "ui", label: "Dialog" },
  { slug: "dropdown-menu", category: "ui", label: "Dropdown Menu" },
  { slug: "empty", category: "ui", label: "Empty" },
  { slug: "frame-panel", category: "ui", label: "Frame Panel" },
  { slug: "input", category: "ui", label: "Input" },
  { slug: "menu", category: "ui", label: "Menu" },
  { slug: "menubar", category: "ui", label: "Menubar" },
  { slug: "nav-menu", category: "ui", label: "Nav Menu" },
  { slug: "notification-center", category: "ui", label: "Notification Center" },
  { slug: "org-menu", category: "ui", label: "Org Menu" },
  { slug: "phone-input", category: "ui", label: "Phone Input" },
  { slug: "popover", category: "ui", label: "Popover" },
  { slug: "property", category: "ui", label: "Property" },
  { slug: "property-card", category: "ui", label: "Property Card" },
  { slug: "select", category: "ui", label: "Select" },
  { slug: "sheet", category: "ui", label: "Sheet" },
  { slug: "skeleton", category: "ui", label: "Skeleton" },
  { slug: "stats-strip", category: "ui", label: "Stats Strip" },
  { slug: "switch", category: "ui", label: "Switch" },
  { slug: "table", category: "ui", label: "Table" },
  { slug: "tabs", category: "ui", label: "Tabs" },
  { slug: "text", category: "ui", label: "Text" },
  { slug: "textarea", category: "ui", label: "Textarea" },
  { slug: "tooltip", category: "ui", label: "Tooltip" },

  // ---------------------------------------------------------------------------
  // Block Components (15)
  // ---------------------------------------------------------------------------
  { slug: "activity-timeline", category: "blocks", label: "Activity Timeline" },
  { slug: "bulk-action-bar", category: "blocks", label: "Bulk Action Bar" },
  { slug: "chart-card", category: "blocks", label: "Chart Card" },
  { slug: "data-grid", category: "blocks", label: "Data Grid" },
  { slug: "detail-panel", category: "blocks", label: "Detail Panel" },
  { slug: "error-state", category: "blocks", label: "Error State" },
  { slug: "field-grid", category: "blocks", label: "Field Grid" },
  { slug: "filter-bar", category: "blocks", label: "Filter Bar" },
  { slug: "form-field", category: "blocks", label: "Form Field" },
  { slug: "form-section", category: "blocks", label: "Form Section" },
  { slug: "multi-step-form", category: "blocks", label: "Multi-Step Form" },
  { slug: "page-header", category: "blocks", label: "Page Header" },
  { slug: "split-view", category: "blocks", label: "Split View" },
  { slug: "stats-grid", category: "blocks", label: "Stats Grid" },
  { slug: "status-flow", category: "blocks", label: "Status Flow" },

  // ---------------------------------------------------------------------------
  // AI Components (46)
  // ---------------------------------------------------------------------------
  // Core chat
  { slug: "ai-conversation", category: "ai", label: "Conversation" },
  { slug: "ai-message", category: "ai", label: "Message" },
  { slug: "ai-prompt-input", category: "ai", label: "Prompt Input" },
  { slug: "ai-suggestion", category: "ai", label: "Suggestion" },

  // Reasoning & sources
  { slug: "ai-reasoning", category: "ai", label: "Reasoning" },
  { slug: "ai-chain-of-thought", category: "ai", label: "Chain of Thought" },
  { slug: "ai-sources", category: "ai", label: "Sources" },
  { slug: "ai-confirmation", category: "ai", label: "Confirmation" },
  { slug: "ai-model-selector", category: "ai", label: "Model Selector" },

  // Metrics & data
  { slug: "ai-metric-card", category: "ai", label: "Metric Card" },
  { slug: "ai-stats-row", category: "ai", label: "Stats Row" },
  { slug: "ai-mini-chart", category: "ai", label: "Mini Chart" },
  { slug: "ai-comparison-table", category: "ai", label: "Comparison Table" },
  { slug: "ai-progress-card", category: "ai", label: "Progress Card" },
  { slug: "ai-data-list", category: "ai", label: "Data List" },
  { slug: "ai-data-grid", category: "ai", label: "Data Grid" },

  // CRM entities
  { slug: "ai-candidate-card", category: "ai", label: "Candidate Card" },
  { slug: "ai-contact-card", category: "ai", label: "Contact Card" },
  { slug: "ai-company-card", category: "ai", label: "Company Card" },
  { slug: "ai-deal-card", category: "ai", label: "Deal Card" },
  { slug: "ai-user-card", category: "ai", label: "User Card" },

  // Activity & workflow
  { slug: "ai-timeline", category: "ai", label: "Timeline" },
  { slug: "ai-event-card", category: "ai", label: "Event Card" },
  { slug: "ai-status-update", category: "ai", label: "Status Update" },
  { slug: "ai-approval-card", category: "ai", label: "Approval Card" },
  { slug: "ai-action-list", category: "ai", label: "Action List" },
  { slug: "ai-poll-card", category: "ai", label: "Poll Card" },

  // Generative UI
  { slug: "ai-email-preview", category: "ai", label: "Email Preview" },
  { slug: "ai-message-preview", category: "ai", label: "Message Preview" },
  { slug: "ai-task-card", category: "ai", label: "Task Card" },
  { slug: "ai-checklist-card", category: "ai", label: "Checklist Card" },
  { slug: "ai-invoice-card", category: "ai", label: "Invoice Card" },
  { slug: "ai-quote-summary", category: "ai", label: "Quote Summary" },
  { slug: "ai-pricing-table", category: "ai", label: "Pricing Table" },
  { slug: "ai-transaction-card", category: "ai", label: "Transaction Card" },
  { slug: "ai-product-card", category: "ai", label: "Product Card" },
  { slug: "ai-calendar-card", category: "ai", label: "Calendar Card" },
  { slug: "ai-availability-card", category: "ai", label: "Availability Card" },
  { slug: "ai-insight-card", category: "ai", label: "Insight Card" },
  { slug: "ai-summary-card", category: "ai", label: "Summary Card" },
  { slug: "ai-rating-card", category: "ai", label: "Rating Card" },
  { slug: "ai-score-card", category: "ai", label: "Score Card" },
  { slug: "ai-location-card", category: "ai", label: "Location Card" },
  { slug: "ai-video-card", category: "ai", label: "Video Card" },

  // Media & links
  { slug: "ai-file-card", category: "ai", label: "File Card" },
  { slug: "ai-link-preview", category: "ai", label: "Link Preview" },
  { slug: "ai-image-gallery", category: "ai", label: "Image Gallery" },
]
