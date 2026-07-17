// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'ZXW Graphboard Doc',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Fabrial-Research/zxw-graphboard-doc' }],
      sidebar: [
        {
          label: 'User Guide',
          items: [
            { label: 'Introduction', slug: 'user-guides/introduction' },
            { label: 'Getting Started', slug: 'user-guides/getting-started' },
            { label: 'Editing Graphs', slug: 'user-guides/editing-graphs' },
            { label: 'Vertex Types', slug: 'user-guides/vertex-types' },
            { label: 'Keyboard Shortcuts', slug: 'user-guides/keyboard-shortcuts' },
            { label: 'Saving & Loading', slug: 'user-guides/saving-and-loading' },
          ],
        },
        {
          label: 'Developer Docs',
          items: [
            { label: 'Overview', slug: 'dev-docs/overview' },
            { label: 'State Management', slug: 'dev-docs/state-management' },
            { label: 'Graph Model', slug: 'dev-docs/graph-model' },
            { label: 'Contributing', slug: 'dev-docs/contributing' },
          ],
        },
      ],
    }),
  ],
});
