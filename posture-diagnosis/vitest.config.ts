import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ]
    },
    // テスト実行時にTensorFlow.jsのワーニングを抑制
    silent: false,
    testTimeout: 10000
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})