import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/bin.ts',
        'src/bin*/index.ts',
        'src/lib/disk.ts',
        'src/lib/log.ts',
        'src/option.ts',
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 80,
        statements: 95,
      },
    },
    include: ['src/**/*.spec.ts', 'test/scenarios/**/*.spec.ts'],
  },
});
