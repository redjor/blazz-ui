import type { Registry } from "./registry"

export const registry: Registry = [
	// -----------------------------------------------------------------------
	// 1. Button
	// -----------------------------------------------------------------------
	{
		name: "Button",
		slug: "button",
		category: "ui",
		importPath: "@blazz/ui/components/ui/button",
		props: [
			{
				name: "variant",
				type: "enum",
				options: [
					"default",
					"outline",
					"secondary",
					"ghost",
					"destructive",
					"link",
				],
				default: "default",
				group: "main",
				description: "Visual style of the button",
			},
			{
				name: "size",
				type: "enum",
				options: [
					"default",
					"xs",
					"sm",
					"lg",
					"icon",
					"icon-xs",
					"icon-sm",
					"icon-lg",
				],
				default: "default",
				group: "main",
				description: "Size of the button",
			},
			{
				name: "disabled",
				type: "boolean",
				default: false,
				group: "main",
				description: "Whether the button is disabled",
			},
			{
				name: "children",
				type: "slot",
				group: "slots",
				description: "Button content",
			},
			{
				name: "className",
				type: "string",
				group: "style",
				description: "Additional CSS classes",
			},
			{
				name: "onClick",
				type: "function",
				group: "callbacks",
				description: "Click event handler",
			},
		],
		defaultCode: `<Button variant="default" size="default">Click me</Button>`,
		examples: [
			{
				name: "All variants",
				code: `<div className="flex flex-wrap gap-2">
  <Button variant="default">Default</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="link">Link</Button>
</div>`,
			},
			{
				name: "With icon",
				code: `<Button><Plus className="size-4 mr-1" /> Add item</Button>`,
			},
			{
				name: "All sizes",
				code: `<div className="flex flex-wrap items-center gap-2">
  <Button size="xs">Extra Small</Button>
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
</div>`,
			},
		],
	},

	// -----------------------------------------------------------------------
	// 2. Badge
	// -----------------------------------------------------------------------
	{
		name: "Badge",
		slug: "badge",
		category: "ui",
		importPath: "@blazz/ui/components/ui/badge",
		props: [
			{
				name: "variant",
				type: "enum",
				options: [
					"default",
					"secondary",
					"info",
					"success",
					"warning",
					"critical",
					"outline",
				],
				default: "default",
				group: "main",
				description: "Visual style of the badge",
			},
			{
				name: "size",
				type: "enum",
				options: ["xs", "sm", "md"],
				default: "sm",
				group: "main",
				description: "Size of the badge",
			},
			{
				name: "fill",
				type: "enum",
				options: ["subtle", "solid"],
				default: "solid",
				group: "main",
				description: "Fill style — solid or subtle background",
			},
			{
				name: "dot",
				type: "boolean",
				default: false,
				group: "main",
				description: "Show a status dot before the label",
			},
			{
				name: "children",
				type: "slot",
				group: "slots",
				description: "Badge content",
			},
			{
				name: "className",
				type: "string",
				group: "style",
				description: "Additional CSS classes",
			},
			{
				name: "onDismiss",
				type: "function",
				group: "callbacks",
				description: "When provided, shows a dismiss button",
			},
		],
		defaultCode: `<Badge variant="default">Badge</Badge>`,
		examples: [
			{
				name: "All variants",
				code: `<div className="flex flex-wrap gap-2">
  <Badge variant="default">Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="critical">Critical</Badge>
</div>`,
			},
		],
	},

	// -----------------------------------------------------------------------
	// 3. Input
	// -----------------------------------------------------------------------
	{
		name: "Input",
		slug: "input",
		category: "ui",
		importPath: "@blazz/ui/components/ui/input",
		props: [
			{
				name: "placeholder",
				type: "string",
				default: "Type something...",
				group: "main",
				description: "Placeholder text",
			},
			{
				name: "disabled",
				type: "boolean",
				default: false,
				group: "main",
				description: "Whether the input is disabled",
			},
			{
				name: "type",
				type: "enum",
				options: ["text", "email", "password", "number", "url", "tel"],
				default: "text",
				group: "main",
				description: "HTML input type",
			},
			{
				name: "className",
				type: "string",
				group: "style",
				description: "Additional CSS classes",
			},
			{
				name: "onChange",
				type: "function",
				group: "callbacks",
				description: "Change event handler",
			},
		],
		defaultCode: `<Input placeholder="Type something..." />`,
		examples: [
			{
				name: "With label",
				code: `<div className="w-64 space-y-1">
  <label className="text-sm font-medium">Email</label>
  <Input type="email" placeholder="you@example.com" />
</div>`,
			},
			{
				name: "Disabled",
				code: `<Input disabled placeholder="Disabled input" />`,
			},
		],
	},

	// -----------------------------------------------------------------------
	// 4. Switch
	// -----------------------------------------------------------------------
	{
		name: "Switch",
		slug: "switch",
		category: "ui",
		importPath: "@blazz/ui/components/ui/switch",
		props: [
			{
				name: "checked",
				type: "boolean",
				default: false,
				group: "main",
				description: "Whether the switch is on",
			},
			{
				name: "disabled",
				type: "boolean",
				default: false,
				group: "main",
				description: "Whether the switch is disabled",
			},
			{
				name: "size",
				type: "enum",
				options: ["sm", "default"],
				default: "default",
				group: "main",
				description: "Size of the switch",
			},
			{
				name: "onCheckedChange",
				type: "function",
				group: "callbacks",
				description: "Called when the checked state changes",
			},
		],
		defaultCode: `<Switch />`,
		examples: [
			{
				name: "With label",
				code: `<div className="flex items-center gap-2">
  <Switch id="airplane" />
  <label htmlFor="airplane" className="text-sm">Airplane Mode</label>
</div>`,
			},
		],
	},

	// -----------------------------------------------------------------------
	// 5. Checkbox
	// -----------------------------------------------------------------------
	{
		name: "Checkbox",
		slug: "checkbox",
		category: "ui",
		importPath: "@blazz/ui/components/ui/checkbox",
		props: [
			{
				name: "checked",
				type: "boolean",
				default: false,
				group: "main",
				description: "Whether the checkbox is checked",
			},
			{
				name: "disabled",
				type: "boolean",
				default: false,
				group: "main",
				description: "Whether the checkbox is disabled",
			},
			{
				name: "onCheckedChange",
				type: "function",
				group: "callbacks",
				description: "Called when the checked state changes",
			},
		],
		defaultCode: `<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm">Accept terms</label>
</div>`,
		examples: [
			{
				name: "Disabled",
				code: `<div className="flex items-center gap-2">
  <Checkbox id="disabled" disabled />
  <label htmlFor="disabled" className="text-sm text-fg-muted">Disabled option</label>
</div>`,
			},
		],
	},

	// -----------------------------------------------------------------------
	// 6. Slider
	// -----------------------------------------------------------------------
	{
		name: "Slider",
		slug: "slider",
		category: "ui",
		importPath: "@blazz/ui/components/ui/slider",
		props: [
			{
				name: "defaultValue",
				type: "number",
				default: 50,
				group: "main",
				description: "Initial value (uncontrolled)",
			},
			{
				name: "min",
				type: "number",
				default: 0,
				group: "main",
				description: "Minimum value",
			},
			{
				name: "max",
				type: "number",
				default: 100,
				group: "main",
				description: "Maximum value",
			},
			{
				name: "step",
				type: "number",
				default: 1,
				group: "main",
				description: "Step increment",
			},
			{
				name: "disabled",
				type: "boolean",
				default: false,
				group: "main",
				description: "Whether the slider is disabled",
			},
			{
				name: "showValue",
				type: "boolean",
				default: false,
				group: "main",
				description: "Show a label with the current value on the thumb",
			},
			{
				name: "onValueChange",
				type: "function",
				group: "callbacks",
				description: "Called when the value changes",
			},
		],
		defaultCode: `<Slider defaultValue={50} max={100} step={1} />`,
		examples: [
			{
				name: "With value label",
				code: `<Slider defaultValue={75} max={100} step={5} showValue />`,
			},
		],
	},

	// -----------------------------------------------------------------------
	// 7. Card
	// -----------------------------------------------------------------------
	{
		name: "Card",
		slug: "card",
		category: "ui",
		importPath: "@blazz/ui/components/ui/card",
		props: [
			{
				name: "size",
				type: "enum",
				options: ["default", "sm"],
				default: "default",
				group: "main",
				description: "Card size — affects padding and spacing",
			},
			{
				name: "children",
				type: "slot",
				group: "slots",
				description: "Card content — typically CardHeader + CardContent + CardFooter",
			},
			{
				name: "className",
				type: "string",
				group: "style",
				description: "Additional CSS classes",
			},
		],
		defaultCode: `<Card className="w-80">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-fg-muted">Card content area.</p>
  </CardContent>
</Card>`,
		examples: [
			{
				name: "Simple card",
				code: `<Card className="w-80">
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>You have 3 unread messages.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-fg-muted">Check your inbox for details.</p>
  </CardContent>
</Card>`,
			},
		],
	},

	// -----------------------------------------------------------------------
	// 8. Avatar
	// -----------------------------------------------------------------------
	{
		name: "Avatar",
		slug: "avatar",
		category: "ui",
		importPath: "@blazz/ui/components/ui/avatar",
		props: [
			{
				name: "size",
				type: "enum",
				options: ["sm", "default", "lg"],
				default: "default",
				group: "main",
				description: "Avatar size",
			},
			{
				name: "className",
				type: "string",
				group: "style",
				description: "Additional CSS classes",
			},
		],
		defaultCode: `<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
  <AvatarFallback>JR</AvatarFallback>
</Avatar>`,
		examples: [
			{
				name: "Fallback only",
				code: `<Avatar>
  <AvatarFallback>AB</AvatarFallback>
</Avatar>`,
			},
		],
	},

	// -----------------------------------------------------------------------
	// 9. Tabs
	// -----------------------------------------------------------------------
	{
		name: "Tabs",
		slug: "tabs",
		category: "ui",
		importPath: "@blazz/ui/components/ui/tabs",
		props: [
			{
				name: "defaultValue",
				type: "string",
				default: "tab-1",
				group: "main",
				description: "Default active tab value (uncontrolled)",
			},
			{
				name: "orientation",
				type: "enum",
				options: ["horizontal", "vertical"],
				default: "horizontal",
				group: "main",
				description: "Layout direction of the tabs",
			},
			{
				name: "children",
				type: "slot",
				group: "slots",
				description: "TabsList + TabsContent children",
			},
		],
		defaultCode: `<Tabs defaultValue="tab-1">
  <TabsList>
    <TabsTrigger value="tab-1">Account</TabsTrigger>
    <TabsTrigger value="tab-2">Password</TabsTrigger>
    <TabsTrigger value="tab-3">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">
    <p className="text-sm text-fg-muted p-2">Account settings here.</p>
  </TabsContent>
  <TabsContent value="tab-2">
    <p className="text-sm text-fg-muted p-2">Password settings here.</p>
  </TabsContent>
  <TabsContent value="tab-3">
    <p className="text-sm text-fg-muted p-2">General settings here.</p>
  </TabsContent>
</Tabs>`,
		examples: [
			{
				name: "Two tabs",
				code: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p className="text-sm text-fg-muted p-2">Overview content.</p>
  </TabsContent>
  <TabsContent value="details">
    <p className="text-sm text-fg-muted p-2">Detailed information.</p>
  </TabsContent>
</Tabs>`,
			},
		],
	},

	// -----------------------------------------------------------------------
	// 10. Select
	// -----------------------------------------------------------------------
	{
		name: "Select",
		slug: "select",
		category: "ui",
		importPath: "@blazz/ui/components/ui/select",
		props: [
			{
				name: "defaultValue",
				type: "string",
				group: "main",
				description: "Default selected value (uncontrolled)",
			},
			{
				name: "disabled",
				type: "boolean",
				default: false,
				group: "main",
				description: "Whether the select is disabled",
			},
			{
				name: "items",
				type: "array",
				group: "main",
				description:
					"Array of { value, label } objects. REQUIRED — Base UI Select.Value displays raw value without it.",
			},
			{
				name: "children",
				type: "slot",
				group: "slots",
				description:
					"SelectTrigger + SelectContent + SelectItem children",
			},
			{
				name: "onValueChange",
				type: "function",
				group: "callbacks",
				description: "Called when the selected value changes",
			},
		],
		defaultCode: `<Select
  defaultValue="apple"
  items={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ]}
>
  <SelectTrigger>
    <SelectValue placeholder="Pick a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry">Cherry</SelectItem>
  </SelectContent>
</Select>`,
		examples: [
			{
				name: "Disabled",
				code: `<Select
  disabled
  defaultValue="apple"
  items={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ]}
>
  <SelectTrigger>
    <SelectValue placeholder="Pick a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>`,
			},
		],
	},
]
