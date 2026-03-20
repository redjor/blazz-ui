"use client"

import { Page } from "@blazz/ui/components/ui/page"
import {
	AlignLeft,
	CalendarDays,
	CalendarIcon,
	CheckSquare,
	ChevronDown,
	Circle,
	Clock,
	DollarSign,
	Eye,
	FileText,
	Hash,
	KeyRound,
	Palette,
	Phone,
	Search,
	SlidersHorizontal,
	Star,
	Tag,
	ToggleLeft,
	Type,
	Upload,
} from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

const formComponents = [
	{
		title: "Calendar",
		href: "/docs/components/ui/calendar",
		description: "An inline date calendar built on react-day-picker for standalone date selection.",
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
		title: "Color Picker",
		href: "/docs/components/ui/color-picker",
		description:
			"A color selection component with palette presets, hex input, and opacity control.",
		icon: Palette,
		thumbnail: "color-picker",
	},
	{
		title: "Combobox",
		href: "/docs/components/ui/combobox",
		description:
			"An input with autocomplete functionality for searching and selecting from a list of options.",
		icon: Search,
		thumbnail: "combobox",
	},
	{
		title: "Currency Input",
		href: "/docs/components/ui/currency-input",
		description:
			"A specialized number input with currency symbol, locale-aware formatting, and decimal precision.",
		icon: DollarSign,
		thumbnail: "currency-input",
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
		title: "Field",
		href: "/docs/components/ui/field",
		description: "A wrapper component for form inputs with label, description, and error handling.",
		icon: FileText,
		thumbnail: "form-field",
	},
	{
		title: "File Upload",
		href: "/docs/components/ui/file-upload",
		description: "A drag-and-drop file upload zone with preview, progress, and validation support.",
		icon: Upload,
		thumbnail: "file-upload",
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
		description: "A label component for form controls with proper association and accessibility.",
		icon: Tag,
		thumbnail: "label",
	},
	{
		title: "Number Input",
		href: "/docs/components/ui/number-input",
		description:
			"A numeric input with increment/decrement buttons, min/max range, and step control.",
		icon: Hash,
		thumbnail: "number-input",
	},
	{
		title: "OTP Input",
		href: "/docs/components/ui/otp-input",
		description: "A one-time password input with individual digit slots and auto-advance behavior.",
		icon: KeyRound,
		thumbnail: "otp-input",
	},
	{
		title: "Password Input",
		href: "/docs/components/ui/password-input",
		description: "A text input with show/hide password toggle and optional strength indicator.",
		icon: Eye,
		thumbnail: "password-input",
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
		title: "Radio Group",
		href: "/docs/components/ui/radio-group",
		description: "A set of mutually exclusive options where only one can be selected at a time.",
		icon: Circle,
		thumbnail: "radio-group",
	},
	{
		title: "Rating",
		href: "/docs/components/ui/rating",
		description: "A star-based rating input for collecting user feedback on a numeric scale.",
		icon: Star,
		thumbnail: "rating",
	},
	{
		title: "Search Input",
		href: "/docs/components/ui/search-input",
		description: "A text input with search icon and optional clear button for search interactions.",
		icon: Search,
		thumbnail: "search-input",
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
		title: "Slider",
		href: "/docs/components/ui/slider",
		description: "A range control for selecting a numeric value within a defined min/max range.",
		icon: SlidersHorizontal,
		thumbnail: "slider",
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
		thumbnail: "tags-input",
	},
	{
		title: "Textarea",
		href: "/docs/components/ui/textarea",
		description: "A multi-line text input field with auto-resize and character count support.",
		icon: AlignLeft,
		thumbnail: "textarea",
	},
	{
		title: "Time Picker",
		href: "/docs/components/ui/time-picker",
		description: "A time selection input with hour, minute, and optional AM/PM controls.",
		icon: Clock,
		thumbnail: "time-picker",
	},
]

export default function FormsPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Selection and Input"
				description="Form components enable users to enter data and make selections. They provide clear feedback, validation, and accessibility features to create intuitive data entry experiences."
			/>
			<ComponentSection components={formComponents} />
		</Page>
	)
}
