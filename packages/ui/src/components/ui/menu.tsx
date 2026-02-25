"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Menu - Unstyled dropdown component with keyboard navigation
 *
 * @description
 * The Menu displays a dropdown list of actions with full accessibility support.
 * It provides keyboard navigation, focus management, and screen reader compatibility.
 *
 * @features
 * - Click or hover activation
 * - Controlled or uncontrolled state
 * - Checkbox and radio items
 * - Nested submenus
 * - Keyboard navigation (arrow keys, Enter, Escape)
 * - Roving focus pattern
 * - Text-based item matching
 *
 * @example
 * ```tsx
 * // Basic menu
 * <Menu>
 *   <MenuTrigger>Open Menu</MenuTrigger>
 *   <MenuPortal>
 *     <MenuPositioner>
 *       <MenuPopup>
 *         <MenuItem>Item 1</MenuItem>
 *         <MenuItem>Item 2</MenuItem>
 *       </MenuPopup>
 *     </MenuPositioner>
 *   </MenuPortal>
 * </Menu>
 *
 * // Controlled menu
 * const [open, setOpen] = useState(false)
 * <Menu open={open} onOpenChange={setOpen}>
 *   ...
 * </Menu>
 *
 * // With checkbox items
 * <Menu>
 *   <MenuTrigger>Settings</MenuTrigger>
 *   <MenuPortal>
 *     <MenuPositioner>
 *       <MenuPopup>
 *         <MenuCheckboxItem checked={true} onCheckedChange={...}>
 *           Enable notifications
 *         </MenuCheckboxItem>
 *       </MenuPopup>
 *     </MenuPositioner>
 *   </MenuPortal>
 * </Menu>
 * ```
 *
 * @props
 * - `open` / `onOpenChange`: Controlled state management
 * - `defaultOpen`: Initial state for uncontrolled mode
 * - `modal`: Restricts interaction outside menu (default: true)
 * - `loopFocus`: Circular keyboard navigation (default: true)
 * - `highlightItemOnHover`: Hover highlighting (default: true)
 */
const Menu = MenuPrimitive.Root

/**
 * MenuTrigger - Button that opens the menu
 *
 * @description
 * The trigger button that activates the menu. Can be configured for click or hover activation.
 *
 * @props
 * - `openOnHover`: Enable hover activation (boolean)
 * - `delay`: Hover delay in milliseconds (default: 100)
 * - `handle`: External trigger association for detached triggers
 *
 * @example
 * ```tsx
 * // Click trigger (default)
 * <MenuTrigger>Open Menu</MenuTrigger>
 *
 * // Hover trigger
 * <MenuTrigger openOnHover delay={200}>Hover to Open</MenuTrigger>
 *
 * // Detached trigger (advanced)
 * const handle = Menu.createHandle()
 * <MenuTrigger handle={handle}>Open</MenuTrigger>
 * ```
 */
const MenuTrigger = MenuPrimitive.Trigger

/**
 * MenuPortal - DOM positioning layer
 *
 * @description
 * Renders menu content in a portal to handle stacking contexts and positioning.
 * Typically wraps MenuPositioner and MenuPopup.
 */
const MenuPortal = MenuPrimitive.Portal

/**
 * MenuPositioner - Handles popup alignment and positioning
 *
 * @description
 * Controls where the menu popup appears relative to the trigger.
 * Handles collision detection and viewport boundaries.
 *
 * @props
 * - `side`: Placement relative to trigger ("top" | "bottom" | "left" | "right")
 * - `align`: Alignment ("start" | "center" | "end")
 * - `sideOffset`: Distance from trigger in pixels
 * - `collisionAvoidance`: Handle viewport collisions (boolean, default: true)
 *
 * @example
 * ```tsx
 * // Position below, aligned to start
 * <MenuPositioner side="bottom" align="start" sideOffset={4}>
 *   <MenuPopup>...</MenuPopup>
 * </MenuPositioner>
 *
 * // Position above, centered
 * <MenuPositioner side="top" align="center" sideOffset={8}>
 *   <MenuPopup>...</MenuPopup>
 * </MenuPositioner>
 * ```
 */
const MenuPositioner = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.Positioner>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.Positioner>
>((props, ref) => <MenuPrimitive.Positioner ref={ref} {...props} />)
MenuPositioner.displayName = "MenuPositioner"

