---
title: Graph Model
description: The runtime types, the persisted graph/view document split, and the serialization boundary.
---

This page documents the data model: the runtime objects React Flow consumes, the persisted
document format, and the conversion between them. The source of truth for these types is
`src/lib/graph/types.ts`; the conversion logic is in `src/lib/graph/serialization.ts`.

## Two layers, one model

There are **two representations** of the same graph, kept deliberately separate:

| Layer | Type | Lives in | Contains |
| --- | --- | --- | --- |
| **Runtime** | `VertexNode`, `GraphEdge` | the store + React Flow | Position, React Flow plumbing, `selected`, `rotation` |
| **Persisted** | `GraphDocument` (`{ graph, view }`) | `localStorage` + JSON files | Only stable, meaningful data |

The runtime layer holds React Flow's own object types, with everything the renderer needs at
runtime. The persisted layer is the **contract** that crosses the serialization boundary — and,
in future, the WASM compute boundary. Conversion happens **only** in `serialization.ts`, via two
functions:

- `projectDocument(runtime)` → `GraphDocument` (called from `saveGraphDocument` and
  `exportGraphJson`).
- `hydrateDocument(doc)` → runtime objects (called from `loadGraphDocument` / the store's
  `hydrate` action, and on import).

## Runtime types

```ts
type VertexData = { label: string; vertexType: VertexType };

// React Flow Node, plus a top-level `rotation` field.
type VertexNode = Node<VertexData, "vertex"> & { rotation: number };

type GraphEdge = Edge;  // plain React Flow Edge
```

`rotation` lives **outside `data`** deliberately: it is a visual concern and belongs in the view
slice, not in `VertexData` (which is part of the `graph` slice that the compute layer consumes).

## The persisted document (v1)

```ts
type GraphDocument = {
  schemaVersion: number;        // CURRENT_SCHEMA_VERSION = 1
  id: string;                   // "local-document" | "exported-document"
  title: string;
  graph: GraphSlice;            // graph-theoretic only
  view: ViewSlice;              // visual only
  createdAt: string;
  updatedAt: string;
};
```

The document is **split into two parallel slices**, keyed by the same node/edge ids:

### `graph` — graph-theoretic only

```ts
type GraphSlice = {
  nodes: { id: string; data: VertexData }[];
  edges: { id: string; source: string; target: string;
           sourceHandle?: number; targetHandle?: number }[];
};
```

