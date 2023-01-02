import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createStyleImportPlugin } from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3030,
    proxy: {
      '/api': {
        target: 'https://api.juejin.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  plugins: [
    vue(),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: '@arco-design/web-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `@arco-design/web-vue/es/${name}/style/css.js`
          }
        }
      ]
    })
  ]
})