/**
 * MenuPopup - Container for menu items
 *
 * @description
 * The visible popup container that holds all menu items, groups, and separators.
 * Includes animations for opening/closing transitions.
 *
 * @styling
 * Uses data attributes for state-based styling:
 * - `data-popup-open`: Menu visibility state
 * - `data-side`: Current popup positioning side
 * - `data-starting-style`: Applied during open animation
 * - `data-ending-style`: Applied during close animation
 *
 * @example
 * ```tsx
 * <MenuPopup>
 *   <MenuItem>Action 1</MenuItem>
 *   <MenuSeparator />
 *   <MenuItem>Action 2</MenuItem>
 * </MenuPopup>
 * ```
 */
const MenuPopup = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.Popup>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>
>(({ className, ...props }, ref) => (
	<MenuPrimitive.Popup
		ref={ref}
		className={cn(
			"z-50 min-w-32 overflow-hidden rounded-md border bg-panel p-1 text-fg shadow-md",
			"origin-[var(--transform-origin)] transition-[transform,scale,opacity]",
			"data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
			"data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
			className
		)}
		{...props}
	/>
))
MenuPopup.displayName = "MenuPopup"

/**
 * MenuItem - Individual selectable menu option
 *
 * @description
 * Standard menu item that triggers an action when selected.
 * Supports keyboard navigation and visual feedback.
 *
 * @props
 * - `disabled`: Disables the item (boolean)
 * - `closeOnClick`: Whether to close menu on click (default: true)
 * - `onClick`: Click handler function
 *
 * @styling
 * Data attributes for state-based styling:
 * - `data-highlighted`: Current keyboard focus or hover state
 * - `data-disabled`: Disabled state
 *
 * @example
 * ```tsx
 * <MenuItem onClick={() => console.log('clicked')}>
 *   Action Item
 * </MenuItem>
 *
 * <MenuItem disabled>
 *   Disabled Item
 * </MenuItem>
 *
 * <MenuItem closeOnClick={false}>
 *   Non-dismissing Item
 * </MenuItem>
 * ```
 */
const MenuItem = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
>(({ className, ...props }, ref) => (
	<MenuPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
			"transition-colors",
			"data-[highlighted]:bg-raised data-[highlighted]:text-fg",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	/>
))
MenuItem.displayName = "MenuItem"

/**
 * MenuSeparator - Visual divider between menu items
 *
 * @description
 * A horizontal line that separates groups of related menu items.
 * Use to organize menu content logically.
 *
 * @example
 * ```tsx
 * <MenuItem>Cut</MenuItem>
 * <MenuItem>Copy</MenuItem>
 * <MenuSeparator />
 * <MenuItem>Paste</MenuItem>
 * ```
 */
const MenuSeparator = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<MenuPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-edge", className)}
		{...props}
	/>
))
MenuSeparator.displayName = "MenuSeparator"

/**
 * MenuGroup - Groups related menu items
 *
 * @description
 * Container for grouping related menu items together.
 * Often used with MenuGroupLabel for labeled sections.
 *
 * @example
 * ```tsx
 * <MenuGroup>
 *   <MenuGroupLabel>File Operations</MenuGroupLabel>
 *   <MenuItem>Open</MenuItem>
 *   <MenuItem>Save</MenuItem>
 * </MenuGroup>
 * ```
 */
const MenuGroup = MenuPrimitive.Group

/**
 * MenuGroupLabel - Label for a menu group
 *
 * @description
 * Displays a non-interactive label for a group of related menu items.
 * Provides context for the items within the group.
 *
 * @example
 * ```tsx
 * <MenuGroup>
 *   <MenuGroupLabel>Text Formatting</MenuGroupLabel>
 *   <MenuItem>Bold</MenuItem>
 *   <MenuItem>Italic</MenuItem>
 * </MenuGroup>
 * ```
 */
const MenuGroupLabel = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.GroupLabel>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
	<MenuPrimitive.GroupLabel
		ref={ref}
		className={cn("px-2 py-1.5 text-sm font-semibold", className)}
		{...props}
	/>
))
MenuGroupLabel.displayName = "MenuGroupLabel"

