import { Page } from "@blazz/ui/components/ui/page";
import { ComponentSection } from "@/components/docs/component-card";
import {
  CalendarDays,
  CalendarIcon,
  CheckSquare,
  Search,
  FileText,
  Type,
  Tag,
  Phone,
  ChevronDown,
  ToggleLeft,
  Hash,
  AlignLeft,
} from "lucide-react";

const formComponents = [
  {
    title: "Calendar",
    href: "/docs/components/ui/calendar",
    description:
      "An inline date calendar built on react-day-picker for standalone date selection.",
    icon: CalendarIcon,
    thumbnail: "calendar",
  },
  {
    title: "Checkbox",
    href: "/docs/components/ui/checkbox",
    description:
      "A control that allows the user to toggle between checked and unchecked states with indeterminate support.",
    icon: CheckSquare,
    thumbnail: "checkbox",
  },
  {
    title: "Date Selector",
    href: "/docs/components/ui/date-selector",
    description:
      "A popover-based date picker for forms with single date and grouped start/end date variants.",
    icon: CalendarDays,
    thumbnail: "date-selector",
  },
  {
    title: "Combobox",
    href: "/docs/components/ui/combobox",
    description:
      "An input with autocomplete functionality for searching and selecting from a list of options.",
    icon: Search,
  },
  {
    title: "Field",
    href: "/docs/components/ui/field",
    description:
      "A wrapper component for form inputs with label, description, and error handling.",
    icon: FileText,
    thumbnail: "form-field",
  },
  {
    title: "Input",
    href: "/docs/components/ui/input",
    description:
      "A text input field for single-line data entry with validation and accessibility support.",
    icon: Type,
    thumbnail: "input",
  },
  {
    title: "Label",
    href: "/docs/components/ui/label",
    description:
      "A label component for form controls with proper association and accessibility.",
    icon: Tag,
  },
  {
    title: "Phone Input",
    href: "/docs/components/ui/phone-input",
    description:
      "An international phone number input with country selector, flag display, and E.164 formatting.",
    icon: Phone,
    thumbnail: "phone-input",
  },
  {
    title: "Select",
    href: "/docs/components/ui/select",
    description:
      "A dropdown control for selecting from a list of options with keyboard navigation.",
    icon: ChevronDown,
    thumbnail: "select",
  },
  {
    title: "Switch",
    href: "/docs/components/ui/switch",
    description: "A toggle switch for binary choices with clear on/off states.",
    icon: ToggleLeft,
    thumbnail: "switch",
  },
  {
    title: "Tags Input",
    href: "/docs/components/ui/tags-input",
    description:
      "An input for managing multiple tags or values with add, remove, and validation capabilities.",
    icon: Hash,
  },
  {
    title: "Textarea",
    href: "/docs/components/ui/textarea",
    description:
      "A multi-line text input field with auto-resize and character count support.",
    icon: AlignLeft,
    thumbnail: "textarea",
  },
];

export default function FormsPage() {
  return (
    <Page
      title="Selection and Input"
      subtitle="Form components enable users to enter data and make selections. They provide clear feedback, validation, and accessibility features to create intuitive data entry experiences."
    >
      <ComponentSection components={formComponents} />
    </Page>
  );
}
