import { Page } from "@/components/ui/page";
import { ComponentSection } from "@/components/features/docs/component-card";
import {
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
    title: "Checkbox",
    href: "/components/ui/checkbox",
    description:
      "A control that allows the user to toggle between checked and unchecked states with indeterminate support.",
    icon: CheckSquare,
  },
  {
    title: "Combobox",
    href: "/components/ui/combobox",
    description:
      "An input with autocomplete functionality for searching and selecting from a list of options.",
    icon: Search,
  },
  {
    title: "Field",
    href: "/components/ui/field",
    description:
      "A wrapper component for form inputs with label, description, and error handling.",
    icon: FileText,
  },
  {
    title: "Input",
    href: "/components/ui/input",
    description:
      "A text input field for single-line data entry with validation and accessibility support.",
    icon: Type,
  },
  {
    title: "Label",
    href: "/components/ui/label",
    description:
      "A label component for form controls with proper association and accessibility.",
    icon: Tag,
  },
  {
    title: "Phone Input",
    href: "/components/ui/phone-input",
    description:
      "An international phone number input with country selector, flag display, and E.164 formatting.",
    icon: Phone,
  },
  {
    title: "Select",
    href: "/components/ui/select",
    description:
      "A dropdown control for selecting from a list of options with keyboard navigation.",
    icon: ChevronDown,
  },
  {
    title: "Switch",
    href: "/components/ui/switch",
    description: "A toggle switch for binary choices with clear on/off states.",
    icon: ToggleLeft,
  },
  {
    title: "Tags Input",
    href: "/components/ui/tags-input",
    description:
      "An input for managing multiple tags or values with add, remove, and validation capabilities.",
    icon: Hash,
  },
  {
    title: "Textarea",
    href: "/components/ui/textarea",
    description:
      "A multi-line text input field with auto-resize and character count support.",
    icon: AlignLeft,
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