/**
 * MenuRadioGroup - Container for radio menu items
 *
 * @description
 * Groups radio items together for single-selection scenarios.
 * Only one item in the group can be checked at a time.
 *
 * @props
 * - `value`: Currently selected value (controlled)
 * - `onValueChange`: Callback when selection changes
 * - `defaultValue`: Initial value (uncontrolled)
 *
 * @example
 * ```tsx
 * const [alignment, setAlignment] = useState('left')
 * <MenuRadioGroup value={alignment} onValueChange={setAlignment}>
 *   <MenuRadioItem value="left">Left</MenuRadioItem>
 *   <MenuRadioItem value="center">Center</MenuRadioItem>
 *   <MenuRadioItem value="right">Right</MenuRadioItem>
 * </MenuRadioGroup>
 * ```
 */
const MenuRadioGroup = MenuPrimitive.RadioGroup

/**
 * MenuRadioItem - Single-selection radio menu item
 *
 * @description
 * Radio item within a MenuRadioGroup. Only one item in the group can be selected.
 * Shows a filled circle indicator when selected.
 *
 * @props
 * - `value`: The value this radio represents
 * - `disabled`: Disables the item (boolean)
 *
 * @styling
 * Data attributes for state-based styling:
 * - `data-highlighted`: Current keyboard focus or hover state
 * - `data-checked` / `data-unchecked`: Selection state
 * - `data-disabled`: Disabled state
 *
 * @example
 * ```tsx
 * <MenuRadioGroup value={theme} onValueChange={setTheme}>
 *   <MenuRadioItem value="light">Light Theme</MenuRadioItem>
 *   <MenuRadioItem value="dark">Dark Theme</MenuRadioItem>
 *   <MenuRadioItem value="system">System</MenuRadioItem>
 * </MenuRadioGroup>
 * ```
 */
const MenuRadioItem = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<MenuPrimitive.RadioItem
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
			"transition-colors",
			"data-[highlighted]:bg-raised data-[highlighted]:text-fg",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<span className="absolute left-2 flex size-3.5 items-center justify-center">
			<MenuPrimitive.RadioItemIndicator>
				<div className="size-2 rounded-full bg-current" />
			</MenuPrimitive.RadioItemIndicator>
		</span>
		<span className="pl-6">{children}</span>
	</MenuPrimitive.RadioItem>
))
MenuRadioItem.displayName = "MenuRadioItem"

/**
 * MenuCheckboxItem - Toggle-able checkbox menu item
 *
 * @description
 * Checkbox item that can be toggled on/off independently.
 * Multiple checkboxes can be selected simultaneously (unlike radio items).
 * Shows a checkmark indicator when checked.
 *
 * @props
 * - `checked`: Checked state (controlled)
 * - `onCheckedChange`: Callback when checked state changes
 * - `defaultChecked`: Initial checked state (uncontrolled)
 * - `disabled`: Disables the item (boolean)
 * - `closeOnClick`: Whether to close menu on click (default: false for checkboxes)
 *
 * @styling
 * Data attributes for state-based styling:
 * - `data-highlighted`: Current keyboard focus or hover state
 * - `data-checked` / `data-unchecked`: Checked state
 * - `data-disabled`: Disabled state
 *
 * @example
 * ```tsx
 * // Controlled
 * const [notifications, setNotifications] = useState(true)
 * const [darkMode, setDarkMode] = useState(false)
 * <MenuCheckboxItem
 *   checked={notifications}
 *   onCheckedChange={setNotifications}
 * >
 *   Enable Notifications
 * </MenuCheckboxItem>
 * <MenuCheckboxItem
 *   checked={darkMode}
 *   onCheckedChange={setDarkMode}
 * >
 *   Dark Mode
 * </MenuCheckboxItem>
 *
 * // Uncontrolled
 * <MenuCheckboxItem defaultChecked={true}>
 *   Auto-save
 * </MenuCheckboxItem>
 * ```
 */
const MenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
	<MenuPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
			"transition-colors",
			"data-[highlighted]:bg-raised data-[highlighted]:text-fg",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<span className="absolute left-2 flex size-3.5 items-center justify-center">
			<MenuPrimitive.CheckboxItemIndicator>
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
						fill="currentColor"
					/>
				</svg>
			</MenuPrimitive.CheckboxItemIndicator>
		</span>
		<span className="pl-6">{children}</span>
	</MenuPrimitive.CheckboxItem>
))
MenuCheckboxItem.displayName = "MenuCheckboxItem"

