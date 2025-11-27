import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor-esm'

export default defineConfig({
  plugins: [
    vue(), 
    tailwindcss(),
    monacoEditorPlugin({
      languageWorkers: [
        'editorWorkerService',
        'typescript',
        'css',
        'html',
        'json'
      ],
      customDistPath(_root, buildOutDir, _base) {
        return path.resolve(buildOutDir, 'monacoeditorwork')
      },
    })
  ] as any,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})