---
title: Keyboard Shortcuts
description: The full keyboard reference for the editor.
---

Most actions in the editor have keyboard shortcuts. On macOS the modifier is **⌘**; on Windows
and Linux it is **Ctrl**. You can also open the in-app reference with **`?`**.

## Modes

| Shortcut | Action |
| --- | --- |
| `S` | Switch to **Select** mode |
| `V` | Switch to **Add vertex** mode |
| `E` | Switch to **Add edge** mode |

## Selection

| Shortcut | Action |
| --- | --- |
| `⌘/Ctrl + A` | Select all |
| `Esc` | Clear pending edge sources → clear selection → return to Select mode (each press peels one layer) |

## Edit

| Shortcut | Action |
| --- | --- |
| `Del` | Delete the current selection |
| `⌘/Ctrl + X` | Cut |
| `⌘/Ctrl + C` | Copy |
| `⌘/Ctrl + V` | Paste |
| `⌘/Ctrl + D` | Duplicate the selection |
| `⌘/Ctrl + Z` | Undo |
| `⌘/Ctrl + Shift + Z` | Redo |
| `⌘/Ctrl + Y` | Redo (alternate) |
| `⌘/Ctrl + S` | Save |
| `1`–`8` | Pick a vertex type by index (**Add vertex** mode only) |

## View

| Shortcut | Action |
| --- | --- |
| `F` | Fit the view to all nodes and edges |

## Help

| Shortcut | Action |
| --- | --- |
| `?` | Show the keyboard-shortcuts dialog |

:::tip[The in-app dialog mirrors this page]
The `?` dialog and this page are both generated from the same shortcut registry in the source
(`src/lib/keyboard/shortcuts.ts`). If you add a shortcut in code, it appears in both places.
:::

Next: [Saving & Loading](/user-guides/saving-and-loading/).