/**
 * ADVANCED USAGE PATTERNS
 *
 * @pattern Detached Triggers
 * Create triggers that live outside the Menu Root:
 * ```tsx
 * const handle = Menu.createHandle()
 *
 * function Layout() {
 *   return (
 *     <div>
 *       <MenuTrigger handle={handle}>Open from Header</MenuTrigger>
 *       <Menu>
 *         <MenuPortal>
 *           <MenuPositioner>
 *             <MenuPopup>...</MenuPopup>
 *           </MenuPositioner>
 *         </MenuPortal>
 *       </Menu>
 *     </div>
 *   )
 * }
 * ```
 *
 * @pattern Multiple Triggers with Context
 * Multiple triggers opening the same menu with different contexts:
 * ```tsx
 * function ContextualMenu() {
 *   const [triggerId, setTriggerId] = useState<string | null>(null)
 *
 *   return (
 *     <Menu onOpenChange={(open, triggerId) => {
 *       if (open) setTriggerId(triggerId)
 *     }}>
 *       <MenuTrigger id="user-actions">User Actions</MenuTrigger>
 *       <MenuTrigger id="admin-actions">Admin Actions</MenuTrigger>
 *       <MenuPortal>
 *         <MenuPositioner>
 *           <MenuPopup>
 *             {triggerId === 'user-actions' && (
 *               <>
 *                 <MenuItem>Edit Profile</MenuItem>
 *                 <MenuItem>Settings</MenuItem>
 *               </>
 *             )}
 *             {triggerId === 'admin-actions' && (
 *               <>
 *                 <MenuItem>Manage Users</MenuItem>
 *                 <MenuItem>System Settings</MenuItem>
 *               </>
 *             )}
 *           </MenuPopup>
 *         </MenuPositioner>
 *       </MenuPortal>
 *     </Menu>
 *   )
 * }
 * ```
 *
 * @pattern Non-Modal Menu
 * Allow interaction with page content while menu is open:
 * ```tsx
 * <Menu modal={false}>
 *   <MenuTrigger>Open</MenuTrigger>
 *   <MenuPortal>
 *     <MenuPositioner>
 *       <MenuPopup>...</MenuPopup>
 *     </MenuPositioner>
 *   </MenuPortal>
 * </Menu>
 * ```
 *
 * @pattern Hover Activation
 * Open menu on hover instead of click:
 * ```tsx
 * <Menu>
 *   <MenuTrigger openOnHover delay={200}>Hover Menu</MenuTrigger>
 *   <MenuPortal>
 *     <MenuPositioner>
 *       <MenuPopup>...</MenuPopup>
 *     </MenuPositioner>
 *   </MenuPortal>
 * </Menu>
 * ```
 *
 * @pattern Context Menu
 * Right-click menu implementation:
 * ```tsx
 * const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
 *
 * <div onContextMenu={(e) => {
 *   e.preventDefault()
 *   setContextMenu({ x: e.clientX, y: e.clientY })
 * }}>
 *   Right click here
 * </div>
 *
 * <Menu open={contextMenu !== null} onOpenChange={(open) => {
 *   if (!open) setContextMenu(null)
 * }}>
 *   <MenuPortal>
 *     <MenuPositioner
 *       style={{
 *         position: 'fixed',
 *         left: contextMenu?.x,
 *         top: contextMenu?.y,
 *       }}
 *     >
 *       <MenuPopup>...</MenuPopup>
 *     </MenuPositioner>
 *   </MenuPortal>
 * </Menu>
 * ```
 *
 * BEST PRACTICES:
 *
 * 1. Keep menu items concise and action-oriented
 * 2. Use MenuSeparator to group related actions logically
 * 3. Set closeOnClick={false} for non-dismissing items (checkboxes)
 * 4. Use modal={false} for non-blocking menus
 * 5. Provide visual feedback for disabled items
 * 6. Use keyboard shortcuts alongside menu options
 * 7. Limit nesting depth for better UX (max 2-3 levels)
 * 8. Consider accessibility: proper labels and keyboard navigation
 */

export {
	Menu,
	MenuTrigger,
	MenuPortal,
	MenuPositioner,
	MenuPopup,
	MenuItem,
	MenuSeparator,
	MenuGroup,
	MenuGroupLabel,
	MenuRadioGroup,
	MenuRadioItem,
	MenuCheckboxItem,
}
