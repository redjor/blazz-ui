"use client";

import {
  BarChart,
  Calendar,
  FileText,
  FormInput,
  Layers,
  LayoutGrid,
  Mail,
  MessageSquare,
  MousePointerClick,
  Navigation,
  Package,
  Settings,
  ShoppingCart,
  Table2,
  Users,
  UserCog,
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
          url: "/products",
          icon: Package,
          items: [
            { title: "Categories", url: "/products/categories" },
            { title: "Collections", url: "/products/collections" },
            { title: "Inventory", url: "/products/inventory" },
          ],
        },
        {
          id: "orders",
          title: "Orders",
          url: "/orders",
          icon: ShoppingCart,
          items: [
            { title: "Pending", url: "/orders/pending" },
            { title: "Fulfilled", url: "/orders/fulfilled" },
            { title: "Archived", url: "/orders/archived" },
          ],
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
          url: "/reports",
          icon: BarChart,
          items: [
            { title: "Sales Report", url: "/reports/sales" },
            { title: "Traffic Analysis", url: "/reports/traffic" },
            { title: "Customer Insights", url: "/reports/customers" },
            { title: "Revenue", url: "/reports/revenue" },
          ],
        },
        {
          id: "calendar",
          title: "Calendar",
          url: "/calendar",
          icon: Calendar,
        },
        {
          id: "documents",
          title: "Documents",
          url: "/documents",
          icon: FileText,
        },
        {
          id: "mail",
          title: "Mail",
          url: "/mail",
          icon: Mail,
          items: [
            { title: "Inbox", url: "/mail/inbox" },
            { title: "Sent", url: "/mail/sent" },
            { title: "Drafts", url: "/mail/drafts" },
            { title: "Starred", url: "/mail/starred" },
            { title: "Trash", url: "/mail/trash" },
          ],
        },
        {
          id: "users",
          title: "Users",
          url: "/users",
          icon: UserCog,
        },
        {
          id: "settings",
          title: "Settings",
          url: "/settings",
          icon: Settings,
          items: [
            { title: "General", url: "/settings" },
            { title: "Profile", url: "/settings/profile" },
            { title: "Billing", url: "/settings/billing" },
            { title: "Notifications", url: "/settings/notifications" },
          ],
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
            { title: "Grid", url: "/components/layout/grid" },
            { title: "Inline Grid", url: "/components/layout/inline-grid" },
            { title: "Inline Stack", url: "/components/layout/inline-stack" },
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
            { title: "Combobox", url: "/components/ui/combobox" },
            { title: "Field", url: "/components/ui/field" },
            { title: "Input", url: "/components/ui/input" },
            { title: "Label", url: "/components/ui/label" },
            { title: "Select", url: "/components/ui/select" },
            { title: "Switch", url: "/components/ui/switch" },
            { title: "Tags Input", url: "/components/ui/tags-input" },
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
            { title: "Table", url: "/components/ui/table" },
          ],
        },
      ],
    },
  ],
};

// Backward compatibility - export navigationConfig as before
export const navigationConfig = sidebarConfig.navigation;
