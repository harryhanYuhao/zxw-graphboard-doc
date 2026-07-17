---
title: Getting Started
description: The editor layout and the three editing modes.
---

Open the editor at **<https://zxwgraphboard.netlify.app>**. No login is required.

## The editor layout

The editor is a single full-screen canvas with several floating panels:

| Element | Location | Purpose |
| --- | --- | --- |
| **Toolbar** | Top-left | Mode switching, undo/redo, clipboard, save, import/export, reset, help |
| **Vertex-type menu** | Below toolbar (only in *Add vertex* mode) | Pick which generator to place |
| **Property panel** | Top-right (only when one vertex is selected) | Edit a vertex's type, label, and rotation |
| **Canvas** | Centre | Where you place and move vertices and draw edges |
| **MiniMap / Controls** | Bottom-right | Zoom, fit, and an overview of the whole graph |

Everything you draw is **automatically saved** to your browser as you work (see
[Saving & Loading](/user-guides/saving-and-loading/)).

## The three editing modes

The toolbar's left cluster switches between three modes. Each mode changes what clicking on the
canvas does:

### Select — `S`

The default mode. Click a vertex or edge to select it; drag a selected vertex to move it. This is
the only mode in which you can move things around. Double-click a vertex body to edit its label
inline.

### Add vertex — `V`

Click anywhere on the canvas to drop a new vertex of the currently selected type. The
**vertex-type menu** appears on the left so you can choose which generator to place (or press
`1`–`8` to pick by index). You cannot move vertices in this mode.

### Add edge — `E`

Click vertices to connect them. See [Editing Graphs § Edges](/user-guides/editing-graphs/#edges)
for the full click/shift-click/cmd-click vocabulary — this mode is the most feature-rich.

:::tip[Switching modes resets edge work-in-progress]
Switching *into* **Add edge** mode auto-promotes any currently-selected vertices into the
pending edge-source list, so you can select first, then switch. Switching *out* of **Add edge**
discards the pending list.
:::

## A quick tour

Try this to get a feel for the editor:

1. Press `V` (or click the **Add vertex** button), then press `1` to select the **Z spider**.
2. Click three times on the canvas to drop three Z spiders.
3. Press `E` to enter **Add edge** mode.
4. Click the first spider, then the second, then the third — each click after the first draws an
   edge from every pending source to the clicked target.
5. Press `S`, click a spider, and use the **property panel** on the right to set its label to
   `\pi/2` (it will typeset as π/2).
6. Press `Ctrl+S` (or `⌘S` on macOS) to save.

Next: [Editing Graphs](/user-guides/editing-graphs/).
