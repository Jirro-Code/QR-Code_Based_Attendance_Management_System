import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['**/*.test.ts'],
        globals: true,
        globalSetup: ['./test/setup/globalSetup.ts'],
        setupFiles: ['./test/setup/mocks.ts'],
         // Automatically clean up after each test to ensure isolation
        clearMocks: true,
        restoreMocks: true,
         // Ensure tests run sequentially to avoid database conflicts
        pool: 'threads',
        fileParallelism: false,
        isolate: false,
        vmMemoryLimit: 512,
    },
    plugins: [],
})
