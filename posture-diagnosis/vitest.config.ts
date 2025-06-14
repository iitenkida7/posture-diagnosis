import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules/', 'dist/', 'e2e/'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'e2e/'
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