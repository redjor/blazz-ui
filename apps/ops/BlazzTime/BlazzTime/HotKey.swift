import Carbon
import Cocoa

/// Registers a global hotkey (⌥T) that posts a notification to toggle the popover.
/// MenuBarExtra with .window style doesn't support programmatic toggle natively,
/// so this is deferred to a future iteration when NSPopover-based approach is used.
///
/// For V1: the user clicks the menu bar icon. Global shortcut is a V2 feature
/// because MenuBarExtra(.window) doesn't expose the popover for programmatic control.
///
/// Keeping this file as a stub for V2.

// NOTE: To implement global shortcut with MenuBarExtra, we'd need to drop down to
// AppKit's NSStatusItem + NSPopover instead of SwiftUI's MenuBarExtra.
// This is acceptable for V2 since clicking the icon is fast enough for V1.
