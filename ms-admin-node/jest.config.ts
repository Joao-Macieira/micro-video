import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  rootDir: './src',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  setupFilesAfterEnv: [
    './shared/infra/testing/expect-helpers.ts'
  ]
};

export default config;
