---
title: Editing Graphs
description: Adding, selecting, moving, connecting, and deleting vertices and edges.
---

This page covers the day-to-day editing gestures. It assumes you have read
[Getting Started](/user-guides/getting-started/) and know the three modes.

## Vertices

### Adding a vertex

1. Enter **Add vertex** mode (`V` or the toolbar).
2. Pick a type from the vertex-type menu on the left, or press `1`–`8`.
3. Click anywhere on the empty canvas to drop a vertex of that type.

The vertex appears with its type's default appearance. You can keep clicking to add more; you do
not need to re-pick the type each time.

### Selecting

- **Click** a vertex (in *Select* mode) to select it; clicking another replaces the selection.
- **Shift-click** to add to the selection.
- **Cmd/Ctrl-click** also toggles individual vertices into the selection.
- **Shift-drag** on empty canvas draws a box (marquee) selection.
- **Ctrl/Cmd+A** selects everything.
- **Esc** clears the selection (and any pending edge sources).

When **exactly one** vertex is selected, the **property panel** opens on the right. Selecting zero
or more than one vertex hides it.

### Moving

Drag any selected vertex in **Select** mode. Moving a vertex is treated as a single undo step —
the whole drag collapses to one entry on the undo stack, not one per pixel.

### Editing the label

- **Double-click** a vertex body to edit its label inline, **or**
- Use the **Label** field in the property panel.

Commit with `Enter` or by clicking away; cancel with `Esc`. For spider and box types the label is
interpreted as a **phase expression** — see [Vertex Types](/user-guides/vertex-types/).

### Changing type and rotation

The property panel (single selection only) exposes:

- **Type** — a grid of swatches; click to retype the vertex in place.
- **Rotation** — a number box plus a slider (0–360°). Rotation is **visual only**: it rotates the
  drawn body but does not affect the graph-theoretic content. Edges on directional vertices (W,
  And gate) follow the rotation so they still meet the rotated handle.

## Edges

Edges are drawn in **Add edge** mode (`E`). There is **no drag-to-connect** — you connect by
clicking vertices. This keeps clicks precise and avoids accidental edges while moving nodes.

The click vocabulary (inspired by typical connect-tool UX):

| Gesture | Result |
| --- | --- |
| **Click** a vertex | Makes it a pending **source** (the first click). |
| **Click** a second vertex | Draws an edge from every pending source to it, then **clears** the pending list. |
| **Cmd/Ctrl-click** a vertex | Adds it to the pending source list without committing. |
| **Shift-click** a target | Draws the fan-out edges but **keeps** the pending sources, so you can connect the same sources to more targets. |
| **Click** an already-pending vertex | Removes it from the pending list (toggle off). |
| **Click empty canvas** | Cancels the pending source list without drawing anything. |
| **Esc** | Clears pending sources, then selection, then returns to Select mode. |

Pending source vertices glow amber; the selected vertex glows blue. Duplicate edges (same source
and target) are silently skipped.

### Box-select into pending sources

In **Add edge** mode, **Shift-drag** on the canvas draws a marquee. When you release, every vertex
inside the box is swept into the pending source list — handy for fanning one edge out from a whole
region of spiders in a single gesture.

### Directional vertices (W, And gate)

The **W node** and **And gate** are directional: they have one input at the **top** and fan out to
many outputs at the **bottom**. When you draw an edge *to* a directional vertex, it connects to the
top handle automatically. Other vertex types connect at the body centre.

## Clipboard

The toolbar (and standard shortcuts) support cut / copy / paste of **subgraphs**: when you copy a
selection, both the selected vertices and the edges that run *between* them are captured. Edges
with only one endpoint in the selection are dropped, since pasting them would leave dangling
references.

Pasting re-mints all IDs so the pasted subgraph never collides with the originals, and offsets it
slightly each consecutive paste so duplicates don't stack exactly. The clipboard is
**session-only** — it does not survive a page reload.

## Deleting

- **Del / Backspace**, or the **Delete** toolbar button, removes the current selection.
- Deleting a vertex also removes every edge touching it.
- Destructive actions that wipe the canvas (**Reset**, **Import** over a non-empty graph) ask for
  confirmation first.

## Undo and redo

- **Ctrl/Cmd+Z** undo, **Ctrl/Cmd+Shift+Z** (or **Ctrl/Cmd+Y**) redo. Up to 50 steps are kept.
- **Structural** changes (add/delete vertex/edge, label/phase/type edits) are tracked normally.
- **Visual** changes (dragging, selecting, rotating via the slider) are deliberately grouped so
  they don't flood the stack: one drag = one undo step, one slider sweep = one undo step.
- Importing a file, resetting, and hydrating on load all **clear** the undo history.

Next: [Vertex Types](/user-guides/vertex-types/).
