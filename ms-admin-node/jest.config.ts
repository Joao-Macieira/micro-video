import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  rootDir: './src',
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  setupFilesAfterEnv: [
    './shared/infra/testing/expect-helpers.ts'
  ],
  coverageDirectory: '../.coverage',
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
