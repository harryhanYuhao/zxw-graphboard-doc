---
title: Overview
description: Architecture of the ZXW Graphboard at a glance.
---

This section documents the internals of the ZXW Graphboard app, for contributors. It assumes you
have read the [User Guide](/user-guides/introduction/) and are familiar with what the app does.

The app source lives at **<https://github.com/harryhanYuhao/graphboard>**.

## What it is

A **client-side-only** Next.js app — an online graph editor for ZXW calculus. Users place
vertices, connect them with edges, assign phase labels, and export the graph as JSON. There is
**no backend**: persistence is `localStorage` plus manual file export/import.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Canvas | [`@xyflow/react`](https://reactflow.dev/) (React Flow) v12, controlled mode |
| State | [Zustand](https://github.com/pmndrs/zustand) v5 + [`zundo`](https://github.com/charkour/zundo) for undo/redo |
| Styling | Tailwind CSS v4 (config-less, via `@tailwindcss/postcss`) |
| Math typesetting | [KaTeX](https://katex.org/) |
| Icons | [`lucide-react`](https://lucide.dev/) |
| IDs | [`nanoid`](https://github.com/ai/nanoid) |
| Tests | [Vitest](https://vitest.dev/) (jsdom env) |
| Compute (Phase 2+) | Rust crate `crates/zxw/`, compiled to WASM via `wasm-pack` |
| Package manager | **pnpm** (workspace) |

## Repository layout

```
src/
├── app/                      # Next.js App Router entry (single page → GraphEditor)
├── components/graph-editor/  # All editor UI (canvas, toolbar, nodes, edges, panels)
├── store/
│   ├── graph-store.ts        # Single Zustand store — source of truth
│   └── selectors.ts          # Pure selectors over store state
├── lib/
│   ├── graph/                # Pure graph logic
│   │   ├── types.ts          # Runtime + persisted type definitions
│   │   ├── operations.ts     # Vertex/edge create/delete, click dispatch, clipboard
│   │   ├── serialization.ts  # Document projection/hydration, localStorage, import/export
│   │   ├── vertex-types.ts   # The ZXW generator table (single source of truth)
│   │   └── edge-geometry.ts  # Pure edge endpoint math
│   ├── keyboard/shortcuts.ts # Display-only shortcut registry
│   ├── hooks/useTrackedDraft.ts
│   ├── label/renderLabel.ts  # Label → HTML (KaTeX or plain text)
│   ├── phase/parser.ts       # Phase expression parser (numeric v1)
│   ├── download.ts           # File System Access API + fallback
│   └── filename.ts           # Title → safe filename
└── test-utils/factories.ts   # makeVertex / makeEdge for tests
crates/zxw/                   # Rust compute layer (ZXW tensor evaluation)
doc/plans/zxw-compute-backend.md
scripts/build-wasm.sh         # wasm-pack driver
```

## High-level data flow

```
  ┌──────────────┐   read slices    ┌─────────────────────────┐
  │  Components  │ ◀─────────────── │   useGraphStore (Zustand)│
  │  (React Flow │                  │   + zundo temporal       │
  │   + panels)  │ ── actions ───▶  │   (single source of truth)│
  └──────────────┘                  └───────────┬─────────────┘
         ▲                                      │ calls
         │                                      ▼
         │                          ┌──────────────────────────┐
         │  onNodesChange/          │  src/lib/graph/          │
         │  onEdgesChange           │  operations.ts (pure)    │
         └──────────────────────────┤  serialization.ts        │
                                    └───────────┬──────────────┘
                                                │ project / hydrate
                                                ▼
                                    ┌──────────────────────────┐
                                    │ localStorage + JSON file │
                                    │ (GraphDocument, v1)      │
                                    └──────────────────────────┘
```

Key principle: **components never hold graph data in local state**. They read slices from the
store and dispatch actions; all mutation logic lives in `src/lib/graph/operations.ts` and is
called from the store, not inline in components. React Flow runs in **controlled mode**: `nodes`
and `edges` come from the store, and `onNodesChange`/`onEdgesChange` route back through store
actions.

## Where to go next

- [State Management](/dev-docs/state-management/) — the store, undo/redo policy, the gesture
  controller pattern.
- [Graph Model](/dev-docs/graph-model/) — the `graph`/`view` document split, the runtime ↔
  persisted boundary, handle-id mapping.
- [Contributing](/dev-docs/contributing/) — setup, commands, conventions, and the gotchas to
  know before changing editor behaviour.
