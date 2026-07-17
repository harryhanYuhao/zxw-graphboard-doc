# ZXW Graphboard Documentation

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)
This repo provides both the user documentation and developer documentation for the ZXW-graphboard ([source code](https://github.com/Fabrial-Research/zxwgraphboard), [website app](https://zxwgraphboard.netlify.app) ). 
The documentation is built with the [starlight](https://starlight.astro.build/) template of the web framework [astro](https://astro.build).

## 🚀 Program Structure of the Documentation

The structure of this documentation project is as follow

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

All files ending in `md` or `.mdx` under the `src/content/docs/` directory are included in the documentation and exposed as a route based on its file path
A file with path `./src/content/docs/class1/subclass2/example.md` can be accessed via the slug `class1/subclass2/example`. (Recall slug is the ending of the URL).
The home page is defined by `./src/content/docs/index.mdx`.
The sidebar navigation structure is defined in `./astro.config.mjs`.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

### Project meta

Various meta information, such as the title of the project are configured by the file `./astro.config.mjs`.

```astro.config.mjs 
import ...

export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'User Guide',
					items: [
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Developer Doc',
          items: [
						{ label: 'Example Guide', slug: 'guides/example' }, 
          ]
				},
			],
		}),
	],
});
```

### Sidebar Navigation

The sidebar is also configured in the `./astro.config.mjs`. 
Starlight provides many sidebar customisations, but in this project the order of each entry of the sidebar are specified manually.
The articles are divided into two classes, user-guides and dev-docs, which resides in `./src/content/docs/user-guides` and `./src/content/docs/dev-docs` respectively.
The order of the articles are configured manually.

Note only the files in `./src/content/docs/` are rendered. The pathname (i.e., the slug) of a file `./src/content/docs/guides/example.md` is `guides.example`.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 More Customisations

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
