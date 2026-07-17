---
title: Vertex Types
description: The eight ZXW generator types, their appearance, and phase labels.
---

The editor supports **eight vertex types** — the generators of ZXW calculus. Each has a fixed
shape, colour, and role. You pick a type from the vertex-type menu (Add vertex mode) or change an
existing vertex's type from the property panel.

## The generators

| Type | Shape | Colour | Phase label? | Directional? | Notes |
| --- | --- | --- | --- | --- | --- |
| **Z spider** | circle | lime | ✅ | — | The Z generator. |
| **X spider** | circle | rose (red) | ✅ | — | The X generator. |
| **Z box** | square | lime | ✅ | — | Box variant of Z. |
| **X box** | square | rose (red) | ✅ | — | Box variant of X. |
| **H box** | square | yellow | — | — | The Hadamard box. |
| **W node** | triangle | dark slate | — | ✅ | "Copy" generator: one input (top), many outputs (bottom). |
| **And gate** | square | white | — | ✅ | Logical AND; renders an interior `∧` glyph. |
| **Empty node** | dotted circle | — | — | — | A neutral node for diagrams that don't commit to a generator. |

## Phase labels

For the **Z/X spiders and Z/X boxes**, the vertex label is not free-form text — it is a **phase
expression**. An empty label means **phase 0** (the identity).

### Entering phases

Type the expression into the vertex label (double-click the vertex, or use the property panel).
Wrap it in dollar signs to get KaTeX typesetting: `$\pi/2$` renders as π/2 and parses as π/2
radians.

The property panel shows a live preview as you type:

- **Renders** — what the label will look like inside the vertex (KaTeX for `$...$` / `$$...$$`,
  plain text otherwise).
- **Phase** — the parsed value in radians, plus a multiple of π in parentheses. If the expression
  is invalid, a red error message appears.

### Phase grammar (v1, numeric only)

The parser accepts:

- Numbers: `0`, `1`, `3.5`
- π: `\pi`, `π`, `pi`, `PI`
- Operators: `+ - * /` (and the Unicode `− × ÷`)
- Parentheses: `( )`
- Unary `+`/`−`

Examples:

| Input | Parses to |
| --- | --- |
| `$\pi/2$` | ≈ 1.5708 rad (0.5π) |
| `$\pi$` | ≈ 3.1416 rad (1π) |
| `$-\pi/4$` | ≈ −0.7854 rad |
| `0` or empty | 0 rad (identity) |
| `$(\pi + \pi/2) * 2$` | ≈ 9.4248 rad |

:::caution[Free variables are not supported yet]
Typing `\alpha`, `\beta`, `x`, etc. produces an error. Symbolic arithmetic with named variables is
planned for a future version. For now, phases must evaluate to a number.
:::

### Labels on non-spider types

For **H, W, And, and the empty node**, the label is **decoration only** — it is shown as text (or
KaTeX if wrapped in `$...$`) but never parsed as a phase. Use it for annotations if you like.

## Rotation

Every vertex has an optional **rotation** (0–360°), edited from the property panel. Rotation is a
**visual** property: it rotates how the vertex is drawn, but it is **not** part of the graph's
mathematical content and is ignored by any future compute step. Edges that attach to a directional
vertex's top handle follow the rotation, so they stay visually attached as the body spins.

## Adding a new vertex type

:::note[For developers]
The vertex-type table is defined in a single place in the source —
`src/lib/graph/vertex-types.ts` — which the renderer, the type menu, the swatch, and the property
panel all read from. If you want to add or change a generator, that one file is the source of
truth. See [the dev docs](/dev-docs/overview/).
:::

Next: [Keyboard Shortcuts](/user-guides/keyboard-shortcuts/).
