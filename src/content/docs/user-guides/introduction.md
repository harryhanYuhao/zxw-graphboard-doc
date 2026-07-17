---
title: Introduction
description: What ZXW Graphboard is and what it's for.
---

ZXW Graphboard is an **online editor for ZXW-calculus graphs** that runs entirely in your browser.

## What is ZXW calculus?

ZXW calculus is a diagrammatic language used in quantum computing. A diagram is a graph made of
**vertices** (the generators) connected by **edges**. Each generator has a type, and some carry a
**phase** written as a mathematical expression (typically a multiple of π). Graphs like these are
used to reason about quantum processes, simplification rules, and circuit equivalence.

You do not need a deep background in quantum computing to use the editor — it is, at its core, a
tool for placing shapes on a canvas and connecting them. If you want the mathematical background,
the [ZX-calculus Wikipedia article](https://en.wikipedia.org/wiki/ZX-calculus) is a good starting
point.

## What the editor gives you

- A canvas where you place and move vertices.
- **Eight generator types**: Z spider, X spider, Z box, X box, H box, W node, And gate, and an
  empty node. See [Vertex Types](/user-guides/vertex-types/).
- **Click-to-connect edges**, including fanning one edge out from several source vertices at once.
- **Phase labels** on spiders and boxes, typeset with [KaTeX](https://katex.org/). Type `\pi/2`
  and it renders as π/2.
- **Undo/redo**, copy/cut/paste of whole subgraphs, vertex rotation.
- **Automatic saving** to your browser, plus JSON **export and import** for sharing diagrams.

## Where to go next

1. [Getting Started](/user-guides/getting-started/) — the editor layout and the three editing modes.
2. [Editing Graphs](/user-guides/editing-graphs/) — adding, selecting, moving, and deleting.
3. [Vertex Types](/user-guides/vertex-types/) — the generators and their phases.
4. [Keyboard Shortcuts](/user-guides/keyboard-shortcuts/) — the full key reference.
5. [Saving & Loading](/user-guides/saving-and-loading/) — autosave, export, import.

:::note[Live app]
The deployed editor is at <https://zxwgraphboard.netlify.app>. The
[source code lives on GitHub](https://github.com/harryhanYuhao/graphboard).
:::
