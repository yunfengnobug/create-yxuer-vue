import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { wrapperEnv } from './build/utils'
import { visualizer } from 'rollup-plugin-visualizer'
import topLevelAwait from 'vite-plugin-top-level-await'
import removeConsole from 'vite-plugin-remove-console'

// https://vite.dev/config/
export default defineConfig((config): any => {
  const env: any = wrapperEnv(loadEnv(config.mode, process.cwd()))
  console.log('当前环境变量：', env)

  const plugins = [
    vue(),
    vueDevTools(),
    removeConsole(), // 生产环境移除 console
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ]
  // 只在生成报告时添加 visualizer 插件
  if (process.env.ANALYZE) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html',
      }),
    )
  }
  return {
    base: env.VITE_BASE_PATH,
    plugins,
    build: {
      rollupOptions: {
        output: {
          // 为不同类型的文件设置输出文件名（带 hash）
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          // 精细化的分包策略
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              // Vue 生态核心库打包在一起（vue、vue-router、pinia 等通常一起使用）
              // 排除 @vueuse、vuelidate 等第三方 Vue 工具库
              if (
                (id.includes('vue') ||
                  id.includes('@vue') ||
                  id.includes('pinia') ||
                  id.includes('vuex')) &&
                !id.includes('@vueuse') &&
                !id.includes('-vue')
              ) {
                return 'vue-core'
              }
              // Element Plus、Ant Design 等 UI 库单独打包
              if (
                id.includes('element-plus') ||
                id.includes('ant-design-vue') ||
                id.includes('@ant-design')
              ) {
                return 'ui-library'
              }
              // 图表库单独打包
              if (id.includes('echarts') || id.includes('chart.js')) {
                return 'charts'
              }
              // 富文本
              if (id.includes('editor')) {
                return 'editor'
              }
              // 其他第三方库统一打包
              return 'vendor'
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      proxy: {
        '/cloudlocal': {
          target: env.VITE_TARGET_URL,
          changeOrigin: true, // 允许跨域
          secure: true, // 使用https
          rewrite: (path: string) => path.replace(/^\/cloudlocal/, ''),
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any) => {
              // 从 proxyReq 中获取实际的目标地址
              const protocol = proxyReq.agent?.protocol || 'http:'
              const host = proxyReq.getHeader('host') || proxyReq.host
              const actualUrl = `${protocol}//${host}${proxyReq.path}`

              console.log(`  实际请求地址: ${actualUrl}`)
            })
          },
        },
        '/clouddev': {
          target: env.VITE_TARGET_URL,
          changeOrigin: true, // 允许跨域
          secure: true, // 使用https
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any) => {
              // 从 proxyReq 中获取实际的目标地址
              const protocol = proxyReq.agent?.protocol || 'http:'
              const host = proxyReq.getHeader('host') || proxyReq.host
              const actualUrl = `${protocol}//${host}${proxyReq.path}`

              console.log(`  实际请求地址: ${actualUrl}`)
            })
          },
        },
        '/cloud': {
          target: env.VITE_TARGET_URL,
          changeOrigin: true, // 允许跨域
          secure: true, // 使用https
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any) => {
              // 从 proxyReq 中获取实际的目标地址
              const protocol = proxyReq.agent?.protocol || 'http:'
              const host = proxyReq.getHeader('host') || proxyReq.host
              const actualUrl = `${protocol}//${host}${proxyReq.path}`

              console.log(`  实际请求地址: ${actualUrl}`)
            })
          },
        },
        '/school-evaluation': {
          target: env.VITE_TARGET_URL,
          changeOrigin: true, // 允许跨域
          secure: true, // 使用https
        },
        '/school-dev': {
          target: env.VITE_TARGET_URL,
          changeOrigin: true, // 允许跨域
          secure: true, // 使用https
        },
      },
    },
  }
})
