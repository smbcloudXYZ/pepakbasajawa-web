import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import remarkMath from 'remark-math'
import remarkDirective from 'remark-directive'
import rehypeKatex from 'rehype-katex'
import remarkEmbeddedMedia from './src/plugins/remark-embedded-media.mjs'
import remarkReadingTime from './src/plugins/remark-reading-time.mjs'
import rehypeCleanup from './src/plugins/rehype-cleanup.mjs'
import rehypeImageProcessor from './src/plugins/rehype-image-processor.mjs'
import rehypeCopyCode from './src/plugins/rehype-copy-code.mjs'
import remarkTOC from './src/plugins/remark-toc.mjs'
import { SITE } from './src/config'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import node from '@astrojs/node'

export default defineConfig({
  site: SITE.website,
  base: '/',

  devToolbar: {
    enabled: false
  },

  output: 'server',

  build: {
    inlineStylesheets: 'auto'
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: false
    },
    remarkPlugins: [remarkMath, remarkDirective, remarkEmbeddedMedia, remarkReadingTime, remarkTOC],
    rehypePlugins: [rehypeKatex, rehypeCleanup, rehypeImageProcessor, rehypeCopyCode]
  },

  integrations: [mdx(), sitemap()],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    },

    build: {
      rollupOptions: {
        output: {
          // Function form so externalised modules (e.g. katex in the SSR
          // server build) are skipped instead of erroring; the client build
          // still gets the vendor chunks where these modules are bundled.
          manualChunks(id) {
            if (id.includes('node_modules/katex')) return 'vendor-katex'
            if (
              id.includes('node_modules/reading-time') ||
              id.includes('node_modules/mdast-util-to-string')
            )
              return 'vendor-utils'
          }
        }
      }
    },

    optimizeDeps: {
      include: ['katex', 'reading-time']
    },

    plugins: [tailwindcss()]
  },

  adapter: node({
    mode: 'middleware'
  })
})