This is what computation (and any external researcher's tooling) consumes. Nothing visual, nothing
React-Flow-shaped. `sourceHandle` / `targetHandle` are **numeric indices** (0 = top, 1 = bottom),
not React Flow handle-id strings.

### `view` — visual only

```ts
type ViewSlice = {
  nodes: { id: string; position: { x, y }; rotation?: number }[];
  edges: { id: string }[];
};
```

Position and rotation today; future edge curvature, group colours, edge labels go here. The
renderer rebuilds runtime React Flow objects by **joining `graph` + `view` on node/edge id**.

### Why the split?

1. **The WASM boundary is trivial** — `serde` deserializes `graph` directly; it never has to
   touch React Flow types.
2. **Visual changes don't dirty the schema** — React Flow's runtime fields (`measured`,
   `internals.*`, `type`, `origin`) never leak into the document.
3. **Ephemeral state is not persisted** — selection (`selected`) and similar fields are excluded.
   (Pre-split, `selected: true` accidentally survived reloads — a latent bug the split fixes.)

## Handles: runtime ids ↔ persisted indices

React Flow handle ids are centralised in `types.ts`:

```ts
export const HANDLE_IDS = {
  centerSource: "center-source",  // bottom, source-type slot
  centerTarget: "center-target",  // body centre, target-type slot
  top: "top",                     // visible dot, directional target
} as const;
```

These are the **contract** between the edge layer (`createGraphEdge` in `operations.ts`), the
serializer, and the renderer (`VertexNode`, `StraightCenterEdge`). No string literals elsewhere.

On the persisted side, handles become **numeric indices** via `handleIdToIndex` /
`indexToHandleId` in `serialization.ts`:

- `center-source` (bottom) → index `1`
- everything else (`center-target`, `top`) → index `0`
- absent → omitted (hydrator falls back to a per-role default)

Directional vertices (W, And gate) use the `top` handle for incoming edges; `indexToHandleId`
reconstructs the right id at hydration time using the target vertex's `directional` flag.

## Vertex types

```ts
type VertexType = "z" | "empty" | "x" | "w" | "h" | "zbox" | "xbox" | "and";
```

`VERTEX_TYPES` in `src/lib/graph/vertex-types.ts` is the **single source of truth** for each
type's shape, colour, size, default text, glyph, and `directional` flag. Consumers:

- `VertexNode` (renderer), `VertexSwatch`, `VertexTypeMenu`, `VertexPropertyPanel` (UI),
- `createGraphEdge` and `indexToHandleId` (edge routing, via the `directional` flag).

Two predicates gate behaviour:

- `isSpiderType(type)` — `true` for `z`, `x`, `zbox`, `xbox`. The single source of truth for
  "should this label be parsed as a phase?" (see `src/lib/phase/parser.ts`).
- `isDirectionalVertex(type)` — `true` for `w`, `and`. Gates the top-handle layout.

**When adding or changing a vertex type, edit `VERTEX_TYPES` and these two predicates only — every
consumer picks up the change.**

## Labels as phases

For spider/box types (`isSpiderType === true`) the `label` carries the **phase expression**, not a
free-form name. For `empty`, `w`, `h`, `and` the label is decoration only.

- A label wrapped in `$...$` or `$$...$$` is rendered with KaTeX (`src/lib/label/renderLabel.ts`)
  and parsed as a phase (`src/lib/phase/parser.ts`). Anything else renders as plain text.
- An empty label on a spider means **phase 0** (identity).
- Phase grammar (v1, numeric only): numbers, `\pi` / `π` / `pi`, `+ - * /`, parens, unary
  `+`/`−`. Free variables (`\alpha`, …) are **errors** in v1; symbolic arithmetic is Phase 6.

The Rust compute layer (Phase 3+) ports the same grammar so labels parse identically on both sides
of the WASM boundary.

## Parsing and validation

`parseDocument` in `serialization.ts` validates the v1 `{ graph, view }` shape and is shared by
both load paths (`loadGraphDocument` from `localStorage`, `importGraphJson` from a file picker) so
they can't drift in robustness. It returns a discriminated `{ ok, ... }` result rather than
throwing, so callers pick their own failure policy:

- **Load** is *soft*: a corrupt or future-schema document logs a warning and falls back to an
  empty document (never crashes the editor on reload).
- **Import** is *loud*: a bad file surfaces an `alert` to the user.

Forward-incompatible `schemaVersion` values are rejected explicitly rather than silently accepted.
When the document shape changes again, bump `CURRENT_SCHEMA_VERSION` and add a migration step in
both load paths.

## Persistence gotchas

- Auto-save is debounced (~2 s) in `GraphEditor.tsx` after `nodes`/`edges` change.
- `localStorage` key: `graph-board-document`.
- All storage functions guard `typeof window === "undefined"` for SSR safety.
- JSON export (`exportGraphJson` → `download.ts`) prefers the File System Access API
  (`window.showSaveFilePicker`) and falls back to an anchor-download. `filename.ts` sanitizes the
  title into a safe filename.
- Import replaces the whole canvas and (if non-empty) asks for confirmation; it also persists
  immediately so the imported state survives a refresh even before the autosave timer fires. The
  local document always keeps its own id regardless of an imported file's id.

See [Contributing](/dev-docs/contributing/) for the conventions and gotchas that apply when
editing any of this.
