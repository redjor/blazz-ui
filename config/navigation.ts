"use client";

import {
  BotMessageSquare,
  FormInput,
  Layers,
  LayoutGrid,
  MousePointerClick,
  Navigation,
  Palette,
  Table2,
  MessageSquare,
} from "lucide-react";
import type { SidebarConfig } from "@/types/navigation";

export const sidebarConfig: SidebarConfig = {
  user: {
    name: "Jean Dupont",
    email: "",
    role: "Administrateur",
  },
  navigation: [
    {
      id: "foundations",
      title: "Foundations",
      items: [
        {
          id: "theming",
          title: "Theming",
          url: "/docs/theming",
          icon: Palette,
        },
      ],
    },
    {
      id: "components",
      title: "Components",
      items: [
        {
          id: "comp-layout",
          title: "Layout and Structure",
          url: "/docs/components/layout",
          icon: LayoutGrid,
          items: [
            { title: "Bleed", url: "/docs/components/layout/bleed" },
            { title: "Block Stack", url: "/docs/components/layout/block-stack" },
            { title: "Box", url: "/docs/components/layout/box" },
            { title: "Callout Card", url: "/docs/components/layout/callout-card" },
            { title: "Card", url: "/docs/components/layout/card" },
            { title: "Divider", url: "/docs/components/layout/divider" },
            { title: "Frame", url: "/docs/components/ui/frame-panel" },
            { title: "Grid", url: "/docs/components/layout/grid" },
            { title: "Inline Grid", url: "/docs/components/layout/inline-grid" },
            { title: "Inline Stack", url: "/docs/components/layout/inline-stack" },
            { title: "Page", url: "/docs/components/layout/page-component" },
          ],
        },
        {
          id: "comp-actions",
          title: "Actions",
          url: "/docs/components/actions",
          icon: MousePointerClick,
          items: [
            { title: "Button", url: "/docs/components/ui/button" },
            { title: "Button Group", url: "/docs/components/ui/button-group" },
            { title: "Dropdown Menu", url: "/docs/components/ui/dropdown-menu" },
          ],
        },
        {
          id: "comp-forms",
          title: "Selection and Input",
          url: "/docs/components/forms",
          icon: FormInput,
          items: [
            { title: "Calendar", url: "/docs/components/ui/calendar" },
            { title: "Checkbox", url: "/docs/components/ui/checkbox" },
            { title: "Date Selector", url: "/docs/components/ui/date-selector" },
            { title: "Input", url: "/docs/components/ui/input" },
            { title: "Phone Input", url: "/docs/components/ui/phone-input" },
            { title: "Select", url: "/docs/components/ui/select" },
            { title: "Switch", url: "/docs/components/ui/switch" },
            { title: "Textarea", url: "/docs/components/ui/textarea" },
          ],
        },
        {
          id: "comp-feedback",
          title: "Feedback Indicators",
          url: "/docs/components/feedback",
          icon: MessageSquare,
          items: [
            { title: "Alert", url: "/docs/components/ui/alert" },
            { title: "Badge", url: "/docs/components/ui/badge" },
            { title: "Banner", url: "/docs/components/ui/banner" },
            { title: "Empty", url: "/docs/components/ui/empty" },
            { title: "Notification Center", url: "/docs/components/ui/notification-center" },
            { title: "Skeleton", url: "/docs/components/ui/skeleton" },
          ],
        },
        {
          id: "comp-overlays",
          title: "Overlays",
          url: "/docs/components/overlays",
          icon: Layers,
          items: [
            { title: "Confirmation Dialog", url: "/docs/components/ui/confirmation-dialog" },
            { title: "Dialog", url: "/docs/components/ui/dialog" },
            { title: "Popover", url: "/docs/components/ui/popover" },
            { title: "Sheet", url: "/docs/components/ui/sheet" },
            { title: "Tooltip", url: "/docs/components/ui/tooltip" },
          ],
        },
        {
          id: "comp-navigation",
          title: "Navigation",
          url: "/docs/components/navigation",
          icon: Navigation,
          items: [
            { title: "Breadcrumb", url: "/docs/components/ui/breadcrumb" },
            { title: "Command", url: "/docs/components/ui/command" },
            { title: "Menu", url: "/docs/components/ui/menu" },
            { title: "Nav Menu", url: "/docs/components/ui/nav-menu" },
            { title: "Org Menu", url: "/docs/components/ui/org-menu" },
            { title: "Tabs", url: "/docs/components/ui/tabs" },
          ],
        },
        {
          id: "comp-data-display",
          title: "Data Display",
          url: "/docs/components/data-display",
          icon: Table2,
          items: [
            { title: "Avatar", url: "/docs/components/ui/avatar" },
            { title: "Cell Types", url: "/docs/components/ui/cells" },
            { title: "Data Table", url: "/docs/components/ui/data-table" },
            { title: "Property", url: "/docs/components/ui/property" },
            { title: "Property Card", url: "/docs/components/ui/property-card" },
            { title: "Stats Strip", url: "/docs/components/ui/stats-strip" },
            { title: "Table", url: "/docs/components/ui/table" },
          ],
        },
        {
          id: "comp-foundations",
          title: "Foundations",
          url: "/docs/components/colors",
          icon: Palette,
          items: [
            { title: "Colors", url: "/docs/components/colors" },
            { title: "Typography", url: "/docs/components/typography" },
            { title: "Text", url: "/docs/components/ui/text" },
          ],
        },
        {
          id: "comp-ai",
          title: "AI Elements",
          url: "/docs/components/ai",
          icon: BotMessageSquare,
          items: [
            { title: "Conversation", url: "/docs/components/ai/conversation" },
            { title: "Message", url: "/docs/components/ai/message" },
            { title: "Prompt Input", url: "/docs/components/ai/prompt-input" },
            { title: "Suggestion", url: "/docs/components/ai/suggestion" },
            { title: "Reasoning", url: "/docs/components/ai/reasoning" },
            { title: "Chain of Thought", url: "/docs/components/ai/chain-of-thought" },
            { title: "Sources", url: "/docs/components/ai/sources" },
            { title: "Inline Citation", url: "/docs/components/ai/inline-citation" },
            { title: "Confirmation", url: "/docs/components/ai/confirmation" },
            { title: "Attachments", url: "/docs/components/ai/attachments" },
            { title: "Model Selector", url: "/docs/components/ai/model-selector" },
            { title: "Context", url: "/docs/components/ai/context" },
            { title: "Shimmer", url: "/docs/components/ai/shimmer" },
            { title: "Generative UI", url: "/docs/components/ai/generative-ui" },
          ],
        },
      ],
    },
  ],
};

// Backward compatibility - export navigationConfig as before
export const navigationConfig = sidebarConfig.navigation;
