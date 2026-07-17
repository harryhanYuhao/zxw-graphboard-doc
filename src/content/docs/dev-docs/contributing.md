---
title: Contributing
description: Setup, commands, conventions, and gotchas for contributors.
---

This page is the practical guide for working in the graphboard codebase. It complements the
[architecture overview](/dev-docs/overview/) and the
[state](/dev-docs/state-management/) and [graph-model](/dev-docs/graph-model/) references.

## Setup

```bash
git clone https://github.com/harryhanYuhao/graphboard.git
cd graphboard
pnpm install
pnpm dev          # http://localhost:3000
```

The project uses **pnpm** (see `pnpm-workspace.yaml`). Node 20+ is required.

## Commands

| Command | Action |
| --- | --- |
| `pnpm dev` | Next.js dev server (Turbopack) |
| `pnpm build` | Production build into `.next/` |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint (`eslint-config-next`, core-web-vitals + TypeScript) |
| `pnpm test` | Vitest, run once (jsdom env) |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:ui` | Vitest UI |
| `pnpm build:wasm` | Build the Rust crate to WASM (see below) |
| `pnpm ping:wasm` | Smoke-test the WASM pipeline |
| `cd crates/zxw && cargo test` | Native Rust tests for the compute layer |

There is **no dedicated `typecheck` script** — typechecking runs through `pnpm build` and the VS
Code TypeScript SDK (`.vscode/settings.json`).

:::tip[Always run `build:wasm` before `build`]
The production frontend build relies on the WASM artifact in `public/wasm/zxw/`. The dev server
does **not** watch the WASM, so after changing Rust source, rebuild the WASM and refresh the
browser.
:::

## Testing conventions

- Pure-function helpers (operations, serialization, edge-geometry, phase parser, vertex-types,
  shortcuts) and store actions are the primary test surface. Aim to keep new logic pure so it can
  be tested without standing up a store.
- Renderer components have a **thin** test surface — pixel-for-pixel snapshotting of styled bodies
  is intentionally avoided as not worth the maintenance burden.
- Use the shared factories in `src/test-utils/factories.ts` (`makeVertex`, `makeEdge`) in new
  tests, so a future change to `VertexNode` / `GraphEdge` surfaces there rather than in every test
  file.

## Coding conventions

- **Path alias** `@/*` → `src/*`. Prefer it over relative imports for anything outside the same
  directory.
- Any component touching the store, `window`, or React Flow must be a **`"use client"`**
  component (this is an App-Router app).
- **Styling** is Tailwind v4 (config-less). Write utility classes inline. Icons from
  `lucide-react`.
- **IDs** via `nanoid()`.
- **No local component state for graph data.** Read store slices; dispatch actions. (See
  [State Management](/dev-docs/state-management/).)

## Architecture rules that matter for edits

These are the rules most likely to bite a contributor who doesn't know them:

1. **All mutation logic lives in `src/lib/graph/operations.ts`.** Call it from the store, not
   inline in components.
2. **React Flow is controlled.** `nodes`/`edges` come from the store; `onNodesChange` /
   `onEdgesChange` route back via store actions. Don't read graph data from React Flow's
   internals in components — read from the store.
3. **Edges are click-to-connect only.** `nodesConnectable={false}` is deliberate. The click
   dispatch (`computeVertexClick` in `operations.ts`) implements six mutually-exclusive cases;
   re-enabling drag-connect means redesigning that dispatch.
4. **`HANDLE_IDS` is the contract** between operations, the serializer, and the renderer. Never
   inline handle-id string literals — use the constants in `types.ts`. On the persisted side,
   handles are numeric indices (`handleIdToIndex` / `indexToHandleId`); don't break that mapping.
5. **`VERTEX_TYPES` is the single source of truth** for vertex shape/colour/size. Adding or
   changing a generator means editing that one table (and the `isSpiderType` /
   `isDirectionalVertex` predicates if needed) — every consumer picks up the change.
6. **The undo policy has two streams.** Structural changes (add/delete) are tracked normally;
   visual changes (drag, select, slider) are applied with the temporal store paused. Continuous
   gestures must use the `makeGestureController()` pattern (snapshot → pause → resume + inject
   pre-gesture state). See [State Management § gesture controller](/dev-docs/state-management/).
7. **The `graph` / `view` split is load-bearing.** The compute layer (present and future) reads
   only `doc.graph`. Selection, rotation, React Flow `type`/`origin`/`measured`/`internals.*` are
   never persisted. If you add a visual field, it goes in `view`; if you add a graph-theoretic
   field, it goes in `graph`.

## Keep these in sync

Two registries must be updated **together** when their domain changes — there is no compile-time
link between them:

- **Keyboard shortcuts:** `src/lib/keyboard/shortcuts.ts` is a *display-only* registry; the actual
  dispatch is in `src/components/graph-editor/useKeyboardShortcuts.ts`. Adding a shortcut means
  editing both. (The in-app `?` dialog and the user-guide shortcuts page are both generated from
  the registry.)
- **Vertex types:** `VERTEX_TYPES` is consumed by `VertexNode`, `VertexSwatch`,
  `VertexTypeMenu`, and `VertexPropertyPanel`. Changing the table updates all four, but if you add
  a brand-new consumer, make sure it reads from `VERTEX_TYPES` rather than re-declaring shape data.

## Rust / WASM compute layer (Phase 2+)

The crate `crates/zxw/` is the compute boundary. It consumes the `graph` slice of a
`GraphDocument` and returns a tensor result. Same crate, two build targets:

- **Native** — `cargo test -p zxw`, `cargo build -p zxw`. No WASM, no browser. Used by Rust-side
  unit + integration tests.
- **WASM** — `pnpm build:wasm` runs `wasm-pack build crates/zxw --target web --features wasm
  --out-dir public/wasm/zxw`. The Next.js dev server serves the output as a static asset.

When the frontend calls into the WASM it goes through a thin wrapper that lazy-imports
`public/wasm/zxw/zxw.js` and hops the `GraphSlice` through `serde_wasm-bindgen`. The wrapper reads
only `doc.graph`, never `doc.view`.

The full plan and contract live in `doc/plans/zxw-compute-backend.md` — **if you change the
compute boundary, update that plan too.**

## Reporting and contributing back

- Issues and pull requests: <https://github.com/harryhanYuhao/graphboard>.
- This documentation site has its own repo:
  [zxw-graphboard-doc](https://github.com/Fabrial-Research/zxw-graphboard-doc) — doc fixes and
  additions are welcome there.
