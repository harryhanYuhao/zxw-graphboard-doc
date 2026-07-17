---
title: Saving & Loading
description: Autosave, export to JSON, and import from JSON.
---

ZXW Graphboard is a client-side app: there is no server-side storage. Your work is kept in two
ways — **automatic** saving to your browser, and **manual** export/import of JSON files for
sharing and backup.

## Autosave to your browser

As you edit, the graph is **automatically saved** to your browser's `localStorage` about
**2 seconds** after each change. The next time you open the editor (in the same browser), your
diagram is restored exactly as you left it — including vertex positions and rotations.

- The storage key is `graph-board-document`.
- Only the most recent document is kept; there is no history of past saves.
- Clearing your browser data (or site storage) erases the saved graph. Use **export** for anything
  you want to keep long-term.

:::note[Browser storage is per-browser]
The autosave lives in *this* browser on *this* device. It does not sync across devices. To move a
graph to another machine, export it to a file and import it there.
:::

## Save now

`⌘/Ctrl + S`, or the **Save** toolbar button, writes the current graph to `localStorage`
immediately (no file dialog). This is the same mechanism as autosave, just without the 2-second
debounce.

## Export to a JSON file

The **Export** toolbar button (or `⌘/Ctrl+S` is *save* — use the button for export) writes the
graph to a `.json` file on disk:

- On browsers that support the **File System Access API** (Chrome, Edge, and other Chromium
  browsers), you get a native save dialog and can overwrite a previously saved file in place.
- On other browsers (e.g. Firefox, Safari), the file is downloaded via a normal browser download.

The exported file's name is derived from the document title. The file contains the full graph,
with a stable JSON shape described in [the developer docs](/dev-docs/graph-model/) — you can
safely version-control it, diff it, or process it with other tooling.

## Import from a JSON file

The **Import** toolbar button opens a file picker and loads a previously exported graph. The
imported graph **replaces** the current canvas contents.

- If the canvas is not empty, you are asked to confirm before the import wipes it (the action
  cannot be undone).
- The imported document becomes your new local document — its own creation timestamp is preserved,
  but it is saved under the local document's storage key.
- Malformed or future-version files are rejected with a readable error rather than silently loaded.

## Reset

The red **Reset** button (top-right of the toolbar, octagon icon) clears the entire graph — all
nodes, edges, and the title — and saves an empty document. You are asked to confirm first, and
**reset cannot be undone** (it clears the undo history). Use it when you want a genuinely blank
canvas.
