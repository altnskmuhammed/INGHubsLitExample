import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      lines: 85,
      branches: 85,
      functions: 85,
      statements: 85,
    },
  },
});
