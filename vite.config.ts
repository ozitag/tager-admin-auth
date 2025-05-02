import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createHtmlPlugin } from 'vite-plugin-html'

// @ts-ignore
import config from './config.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), vueJsx(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: config.pageTitle || 'TAGER Auth',
          bodyColor: config.theme === 'light' ? '#f1f1f1' : '#000'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: config?.basePath || '/'
})
