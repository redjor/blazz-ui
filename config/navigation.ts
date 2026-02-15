"use client";

import {
  BarChart,
  FormInput,
  Layers,
  LayoutGrid,
  MousePointerClick,
  Navigation,
  Package,
  Palette,
  ShoppingCart,
  Table2,
  TableProperties,
  Type,
  Users,
  UserCog,
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
      id: "pages",
      title: "Page Examples",
      items: [
        {
          id: "products",
          title: "Produits",
          url: "/showcase-products",
          icon: Package,
        },
        {
          id: "editable-table",
          title: "Tableau éditable",
          url: "/showcase-editable-table",
          icon: TableProperties,
        },
        {
          id: "orders",
          title: "Orders",
          url: "/orders",
          icon: ShoppingCart,
        },
        {
          id: "clients",
          title: "Clients",
          url: "/clients",
          icon: Users,
        },
        {
          id: "reports",
          title: "Reports",
          url: "/showcase-reports",
          icon: BarChart,
        },
        {
          id: "users",
          title: "Users",
          url: "/users",
          icon: UserCog,
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
          url: "/components/layout",
          icon: LayoutGrid,
          items: [
            { title: "Bleed", url: "/components/layout/bleed" },
            { title: "Block Stack", url: "/components/layout/block-stack" },
            { title: "Box", url: "/components/layout/box" },
            { title: "Callout Card", url: "/components/layout/callout-card" },
            { title: "Card", url: "/components/layout/card" },
            { title: "Divider", url: "/components/layout/divider" },
            { title: "Frame", url: "/components/ui/frame-panel" },
            { title: "Grid", url: "/components/layout/grid" },
            { title: "Inline Grid", url: "/components/layout/inline-grid" },
            { title: "Inline Stack", url: "/components/layout/inline-stack" },
            { title: "Page", url: "/components/layout/page-component" },
          ],
        },
        {
          id: "comp-actions",
          title: "Actions",
          url: "/components/actions",
          icon: MousePointerClick,
          items: [
            { title: "Button", url: "/components/ui/button" },
            { title: "Button Group", url: "/components/ui/button-group" },
            { title: "Dropdown Menu", url: "/components/ui/dropdown-menu" },
          ],
        },
        {
          id: "comp-forms",
          title: "Selection and Input",
          url: "/components/forms",
          icon: FormInput,
          items: [
            { title: "Checkbox", url: "/components/ui/checkbox" },
            { title: "Input", url: "/components/ui/input" },
            { title: "Phone Input", url: "/components/ui/phone-input" },
            { title: "Select", url: "/components/ui/select" },
            { title: "Switch", url: "/components/ui/switch" },
            { title: "Textarea", url: "/components/ui/textarea" },
          ],
        },
        {
          id: "comp-feedback",
          title: "Feedback Indicators",
          url: "/components/feedback",
          icon: MessageSquare,
          items: [
            { title: "Alert", url: "/components/ui/alert" },
            { title: "Badge", url: "/components/ui/badge" },
            { title: "Banner", url: "/components/feedback/banner" },
            { title: "Skeleton", url: "/components/ui/skeleton" },
          ],
        },
        {
          id: "comp-overlays",
          title: "Overlays",
          url: "/components/overlays",
          icon: Layers,
          items: [
            { title: "Confirmation Dialog", url: "/components/ui/confirmation-dialog" },
            { title: "Dialog", url: "/components/ui/dialog" },
            { title: "Popover", url: "/components/ui/popover" },
            { title: "Sheet", url: "/components/ui/sheet" },
            { title: "Tooltip", url: "/components/ui/tooltip" },
          ],
        },
        {
          id: "comp-navigation",
          title: "Navigation",
          url: "/components/navigation",
          icon: Navigation,
          items: [
            { title: "Breadcrumb", url: "/components/ui/breadcrumb" },
            { title: "Command", url: "/components/ui/command" },
            { title: "Menu", url: "/components/ui/menu" },
            { title: "Tabs", url: "/components/ui/tabs" },
          ],
        },
        {
          id: "comp-data-display",
          title: "Data Display",
          url: "/components/data-display",
          icon: Table2,
          items: [
            { title: "Avatar", url: "/components/ui/avatar" },
            { title: "Data Table", url: "/components/ui/data-table" },
            { title: "Property", url: "/components/ui/property" },
            { title: "Table", url: "/components/ui/table" },
          ],
        },
        {
          id: "comp-foundations",
          title: "Foundations",
          url: "/components/colors",
          icon: Palette,
          items: [
            { title: "Colors", url: "/components/colors" },
            { title: "Typography", url: "/components/typography" },
            { title: "Text", url: "/components/ui/text" },
          ],
        },
      ],
    },
  ],
};

// Backward compatibility - export navigationConfig as before
export const navigationConfig = sidebarConfig.navigation;
