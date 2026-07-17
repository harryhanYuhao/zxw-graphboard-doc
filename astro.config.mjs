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
          ],
        },
        {
          label: 'Developer Docs',
          items: [
            { label: 'Overview', slug: 'dev-docs/overview' }

          ]
        },
      ],
    }),
  ],
});
