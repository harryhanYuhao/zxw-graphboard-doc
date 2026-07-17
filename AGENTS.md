## Project purpose

This repo is the documentation site for **ZXW Graphboard** (source: https://github.com/Fabrial-Research/zxwgraphboard, app: https://zxwgraphboard.netlify.app). It hosts **both** the user guide and the developer docs in one Starlight site. Built with [Astro](https://astro.build) + [@astrojs/starlight](https://starlight.astro.build). Package manager is **pnpm**.

## Content layout

All docs live under `src/content/docs/` as `.md` / `.mdx`. A file's URL slug is derived from its path: `src/content/docs/user-guides/introduction.md` → slug `user-guides/introduction`.

Content is split into two top-level groups — keep new files in the matching group:

- `src/content/docs/user-guides/` — end-user guide
- `src/content/docs/dev-docs/` — developer documentation
- `src/content/docs/index.mdx` — the home page

The Starlight content collection is configured in `src/content.config.ts` (uses `docsLoader()` + `docsSchema()`). Do not hand-roll a separate collection for docs.

### Sidebar

The sidebar is **not** auto-generated. It is configured manually in `astro.config.mjs` under `starlight({ sidebar: [...] })`, with two groups (`User Guide`, `Developer Docs`). When you add or move a page, you must also add/update its entry in `astro.config.mjs` or it will not appear in navigation.

### Assets

Images for docs go in `src/assets/` and are referenced by relative path in Markdown. Static files (favicon, etc.) go in `public/`.

## Commands

Run from the repo root with pnpm:

- `pnpm install` — install deps
- `pnpm dev` — dev server at `localhost:4321`
- `pnpm build` — production build to `./dist/`
- `pnpm preview` — preview the built site
- `pnpm astro check` — typecheck `.astro` files (uses `astro/tsconfigs/strict` via `tsconfig.json`)

There is no separate lint or test script.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
