// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
    outDir: "docs",
    site: "https://pandoraoyun.github.io/InputForge.Docs",
    trailingSlash: "ignore",
    base: "/InputForge.Docs",
    integrations: [starlight({

        logo: { src: "./src/assets/inputforge.svg", replacesTitle: true},
        favicon: "/favicon.svg",
        components: {
            Sidebar: "./src/components/Navigation.astro",
            PageFrame: "./src/components/PageFrame.astro",
            Header: "./src/components/Header.astro",
            ContentPanel: "./src/components/ContentPanel.astro",
            TwoColumnContent: "./src/components/TwoColumnContent.astro",
            Pagination: "./src/components/Pagination.astro",
        },
        title: 'InputForge',
        social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Pandoraoyun/InputForge' }],
        sidebar: [
            {
                label: "Getting Started",
                items: [
                    { label: "Introduction", slug: "getting-started/introduction" },
                    { label: "Installation", slug: "getting-started/installation" },
                    { label: "Quick Start", slug: "getting-started/quick-start" },
                ],
            },
            {
                label: "Concepts",
                items: [
                    { label: "Architecture", slug: "concepts/architecture" },
                    { label: "Context Stack", slug: "concepts/context-stack" },
                ],
            },
            {
                label: "Reference",
                items: [
                    { label: "InputKey", slug: "reference/input-key" },
                    { label: "Modifiers", slug: "reference/modifiers" },
                    { label: "Triggers", slug: "reference/triggers" },
                ],
            },
            {
                label: "Guides",
                items: [
                    { label: "Extending InputForge", slug: "guides/extending" },
                ],
            },
        ],
        customCss: [
        './src/styles/global.css'
        ],
}), markdoc()],

  vite: {
    plugins: [tailwindcss()],
  },
});
