---
title: State Management
description: The Zustand store, the controlled React Flow integration, and the undo/redo policy.
---

All graph state lives in a **single Zustand store**, `useGraphStore` (`src/store/graph-store.ts`).
There is no local component state for graph data. This page documents the store's shape, how
React Flow is wired to it, and the carefully-designed undo/redo policy that is the trickiest part
of the codebase.

## Store shape

The store holds:

- `nodes: VertexNode[]`, `edges: GraphEdge[]` — the runtime React Flow objects (the single source
  of truth the renderer reads).
- `mode: EditorMode` — `"select" | "add-vertex" | "add-edge"`. `setMode` clears pending edge
  sources on every switch except into `add-edge`, where it *auto-promotes* the current selection
  into the pending source list.
- `pendingEdgeSources: string[]` — vertex IDs staged as edge sources in Add edge mode.
- `selectedVertexType`, `title`, `createdAt`, `hasHydrated`.
- `clipboard` — session-scoped, never persisted.
- `confirmDialogue`, `isHelpOpen` — UI flags kept in the store so keyboard and toolbar share one
  source of truth.

Actions are stable references on the store; components subscribe via `useGraphStore((s) => s.x)`
selectors, with `useShallow` for multi-field bundles.

## Controlled React Flow

React Flow runs **controlled**: `nodes`/`edges` come from the store, and the two change handlers
route straight back into store actions:

```ts
onNodesChange: (changes) => applyReactiveFlowChanges({...}),
onEdgesChange: (changes) => applyReactiveFlowChanges({...}),
```

`applyReactiveFlowChanges` (`graph-store.ts`) splits a batch of React Flow changes into two
streams with **different undo policies** — this is the crux of the undo model:

- **Structural** changes (`type === "remove"`) are applied with normal undo tracking, so deleting
  a node is undoable.
- **Visual** changes (position, dimensions, select toggles) are applied with the temporal store
  **paused**, so they never land on the undo stack individually.

The structural stream is applied first so the visual apply sees the post-deletion slice.

:::note[No drag-connect]
`nodesConnectable={false}` is set on the `ReactFlow` component. Edges are created **only** by
clicking vertices in Add edge mode (see `handleVertexClick` → `computeVertexClick` in
`operations.ts`). Don't re-enable drag-connect without redesigning the click dispatch.
:::

## Undo / redo via `zundo`

Undo/redo is provided by [`zundo`](https://github.com/charkour/zundo)'s `temporal` middleware,
wrapped around the store:

```ts
export const useGraphStore = create<GraphStore>()(
  temporal((set, get) => ({ ... }), { partialize, limit: 50 }),
);
```

- `partialize` snapshots only `{ nodes, edges }` — UI flags and the clipboard are excluded from
  history.
- `limit: 50` caps the history to 50 entries.
- The temporal store is accessed as `useGraphStore.temporal` (a separate Zustand store). Toolbar
  undo/redo buttons subscribe to its `pastStates.length` / `futureStates.length` to enable/disable
  themselves.

### The gesture-controller pattern

For **continuous** edits (dragging a vertex, dragging the rotation slider), you do *not* want one
undo entry per intermediate frame. The pattern, implemented in `makeGestureController()`, is:

1. **On gesture start** — capture a pre-gesture snapshot of `{ nodes, edges }`, then
   `temporal.getState().pause()`.
2. **During the gesture** — keep committing to the store (so the canvas updates live); because
   tracking is paused, no history entries are created.
3. **On gesture end** — `resume()`, then manually push the pre-gesture snapshot into
   `pastStates` and clear `futureStates`. Undo therefore restores to the *pre-gesture* state.

Two gesture controllers are instantiated at module scope: `dragGesture` (for
`onNodeDragStart`/`onNodeDragStop`) and `vertexPropertyEditGesture` (for the property panel's
`onVertexPropertyEditStart`/`onVertexPropertyEditEnd`). Each owns its own snapshot so two
overlapping gestures can't trample each other's pre-state. **Future continuous-edit controls
(slider, colour picker, etc.) should reuse this pattern rather than inventing a new one.**

### When history is cleared

`temporal.getState().clear()` is called on:

- `hydrate()` (initial load from `localStorage`),
- `reset()` (the Reset button),
- after applying an import (import replaces the whole graph).

This is intentional — you cannot "undo" back into a graph that was replaced wholesale.

## Selectors

Pure selectors live in `src/store/selectors.ts` (e.g. `selectSelectedNodeIds`, `nodesById`,
`hasSelection`). Two important ones:

- `nodesById(state.nodes)` returns a memoized `Map<id, VertexNode>`. **Use this for per-id
  lookups in selectors**, not `nodes.find(...)` — the `.find` approach made every drag O(n²)
  because the selector runs on every store update for every mounted vertex. `VertexNode` and
  `StraightCenterEdge` both read rotation through `nodesById`.
- Selectors that return primitives (`number`, `string`) re-render the subscriber only when the
  value actually changes — prefer this shape for hot paths.

## Adding a new store action

1. Add the action to the `GraphStore` type.
2. Implement it in the `temporal(...)({ ... })` body. If it mutates `nodes`/`edges`, prefer
   calling a pure helper in `operations.ts` and `set`-ing the result, so the logic is unit-testable
   without standing up a store.
3. If the action is destructive or replaces the graph, decide whether to clear history
   (`useGraphStore.temporal.getState().clear()`).
4. Components pick it up with `const action = useGraphStore((s) => s.action)`.

See [Graph Model](/dev-docs/graph-model/) for the document format and the persistence boundary
these actions ultimately write to.
